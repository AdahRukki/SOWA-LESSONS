import {createAcademicLibrary,validateAcademicLibrary,type AcademicLibrary} from './academic';
import {mergeCurriculum} from './academicBackupUtils';
const DB_NAME='sowa-lessons-academic';
const STORE='curriculum';
const KEY='master';
const PRIMARY_SEED_KEY='bulk-primary-curriculum-2026-2027-v1';
const SECONDARY_SEED_KEY='secondary-curriculum-2026-2027-v1';
const VERSION=1;
function openAcademicDB():Promise<IDBDatabase>{
 return new Promise((resolve,reject)=>{
  const request=indexedDB.open(DB_NAME,VERSION);
  request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains(STORE))request.result.createObjectStore(STORE)};
  request.onsuccess=()=>resolve(request.result);
  request.onerror=()=>reject(request.error);
 });
}
/** Independent storage: never replaces or migrates legacy lesson projects implicitly. */
/**
 * Install the bundled school curriculum automatically on first launch, and
 * merge later curriculum tranches into existing libraries without replacement.
 * The input is bundled with the deployed app, never taken from untrusted user
 * uploads. Existing academic records and lesson-note projects are preserved.
 * Installation is atomic; a failed/offline fetch is retried on a later launch.
 */
export async function readAcademicLibrary():Promise<AcademicLibrary>{
 const db=await openAcademicDB();
 let current:AcademicLibrary|undefined;
 let primarySeeded=false;
 let secondarySeeded=false;
 try{
  await new Promise<void>((resolve,reject)=>{
   const tx=db.transaction(STORE,'readonly');
   const store=tx.objectStore(STORE);
   const existing=store.get(KEY);
   const primaryMarker=store.get(PRIMARY_SEED_KEY);
   const secondaryMarker=store.get(SECONDARY_SEED_KEY);
   existing.onsuccess=()=>{current=existing.result as AcademicLibrary|undefined};
   primaryMarker.onsuccess=()=>{primarySeeded=Boolean(primaryMarker.result)};
   secondaryMarker.onsuccess=()=>{secondarySeeded=Boolean(secondaryMarker.result)};
   tx.oncomplete=()=>resolve();
   tx.onerror=()=>reject(tx.error);
   tx.onabort=()=>reject(tx.error);
  });
 }finally{db.close()}
 const library=current??createAcademicLibrary();
 if(primarySeeded&&secondarySeeded)return library;
 try{
  let merged=library;
  if(!primarySeeded){
   const response=await fetch(import.meta.env.BASE_URL+'curriculum/preprimary-primary-2026-2027.json');
   if(!response.ok)throw Error('Primary curriculum source HTTP '+response.status);
   const incoming=await response.json() as AcademicLibrary;
   if(incoming.version!==1||!Array.isArray(incoming.classes)||!Array.isArray(incoming.subjects)||!Array.isArray(incoming.schemes)||incoming.schemes.length!==282)throw Error('Incomplete primary curriculum source');
   const problems=validateAcademicLibrary(incoming);
   if(problems.length)throw Error(problems[0]);
   merged=mergeCurriculum(merged,incoming).library;
  }
  if(!secondarySeeded){
   const response=await fetch(import.meta.env.BASE_URL+'curriculum/secondary-2026-2027.json');
   if(!response.ok)throw Error('Secondary curriculum source HTTP '+response.status);
   const incoming=await response.json() as AcademicLibrary;
   if(incoming.version!==1||!Array.isArray(incoming.classes)||!Array.isArray(incoming.subjects)||!Array.isArray(incoming.schemes)||incoming.schemes.length!==145)throw Error('Incomplete secondary curriculum source');
   const problems=validateAcademicLibrary(incoming);
   if(problems.length)throw Error(problems[0]);
   merged=mergeCurriculum(merged,incoming).library;
  }
  const validation=validateAcademicLibrary(merged);
  if(validation.length)throw Error(validation[0]);
  const writeDb=await openAcademicDB();
  try{
   await new Promise<void>((resolve,reject)=>{
    const tx=writeDb.transaction(STORE,'readwrite');
    const store=tx.objectStore(STORE);
    store.put(merged,KEY);
    if(!primarySeeded)store.put({source:'preprimary-primary-2026-2027',schemeCount:282},PRIMARY_SEED_KEY);
    if(!secondarySeeded)store.put({source:'secondary-2026-2027',schemeCount:145},SECONDARY_SEED_KEY);
    tx.oncomplete=()=>resolve();
    tx.onerror=()=>reject(tx.error);
    tx.onabort=()=>reject(tx.error);
   });
  }finally{writeDb.close()}
  return merged;
 }catch(e){
  // The app stays available offline and will retry when the seed is accessible.
  console.warn('Automatic curriculum installation will be retried:',e);
  return library;
 }
}
export async function writeAcademicLibrary(value:AcademicLibrary):Promise<void>{
 const db=await openAcademicDB();
 try{
  await new Promise<void>((resolve,reject)=>{
   const tx=db.transaction(STORE,'readwrite');
   tx.objectStore(STORE).put(value,KEY);
   tx.oncomplete=()=>resolve();
   tx.onerror=()=>reject(tx.error);
   tx.onabort=()=>reject(tx.error);
  });
 }finally{db.close()}
}
