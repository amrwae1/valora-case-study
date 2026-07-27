import { useEffect, useMemo, useRef, useState } from 'react'

type Stage = 'signal' | 'evidence' | 'plan' | 'active'
type IconName =
  | 'bell'
  | 'check'
  | 'close'
  | 'coach'
  | 'help'
  | 'plan'
  | 'play'
  | 'spark'
  | 'team'

type Opportunity = {
  id: string
  title: string
  summary: string
  impact: 'High impact' | 'Medium impact'
  risk: string
  rep: string
  role: string
  initials: string
  pipeline: string
  change: string
  calls: number
  affected: number
  confidence: number
}

const opportunities: Opportunity[] = [
  {
    id: 'closing-skills',
    title: 'Closing skills decline',
    summary: 'Late-stage calls are ending without a clear mutual commitment.',
    impact: 'High impact',
    risk: 'Revenue risk',
    rep: 'Jane Doe',
    role: 'Enterprise AE',
    initials: 'JD',
    pipeline: '$1.2M',
    change: '−12%',
    calls: 45,
    affected: 6,
    confidence: 88,
  },
  {
    id: 'discovery-quality',
    title: 'Discovery depth slipping',
    summary: 'Qualification questions are skipped in 4 of the last 10 calls.',
    impact: 'Medium impact',
    risk: 'Team pattern',
    rep: 'John Smith',
    role: 'SDR · EMEA',
    initials: 'JS',
    pipeline: '$420K',
    change: '−7%',
    calls: 18,
    affected: 3,
    confidence: 76,
  },
]

const initialSteps = [
  {
    id: 'review',
    title: 'Review flagged call moments',
    detail: 'Confirm the pattern across three highlighted excerpts.',
    selected: true,
  },
  {
    id: 'practice',
    title: 'Run a 15-minute guided practice',
    detail: 'Practice securing a specific next-step commitment.',
    selected: true,
  },
  {
    id: 'apply',
    title: 'Apply the framework in live calls',
    detail: 'Use the commitment check in the next five late-stage calls.',
    selected: true,
  },
  {
    id: 'measure',
    title: 'Review impact with Jane',
    detail: 'Compare commitment clarity and stage movement after 30 days.',
    selected: true,
  },
]

const stageOrder: Stage[] = ['signal', 'evidence', 'plan', 'active']
const stageLabels: Record<Stage, string> = {
  signal: 'Opportunity',
  evidence: 'Evidence',
  plan: 'Coaching plan',
  active: 'Activated',
}

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  if (name === 'coach') {
    return (
      <svg {...common}>
        <path d="m3 9 9-5 9 5-9 5-9-5Z" />
        <path d="M7 11.5V17l5 3 5-3v-5.5" />
      </svg>
    )
  }
  if (name === 'team') {
    return (
      <svg {...common}>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19c.4-3.2 2.2-5 5.5-5s5.1 1.8 5.5 5M16 5.5a3 3 0 0 1 0 5.8M16.5 14c2.4.4 3.8 2 4 5" />
      </svg>
    )
  }
  if (name === 'plan') {
    return (
      <svg {...common}>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </svg>
    )
  }
  if (name === 'help') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.8 9a2.3 2.3 0 1 1 3.4 2c-.8.5-1.2 1-1.2 2M12 17h.01" />
      </svg>
    )
  }
  if (name === 'bell') {
    return (
      <svg {...common}>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
      </svg>
    )
  }
  if (name === 'spark') {
    return (
      <svg {...common}>
        <path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3ZM6 14l.8 2.2L9 17l-2.2.8L6 20l-.8-2.2L3 17l2.2-.8L6 14ZM18 13l.7 1.8 1.8.7-1.8.7L18 18l-.7-1.8-1.8-.7 1.8-.7L18 13Z" />
      </svg>
    )
  }
  if (name === 'play') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="m10 8 6 4-6 4V8Z" />
      </svg>
    )
  }
  if (name === 'check') {
    return (
      <svg {...common}>
        <path d="m5 12 4 4L19 6" />
      </svg>
    )
  }
  if (name === 'close') {
    return (
      <svg {...common}>
        <path d="m6 6 12 12M18 6 6 18" />
      </svg>
    )
  }
  return null
}

function ProductApp() {
  const [selectedId, setSelectedId] = useState(opportunities[0].id)
  const [stage, setStage] = useState<Stage>('signal')
  const [steps, setSteps] = useState(initialSteps)
  const [timeline, setTimeline] = useState('30 days')
  const [managerNote, setManagerNote] = useState(
    'Build on Jane’s strong discovery habits while making the closing ask more specific and mutual.',
  )
  const [playingCall, setPlayingCall] = useState<string | null>(null)
  const [toast, setToast] = useState('')
  const [mobileQueueOpen, setMobileQueueOpen] = useState(false)
  const toastTimer = useRef<number | null>(null)

  const selected = useMemo(
    () => opportunities.find((item) => item.id === selectedId) ?? opportunities[0],
    [selectedId],
  )
  const selectedStepCount = steps.filter((step) => step.selected).length

  useEffect(
    () => () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current)
    },
    [],
  )

  const notify = (message: string) => {
    setToast(message)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 3200)
  }

  const chooseOpportunity = (id: string) => {
    setSelectedId(id)
    setStage('signal')
    setMobileQueueOpen(false)
  }

  const toggleStep = (id: string) => {
    setSteps((items) =>
      items.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item,
      ),
    )
  }

  const activatePlan = () => {
    setStage('active')
    window.localStorage.setItem(
      'valora-demo-plan',
      JSON.stringify({
        opportunity: selected.id,
        timeline,
        steps: steps.filter((item) => item.selected).map((item) => item.id),
        managerNote,
        activatedAt: new Date().toISOString(),
      }),
    )
    notify(`Coaching plan activated for ${selected.rep}`)
  }

  const setCurrentStage = (next: Stage) => {
    if (next === 'active' && stage !== 'active') return
    setStage(next)
  }

  return (
    <div className="vp-app">
      <a className="vp-skip" href="#decision-workspace">
        Skip to decision workspace
      </a>

      <aside className="vp-rail" aria-label="Primary">
        <a className="vp-brand" href="/app/" aria-label="Valora coaching workspace">
          <span className="vp-brand__mark">V</span>
          <span>
            <strong>Valora</strong>
            <small>Performance intelligence</small>
          </span>
        </a>
        <nav className="vp-nav">
          <button className="vp-nav__item is-current" type="button" aria-current="page">
            <Icon name="coach" />
            <span>Coaching</span>
          </button>
          <button
            className="vp-nav__item"
            type="button"
            onClick={() => notify('Team view is planned for the next sprint')}
          >
            <Icon name="team" />
            <span>Team</span>
          </button>
          <button
            className="vp-nav__item"
            type="button"
            onClick={() => notify('Plan history is planned for the next sprint')}
          >
            <Icon name="plan" />
            <span>Plans</span>
          </button>
        </nav>
        <div className="vp-rail__bottom">
          <span className="vp-avatar">SM</span>
          <span>
            <strong>Sarah Miller</strong>
            <small>Sales manager</small>
          </span>
        </div>
      </aside>

      <div className="vp-shell">
        <header className="vp-topbar">
          <button
            className="vp-mobile-brand"
            type="button"
            onClick={() => setMobileQueueOpen(true)}
            aria-label="Open opportunity queue"
          >
            <span>V</span> Valora
          </button>
          <div className="vp-breadcrumb">
            <span>Coaching</span>
            <span>/</span>
            <strong>{selected.title}</strong>
          </div>
          <div className="vp-topbar__actions">
            <span className="vp-demo-badge">Demo workspace</span>
            <a className="vp-icon-link" href="/" aria-label="View Valora case study">
              <Icon name="help" />
            </a>
            <button
              className="vp-icon-link"
              type="button"
              aria-label="Notifications"
              onClick={() => notify('You’re all caught up')}
            >
              <Icon name="bell" />
            </button>
            <span className="vp-avatar">SM</span>
          </div>
        </header>

        <div className="vp-workspace">
          <aside
            className={`vp-queue ${mobileQueueOpen ? 'is-open' : ''}`}
            aria-label="Coaching opportunity queue"
          >
            <div className="vp-queue__mobile-head">
              <strong>Opportunity queue</strong>
              <button
                type="button"
                onClick={() => setMobileQueueOpen(false)}
                aria-label="Close opportunity queue"
              >
                <Icon name="close" />
              </button>
            </div>
            <div className="vp-queue__heading">
              <span className="vp-eyebrow">Decision queue</span>
              <h1>Coaching opportunities</h1>
              <p>Prioritized by business impact, evidence strength, and urgency.</p>
            </div>
            <div className="vp-queue__summary">
              <span>
                <strong>2</strong> need review
              </span>
              <span>
                <strong>1</strong> high impact
              </span>
            </div>
            <div className="vp-opportunity-list">
              {opportunities.map((item) => (
                <button
                  type="button"
                  className={`vp-opportunity ${
                    selected.id === item.id ? 'is-selected' : ''
                  }`}
                  key={item.id}
                  onClick={() => chooseOpportunity(item.id)}
                  aria-pressed={selected.id === item.id}
                >
                  <span
                    className={`vp-impact vp-impact--${
                      item.impact === 'High impact' ? 'high' : 'medium'
                    }`}
                  >
                    {item.impact}
                  </span>
                  <strong>{item.title}</strong>
                  <span className="vp-opportunity__summary">{item.summary}</span>
                  <span className="vp-opportunity__meta">
                    <span className="vp-avatar vp-avatar--small">{item.initials}</span>
                    {item.rep}
                    <span>·</span>
                    {item.pipeline}
                  </span>
                </button>
              ))}
            </div>
            <div className="vp-queue__note">
              <Icon name="spark" />
              <p>
                <strong>Why this order?</strong>
                Valora weighs revenue exposure, recency, repetition, and confidence.
                Managers can always change the priority.
              </p>
            </div>
          </aside>
          {mobileQueueOpen && (
            <button
              className="vp-queue-backdrop"
              type="button"
              onClick={() => setMobileQueueOpen(false)}
              aria-label="Close opportunity queue"
            />
          )}

          <main className="vp-main" id="decision-workspace">
            <section className="vp-decision-head" aria-labelledby="decision-title">
              <div>
                <div className="vp-chip-row">
                  <span className="vp-impact vp-impact--high">{selected.impact}</span>
                  <span className="vp-chip">{selected.risk}</span>
                  <span className="vp-chip vp-chip--active">
                    <i /> Active signal
                  </span>
                </div>
                <h2 id="decision-title">{selected.title}</h2>
                <p>{selected.summary}</p>
              </div>
              <div className="vp-person">
                <span className="vp-avatar">{selected.initials}</span>
                <span>
                  <strong>{selected.rep}</strong>
                  <small>{selected.role}</small>
                </span>
              </div>
            </section>

            <ol className="vp-stage-nav" aria-label="Coaching decision progress">
              {stageOrder.map((item, index) => {
                const currentIndex = stageOrder.indexOf(stage)
                const isAvailable = index <= currentIndex || item !== 'active'
                return (
                  <li key={item} className={index <= currentIndex ? 'is-complete' : ''}>
                    <button
                      type="button"
                      onClick={() => isAvailable && setCurrentStage(item)}
                      aria-current={stage === item ? 'step' : undefined}
                      aria-label={stageLabels[item]}
                      disabled={!isAvailable}
                    >
                      <span>
                        {index < currentIndex ? (
                          <Icon name="check" size={16} />
                        ) : (
                          index + 1
                        )}
                      </span>
                      <b>{stageLabels[item]}</b>
                    </button>
                  </li>
                )
              })}
            </ol>

            <div className="vp-content-grid">
              <div className="vp-primary">
                {stage === 'signal' && (
                  <SignalStage selected={selected} onNext={() => setStage('evidence')} />
                )}
                {stage === 'evidence' && (
                  <EvidenceStage
                    selected={selected}
                    playingCall={playingCall}
                    setPlayingCall={setPlayingCall}
                    onBack={() => setStage('signal')}
                    onNext={() => setStage('plan')}
                  />
                )}
                {stage === 'plan' && (
                  <PlanStage
                    selected={selected}
                    steps={steps}
                    toggleStep={toggleStep}
                    timeline={timeline}
                    setTimeline={setTimeline}
                    managerNote={managerNote}
                    setManagerNote={setManagerNote}
                    selectedStepCount={selectedStepCount}
                    onBack={() => setStage('evidence')}
                    onActivate={activatePlan}
                  />
                )}
                {stage === 'active' && (
                  <ActiveStage
                    selected={selected}
                    selectedStepCount={selectedStepCount}
                    timeline={timeline}
                    onPreview={() => notify('Share preview prepared — no message sent')}
                    onEdit={() => setStage('plan')}
                  />
                )}
              </div>

              <DecisionContext selected={selected} />
            </div>
          </main>
        </div>
      </div>

      <div
        className={`vp-toast ${toast ? 'is-visible' : ''}`}
        role="status"
        aria-live="polite"
      >
        {toast}
      </div>
    </div>
  )
}

function SignalStage({
  selected,
  onNext,
}: {
  selected: Opportunity
  onNext: () => void
}) {
  return (
    <>
      <section className="vp-section vp-pattern">
        <div className="vp-section__head">
          <span className="vp-section__icon">
            <Icon name="spark" />
          </span>
          <div>
            <span className="vp-eyebrow">Detected performance pattern</span>
            <h3>Commitment clarity is breaking down late in the call.</h3>
          </div>
        </div>
        <p>
          Across the last 14 days, reps frequently ended pricing and proposal
          conversations without agreeing to a specific review date. Deals with this
          pattern moved stages 12% less often than the team baseline.
        </p>
        <div className="vp-metric-row">
          <div>
            <span>Pipeline affected</span>
            <strong>{selected.pipeline}</strong>
          </div>
          <div>
            <span>Stage movement</span>
            <strong className="vp-negative">{selected.change}</strong>
          </div>
          <div>
            <span>Calls analyzed</span>
            <strong>{selected.calls}</strong>
          </div>
          <div>
            <span>Affected reps</span>
            <strong>{selected.affected}</strong>
          </div>
        </div>
      </section>

      <section className="vp-section">
        <div className="vp-section__head vp-section__head--spread">
          <div>
            <span className="vp-eyebrow">Impact assessment</span>
            <h3>Why this deserves attention now</h3>
          </div>
          <span className="vp-confidence">{selected.confidence}% confidence</span>
        </div>
        <div className="vp-impact-grid">
          <article>
            <span>Business risk</span>
            <strong>8 deals</strong>
            <p>Late-stage opportunities with no confirmed mutual next step.</p>
          </article>
          <article>
            <span>Potential recovery</span>
            <strong className="vp-positive">+$320K</strong>
            <p>Open pipeline that can still be influenced this quarter.</p>
          </article>
          <article>
            <span>Pattern strength</span>
            <strong>38 of 45</strong>
            <p>Analyzed calls showed the same commitment gap.</p>
          </article>
        </div>
      </section>

      <div className="vp-next">
        <span>Next: inspect source calls before accepting the recommendation.</span>
        <button className="vp-button vp-button--primary" type="button" onClick={onNext}>
          Review evidence
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </>
  )
}

function EvidenceStage({
  selected,
  playingCall,
  setPlayingCall,
  onBack,
  onNext,
}: {
  selected: Opportunity
  playingCall: string | null
  setPlayingCall: (id: string | null) => void
  onBack: () => void
  onNext: () => void
}) {
  const calls = [
    {
      id: 'acme',
      company: 'Acme Corp · Q3 expansion',
      rep: 'Sarah Jenkins',
      time: '04:12',
      quote: '“I’ll send the proposal over and you can let me know what you think.”',
      issue: 'No date or mutual review commitment secured.',
    },
    {
      id: 'techflow',
      company: 'TechFlow · New logo',
      rep: 'Mike Ross',
      time: '12:45',
      quote: '“Maybe we can reconnect sometime next week.”',
      issue: 'The next action stayed optional and unowned.',
    },
    {
      id: 'northstar',
      company: 'Northstar · Renewal',
      rep: 'Jane Doe',
      time: '27:08',
      quote: '“I can follow up with the revised pricing.”',
      issue: 'Follow-up was promised without confirming buyer participation.',
    },
  ]

  return (
    <>
      <section className="vp-section">
        <div className="vp-section__head vp-section__head--spread">
          <div>
            <span className="vp-eyebrow">Evidence base</span>
            <h3>Review the signal in real conversations.</h3>
          </div>
          <span className="vp-confidence">{selected.calls} calls · Last 14 days</span>
        </div>
        <p className="vp-section__lead">
          Valora highlights the moment supporting the detected pattern. The manager
          decides whether the evidence is sufficient before a plan can be activated.
        </p>
        <div className="vp-evidence-list">
          {calls.map((call) => (
            <article
              className={`vp-call ${playingCall === call.id ? 'is-playing' : ''}`}
              key={call.id}
            >
              <div className="vp-call__meta">
                <span>
                  <strong>{call.company}</strong>
                  <small>{call.rep}</small>
                </span>
                <span>{call.time}</span>
              </div>
              <blockquote>{call.quote}</blockquote>
              <div className="vp-call__finding">
                <span>Observed</span>
                <p>{call.issue}</p>
              </div>
              <button
                type="button"
                className="vp-play"
                onClick={() =>
                  setPlayingCall(playingCall === call.id ? null : call.id)
                }
                aria-pressed={playingCall === call.id}
              >
                <Icon name={playingCall === call.id ? 'check' : 'play'} />
                {playingCall === call.id ? 'Excerpt reviewed' : 'Review excerpt'}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="vp-section vp-evidence-conclusion">
        <span className="vp-section__icon">
          <Icon name="spark" />
        </span>
        <div>
          <span className="vp-eyebrow">Valora assessment</span>
          <h3>
            The evidence supports focused coaching on mutual next-step commitments.
          </h3>
          <p>
            38 call moments show the same behavior. This is a recommendation, not an
            automatic diagnosis.
          </p>
        </div>
      </section>

      <div className="vp-next vp-next--split">
        <button className="vp-button vp-button--secondary" type="button" onClick={onBack}>
          Back to opportunity
        </button>
        <button className="vp-button vp-button--primary" type="button" onClick={onNext}>
          Shape coaching plan
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </>
  )
}

function PlanStage({
  selected,
  steps,
  toggleStep,
  timeline,
  setTimeline,
  managerNote,
  setManagerNote,
  selectedStepCount,
  onBack,
  onActivate,
}: {
  selected: Opportunity
  steps: typeof initialSteps
  toggleStep: (id: string) => void
  timeline: string
  setTimeline: (timeline: string) => void
  managerNote: string
  setManagerNote: (note: string) => void
  selectedStepCount: number
  onBack: () => void
  onActivate: () => void
}) {
  return (
    <>
      <section className="vp-section">
        <div className="vp-section__head">
          <span className="vp-section__icon">
            <Icon name="spark" />
          </span>
          <div>
            <span className="vp-eyebrow">AI-recommended coaching path</span>
            <h3>Closing commitment recovery</h3>
          </div>
        </div>
        <p className="vp-section__lead">
          A four-step path grounded in the reviewed calls. Select or remove the steps
          before anything is shared.
        </p>
        <div className="vp-plan-steps">
          {steps.map((item, index) => (
            <label
              className={`vp-plan-step ${item.selected ? 'is-selected' : ''}`}
              key={item.id}
            >
              <input
                type="checkbox"
                checked={item.selected}
                onChange={() => toggleStep(item.id)}
              />
              <span className="vp-plan-step__number">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>
                <strong>{item.title}</strong>
                <small>{item.detail}</small>
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="vp-section">
        <div className="vp-section__head">
          <div>
            <span className="vp-eyebrow">Manager controls</span>
            <h3>Adapt the recommendation to the person.</h3>
          </div>
        </div>
        <div className="vp-form-grid">
          <label>
            <span>Coaching timeline</span>
            <select value={timeline} onChange={(event) => setTimeline(event.target.value)}>
              <option>14 days</option>
              <option>30 days</option>
              <option>45 days</option>
            </select>
          </label>
          <label>
            <span>Primary focus</span>
            <select defaultValue="Commitment clarity">
              <option>Commitment clarity</option>
              <option>Objection handling</option>
              <option>Value positioning</option>
            </select>
          </label>
        </div>
        <label className="vp-textarea">
          <span>Manager’s private context</span>
          <textarea
            value={managerNote}
            onChange={(event) => setManagerNote(event.target.value)}
            rows={4}
          />
          <small>Private until you choose what to share with the representative.</small>
        </label>
      </section>

      <section className="vp-review">
        <div>
          <span className="vp-eyebrow">Ready for review</span>
          <h3>
            {selectedStepCount} steps · {timeline} · Manager controlled
          </h3>
          <p>
            Activation records the evidence, recommendation, and your edits in the
            decision history for {selected.rep}.
          </p>
        </div>
        <button
          className="vp-button vp-button--primary"
          type="button"
          onClick={onActivate}
          disabled={selectedStepCount === 0}
        >
          Activate coaching plan
          <span aria-hidden="true">→</span>
        </button>
      </section>

      <div className="vp-next">
        <button className="vp-button vp-button--secondary" type="button" onClick={onBack}>
          Back to evidence
        </button>
      </div>
    </>
  )
}

function ActiveStage({
  selected,
  selectedStepCount,
  timeline,
  onPreview,
  onEdit,
}: {
  selected: Opportunity
  selectedStepCount: number
  timeline: string
  onPreview: () => void
  onEdit: () => void
}) {
  return (
    <section className="vp-active-state">
      <span className="vp-active-state__icon">
        <Icon name="check" size={28} />
      </span>
      <span className="vp-eyebrow">Plan activated</span>
      <h3>{selected.rep}’s coaching plan is ready.</h3>
      <p>
        The plan preserves the reviewed evidence, selected steps, and manager context.
        Nothing was sent automatically.
      </p>
      <div className="vp-active-summary">
        <div>
          <span>Coaching path</span>
          <strong>{selectedStepCount} selected steps</strong>
        </div>
        <div>
          <span>Timeline</span>
          <strong>{timeline}</strong>
        </div>
        <div>
          <span>Owner</span>
          <strong>Sarah Miller</strong>
        </div>
        <div>
          <span>Representative</span>
          <strong>{selected.rep}</strong>
        </div>
      </div>
      <div className="vp-active-actions">
        <button className="vp-button vp-button--primary" type="button" onClick={onPreview}>
          Preview before sharing
        </button>
        <button className="vp-button vp-button--secondary" type="button" onClick={onEdit}>
          Edit plan
        </button>
      </div>
    </section>
  )
}

function DecisionContext({ selected }: { selected: Opportunity }) {
  return (
    <aside className="vp-context" aria-label="Decision context">
      <section>
        <span className="vp-eyebrow">Decision record</span>
        <h3>Inspectable by design</h3>
        <dl>
          <div>
            <dt>Signal source</dt>
            <dd>Conversation intelligence</dd>
          </div>
          <div>
            <dt>Evidence window</dt>
            <dd>Last 14 days</dd>
          </div>
          <div>
            <dt>Recommendation confidence</dt>
            <dd>{selected.confidence}%</dd>
          </div>
          <div>
            <dt>Decision owner</dt>
            <dd>Sarah Miller</dd>
          </div>
        </dl>
      </section>
      <section className="vp-context__principle">
        <Icon name="spark" />
        <div>
          <strong>Human control</strong>
          <p>
            Valora can prioritize and recommend. Only the manager can activate, edit,
            or share a coaching plan.
          </p>
        </div>
      </section>
      <section>
        <span className="vp-eyebrow">Outcome guardrail</span>
        <p className="vp-context__copy">
          Progress remains a reviewed update. Valora will not mark improvement from
          activity alone.
        </p>
      </section>
    </aside>
  )
}

export default ProductApp
