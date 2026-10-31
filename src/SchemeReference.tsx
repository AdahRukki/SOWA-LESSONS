import {useState} from 'react';
type Row={week:number;topic:string;content:string};
type Props={rows?:Row[];currentWeek:number;term:string};
export default function SchemeReference({rows,currentWeek,term}:Props){
 const [open,setOpen]=useState(true);
 const [allWeeks,setAllWeeks]=useState(false);
 if(!rows?.length)return <section className="scheme-reference"><strong>Scheme of Work Reference</strong><p>No saved scheme snapshot is attached to this document. New lesson documents generated from approved schemes include one automatically.</p></section>;
 const matches=rows.filter(row=>row.week===currentWeek);
 const shown=allWeeks?rows:matches;
 return <section className="scheme-reference" aria-label="Scheme of Work reference">
 <div className="scheme-reference-heading"><div><strong>Scheme of Work Reference</strong><small>{term} · Read-only source snapshot</small></div><button type="button" onClick={()=>setOpen(v=>!v)} aria-expanded={open}>{open?'Hide':'Show'}</button></div>
 {open&&<><div className="scheme-reference-controls"><span>Week {currentWeek} · {matches.length} topic(s)</span><label><input type="checkbox" checked={allWeeks} onChange={e=>setAllWeeks(e.target.checked)}/> Show entire term</label></div>
 {shown.length?<div className="scheme-reference-rows">{shown.map((r,i)=><div key={i}><b>Week {r.week}: {r.topic}</b><p>{r.content||'No content outline entered.'}</p></div>)}</div>:<p>No source scheme row for this week. View the entire term to check other weeks.</p>}
 <small className="scheme-reference-notice">Reference only — editing lesson notes does not change the approved Scheme of Work.</small></>}
 </section>;
}
