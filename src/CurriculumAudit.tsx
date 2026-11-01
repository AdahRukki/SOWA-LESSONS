import {useState} from 'react';
import './CurriculumAudit.css';
import preloaded from './preloadedCurriculum.json';
import {getClasses,type AcademicLibrary} from './academic';
import {canApproveScheme,setSchemeReviewStatus} from './schemeReview';

type Props={library:AcademicLibrary;onChange:(next:AcademicLibrary)=>void};

export default function CurriculumAudit({library,onChange}:Props){
 const [message,setMessage]=useState('');
 const classes=getClasses(library).filter(c=>c.active);
 const session=library.sessions.find(s=>s.active)??library.sessions[0];
 const activeSchemes=library.schemes.filter(s=>s.sessionId===session?.id);
 const pending=activeSchemes.filter(s=>s.status!=='approved');
 const eligible=pending.filter(canApproveScheme);
 const skipped=pending.length-eligible.length;
 const approved=activeSchemes.filter(s=>s.status==='approved').length;

 function approveAll(){
  if(!session||!eligible.length)return;
  const count=eligible.length;
  const prompt='Approve all '+count+' structurally valid scheme'+(count===1?'':'s')+' for '+session.label+'?\n\n'+
   'This unlocks lesson-note generation for those schemes. '+(skipped?skipped+' scheme(s) with errors will be skipped.\n\n':'')+
   'Approval does NOT mean the curriculum content has been checked against the original source. Continue?';
  if(!window.confirm(prompt))return;
  const ids=new Set(eligible.map(s=>s.id));
  const updated=library.schemes.map(s=>ids.has(s.id)?setSchemeReviewStatus(s,'approved'):s);
  onChange({...library,schemes:updated});
  setMessage('Approved '+count+' scheme'+(count===1?'':'s')+' for '+session.label+'. '+skipped+' skipped due to errors. Changes are saving locally.');
 }
 const summary=classes.map(c=>{
  const entries=preloaded.schemes.filter(s=>s.class_id===c.id);
  const installed=activeSchemes.filter(s=>s.classId===c.id);
  return {className:c.name,stage:c.stage,bundled:entries.length,subjects:new Set(entries.map(e=>e.subject)).size,weeklyEntries:entries.reduce((n,e)=>n+e.rows.length,0),installed:installed.length,approved:installed.filter(s=>s.status==='approved').length};
 });
 const total=summary.reduce((a,x)=>a+x.bundled,0);
 return <section className="curriculum-audit">
  <h2>Scheme of Work coverage audit</h2>
  <p>Bundled entries: {total}. Installed for {session?.label??'the active session'}: {activeSchemes.length}. Approved: {approved}.</p>
  <div className="curriculum-bulk-approval">
   <div>
    <h3>Bulk scheme approval</h3>
    <p><strong>{eligible.length}</strong> ready to approve · <strong>{skipped}</strong> blocked by structural errors · <strong>{approved}</strong> already approved.</p>
    <small>Only affects the active academic session and schemes that pass structural checks. Warnings are permitted, but errors must be fixed. Content accuracy is not automatically verified.</small>
   </div>
   <button type="button" disabled={!session||!eligible.length} onClick={approveAll}>Approve All Schemes ({eligible.length})</button>
  </div>
  {message&&<p role="status" className="curriculum-bulk-result">{message}</p>}
  {skipped>0&&<p className="studio-hint">{skipped} scheme(s) have structural errors and must be corrected before approval.</p>}
  <div className="session-table-wrap"><table className="session-table"><thead><tr><th>Class</th><th>Bundled term schemes</th><th>Subjects bundled</th><th>Weekly entries</th><th>Installed this session</th><th>Approved</th></tr></thead><tbody>{summary.map(x=><tr key={x.className+'-'+x.stage}><td>{x.className}</td><td>{x.bundled}</td><td>{x.subjects}</td><td>{x.weeklyEntries}</td><td>{x.installed}</td><td>{x.approved}</td></tr>)}</tbody></table></div>
  <p className="studio-hint">Each subject normally needs separate First, Second and Third Term schemes. Bundled counts reflect available records, not completeness or correctness.</p>
 </section>;
}
