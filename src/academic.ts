/**
 * SOWA Lessons academic structure (v1).
 * A master curriculum is shared between branches; branch overrides can be added later.
 * Schemes are independent from existing lesson-note projects to preserve legacy work.
 */
export const ACADEMIC_CLASSES = [
 {id:'nursery-1',name:'Nursery 1',stage:'Nursery',rank:1},
 {id:'nursery-2',name:'Nursery 2',stage:'Nursery',rank:2},
 {id:'nursery-3',name:'Nursery 3',stage:'Nursery',rank:3},
 ...Array.from({length:6},(_,i)=>({id:'basic-'+(i+1),name:'Basic '+(i+1),stage:'Primary',rank:i+4})),
 ...Array.from({length:3},(_,i)=>({id:'jss-'+(i+1),name:'JSS '+(i+1),stage:'Junior Secondary',rank:i+10})),
 ...Array.from({length:3},(_,i)=>({id:'ss-'+(i+1),name:'SS '+(i+1),stage:'Senior Secondary',rank:i+13}))
] as const;
export type ClassId = typeof ACADEMIC_CLASSES[number]['id'];
export type SchoolStage = typeof ACADEMIC_CLASSES[number]['stage'];
export interface AcademicClass {id:ClassId;name:string;stage:string;rank:number;active:boolean}
export function getClasses(library:AcademicLibrary):AcademicClass[]{return (library.classes??ACADEMIC_CLASSES.map(c=>({...c,active:true}))).slice().sort((a,b)=>a.rank-b.rank)}
export type Term = 'First Term'|'Second Term'|'Third Term';
export const TERMS:readonly Term[]=['First Term','Second Term','Third Term'];
export type SchemeStatus='draft'|'in-review'|'approved';
export interface AcademicSession { id:string; label:string; startsIn:number; active:boolean }
export interface AcademicSubject { id:string; classId:ClassId; name:string; order:number; active:boolean }
export interface SchemeTopic { id:string; title:string; subtopics:string[]; learningObjectives:string[]; contentOutline:string[]; activities:string[]; resources:string[]; order:number }
export interface SchemeWeek { id:string; number:number; topics:SchemeTopic[]; notes:string }
export interface SchemeOfWork {
 id:string;sessionId:string;classId:ClassId;subjectId:string;term:Term;
 status:SchemeStatus;weeks:SchemeWeek[];approvedAt?:string;updatedAt:string;version:1
}
export interface AcademicLibrary {version:1;sessions:AcademicSession[];subjects:AcademicSubject[];schemes:SchemeOfWork[];classes?:AcademicClass[]}
export function makeAcademicSession(startYear:number):AcademicSession {
 if(!Number.isInteger(startYear)||startYear<2000||startYear>2200)throw Error('Invalid academic session year');
 return {id:String(startYear)+'-'+String(startYear+1),label:String(startYear)+'/'+String(startYear+1),startsIn:startYear,active:false}
}
export function createAcademicLibrary(startYear=2026):AcademicLibrary{
 return {version:1,sessions:[{...makeAcademicSession(startYear),active:true}],subjects:[],schemes:[],classes:ACADEMIC_CLASSES.map(c=>({...c,active:true}))}
}
export function classById(id:string,library?:AcademicLibrary){return library?getClasses(library).find(c=>c.id===id):ACADEMIC_CLASSES.find(c=>c.id===id)}
export function createSubject(classId:ClassId,name:string,order:number):AcademicSubject{
 if(!classById(classId))throw Error('Unknown class');
 const title=name.trim();if(!title)throw Error('Subject name is required');
 return {id:crypto.randomUUID(),classId,name:title,order,active:true}
}
export function createScheme(sessionId:string,classId:ClassId,subjectId:string,term:Term,weeks=12):SchemeOfWork{
 if(!classById(classId))throw Error('Unknown class');
 if(!TERMS.includes(term))throw Error('Unknown term');
 if(!Number.isInteger(weeks)||weeks<1||weeks>24)throw Error('Weeks must be between 1 and 24');
 return {id:crypto.randomUUID(),sessionId,classId,subjectId,term,status:'draft',version:1,updatedAt:new Date().toISOString(),weeks:Array.from({length:weeks},(_,i)=>({id:crypto.randomUUID(),number:i+1,topics:[],notes:''}))}
}
export function addTopic(week:SchemeWeek,title:string):SchemeWeek{
 if(!title.trim())throw Error('Topic title is required');
 return {...week,topics:[...week.topics,{id:crypto.randomUUID(),title:title.trim(),subtopics:[],learningObjectives:[],contentOutline:[],activities:[],resources:[],order:week.topics.length+1}]}
}
export function findScheme(library:AcademicLibrary,sessionId:string,classId:ClassId,subjectId:string,term:Term){
 return library.schemes.find(s=>s.sessionId===sessionId&&s.classId===classId&&s.subjectId===subjectId&&s.term===term);
}
export function validateAcademicLibrary(library:AcademicLibrary):string[]{
 const problems:string[]=[];
 const keys=new Set<string>();
 for(const s of library.schemes){
  const key=[s.sessionId,s.classId,s.subjectId,s.term].join('/');
  if(keys.has(key))problems.push('Duplicate scheme: '+key);
  keys.add(key);
  if(!library.sessions.some(x=>x.id===s.sessionId))problems.push('Unknown session: '+key);
  if(!library.subjects.some(x=>x.id===s.subjectId&&x.classId===s.classId))problems.push('Unknown subject: '+key);
  const nums=s.weeks.map(w=>w.number);
  if(new Set(nums).size!==nums.length)problems.push('Repeated week number: '+key);
 }
 return problems;
}
