import {createAcademicLibrary,type AcademicLibrary} from './academic';
const DB_NAME='sowa-lessons-academic';
const STORE='curriculum';
const KEY='master';
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
export async function readAcademicLibrary():Promise<AcademicLibrary>{
 const db=await openAcademicDB();
 try{
  const data=await new Promise<AcademicLibrary|undefined>((resolve,reject)=>{
   const request=db.transaction(STORE,'readonly').objectStore(STORE).get(KEY);
   request.onsuccess=()=>resolve(request.result as AcademicLibrary|undefined);
   request.onerror=()=>reject(request.error);
  });
  return data??createAcademicLibrary();
 }finally{db.close()}
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
