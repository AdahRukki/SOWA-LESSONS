import preloaded from './preloadedCurriculum.json';
import {TERMS,type AcademicLibrary,type SchemeOfWork,type AcademicSubject} from './academic';
type Lesson={id:string;name:string;className:string;subject:string;term:string;sessionId?:string;sourceSchemeId?:string;weeks:{id:string;title:string}[]};
type Props={classId:string;subjectName:string;library:AcademicLibrary;lessons:Lesson[];onOpenLesson:(id:string)=>void;onGenerate:(scheme:SchemeOfWork,subject:AcademicSubject)=>void;onEdit:(subjectId:string)=>void;onBrowse:(subject:string)=>void};
export default function SubjectOverview({classId,subjectName,library,lessons,onOpenLesson,onGenerate,onEdit,onBrowse}:Props){
 const source=preloaded.schemes.filter(s=>s.class_id===classId&&s.subject.toLocaleLowerCase()===subjectName.toLocaleLowerCase());
 const subject=library.subjects.find(s=>s.classId===classId&&s.name.toLocaleLowerCase()===subjectName.toLocaleLowerCase());
 const session=library.sessions.find(s=>s.active)??library.sessions[0];
 const className=library.classes?.find(c=>c.id===classId)?.name;
 const installed=subject?library.schemes.filter(s=>s.sessionId===session?.id&&s.subjectId===subject.id):[];
 return <section className="class-group studio-scheme-overview">
 <h2>{subjectName}</h2><p className="studio-hint">Read each term's Scheme of Work, check lesson-note progress, and open or generate documents. Bundled schemes remain read-only until reviewed and installed.</p>
 <div className="studio-term-grid">{TERMS.map(term=>{
  const draft=installed.find(s=>s.term===term);
  const bundle=source.find(s=>s.term===term);
  const termDocs=lessons.filter(p=>p.id!=='demo'&&p.term===term&&(
   (draft&&p.sourceSchemeId===draft.id)||
   (p.sessionId===session?.id&&p.subject.toLowerCase()===subjectName.toLowerCase()&&p.className.toLowerCase()===(className??classId).toLowerCase())
  ));
  return <section className="studio-term-card" key={term}>
   <div className="studio-term-head"><strong>{term}</strong><small>Scheme: {draft?draft.status==='approved'?'Approved':draft.status==='in-review'?'In review':'Draft':bundle?'Available to review':'Not available'}</small><small>Lesson notes: {termDocs.length?termDocs.length+' saved':'Not created'}</small></div>
   {draft?<><p>{draft.weeks.length} weeks · {draft.weeks.reduce((n,w)=>n+w.topics.length,0)} topics</p><details><summary>View Scheme of Work</summary><div className="studio-term-weeks">{draft.weeks.map(w=><div key={w.id}><b>Week {w.number}: {w.topics.map(t=>t.title).join(', ')||'No topic yet'}</b>{w.topics.map(t=><p key={t.id}>{t.contentOutline.join('; ')}</p>)}</div>)}</div></details><button type="button" onClick={()=>onEdit(subject!.id)}>Edit scheme</button></>:bundle?<><p>{bundle.rows.length} source rows · PDF review pending</p><details><summary>Read Scheme of Work</summary><div className="studio-term-weeks">{bundle.rows.map((row,i)=><div key={i}><b>Week {row.week}: {row.topic}</b><p>{row.content}</p></div>)}</div></details><button type="button" onClick={()=>onBrowse(subjectName)}>Review &amp; install scheme</button></>:<p>No Scheme of Work available for this term.</p>}
   {termDocs.length?<div className="studio-lesson-actions">{termDocs.map(doc=><button type="button" key={doc.id} onClick={()=>onOpenLesson(doc.id)}>Open lesson notes · {doc.weeks.length} weeks</button>)}</div>:draft?.status==='approved'&&subject?<button type="button" onClick={()=>onGenerate(draft,subject)}>Create lesson notes</button>:<small className="studio-term-help">{draft?'Approve the scheme before creating lesson notes.':'Install and approve a scheme to create lesson notes.'}</small>}
  </section>;
 })}</div>
 </section>;
}
