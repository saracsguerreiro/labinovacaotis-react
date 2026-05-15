import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import CreateView from './components/CreateView';
import IdeaHub from './components/IdeaHub';
import ImpactDashboard from './components/ImpactDashboard';
import AgentsPage from './components/AgentsPage';
import SobrePage from './components/SobrePage';

type ViewType = 'home' | 'create' | 'hub' | 'impact' | 'agents' | 'sobre';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navigation currentView={currentView} onNavigate={setCurrentView} />

      {currentView === 'home' && <HomePage onNavigate={setCurrentView} />}
      {currentView === 'create' && <CreateView onNavigate={setCurrentView} />}
      {currentView === 'hub' && <IdeaHub onNavigate={setCurrentView} />}
      {currentView === 'impact' && <ImpactDashboard />}
      {currentView === 'agents' && <AgentsPage onNavigate={setCurrentView} />}
      {currentView === 'sobre' && <SobrePage onNavigate={setCurrentView} />}
    </div>
  );
}
