import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepBar from './StepBar';
import { useTheme } from '../../context/ThemeContext';

interface SummaryPageProps {
  onBack: () => void;
  isAnonymous: boolean;
  setIsAnonymous: (value: boolean) => void;
}

const METRICS = [
  { label: 'Tempo de aprovação', value: '−73%', sub: 'vs. processo actual', color: '#4294F8', glowRgb: '66,148,248' },
  { label: 'Satisfação interna', value: '+41%', sub: 'eNPS colaboradores', color: '#00CFCF', glowRgb: '0,207,207' },
  { label: 'Horas poupadas/ano', value: '2.800h', sub: '≈ 1.5 FTE libertados', color: '#9437FF', glowRgb: '148,55,255' },
];

const SOLUCAO = [
  'Automatização de aprovações até €500 sem necessidade de aprovador humano',
  'SLA máximo de 48h com notificações automáticas ao colaborador',
  'Dashboard de visibilidade em tempo real sobre o estado do pedido',
  'App mobile para aprovadores responderem em qualquer lugar',
];

const RECURSOS = [
  'Equipa de TI: 2 devs, 6 semanas de implementação',
  'Ferramentas: plataforma RPA + licenças mobile',
  'Métrica principal: tempo médio de aprovação (baseline: 18 dias → target: 48h)',
  'Métricas secundárias: nº pedidos submetidos, taxa de abandono, NPS interno',
];

const REFS = [
  { label: 'benchmark_aprovacoes_2026.pdf', type: 'file' },
  { label: 'Caso Unilever — SLA 48h globais', type: 'case' },
  { label: 'notion.so/exemplos-processo-aprovacao', type: 'link' },
];

export default function SummaryPage({ onBack }: SummaryPageProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const navigate = useNavigate();

  const [title, setTitle]         = useState('Automatização do processo de aprovação de despesas');
  const [problema, setProblema]   = useState('O processo actual de aprovação de despesas é lento e opaco, causando semanas de espera sem feedback. Os colaboradores perdem motivação para submeter pedidos legítimos, criando atrasos em projectos críticos.');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [coauthorInput, setCoauthorInput] = useState('');
  const [coauthors, setCoauthors] = useState([{ name: 'Rita Campos', initials: 'RC' }]);
  const [showModal, setShowModal] = useState(false);

  /* ── Tema ── */
  const bg     = isLight ? 'var(--bg)' : 'radial-gradient(ellipse at 50% -10%, #0f1a50 0%, #070b20 55%, #04061c 100%)';
  const border = isLight ? 'var(--border-light)' : 'rgba(255,255,255,0.07)';
  const surface = isLight ? 'var(--surface)' : 'rgba(255,255,255,0.04)';
  const textCol = isLight ? 'var(--text)' : '#fff';
  const muted  = isLight ? 'var(--text-muted)' : 'rgba(180,200,255,0.45)';

  const PRIMARY  = '#036ef2';
  const P_GLOW   = '3,110,242';

  /* ── Co-autores ── */
  const addCoauthor = () => {
    const val = coauthorInput.trim();
    if (!val) return;
    const initials = val.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    setCoauthors(prev => [...prev, { name: val, initials }]);
    setCoauthorInput('');
  };

  /* ── Section card (render fn, not component — avoids remount on rerender) ── */
  const section = (
    id: string,
    label: string,
    accentColor: string,
    content: React.ReactNode,
    onEdit?: () => void,
  ) => (
    <div key={id} style={{ borderRadius: 12, border: `1px solid ${border}`, background: surface, marginBottom: 12, overflow: 'hidden' }}>
      <div style={{ borderLeft: `3px solid ${accentColor}55`, padding: '14px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: accentColor, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>
            {label}
          </div>
          {onEdit && (
            <button
              onClick={() => setEditingId(editingId === id ? null : id)}
              style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: editingId === id ? accentColor : muted, background: editingId === id ? `rgba(${P_GLOW},0.08)` : 'transparent', border: `1px solid ${editingId === id ? `rgba(${P_GLOW},0.25)` : border}`, borderRadius: 5, padding: '2px 9px', cursor: 'pointer', transition: 'all 0.15s' }}
            >
              {editingId === id ? 'concluir' : 'editar'}
            </button>
          )}
        </div>
        {content}
      </div>
    </div>
  );

  const bulletList = (items: string[], color: string) => (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12.5, color: muted, lineHeight: 1.6 }}>
          <span style={{ color, flexShrink: 0, fontSize: 15, lineHeight: 1.3, fontWeight: 300 }}>›</span>
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 86px)', background: bg, animation: 'sumIn 0.35s ease both' }}>

        {/* ── Stepper ── */}
        <div style={{ background: isLight ? 'rgba(255,255,255,0.92)' : 'rgba(4,6,28,0.88)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
          <StepBar currentStep={3} onBack={onBack} backLabel="Referências" />
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

          {/* ════ ÁREA PRINCIPAL ════ */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', borderRight: `1px solid ${border}` }}>

            {/* Categoria + Título */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 6, background: `rgba(${P_GLOW},0.1)`, border: `1px solid rgba(${P_GLOW},0.25)`, marginBottom: 16 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: PRIMARY }}/>
                <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: PRIMARY, letterSpacing: '0.08em', fontWeight: 700 }}>
                  melhoria_processo
                </span>
              </div>

              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={{ display: 'block', width: '100%', background: 'transparent', border: 'none', borderBottom: `1.5px solid ${border}`, padding: '6px 0', fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-outfit)', color: textCol, outline: 'none', letterSpacing: '-0.5px', marginBottom: 10, transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                onFocus={e => { (e.target as HTMLInputElement).style.borderBottomColor = PRIMARY; }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderBottomColor = border; }}
              />
              <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: muted, letterSpacing: '0.06em' }}>
                // gerado pela ia · podes editar qualquer secção
              </div>
            </div>

            {/* // problema */}
            {section('problema', '// problema', '#4294F8',
              editingId === 'problema' ? (
                <textarea
                  value={problema}
                  onChange={e => setProblema(e.target.value)}
                  style={{ width: '100%', background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)', border: `1px solid ${border}`, borderRadius: 8, padding: '10px 12px', fontSize: 12.5, color: textCol, fontFamily: 'var(--font-outfit)', outline: 'none', resize: 'vertical', minHeight: 90, lineHeight: 1.7, boxSizing: 'border-box' }}
                />
              ) : (
                <p style={{ fontSize: 12.5, lineHeight: 1.7, color: muted, margin: 0 }}>{problema}</p>
              ),
              () => {},
            )}

            {/* // recursos e métricas + // solução proposta — lado a lado */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div style={{ borderRadius: 12, border: `1px solid ${border}`, background: surface, overflow: 'hidden' }}>
                <div style={{ borderLeft: '3px solid #00CFCF55', padding: '14px 18px' }}>
                  <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: '#00CFCF', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>// solução proposta</div>
                  {bulletList(SOLUCAO, '#00CFCF')}
                </div>
              </div>
              <div style={{ borderRadius: 12, border: `1px solid ${border}`, background: surface, overflow: 'hidden' }}>
                <div style={{ borderLeft: '3px solid #c084fc55', padding: '14px 18px' }}>
                  <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: '#c084fc', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>// recursos e métricas</div>
                  {bulletList(RECURSOS, '#c084fc')}
                </div>
              </div>
            </div>

            {/* // impacto esperado — stats em destaque */}
            {section('impacto', '// impacto esperado', '#9437FF',
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {METRICS.map((m, i) => (
                  <div key={i} style={{ padding: '14px 14px', borderRadius: 10, background: `rgba(${m.glowRgb},0.07)`, border: `1px solid rgba(${m.glowRgb},0.2)` }}>
                    <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-mono)', color: m.color, lineHeight: 1, marginBottom: 5 }}>{m.value}</div>
                    <div style={{ fontSize: 10.5, fontWeight: 600, fontFamily: 'var(--font-outfit)', color: textCol, marginBottom: 2 }}>{m.label}</div>
                    <div style={{ fontSize: 9, fontFamily: 'var(--font-outfit)', color: muted }}>{m.sub}</div>
                  </div>
                ))}
              </div>
            )}

            {/* // referências */}
            {section('refs', '// referências', PRIMARY,
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {REFS.map((r, i) => {
                  const isCase = r.type === 'case';
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px', borderRadius: 8, background: isCase ? 'rgba(0,207,207,0.06)' : (isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)'), border: `1px solid ${isCase ? 'rgba(0,207,207,0.2)' : border}` }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={isCase ? '#00CFCF' : muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {r.type === 'file' && <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>}
                        {r.type === 'link' && <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>}
                        {r.type === 'case' && <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></>}
                      </svg>
                      <span style={{ fontSize: 11, fontFamily: 'var(--font-outfit)', color: isCase ? textCol : muted }}>{r.label}</span>
                    </div>
                  );
                })}
              </div>,
              () => {},
            )}
          </div>

          {/* ════ SIDEBAR ════ */}
          <div style={{ width: 272, flexShrink: 0, display: 'flex', flexDirection: 'column', background: isLight ? 'var(--bg2)' : 'rgba(4,6,28,0.55)', overflowY: 'auto' }}>

            {/* // meta */}
            <div style={{ padding: '18px 16px', borderBottom: `1px solid ${border}` }}>
              <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>// meta</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {[
                  { label: 'Categoria', value: 'Melhoria de Processo', highlight: false },
                  { label: 'Agente', value: 'Armindo Kapessa', highlight: false },
                  { label: 'Data', value: new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }), highlight: false },
                  { label: 'Estado', value: 'Rascunho', highlight: true },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: muted }}>{row.label}</span>
                    <span style={{ fontSize: 10.5, fontFamily: 'var(--font-outfit)', color: row.highlight ? '#00CFCF' : textCol, fontWeight: 500 }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* // co-autores */}
            <div style={{ padding: '18px 16px', borderBottom: `1px solid ${border}` }}>
              <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>// co-autores</div>

              <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                <input
                  type="text"
                  value={coauthorInput}
                  onChange={e => setCoauthorInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCoauthor()}
                  placeholder="Nome ou email..."
                  style={{ flex: 1, background: surface, border: `1.5px solid ${border}`, borderRadius: 8, padding: '7px 11px', fontSize: 11, color: textCol, fontFamily: 'var(--font-outfit)', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={e => { (e.target as HTMLInputElement).style.borderColor = PRIMARY; }}
                  onBlur={e => { (e.target as HTMLInputElement).style.borderColor = border; }}
                />
                <button onClick={addCoauthor}
                  style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${border}`, background: 'transparent', color: muted, fontSize: 18, fontWeight: 300, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s', lineHeight: 1 }}
                  onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = PRIMARY; b.style.color = PRIMARY; }}
                  onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = border; b.style.color = muted; }}
                >+</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {coauthors.map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 10px', borderRadius: 8, background: surface, border: `1px solid ${border}` }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #4294F8, #9437FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff', flexShrink: 0, fontFamily: 'var(--font-mono)' }}>
                      {c.initials}
                    </div>
                    <span style={{ fontSize: 11, fontFamily: 'var(--font-outfit)', color: muted }}>{c.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* // acções */}
            <div style={{ padding: '16px', marginTop: 'auto' }}>
              <button
                onClick={() => setShowModal(true)}
                style={{ width: '100%', padding: '13px', borderRadius: 11, border: 'none', background: `linear-gradient(135deg, ${PRIMARY}, #3126b4)`, color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-outfit)', cursor: 'pointer', boxShadow: `0 6px 18px rgba(${P_GLOW},0.4)`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'transform 0.15s, box-shadow 0.15s', marginBottom: 8 }}
                onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = 'translateY(-2px)'; b.style.boxShadow = `0 10px 26px rgba(${P_GLOW},0.55)`; }}
                onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = 'translateY(0)'; b.style.boxShadow = `0 6px 18px rgba(${P_GLOW},0.4)`; }}
              >
                Submeter Ideia
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
              <div
                style={{ textAlign: 'center', fontSize: 11, fontFamily: 'var(--font-mono)', color: muted, cursor: 'pointer', padding: '4px 0', transition: 'color 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.color = textCol; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.color = muted; }}
              >
                💾 Guardar rascunho
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal de sucesso ── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isLight ? 'rgba(255,255,255,0.96)' : 'rgba(4,6,28,0.97)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', animation: 'sumIn 0.3s ease' }}>
          <div style={{ textAlign: 'center', maxWidth: 460, padding: '48px 40px' }}>

            {/* Ícone */}
            <div style={{ width: 66, height: 66, borderRadius: 20, background: `linear-gradient(135deg, ${PRIMARY}, #3126b4)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 26px', boxShadow: `0 14px 36px rgba(${P_GLOW},0.45)` }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </div>

            <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-outfit)', color: textCol, letterSpacing: '-0.5px', marginBottom: 10, margin: '0 0 10px' }}>
              Ideia submetida!
            </h2>
            <p style={{ fontSize: 13, fontFamily: 'var(--font-outfit)', color: muted, lineHeight: 1.75, margin: '0 0 30px' }}>
              A tua ideia foi enviada para o Laboratório de Inovação.<br/>
              Quando entrar em análise serás notificado e um canal de acompanhamento será criado automaticamente.
            </p>

            {/* Divider */}
            <div style={{ height: 1, background: border, margin: '0 0 26px' }}/>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button
                onClick={() => { setShowModal(false); navigate('/criar'); }}
                style={{ padding: '11px 26px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg, ${PRIMARY}, #3126b4)`, color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-outfit)', cursor: 'pointer', boxShadow: `0 4px 14px rgba(${P_GLOW},0.4)`, transition: 'transform 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
              >
                Nova ideia
              </button>
              <button
                onClick={() => { setShowModal(false); navigate('/hub'); }}
                style={{ padding: '11px 26px', borderRadius: 10, border: `1.5px solid ${border}`, background: 'transparent', color: textCol, fontSize: 13, fontFamily: 'var(--font-outfit)', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = border; }}
              >
                Ideia Hub
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes sumIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  );
}
