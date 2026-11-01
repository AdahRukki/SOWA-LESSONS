import {useState} from 'react';
import SchemeEditor from './SchemeEditor';
import AcademicLessons from './AcademicLessons';
import ClassManager from './ClassManager';
import CurriculumInstaller from './CurriculumInstaller';
import CurriculumAudit from './CurriculumAudit';
import SessionManager from './SessionManager';
import CurriculumBackup from './CurriculumBackup';
import LegacyMigration,{type LegacyProject} from './LegacyMigration';
import SubjectManager from './SubjectManager';
import SubjectOverview from './SubjectOverview';
import TemplateManager from './TemplateManager';
import preloaded from './preloadedCurriculum.json';
import {getClasses,type ClassId,type AcademicLibrary,type SchemeOfWork,type AcademicSubject,type Term} from './academic';

type Props={library:AcademicLibrary;selected:ClassId|null;onSelect:(id:ClassId)=>void;onBack:()=>void;onOpenLegacy:()=>void;legacyCount:number;onLibraryChange:(next:AcademicLibrary)=>void;saved:boolean;saveError:string;onGenerate:(scheme:SchemeOfWork,subject:AcademicSubject)=>void;legacyProjects:LegacyProject[];onOpenLesson:(id:string)=>void;onMigrate:(projectId:string,classId:ClassId,subjectId:string,term:Term,sessionId:string)=>void};
type Area='classes'|'curriculum'|'review'|'settings';
const groups=['Nursery','Primary','Junior Secondary','Senior Secondary'];
const names=(classId:string)=>preloaded.schemes.filter(s=>s.class_id===classId);
export default function ClassHome({library,selected,onSelect,onBack,onOpenLegacy,legacyCount,onLibraryChange,saved,saveError,onGenerate,legacyProjects,onMigrate,onOpenLesson}:Props){
 const [area,setArea]=useState<Area>('classes');
 const [tool,setTool]=useState<'sessions'|'classes'|'backup'|'migration'|'templates'|null>(null);
 const [openedSubject,setOpenedSubject]=useState<string|null>(null);
 const [editorTerm,setEditorTerm]=useState<Term>('First Term');
 const [overviewSubject,setOverviewSubject]=useState<string|null>(null);
 const [classQuery,setClassQuery]=useState('');
 const [curriculumFilter,setCurriculumFilter]=useState<{classId:string;subject:string}|null>(null);
 const classes=getClasses(library),session=library.sessions.find(s=>s.active)??library.sessions[0];
 const classInfo=classes.find(c=>c.id===selected);
 const chosenSubject=library.subjects.find(s=>s.id===openedSubject&&s.classId===selected&&s.active);
 const bundled=selected?names(selected):[];
 const classBundledSubjects=[...new Set(bundled.map(s=>s.subject))].sort();
 const installed=selected?library.subjects.filter(s=>s.classId===selected&&s.active):[];
 const allStages=[...new Set([...groups,...classes.map(c=>c.stage)])];
 const go=(next:Area)=>{setArea(next);setTool(null);setOpenedSubject(null);setOverviewSubject(null);setCurriculumFilter(null);if(next!=='classes')onBack()};
 const viewCurriculum=(classId:string,subject:string)=>{setCurriculumFilter({classId,subject});setArea('curriculum');setTool(null);setOpenedSubject(null);onBack()};
 const enterClass=(id:ClassId)=>{setArea('classes');setOpenedSubject(null);setOverviewSubject(null);onSelect(id)};
 const back=()=>{if(openedSubject){setOpenedSubject(null);return}if(overviewSubject){setOverviewSubject(null);return}onBack()};
 const classSchemeSummary=(id:string)=>{const rows=library.schemes.filter(s=>s.classId===id&&s.sessionId===session?.id);return {schemes:rows.length,draft:rows.filter(s=>s.status!=='approved').length,approved:rows.filter(s=>s.status==='approved').length,topics:rows.reduce((n,s)=>n+s.weeks.reduce((m,w)=>m+w.topics.length,0),0)}};
 return <div className="academic-home academic-studio">
  <header className="studio-topbar"><div className="studio-logo"><span className="studio-mark" aria-hidden="true">S</span><div><strong>SOWA Lessons</strong><small>Curriculum &amp; Publishing Studio</small></div></div><div className="studio-topbar-right"><span>{session?.label??'No session'}</span><span className="academic-save-status" role="status">{saveError?'Save error':saved?'Saved offline':'Saving…'}</span></div></header>
  <nav className="studio-main-nav" aria-label="Main navigation">
   <button type="button" className={area==='classes'?'active':''} onClick={()=>go('classes')}>Classes &amp; Subjects</button>
   <button type="button" className={area==='curriculum'?'active':''} onClick={()=>go('curriculum')}>Import &amp; Library <span>{preloaded.schemes.length}</span></button>
   <button type="button" className={area==='review'?'active':''} onClick={()=>go('review')}>Review &amp; Approve <span>{library.schemes.filter(s=>s.status!=='approved'&&s.sessionId===session?.id).length}</span></button>
   <button type="button" className={area==='settings'?'active':''} onClick={()=>go('settings')}>Settings &amp; Tools</button>
  </nav>
  {area==='settings'?<section className="studio-settings"><div className="academic-intro"><h1>Settings &amp; Tools</h1><p>Manage academic sessions, classes, backups and legacy lesson notes.</p></div><div className="studio-tool-grid">
   <button type="button" onClick={()=>setTool('sessions')}>Academic Sessions<small>Select or create a school year</small></button>
   <button type="button" onClick={()=>setTool('classes')}>Manage Classes<small>Rename, reorder, add or hide classes</small></button>
   <button type="button" onClick={()=>setTool('backup')}>Backups &amp; Recovery<small>Protect or restore curriculum</small></button>
   <button type="button" onClick={()=>setTool('templates')}>Lesson Templates<small>Create and manage reusable lesson-note layouts</small></button>
   <button type="button" onClick={()=>setTool('migration')}>Migrate Old Lessons<small>Organize lessons made previously</small></button>
   <button type="button" onClick={onOpenLegacy}>Open Legacy Editor<small>{legacyCount} saved projects</small></button>
  </div>
   {tool==='sessions'&&<SessionManager library={library} onChange={onLibraryChange} classId={selected}/>}
   {tool==='classes'&&<ClassManager library={library} onChange={onLibraryChange}/>}
   {tool==='backup'&&<CurriculumBackup library={library} onChange={onLibraryChange} legacyCount={legacyCount}/>}
   {tool==='templates'&&<TemplateManager/>}
   {tool==='migration'&&<LegacyMigration projects={legacyProjects} library={library} onMigrate={onMigrate}/>}
  </section>:area==='review'?<><div className="academic-intro"><span className="studio-eyebrow">WORKFLOW</span><h1>Review &amp; approve schemes</h1><p>ChatGPT-prepared and imported topics appear under a class when the class, subject and session are mapped. Use Approve all pending schemes for a one-click review-status update; lesson notes can also be started directly from draft topics.</p></div><CurriculumAudit library={library} onChange={onLibraryChange}/></>:area==='curriculum'?<><div className="academic-intro"><span className="studio-eyebrow">IMPORT &amp; LIBRARY</span><h1>Bring schemes into the Studio</h1><p>Upload extracted JSON or browse bundled topics. Check the class, subject and term before installing. Installed schemes are drafts until approved.</p></div><CurriculumInstaller library={library} onChange={onLibraryChange} initialClassId={curriculumFilter?.classId} initialSubject={curriculumFilter?.subject}/></>:!selected?<><div className="academic-intro"><span className="studio-eyebrow">ACADEMIC WORKSPACE</span><h1>Classes &amp; Subjects</h1><p>Choose a class to see available subjects, schemes of work and lesson notes.</p></div>
   <div className="studio-overview"><div><strong>{classes.filter(c=>c.active).length}</strong><span>Active classes</span></div><div><strong>{library.schemes.filter(s=>s.sessionId===session?.id).length}</strong><span>Term schemes in {session?.label??'active session'}</span></div><div><strong>{library.subjects.filter(s=>s.active).length}</strong><span>Installed subjects</span></div></div>
   <label className="studio-class-search">Find a class<input type="search" value={classQuery} onChange={e=>setClassQuery(e.target.value)} placeholder="Search classes…"/></label>
   {allStages.map(group=>{const visible=classes.filter(c=>c.stage===group&&c.active&&c.name.toLowerCase().includes(classQuery.trim().toLowerCase()));return visible.length?<section className="class-group" key={group}><h2>{group}</h2><div className="class-card-grid">{visible.map(c=>{const summary=classSchemeSummary(c.id);return <button type="button" key={c.id} className="academic-class-card" onClick={()=>enterClass(c.id)}><span>{c.name}</span><small>{summary.schemes} term schemes · {summary.draft} drafts · {summary.approved} approved · {summary.topics} topics</small></button>})}</div></section>:null})}
  </>:<><button type="button" className="academic-back" onClick={back}>{(openedSubject||overviewSubject)?'← Back to subjects':'← All classes'}</button><div className="academic-intro"><span className="studio-eyebrow">{classInfo?.stage??'CLASS'}</span><h1>{classInfo?.name}</h1><p>{session?.label??'Academic session'} · {classBundledSubjects.length} available subjects · {installed.length} installed subjects</p></div>
   {overviewSubject&&!chosenSubject?<SubjectOverview classId={classInfo?.id??''} subjectName={overviewSubject} library={library} lessons={legacyProjects} onOpenLesson={onOpenLesson} onGenerate={onGenerate} onEdit={(id,term)=>{setEditorTerm(term);setOverviewSubject(null);setOpenedSubject(id)}} onBrowse={name=>viewCurriculum(classInfo?.id??'',name)}/>:chosenSubject?<><AcademicLessons library={library} classId={chosenSubject.classId} subjectId={chosenSubject.id} lessons={legacyProjects} onOpen={onOpenLesson}/><SchemeEditor key={chosenSubject.id+'-'+editorTerm} initialTerm={editorTerm} library={library} subject={chosenSubject} onGenerate={onGenerate} onChange={onLibraryChange} onBack={()=>setOpenedSubject(null)}/></>:<>
   <section className="class-group"><h2>Subjects in this class</h2><p className="studio-hint">Installed subjects can be edited. Bundled subjects are available to preview and install from the Curriculum Library.</p>
   <div className="studio-subject-grid">{[...new Set([...installed.map(s=>s.name),...classBundledSubjects])].sort().map(name=>{const subject=installed.find(s=>s.name.toLowerCase()===name.toLowerCase());const entries=bundled.filter(s=>s.subject===name);return <div className="studio-subject-card" key={name}><div><strong>{name}</strong><small>{subject?'Installed':'Available in library'}{entries.length?' · '+entries.length+' term(s) bundled':''}</small></div><button type="button" onClick={()=>setOverviewSubject(name)}>Open subject</button></div>})}</div>
   {!installed.length&&!classBundledSubjects.length&&<p className="academic-empty">No curriculum for this class yet. You can add a subject below.</p>}</section>
   <SubjectManager library={library} classId={selected} onChange={onLibraryChange}/>
   </>}
  </>}
 </div>
}
