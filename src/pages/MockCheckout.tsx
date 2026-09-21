import { ArrowLeft, CheckCircle2, CreditCard, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { completeMockPayment } from '../lib/services';

type Plan='monthly'|'yearly';
const DETAILS={monthly:{label:'Monthly membership',amount:999,suffix:'/ month'},yearly:{label:'Yearly membership',amount:9999,suffix:'/ year'}} as const;

export default function MockCheckout(){
  const {profile}=useAuth();const [params]=useSearchParams();const navigate=useNavigate();
  const plan:Plan=params.get('plan')==='yearly'?'yearly':'monthly';const details=DETAILS[plan];
  const [card,setCard]=useState('');const [expiry,setExpiry]=useState('');const [cvv,setCvv]=useState('');const [name,setName]=useState(profile?.full_name??'');const [processing,setProcessing]=useState(false);const [success,setSuccess]=useState<string|null>(null);
  useEffect(()=>{if(!profile)navigate('/login',{replace:true});},[profile,navigate]);
  async function pay(){
    if(!profile)return navigate('/login');
    const digits=card.replace(/\s/g,'');
    if(!name.trim()||digits.length<12||digits.length>16||!/^\d{2}\/\d{2}$/.test(expiry)||cvv.length<3){toast.error('Enter the demo card details to continue.');return;}
    setProcessing(true);
    try{await new Promise(r=>setTimeout(r,900));const result=await completeMockPayment(profile.id,plan);setSuccess(result.reference);toast.success('Demo payment successful');setTimeout(()=>navigate(profile.role==='admin'?'/admin':'/dashboard'),1800);}catch(error){toast.error(error instanceof Error?error.message:'Demo payment could not be completed.');}finally{setProcessing(false);}
  }
  if(!profile)return null;
  if(success)return <div className="mock-checkout-page container"><div className="mock-payment-success glass-card"><div className="mock-success-icon"><CheckCircle2 size={32}/></div><span className="eyebrow">PAYMENT SUCCESSFUL</span><h1>Your ImpactPlay membership is active.</h1><p>The simulated gateway completed the transaction and your subscription state has been activated.</p><div className="mock-success-grid"><div><span>PLAN</span><strong>{details.label}</strong></div><div><span>AMOUNT</span><strong>₹{details.amount.toLocaleString('en-IN')}</strong></div><div><span>STATUS</span><strong className="payment-success-text">PAID</strong></div><div><span>REFERENCE</span><strong>{success}</strong></div></div><div className="mock-success-note"><ShieldCheck size={16}/> Redirecting you to the subscriber experience…</div></div></div>;
  return <div className="mock-checkout-page"><PageHeader eyebrow="IMPACTPLAY DEMO GATEWAY" title="Secure checkout. Nothing real is charged." body="This simulated payment page is for evaluator walkthroughs. Use the sample values below to complete a successful mock transaction."/><div className="container"><div className="mock-checkout-grid"><div className="mock-order-card glass-card"><div className="mock-gateway-brand"><span className="brand-mark"><CreditCard size={16}/></span><div><strong>ImpactPlay</strong><span>Demo Gateway</span></div></div><div className="mock-order-summary"><span className="eyebrow">ORDER SUMMARY</span><h2>{details.label}</h2><strong>₹{details.amount.toLocaleString('en-IN')}</strong><span>{details.suffix}</span></div><div className="mock-checkout-benefits"><span><CheckCircle2 size={14}/> No real money is charged</span><span><CheckCircle2 size={14}/> Subscription activates after success</span><span><CheckCircle2 size={14}/> Returns directly to ImpactPlay</span></div></div><div className="mock-payment-card glass-card"><div className="mock-card-heading"><div><span className="eyebrow">DEMO PAYMENT</span><h2>Complete payment</h2></div><LockKeyhole size={18}/></div><div className="demo-payment-banner"><Sparkles size={15}/><span>Test environment · no real transaction</span></div><div className="mock-form-stack"><label>Name on card<input value={name} onChange={e=>setName(e.target.value)} placeholder="Aarav Mehta"/></label><label>Demo card number<input inputMode="numeric" value={card} onChange={e=>setCard(e.target.value.replace(/\D/g,'').slice(0,16).replace(/(\d{4})/g,'$1 ').trim())} placeholder="4242 4242 4242 4242"/><small>Use any 12–16 digit demo number.</small></label><div className="mock-form-row"><label>Expiry<input inputMode="numeric" value={expiry} onChange={e=>setExpiry(e.target.value.replace(/\D/g,'').slice(0,4).replace(/(\d{2})(\d{0,2})/,'$1/$2'))} placeholder="12/30"/></label><label>CVV<input inputMode="numeric" value={cvv} onChange={e=>setCvv(e.target.value.replace(/\D/g,'').slice(0,4))} placeholder="123"/></label></div><button type="button" className="btn btn-primary large full" onClick={pay} disabled={processing}><CreditCard size={17}/>{processing?'Processing demo payment…':`Pay ₹${details.amount.toLocaleString('en-IN')} — Demo`}</button><Link to={profile.role==='admin'?'/admin':'/subscribe'} className="mock-back-link"><ArrowLeft size={14}/> Back without payment</Link></div></div></div></div></div>;
}
