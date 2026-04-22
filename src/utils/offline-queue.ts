/**
 * IndexedDB-backed offline mutation queue.
 * Stores pending PocketBase mutations while the user is offline
 * and replays them in order when connectivity is restored.
 */

export interface QueuedMutation {
  id: string;
  collection: string;
  action: "create" | "update" | "delete";
  recordId?: string;
  data: Record<string, unknown>;
  timestamp: number;
}

const DB_NAME = "steel-therapy-offline";
const STORE_NAME = "mutation-queue";
const DB_VERSION = 1;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    req.onsuccess = (e) => resolve((e.target as IDBOpenDBRequest).result);
    req.onerror = () => reject(req.error);
  });
}

export async function enqueueMutation(
  mutation: Omit<QueuedMutation, "id" | "timestamp">,
): Promise<void> {
  const db = await openDb();
  const entry: QueuedMutation = {
    ...mutation,
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    timestamp: Date.now(),
  };
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.add(entry);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getQueuedMutations(): Promise<QueuedMutation[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () =>
      resolve(
        ((req.result as QueuedMutation[]) || []).sort(
          (a, b) => a.timestamp - b.timestamp,
        ),
      );
    req.onerror = () => reject(req.error);
  });
}

export async function removeMutation(id: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
