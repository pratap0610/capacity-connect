import { apiGet, apiPost, serviceCall, DEMO_MODE } from './api.js';
import { assessments as seed } from '../data/assessments.js';
import { getState, updateState } from './mockStore.js';
import { normalizeAssessmentResults } from './dataAdapters.js';
import { getSession } from './auth.js';
export async function listAssessments(){ return serviceCall({label:'assessments',api:async()=>await apiGet('/assessments'),mock:async()=>seed}); }
export async function getAssessment(id){ return serviceCall({label:'assessment',api:async()=>await apiGet(`/assessments/${id}`),mock:async()=>seed.find(a=>a.id===id)}); }
export async function saveResult(result){ const payload={...result,traineeId:getSession()?.id||'u1'}; if(DEMO_MODE){updateState({history:[payload,...getState().history]});return {data:payload,source:'mock',message:'Assessment result saved to demo data.'};}return {data:normalizeAssessmentResults([await apiPost('/assessments/results',payload)])[0],source:'api',message:''}; }
export async function getHistory(){ const id=getSession()?.id||'u1'; return serviceCall({label:'assessment history',api:async()=>normalizeAssessmentResults(await apiGet(`/assessments/history?traineeId=${id}`)),mock:async()=>normalizeAssessmentResults(getState().history.filter(h=>!h.traineeId||h.traineeId===id))}); }
