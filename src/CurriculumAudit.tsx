import preloaded from './preloadedCurriculum.json';
import {getClasses,type AcademicLibrary} from './academic';
export default function CurriculumAudit({library}:{library:AcademicLibrary}){
 const classes=getClasses(library).filter(c=>c.active);
 const session=library.sessions.find(s=>s.active)??library.sessions[0];
 const summary=classes.map(c=>{
  const entries=preloaded.schemes.filter(s=>s.class_id===c.id);
  const installed=library.schemes.filter(s=>s.sessionId===session?.id&&s.classId===c.id);
  return {className:c.name,stage:c.stage,bundled:entries.length,subjects:new Set(entries.map(e=>e.subject)).size,weeklyEntries:entries.reduce((n,e)=>n+e.rows.length,0),installed:installed.length,approved:installed.filter(s=>s.status==='approved').length};
 });
 const total=summary.reduce((a,x)=>a+x.bundled,0);
 const approved=summary.reduce((a,x)=>a+x.approved,0);
 return <section className="curriculum-audit"><h2>Scheme of Work coverage audit</h2><p>Bundled entries: {total}. Approved in active session: {approved}. Bundled entries are not automatically approved. Missing classes require source documents; no topics are generated to fill gaps.</p><div className="session-table-wrap"><table className="session-table"><thead><tr><th>Class</th><th>Bundled term schemes</th><th>Subjects bundled</th><th>Weekly entries</th><th>Installed this session</th><th>Approved</th></tr></thead><tbody>{summary.map(x=><tr key={x.className+'-'+x.stage}><td>{x.className}</td><td>{x.bundled}</td><td>{x.subjects}</td><td>{x.weeklyEntries}</td><td>{x.installed}</td><td>{x.approved}</td></tr>)}</tbody></table></div><p className="studio-hint">Each subject normally needs separate First, Second and Third Term schemes. These counts reflect available records, not completeness or correctness of their curriculum content.</p></section>
}
