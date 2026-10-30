import React,{useState} from 'react';
import type {LessonPlan} from './TeacherGuide';
import {downloadDocx} from './docxExport';
export type PageSettings={paper:'A4'|'A5'|'Letter'|'Legal';orientation:'portrait'|'landscape';fontFamily:string;fontSize:number;lineSpacing:number;marginMm:number;showGuide:boolean;showTOC:boolean};
export const DEFAULT_SETTINGS:PageSettings={paper:'A4',orientation:'portrait',fontFamily:'Georgia',fontSize:12,lineSpacing:1.4,marginMm:18,showGuide:true,showTOC:true};
export type PrintableWeek={id:string;title:string;content:string;plan?:LessonPlan};
type Props={settings:PageSettings;onChange:(value:PageSettings)=>void;project:{name:string;className:string;subject:string;term:string;weeks:PrintableWeek[]}};
export function DocumentSettings({settings,onChange,project}:Props){
 const [showPreview,setShowPreview]=useState(false);
 const [exporting,setExporting]=useState(false);
 const [exportMessage,setExportMessage]=useState('');
 async function exportWord(){setExporting(true);setExportMessage('');try{const result=await downloadDocx(project,settings);setExportMessage(result.warnings.length?result.warnings.join(' '):'Word document generated.')}catch(e){setExportMessage('Word export failed: '+(e instanceof Error?e.message:String(e)))}finally{setExporting(false)}}
 function set<K extends keyof PageSettings>(key:K,value:PageSettings[K]){onChange({...settings,[key]:value})}
 return <section className="print-settings"><div className="print-settings-title"><div><strong>Document-wide Formatting</strong><p>These settings apply to every week when printing. Original lesson text stays unchanged.</p></div><button onClick={()=>setShowPreview(v=>!v)}>{showPreview?'Hide':'Show'} contents preview</button></div>
 <div className="print-settings-grid">
 <label>Paper size<select value={settings.paper} onChange={e=>set('paper',e.target.value as PageSettings['paper'])}>{['A4','A5','Letter','Legal'].map(v=><option key={v}>{v}</option>)}</select></label>
 <label>Orientation<select value={settings.orientation} onChange={e=>set('orientation',e.target.value as PageSettings['orientation'])}><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select></label>
 <label>Font family<select value={settings.fontFamily} onChange={e=>set('fontFamily',e.target.value)}>{['Georgia','Arial','Times New Roman','Calibri','Cambria'].map(v=><option key={v}>{v}</option>)}</select></label>
 <label>Body font size<select value={settings.fontSize} onChange={e=>set('fontSize',Number(e.target.value))}>{[9,10,11,12,13,14,16,18].map(v=><option value={v} key={v}>{v} pt</option>)}</select></label>
 <label>Line spacing<select value={settings.lineSpacing} onChange={e=>set('lineSpacing',Number(e.target.value))}>{[1,1.15,1.3,1.4,1.5,2].map(v=><option value={v} key={v}>{v}</option>)}</select></label>
 <label>Margins<select value={settings.marginMm} onChange={e=>set('marginMm',Number(e.target.value))}><option value={12}>Narrow — 12 mm</option><option value={18}>Normal — 18 mm</option><option value={25}>Wide — 25 mm</option></select></label>
 </div>
 <div className="print-checks"><label><input type="checkbox" checked={settings.showGuide} onChange={e=>set('showGuide',e.target.checked)}/> Include teacher's guide</label><label><input type="checkbox" checked={settings.showTOC} onChange={e=>set('showTOC',e.target.checked)}/> Include contents page</label></div>
 {showPreview&&<div className="toc-preview"><strong>Contents (structure preview)</strong>{project.weeks.map((w,i)=><div key={w.id}>Week {i+1}: {w.title}</div>)}<small>Final page numbers require a pagination/export engine; they are not estimated here.</small></div>}
 <div className="export-actions"><button className="print-action" type="button" onClick={exportWord} disabled={exporting}>{exporting?"Creating Word file…":"Download Word (.docx)"}</button><button className="print-action" type="button" onClick={()=>window.print()}>Print / Save as PDF</button></div>{exportMessage&&<p role="status" className="export-message">{exportMessage}</p>}
 <p className="print-disclaimer">Use your browser's Print dialog and choose “Save as PDF”. Select the same paper size and orientation there; browser printing can vary. Word export preserves editable text, headings and tables, but image sizing and layout may need adjustment. Accurate table-of-contents page numbers are not implemented yet.</p>
 </section>
}
function GuidePrint({plan}:{plan?:LessonPlan}){if(!plan)return null;const fields:[string,string][]=[['Duration',plan.duration],['Previous Knowledge',plan.previousKnowledge],['Instructional Materials',plan.materials],['Teaching Methods',plan.methods],['Learning Objectives',plan.objectives],['Introduction',plan.introduction]];return <section className="print-guide"><h2>Part A — Teacher's Lesson Guide</h2>{fields.filter(([,value])=>value).map(([key,value])=><p key={key}><strong>{key}: </strong>{value}</p>)}{plan.presentation.length>0&&<><h3>Lesson Presentation</h3><table><thead><tr><th>Stage</th><th>Teacher's Activities</th><th>Pupils' Activities</th></tr></thead><tbody>{plan.presentation.map(p=><tr key={p.id}><td>{p.stage}</td><td>{p.teacher}</td><td>{p.pupils}</td></tr>)}</tbody></table></>}{([['Class Activity',plan.activity],['Conclusion',plan.conclusion],['Differentiated Learning',plan.differentiation],['References',plan.references],["Teacher's Reflection",plan.reflection]] as [string,string][]).filter(([,value])=>value).map(([k,v])=><p key={k}><strong>{k}: </strong>{v}</p>)}</section>}
export function PrintableDocument({settings,project}:Omit<Props,'onChange'>){
 const pageSize=settings.paper+' '+settings.orientation;
 return <><style>{'@media print{@page{size:'+pageSize+';margin:'+settings.marginMm+'mm}body{background:white!important}}'}</style>
 <div className="print-only" style={{fontFamily:settings.fontFamily,fontSize:settings.fontSize+'pt',lineHeight:settings.lineSpacing}}>
 <header className="print-cover"><h1>SEAT OF WISDOM ACADEMY</h1><h2>{project.subject||project.name}</h2><p>{project.className} — {project.term}</p><p>Lesson Notes and Teacher's Guide</p></header>
 {settings.showTOC&&<section className="print-toc"><h2>Table of Contents</h2>{project.weeks.map((w,i)=><p key={w.id}>Week {i+1} — {w.title}</p>)}</section>}
 {project.weeks.map((week,i)=><article className="print-week" key={week.id}><header className="print-running">SEAT OF WISDOM ACADEMY · {project.className} · {project.term}</header><h1>Week {i+1}: {week.title}</h1>{settings.showGuide&&<GuidePrint plan={week.plan}/>}<h2>Part B — Detailed Lesson Content</h2><div className="print-lesson-body" dangerouslySetInnerHTML={{__html:week.content}}/></article>)}
 </div></>
}
