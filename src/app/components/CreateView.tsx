import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryPage from './create/CategoryPage';
import BrainstormPage from './create/BrainstormPage';
import ReferencesPage from './create/ReferencesPage';
import SummaryPage from './create/SummaryPage';
import SideStepBar from './create/StepBar';

type FlowPage = 'category' | 'brainstorm' | 'references' | 'summary';

const stepIndex: Record<FlowPage, number> = {
  category: 0,
  brainstorm: 1,
  references: 2,
  summary: 3,
};

const backLabels: Record<FlowPage, string> = {
  category: 'Início',
  brainstorm: 'Categoria',
  references: 'Brainstorming',
  summary: 'Referências',
};

export default function CreateView() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<FlowPage>('category');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setTimeout(() => setCurrentPage('brainstorm'), 280);
  };

  const handleBack = () => {
    if (currentPage === 'category') navigate('/');
    else if (currentPage === 'brainstorm') setCurrentPage('category');
    else if (currentPage === 'references') setCurrentPage('brainstorm');
    else if (currentPage === 'summary') setCurrentPage('references');
  };

  return (
    <div style={{ paddingTop: '62px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Vertical step sidebar */}
        <SideStepBar
          currentStep={stepIndex[currentPage]}
          onBack={handleBack}
          backLabel={backLabels[currentPage]}
          isAnonymous={isAnonymous}
          setIsAnonymous={setIsAnonymous}
        />

        {/* Page content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {currentPage === 'category' && (
            <CategoryPage
              onSelectCategory={handleSelectCategory}
              onNextPage={() => setCurrentPage('brainstorm')}
            />
          )}
          {currentPage === 'brainstorm' && (
            <BrainstormPage
              selectedCategory={selectedCategory}
              onNextPage={() => setCurrentPage('references')}
            />
          )}
          {currentPage === 'references' && (
            <ReferencesPage
              onNextPage={() => setCurrentPage('summary')}
            />
          )}
          {currentPage === 'summary' && (
            <SummaryPage
              isAnonymous={isAnonymous}
              setIsAnonymous={setIsAnonymous}
            />
          )}
        </div>
      </div>
    </div>
  );
}
