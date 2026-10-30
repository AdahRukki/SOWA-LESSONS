import type {SchemeOfWork} from './academic';
export type SchemeFinding={level:'error'|'warning';week?:number;message:string};
export function reviewScheme(scheme:SchemeOfWork):SchemeFinding[]{
 const findings:SchemeFinding[]=[];
 if(!scheme.weeks.length) findings.push({level:'error',message:'There are no weeks in this scheme.'});
 const numbers=new Set<number>();
 const seen=new Map<string,number>();
 for(const week of scheme.weeks){
  if(numbers.has(week.number))findings.push({level:'error',week:week.number,message:'Week number is repeated.'});
  numbers.add(week.number);
  if(!week.topics.length)findings.push({level:'error',week:week.number,message:'No topic has been entered.'});
  for(const topic of week.topics){
   if(!topic.title.trim()){findings.push({level:'error',week:week.number,message:'A topic has no title.'});continue}
   const key=topic.title.trim().toLocaleLowerCase();
   if(seen.has(key))findings.push({level:'warning',week:week.number,message:'Topic "'+topic.title+'" also appears in week '+seen.get(key)+'.'});
   seen.set(key,week.number);
   if(!topic.subtopics.some(v=>v.trim()))findings.push({level:'warning',week:week.number,message:'No subtopics for "'+topic.title+'".'});
   if(!topic.learningObjectives.some(v=>v.trim()))findings.push({level:'warning',week:week.number,message:'No learning objectives for "'+topic.title+'".'});
   if(!topic.contentOutline.some(v=>v.trim()))findings.push({level:'warning',week:week.number,message:'No content outline for "'+topic.title+'".'});
  }
 }
 return findings;
}
export function canApproveScheme(scheme:SchemeOfWork):boolean{
 return reviewScheme(scheme).every(f=>f.level!=='error');
}
export function setSchemeReviewStatus(scheme:SchemeOfWork,status:'draft'|'in-review'|'approved'):SchemeOfWork{
 if(status==='approved'&&!canApproveScheme(scheme))throw Error('Resolve all scheme errors before approval.');
 return {...scheme,status,approvedAt:status==='approved'?new Date().toISOString():undefined,updatedAt:new Date().toISOString()};
}
