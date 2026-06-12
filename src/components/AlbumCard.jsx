import Button from './Button';
import Icon from './Icon';

export default function AlbumCard({ album, onOpen, onEdit, onDelete }) {
  return (
    <div className="card album-card">
      <div className="album-card-cover" onClick={() => onOpen(album)}>
        {album.portada_url ? (
          <img src={album.portada_url} alt={album.nombre} />
        ) : (
          <div className="album-card-placeholder">
            <Icon name="camera" size={52} />
          </div>
        )}
      </div>
      <div className="album-card-body" onClick={() => onOpen(album)}>
        <h3 className="album-card-title">{album.nombre}</h3>
        {album.descripcion && (
          <p className="album-card-desc">{album.descripcion}</p>
        )}
      </div>
      <div className="album-card-actions">
        <Button variant="secondary" size="sm" onClick={() => onEdit(album)}>
          Editar
        </Button>
        <Button variant="danger" size="sm" onClick={() => onDelete(album)}>
          Eliminar
        </Button>
      </div>
    </div>
  );
}
