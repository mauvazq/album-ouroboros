import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import Sidebar from './components/Sidebar';
import Spinner from './components/Spinner';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AlbumsPage from './pages/AlbumsPage';
import PhotoGridPage from './pages/PhotoGridPage';
import FavoritesPage from './pages/FavoritesPage';
import TrashPage from './pages/TrashPage';
import Button from './components/Button';

export default function App() {
  const { user, profile, loading, logout } = useAuth();
  const [currentView, setCurrentView] = useState('albums');
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user && (currentView === 'login' || currentView === 'register')) {
      setCurrentView('albums');
    }
    if (!user && currentView !== 'login' && currentView !== 'register') {
      setCurrentView('login');
    }
  }, [user, currentView]);

  const handleNavigate = (view) => {
    setCurrentView(view);
    if (view !== 'photos') {
      setSelectedAlbum(null);
    }
  };

  const handleOpenAlbum = (album) => {
    setSelectedAlbum(album);
    setCurrentView('photos');
  };

  const handleLogout = async () => {
    await logout();
    setCurrentView('login');
    setSelectedAlbum(null);
  };

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    if (currentView === 'register') {
      return <RegisterPage onNavigate={handleNavigate} />;
    }
    return <LoginPage onNavigate={handleNavigate} />;
  }

  const renderPage = () => {
    switch (currentView) {
      case 'photos':
        return (
          <PhotoGridPage
            album={selectedAlbum}
            onBack={() => handleNavigate('albums')}
          />
        );
      case 'favorites':
        return <FavoritesPage />;
      case 'trash':
        return <TrashPage />;
      default:
        return <AlbumsPage onOpenAlbum={handleOpenAlbum} />;
    }
  };

  const sidebarView =
    currentView === 'photos' ? 'albums' : currentView;

  return (
    <div className="app-layout">
      <header className="mobile-header">
        <Button
          variant="ghost"
          className="btn-icon"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menú"
        >
          ☰
        </Button>
        <h1>Álbum de Fotos</h1>
      </header>

      <Sidebar
        currentView={sidebarView}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        userName={profile?.nombre}
        userEmail={user.email}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="main-content">{renderPage()}</main>
    </div>
  );
}
