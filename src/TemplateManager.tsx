import {useState} from 'react';
import {LESSON_TEMPLATES,readCustomTemplates,saveCustomTemplates,type LessonTemplate} from './lessonTemplates';
const fresh=()=>({id:crypto.randomUUID(),name:'New Template',description:'',sections:['Explanation','Examples','Activities','Evaluation']});
export default function TemplateManager(){
 const [items,setItems]=useState<LessonTemplate[]>(readCustomTemplates);
 const [selected,setSelected]=useState<string|null>(null);
 const [error,setError]=useState('');
 const item=items.find(x=>x.id===selected);
 const commit=(next:LessonTemplate[])=>{try{saveCustomTemplates(next);setItems(next);setError('')}catch{setError('Could not save templates on this device. Check browser storage settings.')}};
 const modify=(patch:Partial<LessonTemplate>)=>{if(item)commit(items.map(x=>x.id===item.id?{...x,...patch}:x))};
 const move=(delta:number)=>{if(!item)return;const i=items.findIndex(x=>x.id===item.id),j=i+delta;if(j<0||j>=items.length)return;const next=[...items];[next[i],next[j]]=[next[j],next[i]];commit(next)};
 const add=()=>{const x=fresh();commit([...items,x]);setSelected(x.id)};
 return <section className="template-manager"><header className="template-manager-head"><div><h2>Lesson Note Templates</h2><p>Built-in templates stay unchanged. Create and reorder your own section structures for future lessons.</p></div><button type="button" onClick={add}>+ Create template</button></header>
 {error&&<p role="alert">{error}</p>}
 <h3>Built-in templates</h3><div className="template-builtins">{LESSON_TEMPLATES.map(t=><div key={t.id}><strong>{t.name}</strong><small>{t.sections.join(' · ')}</small><button type="button" onClick={()=>{const x={...t,id:crypto.randomUUID(),name:t.name+' (Copy)',sections:[...t.sections]};commit([...items,x]);setSelected(x.id)}}>Duplicate to customize</button></div>)}</div>
 <h3>My templates ({items.length})</h3>{items.length===0&&<p>No custom templates yet. Create one or duplicate a built-in template.</p>}
 <div className="template-custom-list">{items.map(t=><button type="button" key={t.id} className={selected===t.id?'selected':''} onClick={()=>setSelected(t.id)}>{t.name} · {t.sections.length} sections</button>)}</div>
 {item&&<div className="template-edit-panel"><h3>Edit template</h3><label>Name<input value={item.name} onChange={e=>modify({name:e.target.value})}/></label><label>Description<input value={item.description} onChange={e=>modify({description:e.target.value})}/></label>
 <label>Sections (one heading per line)<textarea rows={8} value={item.sections.join('\n')} onChange={e=>modify({sections:e.target.value.split('\n')})}/></label>
 <p>Sections appear in the order shown above. Blank lines will be ignored when inserted into lesson notes.</p>
 <div className="template-edit-actions"><button type="button" disabled={items.indexOf(item)===0} onClick={()=>move(-1)}>Move up</button><button type="button" disabled={items.indexOf(item)===items.length-1} onClick={()=>move(1)}>Move down</button><button type="button" onClick={()=>{const x={...item,id:crypto.randomUUID(),name:item.name+' (Copy)',sections:[...item.sections]};commit([...items,x]);setSelected(x.id)}}>Duplicate</button><button type="button" onClick={()=>{if(!confirm('Delete this custom template?'))return;commit(items.filter(t=>t.id!==item.id));setSelected(null)}}>Delete</button></div></div>}
 <p className="studio-hint">Custom templates are stored locally in this browser. Export or sync support is not yet available; clearing browser data may remove them.</p>
 </section>;
}
