import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { ArrowDown, ArrowRight } from 'lucide-react';

const agents = [
  {
    name: 'Leonardo Silva',
    title: 'Melhoria de Processo',
    role: 'agente_pmo',
    photo: 'https://i.pravatar.cc/300?img=12',
    quote: '"A maioria dos problemas de processo é um problema de clareza disfarçado."',
    bio: 'Especialista em gestão de projectos e optimização de processos. Analisa problemas operacionais com rigor metodológico.',
    skills: ['Lean Six Sigma', 'BPMN', 'KPIs', 'RPA'],
    bg1: '#0f0c29',
    bg2: '#302b63',
    bg3: '#24243e',
    accent: '#4294F8',
    photoSide: 'right' as const,
  },
  {
    name: 'Ana Costa',
    title: 'Novo Produto',
    role: 'agente_produto',
    photo: 'https://i.pravatar.cc/300?img=47',
    quote: '"Um bom produto não precisa de ser explicado — resolve-se a si mesmo."',
    bio: 'Product manager com mindset de startup. Transforma ideias brutas em conceitos com proposta de valor clara.',
    skills: ['Design Thinking', 'MVP', 'User Research'],
    bg1: '#1a0010',
    bg2: '#3d0030',
    bg3: '#1a0020',
    accent: '#FF0066',
    photoSide: 'left' as const,
  },
  {
    name: 'Mariana Ramos',
    title: 'Experiência do Cliente',
    role: 'agente_cx',
    photo: 'https://i.pravatar.cc/300?img=36',
    quote: '"O cliente não compra o produto. Compra a versão de si mesmo que o produto promete."',
    bio: 'Especialista em CX e service design. Transforma fricções em oportunidades de diferenciação.',
    skills: ['Journey Mapping', 'NPS', 'Personas'],
    bg1: '#001a2e',
    bg2: '#003d5c',
    bg3: '#001824',
    accent: '#0891b2',
    photoSide: 'right' as const,
  },
  {
    name: 'Carlos Mendes',
    title: 'Cultura & Pessoas',
    role: 'agente_rh',
    photo: 'https://i.pravatar.cc/300?img=53',
    quote: '"Cultura não é o que está nos valores da empresa. É o que acontece quando ninguém está a ver."',
    bio: 'People & culture specialist. Cria ambientes de trabalho mais motivadores, inclusivos e produtivos.',
    skills: ['OKRs', 'Engagement', 'L&D'],
    bg1: '#120020',
    bg2: '#2d0050',
    bg3: '#100018',
    accent: '#9437FF',
    photoSide: 'left' as const,
  },
  {
    name: 'Sofia Neves',
    title: 'Tecnologia & Digital',
    role: 'agente_tech',
    photo: 'https://i.pravatar.cc/300?img=25',
    quote: '"A tecnologia certa para o problema errado resolve-o mais depressa — não o elimina."',
    bio: 'Tech lead e arquitecta de soluções digitais. Define âmbito técnico com clareza — viabilidade, integrações, escalabilidade.',
    skills: ['APIs', 'Cloud', 'AI/ML', 'Security'],
    bg1: '#001030',
    bg2: '#002060',
    bg3: '#000820',
    accent: '#036ef2',
    photoSide: 'right' as const,
  },
  {
    name: 'Rui Ferreira',
    title: 'Generalista',
    role: 'agente_geral',
    photo: 'https://i.pravatar.cc/300?img=8',
    quote: '"A resposta óbvia raramente é a mais interessante."',
    bio: 'Facilitador criativo ideal para ideias transversais. Aborda o problema com curiosidade e sem preconceitos disciplinares.',
    skills: ['Facilitação', 'Criatividade', 'Estratégia'],
    bg1: '#100020',
    bg2: '#1a0030',
    bg3: '#0a1a00',
    accent: '#87007f',
    photoSide: 'left' as const,
  },
];

type Agent = typeof agents[0];

function AgentSection({
  agent,
  index,
  total,
  isActive,
}: {
  agent: Agent;
  index: number;
  total: number;
  isActive: boolean;
}) {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6 });

  const photoLeft = agent.photoSide === 'left';

  return (
    <div
      ref={ref}
      style={{
        height: '100vh',
        scrollSnapAlign: 'start',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${agent.bg1}, ${agent.bg2} 50%, ${agent.bg3})`,
      }}
    >
      {/* Animated background blobs */}
      <div
        style={{
          position: 'absolute', inset: 0, overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div style={{
          position: 'absolute',
          width: '60vw', height: '60vw',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${agent.accent}18 0%, transparent 70%)`,
          top: photoLeft ? '-10%' : '20%',
          left: photoLeft ? '-10%' : '40%',
          animation: `blobFloat${index} 8s ease-in-out infinite`,
        }} />
        <div style={{
          position: 'absolute',
          width: '40vw', height: '40vw',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${agent.accent}10 0%, transparent 70%)`,
          bottom: '-5%',
          right: photoLeft ? '10%' : '-10%',
          animation: `blobFloat${index} 12s ease-in-out infinite reverse`,
        }} />
        {/* Grid dots */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
      </div>

      {/* Index number */}
      <div style={{
        position: 'absolute', top: 32, left: 48,
        fontFamily: 'var(--font-mono)',
        fontSize: 11, color: 'rgba(255,255,255,0.2)',
        letterSpacing: 2,
      }}>
        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </div>

      {/* Content */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        padding: '0 80px',
        gap: 64,
        flexDirection: photoLeft ? 'row' : 'row-reverse',
        position: 'relative', zIndex: 1,
      }}>
        {/* Photo */}
        <motion.div
          initial={{ opacity: 0, x: photoLeft ? -60 : 60, scale: 0.9 }}
          animate={inView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: photoLeft ? -60 : 60, scale: 0.9 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ flexShrink: 0, position: 'relative' }}
        >
          {/* Decorative ring */}
          <div style={{
            position: 'absolute',
            inset: -12,
            borderRadius: '50%',
            border: `1.5px solid ${agent.accent}40`,
            animation: 'ringPulse 3s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute',
            inset: -24,
            borderRadius: '50%',
            border: `1px solid ${agent.accent}20`,
            animation: 'ringPulse 3s ease-in-out infinite 0.5s',
          }} />
          <img
            src={agent.photo}
            alt={agent.name}
            style={{
              width: 280,
              height: 280,
              borderRadius: '50%',
              objectFit: 'cover',
              objectPosition: 'top',
              border: `3px solid ${agent.accent}60`,
              boxShadow: `0 0 60px ${agent.accent}40, 0 0 120px ${agent.accent}20`,
              display: 'block',
            }}
          />
          {/* Online badge */}
          <div style={{
            position: 'absolute', bottom: 16, right: 16,
            background: '#16a34a',
            border: '3px solid rgba(0,0,0,0.4)',
            borderRadius: 20, padding: '5px 12px',
            fontSize: 11, color: '#fff',
            fontFamily: 'var(--font-mono)',
            display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: '#4ade80',
              animation: 'onlinePulse 2s infinite',
              display: 'inline-block',
            }} />
            online agora
          </div>
        </motion.div>

        {/* Text content */}
        <div style={{ flex: 1, maxWidth: 560 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{
              fontSize: 11, fontFamily: 'var(--font-mono)',
              color: agent.accent, marginBottom: 12,
              letterSpacing: 2, textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <div style={{ width: 24, height: 1, background: agent.accent }} />
            {agent.role} · {agent.title}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{
              fontSize: 54, fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.05, letterSpacing: -2,
              marginBottom: 28,
              fontFamily: 'var(--font-outfit)',
              textShadow: `0 0 40px ${agent.accent}40`,
            }}
          >
            {agent.name}
          </motion.h2>

          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.38 }}
            style={{
              fontSize: 20, fontWeight: 600,
              color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.5, marginBottom: 24,
              borderLeft: `3px solid ${agent.accent}`,
              paddingLeft: 20,
              fontStyle: 'italic',
            }}
          >
            {agent.quote}
          </motion.blockquote>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{
              fontSize: 14, color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.7, marginBottom: 28,
            }}
          >
            {agent.bio}
          </motion.p>

          {/* Skills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 36 }}>
            {agent.skills.map((s, i) => (
              <motion.span
                key={s}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: 0.55 + i * 0.07 }}
                style={{
                  padding: '6px 16px',
                  background: `${agent.accent}18`,
                  border: `1px solid ${agent.accent}40`,
                  borderRadius: 20,
                  fontSize: 12, color: agent.accent,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                }}
              >
                {s}
              </motion.span>
            ))}
          </div>

          {/* CTA */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            onClick={() => navigate('/criar')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: '14px 32px',
              background: agent.accent,
              border: 'none', borderRadius: 12,
              cursor: 'pointer', color: '#fff',
              fontWeight: 700, fontSize: 14,
              fontFamily: 'var(--font-outfit)',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              boxShadow: `0 4px 24px ${agent.accent}50`,
              letterSpacing: 0.3,
            }}
          >
            Iniciar brainstorming com {agent.name.split(' ')[0]}
            <ArrowRight size={15} />
          </motion.button>
        </div>
      </div>

      {/* Scroll hint (last section hides it) */}
      {index < total - 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1 }}
          style={{
            position: 'absolute', bottom: 28, left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 6,
            color: 'rgba(255,255,255,0.25)',
            fontSize: 10, fontFamily: 'var(--font-mono)',
          }}
        >
          <span>próximo agente</span>
          <ArrowDown size={14} style={{ animation: 'arrowBounce 1.5s ease-in-out infinite' }} />
        </motion.div>
      )}
    </div>
  );
}

export default function AgentsPageC() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = agents.map((_, i) => {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveIndex(i); },
        { threshold: 0.6 }
      );
      if (sectionRefs.current[i]) obs.observe(sectionRefs.current[i]!);
      return obs;
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  function scrollTo(i: number) {
    sectionRefs.current[i]?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div style={{ paddingTop: '62px', position: 'relative' }}>
      {/* Scroll container */}
      <div
        ref={containerRef}
        style={{
          height: 'calc(100vh - 62px)',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth',
        }}
      >
        {agents.map((agent, i) => (
          <div
            key={agent.name}
            ref={(el) => { sectionRefs.current[i] = el; }}
          >
            <AgentSection
              agent={agent}
              index={i}
              total={agents.length}
              isActive={activeIndex === i}
            />
          </div>
        ))}
      </div>

      {/* Side navigation dots */}
      <div style={{
        position: 'fixed',
        right: 28, top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', gap: 10,
        zIndex: 100,
      }}>
        {agents.map((agent, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            title={agent.name}
            style={{
              width: activeIndex === i ? 10 : 7,
              height: activeIndex === i ? 10 : 7,
              borderRadius: '50%',
              background: activeIndex === i ? agents[activeIndex].accent : 'rgba(255,255,255,0.25)',
              border: activeIndex === i ? `2px solid ${agents[activeIndex].accent}` : '2px solid rgba(255,255,255,0.15)',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.3s',
              boxShadow: activeIndex === i ? `0 0 10px ${agents[activeIndex].accent}80` : 'none',
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes ringPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.04); }
        }
        @keyframes arrowBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        @keyframes onlinePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
