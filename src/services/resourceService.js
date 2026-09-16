import { apiGet, apiPost, apiPatch, apiDelete, serviceCall, DEMO_MODE } from './api.js';
import { getState, updateState } from './mockStore.js';
import { normalizeResources } from './dataAdapters.js';
export async function listResources(){return serviceCall({label:'resources',api:async()=>normalizeResources(await apiGet('/resources')),mock:async()=>normalizeResources(getState().resources)});}
export async function addResource(resource){if(DEMO_MODE){const next={...resource,id:`r-${Date.now()}`};updateState({resources:[next,...getState().resources]});return {data:next,source:'mock',message:'Resource metadata saved to demo data.'};}return {data:normalizeResources([await apiPost('/resources',resource)])[0],source:'api',message:''};}
export async function updateResource(id,patch){if(DEMO_MODE){const resources=getState().resources.map(r=>r.id===id?{...r,...patch}:r);updateState({resources});return {data:resources.find(r=>r.id===id),source:'mock',message:'Resource updated in demo data.'};}return {data:normalizeResources([await apiPatch(`/resources/${id}`,patch)])[0],source:'api',message:''};}
export async function removeResource(id){if(DEMO_MODE){updateState({resources:getState().resources.filter(r=>r.id!==id)});return {data:true,source:'mock',message:'Resource deleted from demo data.'};}return {data:await apiDelete(`/resources/${id}`),source:'api',message:''};}
