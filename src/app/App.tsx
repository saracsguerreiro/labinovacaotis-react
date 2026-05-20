import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import CreateView from './components/CreateView';
import IdeaHub from './components/IdeaHub';
import ImpactDashboard from './components/ImpactDashboard';
import AgentsPage from './components/AgentsPage';
import SobrePage from './components/SobrePage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <ScrollToTop />
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/hub" element={<IdeaHub />} />
        <Route path="/impacto" element={<ImpactDashboard />} />
        <Route path="/agentes" element={<AgentsPage />} />
        <Route path="/sobre" element={<SobrePage />} />
        <Route path="/criar" element={<CreateView />} />
      </Routes>
    </div>
  );
}
