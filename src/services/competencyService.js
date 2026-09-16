import { getState } from './mockStore.js';
import { apiGet, serviceCall } from './api.js';
import { competencyRequirements, WEIGHTS, levelLabel } from '../data/competencyRules.js';
import { trainers as mockTrainers } from '../data/mockData.js';
import { normalizeTraineeProfile, normalizeAssessmentResults, normalizeCourses, normalizeTrainers, normalizeCertificates, normalizeResources } from './dataAdapters.js';
import { getSession } from './auth.js';

const skillValue = s => typeof s === 'number' ? Math.max(0, Math.min(4,s)) : ({beginner:1,basic:2,intermediate:3,advanced:4,expert:4}[String(s).toLowerCase()] || 0);
const normalize = n => Math.max(0, Math.min(100, Number(n)||0));

export async function getCompetencyData(traineeId=getSession()?.id||'u1') {
  if (String(import.meta.env.VITE_DEMO_MODE ?? 'true').toLowerCase() === 'true') {
    const state=getState(); const user=state.users.find(u=>u.id===traineeId)||state.users.find(u=>u.role==='trainee')||{id:traineeId,name:'Aarav Kumar',skills:{}};
    const profile=normalizeTraineeProfile({...user,qualifications:['B.Tech in Information Technology'],workExperience:'1 year internship',certificates:user.certificates||['Responsive Web Development'],interests:['Web development','Cloud computing'],skills:user.skillLevels||user.skills||{HTML:4,CSS:4,JavaScript:3,React:3,'Node.js':1,'Express.js':1,MongoDB:1}});
    return {profile,assessments:normalizeAssessmentResults(state.history.length?state.history:[{subject:'Full Stack Development',score:85,traineeId}]),courses:normalizeCourses(state.courses),certificates:normalizeCertificates(profile.certificates),resources:normalizeResources(state.resources),trainers:normalizeTrainers(mockTrainers),competencies:competencyRequirements,source:'mock',message:'Using demo data because demo mode is enabled.'};
  }
  const [profile, assessments, courses, certificates, resources, trainerData, requirements] = await Promise.all([
    apiGet(`/trainees/${traineeId}`), apiGet(`/assessments?traineeId=${traineeId}`), apiGet('/courses'), apiGet(`/trainees/${traineeId}/certificates`), apiGet('/resources'), apiGet('/trainers'), apiGet('/competencies')
  ]);
  return {profile:normalizeTraineeProfile(profile),assessments:normalizeAssessmentResults(assessments),courses:normalizeCourses(courses),certificates:normalizeCertificates(certificates),resources:normalizeResources(resources),trainers:normalizeTrainers(trainerData),competencies:Array.isArray(requirements)?requirements:competencyRequirements,source:'api',message:''};
}
export function calculateCompetency(trainee, competency, assessments=[], courses=[], certificates=[]) {
  const skills = trainee.skills || {}; const values = competency.requiredSkills;
  const relevant = Object.keys(values).map(k=>skillValue(skills[k])).filter(Boolean);
  const selfSkillScore = relevant.length ? normalize(relevant.reduce((a,b)=>a+b,0)/relevant.length/4*100) : 0;
  const targetName=competency.name.toLowerCase();
  const relevantAssessments=assessments.filter(a=>{const subject=String(a.subject||'').toLowerCase();return subject && (subject.includes(targetName)||targetName.includes(subject)||subject.split(' ')[0]===targetName.split(' ')[0]);});
  const assessmentScore=relevantAssessments.length?normalize(relevantAssessments.reduce((s,a)=>s+Number(a.score??a.percentage??0),0)/relevantAssessments.length):0;
  const relatedCourses=courses.filter(c=>competency.relatedCourses?.includes(c.id)||c.category===competency.name);
  const completed=relatedCourses.filter(c=>c.progress>=100||c.completed).length;
  const courseScore=relatedCourses.length?normalize(completed/relatedCourses.length*100):0;
  const certList=(certificates?.length?certificates:trainee.certificates||[]); const certNames=certList.map(x=>typeof x==='string'?x:x.name);
  const firstWord=targetName.split(' ')[0]; const certScore=certNames.some(c=>String(c).toLowerCase().includes(firstWord))?100:0;
  const breakdown=[{key:'selfSkill',label:'Self-Declared Skills',weight:WEIGHTS.selfSkill,score:selfSkillScore},{key:'assessment',label:'Assessment Performance',weight:WEIGHTS.assessment,score:assessmentScore},{key:'course',label:'Course Completion',weight:WEIGHTS.course,score:courseScore},{key:'certificate',label:'Certificates',weight:WEIGHTS.certificate,score:certScore}].map(x=>({...x,contribution:Number((x.score*x.weight).toFixed(2))}));
  const finalScore=Number(breakdown.reduce((s,x)=>s+x.contribution,0).toFixed(2));
  return {competencyId:competency.id,competencyName:competency.name,score:finalScore,level:levelLabel(finalScore),targetLevel:competency.targetLevel,evidence:{skills:relevant.length,assessments:relevantAssessments.length,courses:completed,certificates:certScore>0},breakdown};
}
export function detectSkillGaps(traineeSkills={}, targetCompetency){return Object.entries(targetCompetency.requiredSkills).map(([skill,target])=>{const current=skillValue(traineeSkills[skill]);const gap=Math.max(0,target-current);return {skill,current,target,gap,priority:gap===0?'No Gap':gap===1?'Medium':'High'};}).filter(x=>x.gap>0);}
export async function buildEngine(traineeId=getSession()?.id||'u1',targetId=competencyRequirements[0].id){const data=await getCompetencyData(traineeId);const requirements=data.competencies?.length?data.competencies:competencyRequirements;const target=requirements.find(c=>c.id===targetId)||requirements[0];const competencyResults=requirements.map(c=>calculateCompetency(data.profile,c,data.assessments,data.courses,data.certificates));const targetResult=calculateCompetency(data.profile,target,data.assessments,data.courses,data.certificates);return {...data,target,targetResult,competencyResults,skillGaps:detectSkillGaps(data.profile.skills,target)};}
