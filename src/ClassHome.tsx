import React from 'react';
import {ACADEMIC_CLASSES,type ClassId,type AcademicLibrary} from './academic';
type Props={library:AcademicLibrary;selected:ClassId|null;onSelect:(id:ClassId)=>void;onBack:()=>void;onOpenLegacy:()=>void;legacyCount:number};
const groups=['Nursery','Primary','Junior Secondary','Senior Secondary'] as const;
export default function ClassHome({library,selected,onSelect,onBack,onOpenLegacy,legacyCount}:Props){
 const session=library.sessions.find(s=>s.active)??library.sessions[0];
 const classInfo=ACADEMIC_CLASSES.find(c=>c.id===selected);
 const subjects=library.subjects.filter(s=>s.classId===selected&&s.active).sort((a,b)=>a.order-b.order);
 return <div className="academic-home"><header className="academic-header"><div><strong>SOWA LESSONS</strong><p>Academic Library {session?'· '+session.label:''}</p></div><button type="button" onClick={onOpenLegacy}>Open existing lesson editor ({legacyCount})</button></header>
 {!selected?<><div className="academic-intro"><h1>Select a Class</h1><p>Choose a class to view its subjects, three-term schemes of work and lesson notes.</p></div>{groups.map(group=><section key={group} className="class-group"><h2>{group}</h2><div className="class-card-grid">{ACADEMIC_CLASSES.filter(c=>c.stage===group).map(c=><button type="button" key={c.id} className="academic-class-card" onClick={()=>onSelect(c.id)}><span>{c.name}</span><small>Open class →</small></button>)}</div></section>)}</>:
 <><button className="academic-back" type="button" onClick={onBack}>← All classes</button><div className="academic-intro"><h1>{classInfo?.name}</h1><p>{session?.label||'Academic session'} · Subjects and schemes of work</p></div><section className="class-group"><h2>Subjects</h2>{subjects.length===0?<div className="academic-empty"><strong>No subjects assigned yet</strong><p>Class-specific subject management is coming in Module 3. Your existing lesson notes remain accessible through the button above.</p></div>:<div className="class-card-grid">{subjects.map(subject=><div className="academic-class-card" key={subject.id}><span>{subject.name}</span><small>{library.schemes.filter(s=>s.subjectId===subject.id&&s.sessionId===session?.id).length} of 3 term schemes created</small></div>)}</div>}</section></>}
 </div>
}
