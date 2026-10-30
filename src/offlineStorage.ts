const DB_NAME='sowa-lessons-offline';
const STORE='documents';
const VERSION=1;
export type StoredData<T>={projects:T[];selected:string;updatedAt:string};
function openDB():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{const request=indexedDB.open(DB_NAME,VERSION);request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE)};request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)})}
export async function readOffline<T>():Promise<StoredData<T>|undefined>{const db=await openDB();try{return await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readonly');const request=tx.objectStore(STORE).get('workspace');request.onsuccess=()=>resolve(request.result as StoredData<T>|undefined);request.onerror=()=>reject(request.error)})}finally{db.close()}}
export async function writeOffline<T>(value:StoredData<T>):Promise<void>{const db=await openDB();try{await new Promise<void>((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(value,'workspace');tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)})}finally{db.close()}}
export async function requestPersistentStorage():Promise<boolean>{return !!(navigator.storage?.persist&&await navigator.storage.persist())}
