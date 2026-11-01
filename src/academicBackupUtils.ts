import type {AcademicLibrary} from './academic';
import {getClasses,TERMS,validateAcademicLibrary} from './academic';
export const BACKUP_FORMAT='sowa-academic-library-v1';
export function makeCurriculumBackup(library:AcademicLibrary){
 return JSON.stringify({format:BACKUP_FORMAT,createdAt:new Date().toISOString(),library},null,2);
}
export function parseCurriculumBackup(text:string):AcademicLibrary{
 const value:unknown=JSON.parse(text);
 if(!value||typeof value!=='object')throw Error('Backup must be a JSON object.');
 const data=value as Record<string,unknown>;
 if(data.format!==BACKUP_FORMAT)throw Error('Unsupported curriculum backup format.');
 const lib=data.library as AcademicLibrary|undefined;
 if(!lib||lib.version!==1||!Array.isArray(lib.sessions)||!Array.isArray(lib.subjects)||!Array.isArray(lib.schemes))throw Error('Incomplete academic library.');
 if(lib.classes!==undefined&&(!Array.isArray(lib.classes)||lib.classes.some(c=>typeof c.id!=='string'||typeof c.name!=='string'||typeof c.stage!=='string'||!Number.isInteger(c.rank)||typeof c.active!=='boolean')))throw Error('Invalid class directory.');
 const classIds=new Set<string>(getClasses(lib).map(c=>c.id));
 for(const s of lib.sessions)if(typeof s.id!=='string'||typeof s.label!=='string'||typeof s.startsIn!=='number'||typeof s.active!=='boolean')throw Error('Invalid academic session.');
 for(const s of lib.subjects)if(typeof s.id!=='string'||!classIds.has(s.classId)||typeof s.name!=='string'||typeof s.order!=='number'||typeof s.active!=='boolean')throw Error('Invalid subject record.');
 for(const s of lib.schemes){
  if(typeof s.id!=='string'||!classIds.has(s.classId)||!TERMS.includes(s.term)||!Array.isArray(s.weeks)||typeof s.subjectId!=='string'||typeof s.sessionId!=='string'||typeof s.status!=='string')throw Error('Invalid scheme record.');
  for(const w of s.weeks){
   if(!Number.isInteger(w.number)||!Array.isArray(w.topics)||typeof w.id!=='string')throw Error('Invalid week record.');
   for(const t of w.topics)if(typeof t.id!=='string'||typeof t.title!=='string'||!Array.isArray(t.subtopics)||!Array.isArray(t.learningObjectives)||!Array.isArray(t.contentOutline)||!Array.isArray(t.activities)||!Array.isArray(t.resources))throw Error('Invalid topic record.');
  }
 }
 const problems=validateAcademicLibrary(lib);
 if(problems.length)throw Error('Backup has invalid scheme references: '+problems[0]);
 return lib;
}
export function mergeCurriculum(current:AcademicLibrary,incoming:AcademicLibrary):{library:AcademicLibrary;added:{sessions:number;subjects:number;schemes:number}}{
 // Merge by semantic identity, not just UUID: preloaded and user-created subjects
 // may have different IDs for the same class/subject pair.
 const sessions=[...current.sessions],subjects=[...current.subjects],schemes=[...current.schemes];
 const classes=getClasses(current);
 for(const c of getClasses(incoming))if(!classes.some(x=>x.id===c.id))classes.push({...c});
 for(const s of incoming.sessions)if(!sessions.some(x=>x.id===s.id))sessions.push({...s,active:false});
 const subjectIds=new Map<string,string>();
 for(const s of incoming.subjects){
  const matching=subjects.find(x=>x.id===s.id||x.classId===s.classId&&x.name.trim().toLowerCase()===s.name.trim().toLowerCase());
  if(matching){subjectIds.set(s.id,matching.id);continue}
  subjects.push({...s});subjectIds.set(s.id,s.id);
 }
 const schemeKeys=new Set(schemes.map(s=>[s.sessionId,s.classId,s.subjectId,s.term].join('|')));
 for(const s of incoming.schemes){
  const subjectId=subjectIds.get(s.subjectId);
  if(!subjectId||!sessions.some(x=>x.id===s.sessionId))continue;
  const key=[s.sessionId,s.classId,subjectId,s.term].join('|');
  if(schemeKeys.has(key))continue; // Always preserve an existing user's version.
  schemes.push({...s,subjectId,status:'draft'});
  schemeKeys.add(key);
 }
 return {library:{version:1,sessions,subjects,schemes,classes},added:{sessions:sessions.length-current.sessions.length,subjects:subjects.length-current.subjects.length,schemes:schemes.length-current.schemes.length}};
}
