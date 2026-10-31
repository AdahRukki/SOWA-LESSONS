import {useState,type ChangeEvent} from 'react';
import {installStaging,reviewStaging,type ImportCandidate} from './curriculumStaging';
import type {AcademicLibrary} from './academic';
import preloaded from './preloadedCurriculum.json';
type Props={library:AcademicLibrary;onChange:(next:AcademicLibrary)=>void};
export default function CurriculumInstaller({library,onChange}:Props){
 const [items,setItems]=useState<ImportCandidate[]>([]);
 const [reviewed,setReviewed]=useState<number[]>([]);
 const [message,setMessage]=useState('');
 const [query,setQuery]=useState('');
 const [termFilter,setTermFilter]=useState('All terms');
 const [origin,setOrigin]=useState('No library selected');
 const [onlyReady,setOnlyReady]=useState(false);
 const visible=items.map((item,i)=>({item,i})).filter(({item})=>(item.classId+' '+item.subjectName).toLowerCase().includes(query.trim().toLowerCase())&&(termFilter==='All terms'||item.term===termFilter)&&(!onlyReady||item.problems.filter(p=>p!=='Source is not marked approved').length===0));
 function browseBuiltIn(){const result=reviewStaging(preloaded,library);setItems(result.candidates);setReviewed([]);setMessage('Bundled schemes are source-derived but not verified; inspect against the PDF before confirming review.');setOrigin('Bundled curriculum (review pending)')}
 const session=library.sessions.find(s=>s.active)??library.sessions[0];
 async function load(e:ChangeEvent<HTMLInputElement>){
  const file=e.target.files?.[0];e.target.value='';if(!file)return;
  setItems([]);setReviewed([]);
  if(file.size>20000000){setMessage('File too large');return}
  try{const data=JSON.parse(await file.text());const result=reviewStaging(data,library);setItems(result.candidates);setOrigin('Uploaded JSON');setMessage(result.errors.join('; ')||'Review each scheme and confirm it matches the original source PDF.')}
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
 <div className="curriculum-install-sources"><button type="button" onClick={browseBuiltIn}>Browse bundled curriculum</button><label>Or upload extracted JSON <input type="file" accept=".json" onChange={load}/></label></div><p role="status">{origin}. {message}</p><div className="curriculum-install-filters"><label>Search class or subject <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="e.g. JSS1 Mathematics"/></label><label>Term <select value={termFilter} onChange={e=>setTermFilter(e.target.value)}><option>All terms</option><option>First Term</option><option>Second Term</option><option>Third Term</option></select></label><label className="curriculum-ready-filter"><input type="checkbox" checked={onlyReady} onChange={e=>setOnlyReady(e.target.checked)}/> Structurally complete only</label></div><p>{visible.length} of {items.length} schemes shown</p>
 <div className="curriculum-review-list">{visible.map(({item:c,i})=><details key={i}><summary>{c.classId} · {c.subjectName} · {c.term} ({c.rows.length} weeks) · {c.source.review_status==='approved'?'Source reviewed':'Source review pending'}{c.source.source_page?' · PDF p. '+c.source.source_page:''}</summary>
 {c.problems.filter(p=>p!=='Source is not marked approved').length>0?<p role="alert">{c.problems.join('; ')}</p>:<>
 {c.rows.map(row=><p key={row.number}><strong>Week {row.number}: {row.topic}</strong> — {row.content}</p>)}
 <label><input type="checkbox" checked={reviewed.includes(i)} onChange={e=>setReviewed(old=>e.target.checked?[...old,i]:old.filter(n=>n!==i))}/> Reviewed against original PDF; import as draft</label>
 </>}</details>)}</div>
 <button type="button" onClick={install} disabled={!reviewed.length||!session}>Install {reviewed.length} reviewed scheme(s)</button>
 </section>;
}
