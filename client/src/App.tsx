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
import FrameBorder from './components/FrameBorder';
import { CurrencyBudgetModal } from './components/CurrencyBudgetModal';
import { SmartPackingModal } from './components/SmartPackingModal';
import { Calculator, Luggage } from 'lucide-react';

export const AppContent: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname + window.location.search);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [isPackingModalOpen, setIsPackingModalOpen] = useState(false);

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
      {/* Global Sky & Cloud Atmospheric Backdrop */}
      <div className="voyora-sky-global-backdrop" />
      <div className="voyora-sky-sunbeam-overlay" />

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
      />
      {/* React Bits Pro Glowing Frame Border (Throughout Application Viewport) */}
      <FrameBorder asGlobalViewport inset={6} radius={18} glow={0.6} lineWidth={1.25} />
      <Navbar currentPath={currentPath} onNavigate={navigate} />
      <main className="voyora-main-content relative z-10">
        {parseRoute()}
      </main>
      <Footer onNavigate={navigate} />

      {/* Floating Travel Quick-Utility Bar */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5">
        <button
          onClick={() => setIsCurrencyModalOpen(true)}
          className="px-3.5 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-sky-400 hover:text-white text-xs font-bold shadow-xl backdrop-blur-md transition-all transform hover:scale-105 flex items-center gap-1.5"
          title="Open Currency Converter & Budget Calculator"
        >
          <Calculator size={14} />
          <span>Currency & Budget</span>
        </button>

        <button
          onClick={() => setIsPackingModalOpen(true)}
          className="px-3.5 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-emerald-400 hover:text-white text-xs font-bold shadow-xl backdrop-blur-md transition-all transform hover:scale-105 flex items-center gap-1.5"
          title="Open Smart Packing Checklist"
        >
          <Luggage size={14} />
          <span>Packing List</span>
        </button>
      </div>

      {/* Currency & Budget Modal */}
      <CurrencyBudgetModal
        isOpen={isCurrencyModalOpen}
        onClose={() => setIsCurrencyModalOpen(false)}
      />

      {/* Smart Packing Checklist Modal */}
      <SmartPackingModal
        isOpen={isPackingModalOpen}
        onClose={() => setIsPackingModalOpen(false)}
      />

      <style>{`
        .voyora-app-shell {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: #071224;
          position: relative;
          overflow-x: hidden;
        }
        .voyora-sky-global-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url('/sky-clouds-bg.jpg');
          background-size: cover;
          background-position: center 20%;
          background-repeat: no-repeat;
          z-index: 0;
          pointer-events: none;
          opacity: 0.78;
          filter: saturate(1.18) contrast(1.08);
        }
        .voyora-sky-sunbeam-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, rgba(3, 14, 38, 0.72) 0%, rgba(5, 22, 54, 0.62) 38%, rgba(4, 12, 28, 0.90) 100%);
          z-index: 0;
          pointer-events: none;
        }
        .voyora-main-content {
          flex: 1;
          position: relative;
          z-index: 10;
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
