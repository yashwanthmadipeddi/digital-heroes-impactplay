import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ArrowRight, CircleDot, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ScrollProgress from './ScrollProgress';

const nav = [{ to: '/charities', label: 'Causes' }, { to: '/draws', label: 'Rewards' }];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  return <div className="app-shell"><ScrollProgress />
    <div className="aurora aurora-one" /><div className="aurora aurora-two" />
    <header className="nav-wrap">
      <div className="container nav-bar glass-nav">
        <Link to="/" className="brand" onClick={() => setOpen(false)}><span className="brand-mark"><CircleDot size={15} /></span><span>impact<span>play</span></span></Link>
        <nav className="desktop-nav">
          {nav.map((item) => <NavLink key={item.to} to={item.to} className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>{item.label}</NavLink>)}
          {profile && <NavLink to="/dashboard" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>}
          {profile?.role === 'admin' && <NavLink to="/admin" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Admin</NavLink>}
        </nav>
        <div className="nav-actions">
          {profile ? <button className="btn btn-ghost small" onClick={async () => { await logout(); navigate('/'); }}>Sign out</button> : <Link to="/login" className="btn btn-ghost small">Log in</Link>}
          {!profile && <Link to="/signup" className="btn btn-primary small">Join now <ArrowRight size={14}/></Link>}
          <button className="icon-btn mobile-only" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      <AnimatePresence>{open && <motion.div className="mobile-menu glass-card" initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}}><div className="container mobile-menu-inner">{nav.map((item) => <Link key={item.to} to={item.to} onClick={() => setOpen(false)}>{item.label}</Link>)}{profile && <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>}{profile?.role === 'admin' && <Link to="/admin" onClick={() => setOpen(false)}>Admin</Link>}</div></motion.div>}</AnimatePresence>
    </header>
    <main><Outlet /></main>
    <footer className="footer"><div className="container footer-grid"><div><div className="brand footer-brand"><span className="brand-mark"><CircleDot size={15}/></span><span>impact<span>play</span></span></div><p>Cricket with purpose. Built to connect performance, community giving, and transparent monthly rewards.</p></div><div><div className="footer-label">Explore</div><Link to="/draws">Reward mechanics</Link><Link to="/charities">Cause directory</Link></div><div><div className="footer-label">Built with</div><span>React · Supabase · Demo Gateway · Vercel</span><span className="footer-muted">© 2026 ImpactPlay demo</span></div></div></footer>
  </div>;
}
