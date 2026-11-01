import {useState} from 'react';
import './CurriculumAudit.css';
import sourceCoverage from './curriculumSourceCoverage.json';
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
  const ids=new Set(eligible.map(s=>s.id));
  const updated=library.schemes.map(s=>ids.has(s.id)?setSchemeReviewStatus(s,'approved'):s);
  onChange({...library,schemes:updated});
  setMessage('Approved '+count+' scheme'+(count===1?'':'s')+' for '+session.label+' in one action. '+skipped+' with structural errors were skipped. This does not verify content against the source PDF; changes are saving locally.');
 }
 const summary=classes.map(c=>{
  const installed=activeSchemes.filter(s=>s.classId===c.id);
  return {className:c.name,stage:c.stage,bundled:installed.length,subjects:new Set(installed.map(e=>e.subjectId)).size,weeklyEntries:installed.reduce((n,s)=>n+s.weeks.reduce((m,w)=>m+w.topics.length,0),0),installed:installed.length,approved:installed.filter(s=>s.status==='approved').length};
 });
 return <section className="curriculum-audit">
  <h2>Scheme of Work coverage audit</h2>
  <p>Term schemes in {session?.label??'the active session'}: {activeSchemes.length}. Approved: {approved}.</p>
  <p className="studio-hint">Secondary source status: {sourceCoverage.secondaryParsedSchemes} schemes and {sourceCoverage.secondaryExtractedTopicEntries} topic entries extracted for JSS1–SS3; {sourceCoverage.secondaryUnparsedHeadings} PDF headings remain unparsed. These imported schemes remain drafts for review.</p>
  <div className="curriculum-bulk-approval">
   <div>
    <h3>Bulk scheme approval</h3>
    <p><strong>{eligible.length}</strong> ready to approve · <strong>{skipped}</strong> blocked by structural errors · <strong>{approved}</strong> already approved.</p>
    <small>Only affects the active academic session and schemes that pass structural checks. Warnings are permitted, but errors must be fixed. Content accuracy is not automatically verified.</small>
   </div>
    <button type="button" disabled={!session||!eligible.length} onClick={approveAll}>Approve all pending schemes ({eligible.length})</button>
  </div>
  {message&&<p role="status" className="curriculum-bulk-result">{message}</p>}
  {skipped>0&&<p className="studio-hint">{skipped} scheme(s) have structural errors and must be corrected before approval.</p>}
  <div className="session-table-wrap"><table className="session-table"><thead><tr><th>Class</th><th>Term schemes</th><th>Subjects covered</th><th>Topic entries</th><th>Installed this session</th><th>Approved</th></tr></thead><tbody>{summary.map(x=><tr key={x.className+'-'+x.stage}><td>{x.className}</td><td>{x.bundled}</td><td>{x.subjects}</td><td>{x.weeklyEntries}</td><td>{x.installed}</td><td>{x.approved}</td></tr>)}</tbody></table></div>
  <p className="studio-hint">Each subject normally needs separate First, Second and Third Term schemes. Bundled counts reflect available records, not completeness or correctness.</p>
 </section>;
}
