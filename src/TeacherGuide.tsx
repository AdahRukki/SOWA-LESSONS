import React from 'react';
export type LessonPlan = {
 duration:string; previousKnowledge:string; materials:string; methods:string;
 objectives:string; introduction:string; presentation:{id:string;stage:string;teacher:string;pupils:string}[];
 activity:string; conclusion:string; differentiation:string; reflection:string; references:string;
};
export const newPlan=():LessonPlan=>({
 duration:'40 minutes (suggested)',previousKnowledge:'',materials:'',methods:'Discussion, demonstration and practical activities',
 objectives:'',introduction:'',presentation:[{id:crypto.randomUUID(),stage:'Introduction',teacher:'',pupils:''},{id:crypto.randomUUID(),stage:'Step 1',teacher:'',pupils:''},{id:crypto.randomUUID(),stage:'Step 2',teacher:'',pupils:''}],
 activity:'',conclusion:'',differentiation:'',reflection:'',references:''
});
type Props={value:LessonPlan;onChange:(p:LessonPlan)=>void;weekTitle:string;onClose:()=>void};
export default function TeacherGuide({value,onChange,weekTitle,onClose}:Props){
 const field=(key:Exclude<keyof LessonPlan,'presentation'>,label:string,optional=false)=>(
 <label className="plan-field"><span>{label}{optional?' (optional)':''}</span><textarea rows={key==='objectives'?4:2} value={value[key]} onChange={e=>onChange({...value,[key]:e.target.value})} placeholder={'Enter '+label.toLowerCase()}/></label>);
 const updateStep=(id:string,key:'stage'|'teacher'|'pupils',text:string)=>onChange({...value,presentation:value.presentation.map(p=>p.id===id?{...p,[key]:text}:p)});
 return <section className="plan-panel" aria-label="Teacher lesson guide">
 <div className="plan-heading"><div><span className="plan-kicker">PART A — TEACHER'S GUIDE</span><h2>{weekTitle}</h2><p>Suggestions are editable. Empty fields are not automatically filled by AI.</p></div><button onClick={onClose} type="button">Close guide</button></div>
 <div className="plan-grid">{field('duration','Duration')}{field('previousKnowledge','Previous Knowledge')}{field('materials','Instructional Materials')}{field('methods','Teaching Methods')}</div>
 {field('objectives','Learning Objectives')}{field('introduction','Introduction / Set Induction')}
 <div className="plan-table-wrap"><h3>Lesson Presentation</h3><p>Describe what the teacher and pupils will do at each stage.</p><table className="plan-table"><thead><tr><th>Stage</th><th>Teacher's Activities</th><th>Pupils' Activities</th><th></th></tr></thead><tbody>{value.presentation.map(row=><tr key={row.id}><td><input aria-label="Stage" value={row.stage} onChange={e=>updateStep(row.id,'stage',e.target.value)}/></td><td><textarea aria-label="Teacher activities" value={row.teacher} onChange={e=>updateStep(row.id,'teacher',e.target.value)}/></td><td><textarea aria-label="Pupil activities" value={row.pupils} onChange={e=>updateStep(row.id,'pupils',e.target.value)}/></td><td><button aria-label="Remove stage" type="button" onClick={()=>onChange({...value,presentation:value.presentation.filter(p=>p.id!==row.id)})}>×</button></td></tr>)}</tbody></table>
 <button className="plan-add" type="button" onClick={()=>onChange({...value,presentation:[...value.presentation,{id:crypto.randomUUID(),stage:'New step',teacher:'',pupils:''}]})}>+ Add presentation stage</button></div>
 {field('activity','Class Activity')}{field('conclusion','Conclusion')}{field('differentiation','Differentiated Learning',true)}{field('references','Reference Materials',true)}{field('reflection',"Teacher's Reflection",true)}
 <div className="plan-footer">This guide is saved locally with its week. Part B remains the editable lesson content below.</div>
 </section>;
}
