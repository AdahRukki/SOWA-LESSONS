import type {AcademicLibrary,ClassId,Term} from './academic';
import {TERMS,getClasses} from './academic';
type Lesson={id:string;name:string;className:string;subject:string;term:string;sessionId?:string;classId?:ClassId;subjectId?:string;sourceSchemeId?:string;weeks:{id:string;title:string}[]};
type Props={library:AcademicLibrary;classId:ClassId;subjectId:string;lessons:Lesson[];onOpen:(id:string)=>void};
export default function AcademicLessons({library,classId,subjectId,lessons,onOpen}:Props){
 const session=library.sessions.find(x=>x.active)??library.sessions[0];
 const subject=library.subjects.find(x=>x.id===subjectId&&x.classId===classId);
 const activeSchemes=library.schemes.filter(s=>s.sessionId===session?.id&&s.classId===classId&&s.subjectId===subjectId);
 const matching=lessons.filter(p=>p.id!=='demo'&&(
   (p.sourceSchemeId&&activeSchemes.some(s=>s.id===p.sourceSchemeId))||
   (p.sessionId===session?.id&&p.classId===classId&&p.subjectId===subjectId)||
   (p.sessionId===session?.id&&!p.classId&&!p.subjectId&&p.className.toLowerCase()===(getClasses(library).find(c=>c.id===classId)?.name??classId).toLowerCase()&&p.subject.toLowerCase()===subject?.name.toLowerCase())
 ));
 return <section className="academic-lessons"><h3>Lesson notes — {session?.label}</h3><p>Open an existing lesson document, or approve a term scheme to create a new one. Existing lesson notes are not overwritten.</p>
 {TERMS.map(term=>{const scheme=activeSchemes.find(s=>s.term===term);const docs=matching.filter(p=>p.term===term);
 return <div className="academic-lesson-term" key={term}><h4>{term} <small>Scheme: {scheme?.status??'Not created'}</small></h4>{docs.length?docs.map(p=><button type="button" key={p.id} onClick={()=>onOpen(p.id)}>{p.name} · {p.weeks.length} weeks · Open editor</button>):<p>No lesson notes saved for this term.</p>}</div>})}
 <small>Unclassified legacy documents remain available in the existing lesson editor and migration tool.</small></section>
}
