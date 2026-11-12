import type { UserProfile } from '@hearth/shared';

const DB_NAME = 'hearth_identity_db';
const DB_VERSION = 1;
const STORE_NAME = 'identities';

// Open browser's built-in IndexedDB database
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Convert an ArrayBuffer to a hex string
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Generate a 4-digit Discord-style discriminator (e.g. 4821)
function generateDiscriminator(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export interface StoredIdentity {
  profile: UserProfile;
  keyPair: CryptoKeyPair;
}

// Generate a fresh cryptographic identity in browser
export async function createIdentity(displayName: string, accentColor: string): Promise<StoredIdentity> {
  // 1. Generate ECDSA P-256 keypair
  const keyPair = await window.crypto.subtle.generateKey(
    { name: 'ECDSA', namedCurve: 'P-256' },
    false, // Private key can never be extracted by malicious scripts
    ['sign', 'verify']
  );

  // 2. Export public key to compute user ID (SHA-256 hash)
  const rawPublicKey = await window.crypto.subtle.exportKey('raw', keyPair.publicKey);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', rawPublicKey);
  const userId = bufferToHex(hashBuffer).slice(0, 16);
  const publicKeyHex = bufferToHex(rawPublicKey);

  const profile: UserProfile = {
    id: userId,
    publicKeyHex,
    displayName: displayName.trim(),
    handle: `${displayName.trim()}#${generateDiscriminator()}`,
    accentColor,
    createdAt: Date.now()
  };

  const identity: StoredIdentity = { profile, keyPair };

  // 3. Save into IndexedDB
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ id: 'active', ...identity });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });

  return identity;
}

// Load saved identity if one already exists
export async function loadIdentity(): Promise<StoredIdentity | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get('active');
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}