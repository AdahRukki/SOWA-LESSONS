import {useState,type ChangeEvent} from 'react';
import {installStaging,reviewStaging,type ImportCandidate} from './curriculumStaging';
import type {AcademicLibrary} from './academic';
type Props={library:AcademicLibrary;onChange:(next:AcademicLibrary)=>void};
export default function CurriculumInstaller({library,onChange}:Props){
 const [items,setItems]=useState<ImportCandidate[]>([]);
 const [reviewed,setReviewed]=useState<number[]>([]);
 const [message,setMessage]=useState('');
 const session=library.sessions.find(s=>s.active)??library.sessions[0];
 async function load(e:ChangeEvent<HTMLInputElement>){
  const file=e.target.files?.[0];e.target.value='';if(!file)return;
  setItems([]);setReviewed([]);
  if(file.size>20000000){setMessage('File too large');return}
  try{const data=JSON.parse(await file.text());const result=reviewStaging(data,library);setItems(result.candidates);setMessage(result.errors.join('; ')||'Review each scheme and confirm it matches the original source PDF.')}
  catch{setMessage('Invalid JSON file.')}
 }
 function install(){
  if(!session)return;
  const valid=items.map((c,i)=>reviewed.includes(i)?{...c,problems:c.problems.filter(p=>p!=='Source is not marked approved')}:c);
  const result=installStaging(library,valid,reviewed,session.id);
  if(result.installed)onChange(result.library);
  setReviewed([]);
  setMessage('Installed '+result.installed+' draft schemes; skipped '+result.skipped+'. Existing schemes were preserved.');
 }
 return <section className="class-management curriculum-installer"><h2>Curriculum installer</h2><p>Upload extracted JSON. Review full weekly content before selecting a scheme. Installed schemes remain drafts.</p>
 <input type="file" accept=".json" onChange={load}/><p role="status">{message}</p>
 <div className="curriculum-review-list">{items.map((c,i)=><details key={i}><summary>{c.classId} · {c.subjectName} · {c.term} ({c.rows.length} weeks)</summary>
 {c.problems.filter(p=>p!=='Source is not marked approved').length>0?<p role="alert">{c.problems.join('; ')}</p>:<>
 {c.rows.map(row=><p key={row.number}><strong>Week {row.number}: {row.topic}</strong> — {row.content}</p>)}
 <label><input type="checkbox" checked={reviewed.includes(i)} onChange={e=>setReviewed(old=>e.target.checked?[...old,i]:old.filter(n=>n!==i))}/> Reviewed against original PDF; import as draft</label>
 </>}</details>)}</div>
 <button type="button" onClick={install} disabled={!reviewed.length||!session}>Install {reviewed.length} reviewed scheme(s)</button>
 </section>;
}
