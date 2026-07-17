import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const media = {
  dashboard: '/media/dashboard.png',
  opportunity: '/media/opportunity-details.png',
  plan: '/media/coaching-plan.png',
  session: '/media/coaching-session.png',
  progress: '/media/coaching-progress.png',
  system: '/media/design-system-reference.png',
  systemFoundations: '/media/design-system-foundations.png',
  systemComponents: '/media/design-system-components.png',
  systemControl: '/media/design-system-control.png',
}

const mediaSizes: Record<string, { width: number; height: number }> = {
  [media.dashboard]: { width: 2560, height: 3336 },
  [media.opportunity]: { width: 2560, height: 2214 },
  [media.plan]: { width: 2560, height: 4062 },
  [media.session]: { width: 2560, height: 3477 },
  [media.progress]: { width: 1472, height: 2207 },
  [media.system]: { width: 2472, height: 8415 },
  [media.systemFoundations]: { width: 2160, height: 1620 },
  [media.systemComponents]: { width: 2160, height: 1620 },
  [media.systemControl]: { width: 2160, height: 1620 },
}

function mediaSize(src: string) {
  return mediaSizes[src]
}

function ProductImage({
  src,
  alt,
  fit = 'contain',
  objectPosition = 'center',
  intrinsicWidth,
  intrinsicHeight,
  maxHeight,
  aspectRatio,
  neutral = false,
  caption,
  className = '',
  loading = 'lazy',
}: {
  src: string
  alt: string
  fit?: 'contain' | 'cover'
  objectPosition?: string
  intrinsicWidth?: number
  intrinsicHeight?: number
  maxHeight?: string
  aspectRatio?: string
  neutral?: boolean
  caption?: string
  className?: string
  loading?: 'eager' | 'lazy'
}) {
  const intrinsic = mediaSize(src)
  const style = {
    '--product-image-position': objectPosition,
    '--product-image-max-height': maxHeight ?? 'none',
    '--product-image-aspect-ratio': aspectRatio ?? 'auto',
  } as React.CSSProperties

  return (
    <div
      className={`product-image product-image--${fit}${neutral ? ' product-image--neutral' : ''}${className ? ` ${className}` : ''}`}
      style={style}
    >
      <div className="product-image__canvas">
        <img
          src={src}
          alt={alt}
          width={intrinsicWidth ?? intrinsic.width}
          height={intrinsicHeight ?? intrinsic.height}
          loading={loading}
          decoding="async"
          fetchPriority={loading === 'eager' ? 'high' : 'auto'}
        />
      </div>
      {caption && <p className="product-image__caption">{caption}</p>}
    </div>
  )
}

const chapters = [
  ['overview', 'Overview'],
  ['challenge', 'Challenge'],
  ['intelligence', 'Intelligence'],
  ['coaching', 'Coaching'],
  ['system', 'System'],
  ['reflection', 'Reflection'],
] as const

const operatingModel = [
  'Performance signals',
  'Pattern recognition',
  'Supporting evidence',
  'Coaching recommendation',
  'Manager decision',
  'Coaching outcome',
]

type PrincipleDetail = {
  id: string
  index: string
  title: string
  summary: string
  explanation: string
  why: string
  image: string
  crop: string
}

const principleDetails: PrincipleDetail[] = [
  {
    id: 'opportunity-first',
    index: '01',
    title: 'Opportunity First',
    summary: 'Start with the coaching decision that deserves attention—not another wall of metrics.',
    explanation: 'Valora prioritizes coaching opportunities by impact, relevance, and team-wide risk before asking a manager to interpret the underlying performance data.',
    why: 'Managers have limited coaching time. Clear prioritization protects attention and makes the next decision explicit.',
    image: media.dashboard,
    crop: 'opportunity',
  },
  {
    id: 'evidence-before-recommendation',
    index: '02',
    title: 'Evidence Before Recommendation',
    summary: 'Explain why an action exists before asking a manager to trust it.',
    explanation: 'Detected patterns stay connected to supporting calls, business impact, confidence, and the people affected. The recommendation follows the evidence rather than replacing it.',
    why: 'Inspectable evidence turns AI output into a reviewable decision aid instead of an unexplained conclusion.',
    image: media.opportunity,
    crop: 'evidence',
  },
  {
    id: 'human-oversight',
    index: '03',
    title: 'Human Oversight',
    summary: 'Keep every coaching recommendation editable, rejectable, and accountable.',
    explanation: 'Managers can adjust the coaching path, pace, focus topics, and shared context before a plan is activated or shown to a representative.',
    why: 'The manager remains responsible for the decision. Control must be visible in the workflow, not buried in policy language.',
    image: media.plan,
    crop: 'oversight',
  },
  {
    id: 'continuous-learning',
    index: '04',
    title: 'Continuous Learning',
    summary: 'Use reviewed outcomes to improve what the system recommends next.',
    explanation: 'Coaching progress, observed changes, and manager-confirmed updates close the loop between action and future recommendations.',
    why: 'Learning becomes credible when outcomes are reviewed by people before they influence the next decision.',
    image: media.progress,
    crop: 'learning',
  },
]

function Arrow({ direction = 'right' }: { direction?: 'right' | 'down' }) {
  return (
    <svg className={`arrow arrow--${direction}`} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3 10h13M11 5l5 5-5 5" />
    </svg>
  )
}

function Mark() {
  return (
    <span className="mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const [activeChapter, setActiveChapter] = useState('overview')
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let frame = 0
    const updateReadingState = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const root = document.documentElement
        const range = Math.max(root.scrollHeight - window.innerHeight, 1)
        const progress = Math.min(1, Math.max(0, window.scrollY / range))
        headerRef.current?.style.setProperty('--reading-progress', progress.toFixed(4))

        const marker = window.innerHeight * 0.3
        let current: (typeof chapters)[number][0] = chapters[0][0]
        chapters.forEach(([id]) => {
          const section = document.getElementById(id)
          if (section && section.getBoundingClientRect().top <= marker) current = id
        })
        setActiveChapter(current)
      })
    }

    updateReadingState()
    window.addEventListener('scroll', updateReadingState, { passive: true })
    window.addEventListener('resize', updateReadingState)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateReadingState)
      window.removeEventListener('resize', updateReadingState)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const handlePointerDown = (event: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [open])

  useEffect(() => {
    const desktopNavigation = window.matchMedia('(min-width: 901px)')
    const closeOnLayoutChange = () => setOpen(false)
    desktopNavigation.addEventListener('change', closeOnLayoutChange)
    return () => desktopNavigation.removeEventListener('change', closeOnLayoutChange)
  }, [])

  return (
    <header className="site-header" ref={headerRef}>
      <a className="wordmark" href="#top" aria-label="Valora case study, back to top">
        <Mark />
        Valora
      </a>
      <nav id="chapter-navigation" className={open ? 'chapter-nav is-open' : 'chapter-nav'} aria-label="Case study chapters">
        {chapters.map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            aria-current={activeChapter === id ? 'location' : undefined}
            onClick={() => setOpen(false)}
          >
            {label}
          </a>
        ))}
      </nav>
      <button
        className="menu-button"
        type="button"
        aria-label={open ? 'Close chapter navigation' : 'Open chapter navigation'}
        aria-controls="chapter-navigation"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
      </button>
    </header>
  )
}

function SectionIntro({
  index,
  eyebrow,
  title,
  body,
}: {
  index: string
  eyebrow: string
  title: string
  body?: string
}) {
  return (
    <header className="section-intro" data-reveal>
      <div className="section-index">
        <span>{index}</span>
        <span>{eyebrow}</span>
      </div>
      <div>
        <h2>{title}</h2>
        {body && <p>{body}</p>}
      </div>
    </header>
  )
}

function ProductFrame({
  src,
  alt,
  className = '',
  loading = 'lazy',
  reveal = true,
}: {
  src: string
  alt: string
  className?: string
  loading?: 'eager' | 'lazy'
  reveal?: boolean
}) {
  return (
    <figure className={`product-frame ${className}`} data-reveal={reveal ? '' : undefined}>
      <div className="frame-bar" aria-hidden="true">
        <span />
        <span />
        <span />
        <i>valora / performance intelligence</i>
      </div>
      <ProductImage
        src={src}
        alt={alt}
        loading={loading}
        fit="contain"
      />
    </figure>
  )
}

function Hero() {
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotion.matches) return

    let frame = 0
    const updateScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const progress = Math.min(1, Math.max(0, window.scrollY / Math.max(window.innerHeight, 1)))
        stage.style.setProperty('--hero-scroll', progress.toFixed(3))
      })
    }
    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateScroll)
    }
  }, [])

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2
    event.currentTarget.style.setProperty('--pointer-x', x.toFixed(3))
    event.currentTarget.style.setProperty('--pointer-y', y.toFixed(3))
  }

  const resetPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--pointer-x', '0')
    event.currentTarget.style.setProperty('--pointer-y', '0')
  }

  return (
    <section className="hero" id="top">
      <div className="hero-copy page-shell">
        <div className="hero-kicker hero-sequence hero-sequence--label">
          <span>Valora · Product design case study</span>
          <span>Performance intelligence</span>
        </div>
        <h1 aria-label="From performance signals to confident coaching decisions.">
          <span className="hero-line" style={{ '--line': 0 } as React.CSSProperties}>From performance signals</span>
          <span className="hero-line" style={{ '--line': 1 } as React.CSSProperties}>to confident coaching</span>
          <span className="hero-line hero-line--accent" style={{ '--line': 2 } as React.CSSProperties}>decisions.</span>
        </h1>
        <div className="hero-context hero-sequence hero-sequence--support">
          <p>
            Valora helps managers move from fragmented performance signals to confident coaching decisions—through inspectable evidence, clear recommendations, and human control.
          </p>
          <a href="#overview">
            Explore the product story
            <Arrow />
          </a>
        </div>
      </div>
      <div
        className="hero-decision-stage"
        ref={stageRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
      >
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-main-layer hero-sequence hero-sequence--product">
          <ProductFrame
            src={media.opportunity}
            alt="Valora opportunity detail showing a high-impact coaching signal, supporting evidence, and a manager-controlled recommended plan"
            className="hero-product"
            loading="eager"
            reveal={false}
          />
        </div>
        <div className="hero-fragment hero-fragment--opportunity" style={{ '--fragment': 0 } as React.CSSProperties} aria-hidden="true">
          <span>Coaching opportunity</span>
          <div><img src={media.dashboard} alt="" decoding="async" {...mediaSize(media.dashboard)} /></div>
        </div>
        <div className="hero-fragment hero-fragment--evidence" style={{ '--fragment': 1 } as React.CSSProperties} aria-hidden="true">
          <span>Supporting evidence</span>
          <div><img src={media.opportunity} alt="" decoding="async" {...mediaSize(media.opportunity)} /></div>
        </div>
        <div className="hero-fragment hero-fragment--action" style={{ '--fragment': 2 } as React.CSSProperties} aria-hidden="true">
          <span>Manager-controlled action</span>
          <div><img src={media.plan} alt="" decoding="async" {...mediaSize(media.plan)} /></div>
        </div>
      </div>
    </section>
  )
}

function Overview() {
  return (
    <section className="chapter page-shell" id="overview">
      <SectionIntro
        index="01"
        eyebrow="Project overview"
        title="From visibility to confident action."
        body="Valora is a conceptual enterprise platform for sales managers and directors. It connects CRM activity, conversation intelligence, QA reviews, and coaching history into one decision-support workflow."
      />
      <div className="overview-grid" data-reveal>
        <div>
          <span className="micro-label">The product question</span>
          <p className="large-copy">How might performance data become coaching—not another dashboard?</p>
        </div>
        <dl>
          <div>
            <dt>Primary users</dt>
            <dd>Sales managers<br />Sales directors</dd>
          </div>
          <div>
            <dt>Product category</dt>
            <dd>Enterprise performance intelligence</dd>
          </div>
          <div>
            <dt>Core responsibility</dt>
            <dd>Turn evidence into reviewable coaching decisions</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

function Challenge() {
  return (
    <section className="chapter chapter--tinted" id="challenge">
      <div className="page-shell">
        <SectionIntro
          index="02"
          eyebrow="The challenge"
          title="More data created more interpretation work."
          body="Managers already had the inputs. The unresolved work was deciding what deserved attention, understanding why performance changed, and translating that understanding into useful coaching."
        />
        <div className="reality-compare" data-reveal>
          <article>
            <span className="micro-label">Current reality</span>
            <ol>
              {['Performance data', 'Reports', 'Manual interpretation', 'Coaching', 'Inconsistent improvement'].map((item, index) => (
                <li key={item}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {item}
                </li>
              ))}
            </ol>
          </article>
          <article className="approach">
            <span className="micro-label">The Valora approach</span>
            <ol>
              {['Performance signals', 'Evidence', 'Understanding', 'Coaching plan', 'Behavior change', 'Continuous learning'].map((item, index) => (
                <li key={item}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {item}
                </li>
              ))}
            </ol>
          </article>
        </div>
      </div>
    </section>
  )
}

function Reality() {
  return (
    <section className="chapter page-shell" id="reality" aria-labelledby="reality-title">
      <div className="editorial-lead" data-reveal>
        <span className="micro-label">Understanding the reality</span>
        <h2 id="reality-title">The interface begins with a decision—not a collection of metrics.</h2>
        <p>
          The dashboard surfaces priority coaching opportunities, then lets managers move from the signal to its business impact, detected pattern, and real call evidence.
        </p>
      </div>
      <ProductFrame
        src={media.dashboard}
        alt="Valora dashboard prioritizing two coaching opportunities above progress and insight panels"
        className="wide-screen"
      />
      <div className="evidence-layout">
        <div className="sticky-copy" data-reveal>
          <span className="micro-label">Evidence before recommendation</span>
          <h3>Trust begins with an answer to “why?”</h3>
          <p>
            Recommendations expose the performance pattern, estimated impact, analyzed calls, affected people, and the evidence a manager can inspect before acting.
          </p>
          <ul className="plain-list">
            <li>Impact remains visible</li>
            <li>Evidence stays inspectable</li>
            <li>Recommendations remain editable</li>
          </ul>
        </div>
        <ProductFrame
          src={media.opportunity}
          alt="Opportunity detail screen showing impact assessment, detected pattern, evidence base, and an editable recommended coaching plan"
          className="portrait-screen"
        />
      </div>
    </section>
  )
}

function OperatingModel() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && node.classList.add('is-active'),
      { threshold: 0.25 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="operating-model" ref={ref}>
      {operatingModel.map((step, index) => (
        <div className="model-step" key={step} style={{ '--step': index } as React.CSSProperties}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <strong>{step}</strong>
          {index < operatingModel.length - 1 && <Arrow direction="down" />}
        </div>
      ))}
    </div>
  )
}

function PrincipleOverlay({
  detail,
  closing,
  onRequestClose,
}: {
  detail: PrincipleDetail
  closing: boolean
  onRequestClose: () => void
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const panel = panelRef.current
    const closeButton = closeRef.current
    if (!panel || !closeButton) return
    const previousOverflow = document.body.style.overflow
    const appRoot = document.getElementById('root')
    const previousAriaHidden = appRoot ? appRoot.getAttribute('aria-hidden') : null
    document.body.style.overflow = 'hidden'
    if (appRoot) {
      appRoot.inert = true
      appRoot.setAttribute('aria-hidden', 'true')
    }
    closeButton.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onRequestClose()
        return
      }
      if (event.key !== 'Tab') return
      const focusable = [...panel.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])')]
        .filter((element) => !element.hasAttribute('disabled'))
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      if (appRoot) {
        appRoot.inert = false
        if (previousAriaHidden === null) appRoot.removeAttribute('aria-hidden')
        else appRoot.setAttribute('aria-hidden', previousAriaHidden)
      }
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onRequestClose])

  return createPortal(
    <div
      className={`detail-overlay${closing ? ' is-closing' : ''}`}
      onPointerDown={(event) => event.target === event.currentTarget && onRequestClose()}
    >
      <div
        className="detail-dialog"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`detail-title-${detail.id}`}
        aria-describedby={`detail-description-${detail.id} detail-why-${detail.id}`}
      >
        <button ref={closeRef} className="detail-close" type="button" onClick={onRequestClose} aria-label="Close detail">
          <span aria-hidden="true">×</span>
        </button>
        <div className="detail-dialog__copy">
          <div className="detail-dialog__index">Principle {detail.index}</div>
          <h2 id={`detail-title-${detail.id}`}>{detail.title}</h2>
          <p className="detail-dialog__lead" id={`detail-description-${detail.id}`}>{detail.explanation}</p>
          <div className="detail-why">
            <span>Why it matters</span>
            <p id={`detail-why-${detail.id}`}>{detail.why}</p>
          </div>
        </div>
        <figure className={`detail-dialog__media detail-dialog__media--${detail.crop}`}>
          <ProductImage
            src={detail.image}
            alt={`Valora interface supporting the ${detail.title} principle`}
            fit="contain"
            neutral
            maxHeight="calc(100dvh - 112px)"
            loading="eager"
          />
        </figure>
      </div>
    </div>,
    document.body,
  )
}

function InteractivePrinciples() {
  const [activeDetail, setActiveDetail] = useState<PrincipleDetail | null>(null)
  const [closing, setClosing] = useState(false)
  const openerRef = useRef<HTMLButtonElement | null>(null)
  const timerRef = useRef<number | null>(null)

  const openDetail = (detail: PrincipleDetail, opener: HTMLButtonElement) => {
    openerRef.current = opener
    setClosing(false)
    setActiveDetail(detail)
  }

  const closeDetail = useCallback(() => {
    if (closing) return
    setClosing(true)
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 220
    timerRef.current = window.setTimeout(() => {
      setActiveDetail(null)
      setClosing(false)
    }, delay)
  }, [closing])

  useEffect(() => {
    if (activeDetail || !openerRef.current) return
    const frame = window.requestAnimationFrame(() => openerRef.current?.focus())
    return () => window.cancelAnimationFrame(frame)
  }, [activeDetail])

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current)
  }, [])

  return (
    <>
      <div className="interactive-principles" data-reveal>
        {principleDetails.map((detail) => (
          <button
            className="principle-card"
            key={detail.id}
            type="button"
            aria-haspopup="dialog"
            onClick={(event) => openDetail(detail, event.currentTarget)}
          >
            <span className="principle-card__index">{detail.index}</span>
            <span className="principle-card__copy">
              <strong>{detail.title}</strong>
              <span>{detail.summary}</span>
            </span>
            <span className={`principle-card__media principle-card__media--${detail.crop}`} aria-hidden="true">
              <ProductImage
                src={detail.image}
                alt=""
                fit="cover"
                objectPosition={detail.crop === 'evidence' ? 'center 42%' : detail.crop === 'learning' ? 'center 28%' : 'center 18%'}
                aspectRatio="5 / 6"
              />
            </span>
            <span className="principle-card__action">View principle <Arrow /></span>
          </button>
        ))}
      </div>
      {activeDetail && (
        <PrincipleOverlay detail={activeDetail} closing={closing} onRequestClose={closeDetail} />
      )}
    </>
  )
}

function Intelligence() {
  return (
    <section className="chapter chapter--dark" id="intelligence">
      <div className="page-shell">
        <SectionIntro
          index="03"
          eyebrow="The intelligence behind Valora"
          title="AI accelerates understanding. Managers remain responsible for decisions."
          body="The operating model makes the path from signal to outcome legible. Every recommendation can be reviewed, adjusted, or rejected before it shapes a coaching plan."
        />
        <OperatingModel />
        <InteractivePrinciples />
      </div>
    </section>
  )
}

function Coaching() {
  return (
    <section className="chapter page-shell" id="coaching">
      <SectionIntro
        index="04"
        eyebrow="Coaching in action"
        title="The recommendation becomes a plan the manager can shape."
        body="Valora connects the detected pattern to a structured path, gives the manager control over pace and focus, and preserves a transparent view of what the representative will see."
      />
      <div className="screen-sequence">
        <ProductFrame
          src={media.plan}
          alt="Coaching plan builder with performance snapshot, recommended coaching path, customization controls, and growth alignment views"
          className="sequence-plan"
        />
        <div className="sequence-caption" data-reveal>
          <span>From plan to practice</span>
          <p>A shared plan turns evidence into a sequence of self-assessment, guided practice, application, and impact review.</p>
        </div>
        <ProductFrame
          src={media.session}
          alt="Coaching session screen with shared growth alignment, call review evidence, applied practice, and reflection assistant"
          className="sequence-session"
        />
      </div>
    </section>
  )
}

function DesignSystem() {
  return (
    <section className="chapter chapter--system" id="system">
      <div className="page-shell">
        <SectionIntro
          index="05"
          eyebrow="Design system"
          title="A visual system built to make evidence feel calm and inspectable."
          body="Typography establishes the decision hierarchy. Indigo communicates action and intelligence. Semantic color is reserved for states, while borders and tonal surfaces organize dense evidence without visual noise."
        />
        <div className="system-grid">
          <article className="type-specimen" data-reveal>
            <span className="micro-label">Typography hierarchy</span>
            <p className="display-sample">Decision first.</p>
            <p className="body-sample">Evidence remains readable, structured, and close to the action it supports.</p>
            <p className="mono-sample">CONFIDENCE / SUPPORTING EVIDENCE / MANAGER REVIEW</p>
          </article>
          <article className="color-specimen" data-reveal>
            <span className="micro-label">Semantic color</span>
            <div className="swatches">
              <div className="swatch swatch--primary"><span>#3B5CCC</span><strong>Action</strong></div>
              <div className="swatch swatch--ink"><span>#111827</span><strong>Hierarchy</strong></div>
              <div className="swatch swatch--success"><span>#067958</span><strong>Progress</strong></div>
              <div className="swatch swatch--warning"><span>#B7791F</span><strong>Attention</strong></div>
            </div>
          </article>
          <article className="system-principles" data-reveal>
            <span className="micro-label">AI interaction principles</span>
            <div>
              <span>State</span><strong>What changed?</strong>
              <span>Evidence</span><strong>Why does it matter?</strong>
              <span>Action</span><strong>What remains under manager control?</strong>
            </div>
          </article>
          <article className="system-outcomes" data-reveal>
            <span className="micro-label">System outcome</span>
            <p>Clarity before density.</p>
            <p>Evidence before recommendation.</p>
            <p>Manager review before change.</p>
          </article>
        </div>
        <div className="system-source" aria-label="Selected details from the supplied Valora design-system reference">
          <figure className="source-detail" data-reveal>
            <div className="source-crop source-crop--foundations">
              <ProductImage src={media.systemFoundations} alt="Supplied Valora visual foundations showing primary, semantic, and neutral color roles" fit="contain" />
            </div>
            <figcaption>
              <span>Visual foundations</span>
              <p>Cool canvases and white product surfaces keep dense operational evidence calm. Indigo is reserved for intelligence and action.</p>
            </figcaption>
          </figure>
          <figure className="source-detail" data-reveal>
            <div className="source-crop source-crop--components">
              <ProductImage src={media.systemComponents} alt="Supplied Valora core component details including buttons, a KPI card, and a recommendation card" fit="contain" />
            </div>
            <figcaption>
              <span>Selected core components</span>
              <p>Buttons, KPI summaries, opportunity cards, and evidence panels share a restrained border and state language instead of competing decoration.</p>
            </figcaption>
          </figure>
          <figure className="source-detail" data-reveal>
            <div className="source-crop source-crop--control">
              <ProductImage src={media.systemControl} alt="Supplied Valora pattern evidence and manager-controlled selection details" fit="contain" />
            </div>
            <figcaption>
              <span>Evidence and human control</span>
              <p>Confidence states, evidence tables, explicit choices, and review controls make recommendations explainable and reversible.</p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

function Reflection() {
  return (
    <section className="chapter page-shell" id="reflection">
      <SectionIntro
        index="06"
        eyebrow="Reflection"
        title="The strongest AI experience is accountable to human review."
        body="Valora’s central design trade-off is deliberate: intelligence should speed up understanding without hiding the evidence or removing the manager’s responsibility. The system therefore treats progress as a reviewed update, not an automatic conclusion."
      />
      <div className="reflection-layout">
        <figure className="progress-visual" data-reveal>
          <ProductImage src={media.progress} alt="Coaching progress update reviewed by a manager before future recommendations are changed" fit="contain" />
        </figure>
        <div className="reflection-notes" data-reveal>
          <span className="micro-label">What the concept establishes</span>
          <ol>
            <li><span>01</span><p>Evidence stays connected to every recommendation.</p></li>
            <li><span>02</span><p>Managers can modify the path before coaching begins.</p></li>
            <li><span>03</span><p>Representatives see goals and growth areas with shared context.</p></li>
            <li><span>04</span><p>Future recommendations change only after outcomes are reviewed.</p></li>
          </ol>
          <p className="concept-note">This case study presents a conceptual product direction; it does not claim validated business outcomes or production deployment.</p>
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <footer className="final-cta">
      <div className="final-cta__content page-shell" data-reveal>
        <div>
          <span className="micro-label">End of case study</span>
          <h2>Better coaching decisions begin with evidence people can inspect.</h2>
        </div>
        <a className="final-contact" href="mailto:amrwael743@gmail.com">
          Start a conversation
          <Arrow />
        </a>
      </div>
      <div className="author-block page-shell" data-reveal data-capture="signature">
        <div className="author-monogram" aria-hidden="true">AW</div>
        <div>
          <span>Designed by</span>
          <strong>Amr Wael</strong>
        </div>
        <a href="mailto:amrwael743@gmail.com">amrwael743@gmail.com</a>
      </div>
      <div className="footer-line page-shell">
        <span>Valora · Conceptual enterprise product</span>
        <a href="#top">Return to top <Arrow /></a>
      </div>
    </footer>
  )
}

function App() {
  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )

    revealItems.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <a className="skip-link" href="#overview">Skip to case study</a>
      <Header />
      <main>
        <Hero />
        <Overview />
        <Challenge />
        <Reality />
        <Intelligence />
        <Coaching />
        <DesignSystem />
        <Reflection />
      </main>
      <FinalCta />
    </>
  )
}

export default App
