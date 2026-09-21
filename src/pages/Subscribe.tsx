import { Check, CreditCard, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import SectionReveal from '../components/SectionReveal';

const plans = [
  { id:'monthly', name:'Monthly', price:'₹999', note:'billed monthly', highlight:'Flexible' },
  { id:'yearly', name:'Yearly', price:'₹9,999', note:'billed annually', highlight:'2 months saved' },
] as const;

type Plan = typeof plans[number]['id'];

export default function Subscribe(){
  const [plan,setPlan]=useState<Plan>('monthly');
  const navigate=useNavigate();
  return <div><PageHeader eyebrow="MEMBERSHIP" title="Choose the way you want to participate." body="Subscriber access unlocks score tracking, draw participation, contribution settings, and winnings."/><div className="container subscribe-page"><div className="plan-grid">{plans.map((item,i)=><SectionReveal key={item.id} delay={i*.06}><motion.button type="button" className={`plan-card glass-card ${plan===item.id?'selected':''}`} whileHover={{y:-5}} onClick={()=>setPlan(item.id)}><div className="plan-top"><span>{item.name}</span><span className="plan-badge">{item.highlight}</span></div><strong>{item.price}</strong><small>{item.note}</small><div className="plan-list"><span><Check size={14}/> Access to the member dashboard</span><span><Check size={14}/> Latest-five Impact Form Score tracking</span><span><Check size={14}/> Monthly draw participation</span><span><Check size={14}/> Charity contribution controls</span></div></motion.button></SectionReveal>)}</div><SectionReveal delay={.12}><div className="checkout-bar glass-card"><div><span className="eyebrow">SELECTED PLAN</span><h2>{plans.find(x=>x.id===plan)?.name} membership</h2><p>ImpactPlay Demo Gateway · evaluation checkout · no real charge.</p></div><button className="btn btn-primary large" onClick={()=>navigate(`/checkout?plan=${plan}`)}><CreditCard size={17}/> Continue to demo checkout</button></div></SectionReveal><div className="pricing-note"><Sparkles size={14}/> Simulated checkout for the recruitment assignment. No real money is processed.</div></div></div>;
}
