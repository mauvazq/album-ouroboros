import Button from './Button';
import BrandLogo from './BrandLogo';
import Icon from './Icon';

const NAV_ITEMS = [
  { id: 'albums', label: 'Mis álbumes', icon: 'album' },
  { id: 'allPhotos', label: 'Todas las fotos', icon: 'grid' },
  { id: 'favorites', label: 'Favoritos', icon: 'heart' },
  { id: 'trash', label: 'Papelera', icon: 'trash' },
];

export default function Sidebar({
  currentView,
  onNavigate,
  onLogout,
  theme,
  onToggleTheme,
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
          <BrandLogo />
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
              <Icon name={item.icon} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="theme-toggle" type="button" onClick={onToggleTheme}>
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
            {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          </button>
          <Button
            variant="ghost"
            className="sidebar-link"
            onClick={onLogout}
            style={{ color: 'var(--color-sidebar-text)' }}
          >
            <Icon name="logOut" />
            Cerrar sesión
          </Button>
        </div>
      </aside>
    </>
  );
}
