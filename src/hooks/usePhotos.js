import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  getPhotosByAlbum,
  getFavoritePhotos,
  getTrashPhotos,
  uploadPhoto,
  toggleFavorite,
  moveToTrash,
  restorePhoto,
  deletePhotoPermanently,
  updatePhotoTitle,
} from '../services/photoService';

export function usePhotos(mode = 'album', albumId = null) {
  const { user } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchPhotos = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      let data;
      if (mode === 'favorites') {
        data = await getFavoritePhotos(user.uid);
      } else if (mode === 'trash') {
        data = await getTrashPhotos(user.uid);
      } else if (albumId) {
        data = await getPhotosByAlbum(user.uid, albumId);
      } else {
        data = [];
      }
      setPhotos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, mode, albumId]);

  const handleUpload = async (files) => {
    if (!user || !albumId) return;
    setUploading(true);
    setError(null);
    try {
      const uploads = Array.from(files).map((file) =>
        uploadPhoto(user.uid, albumId, file)
      );
      const results = await Promise.all(uploads);
      const newPhotos = results.map((r) => ({
        id: r.id,
        url: r.url,
        titulo: r.titulo,
        album_id: albumId,
        usuario_uid: user.uid,
        favorito: false,
        eliminada: false,
        fecha_subida: new Date().toISOString(),
      }));
      setPhotos((prev) => [...newPhotos, ...prev]);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const handleToggleFavorite = async (photo) => {
    setError(null);
    try {
      await toggleFavorite(photo.id, photo.favorito);
      if (mode === 'favorites') {
        setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
      } else {
        setPhotos((prev) =>
          prev.map((p) =>
            p.id === photo.id ? { ...p, favorito: !p.favorito } : p
          )
        );
      }
      if (selectedPhoto?.id === photo.id) {
        setSelectedPhoto((prev) => ({ ...prev, favorito: !prev.favorito }));
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleMoveToTrash = async (photo) => {
    setError(null);
    try {
      await moveToTrash(photo.id);
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
      setSelectedPhoto(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleRestore = async (photo) => {
    setError(null);
    try {
      await restorePhoto(photo.id);
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleDeletePermanently = async (photo) => {
    setError(null);
    try {
      await deletePhotoPermanently(photo);
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleUpdateTitle = async (photoId, titulo) => {
    setError(null);
    try {
      await updatePhotoTitle(photoId, titulo);
      setPhotos((prev) =>
        prev.map((p) => (p.id === photoId ? { ...p, titulo } : p))
      );
      if (selectedPhoto?.id === photoId) {
        setSelectedPhoto((prev) => ({ ...prev, titulo }));
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    photos,
    loading,
    error,
    uploading,
    selectedPhoto,
    setSelectedPhoto,
    fetchPhotos,
    uploadPhoto: handleUpload,
    toggleFavorite: handleToggleFavorite,
    moveToTrash: handleMoveToTrash,
    restorePhoto: handleRestore,
    deletePermanently: handleDeletePermanently,
    updateTitle: handleUpdateTitle,
  };
}
