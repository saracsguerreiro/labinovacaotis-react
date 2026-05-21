import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useIdeas } from '../context/IdeaContext';
import { useIdeaFilters } from '../hooks/useIdeaFilters';
import { useIdeaModal } from '../hooks/useIdeaModal';
import { useComments } from '../hooks/useComments';
import type { Idea } from '../hooks/useIdeaFilters';
import type { Comment } from '../hooks/useComments';

// ─── View type ────────────────────────────────────────────────────────────────
type HubView = 'nebula' | 'lista';

// ─── Category colour map ──────────────────────────────────────────────────────
const CAT_COLOR: Record<string, string> = {
  Pessoas:  '#9437FF',
  Produto:  '#FF0066',
  CX:       '#4294F8',
  Processo: '#3126b4',
  Tech:     '#036ef2',
  Outros:   '#87007f',
};

// ─── Rich idea content ────────────────────────────────────────────────────────
const IDEA_CONTENT: Record<number, { problem: string; solution: string; impact: string[] }> = {
  1:  { problem: 'Identificámos desafios significativos relacionados com o modelo de trabalho híbrido estruturado, que afectam directamente a eficiência operacional e a satisfação dos envolvidos.', solution: 'A solução passa por implementar um modelo de trabalho híbrido estruturado, através de uma abordagem centrada nas necessidades reais dos utilizadores.', impact: ['Aumento de 30% na produtividade', 'Redução de custos operacionais em 20%', 'Melhoria da satisfação dos colaboradores', 'Optimização dos processos internos'] },
  2:  { problem: 'Os clientes enfrentam dificuldades no acesso a suporte imediato, resultando em elevado tempo de espera e redução da satisfação geral com o serviço.', solution: 'Desenvolver uma app self-service com IA conversacional que resolva pedidos sem intervenção humana, disponível 24/7.', impact: ['Redução de 40% nos tickets de suporte', 'NPS aumenta em 25 pontos', 'Disponibilidade de suporte 24/7', 'Diminuição do custo por contacto'] },
  3:  { problem: 'Colaboradores internos perdem tempo significativo à espera de respostas a questões operacionais, afectando a produtividade diária das equipas.', solution: 'Implementar um chatbot interno com IA capaz de responder automaticamente a questões de RH, TI e operações em tempo real.', impact: ['Resposta imediata a 80% das questões', 'Redução de 60% nos pedidos de suporte interno', 'Maior autonomia dos colaboradores', 'Libertação de tempo nas equipas de suporte'] },
  4:  { problem: 'O processo de aprovação de despesas é manual, lento e propenso a erros, causando atrasos no reembolso e frustração nos colaboradores.', solution: 'Automatizar o fluxo de aprovação através de um sistema inteligente com regras de negócio configuráveis e notificações em tempo real.', impact: ['Redução de 70% no tempo de aprovação', 'Eliminação de erros manuais', 'Maior transparência no processo', 'Poupança estimada de 15h/semana por equipa'] },
  5:  { problem: 'O processo de integração de novos colaboradores é inconsistente e demorado, resultando numa experiência inicial negativa e maior rotatividade.', solution: 'Criar uma plataforma de onboarding digital com percursos personalizados por função e um assistente de IA que guia cada colaborador.', impact: ['Redução de 50% no tempo de integração', 'Aumento de 35% na retenção nos primeiros 6 meses', 'Experiência consistente e personalizada', 'Maior engajamento desde o primeiro dia'] },
  6:  { problem: 'A falta de visibilidade centralizada sobre as métricas operacionais obriga os gestores a consultar múltiplos sistemas, perdendo tempo e eficácia.', solution: 'Desenvolver um dashboard unificado com métricas em tempo real de todos os departamentos, com alertas automáticos e drill-down por área.', impact: ['Decisões baseadas em dados em tempo real', 'Redução de 80% no tempo de reporte', 'Identificação rápida de desvios', 'Maior alinhamento entre equipas'] },
  7:  { problem: 'A integração com parceiros externos é complexa e pouco padronizada, causando atrasos nos projetos e elevados custos de desenvolvimento.', solution: 'Criar uma API standard bem documentada e segura que permita integrações rápidas com sistemas externos de forma escalável.', impact: ['Redução de 60% no tempo de integração', 'Maior segurança nas trocas de dados', 'Ecossistema de parceiros mais ágil', 'Redução de custos de desenvolvimento'] },
  8:  { problem: 'Os clientes dependem de canais tradicionais para gerir contratos, o que gera filas de espera, erros e baixa satisfação com o serviço.', solution: 'Desenvolver uma app web self-service que permita aos clientes gerir contratos, pedidos e histórico de forma autónoma e intuitiva.', impact: ['Redução de 45% nas chamadas de suporte', 'Aumento de 30% na satisfação do cliente', 'Disponibilidade 24/7 para gestão', 'Redução de erros no processamento'] },
  9:  { problem: 'Os eventos internos da empresa geram emissões de carbono significativas sem qualquer monitorização ou estratégia de compensação definida.', solution: 'Implementar um programa de neutralidade carbónica para eventos, com medição de emissões, compensação via créditos e práticas sustentáveis.', impact: ['Redução de 50% nas emissões por evento', 'Certificação de sustentabilidade', 'Melhoria da imagem corporativa', 'Alinhamento com metas ESG da empresa'] },
  10: { problem: 'O conhecimento e experiência estão concentrados em silos departamentais, limitando o desenvolvimento profissional e a inovação transversal.', solution: 'Criar um programa estruturado de mentoria cruzada que conecte colaboradores de departamentos diferentes por áreas de interesse.', impact: ['Partilha de conhecimento entre 100+ colaboradores', 'Aumento de 40% na satisfação profissional', 'Redução de silos organizacionais', 'Desenvolvimento de competências transversais'] },
  11: { problem: 'Os dados de comportamento do cliente estão dispersos por múltiplas plataformas, impossibilitando análises coerentes e acções personalizadas.', solution: 'Construir um data lake centralizado que consolide dados de todas as fontes, com capacidade de análise avançada e modelos preditivos.', impact: ['Visão 360° do comportamento do cliente', 'Personalização de ofertas em escala', 'Antecipação de churn em 60%', 'Decisões de produto mais informadas'] },
  12: { problem: 'A falta de reconhecimento formal entre pares reduz a motivação e o sentimento de pertença, afectando a cultura organizacional positivamente.', solution: 'Implementar um sistema digital de reconhecimento entre pares, com badges, pontos e visibilidade na plataforma interna.', impact: ['Aumento de 45% no engagement', 'Melhoria do clima organizacional', 'Reconhecimento de 500+ contribuições/mês', 'Retenção de talentos melhorada'] },
};

interface BubbleState {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  idea: Idea;
}

// ─── View toggle pill ─────────────────────────────────────────────────────────
function ViewToggle({ view, onChange, dark }: { view: HubView; onChange: (v: HubView) => void; dark: boolean }) {
  return (
    <div style={{
      display: 'inline-flex', gap: 0,
      background: dark ? 'rgba(255,255,255,0.10)' : 'rgba(13,19,51,0.07)',
      border: dark ? '1px solid rgba(255,255,255,0.20)' : '1px solid rgba(13,19,51,0.14)',
      borderRadius: 14, padding: 4,
    }}>
      {([['nebula', '🫧 Bolhas'], ['lista', '☰ Lista']] as const).map(([v, label]) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          style={{
            padding: '7px 18px', borderRadius: 10, border: 'none',
            background: view === v
              ? dark ? 'rgba(255,255,255,0.18)' : '#2563eb'
              : 'transparent',
            color: view === v
              ? 'white'
              : dark ? 'rgba(255,255,255,0.55)' : 'rgba(13,19,51,0.45)',
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
            transition: 'all 0.22s',
            fontFamily: 'var(--font-outfit)',
          }}
        >{label}</button>
      ))}
    </div>
  );
}

// ─── Dark detail modal (used by Nebula) ───────────────────────────────────────
function DarkModal({ idea, onClose, hasVoted, toggleVote, localComments, addComment }: {
  idea: Idea;
  onClose: () => void;
  hasVoted: (id: number) => boolean;
  toggleVote: (id: number, e: ReactMouseEvent) => void;
  localComments: Comment[];
  addComment: (ideaId: number, text: string) => void;
}) {
  const [commentText, setCommentText] = useState('');
  const color   = CAT_COLOR[idea.cat] || '#2563eb';
  const content = IDEA_CONTENT[idea.id];
  const voted   = hasVoted(idea.id);

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    addComment(idea.id, commentText);
    setCommentText('');
  };

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(0,0,0,0.74)', backdropFilter: 'blur(12px)' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative', borderRadius: 24,
          width: '100%', maxWidth: 580, maxHeight: '88vh', overflowY: 'auto',
          background: 'linear-gradient(145deg, #0c1345 0%, #040815 100%)',
          border: `1px solid ${color}44`,
          boxShadow: `0 0 80px ${color}22, 0 32px 64px rgba(0,0,0,0.6)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '20px 24px 0' }}>
          <span style={{ background: color + '28', color, padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700 }}>
            {idea.cat}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block' }} />
            {idea.status}
          </span>
          <button onClick={onClose} style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: 32, height: 32, color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>
        <div style={{ padding: '16px 24px 0' }}>
          <h2 style={{ color: 'white', fontSize: 22, fontWeight: 800, lineHeight: 1.3, margin: 0 }}>{idea.title}</h2>
        </div>
        <div style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>👤 {idea.author}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
            <span style={{ color, fontWeight: 700 }}>▲</span>{voted ? idea.votes + 1 : idea.votes} votos
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>💬 {idea.comments + localComments.length} comentários</span>
        </div>
        {content && (
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <p style={{ color: 'white', fontWeight: 700, fontSize: 14, margin: '0 0 6px' }}>Problema</p>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.65, margin: 0 }}>{content.problem}</p>
            </div>
            <div>
              <p style={{ color: 'white', fontWeight: 700, fontSize: 14, margin: '0 0 6px' }}>Solução Proposta</p>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.65, margin: 0 }}>{content.solution}</p>
            </div>
            <div>
              <p style={{ color: 'white', fontWeight: 700, fontSize: 14, margin: '0 0 8px' }}>Impacto Esperado</p>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {content.impact.map((item, i) => (
                  <li key={i} style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ color, fontSize: 13, flexShrink: 0, marginTop: 1 }}>›</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {/* Votar */}
        <div style={{ padding: '0 24px 20px', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 20, display: 'flex', gap: 12 }}>
          <button
            onClick={e => toggleVote(idea.id, e)}
            style={{
              flex: 1, background: voted ? color : 'rgba(255,255,255,0.08)',
              color: 'white', border: `1px solid ${voted ? color : 'rgba(255,255,255,0.2)'}`,
              borderRadius: 99, padding: '12px 0', fontSize: 14, fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.22s',
            }}
          >▲ {voted ? 'Votado' : `Votar (${idea.votes})`}</button>
        </div>

        {/* Comentários */}
        <div style={{ padding: '0 24px 28px', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 20 }}>
          <p style={{ color: 'white', fontWeight: 700, fontSize: 14, margin: '0 0 14px' }}>
            💬 Comentários ({idea.comments + localComments.length})
          </p>

          {/* Comentários sintéticos anteriores */}
          {idea.comments > 0 && localComments.length === 0 && (
            <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 12, fontStyle: 'italic', margin: '0 0 12px' }}>
              {idea.comments} comentário{idea.comments !== 1 ? 's' : ''} de sessões anteriores
            </p>
          )}
          {idea.comments > 0 && localComments.length > 0 && (
            <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 12, fontStyle: 'italic', margin: '0 0 12px' }}>
              + {idea.comments} comentário{idea.comments !== 1 ? 's' : ''} anteriores
            </p>
          )}

          {/* Comentários locais */}
          {localComments.map(c => (
            <div key={c.id} style={{ marginBottom: 10, padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ color, fontSize: 12, fontWeight: 700 }}>{c.author}</span>
                <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: 11 }}>
                  {new Date(c.timestamp).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: 13, margin: 0, lineHeight: 1.55 }}>{c.text}</p>
            </div>
          ))}

          {localComments.length === 0 && idea.comments === 0 && (
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, margin: '0 0 12px', fontStyle: 'italic' }}>
              Ainda sem comentários. Sê o primeiro!
            </p>
          )}

          {/* Input novo comentário */}
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <input
              type="text"
              placeholder="Escreve um comentário..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmitComment()}
              style={{
                flex: 1, background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10,
                padding: '10px 14px', color: 'white', fontSize: 13, outline: 'none',
                fontFamily: 'var(--font-outfit)',
              }}
            />
            <button
              onClick={handleSubmitComment}
              style={{
                background: commentText.trim() ? '#2563eb' : 'rgba(255,255,255,0.08)',
                color: 'white', border: 'none', borderRadius: 10,
                padding: '10px 18px', fontWeight: 700, fontSize: 14,
                cursor: commentText.trim() ? 'pointer' : 'default',
                transition: 'background 0.2s',
              }}
            >↩</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Stats section (shown below the Nebula) ───────────────────────────────────
function StatsSection({ onStatusFilter }: { onStatusFilter?: (s: string) => void }) {
  return (
    <div style={{ background: '#050714', padding: '64px 40px 72px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 48 }}>

        {/* Por categoria */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 20, fontFamily: 'var(--font-mono)' }}>
            Por categoria
          </div>
          {[
            { name: 'Processo', pct: 34, color: '#3126b4' },
            { name: 'Tecnologia', pct: 28, color: '#036ef2' },
            { name: 'Pessoas', pct: 22, color: '#9437FF' },
            { name: 'CX', pct: 10, color: '#4294F8' },
            { name: 'Outros', pct: 6, color: '#87007f' },
          ].map(cat => (
            <div key={cat.name} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                <span>{cat.name}</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: cat.color }}>{cat.pct}%</span>
              </div>
              <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.07)' }}>
                <div style={{ height: '100%', borderRadius: 2, width: `${cat.pct}%`, background: cat.color, boxShadow: `0 0 8px ${cat.color}88` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Por estado */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 20, fontFamily: 'var(--font-mono)' }}>
            Por estado
          </div>
          {[
            { label: 'Submetidas', n: '142', color: '#036ef2' },
            { label: 'Em análise', n: '89', color: '#4294F8' },
            { label: 'Em implementação', n: '28', color: '#9437FF' },
            { label: 'Concluídas', n: '12', color: '#FF0066' },
          ].map(stat => (
            <div
              key={stat.label}
              onClick={() => onStatusFilter?.(stat.label)}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px', borderRadius: 10, marginBottom: 8,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'default', transition: 'background 0.18s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: stat.color, boxShadow: `0 0 6px ${stat.color}` }} />
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{stat.label}</span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 800, color: stat.color }}>{stat.n}</span>
            </div>
          ))}
        </div>

        {/* Top colaboradores */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 20, fontFamily: 'var(--font-mono)' }}>
            Top colaboradores
          </div>
          {[
            { name: 'CM', fullName: 'Carla Moreira', count: '8 ideias', bg: 'linear-gradient(135deg, #3126b4, #9437FF)' },
            { name: 'TC', fullName: 'Tiago Costa', count: '6 ideias', bg: 'linear-gradient(135deg, #4294F8, #87007F)' },
            { name: 'MA', fullName: 'Miguel Alves', count: '5 ideias', bg: 'linear-gradient(135deg, #FF0066, #9437FF)' },
            { name: 'SN', fullName: 'Sofia Neves', count: '4 ideias', bg: 'linear-gradient(135deg, #036ef2, #3126b4)' },
          ].map((user, i) => (
            <div key={user.name} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: user.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: 'white', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                {user.name}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600 }}>{user.fullName}</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 1 }}>#{i + 1} contributor</div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 800, color: '#2563eb' }}>{user.count}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NEBULA VIEW — full-screen space canvas with floating bubbles
// ═══════════════════════════════════════════════════════════════════════════════
const NEBULA_STATUSES = ['Todos', 'Submetida', 'Em análise', 'Em implementação', 'Concluída'];

function NebulaView({ onSwitch }: { onSwitch: () => void }) {
  const { ideas, hasVoted, toggleVote } = useIdeas();
  const { addComment, getComments } = useComments();
  const containerRef = useRef<HTMLDivElement>(null);
  const bubblesRef   = useRef<BubbleState[]>([]);
  const mouseRef     = useRef({ x: -9999, y: -9999 });
  const rafRef       = useRef<number>(0);
  const frameRef     = useRef(0);

  const [, setTick]      = useState(0);
  const [selected, setSelected] = useState<Idea | null>(null);
  const [filterCat, setFilterCat]       = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [search, setSearch]             = useState('');
  const [sortBy, setSortBy]             = useState<'votes' | 'comments'>('votes');

  const stars = useMemo(() =>
    Array.from({ length: 110 }, (_, i) => ({
      id: i,
      left:    parseFloat((Math.random() * 100).toFixed(2)),
      top:     parseFloat((Math.random() * 100).toFixed(2)),
      size:    parseFloat((Math.random() * 1.8 + 0.4).toFixed(2)),
      opacity: parseFloat((Math.random() * 0.55 + 0.08).toFixed(2)),
    })), []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    if (!width || !height) return;

    const minVotes = Math.min(...ideas.map(i => i.votes));
    const maxVotes = Math.max(...ideas.map(i => i.votes));
    const minR = 48, maxR = 96;

    bubblesRef.current = ideas.map(idea => {
      const t = maxVotes === minVotes ? 0.5 : (idea.votes - minVotes) / (maxVotes - minVotes);
      const radius = minR + t * (maxR - minR);
      const navBottom = 92;
      return {
        id: idea.id,
        x: radius + Math.random() * (width  - radius * 2),
        y: navBottom + radius + Math.random() * (height - navBottom - radius * 2),
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius,
        idea,
      };
    });
    setTick(t => t + 1);
  }, [ideas]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || bubblesRef.current.length === 0) return;

    const loop = () => {
      const { width, height } = el.getBoundingClientRect();
      const { x: mx, y: my } = mouseRef.current;
      const bs = bubblesRef.current;

      for (let i = 0; i < bs.length; i++) {
        const b = bs[i];
        const dx = b.x - mx, dy = b.y - my;
        const dist = Math.hypot(dx, dy);
        if (dist < 170 && dist > 0) {
          const f = ((170 - dist) / 170) * 0.22;
          b.vx += (dx / dist) * f;
          b.vy += (dy / dist) * f;
        }
        b.vx += (Math.random() - 0.5) * 0.012;
        b.vy += (Math.random() - 0.5) * 0.012;
        b.vx *= 0.986; b.vy *= 0.986;
        const spd = Math.hypot(b.vx, b.vy);
        if (spd > 1.6) { b.vx = b.vx / spd * 1.6; b.vy = b.vy / spd * 1.6; }
        b.x += b.vx; b.y += b.vy;
        const navBottom = 92;
        if (b.x - b.radius < 0)                { b.x = b.radius;                b.vx =  Math.abs(b.vx); }
        if (b.x + b.radius > width)             { b.x = width - b.radius;        b.vx = -Math.abs(b.vx); }
        if (b.y - b.radius < navBottom)         { b.y = navBottom + b.radius;    b.vy =  Math.abs(b.vy); }
        if (b.y + b.radius > height)            { b.y = height - b.radius;       b.vy = -Math.abs(b.vy); }

        for (let j = i + 1; j < bs.length; j++) {
          const b2 = bs[j];
          const cx = b2.x - b.x, cy = b2.y - b.y;
          const cd = Math.hypot(cx, cy);
          const minD = b.radius + b2.radius + 6;
          if (cd < minD && cd > 0) {
            const overlap = (minD - cd) * 0.5;
            const nx = cx / cd, ny = cy / cd;
            b.x  -= nx * overlap; b.y  -= ny * overlap;
            b2.x += nx * overlap; b2.y += ny * overlap;
            const dvx = b2.vx - b.vx, dvy = b2.vy - b.vy;
            const dot = dvx * nx + dvy * ny;
            if (dot < 0) {
              b.vx  += dot * nx * 0.55; b.vy  += dot * ny * 0.55;
              b2.vx -= dot * nx * 0.55; b2.vy -= dot * ny * 0.55;
            }
          }
        }
      }

      frameRef.current++;
      if (frameRef.current % 2 === 0) setTick(t => t + 1);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bubblesRef.current.length]);

  const handleMouseMove = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const categories = useMemo(() => [...new Set(ideas.map(i => i.cat))], [ideas]);

  return (
    <div style={{ background: '#050714' }}>

      {/* ── Full-screen nebula canvas ── */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { mouseRef.current = { x: -9999, y: -9999 }; }}
        style={{
          position: 'relative',
          height: '100vh',
          overflow: 'hidden',
          background: 'radial-gradient(ellipse at 50% 38%, #0a1240 0%, #060b1e 55%, #010308 100%)',
        }}
      >
        {/* Stars */}
        {stars.map(s => (
          <div key={s.id} style={{ position: 'absolute', left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, borderRadius: '50%', background: 'white', opacity: s.opacity, pointerEvents: 'none' }} />
        ))}

        {/* Ambient glows */}
        <div style={{ position: 'absolute', left: '8%', top: '20%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: '6%', bottom: '15%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(148,55,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: '55%', top: '45%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,0,102,0.03) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* ── Filter panel — left side, below nav ── */}
        <div style={{
          position: 'absolute', top: 100, left: 20, zIndex: 10,
          width: 196,
          maxHeight: 'calc(100vh - 130px)',
          overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: 0,
          background: 'rgba(4,6,18,0.82)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          border: '1px solid rgba(255,255,255,0.13)',
          borderRadius: 16,
        }}>

          {/* Search */}
          <div style={{ padding: '14px 14px 10px' }}>
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Pesquisar..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  borderRadius: 9, padding: '7px 8px 7px 28px',
                  color: 'white', fontSize: 12, outline: 'none',
                  fontFamily: 'var(--font-outfit)',
                }}
              />
            </div>
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '0 14px' }} />

          {/* Categoria */}
          <div style={{ padding: '12px 14px 4px' }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>
              Categoria
            </div>
            <div onClick={() => setFilterCat(null)} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 7, opacity: filterCat === null ? 1 : 0.42, transition: 'opacity 0.2s' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />
              <span style={{ color: filterCat === null ? 'white' : 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: filterCat === null ? 700 : 400 }}>Todas</span>
            </div>
            {categories.map(cat => {
              const catColor = CAT_COLOR[cat] || '#2563eb';
              const active   = filterCat === cat;
              return (
                <div key={cat} onClick={() => setFilterCat(f => f === cat ? null : cat)} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 7, opacity: filterCat === null || active ? 1 : 0.35, transition: 'opacity 0.2s' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: catColor, boxShadow: `0 0 7px ${catColor}${active ? 'cc' : '55'}`, transform: active ? 'scale(1.3)' : 'scale(1)', transition: 'transform 0.2s', flexShrink: 0 }} />
                  <span style={{ color: active ? 'white' : 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: active ? 700 : 400, transition: 'color 0.2s' }}>{cat}</span>
                </div>
              );
            })}
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '4px 14px' }} />

          {/* Estado */}
          <div style={{ padding: '10px 14px 4px' }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>
              Estado
            </div>
            {NEBULA_STATUSES.map(s => {
              const active = filterStatus === s;
              return (
                <div key={s} onClick={() => setFilterStatus(s)} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 7, opacity: filterStatus === 'Todos' || active ? 1 : 0.38, transition: 'opacity 0.2s' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: active ? '#2563eb' : 'rgba(255,255,255,0.2)', transition: 'background 0.2s', flexShrink: 0 }} />
                  <span style={{ color: active ? 'white' : 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: active ? 700 : 400, transition: 'color 0.2s' }}>{s}</span>
                </div>
              );
            })}
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '4px 14px' }} />

          {/* Ordenar */}
          <div style={{ padding: '10px 14px 14px' }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>
              Ordenar
            </div>
            {([['votes', 'Mais votadas'], ['comments', 'Mais comentadas']] as const).map(([val, label]) => {
              const active = sortBy === val;
              return (
                <div key={val} onClick={() => setSortBy(val)} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 7 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', border: `2px solid ${active ? '#2563eb' : 'rgba(255,255,255,0.25)'}`, background: active ? '#2563eb' : 'transparent', transition: 'all 0.2s', flexShrink: 0 }} />
                  <span style={{ color: active ? 'white' : 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: active ? 700 : 400, transition: 'color 0.2s' }}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── View toggle — top-right corner, below nav ── */}
        <div style={{ position: 'absolute', top: 100, right: 20, zIndex: 10 }}>
          <ViewToggle view="nebula" onChange={v => v === 'lista' && onSwitch()} dark />
        </div>

        {/* ── Bubbles ── */}
        {bubblesRef.current.map(b => {
          const color      = CAT_COLOR[b.idea.cat] || '#2563eb';
          const q = search.trim().toLowerCase();
          const isFiltered =
            (filterCat !== null && b.idea.cat !== filterCat) ||
            (filterStatus !== 'Todos' && b.idea.status !== filterStatus) ||
            (q !== '' && !b.idea.title.toLowerCase().includes(q));
          // highlight top ideas when sorted by votes
          const rank = sortBy === 'votes'
            ? [...ideas].sort((a, b2) => b2.votes - a.votes).findIndex(i => i.id === b.id)
            : [...ideas].sort((a, b2) => b2.comments - a.comments).findIndex(i => i.id === b.id);
          const isTopRanked = rank < 3;
          const voted      = hasVoted(b.id);
          const r          = b.radius;
          const maxChars   = Math.floor(r * 0.42);
          const label      = b.idea.title.length > maxChars ? b.idea.title.slice(0, maxChars - 1) + '…' : b.idea.title;
          const fontSize   = Math.max(11, Math.min(16, r * 0.19));

          return (
            <div
              key={b.id}
              onClick={() => !isFiltered && setSelected(b.idea)}
              style={{
                position: 'absolute',
                left: b.x - r, top: b.y - r,
                width: r * 2, height: r * 2,
                borderRadius: '50%',
                background: `radial-gradient(circle at 36% 30%, ${color}99 0%, ${color}33 55%, ${color}0d 100%)`,
                border:     `1.5px solid ${color}${voted ? 'cc' : '66'}`,
                boxShadow:  isFiltered ? 'none' : `0 0 ${r * 0.5}px ${color}55, inset 0 0 ${r * 0.3}px ${color}1e`,
                opacity:    isFiltered ? 0.08 : 1,
                transition: 'opacity 0.35s ease',
                cursor:     isFiltered ? 'default' : 'pointer',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                textAlign: 'center',
                userSelect: 'none',
                gap: 4,
              }}
            >
              <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`, pointerEvents: 'none' }} />
              {isTopRanked && !isFiltered && (
                <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: `1.5px solid ${color}88`, boxShadow: `0 0 12px ${color}66`, pointerEvents: 'none', animation: 'none' }} />
              )}
              <span style={{
                fontSize, color: 'white', fontWeight: 700, lineHeight: 1.3,
                textShadow: '0 1px 4px rgba(0,0,0,0.95), 0 0 12px rgba(0,0,0,0.8)',
                display: 'block', wordBreak: 'break-word', padding: '0 8px', textAlign: 'center',
              }}>{label}</span>
              <span style={{ fontSize: Math.max(8, fontSize - 1), color, fontWeight: 800, textShadow: `0 0 8px ${color}` }}>
                ▲ {voted ? b.idea.votes + 1 : b.idea.votes}
              </span>
            </div>
          );
        })}

        {/* Hint */}
        <div style={{ position: 'absolute', bottom: 16, right: 20, color: 'rgba(255,255,255,0.18)', fontSize: 11, fontStyle: 'italic', pointerEvents: 'none' }}>
          move o rato · clica para explorar
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, pointerEvents: 'none', animation: 'none' }}>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>resumo</span>
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
            <path d="M1 1l7 7 7-7" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* ── Stats section below the nebula ── */}
      <StatsSection />

      {/* ── Detail modal ── */}
      {selected && (
        <DarkModal
          idea={selected}
          onClose={() => setSelected(null)}
          hasVoted={hasVoted}
          toggleVote={toggleVote}
          localComments={getComments(selected.id)}
          addComment={addComment}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LISTA VIEW — original list layout (light theme)
// ═══════════════════════════════════════════════════════════════════════════════
const LIST_CATEGORIES = ['Todas', 'Processo', 'Produto', 'Tech', 'CX', 'Pessoas', 'Outros'];
const LIST_STATUSES   = ['Todos', 'Submetida', 'Em análise', 'Em implementação', 'Concluída'];
const LIST_SORTS      = [
  { label: 'Mais votadas',    value: 'votes'    },
  { label: 'Mais comentadas', value: 'comments' },
];

function ListaView({ onSwitch }: { onSwitch: () => void }) {
  const navigate = useNavigate();
  const { ideas, hasVoted, toggleVote: handleVote } = useIdeas();
  const { search, setSearch, activeCategory, setActiveCategory, activeStatus, setActiveStatus, sortBy, setSortBy, filtered, clearFilters } = useIdeaFilters(ideas);
  const { selectedIdea, open: openIdea, close: closeIdea } = useIdeaModal();
  const { addComment, getComments } = useComments();
  const [listCommentText, setListCommentText] = useState('');

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
          <div className="flex items-center gap-3 flex-shrink-0">
            <ViewToggle view="lista" onChange={v => v === 'nebula' && onSwitch()} dark={false} />
            <button
              className="px-[18px] py-2 rounded-full border-none text-white text-[12px] font-bold cursor-pointer whitespace-nowrap transition-all hover:bg-[#1d4ed8]"
              style={{ background: 'var(--blue)', boxShadow: '0 3px 10px var(--blue-glow)', fontFamily: 'var(--font-outfit)' }}
              onClick={() => navigate('/criar')}
            >
              + Nova Ideia
            </button>
          </div>
        </div>

        {/* Search + filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-[320px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-sub)' }}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Pesquisar ideias..."
              className="w-full pl-9 pr-4 py-1.5 border-[1.5px] rounded-full text-[12px] outline-none transition-all bg-transparent focus:border-[var(--blue)]"
              style={{ borderColor: 'var(--border-light)', color: 'var(--text)', fontFamily: 'var(--font-outfit)' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {LIST_CATEGORIES.map(cat => (
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
              >{cat}</button>
            ))}
          </div>
          <div className="w-px h-4" style={{ background: 'var(--border-light)' }} />
          <select
            className="px-3 py-1 border-[1.5px] rounded-full text-[11px] cursor-pointer bg-transparent outline-none"
            style={{ borderColor: 'var(--border-light)', color: 'var(--text-muted)', fontFamily: 'var(--font-outfit)' }}
            value={activeStatus}
            onChange={e => setActiveStatus(e.target.value)}
          >
            {LIST_STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <select
            className="px-3 py-1 border-[1.5px] rounded-full text-[11px] cursor-pointer bg-transparent outline-none"
            style={{ borderColor: 'var(--border-light)', color: 'var(--text-muted)', fontFamily: 'var(--font-outfit)' }}
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'votes' | 'comments')}
          >
            {LIST_SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-[1fr_260px]" style={{ height: 'calc(100vh - 178px)', overflow: 'hidden' }}>

        {/* Feed */}
        <div className="overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3" style={{ color: 'var(--text-muted)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <div className="text-[14px]">Nenhuma ideia encontrada</div>
              <button className="text-[12px] underline" style={{ color: 'var(--blue)' }} onClick={clearFilters}>Limpar filtros</button>
            </div>
          ) : (
            filtered.map((idea, i) => (
              <div
                key={idea.id}
                className="flex items-start gap-4 px-7 py-5 border-b cursor-pointer transition-all hover:bg-[var(--surface2)]"
                style={{ borderColor: 'var(--border-light)' }}
                onClick={() => openIdea(idea)}
              >
                <div className="text-[32px] font-[900] leading-[1] min-w-[36px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
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
                    <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{idea.author}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold" style={{ fontFamily: 'var(--font-mono)', color: idea.catColor, background: idea.catBg }}>
                      {idea.cat}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0 pt-1" onClick={e => e.stopPropagation()}>
                  <button
                    className="px-2.5 py-1.5 text-[11px] border-[1.5px] rounded-full bg-transparent cursor-pointer transition-all flex items-center gap-1"
                    style={{
                      borderColor: hasVoted(idea.id) ? 'var(--blue)' : 'var(--border-light)',
                      color:       hasVoted(idea.id) ? 'var(--blue)' : 'var(--text-muted)',
                      background:  hasVoted(idea.id) ? 'var(--blue-light)' : 'transparent',
                      fontFamily: 'var(--font-mono)',
                    }}
                    onClick={e => handleVote(idea.id, e)}
                  >▲ {idea.votes + (hasVoted(idea.id) ? 1 : 0)}</button>
                  <button
                    className="px-2.5 py-1.5 text-[11px] border-[1.5px] rounded-full bg-transparent cursor-pointer"
                    style={{ borderColor: 'var(--border-light)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                  >💬 {idea.comments}</button>
                  <button
                    className="px-2.5 py-1.5 text-[11px] border-[1.5px] rounded-full cursor-pointer transition-all hover:bg-[var(--blue-light)]"
                    style={{ borderColor: '#036ef2', color: '#036ef2', fontFamily: 'var(--font-mono)', background: 'transparent' }}
                    onClick={() => openIdea(idea)}
                  >Ver →</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="border-l px-6 py-6 overflow-y-auto bg-[var(--bg2)]" style={{ borderColor: 'var(--border-light)' }}>
          <div className="mb-6">
            <div className="text-[10px] font-medium uppercase tracking-[2px] mb-3" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>Por categoria</div>
            {[
              { name: 'Processo',   pct: 34, color: '#3126b4' },
              { name: 'Tecnologia', pct: 28, color: '#036ef2' },
              { name: 'Pessoas',    pct: 22, color: '#9437FF' },
              { name: 'CX',         pct: 10, color: '#4294F8' },
              { name: 'Outros',     pct: 6,  color: '#87007f' },
            ].map(cat => (
              <div key={cat.name} className="mb-2.5">
                <div className="flex justify-between text-[11px] mb-1" style={{ color: 'var(--text-muted)' }}>
                  <span>{cat.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{cat.pct}%</span>
                </div>
                <div className="h-[3px] rounded-sm overflow-hidden" style={{ background: 'var(--surface3)' }}>
                  <div className="h-full rounded-sm" style={{ width: `${cat.pct}%`, background: cat.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <div className="text-[10px] font-medium uppercase tracking-[2px] mb-3" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>Por estado</div>
            {[
              { label: 'Submetidas',        n: '142', color: '#036ef2' },
              { label: 'Em análise',        n: '89',  color: '#4294F8' },
              { label: 'Em implementação',  n: '28',  color: '#9437FF' },
              { label: 'Concluídas',        n: '12',  color: '#FF0066' },
            ].map(stat => (
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
                <span className="font-bold" style={{ fontFamily: 'var(--font-mono)', color: stat.color }}>{stat.n}</span>
              </div>
            ))}
          </div>

          <div>
            <div className="text-[10px] font-medium uppercase tracking-[2px] mb-3" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>Top colaboradores</div>
            {[
              { name: 'CM', fullName: 'Carla Moreira', count: '8 ideias', bg: 'linear-gradient(135deg, #3126b4, #9437FF)' },
              { name: 'TC', fullName: 'Tiago Costa',   count: '6 ideias', bg: 'linear-gradient(135deg, #4294F8, #87007F)' },
              { name: 'MA', fullName: 'Miguel Alves',  count: '5 ideias', bg: 'linear-gradient(135deg, #FF0066, #9437FF)' },
              { name: 'SN', fullName: 'Sofia Neves',   count: '4 ideias', bg: 'linear-gradient(135deg, #036ef2, #3126b4)' },
            ].map(user => (
              <div key={user.name} className="flex items-center gap-2.5 text-[11px] mb-2" style={{ color: 'var(--text-muted)' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ background: user.bg }}>{user.name}</div>
                <span className="flex-1 truncate">{user.fullName}</span>
                <span className="font-bold flex-shrink-0" style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue)' }}>{user.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Idea detail modal (light theme) */}
      {selectedIdea && (
        <div
          className="fixed inset-0 bg-black/50 z-[300] flex items-center justify-center p-6"
          onClick={closeIdea}
        >
          <div
            className="bg-[var(--surface)] rounded-2xl max-w-[680px] w-full max-h-[85vh] overflow-y-auto shadow-[0_24px_64px_rgba(0,0,0,0.25)]"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-[var(--surface)] border-b px-6 py-4 flex items-center justify-between z-10" style={{ borderColor: 'var(--border-light)' }}>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded font-semibold" style={{ fontFamily: 'var(--font-mono)', color: selectedIdea.catColor, background: selectedIdea.catBg }}>{selectedIdea.cat}</span>
                <div className="flex items-center gap-1 text-[11px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: selectedIdea.statusColor }} />
                  {selectedIdea.status}
                </div>
              </div>
              <button className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all hover:bg-[var(--surface2)] text-[18px]" style={{ color: 'var(--text-muted)' }} onClick={closeIdea}>✕</button>
            </div>
            <div className="px-6 py-6">
              <h2 className="text-[22px] font-bold mb-4 leading-[1.3] tracking-[-0.5px]" style={{ color: 'var(--text)' }}>{selectedIdea.title}</h2>
              <div className="flex items-center gap-4 mb-6 pb-5 border-b" style={{ borderColor: 'var(--border-light)' }}>
                <div className="flex items-center gap-1.5 text-[12px]" style={{ color: 'var(--text-muted)' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                  {selectedIdea.author}
                </div>
                <div className="flex items-center gap-1.5 text-[12px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  ▲ {selectedIdea.votes + (hasVoted(selectedIdea.id) ? 1 : 0)} votos
                </div>
                <div className="flex items-center gap-1.5 text-[12px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  💬 {selectedIdea.comments + getComments(selectedIdea.id).length} comentários
                </div>
              </div>
              <div className="space-y-5">
                {[
                  { label: 'Problema',         text: `Identificámos desafios significativos relacionados com ${selectedIdea.title.toLowerCase()}, que afectam directamente a eficiência operacional e a satisfação dos envolvidos.` },
                  { label: 'Solução Proposta',  text: `A solução passa por implementar ${selectedIdea.title.toLowerCase()}, através de uma abordagem estruturada e centrada nas necessidades reais dos utilizadores.` },
                ].map(block => (
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
                    borderColor: hasVoted(selectedIdea.id) ? 'var(--blue)' : 'var(--border2)',
                    color:       hasVoted(selectedIdea.id) ? 'var(--blue)' : 'var(--text)',
                    background:  hasVoted(selectedIdea.id) ? 'var(--blue-light)' : 'transparent',
                    fontFamily: 'var(--font-outfit)',
                  }}
                  onClick={e => handleVote(selectedIdea.id, e)}
                >▲ {hasVoted(selectedIdea.id) ? 'Votado' : 'Votar'} ({selectedIdea.votes + (hasVoted(selectedIdea.id) ? 1 : 0)})</button>
              </div>

              {/* Comentários */}
              <div className="mt-6 pt-5 border-t" style={{ borderColor: 'var(--border-light)' }}>
                <div className="text-[13px] font-bold mb-3" style={{ color: 'var(--text)' }}>
                  💬 Comentários ({selectedIdea.comments + getComments(selectedIdea.id).length})
                </div>

                {selectedIdea.comments > 0 && getComments(selectedIdea.id).length === 0 && (
                  <p className="text-[12px] mb-3 italic" style={{ color: 'var(--text-muted)' }}>
                    {selectedIdea.comments} comentário{selectedIdea.comments !== 1 ? 's' : ''} de sessões anteriores
                  </p>
                )}
                {selectedIdea.comments > 0 && getComments(selectedIdea.id).length > 0 && (
                  <p className="text-[12px] mb-3 italic" style={{ color: 'var(--text-muted)' }}>
                    + {selectedIdea.comments} comentários anteriores
                  </p>
                )}

                {getComments(selectedIdea.id).map(c => (
                  <div key={c.id} className="mb-3 p-3 rounded-xl border" style={{ background: 'var(--surface2)', borderColor: 'var(--border-light)' }}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[12px] font-bold" style={{ color: selectedIdea.catColor }}>{c.author}</span>
                      <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        {new Date(c.timestamp).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[13px] leading-[1.55]" style={{ color: 'var(--text-muted)', margin: 0 }}>{c.text}</p>
                  </div>
                ))}

                {getComments(selectedIdea.id).length === 0 && selectedIdea.comments === 0 && (
                  <p className="text-[13px] mb-3 italic" style={{ color: 'var(--text-muted)' }}>Ainda sem comentários. Sê o primeiro!</p>
                )}

                <div className="flex gap-2 mt-3">
                  <input
                    type="text"
                    placeholder="Escreve um comentário..."
                    value={listCommentText}
                    onChange={e => setListCommentText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && listCommentText.trim()) {
                        addComment(selectedIdea.id, listCommentText);
                        setListCommentText('');
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-xl border text-[13px] outline-none bg-transparent focus:border-[var(--blue)]"
                    style={{ borderColor: 'var(--border-light)', color: 'var(--text)', fontFamily: 'var(--font-outfit)' }}
                  />
                  <button
                    onClick={() => {
                      if (!listCommentText.trim()) return;
                      addComment(selectedIdea.id, listCommentText);
                      setListCommentText('');
                    }}
                    className="px-4 py-2 rounded-xl text-[13px] font-bold text-white"
                    style={{ background: listCommentText.trim() ? 'var(--blue)' : 'var(--surface3)', cursor: listCommentText.trim() ? 'pointer' : 'default', transition: 'background 0.2s' }}
                  >↩</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN — IdeaHub with Nebula / Lista toggle
// ═══════════════════════════════════════════════════════════════════════════════
export default function IdeaHub() {
  const [view, setView] = useState<HubView>('nebula');

  // Notify Navigation of the current view so it can theme itself
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('hub-view-change', { detail: view }));
  }, [view]);

  // Reset to light when leaving the page
  useEffect(() => {
    return () => window.dispatchEvent(new CustomEvent('hub-view-change', { detail: 'lista' }));
  }, []);

  return view === 'nebula'
    ? <NebulaView   onSwitch={() => setView('lista')} />
    : <ListaView    onSwitch={() => setView('nebula')} />;
}
