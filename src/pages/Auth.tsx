import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CircleDot, LockKeyhole, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

export default function Auth({ mode }: { mode: 'login' | 'signup' }) {
  const isLogin = mode === 'login';
  const [name,setName] = useState(''); const [email,setEmail] = useState(''); const [password,setPassword] = useState('');
  const { login, register, loading } = useAuth(); const navigate = useNavigate();
  async function submit(e: FormEvent) { e.preventDefault(); try { const p = isLogin ? await login(email,password) : await register(name,email,password); toast.success(isLogin ? `Welcome back, ${p.full_name}` : 'Account created'); navigate(p.role === 'admin' ? '/admin' : '/dashboard'); } catch(err) { toast.error(err instanceof Error ? err.message : 'Something went wrong'); } }
  async function openDemo(role: 'user'|'admin') {
    const email = role === 'admin' ? 'admin@impactplay-demo.com' : 'demo@impactplay-demo.com';
    const password = role === 'admin' ? 'Admin@1234' : 'Demo@1234';
    try { const p = await login(email,password); toast.success(`${role === 'admin' ? 'Admin' : 'User'} demo opened`); navigate(p.role === 'admin' ? '/admin' : '/dashboard'); }
    catch(err) { toast.error(err instanceof Error ? err.message : 'Unable to open demo'); }
  }
  return <div className="auth-page container"><div className="auth-panel glass-card"><div className="auth-brand"><span className="brand-mark"><CircleDot size={15}/></span><span>impact<span>play</span></span></div><span className="eyebrow">{isLogin ? 'WELCOME BACK' : 'START WITH PURPOSE'}</span><h1>{isLogin ? 'Pick up where you left off.' : 'Build your impact loop.'}</h1><p>{isLogin ? 'Access your match form, charity settings, and monthly reward activity.' : 'Create a member account, then choose a plan and cause.'}</p><form onSubmit={submit} className="form-stack">{!isLogin && <label>Full name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" required /></label>}<label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required /></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" minLength={8} required /></label><button className="btn btn-primary full" disabled={loading}>{loading ? 'Working…' : isLogin ? 'Log in' : 'Create account'} <ArrowRight size={16}/></button></form><div className="auth-note"><LockKeyhole size={15}/> Production uses Supabase Auth; local demo mode is included for evaluator walkthroughs.</div>{isLogin && <div className="auth-demo-block"><div><span className="eyebrow">QUICK DEMO</span><strong>Skip account setup</strong><span>Open a prepared experience in one click.</span></div><div className="auth-demo-actions"><button className="btn btn-secondary" onClick={()=>openDemo('user')} disabled={loading}><Sparkles size={14}/> User demo</button><button className="btn btn-secondary" onClick={()=>openDemo('admin')} disabled={loading}><Sparkles size={14}/> Admin demo</button></div></div>}<div className="auth-switch">{isLogin ? <>New here? <Link to="/signup">Create an account</Link></> : <>Already registered? <Link to="/login">Log in</Link></>}</div><div className="demo-credentials"><strong>Demo credentials</strong><span>User: demo@impactplay-demo.com / Demo@1234</span><span>Admin: admin@impactplay-demo.com / Admin@1234</span></div></div></div>;
}
