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
    <div style={{ background: '#050714', borderTop: '1px solid rgba(255,255,255,0.06)' }}>

      {/* ── Resumo header ── */}
      <div style={{ padding: '56px 40px 0', textAlign: 'center', position: 'relative' }}>
        {/* Glow behind title */}
        <div style={{ position: 'absolute', top: 40, left: '50%', transform: 'translateX(-50%)', width: 300, height: 80, background: 'radial-gradient(ellipse, rgba(37,99,235,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
          <div style={{ height: 1, width: 48, background: 'linear-gradient(to right, transparent, rgba(37,99,235,0.6))' }} />
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#2563eb' }}>Resumo das ideias</span>
          <div style={{ height: 1, width: 48, background: 'linear-gradient(to left, transparent, rgba(37,99,235,0.6))' }} />
        </div>

        {/* Key numbers */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginTop: 24, marginBottom: 56, flexWrap: 'wrap' }}>
          {[
            { n: '271', label: 'ideias submetidas', color: '#2563eb' },
            { n: '89',  label: 'em análise',        color: '#9437FF' },
            { n: '28',  label: 'em implementação',  color: '#4294F8' },
            { n: '12',  label: 'concluídas',        color: '#FF0066' },
          ].map((item, i, arr) => (
            <div key={item.label} style={{ textAlign: 'center', padding: '0 36px', borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
              <div style={{ fontSize: 42, fontWeight: 900, lineHeight: 1, color: item.color, textShadow: `0 0 32px ${item.color}66`, fontFamily: 'var(--font-mono)' }}>
                {item.n}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.07) 20%, rgba(255,255,255,0.07) 80%, transparent)', margin: '0 40px 56px' }} />

      <div style={{ padding: '0 40px 72px' }}>
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
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NEBULA VIEW — full-screen space canvas with floating bubbles
// ═══════════════════════════════════════════════════════════════════════════════
const NEBULA_STATUSES = ['Todos', 'Submetida', 'Em análise', 'Em implementação', 'Concluída'];

function NebulaView({ onSwitch }: { onSwitch: () => void }) {
  const navigate = useNavigate();
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
      const rightPanelW = 214;
      return {
        id: idea.id,
        x: radius + Math.random() * (width - rightPanelW - radius * 2),
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
        const rightPanelW = 214;
        if (b.x - b.radius < 0)                          { b.x = b.radius;                         b.vx =  Math.abs(b.vx); }
        if (b.x + b.radius > width - rightPanelW)        { b.x = width - rightPanelW - b.radius;   b.vx = -Math.abs(b.vx); }
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

        {/* ══ Filter panel — vertical right column ══ */}
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0,
          width: 214,
          display: 'flex', flexDirection: 'column',
          paddingTop: 96,
          background: 'rgba(3,5,16,0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderLeft: '1px solid rgba(255,255,255,0.09)',
          boxShadow: '-6px 0 32px rgba(0,0,0,0.55)',
          zIndex: 10,
          overflowY: 'auto',
        }}>
          {/* View toggle — top of right panel, consistent with Lista */}
          <div style={{ padding: '0 14px 14px' }}>
            <ViewToggle view="nebula" onChange={v => v === 'lista' && onSwitch()} dark />
          </div>

          {/* Nova Ideia */}
          <div style={{ padding: '0 14px 14px' }}>
            <button
              onClick={() => navigate('/criar')}
              style={{
                width: '100%', padding: '9px 0',
                background: 'linear-gradient(135deg, #2563eb, #9437FF)',
                border: 'none', borderRadius: 10,
                color: 'white', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'var(--font-outfit)',
                boxShadow: '0 4px 16px rgba(37,99,235,0.45)',
                transition: 'opacity 0.18s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >+ Nova Ideia</button>
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '0 16px 0' }} />

          {/* Search */}
          <div style={{ padding: '0 14px 14px', position: 'relative' }}>
            <svg style={{ position: 'absolute', left: 23, top: '50%', transform: 'translateY(-50%)', opacity: 0.38, pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                border: '1px solid rgba(255,255,255,0.12)', borderRadius: 9,
                padding: '7px 8px 7px 28px', color: 'white', fontSize: 12,
                outline: 'none', fontFamily: 'var(--font-outfit)',
              }}
            />
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '0 16px 14px' }} />

          {/* Categoria */}
          <div style={{ padding: '0 16px 14px' }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 10 }}>Categoria</div>
            <div onClick={() => setFilterCat(null)} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', marginBottom: 8, opacity: filterCat === null ? 1 : 0.42, transition: 'opacity 0.18s' }}>
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: filterCat === null ? 'white' : 'rgba(255,255,255,0.35)', flexShrink: 0, boxShadow: filterCat === null ? '0 0 8px rgba(255,255,255,0.6)' : 'none', transition: 'all 0.18s' }} />
              <span style={{ color: filterCat === null ? 'white' : 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: filterCat === null ? 700 : 400 }}>Todas</span>
            </div>
            {categories.map(cat => {
              const catColor = CAT_COLOR[cat] || '#2563eb';
              const active   = filterCat === cat;
              return (
                <div key={cat} onClick={() => setFilterCat(f => f === cat ? null : cat)} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', marginBottom: 8, opacity: filterCat === null || active ? 1 : 0.32, transition: 'opacity 0.18s' }}>
                  <div style={{ width: 11, height: 11, borderRadius: '50%', background: catColor, flexShrink: 0, transform: active ? 'scale(1.35)' : 'scale(1)', boxShadow: active ? `0 0 10px ${catColor}cc` : `0 0 4px ${catColor}55`, transition: 'all 0.18s' }} />
                  <span style={{ color: active ? 'white' : 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: active ? 700 : 400, transition: 'color 0.18s' }}>{cat}</span>
                </div>
              );
            })}
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '0 16px 14px' }} />

          {/* Estado */}
          <div style={{ padding: '0 16px 14px' }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 10 }}>Estado</div>
            {NEBULA_STATUSES.map(s => {
              const active = filterStatus === s;
              return (
                <div key={s} onClick={() => setFilterStatus(s)} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', marginBottom: 8, opacity: filterStatus === 'Todos' || active ? 1 : 0.35, transition: 'opacity 0.18s' }}>
                  <div style={{ width: 11, height: 11, borderRadius: 3, background: active ? '#2563eb' : 'rgba(255,255,255,0.2)', flexShrink: 0, boxShadow: active ? '0 0 8px rgba(37,99,235,0.7)' : 'none', transition: 'all 0.18s' }} />
                  <span style={{ color: active ? 'white' : 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: active ? 700 : 400, transition: 'color 0.18s' }}>{s}</span>
                </div>
              );
            })}
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '0 16px 14px' }} />

          {/* Ordenar */}
          <div style={{ padding: '0 16px 20px' }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 10 }}>Ordenar</div>
            {([['votes', '▲ Mais votadas'], ['comments', '💬 Mais coment.']] as const).map(([val, label]) => {
              const active = sortBy === val;
              return (
                <div key={val} onClick={() => setSortBy(val)} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', marginBottom: 8 }}>
                  <div style={{ width: 11, height: 11, borderRadius: '50%', border: `2px solid ${active ? '#2563eb' : 'rgba(255,255,255,0.22)'}`, background: active ? '#2563eb' : 'transparent', flexShrink: 0, transition: 'all 0.18s' }} />
                  <span style={{ color: active ? 'white' : 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: active ? 700 : 400, transition: 'color 0.18s' }}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gradient fade from right panel into space */}
        <div style={{ position: 'absolute', top: 0, right: 214, bottom: 0, width: 40, background: 'linear-gradient(to left, rgba(3,5,16,0.35) 0%, transparent 100%)', pointerEvents: 'none', zIndex: 9 }} />

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

const PAGE_SIZE = 6;

function ListaView({ onSwitch }: { onSwitch: () => void }) {
  const navigate = useNavigate();
  const { ideas, hasVoted, toggleVote: handleVote } = useIdeas();
  const { search, setSearch, activeCategory, setActiveCategory, activeStatus, setActiveStatus, sortBy, setSortBy, filtered, clearFilters } = useIdeaFilters(ideas);
  const { selectedIdea, open: openIdea, close: closeIdea } = useIdeaModal();
  const { addComment, getComments } = useComments();
  const [listCommentText, setListCommentText] = useState('');
  const [page, setPage] = useState(0);
  const categories = useMemo(() => [...new Set(ideas.map(i => i.cat))], [ideas]);

  // Reset to page 0 when filters change
  useEffect(() => { setPage(0); }, [search, activeCategory, activeStatus, sortBy]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Main area: list + right panel ── */}
      <div style={{ display: 'flex', flex: 1, paddingTop: 88, minHeight: 'calc(100vh - 88px)' }}>

        {/* ── Left: idea list ── */}
        <div style={{ flex: 1, minWidth: 0, overflowY: 'auto', paddingBottom: 32 }}>
          {paginated.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 320, gap: 12, color: 'var(--text-muted)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <div style={{ fontSize: 14 }}>Nenhuma ideia encontrada</div>
              <button style={{ fontSize: 12, color: 'var(--blue)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }} onClick={clearFilters}>Limpar filtros</button>
            </div>
          ) : (
            paginated.map((idea, i) => {
              const globalIndex = page * PAGE_SIZE + i;
              return (
                <div
                  key={idea.id}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '20px 28px', borderBottom: '1px solid var(--border-light)', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  onClick={() => openIdea(idea)}
                >
                  <div style={{ fontSize: 32, fontWeight: 900, lineHeight: 1, minWidth: 36, fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
                    {String(globalIndex + 1).padStart(2, '0')}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, lineHeight: 1.3, letterSpacing: '-0.2px', color: 'var(--text)' }}>
                      {idea.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: idea.statusColor, flexShrink: 0 }} />
                        {idea.status}
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{idea.author}</span>
                      <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, fontWeight: 600, fontFamily: 'var(--font-mono)', color: idea.catColor, background: idea.catBg }}>
                        {idea.cat}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, paddingTop: 4 }} onClick={e => e.stopPropagation()}>
                    <button
                      style={{
                        padding: '5px 10px', fontSize: 11, borderRadius: 20,
                        border: `1.5px solid ${hasVoted(idea.id) ? 'var(--blue)' : 'var(--border-light)'}`,
                        color: hasVoted(idea.id) ? 'var(--blue)' : 'var(--text-muted)',
                        background: hasVoted(idea.id) ? 'var(--blue-light)' : 'transparent',
                        fontFamily: 'var(--font-mono)', cursor: 'pointer',
                      }}
                      onClick={e => handleVote(idea.id, e)}
                    >▲ {idea.votes + (hasVoted(idea.id) ? 1 : 0)}</button>
                    <button
                      style={{ padding: '5px 10px', fontSize: 11, borderRadius: 20, border: '1.5px solid var(--border-light)', color: 'var(--text-muted)', background: 'transparent', fontFamily: 'var(--font-mono)', cursor: 'pointer' }}
                    >💬 {idea.comments + getComments(idea.id).length}</button>
                    <button
                      style={{ padding: '5px 10px', fontSize: 11, borderRadius: 20, border: '1.5px solid #036ef2', color: '#036ef2', background: 'transparent', fontFamily: 'var(--font-mono)', cursor: 'pointer' }}
                      onClick={() => openIdea(idea)}
                    >Ver →</button>
                  </div>
                </div>
              );
            })
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '24px 0', flexWrap: 'wrap' }}>
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                style={{
                  padding: '7px 16px', borderRadius: 20, border: '1.5px solid var(--border-light)',
                  color: page === 0 ? 'var(--text-sub)' : 'var(--text)', background: 'transparent',
                  fontSize: 12, cursor: page === 0 ? 'default' : 'pointer',
                  fontFamily: 'var(--font-outfit)', opacity: page === 0 ? 0.4 : 1,
                }}
              >← Anterior</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  style={{
                    width: 34, height: 34, borderRadius: '50%',
                    border: `1.5px solid ${page === i ? 'var(--blue)' : 'var(--border-light)'}`,
                    background: page === i ? 'var(--blue)' : 'transparent',
                    color: page === i ? 'white' : 'var(--text-muted)',
                    fontSize: 13, fontWeight: page === i ? 700 : 400,
                    cursor: 'pointer', fontFamily: 'var(--font-mono)',
                  }}
                >{i + 1}</button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                style={{
                  padding: '7px 16px', borderRadius: 20, border: '1.5px solid var(--border-light)',
                  color: page === totalPages - 1 ? 'var(--text-sub)' : 'var(--text)', background: 'transparent',
                  fontSize: 12, cursor: page === totalPages - 1 ? 'default' : 'pointer',
                  fontFamily: 'var(--font-outfit)', opacity: page === totalPages - 1 ? 0.4 : 1,
                }}
              >Próxima →</button>
            </div>
          )}
        </div>

        {/* ── Right: filter panel (214px, light, sticky) ── */}
        <div style={{
          width: 214, flexShrink: 0,
          borderLeft: '1px solid var(--border-light)',
          background: 'var(--bg)',
          position: 'sticky', top: 88, alignSelf: 'flex-start',
          height: 'calc(100vh - 88px)', overflowY: 'auto',
          display: 'flex', flexDirection: 'column',
          padding: '16px 0',
        }}>

          {/* View toggle */}
          <div style={{ padding: '0 14px 14px' }}>
            <ViewToggle view="lista" onChange={v => v === 'nebula' && onSwitch()} dark={false} />
          </div>

          {/* Nova Ideia */}
          <div style={{ padding: '0 14px 14px' }}>
            <button
              onClick={() => navigate('/criar')}
              style={{
                width: '100%', padding: '9px 0',
                background: 'var(--blue)',
                border: 'none', borderRadius: 10,
                color: 'white', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'var(--font-outfit)',
                boxShadow: '0 3px 10px var(--blue-glow)',
                transition: 'opacity 0.18s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >+ Nova Ideia</button>
          </div>

          <div style={{ height: 1, background: 'var(--border-light)', margin: '0 16px 14px' }} />

          {/* Search */}
          <div style={{ padding: '0 14px 14px', position: 'relative' }}>
            <svg style={{ position: 'absolute', left: 23, top: '50%', transform: 'translateY(-50%)', opacity: 0.35, pointerEvents: 'none', color: 'var(--text-sub)' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Pesquisar..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'var(--surface2)',
                border: '1px solid var(--border-light)', borderRadius: 9,
                padding: '7px 8px 7px 28px', color: 'var(--text)', fontSize: 12,
                outline: 'none', fontFamily: 'var(--font-outfit)',
              }}
            />
          </div>

          <div style={{ height: 1, background: 'var(--border-light)', margin: '0 16px 14px' }} />

          {/* Categoria */}
          <div style={{ padding: '0 16px 14px' }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-sub)', marginBottom: 10 }}>Categoria</div>
            <div
              onClick={() => setActiveCategory('Todas')}
              style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', marginBottom: 8, opacity: activeCategory === 'Todas' ? 1 : 0.42, transition: 'opacity 0.18s' }}
            >
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: activeCategory === 'Todas' ? 'var(--text)' : 'var(--border-light)', flexShrink: 0, transition: 'all 0.18s' }} />
              <span style={{ color: activeCategory === 'Todas' ? 'var(--text)' : 'var(--text-muted)', fontSize: 13, fontWeight: activeCategory === 'Todas' ? 700 : 400 }}>Todas</span>
            </div>
            {categories.map(cat => {
              const catColor = CAT_COLOR[cat] || '#2563eb';
              const active   = activeCategory === cat;
              return (
                <div
                  key={cat}
                  onClick={() => setActiveCategory(active ? 'Todas' : cat)}
                  style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', marginBottom: 8, opacity: activeCategory === 'Todas' || active ? 1 : 0.32, transition: 'opacity 0.18s' }}
                >
                  <div style={{ width: 11, height: 11, borderRadius: '50%', background: catColor, flexShrink: 0, transform: active ? 'scale(1.35)' : 'scale(1)', boxShadow: active ? `0 0 10px ${catColor}cc` : `0 0 4px ${catColor}55`, transition: 'all 0.18s' }} />
                  <span style={{ color: active ? 'var(--text)' : 'var(--text-muted)', fontSize: 13, fontWeight: active ? 700 : 400, transition: 'color 0.18s' }}>{cat}</span>
                </div>
              );
            })}
          </div>

          <div style={{ height: 1, background: 'var(--border-light)', margin: '0 16px 14px' }} />

          {/* Estado */}
          <div style={{ padding: '0 16px 14px' }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-sub)', marginBottom: 10 }}>Estado</div>
            {LIST_STATUSES.map(s => {
              const active = activeStatus === s;
              return (
                <div
                  key={s}
                  onClick={() => setActiveStatus(s)}
                  style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', marginBottom: 8, opacity: activeStatus === 'Todos' || active ? 1 : 0.35, transition: 'opacity 0.18s' }}
                >
                  <div style={{ width: 11, height: 11, borderRadius: 3, background: active ? 'var(--blue)' : 'var(--border-light)', flexShrink: 0, boxShadow: active ? '0 0 8px rgba(37,99,235,0.5)' : 'none', transition: 'all 0.18s' }} />
                  <span style={{ color: active ? 'var(--text)' : 'var(--text-muted)', fontSize: 12, fontWeight: active ? 700 : 400, transition: 'color 0.18s' }}>{s}</span>
                </div>
              );
            })}
          </div>

          <div style={{ height: 1, background: 'var(--border-light)', margin: '0 16px 14px' }} />

          {/* Ordenar */}
          <div style={{ padding: '0 16px 20px' }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-sub)', marginBottom: 10 }}>Ordenar</div>
            {([['votes', '▲ Mais votadas'], ['comments', '💬 Mais coment.']] as const).map(([val, label]) => {
              const active = sortBy === val;
              return (
                <div
                  key={val}
                  onClick={() => setSortBy(val)}
                  style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', marginBottom: 8 }}
                >
                  <div style={{ width: 11, height: 11, borderRadius: '50%', border: `2px solid ${active ? 'var(--blue)' : 'var(--border-light)'}`, background: active ? 'var(--blue)' : 'transparent', flexShrink: 0, transition: 'all 0.18s' }} />
                  <span style={{ color: active ? 'var(--text)' : 'var(--text-muted)', fontSize: 12, fontWeight: active ? 700 : 400, transition: 'color 0.18s' }}>{label}</span>
                </div>
              );
            })}
          </div>

          {/* Count */}
          <div style={{ marginTop: 'auto', padding: '12px 16px', borderTop: '1px solid var(--border-light)', fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
            {filtered.length} ideia{filtered.length !== 1 ? 's' : ''} · pág. {page + 1}/{Math.max(1, totalPages)}
          </div>
        </div>
      </div>

      {/* ── Stats section ── */}
      <StatsSection />

      {/* ── Idea detail modal (light theme) ── */}
      {selectedIdea && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={closeIdea}
        >
          <div
            style={{ background: 'var(--surface)', borderRadius: 18, maxWidth: 680, width: '100%', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.25)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ position: 'sticky', top: 0, background: 'var(--surface)', borderBottom: '1px solid var(--border-light)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, fontWeight: 600, fontFamily: 'var(--font-mono)', color: selectedIdea.catColor, background: selectedIdea.catBg }}>{selectedIdea.cat}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: selectedIdea.statusColor }} />
                  {selectedIdea.status}
                </div>
              </div>
              <button style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'transparent', border: 'none', fontSize: 18, color: 'var(--text-muted)' }} onClick={closeIdea}>✕</button>
            </div>
            <div style={{ padding: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, lineHeight: 1.3, letterSpacing: '-0.5px', color: 'var(--text)' }}>{selectedIdea.title}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                  {selectedIdea.author}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  ▲ {selectedIdea.votes + (hasVoted(selectedIdea.id) ? 1 : 0)} votos
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  💬 {selectedIdea.comments + getComments(selectedIdea.id).length} comentários
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[
                  { label: 'Problema',         text: `Identificámos desafios significativos relacionados com ${selectedIdea.title.toLowerCase()}, que afectam directamente a eficiência operacional e a satisfação dos envolvidos.` },
                  { label: 'Solução Proposta',  text: `A solução passa por implementar ${selectedIdea.title.toLowerCase()}, através de uma abordagem estruturada e centrada nas necessidades reais dos utilizadores.` },
                ].map(block => (
                  <div key={block.label}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: 'var(--text)' }}>{block.label}</div>
                    <div style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text-muted)' }}>{block.text}</div>
                  </div>
                ))}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>Impacto Esperado</div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {['Aumento de 30% na produtividade', 'Redução de custos operacionais em 20%', 'Melhoria da satisfação dos utilizadores', 'Optimização dos processos internos'].map((impact, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                        <span style={{ marginTop: 2, flexShrink: 0, color: selectedIdea.catColor }}>›</span>
                        {impact}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border-light)' }}>
                <button
                  style={{
                    flex: 1, padding: '10px 16px', borderRadius: 20,
                    border: `1.5px solid ${hasVoted(selectedIdea.id) ? 'var(--blue)' : 'var(--border2)'}`,
                    color: hasVoted(selectedIdea.id) ? 'var(--blue)' : 'var(--text)',
                    background: hasVoted(selectedIdea.id) ? 'var(--blue-light)' : 'transparent',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    fontFamily: 'var(--font-outfit)',
                  }}
                  onClick={e => handleVote(selectedIdea.id, e)}
                >▲ {hasVoted(selectedIdea.id) ? 'Votado' : 'Votar'} ({selectedIdea.votes + (hasVoted(selectedIdea.id) ? 1 : 0)})</button>
              </div>

              {/* Comentários */}
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: 'var(--text)' }}>
                  💬 Comentários ({selectedIdea.comments + getComments(selectedIdea.id).length})
                </div>

                {selectedIdea.comments > 0 && getComments(selectedIdea.id).length === 0 && (
                  <p style={{ fontSize: 12, marginBottom: 12, fontStyle: 'italic', color: 'var(--text-muted)' }}>
                    {selectedIdea.comments} comentário{selectedIdea.comments !== 1 ? 's' : ''} de sessões anteriores
                  </p>
                )}
                {selectedIdea.comments > 0 && getComments(selectedIdea.id).length > 0 && (
                  <p style={{ fontSize: 12, marginBottom: 12, fontStyle: 'italic', color: 'var(--text-muted)' }}>
                    + {selectedIdea.comments} comentários anteriores
                  </p>
                )}

                {getComments(selectedIdea.id).map(c => (
                  <div key={c.id} style={{ marginBottom: 12, padding: 12, borderRadius: 12, border: '1px solid var(--border-light)', background: 'var(--surface2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: selectedIdea.catColor }}>{c.author}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {new Date(c.timestamp).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--text-muted)', margin: 0 }}>{c.text}</p>
                  </div>
                ))}

                {getComments(selectedIdea.id).length === 0 && selectedIdea.comments === 0 && (
                  <p style={{ fontSize: 13, marginBottom: 12, fontStyle: 'italic', color: 'var(--text-muted)' }}>Ainda sem comentários. Sê o primeiro!</p>
                )}

                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
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
                    style={{ flex: 1, padding: '8px 12px', borderRadius: 12, border: '1px solid var(--border-light)', fontSize: 13, outline: 'none', background: 'transparent', color: 'var(--text)', fontFamily: 'var(--font-outfit)' }}
                  />
                  <button
                    onClick={() => {
                      if (!listCommentText.trim()) return;
                      addComment(selectedIdea.id, listCommentText);
                      setListCommentText('');
                    }}
                    style={{ padding: '8px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700, color: 'white', border: 'none', background: listCommentText.trim() ? 'var(--blue)' : 'var(--surface3)', cursor: listCommentText.trim() ? 'pointer' : 'default', transition: 'background 0.2s' }}
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
