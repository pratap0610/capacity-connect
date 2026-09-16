export const WEIGHTS = { selfSkill: 0.30, assessment: 0.40, course: 0.20, certificate: 0.10 };
export const LEVELS = [
  { min: 0, max: 20, label: 'Beginner' }, { min: 21, max: 40, label: 'Basic' },
  { min: 41, max: 60, label: 'Intermediate' }, { min: 61, max: 80, label: 'Advanced' },
  { min: 81, max: 100, label: 'Expert' },
];
export const competencyRequirements = [
  { id:'cc-fullstack', name:'Full Stack Development', targetLevel:4, requiredSkills:{HTML:4,CSS:4,JavaScript:4,React:3,'Node.js':3,'Express.js':3,MongoDB:3}, relatedCourses:['c1'] },
  { id:'cc-cloud', name:'Cloud Computing', targetLevel:3, requiredSkills:{AWS:3,Linux:3,'Cloud Fundamentals':3}, relatedCourses:['c2'] },
  { id:'cc-security', name:'Cybersecurity Fundamentals', targetLevel:3, requiredSkills:{'Network Security':3,Risk:3,'Security Fundamentals':3}, relatedCourses:['c3'] },
  { id:'cc-ai', name:'Artificial Intelligence', targetLevel:3, requiredSkills:{Python:3,'Machine Learning':3,'Responsible AI':3}, relatedCourses:['c4'] },
];
export const levelLabel = score => LEVELS.find(l => score <= l.max)?.label || 'Expert';
