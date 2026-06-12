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
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/firebase';

const COLLECTION = 'fotos';

export async function getPhotosByAlbum(uid, albumId) {
  const q = query(
    collection(db, COLLECTION),
    where('usuario_uid', '==', uid),
    where('album_id', '==', albumId),
    where('eliminada', '==', false),
    orderBy('fecha_subida', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getFavoritePhotos(uid) {
  const q = query(
    collection(db, COLLECTION),
    where('usuario_uid', '==', uid),
    where('favorito', '==', true),
    where('eliminada', '==', false),
    orderBy('fecha_subida', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getTrashPhotos(uid) {
  const q = query(
    collection(db, COLLECTION),
    where('usuario_uid', '==', uid),
    where('eliminada', '==', true),
    orderBy('fecha_subida', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function uploadPhoto(uid, albumId, file, titulo = '') {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `fotos/${uid}/${albumId}/${timestamp}_${safeName}`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  const docRef = await addDoc(collection(db, COLLECTION), {
    album_id: albumId,
    usuario_uid: uid,
    url,
    storage_path: storagePath,
    titulo: titulo || file.name,
    favorito: false,
    eliminada: false,
    fecha_subida: new Date().toISOString(),
  });

  return { id: docRef.id, url, titulo: titulo || file.name };
}

export async function toggleFavorite(photoId, currentValue) {
  await updateDoc(doc(db, COLLECTION, photoId), { favorito: !currentValue });
}

export async function moveToTrash(photoId) {
  await updateDoc(doc(db, COLLECTION, photoId), { eliminada: true });
}

export async function restorePhoto(photoId) {
  await updateDoc(doc(db, COLLECTION, photoId), { eliminada: false });
}

export async function deletePhotoPermanently(photo) {
  if (photo.storage_path) {
    try {
      await deleteObject(ref(storage, photo.storage_path));
    } catch {
      // File may already be deleted
    }
  }
  await deleteDoc(doc(db, COLLECTION, photo.id));
}

export async function updatePhotoTitle(photoId, titulo) {
  await updateDoc(doc(db, COLLECTION, photoId), { titulo });
}

export async function deletePhotosByAlbum(albumId) {
  const q = query(collection(db, COLLECTION), where('album_id', '==', albumId));
  const snapshot = await getDocs(q);
  const deletes = snapshot.docs.map(async (d) => {
    const photo = { id: d.id, ...d.data() };
    await deletePhotoPermanently(photo);
  });
  await Promise.all(deletes);
}
