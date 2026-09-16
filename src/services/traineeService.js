import { apiGet, apiPut, serviceCall } from './api.js';
import { getState, updateState } from './mockStore.js';
import { getSession } from './auth.js';
import { normalizeTraineeProfile, normalizeAssessmentResults, normalizeCourses, normalizeCertificates, normalizeAnnouncements } from './dataAdapters.js';

const traineeId = () => getSession()?.id || 'u1';
const mockProfile = () => normalizeTraineeProfile(getState().users.find(u => u.id === traineeId()) || { id: traineeId(), name: getSession()?.name || 'Aarav Kumar', email: getSession()?.email || '' });
export async function getTraineeProfile(id = traineeId()) { return serviceCall({ label: 'trainee profile', api: async () => normalizeTraineeProfile(await apiGet(`/trainees/${id}`)), mock: async () => mockProfile() }); }
export async function updateTraineeProfile(payload, id = traineeId()) { if (!import.meta.env.VITE_API_BASE_URL || String(import.meta.env.VITE_DEMO_MODE ?? 'true').toLowerCase() === 'true') { const state = getState(); const users = state.users.map(u => u.id === id ? { ...u, ...payload } : u); updateState({ users }); return { data: normalizeTraineeProfile(users.find(u => u.id === id) || payload), source: 'mock', message: 'Profile saved to demo data.' }; } return { data: normalizeTraineeProfile(await apiPut(`/trainees/${id}`, payload)), source: 'api', message: '' }; }
export async function getTraineeCourses(id = traineeId()) { return serviceCall({ label: 'trainee courses', api: async () => normalizeCourses(await apiGet(`/trainees/${id}/courses`)), mock: async () => normalizeCourses(getState().courses) }); }
export async function getTraineeAssessments(id = traineeId()) { return serviceCall({ label: 'trainee assessments', api: async () => normalizeAssessmentResults(await apiGet(`/assessments?traineeId=${id}`)), mock: async () => normalizeAssessmentResults(getState().history) }); }
export async function getTraineeCertificates(id = traineeId()) { return serviceCall({ label: 'trainee certificates', api: async () => normalizeCertificates(await apiGet(`/trainees/${id}/certificates`)), mock: async () => normalizeCertificates(mockProfile().certificates) }); }
export async function getTraineeNotifications(id = traineeId()) { return serviceCall({ label: 'trainee notifications', api: async () => normalizeAnnouncements(await apiGet(`/trainees/${id}/notifications`)), mock: async () => normalizeAnnouncements(getState().announcements) }); }
