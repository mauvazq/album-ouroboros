import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { deletePhotosByAlbum } from './photoService';

const COLLECTION = 'albumes';

export async function getAlbumsByUser(uid) {
  const q = query(
    collection(db, COLLECTION),
    where('usuario_uid', '==', uid),
    orderBy('fecha_creacion', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createAlbum(uid, { nombre, descripcion, portada_url = '' }) {
  const docRef = await addDoc(collection(db, COLLECTION), {
    usuario_uid: uid,
    nombre,
    descripcion: descripcion || '',
    portada_url,
    fecha_creacion: new Date().toISOString(),
  });
  return { id: docRef.id, usuario_uid: uid, nombre, descripcion, portada_url };
}

export async function updateAlbum(albumId, data) {
  const ref = doc(db, COLLECTION, albumId);
  await updateDoc(ref, data);
}

export async function deleteAlbum(albumId) {
  await deletePhotosByAlbum(albumId);
  await deleteDoc(doc(db, COLLECTION, albumId));
}
