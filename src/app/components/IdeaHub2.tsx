import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { useIdeas } from '../context/IdeaContext';
import type { Idea } from '../hooks/useIdeaFilters';

// ─── Types ────────────────────────────────────────────────────────────────────
type View = 'nebula' | 'deck' | 'graph';

interface BubbleState {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  idea: Idea;
}

// ─── Category colour map ──────────────────────────────────────────────────────
const CAT_COLOR: Record<string, string> = {
  Pessoas:  '#9437FF',
  Produto:  '#FF0066',
  CX:       '#4294F8',
  Processo: '#3126b4',
  Tech:     '#036ef2',
  Outros:   '#87007f',
};

// ─── Rich idea content (Problema / Solução / Impacto) ────────────────────────
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

// ═══════════════════════════════════════════════════════════════════════════════
// NEBULA VIEW — floating physics bubbles
// ═══════════════════════════════════════════════════════════════════════════════
function NebulaView() {
  const { ideas, hasVoted, toggleVote } = useIdeas();
  const containerRef = useRef<HTMLDivElement>(null);
  const bubblesRef   = useRef<BubbleState[]>([]);
  const mouseRef     = useRef({ x: -9999, y: -9999 });
  const rafRef       = useRef<number>(0);
  const frameRef     = useRef(0);

  const [, setTick]      = useState(0);          // drives re-renders from RAF
  const [selected, setSelected] = useState<Idea | null>(null);
  const [filterCat, setFilterCat] = useState<string | null>(null);

  // Static star field — generated once
  const stars = useMemo(() =>
    Array.from({ length: 90 }, (_, i) => ({
      id: i,
      left:    parseFloat((Math.random() * 100).toFixed(2)),
      top:     parseFloat((Math.random() * 100).toFixed(2)),
      size:    parseFloat((Math.random() * 1.8 + 0.4).toFixed(2)),
      opacity: parseFloat((Math.random() * 0.55 + 0.08).toFixed(2)),
    })), []);

  // Initialise bubble physics data
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    if (!width || !height) return;

    const minVotes = Math.min(...ideas.map(i => i.votes));
    const maxVotes = Math.max(...ideas.map(i => i.votes));
    const minR = 44, maxR = 90;

    bubblesRef.current = ideas.map(idea => {
      const t = maxVotes === minVotes ? 0.5 : (idea.votes - minVotes) / (maxVotes - minVotes);
      const radius = minR + t * (maxR - minR);
      return {
        id: idea.id,
        x: radius + Math.random() * (width  - radius * 2),
        y: radius + Math.random() * (height - radius * 2),
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius,
        idea,
      };
    });

    setTick(t => t + 1);
  }, [ideas]);

  // Physics loop
  useEffect(() => {
    const el = containerRef.current;
    if (!el || bubblesRef.current.length === 0) return;

    const loop = () => {
      const { width, height } = el.getBoundingClientRect();
      const { x: mx, y: my } = mouseRef.current;
      const bs = bubblesRef.current;

      for (let i = 0; i < bs.length; i++) {
        const b = bs[i];

        // Mouse repulsion
        const dx = b.x - mx, dy = b.y - my;
        const dist = Math.hypot(dx, dy);
        if (dist < 170 && dist > 0) {
          const f = ((170 - dist) / 170) * 0.22;
          b.vx += (dx / dist) * f;
          b.vy += (dy / dist) * f;
        }

        // Tiny random drift so bubbles never fully stop
        b.vx += (Math.random() - 0.5) * 0.012;
        b.vy += (Math.random() - 0.5) * 0.012;

        // Damping & speed cap
        b.vx *= 0.986; b.vy *= 0.986;
        const spd = Math.hypot(b.vx, b.vy);
        if (spd > 1.6) { b.vx = b.vx / spd * 1.6; b.vy = b.vy / spd * 1.6; }

        b.x += b.vx; b.y += b.vy;

        // Wall bouncing
        if (b.x - b.radius < 0)       { b.x = b.radius;         b.vx =  Math.abs(b.vx); }
        if (b.x + b.radius > width)    { b.x = width - b.radius; b.vx = -Math.abs(b.vx); }
        if (b.y - b.radius < 0)        { b.y = b.radius;          b.vy =  Math.abs(b.vy); }
        if (b.y + b.radius > height)   { b.y = height - b.radius; b.vy = -Math.abs(b.vy); }

        // Bubble–bubble collision
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
      // Update React state every 2 frames (≈30 fps) to keep UI smooth
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* ── Legend / filter — same style as GraphView ── */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* "Todas" reset */}
        <div
          onClick={() => setFilterCat(null)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', opacity: filterCat === null ? 1 : 0.45, transition: 'opacity 0.2s' }}
        >
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.5)', boxShadow: '0 0 5px rgba(255,255,255,0.4)' }} />
          <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, fontWeight: 600 }}>Todas</span>
        </div>
        {/* Per-category dots */}
        {categories.map(cat => {
          const color  = CAT_COLOR[cat] || '#2563eb';
          const active = filterCat === cat;
          return (
            <div
              key={cat}
              onClick={() => setFilterCat(f => f === cat ? null : cat)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', opacity: filterCat === null || active ? 1 : 0.4, transition: 'opacity 0.2s' }}
            >
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, boxShadow: `0 0 7px ${color}${active ? 'cc' : '66'}`, transform: active ? 'scale(1.3)' : 'scale(1)', transition: 'transform 0.2s, box-shadow 0.2s' }} />
              <span style={{ color: active ? 'white' : 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: active ? 700 : 500, transition: 'color 0.2s' }}>{cat}</span>
            </div>
          );
        })}
      </div>

      {/* ── Nebula canvas ── */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { mouseRef.current = { x: -9999, y: -9999 }; }}
        style={{
          position: 'relative', height: 580, borderRadius: 20, overflow: 'hidden',
          background: 'radial-gradient(ellipse at 50% 38%, #0a1240 0%, #060b1e 55%, #010308 100%)',
        }}
      >
        {/* Star field */}
        {stars.map(s => (
          <div key={s.id} style={{ position: 'absolute', left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, borderRadius: '50%', background: 'white', opacity: s.opacity, pointerEvents: 'none' }} />
        ))}

        {/* Decorative ambient glows */}
        <div style={{ position: 'absolute', left: '10%', top: '15%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: '8%',  bottom: '12%', width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(148,55,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* ── Bubbles — styled like Graph nodes ── */}
        {bubblesRef.current.map(b => {
          const color      = CAT_COLOR[b.idea.cat] || '#2563eb';
          const isFiltered = filterCat !== null && b.idea.cat !== filterCat;
          const voted      = hasVoted(b.id);
          const r          = b.radius;
          // Truncate title to fit bubble
          const maxChars   = Math.floor(r * 0.55);
          const label      = b.idea.title.length > maxChars ? b.idea.title.slice(0, maxChars - 1) + '…' : b.idea.title;
          const fontSize   = Math.max(9, Math.min(12, r * 0.14));

          return (
            <div
              key={b.id}
              onClick={() => !isFiltered && setSelected(b.idea)}
              style={{
                position: 'absolute',
                left: b.x - r, top: b.y - r,
                width: r * 2,  height: r * 2,
                borderRadius: '50%',
                // Same gradient style as Graph nodes
                background: `radial-gradient(circle at 36% 30%, ${color}99 0%, ${color}33 55%, ${color}0d 100%)`,
                border:     `1.5px solid ${color}${voted ? 'cc' : '66'}`,
                boxShadow:  isFiltered ? 'none' : `0 0 ${r * 0.5}px ${color}55, inset 0 0 ${r * 0.3}px ${color}1e`,
                opacity:    isFiltered ? 0.1 : 1,
                transition: 'opacity 0.35s ease',
                cursor:     isFiltered ? 'default' : 'pointer',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                textAlign: 'center',
                userSelect: 'none',
                gap: 4,
              }}
            >
              {/* Outer glow ring (like Graph) */}
              <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`, pointerEvents: 'none' }} />

              {/* Title */}
              <span style={{
                fontSize,
                color: 'white',
                fontWeight: 700,
                lineHeight: 1.3,
                textShadow: '0 1px 4px rgba(0,0,0,0.95), 0 0 12px rgba(0,0,0,0.8)',
                display: 'block',
                wordBreak: 'break-word',
                padding: '0 8px',
                textAlign: 'center',
              }}>
                {label}
              </span>

              {/* Vote count */}
              <span style={{ fontSize: Math.max(8, fontSize - 1), color, fontWeight: 800, textShadow: `0 0 8px ${color}` }}>
                ▲ {voted ? b.idea.votes + 1 : b.idea.votes}
              </span>
            </div>
          );
        })}

        {/* Hint */}
        <div style={{ position: 'absolute', bottom: 14, right: 18, color: 'rgba(255,255,255,0.18)', fontSize: 11, fontStyle: 'italic', pointerEvents: 'none' }}>
          move o rato · clica para explorar
        </div>
      </div>

      {/* ══ Detail modal — dark design com conteúdo completo ══ */}
      {selected && (() => {
        const color   = CAT_COLOR[selected.cat] || '#2563eb';
        const content = IDEA_CONTENT[selected.id];
        const voted   = hasVoted(selected.id);
        return (
          <div
            onClick={() => setSelected(null)}
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
              {/* ── Header ── */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '20px 24px 0' }}>
                <span style={{ background: color + '28', color, padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700 }}>
                  {selected.cat}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block' }} />
                  {selected.status}
                </span>
                <button onClick={() => setSelected(null)} style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: 32, height: 32, color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>

              {/* ── Title ── */}
              <div style={{ padding: '16px 24px 0' }}>
                <h2 style={{ color: 'white', fontSize: 22, fontWeight: 800, lineHeight: 1.3, margin: 0 }}>
                  {selected.title}
                </h2>
              </div>

              {/* ── Author + stats ── */}
              <div style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', borderBottom: `1px solid rgba(255,255,255,0.07)` }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
                  <span>👤</span> {selected.author}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
                  <span style={{ color, fontWeight: 700 }}>▲</span>
                  {voted ? selected.votes + 1 : selected.votes} votos
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
                  <span>💬</span> {selected.comments} comentários
                </span>
              </div>

              {/* ── Content sections ── */}
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

              {/* ── Action buttons ── */}
              <div style={{ padding: '0 24px 24px', borderTop: `1px solid rgba(255,255,255,0.07)`, paddingTop: 20, display: 'flex', gap: 12 }}>
                <button
                  onClick={e => toggleVote(selected.id, e)}
                  style={{
                    flex: 1, background: voted ? color : 'rgba(255,255,255,0.08)',
                    color: 'white', border: `1px solid ${voted ? color : 'rgba(255,255,255,0.2)'}`,
                    borderRadius: 99, padding: '12px 0', fontSize: 14, fontWeight: 700,
                    cursor: 'pointer', transition: 'all 0.22s',
                  }}
                >▲ {voted ? 'Votado' : `Votar (${selected.votes})`}</button>
                <button style={{
                  flex: 1, background: '#2563eb', color: 'white', border: 'none',
                  borderRadius: 99, padding: '12px 0', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                }}>💬 Comentar</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// Short descriptions for the front face of each card
const IDEA_DESC: Record<number, string> = {
  1:  'Estruturar o trabalho remoto e presencial de forma clara para toda a organização.',
  2:  'App mobile com IA conversacional para resolver pedidos de clientes sem intervenção humana.',
  3:  'Chatbot disponível 24/7 para responder a questões de colaboradores internos.',
  4:  'Automatizar o fluxo de aprovação de despesas e eliminar erros no processo manual.',
  5:  'Plataforma digital de onboarding com percursos personalizados e assistente de IA.',
  6:  'Dashboard centralizado com métricas operacionais de todos os departamentos.',
  7:  'API standard para integração segura com sistemas e parceiros externos.',
  8:  'Aplicação web self-service para clientes gerirem contratos e pedidos.',
  9:  'Compensar emissões de carbono em eventos internos com práticas sustentáveis.',
  10: 'Programa de mentoria cruzada entre departamentos para partilha de conhecimento.',
  11: 'Data lake para consolidar e analisar dados de comportamento do cliente.',
  12: 'Sistema de reconhecimento entre pares para valorizar contribuições da equipa.',
};

// ═══════════════════════════════════════════════════════════════════════════════
// DECK VIEW — swipeable card stack with 3-D flip
// Architecture: drag wrapper (2D only) > flip wrapper (3D only) > faces
// Background cards use a fan layout so the rotation/queue is always visible.
// ═══════════════════════════════════════════════════════════════════════════════
function DeckView() {
  const { ideas, hasVoted, toggleVote } = useIdeas();
  const [filterCat, setFilterCat] = useState<string | null>(null);
  const [stack, setStack]     = useState<Idea[]>([...ideas]);
  const [flipped, setFlipped] = useState(false);
  const [dragX, setDragX]     = useState(0);
  const [flying, setFlying]   = useState<'left' | 'right' | null>(null);

  // Refs — never stale inside window listeners
  const isDraggingRef = useRef(false);
  const startXRef     = useRef(0);
  const dragXRef      = useRef(0);
  const isFlyingRef   = useRef(false);

  // Re-build stack on filter change
  useEffect(() => {
    setStack(filterCat ? ideas.filter(i => i.cat === filterCat) : [...ideas]);
    setFlipped(false);
    setDragX(0);
    dragXRef.current = 0;
  }, [filterCat, ideas]);

  const categories = useMemo(() => [...new Set(ideas.map(i => i.cat))], [ideas]);

  // Fly the top card off in `dir`, then rotate it to the bottom of the stack
  const dismiss = useCallback((dir: 'left' | 'right') => {
    if (isFlyingRef.current) return;
    isFlyingRef.current = true;
    setFlying(dir);
    setFlipped(false);
    setDragX(0);
    dragXRef.current = 0;
    setTimeout(() => {
      setStack(prev => { const [first, ...rest] = prev; return [...rest, first]; });
      setFlying(null);
      isFlyingRef.current = false;
    }, 420);
  }, []);

  // Global mouse listeners so drag never drops even if cursor leaves the card
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - startXRef.current;
      dragXRef.current = dx;
      setDragX(dx);
    };
    const onUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      document.body.style.userSelect = '';
      const dx = dragXRef.current;
      if (Math.abs(dx) > 80) dismiss(dx > 0 ? 'right' : 'left');
      else { setDragX(0); dragXRef.current = 0; }
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
    };
  }, [dismiss]);

  const handleMouseDown = (e: ReactMouseEvent) => {
    if (flipped || isFlyingRef.current || e.button !== 0) return;
    e.preventDefault();
    isDraggingRef.current = true;
    startXRef.current     = e.clientX;
    dragXRef.current      = 0;
    document.body.style.userSelect = 'none';
  };

  if (stack.length === 0) {
    return (
      <div style={{ textAlign: 'center', paddingTop: 80, color: 'rgba(255,255,255,0.3)' }}>
        <p>Sem ideias nesta categoria.</p>
        <button onClick={() => setFilterCat(null)} style={{ marginTop: 12, background: '#2563eb', color: 'white', border: 'none', borderRadius: 99, padding: '8px 20px', cursor: 'pointer', fontSize: 14 }}>Ver todas</button>
      </div>
    );
  }

  const top      = stack[0];
  const topColor = CAT_COLOR[top.cat] || '#2563eb';
  const voted    = hasVoted(top.id);
  const desc     = IDEA_DESC[top.id] ?? '';

  // Top card's drag/fly transform (pure 2-D — no 3D context here)
  let dragTransform = 'none';
  if      (flying === 'left')  dragTransform = 'translateX(-170%) rotate(-28deg)';
  else if (flying === 'right') dragTransform = 'translateX(170%) rotate(28deg)';
  else if (dragX !== 0)        dragTransform = `translateX(${dragX}px) rotate(${dragX * 0.04}deg)`;

  const dragTransition = dragX !== 0
    ? 'none'
    : flying
      ? 'transform 0.42s cubic-bezier(0.55, 0, 1, 0.45)'
      : 'transform 0.38s cubic-bezier(0.34, 1.56, 0.64, 1)';

  // Fan offsets for background cards — gives the "deck / rotary" sense of depth
  // Each deeper card is shifted right and slightly rotated (transformOrigin bottom-center)
  const fanOffset = (depth: number) => ({
    translateX: depth * 14,
    translateY: depth * 6,
    rotate:     depth * 5,
    scale:      1 - depth * 0.038,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>

      {/* ── Category filter ── */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[null, ...categories].map(cat => {
          const active = filterCat === cat;
          const color  = cat ? CAT_COLOR[cat] : '#2563eb';
          return (
            <button key={cat ?? 'all'} onClick={() => setFilterCat(cat)} style={{
              padding: '5px 14px', borderRadius: 99, fontSize: 13, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.22s',
              background: active ? color : 'rgba(255,255,255,0.07)',
              color:      active ? '#fff' : 'rgba(255,255,255,0.55)',
              border:     `1px solid ${active ? color : 'rgba(255,255,255,0.13)'}`,
            }}>{cat ?? 'Todas'}</button>
          );
        })}
      </div>

      {/* ── Card stack — extra right padding so fanned cards don't clip ── */}
      <div style={{ position: 'relative', width: 420, height: 530, marginTop: 8, paddingRight: 40 }}>

        {/* ── Background fan cards ─────────────────────────────────────────── */}
        {stack.slice(1, 4).map((idea, i) => {
          const depth = i + 1;
          const { translateX, translateY, rotate, scale } = fanOffset(depth);
          const color = CAT_COLOR[idea.cat] || '#2563eb';
          return (
            <div key={idea.id} style={{
              position: 'absolute',
              left: 0, top: 0, width: 380, height: 520,
              borderRadius: 24,
              background: `linear-gradient(145deg, #0e1440 0%, #060a1c 100%)`,
              border: `1px solid ${color}33`,
              // Show the category colour as a subtle top stripe
              boxShadow: `inset 0 3px 0 ${color}55`,
              transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`,
              transformOrigin: 'bottom center',
              zIndex: 10 - depth,
              transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              pointerEvents: 'none',
              overflow: 'hidden',
            }}>
              {/* Faint title preview on background cards */}
              <div style={{ padding: '28px 32px', opacity: 0.25 }}>
                <div style={{ color, fontSize: 10, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {idea.cat}
                </div>
                <div style={{ color: 'white', fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>
                  {idea.title.length > 40 ? idea.title.slice(0, 38) + '…' : idea.title}
                </div>
              </div>
            </div>
          );
        })}

        {/* ── DRAG LAYER — 2-D transform only ─────────────────────────────── */}
        <div
          onMouseDown={handleMouseDown}
          style={{
            position: 'absolute', left: 0, top: 0, width: 380, height: 520,
            zIndex: 20,
            transform:  dragTransform,
            transition: dragTransition,
            transformOrigin: 'bottom center',
            cursor: flipped ? 'default' : 'grab',
            userSelect: 'none',
          }}
        >
          {/* ── FLIP LAYER — 3-D context isolated here ───────────────────── */}
          <div style={{
            width: '100%', height: '100%',
            transformStyle: 'preserve-3d',
            perspective: '1100px',
            transform:  flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.55s cubic-bezier(0.4, 0.2, 0.2, 1)',
          }}>

            {/* ─────────────── FRONT FACE ─────────────────────────────── */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 24,
              backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
              background: `linear-gradient(160deg, #0f1550 0%, #07091e 100%)`,
              border: `1px solid ${topColor}50`,
              boxShadow: `0 28px 70px rgba(0,0,0,0.65), 0 0 60px ${topColor}18`,
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
            }}>
              {/* Coloured top accent strip */}
              <div style={{ height: 5, background: `linear-gradient(to right, ${topColor}, ${topColor}66)`, borderRadius: '24px 24px 0 0', flexShrink: 0 }} />

              <div style={{ padding: '24px 30px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
                {/* Category + status row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ background: topColor + '28', color: topColor, padding: '4px 12px', borderRadius: 99, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {top.cat}
                  </span>
                  <span style={{
                    color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600,
                    background: 'rgba(255,255,255,0.07)', padding: '3px 10px', borderRadius: 99,
                  }}>{top.status}</span>
                </div>

                {/* Title */}
                <h2 style={{ color: 'white', fontSize: 20, fontWeight: 800, lineHeight: 1.35, margin: 0 }}>
                  {top.title}
                </h2>

                {/* Short description */}
                <p style={{ color: 'rgba(255,255,255,0.48)', fontSize: 13, lineHeight: 1.65, margin: 0, flex: 1 }}>
                  {desc}
                </p>

                {/* Author */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: `linear-gradient(135deg, ${topColor}, ${topColor}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: 'white', flexShrink: 0 }}>
                    {top.author === 'Anónimo' ? '?' : top.author.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{top.author}</span>
                </div>

                {/* ── Stats row — votes + comments prominent ── */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={e => { e.stopPropagation(); toggleVote(top.id, e); }}
                    style={{
                      flex: 1,
                      background: voted ? topColor : 'rgba(255,255,255,0.07)',
                      color: 'white',
                      border: `1.5px solid ${voted ? topColor : 'rgba(255,255,255,0.18)'}`,
                      borderRadius: 14, padding: '10px 0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      cursor: 'pointer', transition: 'all 0.22s', fontSize: 15, fontWeight: 800,
                    }}
                  >
                    <span style={{ fontSize: 16 }}>▲</span>
                    {voted ? top.votes + 1 : top.votes}
                    <span style={{ fontSize: 11, fontWeight: 400, opacity: 0.7 }}>votos</span>
                  </button>
                  <div style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1.5px solid rgba(255,255,255,0.12)',
                    borderRadius: 14, padding: '10px 0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    fontSize: 15, fontWeight: 800, color: 'white',
                  }}>
                    <span>💬</span>
                    {top.comments}
                    <span style={{ fontSize: 11, fontWeight: 400, opacity: 0.5 }}>coment.</span>
                  </div>
                </div>

                {/* Navigation + flip */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={e => { e.stopPropagation(); dismiss('left'); }} style={{
                    flex: 1, background: 'rgba(255,0,102,0.1)', color: '#FF6699',
                    border: '1px solid rgba(255,0,102,0.3)', borderRadius: 12,
                    padding: '8px 0', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  }}>← Passar</button>
                  <button onClick={e => { e.stopPropagation(); setFlipped(f => !f); }} style={{
                    flex: 2, background: topColor + '22', color: topColor,
                    border: `1px solid ${topColor}55`, borderRadius: 12,
                    padding: '8px 0', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  }}>Ver detalhes ↺</button>
                  <button onClick={e => { e.stopPropagation(); dismiss('right'); }} style={{
                    flex: 1, background: 'rgba(66,148,248,0.1)', color: '#4294F8',
                    border: '1px solid rgba(66,148,248,0.3)', borderRadius: 12,
                    padding: '8px 0', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  }}>Próxima →</button>
                </div>
              </div>

              {/* Drag tint overlay */}
              {dragX !== 0 && (
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: 24, pointerEvents: 'none',
                  background: dragX > 50
                    ? 'linear-gradient(to right, transparent 30%, rgba(66,148,248,0.14))'
                    : dragX < -50
                      ? 'linear-gradient(to left, transparent 30%, rgba(255,0,102,0.14))'
                      : 'transparent',
                }} />
              )}
            </div>

            {/* ─────────────── BACK FACE ──────────────────────────────── */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 24,
              backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: `linear-gradient(160deg, ${topColor}1e 0%, #050816 100%)`,
              border: `1px solid ${topColor}60`,
              boxShadow: `0 28px 70px rgba(0,0,0,0.65), 0 0 90px ${topColor}25`,
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
            }}>
              {/* Coloured top strip */}
              <div style={{ height: 5, background: `linear-gradient(to right, ${topColor}, ${topColor}44)`, borderRadius: '24px 24px 0 0', flexShrink: 0 }} />

              <div style={{ padding: '24px 30px', display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: topColor, fontWeight: 800, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Detalhes completos</span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{top.status}</span>
                </div>

                {/* Title */}
                <h2 style={{ color: 'white', fontSize: 18, fontWeight: 800, lineHeight: 1.35, margin: 0 }}>
                  {top.title}
                </h2>

                {/* Full description */}
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.7, margin: 0, flex: 1 }}>
                  {desc}<br /><br />
                  Submetida por <strong style={{ color: 'white' }}>{top.author}</strong> na categoria <strong style={{ color: topColor }}>{top.cat}</strong>.
                  Estado atual: <strong style={{ color: 'white' }}>{top.status}</strong>.
                </p>

                {/* Stats */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: '14px 0', textAlign: 'center' }}>
                    <div style={{ color: topColor, fontSize: 28, fontWeight: 900, lineHeight: 1 }}>▲{voted ? top.votes + 1 : top.votes}</div>
                    <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 4 }}>votos</div>
                  </div>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: '14px 0', textAlign: 'center' }}>
                    <div style={{ color: 'white', fontSize: 28, fontWeight: 900, lineHeight: 1 }}>💬{top.comments}</div>
                    <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 4 }}>comentários</div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={e => { e.stopPropagation(); toggleVote(top.id, e); }} style={{
                    flex: 1, background: voted ? topColor : 'rgba(255,255,255,0.08)',
                    color: 'white', border: `1.5px solid ${topColor}`,
                    borderRadius: 12, padding: '10px 0', fontSize: 14, fontWeight: 800,
                    cursor: 'pointer', transition: 'all 0.22s',
                  }}>▲ {voted ? 'Votado' : 'Votar'}</button>
                  <button onClick={() => setFlipped(false)} style={{
                    flex: 1, background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 12, padding: '10px 0', fontSize: 14, fontWeight: 700,
                    cursor: 'pointer',
                  }}>↺ Voltar</button>
                </div>
              </div>
            </div>

          </div>{/* /flip layer */}
        </div>{/* /drag layer */}
      </div>{/* /stack */}

      <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, marginTop: 4, fontStyle: 'italic' }}>
        arrasta · ou usa os botões ← Passar / Próxima →
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GRAPH VIEW — force-directed idea network (pure SVG, no libraries)
// Nodes = ideas  |  Edges = shared category or author
// ═══════════════════════════════════════════════════════════════════════════════
interface GraphNode {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  idea: Idea;
}
interface GraphEdge {
  source: number;
  target: number;
  type: 'category' | 'author';
}

function GraphView() {
  const { ideas, hasVoted, toggleVote } = useIdeas();
  const svgRef    = useRef<SVGSVGElement>(null);
  const nodesRef  = useRef<GraphNode[]>([]);
  const edgesRef  = useRef<GraphEdge[]>([]);
  const rafRef    = useRef<number>(0);
  const frameRef  = useRef(0);
  const [, setTick]  = useState(0);
  const [selected, setSelected]   = useState<Idea | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [dims, setDims] = useState({ w: 900, h: 580 });

  // Build edge list once
  const edges = useMemo<GraphEdge[]>(() => {
    const result: GraphEdge[] = [];
    for (let i = 0; i < ideas.length; i++) {
      for (let j = i + 1; j < ideas.length; j++) {
        if (ideas[i].cat === ideas[j].cat) {
          result.push({ source: ideas[i].id, target: ideas[j].id, type: 'category' });
        } else if (ideas[i].author !== 'Anónimo' && ideas[i].author === ideas[j].author) {
          result.push({ source: ideas[i].id, target: ideas[j].id, type: 'author' });
        }
      }
    }
    return result;
  }, [ideas]);

  // Initialise nodes in a circle layout
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const { width, height } = svg.getBoundingClientRect();
    const w = width  || 900;
    const h = height || 580;
    setDims({ w, h });

    const minV = Math.min(...ideas.map(i => i.votes));
    const maxV = Math.max(...ideas.map(i => i.votes));

    nodesRef.current = ideas.map((idea, idx) => {
      const t      = maxV === minV ? 0.5 : (idea.votes - minV) / (maxV - minV);
      const radius = 32 + t * 20;
      const angle  = (idx / ideas.length) * Math.PI * 2 - Math.PI / 2;
      const ring   = Math.min(w, h) * 0.32;
      return {
        id: idea.id,
        x:  w / 2 + ring * Math.cos(angle) + (Math.random() - 0.5) * 20,
        y:  h / 2 + ring * Math.sin(angle) + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius,
        idea,
      };
    });
    edgesRef.current = edges;
    setTick(t => t + 1);
  }, [ideas, edges]);

  // Force simulation loop
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || nodesRef.current.length === 0) return;

    const simulate = () => {
      const { width, height } = svg.getBoundingClientRect();
      const w  = width  || dims.w;
      const h  = height || dims.h;
      const cx = w / 2, cy = h / 2;
      const ns = nodesRef.current;
      const es = edgesRef.current;

      // Dampen velocities
      for (const n of ns) { n.vx *= 0.88; n.vy *= 0.88; }

      // Node–node repulsion
      for (let i = 0; i < ns.length; i++) {
        for (let j = i + 1; j < ns.length; j++) {
          const dx   = ns[j].x - ns[i].x;
          const dy   = ns[j].y - ns[i].y;
          const dist = Math.hypot(dx, dy) || 1;
          const minD = ns[i].radius + ns[j].radius + 50;
          if (dist < minD * 2.5) {
            const f  = ((minD * 2.5 - dist) / (minD * 2.5)) * 1.1;
            const fx = (dx / dist) * f;
            const fy = (dy / dist) * f;
            ns[i].vx -= fx; ns[i].vy -= fy;
            ns[j].vx += fx; ns[j].vy += fy;
          }
        }
      }

      // Edge spring attraction
      for (const e of es) {
        const src = ns.find(n => n.id === e.source);
        const tgt = ns.find(n => n.id === e.target);
        if (!src || !tgt) continue;
        const dx   = tgt.x - src.x;
        const dy   = tgt.y - src.y;
        const dist = Math.hypot(dx, dy) || 1;
        const rest = src.radius + tgt.radius + 90;
        const f    = (dist - rest) * 0.025;
        const fx   = (dx / dist) * f;
        const fy   = (dy / dist) * f;
        src.vx += fx; src.vy += fy;
        tgt.vx -= fx; tgt.vy -= fy;
      }

      // Weak center gravity
      for (const n of ns) {
        n.vx += (cx - n.x) * 0.0025;
        n.vy += (cy - n.y) * 0.0025;
      }

      // Integrate + boundary clamp
      for (const n of ns) {
        const spd = Math.hypot(n.vx, n.vy);
        if (spd > 2.5) { n.vx = n.vx / spd * 2.5; n.vy = n.vy / spd * 2.5; }
        n.x += n.vx; n.y += n.vy;
        const pad = n.radius + 8;
        if (n.x < pad)      { n.x = pad;      n.vx =  Math.abs(n.vx); }
        if (n.x > w - pad)  { n.x = w - pad;  n.vx = -Math.abs(n.vx); }
        if (n.y < pad)      { n.y = pad;       n.vy =  Math.abs(n.vy); }
        if (n.y > h - pad)  { n.y = h - pad;   n.vy = -Math.abs(n.vy); }
      }

      frameRef.current++;
      if (frameRef.current % 2 === 0) setTick(t => t + 1);
      rafRef.current = requestAnimationFrame(simulate);
    };

    rafRef.current = requestAnimationFrame(simulate);
    return () => cancelAnimationFrame(rafRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodesRef.current.length]);

  // Helpers for hover highlight
  const connectedIds = useMemo<Set<number>>(() => {
    if (hoveredId === null) return new Set();
    const s = new Set<number>();
    for (const e of edgesRef.current) {
      if (e.source === hoveredId) s.add(e.target);
      if (e.target === hoveredId) s.add(e.source);
    }
    return s;
  }, [hoveredId]);

  // Wrap SVG text into 2 lines
  function wrapTitle(title: string, maxLen = 12): [string, string] {
    const words = title.split(' ');
    let line1 = '', line2 = '';
    for (const w of words) {
      if (line1.length === 0)          { line1 = w; }
      else if ((line1 + ' ' + w).length <= maxLen) { line1 += ' ' + w; }
      else if (line2.length === 0)     { line2 = w; }
      else { line2 += ' ' + w; break; }
    }
    if (line1.length > maxLen + 2) line1 = line1.slice(0, maxLen) + '…';
    if (line2.length > maxLen + 2) line2 = line2.slice(0, maxLen) + '…';
    return [line1, line2];
  }

  const categories = useMemo(() => [...new Set(ideas.map(i => i.cat))], [ideas]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        {categories.map(cat => (
          <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: CAT_COLOR[cat] || '#2563eb', boxShadow: `0 0 6px ${CAT_COLOR[cat]}` }} />
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>{cat}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="20" height="8"><line x1="0" y1="4" x2="20" y2="4" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="4 3" /></svg>
          <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>mesmo autor</span>
        </div>
      </div>

      {/* SVG graph */}
      <div style={{ borderRadius: 20, overflow: 'hidden', background: 'radial-gradient(ellipse at 50% 40%, #0a1240 0%, #050b1c 55%, #010307 100%)', position: 'relative' }}>
        <svg
          ref={svgRef}
          style={{ width: '100%', height: 580, display: 'block' }}
          viewBox={`0 0 ${dims.w} ${dims.h}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {nodesRef.current.map(n => {
              const color = CAT_COLOR[n.idea.cat] || '#2563eb';
              return (
                <radialGradient key={n.id} id={`g2-${n.id}`} cx="38%" cy="32%" r="65%">
                  <stop offset="0%"   stopColor={color} stopOpacity="0.65" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.12" />
                </radialGradient>
              );
            })}
          </defs>

          {/* ── Edges ── */}
          {edgesRef.current.map((e, i) => {
            const src = nodesRef.current.find(n => n.id === e.source);
            const tgt = nodesRef.current.find(n => n.id === e.target);
            if (!src || !tgt) return null;
            const active = hoveredId !== null && (hoveredId === e.source || hoveredId === e.target);
            const dimmed = hoveredId !== null && !active;
            const color  = CAT_COLOR[src.idea.cat] || '#2563eb';
            // Curved line via quadratic bezier
            const mx = (src.x + tgt.x) / 2 + (tgt.y - src.y) * 0.15;
            const my = (src.y + tgt.y) / 2 - (tgt.x - src.x) * 0.15;
            return (
              <path
                key={i}
                d={`M ${src.x} ${src.y} Q ${mx} ${my} ${tgt.x} ${tgt.y}`}
                fill="none"
                stroke={color}
                strokeWidth={active ? 2.5 : 1}
                strokeOpacity={dimmed ? 0.05 : active ? 0.75 : 0.22}
                strokeDasharray={e.type === 'author' ? '5 4' : undefined}
                style={{ transition: 'stroke-opacity 0.2s, stroke-width 0.2s' }}
              />
            );
          })}

          {/* ── Nodes ── */}
          {nodesRef.current.map(n => {
            const color      = CAT_COLOR[n.idea.cat] || '#2563eb';
            const isHovered  = hoveredId === n.id;
            const isNeighbor = connectedIds.has(n.id);
            const isDimmed   = hoveredId !== null && !isHovered && !isNeighbor;
            const voted      = hasVoted(n.id);
            const [l1, l2]   = wrapTitle(n.idea.title);
            const r          = isHovered ? n.radius + 4 : n.radius;

            return (
              <g
                key={n.id}
                transform={`translate(${n.x},${n.y})`}
                onClick={() => setSelected(n.idea)}
                onMouseEnter={() => setHoveredId(n.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                opacity={isDimmed ? 0.2 : 1}
              >
                {/* Outer glow */}
                <circle r={r + 10} fill={color} opacity={isHovered ? 0.22 : 0.07} style={{ transition: 'r 0.2s, opacity 0.2s' }} />
                {/* Pulse ring */}
                {isHovered && <circle r={r + 18} fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.35" />}
                {/* Main circle */}
                <circle
                  r={r}
                  fill={`url(#g2-${n.id})`}
                  stroke={color}
                  strokeWidth={isHovered ? 2.2 : 1.2}
                  style={{ transition: 'r 0.2s, stroke-width 0.2s' }}
                />
                {/* Title lines */}
                <text textAnchor="middle" fill="white" fontSize="10" fontWeight="700" style={{ pointerEvents: 'none' }}>
                  <tspan x="0" dy={l2 ? '-7' : '3'}>{l1}</tspan>
                  {l2 && <tspan x="0" dy="13">{l2}</tspan>}
                </text>
                {/* Vote count below */}
                <text
                  y={r - 7}
                  textAnchor="middle"
                  fill={color}
                  fontSize="9"
                  fontWeight="800"
                  opacity="0.9"
                  style={{ pointerEvents: 'none' }}
                >▲{voted ? n.idea.votes + 1 : n.idea.votes}</text>
              </g>
            );
          })}
        </svg>

        <div style={{ position: 'absolute', bottom: 12, right: 16, color: 'rgba(255,255,255,0.18)', fontSize: 11, fontStyle: 'italic', pointerEvents: 'none' }}>
          passa o rato sobre um nó · clica para ver detalhes
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(0,0,0,0.74)', backdropFilter: 'blur(12px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ position: 'relative', borderRadius: 24, padding: '36px 40px', maxWidth: 480, width: '100%', background: 'linear-gradient(145deg, #0c1345 0%, #040815 100%)', border: `1px solid ${CAT_COLOR[selected.cat] || '#2563eb'}55`, boxShadow: `0 0 90px ${CAT_COLOR[selected.cat] || '#2563eb'}2a, 0 32px 64px rgba(0,0,0,0.55)` }}>
            <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: 32, height: 32, color: 'rgba(255,255,255,0.55)', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            <span style={{ background: (CAT_COLOR[selected.cat] || '#2563eb') + '28', color: CAT_COLOR[selected.cat] || '#2563eb', padding: '4px 14px', borderRadius: 99, fontSize: 12, fontWeight: 700 }}>{selected.cat}</span>
            <h2 style={{ color: 'white', fontSize: 22, fontWeight: 800, marginTop: 16, marginBottom: 6, lineHeight: 1.3 }}>{selected.title}</h2>
            <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, marginBottom: 24 }}>por {selected.author} · {selected.status}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <button onClick={e => toggleVote(selected.id, e)} style={{ background: hasVoted(selected.id) ? CAT_COLOR[selected.cat] || '#2563eb' : 'rgba(255,255,255,0.08)', color: 'white', border: `1px solid ${CAT_COLOR[selected.cat] || '#2563eb'}`, borderRadius: 99, padding: '9px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.22s' }}>
                ▲ {hasVoted(selected.id) ? selected.votes + 1 : selected.votes} votos
              </button>
              <span style={{ color: 'rgba(255,255,255,0.32)', fontSize: 14 }}>💬 {selected.comments}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN — IdeaHub2 with view toggle
// ═══════════════════════════════════════════════════════════════════════════════
export default function IdeaHub2() {
  const [view, setView] = useState<View>('nebula');

  return (
    <div style={{ minHeight: '100vh', background: '#050714', paddingTop: 100, paddingBottom: 60 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>

        {/* ── Page header ── */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <h1 style={{ color: 'white', fontSize: 30, fontWeight: 900, margin: 0 }}>
              Ideia HUB
            </h1>
            <span style={{
              background: 'linear-gradient(135deg, #2563eb, #9437FF)',
              color: 'white', fontSize: 11, fontWeight: 800,
              padding: '3px 10px', borderRadius: 99, letterSpacing: '0.08em',
            }}>
              BETA
            </span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, margin: '0 0 24px' }}>
            Explora as ideias da comunidade em três modos visuais
          </p>

          {/* ── View toggle — centrado e bem visível ── */}
          <div style={{
            display: 'inline-flex', gap: 0,
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: 18, padding: 5,
          }}>
            {([
              ['nebula', '🌌 Nebula', 'Bolhas com física'],
              ['deck',   '🃏 Deck',   'Cartas 3D'],
              ['graph',  '🕸️ Graph',  'Rede de ideias'],
            ] as const).map(([v, label, sub]) => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  padding: '10px 24px', borderRadius: 13, border: 'none',
                  background: view === v
                    ? 'linear-gradient(135deg, #2563eb, #1d4ed8)'
                    : 'transparent',
                  color: view === v ? 'white' : 'rgba(255,255,255,0.45)',
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  transition: 'all 0.25s',
                  boxShadow: view === v ? '0 4px 16px rgba(37,99,235,0.45)' : 'none',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
                }}
              >
                <span>{label}</span>
                <span style={{ fontSize: 10, fontWeight: 400, opacity: view === v ? 0.75 : 0.4 }}>{sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Active view ── */}
        {view === 'nebula' && <NebulaView />}
        {view === 'deck'   && <DeckView />}
        {view === 'graph'  && <GraphView />}
      </div>
    </div>
  );
}
