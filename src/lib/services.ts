import { isDemoMode, supabase } from './supabase';
import { loadDemoState, saveDemoState } from './demoData';
import { getDemoSessionRole } from './demoSession';
import type { Charity, CricketFormat, Draw, MatchResult, Score, Subscription, UserProfile, Winner } from '../types';

export async function signIn(email: string, password: string) {
  if (isDemoMode) throw new Error('Use the Recruiter Demo buttons when demo mode is enabled.');
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
  if (profileError) throw profileError;
  return { profile: profile as UserProfile, session: data.session };
}

export async function signUp(
  fullName: string,
  email: string,
  password: string
) {
  if (isDemoMode) {
    throw new Error(
      'Real signup is unavailable because demo mode is enabled.'
    );
  }

  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    );
  }

  const {
    data,
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    throw new Error(
      error.message ||
      'Supabase could not create the account.'
    );
  }

  if (!data.user) {
    throw new Error(
      'Supabase did not return a user.'
    );
  }

  /*
   * When Confirm Email is disabled, Supabase
   * returns a session immediately. This allows
   * the new account to continue into checkout.
   */

  if (!data.session) {
    return {
      profile: null,
      session: null,
      needsEmailConfirmation: true,
      userId: data.user.id,
    };
  }

  /*
   * The database trigger creates the profile.
   * Give it a moment to become available and
   * then fetch it using the authenticated session.
   */

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error(
      `Account created, but the profile could not be loaded: ${profileError.message}`
    );
  }

  if (!profile) {
    /*
     * If the trigger has not populated the profile,
     * return a safe client-side profile so signup
     * does not fail after Auth succeeded.
     */
    return {
      profile: {
        id: data.user.id,
        email:
          data.user.email ?? email,
        full_name: fullName,
        role: 'user',
        created_at:
          new Date().toISOString(),
      } as UserProfile,
      session: data.session,
      needsEmailConfirmation: false,
    };
  }

  return {
    profile: profile as UserProfile,
    session: data.session,
    needsEmailConfirmation: false,
  };
}

export function calculateFormScore(runs:number,wickets:number,result:MatchResult){
  const batting=Math.min(25,Math.round(runs/4));
  const bowling=Math.min(15,wickets*5);
  const bonus=result==='Win'?5:result==='Draw'?3:1;
  return Math.max(1,Math.min(45,batting+bowling+bonus));
}

export async function addScore(userId:string,runs:number,wickets:number,format:CricketFormat,result:MatchResult,scoreDate:string){
  if(runs<0||runs>500) throw new Error('Runs must be between 0 and 500.');
  if(wickets<0||wickets>10) throw new Error('Wickets must be between 0 and 10.');
  const score=calculateFormScore(runs,wickets,result);
  const demoRole=getDemoSessionRole();
  if(isDemoMode||demoRole){
    const state=loadDemoState(demoRole==='admin');
    if(state.scores.some(s=>s.score_date===scoreDate&&s.user_id===userId)) throw new Error('Only one match entry is allowed per date. Edit or delete the existing match.');
    state.scores=[...state.scores,{id:crypto.randomUUID(),user_id:userId,score,score_date:scoreDate,runs,wickets,format,result}].sort((a,b)=>b.score_date.localeCompare(a.score_date)).slice(0,5);
    saveDemoState(state); return state.scores;
  }
  if(!supabase) throw new Error('Supabase is not configured.');
  const {error}=await supabase.from('scores').insert({user_id:userId,score,score_date:scoreDate,runs,wickets,format,result});
  if(error) throw error;
  const {data,error:fetchError}=await supabase.from('scores').select('*').eq('user_id',userId).order('score_date',{ascending:false}).limit(5);
  if(fetchError) throw fetchError; return (data??[]) as Score[];
}

export async function deleteScore(id:string,userId:string){
  const demoRole=getDemoSessionRole();
  if(isDemoMode||demoRole){const state=loadDemoState(demoRole==='admin');state.scores=state.scores.filter(s=>s.id!==id);saveDemoState(state);return state.scores;}
  if(!supabase) throw new Error('Supabase is not configured.');
  const {error}=await supabase.from('scores').delete().eq('id',id).eq('user_id',userId); if(error) throw error;
  const {data,error:fetchError}=await supabase.from('scores').select('*').eq('user_id',userId).order('score_date',{ascending:false}).limit(5); if(fetchError) throw fetchError; return (data??[]) as Score[];
}

export async function getCharities():Promise<Charity[]>{
  const demoRole=getDemoSessionRole(); if(isDemoMode||demoRole) return loadDemoState(demoRole==='admin').charities;
  if(!supabase) throw new Error('Supabase is not configured.');
  const {data,error}=await supabase.from('charities').select('*').order('featured',{ascending:false}); if(error) throw error; return (data??[]) as Charity[];
}

export async function getMemberSnapshot(userId:string){
  const demoRole=getDemoSessionRole();
  if(isDemoMode||demoRole){const s=loadDemoState(demoRole==='admin');return {profile:s.profile,subscription:s.subscription,scores:s.scores,charities:s.charities,draws:s.draws,winners:s.winners};}
  if(!supabase) throw new Error('Supabase is not configured.');
  const [p,sub,scores,charities,draws,winners]=await Promise.all([
    supabase.from('profiles').select('*').eq('id',userId).single(),
    supabase.from('subscriptions').select('*').eq('user_id',userId).maybeSingle(),
    supabase.from('scores').select('*').eq('user_id',userId).order('score_date',{ascending:false}).limit(5),
    supabase.from('charities').select('*').order('featured',{ascending:false}),
    supabase.from('draws').select('*').eq('status','published').order('draw_month',{ascending:false}).limit(1),
    supabase.from('winners').select('*').eq('user_id',userId).order('created_at',{ascending:false}),
  ]);
  for(const r of [p,sub,scores,charities,draws,winners]) if(r.error) throw r.error;
  return {profile:p.data as UserProfile,subscription:sub.data as Subscription|null,scores:(scores.data??[]) as Score[],charities:(charities.data??[]) as Charity[],draws:(draws.data??[]) as Draw[],winners:(winners.data??[]).map(w=>({...w,user_name:'You'})) as Winner[]};
}

function getPeriodEnd(plan:'monthly'|'yearly'){const d=new Date();if(plan==='monthly')d.setMonth(d.getMonth()+1);else d.setFullYear(d.getFullYear()+1);return d.toISOString();}
function demoReference(){return 'IP-DEMO-'+crypto.randomUUID().replace(/-/g,'').slice(0,10).toUpperCase();}

export async function completeMockPayment(userId:string,plan:'monthly'|'yearly'){
  const demoRole=getDemoSessionRole(); const price=plan==='monthly'?999:9999; const reference=demoReference(); const periodEnd=getPeriodEnd(plan);
  if(isDemoMode||demoRole){
    const state=loadDemoState(demoRole==='admin');
    state.subscription={...state.subscription,user_id:userId,plan,price,status:'active',current_period_end:periodEnd};
    saveDemoState(state);
    const payments=JSON.parse(localStorage.getItem('impactplay-demo-payments')??'[]') as unknown[];
    localStorage.setItem('impactplay-demo-payments',JSON.stringify([...payments,{id:reference,user_id:userId,plan,amount:price,currency:'INR',status:'paid',payment_method:'demo_card',provider:'ImpactPlay Demo Gateway',created_at:new Date().toISOString()}]));
    return {reference,amount:price,currency:'INR',status:'paid' as const,subscription:state.subscription};
  }
  if(!supabase) throw new Error('Supabase is not configured.');
  const {data:charity,error:charityError}=await supabase.from('charities').select('id').order('featured',{ascending:false}).limit(1).maybeSingle(); if(charityError)throw charityError; if(!charity?.id)throw new Error('No charity is configured for subscriptions.');
  const {data:subscription,error:subError}=await supabase.from('subscriptions').upsert({user_id:userId,plan,status:'active',price,charity_percentage:10,charity_id:charity.id,current_period_end:periodEnd},{onConflict:'user_id'}).select('*').single(); if(subError)throw subError;
  const {error:paymentError}=await supabase.from('payment_transactions').insert({user_id:userId,subscription_id:subscription.id,amount:price,currency:'INR',plan,status:'paid',payment_method:'demo_card',provider:'ImpactPlay Demo Gateway',transaction_reference:reference,completed_at:new Date().toISOString()}); if(paymentError)throw paymentError;
  return {reference,amount:price,currency:'INR',status:'paid' as const,subscription:subscription as Subscription};
}

export async function updateCharityPreference(userId:string,charityId:string,percentage:number){
  if(percentage<10||percentage>100)throw new Error('Contribution must be between 10% and 100%.');
  const demoRole=getDemoSessionRole();
  if(isDemoMode||demoRole){const s=loadDemoState(demoRole==='admin');s.subscription={...s.subscription,user_id:userId,charity_id:charityId,charity_percentage:percentage};saveDemoState(s);return s.subscription;}
  if(!supabase)throw new Error('Supabase is not configured.');
  const {data,error}=await supabase.from('subscriptions').update({charity_id:charityId,charity_percentage:percentage}).eq('user_id',userId).select('*').single(); if(error)throw error; return data as Subscription;
}

export async function getDraws():Promise<Draw[]>{
  const demoRole=getDemoSessionRole(); if(isDemoMode||demoRole)return loadDemoState(demoRole==='admin').draws;
  if(!supabase)throw new Error('Supabase is not configured.');
  const {data,error}=await supabase.from('draws').select('*').eq('status','published').order('draw_month',{ascending:false}); if(error)throw error; return (data??[]) as Draw[];
}

export async function getWinners(userId:string):Promise<Winner[]>{
  const demoRole=getDemoSessionRole(); if(isDemoMode||demoRole)return loadDemoState(demoRole==='admin').winners;
  if(!supabase)throw new Error('Supabase is not configured.');
  const {data,error}=await supabase.from('winners').select('*').eq('user_id',userId).order('created_at',{ascending:false}); if(error)throw error; return (data??[]).map(w=>({...w,user_name:'You'})) as Winner[];
}
