
import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import RSVPForm from './components/RSVPForm';
import Gallery from './components/Gallery';
import Venue from './components/Venue';
import MusicPlayer from './components/MusicPlayer';
import DetailsSection from './components/DetailsSection';
import NavigationHub from './components/NavigationHub';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { COLORS, WEDDING_DETAILS } from './constants';

type AppSection = 'hero' | 'hub' | 'moments' | 'venue' | 'details' | 'rsvp' | 'login' | 'dashboard';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>('hero');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Session persistence
    const session = localStorage.getItem('wedding_admin_session');
    if (session === 'true') {
      setIsAuthenticated(true);
    }

    // Initialize state from external JSON files if not in storage
    const initData = async () => {
      // Guest List Init
      if (!localStorage.getItem('wedding_guest_list')) {
        try {
          const response = await fetch('/guestlist.json');
          const data = await response.json();
          localStorage.setItem('wedding_guest_list', JSON.stringify(data));
        } catch (e) {
          console.error("Failed to load initial guest list", e);
        }
      }
      
      // Submissions Init
      if (!localStorage.getItem('wedding_submissions')) {
        try {
          const response = await fetch('/submissions.json');
          if (response.ok) {
            const data = await response.json();
            localStorage.setItem('wedding_submissions', JSON.stringify(data));
          } else {
            localStorage.setItem('wedding_submissions', '[]');
          }
        } catch (e) {
          localStorage.setItem('wedding_submissions', '[]');
        }
      }
    };

    initData();

    const handleRouting = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      
      if (path.includes('login') || hash.includes('login')) {
        setActiveSection('login');
      }
    };

    handleRouting();
    window.addEventListener('popstate', handleRouting);
    window.addEventListener('hashchange', handleRouting);
    
    return () => {
      window.removeEventListener('popstate', handleRouting);
      window.removeEventListener('hashchange', handleRouting);
    };
  }, []);

  const navigateTo = (section: AppSection) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveSection(section);
      setIsTransitioning(false);
      window.scrollTo(0, 0);
      
      if (section === 'login' || section === 'dashboard') {
        window.history.pushState({}, '', '/login');
      } else if (section === 'hero') {
        window.history.pushState({}, '', '/');
      }
    }, 400);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('wedding_admin_session', 'true');
    navigateTo('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('wedding_admin_session');
    navigateTo('hero');
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'hero':
        return <Hero onExplore={() => navigateTo('hub')} />;
      case 'hub':
        return <NavigationHub onNavigate={navigateTo} onBackToHero={() => navigateTo('hero')} />;
      case 'moments':
        return (
          <div className="min-h-screen bg-white py-10">
            <Gallery />
          </div>
        );
      case 'venue':
        return (
          <div className="min-h-screen bg-white">
            <Venue />
          </div>
        );
      case 'details':
        return (
          <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center py-20">
            <DetailsSection />
          </div>
        );
      case 'rsvp':
        return (
          <div className="min-h-screen bg-[#F9F6F2] flex flex-col items-center justify-center py-20 px-4 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent opacity-50"></div>
             <RSVPForm />
             <footer className="mt-20 text-center opacity-30 relative z-10">
                <p className="font-script text-4xl mb-2">{WEDDING_DETAILS.names}</p>
                <p className="text-[9px] uppercase tracking-[0.4em]">January 22, 2026</p>
             </footer>
          </div>
        );
      case 'login':
        return isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Login onLoginSuccess={handleLoginSuccess} onCancel={() => navigateTo('hero')} />;
      case 'dashboard':
        return isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Login onLoginSuccess={handleLoginSuccess} onCancel={() => navigateTo('hero')} />;
      default:
        return <Hero onExplore={() => navigateTo('hub')} />;
    }
  };

  return (
    <div className="h-screen w-screen overflow-x-hidden bg-[#FDFBF7] selection:bg-[#F1CBA4]/40 selection:text-[#5C3D2E]">
      {activeSection !== 'login' && activeSection !== 'dashboard' && (
        <div className="fixed top-6 right-6 md:top-10 md:right-10 z-[100]">
          <MusicPlayer />
        </div>
      )}

      {activeSection !== 'hero' && activeSection !== 'hub' && activeSection !== 'login' && activeSection !== 'dashboard' && (
        <button 
          onClick={() => navigateTo('hub')}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0 z-[100] flex items-center space-x-3 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl border border-stone-100 group transition-all duration-500 hover:scale-105 active:scale-95"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: COLORS.accent }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold" style={{ color: COLORS.dark }}>Back</span>
        </button>
      )}

      <main className={`transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {renderActiveSection()}
      </main>

      <div className="fixed inset-4 md:inset-8 border border-stone-200/20 pointer-events-none z-[90]"></div>
    </div>
  );
};

export default App;
