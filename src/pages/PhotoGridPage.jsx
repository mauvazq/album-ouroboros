import { useEffect, useState } from 'react';
import { usePhotos } from '../hooks/usePhotos';
import { isWithinDateRange } from '../utils/dateFilters';
import DateFilter from '../components/DateFilter';
import PhotoCard from '../components/PhotoCard';
import FileUpload from '../components/FileUpload';
import PhotoDetailModal from '../components/PhotoDetailModal';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import Icon from '../components/Icon';

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
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  useEffect(() => {
    if (album?.id) fetchPhotos();
  }, [album?.id, fetchPhotos]);

  const filteredPhotos = photos.filter((photo) => {
    const matchesFavorite = filter === 'favorites' ? photo.favorito : true;
    return matchesFavorite && isWithinDateRange(photo.fecha_subida, dateRange);
  });

  return (
    <>
      <div className="page-header">
        <div>
          <Button variant="ghost" onClick={onBack} style={{ marginBottom: '0.5rem', padding: 0 }}>
            <Icon name="arrowLeft" />
            Volver a álbumes
          </Button>
          <h1 className="page-title">{album?.nombre}</h1>
          {album?.descripcion && (
            <p className="page-subtitle">{album.descripcion}</p>
          )}
        </div>
        <DateFilter
          value={dateRange}
          onChange={setDateRange}
          label="Fecha de subida"
        />
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
          <div className="empty-state-icon">
            <Icon name="camera" size={52} />
          </div>
          <h3>
            {filter === 'favorites'
              ? 'No hay fotos favoritas en este álbum'
              : 'No hay fotos para mostrar'}
          </h3>
          <p>Sube fotos usando el área de arriba o ajusta el filtro de fechas.</p>
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
