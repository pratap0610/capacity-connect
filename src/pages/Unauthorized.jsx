import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { getSession } from '../services/auth';
import { dashboardPath } from '../services/auth';

export default function Unauthorized() {
  const session = getSession();
  return <div className="min-h-screen bg-[#f5f7fb] p-6"><div className="mx-auto max-w-3xl"><Logo/><div className="card mt-16 p-8 text-center sm:p-12"><div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-50 text-red-600"><ShieldAlert size={30}/></div><div className="eyebrow mt-7">Access restricted</div><h1 className="mt-2 text-3xl font-black text-navy">You don't have permission to view this page.</h1><p className="mx-auto mt-3 max-w-xl text-slate-500">Your current role does not have access to this workspace. Use your assigned dashboard or sign in with another development account.</p><div className="mt-7 flex flex-wrap justify-center gap-3">{session ? <Link className="btn-primary" to={dashboardPath(session.role)}>Go to my dashboard</Link> : <Link className="btn-primary" to="/login">Sign in</Link>}<Link className="btn-secondary" to="/"><ArrowLeft size={16}/> Back home</Link></div></div></div></div>;
}
