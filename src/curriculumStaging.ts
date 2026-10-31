import {TERMS,getClasses,type AcademicLibrary,type SchemeOfWork,type SchemeWeek,type SchemeTopic,type Term} from './academic';
export type StagedRow={week:string|number;topic:string;content:string;source_page?:number};
export type StagedScheme={class_id:string;subject:string;term:string;rows:StagedRow[];review_status?:string;source_page?:number};
export type StagingBundle={format:string;schemes:StagedScheme[];review_status?:string};
export type ImportCandidate={source:StagedScheme;classId:string;subjectName:string;term:Term;rows:{number:number;topic:string;content:string}[];problems:string[]};
export function reviewStaging(data:unknown,library:AcademicLibrary):{candidates:ImportCandidate[];errors:string[]}{
 const errors:string[]=[];
 if(!data||typeof data!=='object'||!Array.isArray((data as StagingBundle).schemes))return {candidates:[],errors:['Expected a JSON object with schemes array.']};
 const schemes=(data as StagingBundle).schemes;
 if(schemes.length>5000)return {candidates:[],errors:['Too many schemes (limit 5000).']};
 const classes=getClasses(library);
 const candidates=schemes.map((source,index)=>{
  const problems:string[]=[];
  const classId=String(source?.class_id??'');
  const subjectName=String(source?.subject??'').trim();
  const term=String(source?.term??'') as Term;
  if(!classes.some(c=>c.id===classId))problems.push('Unknown class');
  if(!subjectName)problems.push('Missing subject');
  if(!TERMS.includes(term))problems.push('Unknown term');
  if(!Array.isArray(source?.rows)||source.rows.length===0)problems.push('No week rows');
  if(Array.isArray(source?.rows)&&source.rows.length>24)problems.push('Too many week rows');
  const rows:{number:number;topic:string;content:string}[]=[];
  if(Array.isArray(source?.rows))for(const row of source.rows.slice(0,24)){
   const weekText=String(row?.week??'').trim();
   const number=Number(weekText);
   if(!Number.isInteger(number)||number<1||number>24){problems.push('Invalid or ranged week: '+weekText);continue}
   const topic=String(row?.topic??'').trim(),content=String(row?.content??'').trim();
   if(!topic||!content){problems.push('Missing topic/content for week '+number);continue}
   if(rows.some(r=>r.number===number)){problems.push('Repeated week '+number);continue}
   rows.push({number,topic,content});
  }
  if(source?.review_status!=='approved')problems.push('Source is not marked approved');
  if(!problems.length&&rows.length!==source.rows.length)problems.push('Unparsed week rows');
  if(index===0&&typeof source.class_id!=='string')errors.push('Invalid source structure');
  return {source,classId,subjectName,term,rows,problems};
 });
 return {candidates,errors};
}
export function installStaging(library:AcademicLibrary,candidates:ImportCandidate[],selected:number[],sessionId:string):{library:AcademicLibrary;installed:number;skipped:number}{
 if(!library.sessions.some(s=>s.id===sessionId))throw Error('Unknown academic session');
 const subjects=[...library.subjects],schemes=[...library.schemes];
 let installed=0,skipped=0;
 for(const index of [...new Set(selected)]){
  const c=candidates[index];if(!c||c.problems.length){skipped++;continue}
  let subject=subjects.find(s=>s.classId===c.classId&&s.name.trim().toLowerCase()===c.subjectName.toLowerCase());
  if(!subject){subject={id:crypto.randomUUID(),classId:c.classId,name:c.subjectName,active:true,order:subjects.filter(s=>s.classId===c.classId).length+1};subjects.push(subject)}
  if(schemes.some(s=>s.sessionId===sessionId&&s.classId===c.classId&&s.subjectId===subject.id&&s.term===c.term)){skipped++;continue}
  const weeks:SchemeWeek[]=c.rows.map(r=>{const topic:SchemeTopic={id:crypto.randomUUID(),title:r.topic,subtopics:[],learningObjectives:[],contentOutline:[r.content],activities:[],resources:[],order:1};return {id:crypto.randomUUID(),number:r.number,topics:[topic],notes:''}});
  const scheme:SchemeOfWork={id:crypto.randomUUID(),sessionId,classId:c.classId,subjectId:subject.id,term:c.term,status:'draft',weeks,updatedAt:new Date().toISOString(),version:1};
  schemes.push(scheme);installed++;
 }
 return {library:{...library,subjects,schemes},installed,skipped};
}
