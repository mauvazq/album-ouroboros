import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  getAlbumsByUser,
  createAlbum,
  updateAlbum,
  deleteAlbum,
} from '../services/albumService';

export function useAlbums() {
  const { user } = useAuth();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAlbums = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getAlbumsByUser(user.uid);
      setAlbums(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleCreateAlbum = async (albumData) => {
    if (!user) return;
    setError(null);
    try {
      const newAlbum = await createAlbum(user.uid, albumData);
      setAlbums((prev) => [{ ...newAlbum, fecha_creacion: new Date().toISOString() }, ...prev]);
      return newAlbum;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleUpdateAlbum = async (albumId, albumData) => {
    setError(null);
    try {
      await updateAlbum(albumId, albumData);
      setAlbums((prev) =>
        prev.map((a) => (a.id === albumId ? { ...a, ...albumData } : a))
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleDeleteAlbum = async (albumId) => {
    setError(null);
    try {
      await deleteAlbum(albumId);
      setAlbums((prev) => prev.filter((a) => a.id !== albumId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    albums,
    loading,
    error,
    fetchAlbums,
    createAlbum: handleCreateAlbum,
    updateAlbum: handleUpdateAlbum,
    deleteAlbum: handleDeleteAlbum,
  };
}
