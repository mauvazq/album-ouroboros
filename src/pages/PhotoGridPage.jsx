import { useEffect, useState } from 'react';
import { usePhotos } from '../hooks/usePhotos';
import PhotoCard from '../components/PhotoCard';
import FileUpload from '../components/FileUpload';
import PhotoDetailModal from '../components/PhotoDetailModal';
import Button from '../components/Button';
import Spinner from '../components/Spinner';

export default function PhotoGridPage({ album, onBack }) {
  const {
    photos,
    loading,
    error,
    uploading,
    selectedPhoto,
    setSelectedPhoto,
    fetchPhotos,
    uploadPhoto,
    toggleFavorite,
    moveToTrash,
    updateTitle,
  } = usePhotos('album', album?.id);

  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (album?.id) fetchPhotos();
  }, [album?.id, fetchPhotos]);

  const filteredPhotos =
    filter === 'favorites'
      ? photos.filter((p) => p.favorito)
      : photos;

  return (
    <>
      <div className="page-header">
        <div>
          <Button variant="ghost" onClick={onBack} style={{ marginBottom: '0.5rem', padding: 0 }}>
            ← Volver a álbumes
          </Button>
          <h1 className="page-title">{album?.nombre}</h1>
          {album?.descripcion && (
            <p className="page-subtitle">{album.descripcion}</p>
          )}
        </div>
      </div>

      <FileUpload onUpload={uploadPhoto} uploading={uploading} />

      <div className="filter-bar">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todas ({photos.length})
        </button>
        <button
          className={`filter-btn ${filter === 'favorites' ? 'active' : ''}`}
          onClick={() => setFilter('favorites')}
        >
          Favoritas ({photos.filter((p) => p.favorito).length})
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <Spinner />
      ) : filteredPhotos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📷</div>
          <h3>
            {filter === 'favorites'
              ? 'No hay fotos favoritas en este álbum'
              : 'Este álbum está vacío'}
          </h3>
          <p>Sube tus primeras fotos usando el área de arriba.</p>
        </div>
      ) : (
        <div className="grid grid-photos">
          {filteredPhotos.map((photo) => (
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
