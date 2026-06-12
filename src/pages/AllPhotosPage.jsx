import { useEffect, useState } from 'react';
import { usePhotos } from '../hooks/usePhotos';
import { isWithinDateRange } from '../utils/dateFilters';
import DateFilter from '../components/DateFilter';
import PhotoCard from '../components/PhotoCard';
import PhotoDetailModal from '../components/PhotoDetailModal';
import Spinner from '../components/Spinner';
import Icon from '../components/Icon';

export default function AllPhotosPage() {
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
  } = usePhotos('all');

  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const filteredPhotos = photos.filter((photo) =>
    isWithinDateRange(photo.fecha_subida, dateRange)
  );

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Todas las fotos</h1>
          <p className="page-subtitle">
            {filteredPhotos.length} de {photos.length}{' '}
            {photos.length === 1 ? 'foto' : 'fotos'}
          </p>
        </div>
        <DateFilter
          value={dateRange}
          onChange={setDateRange}
          label="Fecha de subida"
        />
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <Spinner />
      ) : filteredPhotos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Icon name="grid" size={52} />
          </div>
          <h3>No hay fotos para mostrar</h3>
          <p>Ajusta el filtro de fechas o sube fotos desde un álbum.</p>
        </div>
      ) : (
        <div className="grid grid-photos">
          {filteredPhotos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} onClick={setSelectedPhoto} />
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
