import {useState} from 'react';
import {getClasses,TERMS,type AcademicLibrary,type ClassId,type Term} from './academic';
export type LegacyProject={id:string;name:string;className:string;subject:string;term:string;sessionId?:string;sourceSchemeId?:string;weeks:{id:string;title:string;content:string}[]};
type Props={projects:LegacyProject[];library:AcademicLibrary;onMigrate:(projectId:string,classId:ClassId,subjectId:string,term:Term,sessionId:string)=>void};
export default function LegacyMigration({projects,library,onMigrate}:Props){
 const [projectId,setProjectId]=useState('');const [classId,setClassId]=useState<ClassId>('basic-3');const [subjectId,setSubjectId]=useState('');const [term,setTerm]=useState<Term>('First Term');const [sessionId,setSessionId]=useState('');const [message,setMessage]=useState('');
 const project=projects.find(p=>p.id===projectId);
 const available=library.subjects.filter(s=>s.classId===classId&&s.active);
 const session=library.sessions.find(s=>s.active)??library.sessions[0];
 const selectedSession=sessionId||session?.id||'';
 function migrate(){
  if(!project||!subjectId||!selectedSession||!available.some(s=>s.id===subjectId)){setMessage('Select a valid document, class, subject and session.');return}
  if(!confirm('Link a copy of this lesson document to the selected academic details? The original will remain unchanged.'))return;
  onMigrate(project.id,classId,subjectId,term,selectedSession);
  setMessage('Migration copy created. Open the existing lesson editor to view it.');
 }
 return <section className="legacy-migration"><h2>Legacy lesson-note migration</h2><p>Create a new classified copy of an older lesson project. Originals will not be changed or deleted.</p><div className="legacy-migration-grid"><label>Original document<select value={projectId} onChange={e=>{setProjectId(e.target.value);setMessage('')}}><option value="">Select a document</option>{projects.map(p=><option value={p.id} key={p.id}>{p.name}</option>)}</select></label><label>Class<select value={classId} onChange={e=>{setClassId(e.target.value as ClassId);setSubjectId('')}}>{getClasses(library).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label>Subject<select value={subjectId} onChange={e=>setSubjectId(e.target.value)}><option value="">Choose subject</option>{available.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label><label>Term<select value={term} onChange={e=>setTerm(e.target.value as Term)}>{TERMS.map(t=><option key={t}>{t}</option>)}</select></label><label>Academic session<select value={selectedSession} onChange={e=>setSessionId(e.target.value)}>{library.sessions.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></label></div>{project&&<p>Selected original: {project.weeks.length} weeks. Existing title: {project.name}.</p>}<button type="button" disabled={!project||!subjectId||!selectedSession} onClick={migrate}>Create classified copy</button><p role="status">{message}</p><small>Migration does not create or approve a Scheme of Work, and does not claim curriculum coverage.</small></section>
}
