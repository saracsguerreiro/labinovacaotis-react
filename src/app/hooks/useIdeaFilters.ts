import { useState, useMemo } from 'react';

export type Idea = {
  id: number;
  title: string;
  cat: string;
  catColor: string;
  catBg: string;
  votes: number;
  comments: number;
  author: string;
  status: string;
  statusColor: string;
};

export type SortKey = 'votes' | 'comments';

export function useIdeaFilters(ideas: Idea[]) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [activeStatus, setActiveStatus] = useState('Todos');
  const [sortBy, setSortBy] = useState<SortKey>('votes');

  const filtered = useMemo(() => {
    let list = [...ideas];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.cat.toLowerCase().includes(q) ||
          i.author.toLowerCase().includes(q)
      );
    }

    if (activeCategory !== 'Todas') list = list.filter((i) => i.cat === activeCategory);
    if (activeStatus !== 'Todos') list = list.filter((i) => i.status === activeStatus);

    list.sort((a, b) => b[sortBy] - a[sortBy]);
    return list;
  }, [ideas, search, activeCategory, activeStatus, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setActiveCategory('Todas');
    setActiveStatus('Todos');
  };

  return {
    search, setSearch,
    activeCategory, setActiveCategory,
    activeStatus, setActiveStatus,
    sortBy, setSortBy,
    filtered,
    clearFilters,
  };
}
