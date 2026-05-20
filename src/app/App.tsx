import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';

const HomePage = lazy(() => import('./components/HomePage'));
const IdeaHub = lazy(() => import('./components/IdeaHub'));
const ImpactDashboard = lazy(() => import('./components/ImpactDashboard'));
const AgentsPage = lazy(() => import('./components/AgentsPage'));
const SobrePage = lazy(() => import('./components/SobrePage'));
const CreateView = lazy(() => import('./components/CreateView'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <ScrollToTop />
      <Navigation />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hub" element={<IdeaHub />} />
          <Route path="/impacto" element={<ImpactDashboard />} />
          <Route path="/agentes" element={<AgentsPage />} />
          <Route path="/sobre" element={<SobrePage />} />
          <Route path="/criar" element={<CreateView />} />
        </Routes>
      </Suspense>
    </div>
  );
}
