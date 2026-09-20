import Stripe from 'https://esm.sh/stripe@17.7.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async(req)=>{
  const stripe=new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!,{apiVersion:'2025-07-30.basil',httpClient:Stripe.createFetchHttpClient()});
  const signature=req.headers.get('stripe-signature'); const body=await req.text();
  if(!signature) return new Response('missing signature',{status:400});
  const event=await stripe.webhooks.constructEventAsync(body,signature,Deno.env.get('STRIPE_WEBHOOK_SECRET')!);
  const supabase=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  if(event.type==='checkout.session.completed'){
    const session=event.data.object as Stripe.Checkout.Session;
    if(session.client_reference_id){
      const plan=(session.metadata?.plan==='yearly'?'yearly':'monthly');
      await supabase.from('subscriptions').upsert({user_id:session.client_reference_id,status:'active',plan,price:plan==='yearly'?9999:999,current_period_end:new Date(Date.now()+(plan==='yearly'?365:30)*86400000).toISOString()},{onConflict:'user_id'});
    }
  }
  return new Response(JSON.stringify({received:true}),{headers:{'Content-Type':'application/json'}});
});
