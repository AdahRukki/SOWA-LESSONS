import React from 'react';
import SubjectManager from './SubjectManager';
import {ACADEMIC_CLASSES,type ClassId,type AcademicLibrary} from './academic';
type Props={library:AcademicLibrary;selected:ClassId|null;onSelect:(id:ClassId)=>void;onBack:()=>void;onOpenLegacy:()=>void;legacyCount:number;onLibraryChange:(next:AcademicLibrary)=>void};
const groups=['Nursery','Primary','Junior Secondary','Senior Secondary'] as const;
export default function ClassHome({library,selected,onSelect,onBack,onOpenLegacy,legacyCount,onLibraryChange}:Props){
 const session=library.sessions.find(s=>s.active)??library.sessions[0];
 const classInfo=ACADEMIC_CLASSES.find(c=>c.id===selected);
 return <div className="academic-home"><header className="academic-header"><div><strong>SOWA LESSONS</strong><p>Academic Library {session?'· '+session.label:''}</p></div><button type="button" onClick={onOpenLegacy}>Open existing lesson editor ({legacyCount})</button></header>
 {!selected?<><div className="academic-intro"><h1>Select a Class</h1><p>Choose a class to view its subjects, three-term schemes of work and lesson notes.</p></div>{groups.map(group=><section key={group} className="class-group"><h2>{group}</h2><div className="class-card-grid">{ACADEMIC_CLASSES.filter(c=>c.stage===group).map(c=><button type="button" key={c.id} className="academic-class-card" onClick={()=>onSelect(c.id)}><span>{c.name}</span><small>Open class →</small></button>)}</div></section>)}</>:
 <><button className="academic-back" type="button" onClick={onBack}>← All classes</button><div className="academic-intro"><h1>{classInfo?.name}</h1><p>{session?.label||'Academic session'} · Subjects and schemes of work</p></div><SubjectManager library={library} classId={selected} onChange={onLibraryChange}/></>}
 </div>
}
