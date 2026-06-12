export default function PhotoCard({ photo, onClick, showActions, onRestore, onDelete }) {
  return (
    <div className="card photo-card" onClick={() => onClick?.(photo)}>
      <img src={photo.url} alt={photo.titulo || 'Foto'} loading="lazy" />
      {photo.favorito && <span className="photo-card-badge">❤️</span>}
      {photo.titulo && <div className="photo-card-overlay">{photo.titulo}</div>}
      {showActions && (
        <div
          className="trash-actions"
          style={{ position: 'absolute', bottom: 8, left: 8, right: 8 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="btn btn-secondary btn-sm" onClick={() => onRestore(photo)}>
            Restaurar
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(photo)}>
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}
