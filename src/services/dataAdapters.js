const arr = value => Array.isArray(value) ? value : (value ? String(value).split(',').map(x=>x.trim()).filter(Boolean) : []);
const normalizeSkills = value => { if (value && typeof value === 'object' && !Array.isArray(value)) return value; return arr(value).reduce((out, skill) => ({ ...out, [skill]: 2 }), {}); };
const first = (...values) => values.find(v => v !== undefined && v !== null);
const score = value => { const n = Number(first(value, 0)); return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0; };

export function normalizeTraineeProfile(raw = {}) {
  raw = raw || {};
  return {
    id: first(raw.id, raw._id, 'u1'), name: first(raw.name, raw.fullName, raw.user?.name, 'Aarav Kumar'),
    email: first(raw.email, raw.user?.email, ''), role: first(raw.role, 'trainee'), department: first(raw.department, raw.dept, 'Information Technology'),
    skills: normalizeSkills(first(raw.skills, raw.skillLevels, {})), qualifications: arr(first(raw.qualifications, raw.education)),
    workExperience: first(raw.workExperience, raw.experience, ''), certificates: arr(first(raw.certificates, raw.certifications)),
    interests: arr(first(raw.interests, [])), profileCompletion: score(first(raw.profileCompletion, raw.completion)),
  };
}
export function normalizeAssessmentResults(raw = []) {
  const list = arr(raw?.data || raw?.results || raw?.assessments || raw);
  const seen = new Set();
  return list.map((x, i) => ({ id: first(x.id, x._id, `assessment-${i}`), traineeId: first(x.traineeId, x.userId), title: first(x.title, x.assessmentTitle, x.name, 'Assessment'), subject: first(x.subject, x.category, 'General'), score: score(first(x.score, x.percentage, x.result)), percentage: score(first(x.percentage, x.score, x.result)), correct: first(x.correct, x.correctAnswers), total: first(x.total, x.questions), at: first(x.at, x.completedAt, x.createdAt, new Date().toISOString()) })).filter(x => { const key = `${x.id}-${x.traineeId || ''}`; if (seen.has(key)) return false; seen.add(key); return true; });
}
export function normalizeCourses(raw = []) {
  const list = arr(raw?.data || raw?.courses || raw).filter(Boolean);
  const seen = new Set();
  return list.map((c, i) => ({ ...c, id: first(c.id, c._id, `course-${i}`), title: first(c.title, c.name, 'Untitled course'), description: first(c.description, ''), category: first(c.category, c.subject, 'General'), level: first(c.level, 'Beginner'), duration: first(c.duration, ''), trainer: first(c.trainer, c.trainerName, 'YOGYASETU'), progress: score(first(c.progress, c.completion, 0)), enrolled: Boolean(first(c.enrolled, c.isEnrolled, false)), completed: Boolean(first(c.completed, false)), relatedSkills: arr(c.relatedSkills), modules: arr(c.modules) })).filter(c => { if (seen.has(c.id)) return false; seen.add(c.id); return true; });
}
export function normalizeTrainers(raw = []) {
  const list = arr(raw?.data || raw?.trainers || raw).filter(Boolean);
  return list.map((t, i) => ({ ...t, id: first(t.id, t._id, `trainer-${i}`), name: first(t.name, t.fullName, 'Trainer'), specialization: first(t.specialization, t.subject, 'General'), skills: arr(t.skills), rating: first(t.rating, 0), experience: first(t.experience, '') }));
}
export function normalizeCertificates(raw = []) { return arr(raw?.data || raw?.certificates || raw).map((c, i) => ({ ...c, id: first(c.id, c._id, `certificate-${i}`), name: first(c.name, c.title, 'Certificate') })); }
export function normalizeResources(raw = []) { return arr(raw?.data || raw?.resources || raw).map((r, i) => ({ ...r, id: first(r.id, r._id, `resource-${i}`), title: first(r.title, r.name, 'Resource'), description: first(r.description, ''), subject: first(r.subject, r.category, 'General'), type: first(r.type, 'Document'), trainer: first(r.trainer, r.trainerName, 'YOGYASETU'), date: first(r.date, r.createdAt, ''), link: first(r.link, r.url, '#') })); }
export function normalizeAnnouncements(raw = []) { return arr(raw?.data || raw?.announcements || raw).map((a, i) => ({ ...a, id: first(a.id, a._id, `announcement-${i}`), title: first(a.title, 'Announcement'), description: first(a.description, a.message, ''), type: first(a.type, 'Announcement'), date: first(a.date, a.createdAt, '') })); }
export function normalizeUsers(raw = []) { return arr(raw?.data || raw?.users || raw).map((u, i) => ({ ...u, id: first(u.id, u._id, `user-${i}`), name: first(u.name, u.fullName, 'User'), email: first(u.email, ''), role: first(u.role, 'trainee'), status: first(u.status, 'pending'), department: first(u.department, '') })); }
export function normalizeInsights(raw = {}) { return raw?.data || raw || {}; }
