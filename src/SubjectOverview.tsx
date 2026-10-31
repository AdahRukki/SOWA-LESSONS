import preloaded from './preloadedCurriculum.json';
import {TERMS,type AcademicLibrary,type Term} from './academic';
type Props={classId:string;subjectName:string;library:AcademicLibrary;onEdit:(subjectId:string)=>void;onBrowse:(subject:string)=>void};
export default function SubjectOverview({classId,subjectName,library,onEdit,onBrowse}:Props){
 const source=preloaded.schemes.filter(s=>s.class_id===classId&&s.subject.toLocaleLowerCase()===subjectName.toLocaleLowerCase());
 const subject=library.subjects.find(s=>s.classId===classId&&s.name.toLocaleLowerCase()===subjectName.toLocaleLowerCase());
 const session=library.sessions.find(s=>s.active)??library.sessions[0];
 const installed=subject?library.schemes.filter(s=>s.sessionId===session?.id&&s.subjectId===subject.id):[];
 return <section className="class-group studio-scheme-overview">
 <h2>{subjectName}</h2><p className="studio-hint">Browse all three terms directly. Bundled source material is read-only until reviewed and installed as a draft.</p>
 <div className="studio-term-grid">{TERMS.map((term:Term)=>{
  const draft=installed.find(s=>s.term===term);
  const bundle=source.find(s=>s.term===term);
  return <section className="studio-term-card" key={term}><div className="studio-term-head"><strong>{term}</strong><small>{draft?'Installed':'Not installed'}{bundle?' · Bundled available':''}</small></div>
  {draft?<><p>{draft.weeks.length} saved weeks · {draft.status}</p><button type="button" onClick={()=>onEdit(subject!.id)}>Edit installed scheme</button></>:bundle?<><p>{bundle.rows.length} source rows · Review pending</p><details><summary>Read weekly topics &amp; content</summary><div className="studio-term-weeks">{bundle.rows.map((row,i)=><div key={i}><b>Week {row.week}: {row.topic}</b><p>{row.content}</p></div>)}</div></details><button type="button" onClick={()=>onBrowse(subjectName)}>Review &amp; install</button></>:<p>No bundled scheme for this term.</p>}
  </section>
 })}</div>
 {subject&&<button type="button" onClick={()=>onEdit(subject.id)}>Open lesson notes &amp; scheme editor</button>}
 </section>;
}
