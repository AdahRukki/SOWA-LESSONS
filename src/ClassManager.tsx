import {useState} from 'react';
import {ACADEMIC_CLASSES,getClasses,type AcademicLibrary,type ClassId} from './academic';
type Props={library:AcademicLibrary;onChange:(next:AcademicLibrary)=>void};
const defaultGroups=['Nursery','Primary','Junior Secondary','Senior Secondary'];
export default function ClassManager({library,onChange}:Props){
 const classes=getClasses(library),groups=[...new Set([...defaultGroups,...classes.map(c=>c.stage)])];
 const [name,setName]=useState(''),[group,setGroup]=useState('Primary'),[newGroup,setNewGroup]=useState('');
 const [editing,setEditing]=useState<string|null>(null),[draft,setDraft]=useState(''),[error,setError]=useState('');
 const commit=(next:typeof classes)=>{onChange({...library,classes:next});setError('')};
 const unique=(value:string,id?:string)=>!classes.some(c=>c.id!==id&&c.name.toLowerCase()===value.toLowerCase());
 function add(){const title=name.trim(),stage=(newGroup.trim()||group).trim();if(!title||!stage){setError('Enter a class name and group.');return}if(!unique(title)){setError('A class with this name already exists.');return}const id='custom-'+crypto.randomUUID();commit([...classes,{id:id as ClassId,name:title,stage,rank:classes.length+1,active:true}]);setName('');setNewGroup('')}
 function rename(id:string){const title=draft.trim();if(!title||!unique(title,id)){setError('Enter a unique class name.');return}commit(classes.map(c=>c.id===id?{...c,name:title}:c));setEditing(null)}
 function changeGroup(id:string,stage:string){commit(classes.map(c=>c.id===id?{...c,stage}:c))}
 function toggle(id:string){commit(classes.map(c=>c.id===id?{...c,active:!c.active}:c))}
 function shift(id:string,d:number){const i=classes.findIndex(c=>c.id===id),j=i+d;if(i<0||j<0||j>=classes.length)return;const next=[...classes];[next[i],next[j]]=[next[j],next[i]];commit(next.map((c,index)=>({...c,rank:index+1})))}
 return <section className="class-management"><h2>Manage classes</h2><p>Change names and order without changing class IDs, subjects or schemes. Disabling a class hides it from the dashboard.</p>
 <div className="class-manage-add"><label>Class name<input maxLength={80} value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Primary 7"/></label><label>Group<select value={group} onChange={e=>setGroup(e.target.value)}>{groups.map(g=><option key={g}>{g}</option>)}</select></label><label>Or new group<input maxLength={60} value={newGroup} onChange={e=>setNewGroup(e.target.value)} placeholder="Optional group name"/></label><button type="button" onClick={add}>Add class</button></div>
 {error&&<p role="alert">{error}</p>}
 <div className="class-manage-list">{classes.map((c,i)=><div className="class-manage-row" key={c.id}><div>{editing===c.id?<input autoFocus value={draft} maxLength={80} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')rename(c.id);if(e.key==='Escape')setEditing(null)}}/>:<strong>{c.name}</strong>}<small>{c.active?'Active':'Hidden'} · {library.subjects.filter(s=>s.classId===c.id).length} subjects</small></div><select aria-label={'Group for '+c.name} value={c.stage} onChange={e=>changeGroup(c.id,e.target.value)}>{groups.map(g=><option key={g}>{g}</option>)}</select><div>{editing===c.id?<><button type="button" onClick={()=>rename(c.id)}>Save</button><button type="button" onClick={()=>setEditing(null)}>Cancel</button></>:<button type="button" onClick={()=>{setEditing(c.id);setDraft(c.name)}}>Rename</button>}<button type="button" disabled={i===0} aria-label={'Move '+c.name+' up'} onClick={()=>shift(c.id,-1)}>↑</button><button type="button" disabled={i===classes.length-1} aria-label={'Move '+c.name+' down'} onClick={()=>shift(c.id,1)}>↓</button><button type="button" onClick={()=>toggle(c.id)}>{c.active?'Hide':'Restore'}</button></div></div>)}</div><small>Original class IDs are retained. Custom classes use new IDs.</small></section>
}
