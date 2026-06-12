import { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import Icon from './Icon';

export default function PhotoDetailModal({
  photo,
  isOpen,
  onClose,
  onToggleFavorite,
  onMoveToTrash,
  onUpdateTitle,
  isTrash = false,
}) {
  const [titulo, setTitulo] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitulo(photo?.titulo || '');
  }, [photo]);

  if (!photo) return null;

  const handleSaveTitle = async () => {
    if (titulo !== photo.titulo) {
      setSaving(true);
      try {
        await onUpdateTitle(photo.id, titulo);
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle de foto"
      footer={
        !isTrash && (
          <>
            <Button variant="secondary" onClick={onClose}>
              Cerrar
            </Button>
            <Button
              variant="secondary"
              onClick={() => onToggleFavorite(photo)}
            >
              <Icon name={photo.favorito ? 'heartOff' : 'heart'} />
              {photo.favorito ? 'Quitar favorito' : 'Marcar favorito'}
            </Button>
            <Button variant="danger" onClick={() => onMoveToTrash(photo)}>
              <Icon name="trash" />
              Enviar a papelera
            </Button>
          </>
        )
      }
    >
      <div className="photo-modal">
        <img
          className="photo-modal-image"
          src={photo.url}
          alt={photo.titulo || 'Foto'}
        />
        {!isTrash && (
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label htmlFor="photo-title">Título</label>
            <input
              id="photo-title"
              className="form-input"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              onBlur={handleSaveTitle}
              disabled={saving}
            />
          </div>
        )}
        {isTrash && (
          <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>
            {photo.titulo || 'Sin título'}
          </p>
        )}
      </div>
    </Modal>
  );
}
