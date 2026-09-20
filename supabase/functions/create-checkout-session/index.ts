import Stripe from 'https://esm.sh/stripe@17.7.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const cors = { 'Access-Control-Allow-Origin':'*', 'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type' };
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json'}});

Deno.serve(async(req)=>{
  if(req.method==='OPTIONS') return new Response('ok',{headers:cors});
  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!,{apiVersion:'2025-07-30.basil',httpClient:Stripe.createFetchHttpClient()});
  const supabase=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const auth=req.headers.get('Authorization'); if(!auth)return json({error:'unauthorized'},401);
  const token=auth.replace('Bearer ',''); const {data:{user}}=await supabase.auth.getUser(token); if(!user)return json({error:'unauthorized'},401);
  const {plan}=await req.json();
  if(plan!=='monthly' && plan!=='yearly') return json({error:'invalid plan'},400);
  const amount = plan==='monthly' ? 99900 : 999900;
  const origin=req.headers.get('origin') ?? Deno.env.get('PUBLIC_APP_URL')!;
  const session=await stripe.checkout.sessions.create({mode:'subscription',line_items:[{price_data:{currency:'inr',product_data:{name:`ImpactPlay ${plan}`},unit_amount:amount,recurring:{interval:plan==='monthly'?'month':'year'}},quantity:1}],success_url:`${origin}/dashboard?checkout=success`,cancel_url:`${origin}/?checkout=cancelled`,customer_email:user.email,client_reference_id:user.id,metadata:{plan}});
  return json({url:session.url});
});
