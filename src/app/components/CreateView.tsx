import { useState } from 'react';
import CategoryPage from './create/CategoryPage';
import BrainstormPage from './create/BrainstormPage';
import ReferencesPage from './create/ReferencesPage';
import SummaryPage from './create/SummaryPage';

type ViewType = 'home' | 'create' | 'hub' | 'impact' | 'agents' | 'sobre';

interface CreateViewProps {
  onNavigate: (view: ViewType) => void;
}

type FlowPage = 'category' | 'brainstorm' | 'references' | 'summary';

export default function CreateView({ onNavigate }: CreateViewProps) {
  const [currentPage, setCurrentPage] = useState<FlowPage>('category');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setTimeout(() => setCurrentPage('brainstorm'), 280);
  };

  return (
    <div className="min-h-screen pt-[62px]">
      {currentPage === 'category' && (
        <CategoryPage
          onNavigate={onNavigate}
          onSelectCategory={handleSelectCategory}
          onNextPage={() => setCurrentPage('brainstorm')}
          isAnonymous={isAnonymous}
          setIsAnonymous={setIsAnonymous}
        />
      )}
      {currentPage === 'brainstorm' && (
        <BrainstormPage
          selectedCategory={selectedCategory}
          onBack={() => setCurrentPage('category')}
          onNextPage={() => setCurrentPage('references')}
          isAnonymous={isAnonymous}
          setIsAnonymous={setIsAnonymous}
        />
      )}
      {currentPage === 'references' && (
        <ReferencesPage
          onBack={() => setCurrentPage('brainstorm')}
          onNextPage={() => setCurrentPage('summary')}
          isAnonymous={isAnonymous}
          setIsAnonymous={setIsAnonymous}
        />
      )}
      {currentPage === 'summary' && (
        <SummaryPage
          onBack={() => setCurrentPage('references')}
          onNavigate={onNavigate}
          isAnonymous={isAnonymous}
          setIsAnonymous={setIsAnonymous}
        />
      )}
    </div>
  );
}
