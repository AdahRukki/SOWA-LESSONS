import preloaded from './preloadedCurriculum.json';
import {TERMS,getClasses,type AcademicLibrary,type SchemeOfWork,type AcademicSubject,type Term} from './academic';
type Lesson={id:string;name:string;className:string;subject:string;term:string;sessionId?:string;classId?:string;subjectId?:string;sourceSchemeId?:string;weeks:{id:string;title:string}[]};
type Props={classId:string;subjectName:string;library:AcademicLibrary;lessons:Lesson[];onOpenLesson:(id:string)=>void;onGenerate:(scheme:SchemeOfWork,subject:AcademicSubject)=>void;onEdit:(subjectId:string,term:Term)=>void;onBrowse:(subject:string)=>void};
export default function SubjectOverview({classId,subjectName,library,lessons,onOpenLesson,onGenerate,onEdit,onBrowse}:Props){
 const source=preloaded.schemes.filter(s=>s.class_id===classId&&s.subject.toLocaleLowerCase()===subjectName.toLocaleLowerCase());
 const subject=library.subjects.find(s=>s.classId===classId&&s.name.toLocaleLowerCase()===subjectName.toLocaleLowerCase());
 const session=library.sessions.find(s=>s.active)??library.sessions[0];
 const className=getClasses(library).find(c=>c.id===classId)?.name;
 const installed=subject?library.schemes.filter(s=>s.sessionId===session?.id&&s.subjectId===subject.id):[];
 return <section className="class-group studio-scheme-overview">
 <h2>{subjectName}</h2><p className="studio-hint">Choose a term to see its weekly topics. Create lesson notes from the topics, then edit the scheme whenever you need to add or move content. Draft schemes remain labelled for review.</p>
 <div className="studio-term-grid">{TERMS.map(term=>{
  const draft=installed.find(s=>s.term===term);
  const bundle=source.find(s=>s.term===term);
  const termDocs=lessons.filter(p=>p.id!=='demo'&&p.term===term&&(
   (draft&&p.sourceSchemeId===draft.id)||
   (p.sessionId===session?.id&&p.classId===classId&&p.subjectId===subject?.id)||
   (p.sessionId===session?.id&&!p.classId&&!p.subjectId&&p.subject.toLowerCase()===subjectName.toLowerCase()&&p.className.toLowerCase()===(className??classId).toLowerCase())
  ));
  return <section className="studio-term-card" key={term}>
   <div className="studio-term-head"><strong>{term}</strong><small>Scheme: {draft?draft.status==='approved'?'Approved':draft.status==='in-review'?'In review':'Draft':bundle?'Available to review':'Not available'}</small><small>Lesson notes: {termDocs.length?termDocs.length+' saved':'Not created'}</small></div>
   {draft?<><p>{draft.weeks.length} weeks · {draft.weeks.reduce((n,w)=>n+w.topics.length,0)} topics · {draft.status==='approved'?'Approved':'Draft · review pending'}</p><div className="studio-term-weeks">{draft.weeks.filter(w=>w.topics.length).map(w=><div key={w.id}><b>Week {w.number}</b>{w.topics.map(t=><p key={t.id}><strong>{t.title}</strong>{t.contentOutline.length?' — '+t.contentOutline.join('; '):''}</p>)}</div>)}</div><button type="button" onClick={()=>onEdit(subject!.id,term)}>Edit topics and weeks</button></>:bundle?<><p>{bundle.rows.length} source rows · PDF review pending</p><details><summary>Read Scheme of Work</summary><div className="studio-term-weeks">{bundle.rows.map((row,i)=><div key={i}><b>Week {row.week}: {row.topic}</b><p>{row.content}</p></div>)}</div></details><button type="button" onClick={()=>onBrowse(subjectName)}>Review &amp; install scheme</button></>:<p>No Scheme of Work available for this term.</p>}
   {termDocs.length?<div className="studio-lesson-actions">{termDocs.map(doc=><button type="button" key={doc.id} onClick={()=>onOpenLesson(doc.id)}>Open lesson notes · {doc.weeks.length} weeks</button>)}</div>:draft&&subject?<button type="button" onClick={()=>onGenerate(draft,subject)}>Create lesson notes from these topics</button>:<small className="studio-term-help">{bundle?'Install the scheme to create lesson notes.':'No topics have been added for this term yet.'}</small>}
  </section>;
 })}</div>
 </section>;
}
