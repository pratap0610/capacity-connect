import { Database, WifiOff } from 'lucide-react';
export default function ApiStatus({ source, message }) {
  if (!source) return null;
  const mock = source === 'mock';
  return <div className={`mb-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-semibold ${mock ? 'border-blue-100 bg-blue-50 text-blue-800' : 'border-emerald-100 bg-emerald-50 text-emerald-800'}`}><span className="grid h-7 w-7 place-items-center rounded-lg bg-white/80">{mock ? <WifiOff size={15}/> : <Database size={15}/>}</span><span>{mock ? (message || 'Using demo data because the API is unavailable.') : 'Live API data loaded successfully.'}</span></div>;
}
