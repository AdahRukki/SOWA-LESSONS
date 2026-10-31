import type {SchemeOfWork,AcademicSubject,AcademicLibrary} from './academic';
import {getClasses} from './academic';
import {newPlan,type LessonPlan} from './TeacherGuide';

export type GeneratedWeek={id:string;title:string;content:string;plan:LessonPlan;sourceWeekId:string;sourceSchemeId:string};
export type GeneratedDocument={id:string;name:string;className:string;subject:string;term:string;sessionId:string;sourceSchemeId:string;weeks:GeneratedWeek[]};
const escapeHtml=(value:string)=>value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const list=(items:string[])=>items.filter(x=>x.trim()).map(x=>'<li>'+escapeHtml(x)+'</li>').join('');
export function documentFromScheme(scheme:SchemeOfWork,subject:AcademicSubject,library:AcademicLibrary):GeneratedDocument{
 if(scheme.status!=='approved')throw Error('Approve the Scheme of Work before generating lesson notes.');
 if(subject.id!==scheme.subjectId||subject.classId!==scheme.classId)throw Error('Subject does not match this scheme.');
 const className=getClasses(library).find(c=>c.id===scheme.classId)?.name??scheme.classId;
 return {
  id:crypto.randomUUID(),name:className+' — '+subject.name+' — '+scheme.term,
  className,subject:subject.name,term:scheme.term,sessionId:scheme.sessionId,sourceSchemeId:scheme.id,
  weeks:scheme.weeks.map(w=>{
   const title=w.topics.map(t=>t.title).join(' / ')||'Week '+w.number;
   const content=w.topics.map(t=>'<h2>'+escapeHtml(t.title)+'</h2>'+
    (t.subtopics.length?'<h3>Subtopics</h3><ul>'+list(t.subtopics)+'</ul>':'')+
    '<h3>Explanation</h3><p>Develop the explanation using the approved scheme. Add examples appropriate to the class.</p>'+
    (t.contentOutline.length?'<h3>Content to Cover</h3><ul>'+list(t.contentOutline)+'</ul>':'')+
    '<h3>Worked Examples and Activities</h3><p>Complete this section before teaching.</p>'+
    '<h3>Evaluation</h3><p>Add questions based on the objectives.</p>').join('');
   const plan=newPlan();
   plan.objectives=w.topics.flatMap(t=>t.learningObjectives).join('\n');
   plan.materials=[...new Set(w.topics.flatMap(t=>t.resources))].join(', ');
   plan.activity=w.topics.flatMap(t=>t.activities).join('\n');
   return {id:crypto.randomUUID(),title,content:content||'<h2>Week '+w.number+'</h2><p>Add lesson content.</p>',plan,sourceWeekId:w.id,sourceSchemeId:scheme.id};
  })
 };
}
