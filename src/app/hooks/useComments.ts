import { useState } from 'react';

export interface Comment {
  id: string;
  ideaId: number;
  text: string;
  author: string;
  timestamp: number;
}

const STORAGE_KEY = 'hub-comments';

export function useComments() {
  const [comments, setComments] = useState<Comment[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });

  const addComment = (ideaId: number, text: string, author = 'Miguel Alves') => {
    if (!text.trim()) return;
    const next: Comment = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      ideaId,
      text: text.trim(),
      author,
      timestamp: Date.now(),
    };
    const updated = [...comments, next];
    setComments(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const getComments = (ideaId: number) =>
    comments.filter(c => c.ideaId === ideaId).sort((a, b) => a.timestamp - b.timestamp);

  const commentCount = (ideaId: number) =>
    comments.filter(c => c.ideaId === ideaId).length;

  return { addComment, getComments, commentCount };
}
