import { LoaderCircle } from 'lucide-react';
export function LoadingState({message='Loading data…'}){return <div className="card p-10 text-center"><LoaderCircle className="mx-auto animate-spin text-brand" size={28}/><p className="mt-3 text-sm text-slate-500">{message}</p></div>}
export function ErrorState({message='Unable to load data. Please try again.',onRetry}){return <div className="card border-red-100 bg-red-50/40 p-8 text-center"><p className="text-sm font-semibold text-red-700">{message}</p>{onRetry&&<button onClick={onRetry} className="btn-secondary mt-4">Try again</button>}</div>}
export function EmptyState({message='No data available yet.'}){return <div className="card p-10 text-center text-sm text-slate-500">{message}</div>}
