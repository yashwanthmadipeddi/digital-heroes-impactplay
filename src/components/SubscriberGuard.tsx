import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { isDemoMode, supabase } from '../lib/supabase';
import { getDemoSessionRole } from '../lib/demoSession';
import { loadDemoState } from '../lib/demoData';
import { useAuth } from '../context/AuthContext';

export default function SubscriberGuard({ children }: { children: React.ReactNode }) {
  const {profile}=useAuth();
  const [allowed,setAllowed]=useState<boolean|null>(null);
  useEffect(()=>{
    let mounted=true;
    async function check(){
      if(!profile){if(mounted)setAllowed(false);return;}
      const demoRole=getDemoSessionRole();
      if(demoRole){if(mounted)setAllowed(loadDemoState(demoRole==='admin').subscription.status==='active');return;}
      if(profile.role==='admin'){if(mounted)setAllowed(true);return;}
      if(isDemoMode||!supabase){if(mounted)setAllowed(false);return;}
      const {data}=await supabase.from('subscriptions').select('status').eq('user_id',profile.id).maybeSingle();
      if(mounted)setAllowed(data?.status==='active');
    }
    void check();
    return()=>{mounted=false;};
  },[profile]);
  if(!profile)return <Navigate to="/login" replace/>;
  if(allowed===null)return <div className="route-loading container"><div className="loading-orb"/><span>Checking member access…</span></div>;
  if(!allowed)return <Navigate to="/subscribe" replace/>;
  return <>{children}</>;
}
