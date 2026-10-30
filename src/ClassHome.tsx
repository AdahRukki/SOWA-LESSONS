import React,{useState} from 'react';
import SchemeEditor from './SchemeEditor';
import type {SchemeOfWork,AcademicSubject} from './academic';
import SessionManager from './SessionManager';
import CurriculumBackup from './CurriculumBackup';
import SubjectManager from './SubjectManager';
import {ACADEMIC_CLASSES,type ClassId,type AcademicLibrary} from './academic';
type Props={library:AcademicLibrary;selected:ClassId|null;onSelect:(id:ClassId)=>void;onBack:()=>void;onOpenLegacy:()=>void;legacyCount:number;onLibraryChange:(next:AcademicLibrary)=>void;saved:boolean;saveError:string;onGenerate:(scheme:SchemeOfWork,subject:AcademicSubject)=>void};
const groups=['Nursery','Primary','Junior Secondary','Senior Secondary'] as const;
export default function ClassHome({library,selected,onSelect,onBack,onOpenLegacy,legacyCount,onLibraryChange,saved,saveError,onGenerate}:Props){
 const [openedSubject,setOpenedSubject]=useState<string|null>(null);
 const [showSessions,setShowSessions]=useState(false);
 const [showBackups,setShowBackups]=useState(false);
 const chosenSubject=library.subjects.find(x=>x.id===openedSubject&&x.classId===selected&&x.active);
 const session=library.sessions.find(s=>s.active)??library.sessions[0];
 const classInfo=ACADEMIC_CLASSES.find(c=>c.id===selected);
 return <div className="academic-home"><header className="academic-header"><div><strong>SOWA LESSONS</strong><p>Academic Library {session?'· '+session.label:''}</p></div><button type="button" onClick={()=>setShowSessions(v=>!v)}>{showSessions?'Close sessions':'Manage sessions'}</button><button type="button" onClick={()=>setShowBackups(v=>!v)}>{showBackups?"Close backups":"Backups & recovery"}</button><span className="academic-save-status" role="status">{saveError?'Save error':saved?'Saved offline':'Saving…'}</span><button type="button" onClick={onOpenLegacy}>Open existing lesson editor ({legacyCount})</button></header>
 {showBackups&&<CurriculumBackup library={library} onChange={onLibraryChange} legacyCount={legacyCount}/>}
 {showSessions&&<SessionManager library={library} onChange={onLibraryChange} classId={selected}/>}
 {!selected?<><div className="academic-intro"><h1>Select a Class</h1><p>Choose a class to view its subjects, three-term schemes of work and lesson notes.</p></div>{groups.map(group=><section key={group} className="class-group"><h2>{group}</h2><div className="class-card-grid">{ACADEMIC_CLASSES.filter(c=>c.stage===group).map(c=><button type="button" key={c.id} className="academic-class-card" onClick={()=>onSelect(c.id)}><span>{c.name}</span><small>Open class →</small></button>)}</div></section>)}</>:
 <><button className="academic-back" type="button" onClick={onBack}>← All classes</button><div className="academic-intro"><h1>{classInfo?.name}</h1><p>{session?.label||'Academic session'} · Subjects and schemes of work</p></div>{chosenSubject?<SchemeEditor library={library} subject={chosenSubject} onGenerate={onGenerate} onChange={onLibraryChange} onBack={()=>setOpenedSubject(null)}/>:<><SubjectManager library={library} classId={selected} onChange={onLibraryChange}/><section className="class-group"><h2>Scheme of Work</h2>{library.subjects.filter(x=>x.classId===selected&&x.active).map(x=><button key={x.id} type="button" onClick={()=>setOpenedSubject(x.id)}>{x.name} — Open schemes</button>)}</section></>}</>}
 </div>
}
