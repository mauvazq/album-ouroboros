import Button from './Button';

const NAV_ITEMS = [
  { id: 'albums', label: 'Mis álbumes', icon: '📁' },
  { id: 'favorites', label: 'Favoritos', icon: '❤️' },
  { id: 'trash', label: 'Papelera', icon: '🗑️' },
];

export default function Sidebar({
  currentView,
  onNavigate,
  onLogout,
  userName,
  userEmail,
  isOpen,
  onClose,
}) {
  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">Álbum de Fotos</div>
          {userName && <div className="sidebar-user">{userName}</div>}
          {userEmail && (
            <div className="sidebar-user" style={{ opacity: 0.7 }}>
              {userEmail}
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`sidebar-link ${currentView === item.id ? 'active' : ''}`}
              onClick={() => {
                onNavigate(item.id);
                onClose?.();
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Button
            variant="ghost"
            className="sidebar-link"
            onClick={onLogout}
            style={{ color: 'var(--color-sidebar-text)' }}
          >
            <span>🚪</span>
            Cerrar sesión
          </Button>
        </div>
      </aside>
    </>
  );
}
