import { Link, useNavigate } from 'react-router-dom';
import { ArrowDown, ArrowRight, BadgeCheck, BarChart3, CircleDot, HeartHandshake, Sparkles, Trophy, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import SectionReveal from '../components/SectionReveal';
import Stat from '../components/Stat';

const cricketPrograms = [
  ['01','Join','Choose a monthly or annual membership and unlock the member experience.','/signup'],
  ['02','Track','Record your latest cricket matches with runs, wickets, format and result.','/scores'],
  ['03','Give','Choose a cause and direct at least 10% of your membership toward it.','/charities'],
  ['04','Draw','Enter the monthly reward draw, inspect the math, and verify eligible wins.','/draws']
];

export default function Landing() {
  const navigate = useNavigate();
  const { openDemo, loading } = useAuth();
  const [demoOpen, setDemoOpen] = useState(false);

  async function enterDemo(role: 'user' | 'admin') {
    try {
      const p = await openDemo(role);
      setDemoOpen(false);
      navigate(p.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to open demo.');
    }
  }

  return <div>
    <section className="hero container">
      <div className="hero-copy">
        <motion.div className="eyebrow glass-pill" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:.1}}><CircleDot size={14}/> CRICKET WITH PURPOSE <Sparkles size={13}/></motion.div>
        <motion.p className="hero-intro" initial={{opacity:0, y:14}} animate={{opacity:1, y:0}} transition={{delay:.14, duration:.65}}>ImpactPlay is a cricket membership platform that turns match performance into a simple, transparent loop of community giving and monthly rewards.</motion.p>
        <motion.h1 initial={{opacity:0, y:25}} animate={{opacity:1, y:0}} transition={{delay:.18, duration:.8}}>Your game can <span className="gradient-text">create impact.</span></motion.h1>
        <motion.p initial={{opacity:0, y:25}} animate={{opacity:1, y:0}} transition={{delay:.28, duration:.8}}>Track your recent cricket form, support a cause you care about, and take part in a transparent monthly reward draw — all in one beautifully simple experience.</motion.p>
        <motion.div className="hero-actions" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:.4}}><Link className="btn btn-primary large" to="/signup">Join ImpactPlay <ArrowRight size={17}/></Link><button className="text-link demo-link" type="button" onClick={() => setDemoOpen(true)}><Sparkles size={15}/> Explore live demo</button><a className="text-link" href="#how">See how it works <ArrowDown size={15}/></a></motion.div>
        <div className="hero-trust"><BadgeCheck size={16}/><span>Clear rules, secure data, transparent prize calculations, and a recruiter-ready demo path.</span></div>
      </div>
      <div className="hero-visual">
        <motion.div className="orb orb-big" animate={{y:[0,-16,0], rotate:[0,2,0]}} transition={{duration:8, repeat:Infinity, ease:'easeInOut'}} />
        <motion.div className="dashboard-orbit glass-card" initial={{opacity:0, scale:.92, rotate:2}} animate={{opacity:1, scale:1, rotate:0}} transition={{duration:1, delay:.25}}>
          <div className="orbit-top"><span>MONTHLY IMPACT</span><span className="live-dot">LIVE</span></div>
          <div className="orbit-number">₹2.4L</div><div className="orbit-caption">directed to causes by members</div>
          <div className="mini-chart"><span style={{height:'32%'}}/><span style={{height:'45%'}}/><span style={{height:'38%'}}/><span style={{height:'62%'}}/><span style={{height:'54%'}}/><span style={{height:'79%'}}/><span style={{height:'92%'}}/></div>
          <div className="orbit-row"><div><strong>1,248</strong><small>active members</small></div><div><strong>3</strong><small>match formats</small></div><div><strong>₹62k</strong><small>reward pool</small></div></div>
        </motion.div>
        <motion.div className="floating-card float-one glass-card" animate={{y:[0,8,0]}} transition={{duration:5, repeat:Infinity}}><span className="float-icon"><HeartHandshake size={17}/></span><div><strong>Hope Foundation</strong><span>15% directed this month</span></div><span className="float-percent">15%</span></motion.div>
        <motion.div className="floating-card float-two glass-card" animate={{y:[0,-8,0]}} transition={{duration:4.4, repeat:Infinity}}><span className="float-icon orange"><Trophy size={17}/></span><div><strong>Draw ready</strong><span>Oct 01 · 5 numbers</span></div></motion.div>
      </div>
      <a className="scroll-cue" href="#how"><span>SCROLL TO EXPLORE</span><ArrowDown size={14}/></a>
    </section>

    <section id="how" className="section container">
      <SectionReveal><div className="section-heading"><span className="eyebrow">THE EXPERIENCE</span><h2>Cricket, community, and clear rewards.</h2><p>A simple four-step journey: capture your form, support a cause, and stay in the loop when the monthly draw goes live.</p></div></SectionReveal>
      <div className="process-grid">
        {cricketPrograms.map(([num,title,body,to],i)=><SectionReveal key={num} delay={i*.06}><Link to={to} className="process-card glass-card"><span className="process-number">{num}</span><div><h3>{title}</h3><p>{body}</p></div><ArrowRight className="process-arrow" size={18}/></Link></SectionReveal>)}
      </div>
    </section>

    <section className="impact-band">
      <div className="container impact-inner"><SectionReveal><div><span className="eyebrow">MEASURE WHAT MATTERS</span><h2>See your form. See your impact.</h2><p>One dashboard brings together cricket performance, participation, giving, and rewards so the journey stays easy to understand.</p></div></SectionReveal><SectionReveal delay={.15}><div className="stats-grid"><Stat value={1248} label="active members" /><Stat value={240000} suffix="+" label="charity impact" /><Stat value={62400} label="monthly reward pool" /></div></SectionReveal></div>
    </section>

    <section className="section container">
      <SectionReveal><div className="section-heading compact"><span className="eyebrow">CRICKET FORM</span><h2>Turn every match into a useful signal.</h2><p>Log runs, wickets, format, and result. ImpactPlay normalizes those inputs into a transparent 1–45 Form Score for quick performance tracking.</p></div></SectionReveal>
      <div className="feature-strip">
        <SectionReveal><div className="feature-card glass-card"><CircleDot size={19}/><div><span className="tiny-tag">BATTING</span><strong>Runs tracked</strong><p>Capture the contribution that mattered in each match.</p></div></div></SectionReveal>
        <SectionReveal delay={.06}><div className="feature-card glass-card"><Trophy size={19}/><div><span className="tiny-tag">BOWLING</span><strong>Wickets tracked</strong><p>Bring bowling impact into the same performance story.</p></div></div></SectionReveal>
        <SectionReveal delay={.12}><div className="feature-card glass-card"><BarChart3 size={19}/><div><span className="tiny-tag">FORM</span><strong>1–45 signal</strong><p>A readable form score powers insights and draw weighting.</p></div></div></SectionReveal>
      </div>
    </section>

    <section className="section container">
      <SectionReveal><div className="section-heading compact"><span className="eyebrow">FEATURED CAUSES</span><h2>Where your contribution can go.</h2></div></SectionReveal>
      <div className="charity-feature-grid">
        {[
          ['Hope Foundation','Education & opportunity','1,850 families reached','https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80'],
          ['Green Earth Initiative','Nature & climate','12,400 trees planted','https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80'],
          ['Children First','Youth wellbeing','740 students supported','https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=900&q=80']
        ].map(([name,tag,metric,image],i)=><SectionReveal key={name} delay={i*.07}><Link to="/charities" className="charity-card"><img src={image} alt=""/><div className="charity-overlay"><span className="tiny-tag">{tag}</span><h3>{name}</h3><p>{metric}</p></div></Link></SectionReveal>)}
      </div>
    </section>

    <section className="section draw-preview-section container"><SectionReveal><div className="draw-preview glass-card"><div><span className="eyebrow">THE MONTHLY DRAW</span><h2>Simple rules. Visible math.</h2><p>40% to the five-number jackpot, 35% to four-number matches, and 25% to three-number matches. Multiple winners split their tier equally.</p><Link to="/draws" className="text-link">Explore reward mechanics <ArrowRight size={15}/></Link></div><div className="draw-stack"><div className="draw-token"><span>5 MATCH</span><strong>40%</strong><small>rollover jackpot</small></div><div className="draw-token active"><span>4 MATCH</span><strong>35%</strong><small>split equally</small></div><div className="draw-token"><span>3 MATCH</span><strong>25%</strong><small>split equally</small></div></div></div></SectionReveal></section>

    <section className="section container audience-section"><SectionReveal><div className="audience-card glass-card"><div><span className="eyebrow">BUILT FOR REAL PEOPLE</span><h2>Easy for members. Easy to evaluate.</h2><p>A clear member journey, a visible admin control room, and a direct demo path make ImpactPlay simple to understand in minutes.</p></div><div className="audience-points"><div><Users size={17}/><strong>Member-first</strong><span>Simple score and giving flows</span></div><div><BarChart3 size={17}/><strong>Data-aware</strong><span>Performance + impact analytics</span></div><div><ShieldIcon/><strong>Transparent</strong><span>Visible rules and payout states</span></div></div></div></SectionReveal></section>

    <section className="cta-section container"><SectionReveal><div className="cta-card"><div className="cta-glow"/><Zap size={28}/><span className="eyebrow">NEXT MONTHLY DRAW · 01 OCT 2026</span><h2>Ready to play with purpose?</h2><p>Join the member experience and choose the cause you want your membership to support.</p><Link className="btn btn-primary large" to="/signup">Create your account <ArrowRight size={17}/></Link></div></SectionReveal></section>

    {demoOpen && <div className="demo-modal-backdrop" onClick={() => setDemoOpen(false)}>
      <motion.div className="demo-modal glass-card" onClick={(e) => e.stopPropagation()} initial={{opacity:0, y:16, scale:.98}} animate={{opacity:1, y:0, scale:1}}>
        <div className="panel-head"><div><span className="eyebrow">RECRUITER ACCESS</span><h2>Explore the working product</h2></div><button className="icon-btn" onClick={() => setDemoOpen(false)} aria-label="Close demo access">×</button></div>
        <p className="demo-modal-copy">Skip setup and open a pre-populated experience. Use normal signup/login whenever you want to test the complete journey from scratch.</p>
        <div className="demo-access-grid">
          <button className="demo-access-card glass-card" onClick={() => enterDemo('user')} disabled={loading}><span className="demo-access-icon"><HeartHandshake size={20}/></span><div><strong>User Demo</strong><span>Match form · charity · draw · winnings</span></div><ArrowRight size={16}/></button>
          <button className="demo-access-card glass-card" onClick={() => enterDemo('admin')} disabled={loading}><span className="demo-access-icon orange"><Trophy size={20}/></span><div><strong>Admin Demo</strong><span>Users · draws · winners · reports</span></div><ArrowRight size={16}/></button>
        </div>
        <div className="demo-credentials-inline"><span>Instant access · no credentials</span><span>Demo payment available inside the member flow</span></div>
      </motion.div>
    </div>}
  </div>;
}

function ShieldIcon(){ return <BadgeCheck size={17}/>; }
