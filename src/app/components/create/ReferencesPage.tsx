import { useState, useRef } from 'react';
import StepBar from './StepBar';
import { useTheme } from '../../context/ThemeContext';

interface ReferencesPageProps {
  onBack: () => void;
  onNextPage: () => void;
  isAnonymous: boolean;
  setIsAnonymous: (value: boolean) => void;
}

type RefItem = {
  id: string;
  type: 'file' | 'link';
  label: string;
  meta?: string;
};

const AI_CASES = [
  {
    id: 'case-0',
    company: 'SIEMENS',
    type: 'caso_real',
    title: 'Automação de aprovações de baixo valor com RPA',
    desc: 'A Siemens automatizou aprovações de despesas abaixo de €500 com RPA, eliminando revisões manuais desnecessárias e reduzindo erros de processamento em 89%.',
    insight: 'O segredo foi definir regras claras de threshold — aprovações de baixo risco passam automaticamente, as excepções chegam ao gestor já pré-analisadas.',
    stat: '−73%',
    statLabel: 'tempo de aprovação',
    tags: ['RPA', 'automação', 'finance ops'],
    color: '#4294F8',
    gradFrom: '#3126b4',
    gradTo: '#4294F8',
    glowRgb: '66,148,248',
    url: 'https://www.siemens.com',
  },
  {
    id: 'case-1',
    company: 'UNILEVER',
    type: 'caso_real',
    title: 'SLA de 48h para aprovações internas globais',
    desc: 'A Unilever implementou SLAs vinculativos com notificações automáticas de escalamento. O sistema opera em 60 países com regras de aprovação adaptadas por região.',
    insight: 'A visibilidade em tempo real foi o factor decisivo — gestores que viam o estado das aprovações no dashboard aprovavam 2× mais rápido.',
    stat: '+41%',
    statLabel: 'satisfação interna',
    tags: ['SLA', 'notificações', 'global ops'],
    color: '#00CFCF',
    gradFrom: '#036ef2',
    gradTo: '#00CFCF',
    glowRgb: '0,207,207',
    url: 'https://www.unilever.com',
  },
  {
    id: 'case-2',
    company: 'SAP',
    type: 'white_paper',
    title: 'Mobile-first approval workflows',
    desc: 'Estudo baseado em 200+ empresas mostra que fluxos de aprovação desenhados para mobile aumentam a taxa de conclusão em primeira análise e reduzem aprovações pendentes.',
    insight: 'Aprovações feitas em mobile têm taxa de erro 34% menor — interfaces simples forçam decisões mais conscientes e documentadas.',
    stat: '−60%',
    statLabel: 'tempo de resposta',
    tags: ['mobile', 'workflow', 'UX'],
    color: '#9437FF',
    gradFrom: '#9437FF',
    gradTo: '#3126b4',
    glowRgb: '148,55,255',
    url: 'https://www.sap.com',
  },
  {
    id: 'case-3',
    company: 'MICROSOFT',
    type: 'white_paper',
    title: 'Power Automate para aprovações no Teams',
    desc: 'A Microsoft integrou fluxos de aprovação directamente no Teams via Power Automate, eliminando o salto entre ferramentas e permitindo aprovação com um clique no chat.',
    insight: 'Reduzir o número de apps envolvidas numa aprovação de 4 para 1 foi o principal motor do aumento de velocidade — menos fricção, mais adesão.',
    stat: '+55%',
    statLabel: 'velocidade de decisão',
    tags: ['Power Automate', 'Teams', 'no-code'],
    color: '#FF0066',
    gradFrom: '#FF0066',
    gradTo: '#87007F',
    glowRgb: '255,0,102',
    url: 'https://www.microsoft.com',
  },
];

export default function ReferencesPage({ onBack, onNextPage }: ReferencesPageProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [attachments, setAttachments] = useState<RefItem[]>([
    { id: 'f-0', type: 'file', label: 'benchmark_aprovacoes_2026.pdf', meta: 'PDF' },
    { id: 'l-0', type: 'link', label: 'notion.so/exemplos-processo-aprovacao', meta: 'Link' },
  ]);
  const [selectedCaseIds, setSelectedCaseIds] = useState<string[]>(['case-1']);
  const [linkInput, setLinkInput] = useState('');
  const [linkError, setLinkError] = useState('');
  const [linkFocused, setLinkFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Tema ── */
  const bg     = isLight ? 'var(--bg)' : 'radial-gradient(ellipse at 50% -10%, #0f1a50 0%, #070b20 55%, #04061c 100%)';
  const border = isLight ? 'var(--border-light)' : 'rgba(255,255,255,0.07)';
  const surface = isLight ? 'var(--surface)' : 'rgba(255,255,255,0.04)';
  const textCol = isLight ? 'var(--text)' : '#fff';
  const muted  = isLight ? 'var(--text-muted)' : 'rgba(180,200,255,0.45)';

  /* ── Acções ── */
  const addLink = () => {
    const val = linkInput.trim();
    if (!val) { setLinkError('Introduz um link'); return; }
    if (!/^(https?:\/\/|www\.)\S+\.\S+/.test(val)) { setLinkError('Link inválido'); return; }
    setAttachments(prev => [...prev, { id: `l-${Date.now()}`, type: 'link', label: val, meta: 'Link' }]);
    setLinkInput('');
    setLinkError('');
  };

  const removeAttachment = (id: string) => setAttachments(prev => prev.filter(r => r.id !== id));

  const toggleCase = (id: string) =>
    setSelectedCaseIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const totalRefs = attachments.length + selectedCaseIds.length;

  /* ── Nota da IA ── */
  const aiNote = (() => {
    if (selectedCaseIds.includes('case-1'))
      return 'O caso Unilever demonstra impacto mensurável em contexto global — muito relevante para esta proposta.';
    if (totalRefs >= 3) return 'Boa cobertura de referências. A proposta está bem suportada com evidências externas.';
    if (totalRefs > 0) return 'Considera adicionar um caso da IA para reforçar a proposta com dados concretos.';
    return 'Adiciona referências para fortalecer a credibilidade da tua ideia.';
  })();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 86px)', background: bg, animation: 'refIn 0.35s ease both' }}>

      {/* ── Stepper ── */}
      <div style={{ background: isLight ? 'rgba(255,255,255,0.92)' : 'rgba(4,6,28,0.88)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
        <StepBar currentStep={2} onBack={onBack} backLabel="Brainstorming" />
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

        {/* ════ ÁREA PRINCIPAL ════ */}
        <div style={{ flex: 1, overflowY: 'auto', borderRight: `1px solid ${border}` }}>

          {/* Upload + Link — caixa única com divisor */}
          <div style={{ padding: '20px 28px', borderBottom: `1px solid ${border}` }}>
            <div style={{ display: 'flex', borderRadius: 11, border: `1.5px solid ${linkFocused ? '#4294F8' : linkError ? '#ef4444' : border}`, overflow: 'hidden', transition: 'border-color 0.2s' }}>

              {/* Metade esquerda — upload */}
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', cursor: 'pointer', borderRight: `1px solid ${border}`, transition: 'background 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(66,148,248,0.05)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
              >
                <input ref={fileInputRef} type="file" style={{ display: 'none' }} multiple />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-outfit)', color: textCol }}>Adicionar ficheiro</div>
                  <div style={{ fontSize: 10, fontFamily: 'var(--font-outfit)', color: muted, marginTop: 2 }}>PDF · Imagens · Documentos</div>
                </div>
              </div>

              {/* Metade direita — link */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '14px 18px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                <input
                  type="text"
                  value={linkInput}
                  onChange={e => { setLinkInput(e.target.value); setLinkError(''); }}
                  onKeyDown={e => e.key === 'Enter' && addLink()}
                  onFocus={() => setLinkFocused(true)}
                  onBlur={() => setLinkFocused(false)}
                  placeholder="Insira um link ou URL..."
                  style={{ flex: 1, background: 'transparent', border: 'none', fontSize: 12, color: textCol, fontFamily: 'var(--font-outfit)', outline: 'none' }}
                />
                <button onClick={addLink}
                  style={{ padding: '6px 13px', borderRadius: 7, border: 'none', background: linkInput ? 'linear-gradient(135deg, #036ef2, #3126b4)' : (isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.07)'), color: linkInput ? '#fff' : muted, fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-outfit)', cursor: linkInput ? 'pointer' : 'default', flexShrink: 0, transition: 'all 0.2s' }}>
                  Adicionar
                </button>
              </div>
            </div>
            {linkError && (
              <div style={{ fontSize: 9, color: '#ef4444', fontFamily: 'var(--font-mono)', marginTop: 5, paddingLeft: 2 }}>// {linkError}</div>
            )}
          </div>

          {/* Cases grid (2 por linha) */}
          <div style={{ padding: '22px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                // casos sugeridos pela ia
              </div>
              <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: '#4294F8', background: 'rgba(66,148,248,0.1)', border: '1px solid rgba(66,148,248,0.25)', borderRadius: 4, padding: '2px 7px' }}>
                gerado por ia
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {AI_CASES.map(c => {
                const isAdded = selectedCaseIds.includes(c.id);
                return (
                  <div key={c.id} style={{ borderRadius: 13, overflow: 'hidden', border: `1.5px solid ${isAdded ? `rgba(${c.glowRgb},0.35)` : border}`, background: isAdded ? `rgba(${c.glowRgb},0.05)` : surface, transition: 'all 0.25s', boxShadow: isAdded ? `0 0 20px rgba(${c.glowRgb},0.1)` : 'none', display: 'flex', flexDirection: 'column', minHeight: 270 }}>
                    {/* Top bar */}
                    <div style={{ height: 3, background: `linear-gradient(90deg, ${c.gradFrom}, ${c.gradTo})`, opacity: isAdded ? 1 : 0.28, transition: 'opacity 0.25s', flexShrink: 0 }}/>

                    <div style={{ padding: '18px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      {/* Company + stat */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div>
                          <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.08em', color: isAdded ? c.color : muted, marginBottom: 2 }}>{c.company}</div>
                          <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: muted, background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)', border: `1px solid ${border}`, borderRadius: 3, padding: '1px 5px', display: 'inline-block' }}>{c.type}</div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-mono)', color: c.color, lineHeight: 1 }}>{c.stat}</div>
                          <div style={{ fontSize: 8, fontFamily: 'var(--font-outfit)', color: muted, marginTop: 1 }}>{c.statLabel}</div>
                        </div>
                      </div>

                      {/* Title */}
                      <div style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-outfit)', color: textCol, marginBottom: 6, lineHeight: 1.4 }}>{c.title}</div>

                      {/* Desc */}
                      <div style={{ fontSize: 10.5, fontFamily: 'var(--font-outfit)', color: muted, lineHeight: 1.6, marginBottom: 10 }}>{c.desc}</div>

                      {/* Insight callout */}
                      {'insight' in c && (
                        <div style={{ marginBottom: 10, padding: '8px 11px', borderRadius: 7, background: `rgba(${c.glowRgb},0.07)`, borderLeft: `2.5px solid rgba(${c.glowRgb},0.5)`, flex: 1 }}>
                          <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: c.color, letterSpacing: '0.06em', marginBottom: 3 }}>// aprendizagem chave</div>
                          <div style={{ fontSize: 10.5, fontFamily: 'var(--font-outfit)', color: muted, lineHeight: 1.55 }}>{(c as typeof c & { insight: string }).insight}</div>
                        </div>
                      )}

                      {/* Tags */}
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
                        {c.tags.map((tag, j) => (
                          <span key={j} style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: isAdded ? c.color : muted, background: isAdded ? `rgba(${c.glowRgb},0.1)` : (isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)'), border: `1px solid ${isAdded ? `rgba(${c.glowRgb},0.2)` : border}`, borderRadius: 3, padding: '2px 6px', transition: 'all 0.2s' }}>
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: 6 }}>
                        <a href={c.url} target="_blank" rel="noopener noreferrer"
                          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '6px 10px', borderRadius: 7, border: `1px solid ${border}`, color: muted, fontSize: 10, fontFamily: 'var(--font-outfit)', cursor: 'pointer', textDecoration: 'none', transition: 'all 0.15s', background: 'transparent' }}
                          onMouseEnter={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.borderColor = `rgba(${c.glowRgb},0.35)`; a.style.color = c.color; }}
                          onMouseLeave={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.borderColor = border; a.style.color = muted; }}
                        >
                          Ver Mais
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                        </a>
                        <button onClick={() => toggleCase(c.id)}
                          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '6px 10px', borderRadius: 7, border: 'none', background: isAdded ? `rgba(${c.glowRgb},0.15)` : `linear-gradient(135deg, ${c.gradFrom}, ${c.gradTo})`, color: isAdded ? c.color : '#fff', fontSize: 10, fontWeight: 600, fontFamily: 'var(--font-outfit)', cursor: 'pointer', transition: 'all 0.2s', boxShadow: isAdded ? 'none' : `0 2px 10px rgba(${c.glowRgb},0.35)` }}>
                          {isAdded ? (
                            <>
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                              Adicionado
                            </>
                          ) : (
                            <>
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                              Adicionar
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ════ SIDEBAR ════ */}
        <div style={{ width: 272, flexShrink: 0, display: 'flex', flexDirection: 'column', background: isLight ? 'var(--bg2)' : 'rgba(4,6,28,0.55)', overflowY: 'auto' }}>

          {/* ── Casos de Referência ── */}
          <div style={{ padding: '18px 16px', borderBottom: `1px solid ${border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                // case de referência
              </div>
              {selectedCaseIds.length > 0 && (
                <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: '#4294F8', background: 'rgba(66,148,248,0.1)', border: '1px solid rgba(66,148,248,0.25)', borderRadius: 10, padding: '2px 8px' }}>
                  {selectedCaseIds.length}
                </div>
              )}
            </div>

            {selectedCaseIds.length === 0 ? (
              <div style={{ fontSize: 11, fontFamily: 'var(--font-outfit)', color: muted, padding: '14px 0', textAlign: 'center', lineHeight: 1.6, opacity: 0.55 }}>
                Nenhum caso adicionado ainda
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {selectedCaseIds.map(id => {
                  const c = AI_CASES.find(x => x.id === id)!;
                  return (
                    <div key={id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '9px 10px', borderRadius: 9, background: `rgba(${c.glowRgb},0.07)`, border: `1px solid rgba(${c.glowRgb},0.2)`, animation: 'refItemIn 0.2s ease' }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, background: `rgba(${c.glowRgb},0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={c.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="7" width="20" height="14" rx="2"/>
                          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                        </svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 10.5, fontFamily: 'var(--font-outfit)', color: textCol, lineHeight: 1.4 }}>{c.title}</div>
                        <div style={{ fontSize: 8.5, fontFamily: 'var(--font-mono)', color: c.color, marginTop: 2, letterSpacing: '0.04em' }}>{c.company}</div>
                      </div>
                      <span onClick={() => toggleCase(id)}
                        style={{ fontSize: 14, color: muted, cursor: 'pointer', flexShrink: 0, lineHeight: 1, paddingTop: 2, transition: 'color 0.15s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLSpanElement).style.color = '#ef4444'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLSpanElement).style.color = muted; }}
                      >×</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Anexos ── */}
          <div style={{ padding: '18px 16px', borderBottom: `1px solid ${border}`, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                // anexos
              </div>
              {attachments.length > 0 && (
                <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: muted, background: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.06)', border: `1px solid ${border}`, borderRadius: 10, padding: '2px 8px' }}>
                  {attachments.length}
                </div>
              )}
            </div>

            {attachments.length === 0 ? (
              <div style={{ fontSize: 11, fontFamily: 'var(--font-outfit)', color: muted, padding: '14px 0', textAlign: 'center', lineHeight: 1.6, opacity: 0.55 }}>
                Sem ficheiros ou links
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {attachments.map(r => (
                  <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 9, background: surface, border: `1px solid ${border}`, animation: 'refItemIn 0.2s ease' }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, background: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {r.type === 'file' ? (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                      ) : (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                        </svg>
                      )}
                    </div>
                    <span style={{ flex: 1, fontSize: 10.5, fontFamily: 'var(--font-outfit)', color: muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.label}
                    </span>
                    <span onClick={() => removeAttachment(r.id)}
                      style={{ fontSize: 14, color: muted, cursor: 'pointer', flexShrink: 0, lineHeight: 1, transition: 'color 0.15s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLSpanElement).style.color = '#ef4444'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLSpanElement).style.color = muted; }}
                    >×</span>
                  </div>
                ))}
              </div>
            )}

            {/* Nota da IA */}
            <div style={{ marginTop: 16, padding: '12px 13px', borderRadius: 10, background: isLight ? 'rgba(66,148,248,0.05)' : 'rgba(66,148,248,0.07)', border: '1px solid rgba(66,148,248,0.18)' }}>
              <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: '#4294F8', letterSpacing: '0.07em', marginBottom: 5 }}>// nota da ia</div>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-outfit)', color: muted, lineHeight: 1.6 }}>{aiNote}</div>
            </div>
          </div>

          {/* ── Acções ── */}
          <div style={{ padding: '16px', flexShrink: 0 }}>
            <button onClick={onNextPage}
              style={{ width: '100%', padding: '12px', borderRadius: 11, border: 'none', background: 'linear-gradient(135deg, #036ef2, #3126b4)', color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-outfit)', cursor: 'pointer', boxShadow: '0 6px 18px rgba(3,110,242,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'transform 0.15s, box-shadow 0.15s', marginBottom: 8 }}
              onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = 'translateY(-2px)'; b.style.boxShadow = '0 10px 26px rgba(3,110,242,0.5)'; }}
              onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = 'translateY(0)'; b.style.boxShadow = '0 6px 18px rgba(3,110,242,0.35)'; }}
            >
              Continuar para Resumo
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>

            <button onClick={onNextPage}
              style={{ width: '100%', padding: '10px', borderRadius: 11, border: `1.5px solid ${border}`, background: 'transparent', color: muted, fontSize: 12, fontWeight: 500, fontFamily: 'var(--font-outfit)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, transition: 'all 0.2s' }}
              onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'; b.style.color = textCol; }}
              onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = border; b.style.color = muted; }}
            >
              Continuar sem referências
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes refIn     { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes refItemIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
