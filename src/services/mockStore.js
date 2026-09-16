import { courses as initialCourses } from '../data/courses.js';
import { resources as initialResources } from '../data/resources.js';
import { announcements as initialAnnouncements } from '../data/announcements.js';
import { users as initialUsers } from '../data/users.js';

const KEY='yogyasatu-mock-state';
function read(){try{return JSON.parse(localStorage.getItem(KEY))||{};}catch{return {};}}
function write(state){localStorage.setItem(KEY,JSON.stringify(state));}
export function getState(){const s=read();return {courses:s.courses||initialCourses,resources:s.resources||initialResources,announcements:s.announcements||initialAnnouncements,users:s.users||initialUsers,feedback:s.feedback||[],history:s.history||[]};}
export function updateState(patch){const next={...getState(),...patch};write(next);return next;}
export function resetMockState(){localStorage.removeItem(KEY);window.location.reload();}
