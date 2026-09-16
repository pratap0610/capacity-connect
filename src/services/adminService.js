import { apiGet, apiPatch, apiPost, serviceCall, DEMO_MODE } from './api.js';
import { getState, updateState } from './mockStore.js';
import { normalizeUsers, normalizeCourses, normalizeAnnouncements, normalizeInsights } from './dataAdapters.js';
export async function getUsers(){return serviceCall({label:'users',api:async()=>normalizeUsers(await apiGet('/admin/users')),mock:async()=>normalizeUsers(getState().users)});}
export async function updateUser(id,patch){if(DEMO_MODE){const users=getState().users.map(u=>u.id===id?{...u,...patch}:u);updateState({users});return {data:users.find(u=>u.id===id),source:'mock',message:'User status updated in demo data.'};}return {data:normalizeUsers([await apiPatch(`/admin/users/${id}`,patch)])[0],source:'api',message:''};}
export async function getAdminCourses(){return serviceCall({label:'admin courses',api:async()=>normalizeCourses(await apiGet('/admin/courses')),mock:async()=>normalizeCourses(getState().courses)});}
export async function getAnnouncements(){return serviceCall({label:'announcements',api:async()=>normalizeAnnouncements(await apiGet('/announcements')),mock:async()=>normalizeAnnouncements(getState().announcements)});}
export async function createAnnouncement(payload){if(DEMO_MODE){const x={...payload,id:`an-${Date.now()}`,date:new Date().toISOString().slice(0,10),status:'Published'};updateState({announcements:[x,...getState().announcements]});return {data:x,source:'mock',message:'Announcement published to demo data.'};}return {data:normalizeAnnouncements([await apiPost('/announcements',payload)])[0],source:'api',message:''};}
export async function getAdminInsights(){return serviceCall({label:'admin insights',api:async()=>normalizeInsights(await apiGet('/admin/insights')),mock:async()=>({prototype:true})});}
