import { useEffect } from 'react';
import { usePhotos } from '../hooks/usePhotos';
import PhotoCard from '../components/PhotoCard';
import PhotoDetailModal from '../components/PhotoDetailModal';
import Spinner from '../components/Spinner';

export default function FavoritesPage() {
  const {
    photos,
    loading,
    error,
    selectedPhoto,
    setSelectedPhoto,
    fetchPhotos,
    toggleFavorite,
    moveToTrash,
    updateTitle,
  } = usePhotos('favorites');

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Favoritos</h1>
          <p className="page-subtitle">
            {photos.length} {photos.length === 1 ? 'foto favorita' : 'fotos favoritas'}
          </p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <Spinner />
      ) : photos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">❤️</div>
          <h3>No tienes fotos favoritas</h3>
          <p>Marca fotos como favoritas desde cualquier álbum.</p>
        </div>
      ) : (
        <div className="grid grid-photos">
          {photos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onClick={setSelectedPhoto}
            />
          ))}
        </div>
      )}

      <PhotoDetailModal
        photo={selectedPhoto}
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onToggleFavorite={toggleFavorite}
        onMoveToTrash={moveToTrash}
        onUpdateTitle={updateTitle}
      />
    </>
  );
}
