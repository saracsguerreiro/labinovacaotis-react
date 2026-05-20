import { useState, useCallback } from 'react';

export function useVoting() {
  const [votedIds, setVotedIds] = useState<Set<number>>(new Set());

  const toggle = useCallback((id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setVotedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const hasVoted = useCallback((id: number) => votedIds.has(id), [votedIds]);

  return { votedIds, toggle, hasVoted };
}
