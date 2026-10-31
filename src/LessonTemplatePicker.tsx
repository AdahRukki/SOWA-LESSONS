import {useEffect,useState} from 'react';
import {LESSON_TEMPLATES,readCustomTemplates,type LessonTemplate,templateHtml} from './lessonTemplates';
type Props={subject:string;onInsert:(html:string)=>void;disabled?:boolean};
export default function LessonTemplatePicker({subject,onInsert,disabled}:Props){
 const suggestion=/math|quantitative/i.test(subject)?'mathematics':/english|literature|verbal/i.test(subject)?'verbal':/physics|chemistry|biology|science|agric|livestock|horticulture/i.test(subject)?'practical':/arts|writing|copy|fashion|beauty/i.test(subject)?'creative':'standard';
 const [selected,setSelected]=useState(suggestion);
 const [custom,setCustom]=useState<LessonTemplate[]>(readCustomTemplates);
 useEffect(()=>{const refresh=()=>setCustom(readCustomTemplates());window.addEventListener('sowa-lesson-templates-updated',refresh);window.addEventListener('storage',refresh);return()=>{window.removeEventListener('sowa-lesson-templates-updated',refresh);window.removeEventListener('storage',refresh)}},[]);
 const templates=[...LESSON_TEMPLATES,...custom];
 const [open,setOpen]=useState(false);
 const chosen=templates.find(t=>t.id===selected)??LESSON_TEMPLATES[0];
 return <section className="lesson-template-picker">
 <div className="lesson-template-top"><div><strong>Lesson structure templates</strong><p>Add editable headings to this week's note without replacing your existing writing.</p></div><button type="button" onClick={()=>setOpen(v=>!v)}>{open?'Close templates':'Choose template'}</button></div>
 {open&&<div className="lesson-template-body"><label>Template <select value={selected} onChange={e=>setSelected(e.target.value)}>{templates.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></label><p>{chosen.description}</p><div className="lesson-template-preview">{chosen.sections.map(s=><span key={s}>{s}</span>)}</div><button disabled={disabled} type="button" onClick={()=>{onInsert(templateHtml(chosen));setOpen(false)}}>Append sections to this week</button><small>Existing text is retained. Delete any unused headings in the editor.</small></div>}
 </section>;
}
