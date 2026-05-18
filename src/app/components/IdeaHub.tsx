import { useState, useMemo } from 'react';

type ViewType = 'home' | 'create' | 'hub' | 'impact' | 'agents' | 'sobre';

interface IdeaHubProps {
  onNavigate: (view: ViewType) => void;
}

const ideas = [
  { id: 1, title: 'Modelo de trabalho híbrido estruturado', cat: 'Pessoas', catColor: '#7c3aed', catBg: 'rgba(124,58,237,0.12)', votes: 67, comments: 31, author: 'Carla Moreira', status: 'Em implementação', statusColor: '#7c3aed' },
  { id: 2, title: 'App self-service para clientes com IA conversacional', cat: 'Produto', catColor: '#FF0066', catBg: 'rgba(255,0,102,0.12)', votes: 58, comments: 22, author: 'Tiago Costa', status: 'Concluída', statusColor: '#FF0066' },
  { id: 3, title: 'Chatbot de suporte interno 24/7', cat: 'CX', catColor: '#06b6d4', catBg: 'rgba(6,182,212,0.12)', votes: 45, comments: 20, author: 'Anónimo', status: 'Em implementação', statusColor: '#7c3aed' },
  { id: 4, title: 'Automatização do processo de aprovação de despesas', cat: 'Processo', catColor: '#3b82f6', catBg: 'rgba(37,99,235,0.12)', votes: 42, comments: 18, author: 'Miguel Alves', status: 'Em implementação', statusColor: '#7c3aed' },
  { id: 5, title: 'Plataforma de onboarding digital com IA', cat: 'Pessoas', catColor: '#7c3aed', catBg: 'rgba(124,58,237,0.12)', votes: 36, comments: 14, author: 'João Martins', status: 'Em análise', statusColor: '#06b6d4' },
  { id: 6, title: 'Dashboard unificado de métricas operacionais', cat: 'Tech', catColor: '#2563eb', catBg: 'rgba(37,99,235,0.12)', votes: 31, comments: 9, author: 'Anónimo', status: 'Em análise', statusColor: '#06b6d4' },
  { id: 7, title: 'API de integração com parceiros externos', cat: 'Tech', catColor: '#2563eb', catBg: 'rgba(37,99,235,0.12)', votes: 27, comments: 7, author: 'Luísa Fonseca', status: 'Submetida', statusColor: '#2563eb' },
  { id: 8, title: 'App self-service para clientes', cat: 'Produto', catColor: '#FF0066', catBg: 'rgba(255,0,102,0.12)', votes: 24, comments: 5, author: 'Sofia Ramos', status: 'Submetida', statusColor: '#2563eb' },
  { id: 9, title: 'Neutralidade carbónica em eventos internos', cat: 'Outros', catColor: '#f97316', catBg: 'rgba(249,115,22,0.12)', votes: 24, comments: 5, author: 'Anónimo', status: 'Concluída', statusColor: '#FF0066' },
  { id: 10, title: 'Programa de mentoria cruzada entre departamentos', cat: 'Pessoas', catColor: '#7c3aed', catBg: 'rgba(124,58,237,0.12)', votes: 19, comments: 11, author: 'Anónimo', status: 'Em análise', statusColor: '#06b6d4' },
  { id: 11, title: 'Data lake para análise de comportamento do cliente', cat: 'Tech', catColor: '#2563eb', catBg: 'rgba(37,99,235,0.12)', votes: 33, comments: 12, author: 'Rui Neves', status: 'Submetida', statusColor: '#2563eb' },
  { id: 12, title: 'Programa de reconhecimento por pares', cat: 'Pessoas', catColor: '#7c3aed', catBg: 'rgba(124,58,237,0.12)', votes: 22, comments: 8, author: 'Anónimo', status: 'Em análise', statusColor: '#06b6d4' },
];

const CATEGORIES = ['Todas', 'Processo', 'Produto', 'Tech', 'CX', 'Pessoas', 'Outros'];
const STATUSES = ['Todos', 'Submetida', 'Em análise', 'Em implementação', 'Concluída'];
const SORTS = [
  { label: 'Mais votadas', value: 'votes' },
  { label: 'Mais comentadas', value: 'comments' },
];

export default function IdeaHub({ onNavigate }: IdeaHubProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [activeStatus, setActiveStatus] = useState('Todos');
  const [sortBy, setSortBy] = useState<'votes' | 'comments'>('votes');
  const [selectedIdea, setSelectedIdea] = useState<typeof ideas[0] | null>(null);
  const [votedIds, setVotedIds] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    let list = [...ideas];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((i) => i.title.toLowerCase().includes(q) || i.cat.toLowerCase().includes(q) || i.author.toLowerCase().includes(q));
    }
    if (activeCategory !== 'Todas') list = list.filter((i) => i.cat === activeCategory);
    if (activeStatus !== 'Todos') list = list.filter((i) => i.status === activeStatus);
    list.sort((a, b) => b[sortBy] - a[sortBy]);
    return list;
  }, [search, activeCategory, activeStatus, sortBy]);

  const handleVote = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setVotedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen pt-[62px] bg-[var(--bg)]">
      {/* Header */}
      <div className="px-9 py-5 border-b sticky top-[62px] z-50 bg-[var(--bg)]" style={{ borderColor: 'var(--border-light)' }}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="text-[22px] font-[800] tracking-[-0.5px]" style={{ color: 'var(--text)' }}>
              Ideia HUB
            </div>
            <div className="text-[10px] mt-0.5" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
              // {filtered.length} ideias · ordenadas por {sortBy === 'votes' ? 'votos' : 'comentários'}
            </div>
          </div>
          <button
            className="px-[18px] py-2 rounded-full border-none text-white text-[12px] font-bold cursor-pointer whitespace-nowrap transition-all hover:bg-[#1d4ed8] flex-shrink-0"
            style={{ background: 'var(--blue)', boxShadow: '0 3px 10px var(--blue-glow)', fontFamily: 'var(--font-outfit)' }}
            onClick={() => onNavigate('create')}
          >
            + Nova Ideia
          </button>
        </div>

        {/* Search + filters row */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-[320px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-sub)' }}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Pesquisar ideias..."
              className="w-full pl-9 pr-4 py-1.5 border-[1.5px] rounded-full text-[12px] outline-none transition-all bg-transparent focus:border-[var(--blue)]"
              style={{
                borderColor: 'var(--border-light)',
                color: 'var(--text)',
                fontFamily: 'var(--font-outfit)',
              }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-1 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className="px-3 py-1 border-[1.5px] rounded-full text-[11px] cursor-pointer transition-all"
                style={{
                  borderColor: activeCategory === cat ? 'var(--blue)' : 'var(--border-light)',
                  color: activeCategory === cat ? 'white' : 'var(--text-muted)',
                  background: activeCategory === cat ? 'var(--blue)' : 'transparent',
                  fontFamily: 'var(--font-outfit)',
                }}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="w-px h-4" style={{ background: 'var(--border-light)' }} />

          {/* Status filter */}
          <select
            className="px-3 py-1 border-[1.5px] rounded-full text-[11px] cursor-pointer bg-transparent outline-none"
            style={{ borderColor: 'var(--border-light)', color: 'var(--text-muted)', fontFamily: 'var(--font-outfit)' }}
            value={activeStatus}
            onChange={(e) => setActiveStatus(e.target.value)}
          >
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>

          {/* Sort */}
          <select
            className="px-3 py-1 border-[1.5px] rounded-full text-[11px] cursor-pointer bg-transparent outline-none"
            style={{ borderColor: 'var(--border-light)', color: 'var(--text-muted)', fontFamily: 'var(--font-outfit)' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'votes' | 'comments')}
          >
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_260px]" style={{ height: 'calc(100vh - 178px)', overflow: 'hidden' }}>
        {/* Feed */}
        <div className="overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3" style={{ color: 'var(--text-muted)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <div className="text-[14px]">Nenhuma ideia encontrada</div>
              <button className="text-[12px] underline" style={{ color: 'var(--blue)' }} onClick={() => { setSearch(''); setActiveCategory('Todas'); setActiveStatus('Todos'); }}>
                Limpar filtros
              </button>
            </div>
          ) : (
            filtered.map((idea, i) => (
              <div
                key={idea.id}
                className="flex items-start gap-4 px-7 py-5 border-b cursor-pointer transition-all hover:bg-[var(--surface2)]"
                style={{ borderColor: 'var(--border-light)' }}
                onClick={() => setSelectedIdea(idea)}
              >
                <div
                  className="text-[32px] font-[900] leading-[1] min-w-[36px] transition-colors"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-bold mb-1.5 leading-[1.3] tracking-[-0.2px]" style={{ color: 'var(--text)' }}>
                    {idea.title}
                  </div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <div className="flex items-center gap-1 text-[11px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: idea.statusColor }} />
                      {idea.status}
                    </div>
                    <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      {idea.author}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold" style={{ fontFamily: 'var(--font-mono)', color: idea.catColor, background: idea.catBg }}>
                      {idea.cat}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0 pt-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="px-2.5 py-1.5 text-[11px] border-[1.5px] rounded-full bg-transparent cursor-pointer transition-all flex items-center gap-1"
                    style={{
                      borderColor: votedIds.has(idea.id) ? 'var(--blue)' : 'var(--border-light)',
                      color: votedIds.has(idea.id) ? 'var(--blue)' : 'var(--text-muted)',
                      background: votedIds.has(idea.id) ? 'var(--blue-light)' : 'transparent',
                      fontFamily: 'var(--font-mono)',
                    }}
                    onClick={(e) => handleVote(idea.id, e)}
                  >
                    ▲ {idea.votes + (votedIds.has(idea.id) ? 1 : 0)}
                  </button>
                  <button
                    className="px-2.5 py-1.5 text-[11px] border-[1.5px] rounded-full bg-transparent cursor-pointer transition-all flex items-center gap-1"
                    style={{ borderColor: 'var(--border-light)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                  >
                    💬 {idea.comments}
                  </button>
                  <button
                    className="px-2.5 py-1.5 text-[11px] border-[1.5px] rounded-full cursor-pointer transition-all hover:bg-[var(--blue-light)]"
                    style={{ borderColor: '#2563eb', color: '#2563eb', fontFamily: 'var(--font-mono)', background: 'transparent' }}
                    onClick={() => setSelectedIdea(idea)}
                  >
                    Ver →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="border-l px-6 py-6 overflow-y-auto bg-[var(--bg2)]" style={{ borderColor: 'var(--border-light)' }}>
          <div className="mb-6">
            <div className="text-[10px] font-medium uppercase tracking-[2px] mb-3" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
              Por categoria
            </div>
            {[
              { name: 'Processo', pct: 34, color: '#3b82f6' },
              { name: 'Tecnologia', pct: 28, color: '#2563eb' },
              { name: 'Pessoas', pct: 22, color: '#7c3aed' },
              { name: 'CX', pct: 10, color: '#06b6d4' },
              { name: 'Outros', pct: 6, color: '#f97316' },
            ].map((cat) => (
              <div key={cat.name} className="mb-2.5">
                <div className="flex justify-between text-[11px] mb-1" style={{ color: 'var(--text-muted)' }}>
                  <span>{cat.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{cat.pct}%</span>
                </div>
                <div className="h-[3px] rounded-sm overflow-hidden" style={{ background: 'var(--surface3)' }}>
                  <div className="h-full rounded-sm transition-all" style={{ width: `${cat.pct}%`, background: cat.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <div className="text-[10px] font-medium uppercase tracking-[2px] mb-3" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
              Por estado
            </div>
            {[
              { label: 'Submetidas', n: '142', color: '#2563eb' },
              { label: 'Em análise', n: '89', color: '#06b6d4' },
              { label: 'Em implementação', n: '28', color: '#7c3aed' },
              { label: 'Concluídas', n: '12', color: '#22c55e' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex justify-between px-3 py-2 rounded-lg border text-[12px] mb-1.5 cursor-pointer transition-all hover:bg-[var(--surface2)]"
                style={{ background: 'var(--surface)', borderColor: 'var(--border-light)' }}
                onClick={() => setActiveStatus(stat.label)}
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: stat.color }} />
                  <span style={{ color: 'var(--text)' }}>{stat.label}</span>
                </div>
                <span className="font-bold" style={{ fontFamily: 'var(--font-mono)', color: stat.color }}>
                  {stat.n}
                </span>
              </div>
            ))}
          </div>

          <div>
            <div className="text-[10px] font-medium uppercase tracking-[2px] mb-3" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
              Top colaboradores
            </div>
            {[
              { name: 'CM', fullName: 'Carla Moreira', count: '8 ideias', bg: 'linear-gradient(135deg, #3126b4, #9437FF)' },
              { name: 'TC', fullName: 'Tiago Costa', count: '6 ideias', bg: 'linear-gradient(135deg, #4294F8, #87007F)' },
              { name: 'MA', fullName: 'Miguel Alves', count: '5 ideias', bg: 'linear-gradient(135deg, #FF0066, #9437FF)' },
              { name: 'SN', fullName: 'Sofia Neves', count: '4 ideias', bg: 'linear-gradient(135deg, #2563eb, #3126b4)' },
            ].map((user) => (
              <div key={user.name} className="flex items-center gap-2.5 text-[11px] mb-2" style={{ color: 'var(--text-muted)' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ background: user.bg }}>
                  {user.name}
                </div>
                <span className="flex-1 truncate">{user.fullName}</span>
                <span className="font-bold flex-shrink-0" style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue)' }}>
                  {user.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Idea detail modal */}
      {selectedIdea && (
        <div
          className="fixed inset-0 bg-black/50 z-[300] flex items-center justify-center p-6"
          onClick={() => setSelectedIdea(null)}
        >
          <div
            className="bg-[var(--surface)] rounded-2xl max-w-[680px] w-full max-h-[85vh] overflow-y-auto shadow-[0_24px_64px_rgba(0,0,0,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-[var(--surface)] border-b px-6 py-4 flex items-center justify-between z-10" style={{ borderColor: 'var(--border-light)' }}>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded font-semibold" style={{ fontFamily: 'var(--font-mono)', color: selectedIdea.catColor, background: selectedIdea.catBg }}>
                  {selectedIdea.cat}
                </span>
                <div className="flex items-center gap-1 text-[11px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: selectedIdea.statusColor }} />
                  {selectedIdea.status}
                </div>
              </div>
              <button
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all hover:bg-[var(--surface2)] text-[18px]"
                style={{ color: 'var(--text-muted)' }}
                onClick={() => setSelectedIdea(null)}
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-6">
              <h2 className="text-[22px] font-bold mb-4 leading-[1.3] tracking-[-0.5px]" style={{ color: 'var(--text)' }}>
                {selectedIdea.title}
              </h2>

              <div className="flex items-center gap-4 mb-6 pb-5 border-b" style={{ borderColor: 'var(--border-light)' }}>
                <div className="flex items-center gap-1.5 text-[12px]" style={{ color: 'var(--text-muted)' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                  {selectedIdea.author}
                </div>
                <div className="flex items-center gap-1.5 text-[12px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  ▲ {selectedIdea.votes + (votedIds.has(selectedIdea.id) ? 1 : 0)} votos
                </div>
                <div className="flex items-center gap-1.5 text-[12px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  💬 {selectedIdea.comments} comentários
                </div>
              </div>

              <div className="space-y-5">
                {[
                  { label: 'Problema', text: `Identificámos desafios significativos relacionados com ${selectedIdea.title.toLowerCase()}, que afectam directamente a eficiência operacional e a satisfação dos envolvidos.` },
                  { label: 'Solução Proposta', text: `A solução passa por implementar ${selectedIdea.title.toLowerCase()}, através de uma abordagem estruturada e centrada nas necessidades reais dos utilizadores.` },
                ].map((block) => (
                  <div key={block.label}>
                    <div className="text-[12px] font-bold mb-1.5" style={{ color: 'var(--text)' }}>{block.label}</div>
                    <div className="text-[13px] leading-[1.7]" style={{ color: 'var(--text-muted)' }}>{block.text}</div>
                  </div>
                ))}

                <div>
                  <div className="text-[12px] font-bold mb-2" style={{ color: 'var(--text)' }}>Impacto Esperado</div>
                  <ul className="space-y-1.5">
                    {['Aumento de 30% na produtividade', 'Redução de custos operacionais em 20%', 'Melhoria da satisfação dos utilizadores', 'Optimização dos processos internos'].map((impact, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px]" style={{ color: 'var(--text-muted)' }}>
                        <span className="mt-0.5 flex-shrink-0" style={{ color: selectedIdea.catColor }}>›</span>
                        {impact}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-2.5 mt-7 pt-5 border-t" style={{ borderColor: 'var(--border-light)' }}>
                <button
                  className="flex-1 px-4 py-2.5 rounded-full border-[1.5px] text-[13px] font-semibold cursor-pointer transition-all hover:bg-[var(--surface2)] flex items-center justify-center gap-2"
                  style={{
                    borderColor: votedIds.has(selectedIdea.id) ? 'var(--blue)' : 'var(--border2)',
                    color: votedIds.has(selectedIdea.id) ? 'var(--blue)' : 'var(--text)',
                    background: votedIds.has(selectedIdea.id) ? 'var(--blue-light)' : 'transparent',
                    fontFamily: 'var(--font-outfit)',
                  }}
                  onClick={(e) => handleVote(selectedIdea.id, e)}
                >
                  ▲ {votedIds.has(selectedIdea.id) ? 'Votado' : 'Votar'} ({selectedIdea.votes + (votedIds.has(selectedIdea.id) ? 1 : 0)})
                </button>
                <button
                  className="flex-1 px-4 py-2.5 rounded-full text-white text-[13px] font-semibold cursor-pointer transition-all hover:bg-[#1d4ed8] flex items-center justify-center gap-2"
                  style={{ background: 'var(--blue)', fontFamily: 'var(--font-outfit)' }}
                >
                  💬 Comentar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
