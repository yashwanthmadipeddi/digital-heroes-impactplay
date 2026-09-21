import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Scores from './pages/Scores';
import Charities from './pages/Charities';
import Draws from './pages/Draws';
import Winners from './pages/Winners';
import Profile from './pages/Profile';
import Subscribe from './pages/Subscribe';
import MockCheckout from './pages/MockCheckout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCharities from './pages/admin/AdminCharities';
import AdminDraws from './pages/admin/AdminDraws';
import AdminWinners from './pages/admin/AdminWinners';
import AdminReports from './pages/admin/AdminReports';
import SubscriberGuard from './components/SubscriberGuard';

function Guard({children,admin=false}:{children:React.ReactNode;admin?:boolean}){const {profile}=useAuth();if(!profile)return <Navigate to="/login" replace/>;if(admin&&profile.role!=='admin')return <Navigate to="/dashboard" replace/>;return <>{children}</>;}

export default function App(){return <AuthProvider><Routes><Route element={<Layout/>}><Route path="/" element={<Landing/>}/><Route path="/login" element={<Auth mode="login"/>}/><Route path="/signup" element={<Auth mode="signup"/>}/><Route path="/subscribe" element={<Guard><Subscribe/></Guard>}/><Route path="/checkout" element={<Guard><MockCheckout/></Guard>}/><Route path="/dashboard" element={<SubscriberGuard><Dashboard/></SubscriberGuard>}/><Route path="/scores" element={<SubscriberGuard><Scores/></SubscriberGuard>}/><Route path="/charities" element={<Charities/>}/><Route path="/draws" element={<Draws/>}/><Route path="/winners" element={<SubscriberGuard><Winners/></SubscriberGuard>}/><Route path="/profile" element={<Guard><Profile/></Guard>}/><Route path="/admin" element={<Guard admin><AdminDashboard/></Guard>}/><Route path="/admin/users" element={<Guard admin><AdminUsers/></Guard>}/><Route path="/admin/charities" element={<Guard admin><AdminCharities/></Guard>}/><Route path="/admin/draws" element={<Guard admin><AdminDraws/></Guard>}/><Route path="/admin/winners" element={<Guard admin><AdminWinners/></Guard>}/><Route path="/admin/reports" element={<Guard admin><AdminReports/></Guard>}/><Route path="*" element={<Navigate to="/" replace/>}/></Route></Routes></AuthProvider>}
