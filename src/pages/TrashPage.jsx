import { useEffect, useState } from 'react';
import { usePhotos } from '../hooks/usePhotos';
import PhotoCard from '../components/PhotoCard';
import PhotoDetailModal from '../components/PhotoDetailModal';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import Icon from '../components/Icon';

export default function TrashPage() {
  const {
    photos,
    loading,
    error,
    selectedPhoto,
    setSelectedPhoto,
    fetchPhotos,
    restorePhoto,
    deletePermanently,
  } = usePhotos('trash');

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleRestore = async (photo) => {
    setProcessing(true);
    try {
      await restorePhoto(photo);
    } finally {
      setProcessing(false);
    }
  };

  const handleDeletePermanently = async () => {
    if (!deleteConfirm) return;
    setProcessing(true);
    try {
      await deletePermanently(deleteConfirm);
      setDeleteConfirm(null);
      if (selectedPhoto?.id === deleteConfirm.id) {
        setSelectedPhoto(null);
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Papelera</h1>
          <p className="page-subtitle">
            {photos.length} {photos.length === 1 ? 'foto eliminada' : 'fotos eliminadas'}
          </p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <Spinner />
      ) : photos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Icon name="trash" size={52} />
          </div>
          <h3>La papelera está vacía</h3>
          <p>Las fotos que elimines aparecerán aquí antes de borrarse definitivamente.</p>
        </div>
      ) : (
        <div className="grid grid-photos">
          {photos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onClick={setSelectedPhoto}
              showActions
              onRestore={handleRestore}
              onDelete={setDeleteConfirm}
            />
          ))}
        </div>
      )}

      <PhotoDetailModal
        photo={selectedPhoto}
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        isTrash
      />

      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Eliminar definitivamente"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleDeletePermanently}
              disabled={processing}
            >
              {processing ? 'Eliminando...' : 'Eliminar definitivamente'}
            </Button>
          </>
        }
      >
        <p>
          ¿Estás seguro de que quieres eliminar permanentemente{' '}
          <strong>{deleteConfirm?.titulo || 'esta foto'}</strong>? Esta acción no se puede deshacer.
        </p>
      </Modal>
    </>
  );
}
