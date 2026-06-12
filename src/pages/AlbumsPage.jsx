import { useEffect, useState } from 'react';
import { useAlbums } from '../hooks/useAlbums';
import { isWithinDateRange } from '../utils/dateFilters';
import AlbumCard from '../components/AlbumCard';
import DateFilter from '../components/DateFilter';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import Icon from '../components/Icon';

export default function AlbumsPage({ onOpenAlbum }) {
  const { albums, loading, error, fetchAlbums, createAlbum, updateAlbum, deleteAlbum } =
    useAlbums();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '', portada_url: '' });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  const openCreateModal = () => {
    setEditingAlbum(null);
    setForm({ nombre: '', descripcion: '', portada_url: '' });
    setModalOpen(true);
  };

  const openEditModal = (album) => {
    setEditingAlbum(album);
    setForm({
      nombre: album.nombre,
      descripcion: album.descripcion || '',
      portada_url: album.portada_url || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingAlbum) {
        await updateAlbum(editingAlbum.id, form);
      } else {
        await createAlbum(form);
      }
      setModalOpen(false);
    } catch {
      // error handled in hook
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setSaving(true);
    try {
      await deleteAlbum(deleteConfirm.id);
      setDeleteConfirm(null);
    } catch {
      // error handled in hook
    } finally {
      setSaving(false);
    }
  };

  const filteredAlbums = albums.filter((album) =>
    isWithinDateRange(album.fecha_creacion, dateRange)
  );

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Mis álbumes</h1>
          <p className="page-subtitle">
            {filteredAlbums.length} de {albums.length}{' '}
            {albums.length === 1 ? 'álbum' : 'álbumes'}
          </p>
        </div>
        <div className="page-actions">
          <DateFilter
            value={dateRange}
            onChange={setDateRange}
            label="Fecha de creación"
          />
          <Button variant="primary" onClick={openCreateModal}>
            <Icon name="plus" />
            Crear álbum
          </Button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <Spinner />
      ) : filteredAlbums.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Icon name="album" size={52} />
          </div>
          <h3>No tienes álbumes aún</h3>
          <p>Crea tu primer álbum o ajusta el filtro de fechas.</p>
          <Button variant="primary" onClick={openCreateModal} style={{ marginTop: '1rem' }}>
            Crear álbum
          </Button>
        </div>
      ) : (
        <div className="grid grid-albums">
          {filteredAlbums.map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              onOpen={onOpenAlbum}
              onEdit={openEditModal}
              onDelete={setDeleteConfirm}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingAlbum ? 'Editar álbum' : 'Crear álbum'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit} disabled={saving}>
              {saving ? 'Guardando...' : editingAlbum ? 'Guardar' : 'Crear'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="album-nombre">Nombre</label>
            <input
              id="album-nombre"
              className="form-input"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="album-desc">Descripción</label>
            <textarea
              id="album-desc"
              className="form-input"
              rows={3}
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="album-portada">URL de portada (opcional)</label>
            <input
              id="album-portada"
              className="form-input"
              type="url"
              value={form.portada_url}
              onChange={(e) => setForm({ ...form, portada_url: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Eliminar álbum"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={saving}>
              {saving ? 'Eliminando...' : 'Eliminar definitivamente'}
            </Button>
          </>
        }
      >
        <p>
          ¿Estás seguro de que quieres eliminar el álbum{' '}
          <strong>{deleteConfirm?.nombre}</strong>? Se eliminarán también todas sus fotos.
        </p>
      </Modal>
    </>
  );
}
