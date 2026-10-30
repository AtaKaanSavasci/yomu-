import { hydrateState } from './model.js';
const DB_NAME = 'yomu-local-v1';
let db;
export class ConflictError extends Error {}
export async function openStore() {
  db = await new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore('app');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Database blocked by another tab'));
  });
  return new Promise((resolve, reject) => {
    const request = db.transaction('app').objectStore('app').get('state');
    request.onsuccess = () => {try{resolve(hydrateState(request.result));}catch(e){reject(e);}};
    request.onerror = () => reject(request.error);
  });
}
export async function saveState(state) {
  // Compare-and-swap inside one read/write transaction prevents another tab silently overwriting answers.
  const revision = state.revision || 0;
  const candidate = { ...structuredClone(state), revision: revision + 1 };
  return new Promise((resolve, reject) => {
    const tx = db.transaction('app', 'readwrite'), store = tx.objectStore('app');
    let conflict = false;
    const get = store.get('state');
    get.onsuccess = () => {
      if ((get.result?.revision || 0) !== revision) { conflict = true; tx.abort(); }
      else store.put(candidate, 'state');
    };
    tx.oncomplete = () => resolve(candidate);
    tx.onerror = () => reject(tx.error || new Error('Save failed'));
    tx.onabort = () => reject(conflict ? new ConflictError('State changed in another tab') : tx.error || new Error('Save aborted'));
  });
}
