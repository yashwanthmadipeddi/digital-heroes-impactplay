import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = { 'Access-Control-Allow-Origin':'*', 'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type' };
const json = (body: unknown, status=200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type':'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const auth = req.headers.get('Authorization');
  if (!auth) return json({ error:'unauthorized' },401);
  const token = auth.replace('Bearer ','');
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return json({ error:'unauthorized' },401);
  const { data: admin } = await supabase.from('profiles').select('role').eq('id',user.id).single();
  if (admin?.role !== 'admin') return json({ error:'forbidden' },403);

  const { draw_id, type='random' } = await req.json();
  const { data: draw } = await supabase.from('draws').select('*').eq('id',draw_id).single();
  if (!draw) return json({ error:'draw not found' },404);

  const numbers: number[] = [];
  while(numbers.length < 5){
    const candidate = Math.floor(Math.random()*45)+1;
    if(!numbers.includes(candidate)) numbers.push(candidate);
  }
  numbers.sort((a,b)=>a-b);
  const simulated = { ...draw, draw_type:type, numbers, status:'simulated', simulation_payload:{ generated_at:new Date().toISOString(), algorithm:type } };
  await supabase.from('draws').update(simulated).eq('id',draw_id);
  return json({ draw: simulated });
});
