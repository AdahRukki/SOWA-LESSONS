import {useState} from 'react';
import SchemeImport from './SchemeImport';
import {reviewScheme,canApproveScheme,setSchemeReviewStatus} from './schemeReview';
import {TERMS,createScheme,addTopic,type AcademicLibrary,type AcademicSubject,type Term,type SchemeTopic,type SchemeOfWork} from './academic';
type Props={library:AcademicLibrary;subject:AcademicSubject;onChange:(next:AcademicLibrary)=>void;onBack:()=>void;onGenerate:(scheme:SchemeOfWork,subject:AcademicSubject)=>void;initialTerm?:Term};
const fields=[['subtopics','Subtopics'],['learningObjectives','Learning objectives'],['contentOutline','Content outline'],['activities','Suggested activities'],['resources','Teaching resources']] as const;
const split=(value:string)=>value.split('\n');
export default function SchemeEditor({library,subject,onChange,onBack,onGenerate,initialTerm='First Term'}:Props){
 const [term,setTerm]=useState<Term>(initialTerm);
 const [newTitle,setNewTitle]=useState<Record<string,string>>({});
 const [openWeeks,setOpenWeeks]=useState<Record<string,boolean>>({});
 const [weekCount,setWeekCount]=useState(12);
 const [error,setError]=useState('');
 const [showImport,setShowImport]=useState(false);
 const [showReview,setShowReview]=useState(false);
 const session=library.sessions.find(s=>s.active)??library.sessions[0];
 const scheme=library.schemes.find(s=>s.sessionId===session?.id&&s.classId===subject.classId&&s.subjectId===subject.id&&s.term===term);
 const findings=scheme?reviewScheme(scheme):[];
 const edit=(fn:(s:NonNullable<typeof scheme>)=>NonNullable<typeof scheme>)=>{
  if(!scheme)return;
  onChange({...library,schemes:library.schemes.map(s=>s.id===scheme.id?{...fn(s),status:'draft',approvedAt:undefined}:s)});
 };
 function create(){if(!session){setError('Create an academic session first.');return}
  if(scheme)return;
  const made=createScheme(session.id,subject.classId,subject.id,term,weekCount,library);
  onChange({...library,schemes:[...library.schemes,made]});setError('');
 }
 function changeTopic(weekId:string,topicId:string,patch:Partial<SchemeTopic>){
  edit(s=>({...s,status:'draft',approvedAt:undefined,updatedAt:new Date().toISOString(),weeks:s.weeks.map(w=>w.id!==weekId?w:{...w,topics:w.topics.map(t=>t.id!==topicId?t:{...t,...patch})})}));
 }
 function add(weekId:string){const title=(newTitle[weekId]||'').trim();if(!title){setError('Enter a topic title first.');return}
  edit(s=>({...s,status:'draft',updatedAt:new Date().toISOString(),weeks:s.weeks.map(w=>w.id===weekId?addTopic(w,title):w)}));
  setNewTitle(prev=>({...prev,[weekId]:''}));setError('');setOpenWeeks(prev=>({...prev,[weekId]:true}));
 }
 function remove(weekId:string,topicId:string){if(!confirm('Remove this topic from the scheme?'))return;
  edit(s=>({...s,status:'draft',updatedAt:new Date().toISOString(),weeks:s.weeks.map(w=>w.id!==weekId?w:{...w,topics:w.topics.filter(t=>t.id!==topicId).map((t,i)=>({...t,order:i+1}))})}));
 }
 function move(weekId:string,topicId:string,direction:number){
  edit(s=>({...s,status:'draft',updatedAt:new Date().toISOString(),weeks:s.weeks.map(w=>{if(w.id!==weekId)return w;const a=[...w.topics];const index=a.findIndex(t=>t.id===topicId),next=index+direction;if(index<0||next<0||next>=a.length)return w;[a[index],a[next]]=[a[next],a[index]];return {...w,topics:a.map((t,i)=>({...t,order:i+1}))}})}));
 }
 return <section className="scheme-editor"><button className="academic-back" type="button" onClick={onBack}>← Subjects</button><h2>{subject.name} — Scheme of Work</h2><p>{session?.label} · {term}</p><div className="scheme-term-tabs">{TERMS.map(t=><button type="button" key={t} className={term===t?'selected':''} onClick={()=>{setTerm(t);setError('')}}>{t}</button>)}</div>
 <button type="button" onClick={()=>setShowImport(v=>!v)}>{showImport?'Hide importer':'Import scheme from CSV / spreadsheet'}</button>
 {showImport&&<SchemeImport library={library} subject={subject} term={term} onChange={onChange} onImported={()=>setShowImport(false)}/>}
 {!scheme?<div className="academic-empty"><h3>No scheme created for {term}</h3><label>Number of weeks <input type="number" min={1} max={24} value={weekCount} onChange={e=>setWeekCount(Number(e.target.value))}/></label><button type="button" onClick={create}>Create {term} Scheme</button></div>:<>
 <div className="scheme-generation"><button type="button" disabled={scheme.status!=='approved'} onClick={()=>onGenerate(scheme,subject)}>Create lesson notes from approved scheme</button><small>{scheme.status==='approved'?'Creates a new editable lesson-note document. Existing documents are never replaced.':'Approve this scheme to unlock lesson-note generation.'}</small></div><p className="scheme-progress">{scheme.weeks.length} weeks · {scheme.weeks.reduce((n,w)=>n+w.topics.length,0)} topics · Status: {scheme.status}</p>
 <div className="scheme-review"><button type="button" onClick={()=>setShowReview(v=>!v)}>{showReview?'Hide':'Review'} scheme checks ({findings.length})</button><button type="button" disabled={scheme.status==='approved'} onClick={()=>{onChange({...library,schemes:library.schemes.map(s=>s.id===scheme.id?setSchemeReviewStatus(s,'in-review'):s)});setShowReview(true)}}>Submit for review</button><button type="button" disabled={scheme.status!=='in-review'||!canApproveScheme(scheme)} onClick={()=>{if(confirm('Approve this scheme for lesson note generation?')){onChange({...library,schemes:library.schemes.map(s=>s.id===scheme.id?setSchemeReviewStatus(s,'approved'):s)});setShowReview(true)}}}>Approve scheme</button>{showReview&&<div className="scheme-findings">{!findings.length?<p>No problems detected.</p>:findings.map((f,i)=><p key={i}><strong>{f.level.toUpperCase()}{f.week?' · Week '+f.week:''}:</strong> {f.message}</p>)}</div>}</div>
 {scheme.weeks.map(w=><div key={w.id} className="scheme-week"><button className="scheme-week-head" type="button" onClick={()=>setOpenWeeks(v=>({...v,[w.id]:!v[w.id]}))}><strong>Week {w.number}</strong><span>{w.topics.map(t=>t.title).join(' · ')||'No topics added'} · {openWeeks[w.id]?'Hide':'Edit'}</span></button>{openWeeks[w.id]&&<div className="scheme-week-body">{w.topics.map((t,i)=><div className="scheme-topic" key={t.id}><div className="scheme-topic-top"><label>Topic {i+1}<input value={t.title} onChange={e=>changeTopic(w.id,t.id,{title:e.target.value})}/></label><div><button type="button" disabled={i===0} onClick={()=>move(w.id,t.id,-1)}>↑</button><button type="button" disabled={i===w.topics.length-1} onClick={()=>move(w.id,t.id,1)}>↓</button><button type="button" onClick={()=>remove(w.id,t.id)}>Remove</button></div></div>{fields.map(([key,label])=><label className="scheme-field" key={key}>{label}<textarea rows={3} value={t[key].join('\n')} onChange={e=>changeTopic(w.id,t.id,{[key]:split(e.target.value)})} placeholder="One point per line"/></label>)}</div>)}<div className="scheme-add-topic"><input aria-label={'New topic for week '+w.number} placeholder="New topic title" value={newTitle[w.id]||''} onChange={e=>setNewTitle(v=>({...v,[w.id]:e.target.value}))} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();add(w.id)}}}/><button type="button" onClick={()=>add(w.id)}>Add topic</button></div><label className="scheme-field">Week notes<textarea rows={2} value={w.notes} onChange={e=>edit(s=>({...s,status:'draft',updatedAt:new Date().toISOString(),weeks:s.weeks.map(x=>x.id===w.id?{...x,notes:e.target.value}:x)}))}/></label></div>}</div>)}
 </>}{error&&<p role="alert" className="subject-error">{error}</p>}<p className="subject-note">All changes save offline. Approved schemes return to Draft if edited. Lesson generation will be connected in Module 8.</p></section>
}
