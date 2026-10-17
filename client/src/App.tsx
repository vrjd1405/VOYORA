import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { TripProvider } from './context/TripContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { DestinationDetailsPage } from './pages/DestinationDetailsPage';
import { MyTripPage } from './pages/MyTripPage';
import { SmartPlannerPage } from './pages/SmartPlannerPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { SharedTripPage } from './pages/SharedTripPage';
import Galaxy from './components/Galaxy';

export const AppContent: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname + window.location.search);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route Parser
  const parseRoute = () => {
    const [pathPart, searchPart] = currentPath.split('?');
    const searchParams = new URLSearchParams(searchPart || '');

    if (pathPart === '/' || pathPart === '') {
      return <HomePage onNavigate={navigate} />;
    }

    if (pathPart === '/explore') {
      return (
        <ExplorePage
          onNavigate={navigate}
          initialQuery={searchParams.get('q') || ''}
          initialCategory={searchParams.get('category') || 'all'}
          initialCity={searchParams.get('city') || 'all'}
        />
      );
    }

    if (pathPart.startsWith('/destinations/')) {
      const destinationId = pathPart.replace('/destinations/', '');
      return <DestinationDetailsPage destinationId={destinationId} onNavigate={navigate} />;
    }

    if (pathPart === '/trip') {
      return <MyTripPage onNavigate={navigate} />;
    }

    if (pathPart === '/planner') {
      return <SmartPlannerPage onNavigate={navigate} />;
    }

    if (pathPart === '/favorites') {
      return <FavoritesPage onNavigate={navigate} />;
    }

    if (pathPart.startsWith('/trip/share/')) {
      const shareId = pathPart.replace('/trip/share/', '');
      return <SharedTripPage shareId={shareId} onNavigate={navigate} />;
    }

    // Default Fallback
    return <HomePage onNavigate={navigate} />;
  };

  return (
    <div className="voyora-app-shell relative min-h-screen">
      {/* React Bits Interactive WebGL2 Galaxy Background */}
      <Galaxy
        starColors={['#38BDF8', '#818CF8', '#C084FC', '#E2E8F0']}
        density={2.2}
        glowIntensity={0.35}
        flareIntensity={0.9}
        starSpeed={0.22}
        mouseRepulsion={true}
        repulsionStrength={2.2}
        clickWarp={true}
        starSize={0.85}
        twinkleIntensity={0.2}
        speed={0.42}
        rotationSpeed={0.04}
        layers={5}
        transparent={true}
        className="fixed inset-0 pointer-events-none -z-10"
      />
      <Navbar currentPath={currentPath} onNavigate={navigate} />
      <main className="voyora-main-content relative z-10">
        {parseRoute()}
      </main>
      <Footer onNavigate={navigate} />

      <style>{`
        .voyora-app-shell {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        .voyora-main-content {
          flex: 1;
        }
      `}</style>
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <TripProvider>
        <FavoritesProvider>
          <AppContent />
        </FavoritesProvider>
      </TripProvider>
    </ToastProvider>
  );
}
