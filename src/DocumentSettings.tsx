import React,{useEffect,useMemo,useState} from 'react';
import type {LessonPlan} from './TeacherGuide';
import {downloadDocx} from './docxExport';
import {inspectProject} from './exportPreflight';
import type {CoverageReport} from './schemeCoverage';
export type PageSettings={paper:'A4'|'A5'|'Letter'|'Legal';orientation:'portrait'|'landscape';fontFamily:string;fontSize:number;lineSpacing:number;marginMm:number;showGuide:boolean;showTOC:boolean};
export const DEFAULT_SETTINGS:PageSettings={paper:'A4',orientation:'portrait',fontFamily:'Georgia',fontSize:12,lineSpacing:1.4,marginMm:18,showGuide:true,showTOC:true};
export type PrintableWeek={id:string;title:string;content:string;plan?:LessonPlan;weekNumber?:number};
type Props={settings:PageSettings;onChange:(value:PageSettings)=>void;project:{name:string;className:string;subject:string;term:string;weeks:PrintableWeek[];schemeSnapshot?:{week:number;topic:string;content:string}[]};coverage?:CoverageReport;currentWeekId?:string;onPrintSelection?:(weekIds:string[])=>void};
export function DocumentSettings({settings,onChange,project,coverage,currentWeekId,onPrintSelection}:Props){
 const [showPreview,setShowPreview]=useState(false);
 const [exporting,setExporting]=useState(false);
 const [exportMessage,setExportMessage]=useState('');
 const [showChecks,setShowChecks]=useState(false);
 const [exportScope,setExportScope]=useState<'all'|'current'|'selected'>('all');
 const [selectedWeekIds,setSelectedWeekIds]=useState<string[]>(()=>project.weeks.map(w=>w.id));
 const selectedPrintIds=useMemo(()=>exportScope==='current'?[currentWeekId??project.weeks[0]?.id].filter(Boolean) as string[]:exportScope==='selected'?selectedWeekIds:project.weeks.map(w=>w.id),[exportScope,currentWeekId,selectedWeekIds,project.weeks]);
 useEffect(()=>{onPrintSelection?.(selectedPrintIds)},[onPrintSelection,selectedPrintIds]);
 useEffect(()=>{const valid=new Set(project.weeks.map(w=>w.id));setSelectedWeekIds(ids=>[...ids.filter(id=>valid.has(id)),...project.weeks.filter(w=>!ids.includes(w.id)).map(w=>w.id)])},[project.weeks]);
 const exportProject={...project,weeks:project.weeks.filter(w=>selectedPrintIds.includes(w.id)).map(w=>({...w,weekNumber:project.weeks.findIndex(x=>x.id===w.id)+1})),schemeSnapshot:project.schemeSnapshot?.filter(row=>selectedPrintIds.includes(project.weeks[row.week-1]?.id??''))};
 const issues=inspectProject(exportProject,settings);
 const coverageWarning=coverage&&coverage.missing.length?coverage.missing.length+' scheme items are not mentioned in the lesson notes. Review coverage before exporting.':'';
 async function exportWord(){if(!exportProject.weeks.length){setExportMessage('Select at least one week to export.');return}const errors=issues.filter(x=>x.severity==='error');if(errors.length){setShowChecks(true);setExportMessage('Fix required export errors before downloading.');return}setExporting(true);setExportMessage('');try{const result=await downloadDocx(exportProject,settings);setExportMessage(result.warnings.length?result.warnings.join(' '):'Word document generated.')}catch(e){setExportMessage('Word export failed: '+(e instanceof Error?e.message:String(e)))}finally{setExporting(false)}}
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
 {coverageWarning&&<p role="status" className="export-message">{coverageWarning}</p>}
 <div className="export-scope"><label>Export scope<select value={exportScope} onChange={e=>setExportScope(e.target.value as typeof exportScope)}><option value="all">Whole subject and term</option><option value="current">Current week only</option><option value="selected">Choose weeks</option></select></label>{exportScope==='selected'&&<div className="export-week-list">{project.weeks.map((w,i)=><label key={w.id}><input type="checkbox" checked={selectedWeekIds.includes(w.id)} onChange={e=>setSelectedWeekIds(ids=>e.target.checked?[...ids,w.id]:ids.filter(id=>id!==w.id))}/>Week {i+1}: {w.title}</label>)}</div>}</div>
 {showPreview&&<div className="toc-preview"><strong>Preview · {exportProject.weeks.length} week(s)</strong>{exportProject.weeks.map((w,i)=><article className="export-week-preview" key={w.id}><b>Week {w.weekNumber}: {w.title}</b><div dangerouslySetInnerHTML={{__html:w.content}}/></article>)}<small>Preview shows lesson content and week selection. Final page breaks can vary between Word and browser PDF.</small></div>}
 <button type="button" className="preflight-button" onClick={()=>setShowChecks(v=>!v)}>{showChecks?'Hide':'Run'} export checks ({issues.length})</button>{showChecks&&<div className="preflight-results">{issues.length===0?<p>No export issues detected by basic checks. Inspect the finished Word/PDF manually.</p>:issues.map((issue,i)=><p key={i}><strong>{issue.severity.toUpperCase()}{issue.week?' · Week '+issue.week:''}</strong> — {issue.message}</p>)}</div>}<div className="export-actions"><button className="print-action" type="button" onClick={exportWord} disabled={exporting}>{exporting?"Creating Word file…":"Download Word (.docx)"}</button><button className="print-action" type="button" onClick={()=>window.print()}>Print / Save as PDF</button></div>{exportMessage&&<p role="status" className="export-message">{exportMessage}</p>}
 <p className="print-disclaimer">Export the current week, selected weeks, or the whole subject and term. Use your browser's Print dialog and choose “Save as PDF”. Word export preserves editable text, headings and tables. For Word contents page numbers, update the table of contents in Microsoft Word.</p>
 </section>
}
function GuidePrint({plan}:{plan?:LessonPlan}){if(!plan)return null;const fields:[string,string][]=[['Duration',plan.duration],['Previous Knowledge',plan.previousKnowledge],['Instructional Materials',plan.materials],['Teaching Methods',plan.methods],['Learning Objectives',plan.objectives],['Introduction',plan.introduction]];return <section className="print-guide"><h2>Part A — Teacher's Lesson Guide</h2>{fields.filter(([,value])=>value).map(([key,value])=><p key={key}><strong>{key}: </strong>{value}</p>)}{plan.presentation.length>0&&<><h3>Lesson Presentation</h3><table><thead><tr><th>Stage</th><th>Teacher's Activities</th><th>Pupils' Activities</th></tr></thead><tbody>{plan.presentation.map(p=><tr key={p.id}><td>{p.stage}</td><td>{p.teacher}</td><td>{p.pupils}</td></tr>)}</tbody></table></>}{([['Class Activity',plan.activity],['Conclusion',plan.conclusion],['Differentiated Learning',plan.differentiation],['References',plan.references],["Teacher's Reflection",plan.reflection]] as [string,string][]).filter(([,value])=>value).map(([k,v])=><p key={k}><strong>{k}: </strong>{v}</p>)}</section>}
export function PrintableDocument({settings,project,printWeekIds}:Omit<Props,'onChange'|'coverage'|'currentWeekId'|'onPrintSelection'> & {printWeekIds?:string[]}){
 const pageSize=settings.paper+' '+settings.orientation;
 const printableWeeks=printWeekIds?project.weeks.filter(w=>printWeekIds.includes(w.id)):project.weeks;
 const printableNumbers=new Set(printableWeeks.map(w=>project.weeks.findIndex(x=>x.id===w.id)+1));
 return <><style>{'@media print{@page{size:'+pageSize+';margin:'+settings.marginMm+'mm}body{background:white!important}}'}</style>
 <div className="print-only" style={{fontFamily:settings.fontFamily,fontSize:settings.fontSize+'pt',lineHeight:settings.lineSpacing}}>
 <header className="print-cover"><h1>SEAT OF WISDOM ACADEMY</h1><h2>{project.subject||project.name}</h2><p>{project.className} — {project.term}</p><p>Lesson Notes and Teacher's Guide</p></header>
 {project.schemeSnapshot?.some(r=>printableNumbers.has(r.week))?<section className="print-scheme"><h2>Scheme of Work — {project.term}</h2><table><thead><tr><th>Week</th><th>Topic</th><th>Content</th></tr></thead><tbody>{project.schemeSnapshot.filter(r=>printableNumbers.has(r.week)).map((r,i)=><tr key={i}><td>{r.week}</td><td>{r.topic}</td><td>{r.content}</td></tr>)}</tbody></table></section>:null}
 {settings.showTOC&&<section className="print-toc"><h2>Table of Contents</h2>{printableWeeks.map(w=><p key={w.id}>Week {project.weeks.findIndex(x=>x.id===w.id)+1} — {w.title}</p>)}</section>}
 {printableWeeks.map(week=><article className="print-week" key={week.id}><header className="print-running">SEAT OF WISDOM ACADEMY · {project.className} · {project.term}</header><h1>Week {project.weeks.findIndex(x=>x.id===week.id)+1}: {week.title}</h1>{settings.showGuide&&<GuidePrint plan={week.plan}/>}<h2>Part B — Detailed Lesson Content</h2><div className="print-lesson-body" dangerouslySetInnerHTML={{__html:week.content}}/></article>)}
 </div></>
}
