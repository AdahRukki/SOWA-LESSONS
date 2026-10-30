import {useState} from 'react';
import {makeAcademicSession,type AcademicLibrary,type ClassId,TERMS} from './academic';
type Props={library:AcademicLibrary;onChange:(v:AcademicLibrary)=>void;classId:ClassId|null};
export default function SessionManager({library,onChange,classId}:Props){
 const active=library.sessions.find(s=>s.active)??library.sessions[0];
 const [year,setYear]=useState(String((active?.startsIn??2026)+1));
 const [source,setSource]=useState('');
 const [error,setError]=useState('');
 function activate(id:string){onChange({...library,sessions:library.sessions.map(s=>({...s,active:s.id===id}))});setError('')}
 function add(){try{const s=makeAcademicSession(Number(year));if(library.sessions.some(x=>x.id===s.id)){setError('That academic session already exists.');return}onChange({...library,sessions:[...library.sessions.map(x=>({...x,active:false})),{...s,active:true}]});setError('')}catch(e){setError(e instanceof Error?e.message:String(e))}}
 function copy(){
  if(!active||!source||source===active.id){setError('Choose another session to copy from.');return}
  const originals=library.schemes.filter(s=>s.sessionId===source&&(classId===null||s.classId===classId));
  const existing=new Set(library.schemes.filter(s=>s.sessionId===active.id).map(s=>s.classId+'|'+s.subjectId+'|'+s.term));
  const eligible=originals.filter(s=>!existing.has(s.classId+'|'+s.subjectId+'|'+s.term));
  if(!eligible.length){setError('No new schemes available to copy. Existing schemes are never overwritten.');return}
  if(!confirm('Copy '+eligible.length+' schemes into '+active.label+' as drafts? Existing schemes will remain unchanged.'))return;
  const copied=eligible.map(s=>({...s,id:crypto.randomUUID(),sessionId:active.id,status:'draft' as const,approvedAt:undefined,updatedAt:new Date().toISOString(),weeks:s.weeks.map(w=>({...w,id:crypto.randomUUID(),topics:w.topics.map(t=>({...t,id:crypto.randomUUID()}))}))}));
  onChange({...library,schemes:[...library.schemes,...copied]});setError('');
 }
 const scoped=library.subjects.filter(s=>s.active&&(classId===null||s.classId===classId));
 return <section className="session-manager"><h2>Academic Session</h2><div className="session-controls"><label>Current session<select value={active?.id||''} onChange={e=>activate(e.target.value)}>{library.sessions.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></label><label>Create session (start year)<input type="number" min="2000" max="2200" value={year} onChange={e=>setYear(e.target.value)}/></label><button type="button" onClick={add}>Create &amp; switch</button></div>
 <h3>Three-term coverage {classId?'for this class':'across all classes'}</h3><div className="session-table-wrap"><table className="session-table"><thead><tr><th>Subject</th>{TERMS.map(t=><th key={t}>{t}</th>)}</tr></thead><tbody>{scoped.map(s=><tr key={s.id}><td>{s.name}</td>{TERMS.map(t=>{const scheme=library.schemes.find(x=>x.sessionId===active?.id&&x.subjectId===s.id&&x.term===t);return <td key={t}>{scheme?scheme.status==='approved'?'Approved':scheme.weeks.some(w=>w.topics.length)?'In progress':'Empty':'Not created'}</td>})}</tr>)}</tbody></table>{scoped.length===0&&<p>No subjects assigned yet.</p>}</div>
 <h3>Copy schemes into {active?.label}</h3><div className="session-controls"><label>Source session<select value={source} onChange={e=>setSource(e.target.value)}><option value="">Choose source</option>{library.sessions.filter(s=>s.id!==active?.id).map(s=><option value={s.id} key={s.id}>{s.label}</option>)}</select></label><button type="button" onClick={copy} disabled={!source}>Copy without overwriting</button></div><p className="subject-note">Copied schemes are drafts. Subjects are shared across sessions, and existing term schemes are never overwritten.</p>{error&&<p role="alert" className="subject-error">{error}</p>}</section>
}
