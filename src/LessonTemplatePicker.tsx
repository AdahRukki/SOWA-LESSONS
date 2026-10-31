import {useEffect,useState} from 'react';
import {LESSON_TEMPLATES,LESSON_BLOCKS,blockHtml,readCustomTemplates,type LessonTemplate,templateHtml} from './lessonTemplates';
type Props={subject:string;onInsert:(html:string)=>void;disabled?:boolean};
export default function LessonTemplatePicker({subject,onInsert,disabled}:Props){
 const suggestion=/math|quantitative/i.test(subject)?'mathematics':/english|literature|verbal/i.test(subject)?'verbal':/physics|chemistry|biology|science|agric|livestock|horticulture/i.test(subject)?'practical':/arts|writing|copy|fashion|beauty/i.test(subject)?'creative':'standard';
 const [selected,setSelected]=useState(suggestion);
 const [custom,setCustom]=useState<LessonTemplate[]>(readCustomTemplates);
 useEffect(()=>{const refresh=()=>setCustom(readCustomTemplates());window.addEventListener('sowa-lesson-templates-updated',refresh);window.addEventListener('storage',refresh);return()=>{window.removeEventListener('sowa-lesson-templates-updated',refresh);window.removeEventListener('storage',refresh)}},[]);
 const templates=[...LESSON_TEMPLATES,...custom];
 const [open,setOpen]=useState(false);
 const [singleBlock,setSingleBlock]=useState('table');
 const chosen=templates.find(t=>t.id===selected)??LESSON_TEMPLATES[0];
 return <section className="lesson-template-picker">
 <div className="lesson-template-top"><div><strong>Lesson structure templates</strong><p>Add editable headings to this week's note without replacing your existing writing.</p></div><button type="button" onClick={()=>setOpen(v=>!v)}>{open?'Close templates':'Choose template'}</button></div>
 {open&&<div className="lesson-template-body"><label>Template <select value={selected} onChange={e=>setSelected(e.target.value)}>{templates.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></label><p>{chosen.description}</p><p>Layout: {chosen.layout?.paper??'A4'} · {chosen.layout?.orientation??'portrait'} · {chosen.layout?.columns??1} column(s) · {chosen.layout?.questionSpacing??'normal'} question spacing. Apply paper settings under Export Formatting.</p><div className="lesson-template-preview">{chosen.sections.map(s=><span key={s}>{s}</span>)}{(chosen.blocks??[]).map(id=><span key={id}>{LESSON_BLOCKS.find(b=>b.id===id)?.name??id}</span>)}</div><button disabled={disabled} type="button" onClick={()=>{onInsert(templateHtml(chosen));setOpen(false)}}>Append sections to this week</button><div className="lesson-template-single"><label>Or insert one block <select value={singleBlock} onChange={e=>setSingleBlock(e.target.value)}>{LESSON_BLOCKS.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select></label><button type="button" disabled={disabled} onClick={()=>{onInsert(blockHtml(singleBlock as typeof LESSON_BLOCKS[number]['id']));setOpen(false)}}>Insert block</button></div><small>Existing text is retained. Blocks remain editable; adjust spacing and print layout before publishing.</small></div>}
 </section>;
}
