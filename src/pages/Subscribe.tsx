import { Check, CreditCard, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import PageHeader from '../components/PageHeader';
import SectionReveal from '../components/SectionReveal';
import { useAuth } from '../context/AuthContext';
import { isDemoMode, supabase } from '../lib/supabase';
import { loadDemoState, saveDemoState } from '../lib/demoData';

const plans = [
  { id:'monthly', name:'Monthly', price:'₹999', note:'billed monthly', highlight:'Flexible' },
  { id:'yearly', name:'Yearly', price:'₹9,999', note:'billed annually', highlight:'2 months saved' }
] as const;

export default function Subscribe(){
  const {profile}=useAuth();
  const [plan,setPlan]=useState<'monthly'|'yearly'>('monthly');
  const [loading,setLoading]=useState(false);
  async function startCheckout(){
    if(!profile){ toast.error('Please log in first.'); return; }
    setLoading(true);
    try{
      if(isDemoMode){
        const state=loadDemoState(); state.profile=profile; state.subscription={...state.subscription,user_id:profile.id,plan,price:plan==='monthly'?999:9999,status:'active',current_period_end:plan==='monthly'?'2026-10-20':'2027-09-20'}; saveDemoState(state); toast.success('Demo subscription activated'); return;
      }
      const {data,error}=await supabase!.functions.invoke('create-checkout-session',{body:{plan,price_cents:plan==='monthly'?99900:999900,user_id:profile.id}});
      if(error) throw error;
      if(data?.url) window.location.href=data.url; else throw new Error('Checkout session was not created.');
    }catch(err){ toast.error(err instanceof Error ? err.message : 'Unable to start checkout'); }
    finally{ setLoading(false); }
  }
  return <div><PageHeader eyebrow="MEMBERSHIP" title="Choose the way you want to participate." body="Subscriber access unlocks score tracking, draw participation, contribution settings, and winnings."/><div className="container subscribe-page"><div className="plan-grid">{plans.map((item,i)=><SectionReveal key={item.id} delay={i*.06}><motion.button type="button" className={`plan-card glass-card ${plan===item.id?'selected':''}`} whileHover={{y:-5}} onClick={()=>setPlan(item.id)}><div className="plan-top"><span>{item.name}</span><span className="plan-badge">{item.highlight}</span></div><strong>{item.price}</strong><small>{item.note}</small><div className="plan-list"><span><Check size={14}/> Access to the member dashboard</span><span><Check size={14}/> Latest-five Impact Form Score tracking</span><span><Check size={14}/> Monthly draw participation</span><span><Check size={14}/> Charity contribution controls</span></div></motion.button></SectionReveal>)}</div><SectionReveal delay={.12}><div className="checkout-bar glass-card"><div><span className="eyebrow">SELECTED PLAN</span><h2>{plans.find(x=>x.id===plan)?.name} membership</h2><p>Test-mode checkout for the assignment. No real charge is made.</p></div><button className="btn btn-primary large" onClick={startCheckout} disabled={loading}><CreditCard size={17}/>{loading?'Opening checkout…':'Continue to secure checkout'}</button></div></SectionReveal><div className="pricing-note"><Sparkles size={14}/> Pricing is illustrative for the assignment; replace with business-approved pricing before production.</div></div></div>;
}
