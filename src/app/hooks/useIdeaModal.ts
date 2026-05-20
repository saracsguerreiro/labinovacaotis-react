import { useState, useCallback } from 'react';
import type { Idea } from './useIdeaFilters';

export function useIdeaModal() {
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);

  const open = useCallback((idea: Idea) => setSelectedIdea(idea), []);
  const close = useCallback(() => setSelectedIdea(null), []);

  return { selectedIdea, open, close };
}
