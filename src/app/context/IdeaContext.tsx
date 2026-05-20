import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Idea } from '../hooks/useIdeaFilters';

const initialIdeas: Idea[] = [
  { id: 1, title: 'Modelo de trabalho híbrido estruturado', cat: 'Pessoas', catColor: '#9437FF', catBg: '#e6dfff', votes: 67, comments: 31, author: 'Carla Moreira', status: 'Em implementação', statusColor: '#9437FF' },
  { id: 2, title: 'App self-service para clientes com IA conversacional', cat: 'Produto', catColor: '#FF0066', catBg: '#fdf2f8', votes: 58, comments: 22, author: 'Tiago Costa', status: 'Concluída', statusColor: '#FF0066' },
  { id: 3, title: 'Chatbot de suporte interno 24/7', cat: 'CX', catColor: '#4294F8', catBg: '#ecfeff', votes: 45, comments: 20, author: 'Anónimo', status: 'Em implementação', statusColor: '#9437FF' },
  { id: 4, title: 'Automatização do processo de aprovação de despesas', cat: 'Processo', catColor: '#3126b4', catBg: '#eff4ff', votes: 42, comments: 18, author: 'Miguel Alves', status: 'Em implementação', statusColor: '#9437FF' },
  { id: 5, title: 'Plataforma de onboarding digital com IA', cat: 'Pessoas', catColor: '#9437FF', catBg: '#e6dfff', votes: 36, comments: 14, author: 'João Martins', status: 'Em análise', statusColor: '#4294F8' },
  { id: 6, title: 'Dashboard unificado de métricas operacionais', cat: 'Tech', catColor: '#036ef2', catBg: '#f5f3ff', votes: 31, comments: 9, author: 'Anónimo', status: 'Em análise', statusColor: '#4294F8' },
  { id: 7, title: 'API de integração com parceiros externos', cat: 'Tech', catColor: '#036ef2', catBg: '#f5f3ff', votes: 27, comments: 7, author: 'Luísa Fonseca', status: 'Submetida', statusColor: '#036ef2' },
  { id: 8, title: 'App self-service para clientes', cat: 'Produto', catColor: '#FF0066', catBg: '#fdf2f8', votes: 24, comments: 5, author: 'Sofia Ramos', status: 'Submetida', statusColor: '#036ef2' },
  { id: 9, title: 'Neutralidade carbónica em eventos internos', cat: 'Outros', catColor: '#87007f', catBg: '#f4ecff', votes: 24, comments: 5, author: 'Anónimo', status: 'Concluída', statusColor: '#FF0066' },
  { id: 10, title: 'Programa de mentoria cruzada entre departamentos', cat: 'Pessoas', catColor: '#9437FF', catBg: '#e6dfff', votes: 19, comments: 11, author: 'Anónimo', status: 'Em análise', statusColor: '#4294F8' },
  { id: 11, title: 'Data lake para análise de comportamento do cliente', cat: 'Tech', catColor: '#036ef2', catBg: '#f5f3ff', votes: 33, comments: 12, author: 'Rui Neves', status: 'Submetida', statusColor: '#036ef2' },
  { id: 12, title: 'Programa de reconhecimento por pares', cat: 'Pessoas', catColor: '#9437FF', catBg: '#e6dfff', votes: 22, comments: 8, author: 'Anónimo', status: 'Em análise', statusColor: '#4294F8' },
];

type IdeaContextValue = {
  ideas: Idea[];
  hasVoted: (id: number) => boolean;
  toggleVote: (id: number, e?: React.MouseEvent) => void;
};

const IdeaContext = createContext<IdeaContextValue | null>(null);

export function IdeaProvider({ children }: { children: ReactNode }) {
  const [ideas] = useState<Idea[]>(initialIdeas);
  const [votedIds, setVotedIds] = useState<Set<number>>(new Set());

  const hasVoted = useCallback((id: number) => votedIds.has(id), [votedIds]);

  const toggleVote = useCallback((id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setVotedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  return (
    <IdeaContext.Provider value={{ ideas, hasVoted, toggleVote }}>
      {children}
    </IdeaContext.Provider>
  );
}

export function useIdeas() {
  const ctx = useContext(IdeaContext);
  if (!ctx) throw new Error('useIdeas must be used inside <IdeaProvider>');
  return ctx;
}
