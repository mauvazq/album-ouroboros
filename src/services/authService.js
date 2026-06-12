import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

export async function registerUser(email, password, nombre) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const { uid } = credential.user;

  await setDoc(doc(db, 'usuarios', uid), {
    uid,
    nombre,
    email,
    fecha_registro: new Date().toISOString(),
  });

  return credential.user;
}

export async function loginUser(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function logoutUser() {
  await signOut(auth);
}

export function subscribeToAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'usuarios', uid));
  if (!snap.exists()) return null;
  return snap.data();
}
