import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  GraduationCap,
  History,
  LayoutDashboard,
  MessageSquareText,
  Mic2,
  Phone,
  Play,
  Plus,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type Screen = 'dashboard' | 'opportunity' | 'plan' | 'session'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, screen: 'dashboard' as Screen },
  { label: 'Performance', icon: TrendingUp },
  { label: 'Coaching', icon: GraduationCap, screen: 'plan' as Screen },
  { label: 'Calls', icon: Phone },
  { label: 'QA Reviews', icon: ClipboardCheck },
  { label: 'Activity', icon: History },
]

function ProductApp() {
  const [screen, setScreen] = useState<Screen>('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [progressOpen, setProgressOpen] = useState(false)
  const [toast, setToast] = useState('')

  const navigate = (next: Screen) => {
    setScreen(next)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  return (
    <div className="valora-app">
      <a className="valora-skip" href="#product-main">
        Skip to main content
      </a>
      <Sidebar
        current={screen}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={navigate}
        onNotify={notify}
      />
      {menuOpen && (
        <button
          className="mobile-backdrop"
          type="button"
          onClick={() => setMenuOpen(false)}
          aria-label="Close navigation"
        />
      )}
      <div className="product-shell">
        <Topbar
          screen={screen}
          onMenu={() => setMenuOpen(true)}
          onNavigate={navigate}
          onNotify={notify}
        />
        <main id="product-main">
          {screen === 'dashboard' && <Dashboard onNavigate={navigate} />}
          {screen === 'opportunity' && <Opportunity onNavigate={navigate} />}
          {screen === 'plan' && <PlanBuilder onNavigate={navigate} onNotify={notify} />}
          {screen === 'session' && (
            <CoachingSession
              onComplete={() => setProgressOpen(true)}
              onNotify={notify}
            />
          )}
        </main>
      </div>
      {progressOpen && <ProgressModal onClose={() => setProgressOpen(false)} />}
      <div className={`product-toast ${toast ? 'is-visible' : ''}`} role="status">
        {toast}
      </div>
    </div>
  )
}

function Sidebar({
  current,
  open,
  onClose,
  onNavigate,
  onNotify,
}: {
  current: Screen
  open: boolean
  onClose: () => void
  onNavigate: (screen: Screen) => void
  onNotify: (message: string) => void
}) {
  const coachingActive = current === 'opportunity' || current === 'plan' || current === 'session'
  return (
    <aside className={`product-sidebar ${open ? 'is-open' : ''}`} aria-label="Primary navigation">
      <div className="sidebar-mobile-head">
        <strong>Navigation</strong>
        <button type="button" onClick={onClose} aria-label="Close navigation">
          <X size={22} />
        </button>
      </div>
      <button className="valora-wordmark" type="button" onClick={() => onNavigate('dashboard')}>
        <strong>Valora</strong>
        <span>Performance Intelligence</span>
      </button>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive =
            (item.screen === 'dashboard' && current === 'dashboard') ||
            (item.label === 'Coaching' && coachingActive)
          return (
            <button
              key={item.label}
              type="button"
              className={isActive ? 'is-active' : ''}
              aria-current={isActive ? 'page' : undefined}
              onClick={() =>
                item.screen
                  ? onNavigate(item.screen)
                  : onNotify(`${item.label} is planned for the next product sprint`)
              }
            >
              <item.icon size={22} strokeWidth={1.8} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
      <div className="sidebar-footer">
        <button type="button" onClick={() => onNotify('Settings are planned for the next sprint')}>
          <Settings size={22} />
          <span>Settings</span>
        </button>
        <button type="button" onClick={() => onNotify('Profile controls are planned for the next sprint')}>
          <UserRound size={22} />
          <span>User profile</span>
        </button>
      </div>
    </aside>
  )
}

function Topbar({
  screen,
  onMenu,
  onNavigate,
  onNotify,
}: {
  screen: Screen
  onMenu: () => void
  onNavigate: (screen: Screen) => void
  onNotify: (message: string) => void
}) {
  const crumbs =
    screen === 'dashboard'
      ? ['Dashboard']
      : screen === 'opportunity'
        ? ['Dashboard', 'Closing Skills Decline']
        : screen === 'plan'
          ? ['Coaching', 'Closing Skills Decline', 'Action plan builder']
          : ['Coaching', 'Closing Skills Decline', 'Action plan builder', 'Coaching Session']

  return (
    <header className="product-topbar">
      <button className="mobile-wordmark" type="button" onClick={onMenu} aria-label="Open navigation">
        <span>V</span>
        Valora
      </button>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        {crumbs.map((crumb, index) => (
          <span key={crumb}>
            {index > 0 && <ChevronRight size={18} aria-hidden="true" />}
            <button
              type="button"
              aria-current={index === crumbs.length - 1 ? 'page' : undefined}
              onClick={() => {
                if (crumb === 'Dashboard') onNavigate('dashboard')
                if (crumb === 'Coaching') onNavigate('plan')
                if (crumb === 'Closing Skills Decline') onNavigate('opportunity')
              }}
            >
              {crumb}
            </button>
          </span>
        ))}
      </nav>
      <div className="topbar-actions">
        <button type="button" aria-label="Notifications" onClick={() => onNotify('You’re all caught up')}>
          <Bell size={22} />
        </button>
        <button type="button" aria-label="Help" onClick={() => onNotify('Help center is planned for the next sprint')}>
          <CircleHelp size={22} />
        </button>
        <span className="user-dot">SM</span>
      </div>
    </header>
  )
}

function Dashboard({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  return (
    <div className="screen screen-dashboard">
      <section className="screen-intro">
        <h1>Dashboard Overview</h1>
        <p>
          Your team is showing strong KPI attainment, but focused coaching in closing
          skills is required for 3 key representatives.
        </p>
      </section>

      <section className="metric-grid" aria-label="Team performance overview">
        <MetricCard label="Overall" value="84" suffix="/100" icon={<ShieldCheck size={19} />} tone="bars" />
        <MetricCard label="KPI Attainment" value="92%" icon={<Target size={19} />} tone="progress" />
        <MetricCard label="Coaching Impact" value="82%" suffix="High Impact" icon={<Activity size={19} />} tone="impact" />
        <MetricCard label="QA Health" value="A-" suffix="Avg Score: 9.2/10" icon={<ClipboardCheck size={19} />} tone="grade" />
      </section>

      <section className="dashboard-section">
        <div className="section-heading-row">
          <div>
            <h2>Priority Coaching Opportunities</h2>
            <p>Prioritized based on revenue impact, trend severity, and team-wide risk.</p>
          </div>
          <button type="button">View All</button>
        </div>
        <OpportunityCard
          impact="HIGH IMPACT"
          risk="REVENUE RISK"
          title="Closing Skills Decline"
          description="Win rate dropped 15% in last 3 weeks. Competitor mentions handled poorly on recent calls."
          rep="Jane Doe"
          role="AE · West Coast"
          initials="JD"
          evidence="12 calls analyzed · $1.2M pipeline affected"
          recommendation="Schedule objection handling review and roleplay session focused on ‘AcmeCorp’ comparisons."
          onNavigate={onNavigate}
        />
        <OpportunityCard
          impact="MEDIUM IMPACT"
          risk="AFFECTS 3 REPS"
          title="Discovery Call Adherence"
          description="Skipping BANT qualification questions in 40% of initial calls this week based on conversation analysis."
          rep="John Smith"
          role="SDR · EMEA"
          initials="JS"
          evidence="10 calls analyzed · 3 representatives affected"
          recommendation="Assign the ‘Effective Discovery’ micro-learning module."
          onNavigate={onNavigate}
          secondary
        />
      </section>

      <section className="dashboard-lower-grid">
        <Panel className="outcomes-panel">
          <div className="section-heading-row compact">
            <div>
              <h2>Coaching Progress vs Outcomes</h2>
              <p>Correlation between active coaching plans and targeted metric improvement.</p>
            </div>
            <button type="button">View Details</button>
          </div>
          <div className="chart-wrap">
            <svg viewBox="0 0 700 220" role="img" aria-label="Coaching outcomes trending upward">
              <path className="chart-axis" d="M20 18v180h660" />
              <path className="chart-line" d="M20 188C160 180 250 142 342 96c106-53 199-84 338-50" />
              <path className="chart-line muted" d="M20 198c160-6 270-40 380-76 100-32 180-48 280-76" />
            </svg>
          </div>
          <ProgressBar label="Q4 Objection Handling Cohort" value={75} detail="12/16 reps completed" />
          <ProgressBar label="New Hire Onboarding (Nov)" value={40} detail="Modules 1 & 2 active" />
        </Panel>
        <Panel className="insights-panel">
          <span className="subtle-label">Since last visit</span>
          <h2>Performance Insights Feed</h2>
          <p>Detected shifts in team performance patterns.</p>
          <div className="insight-list">
            <Insight icon={<ArrowUpRight />} tone="good" title="Team Talk Ratio Improved" text="Average talk time decreased to 42% (Target: <45%)." />
            <Insight icon={<ArrowDownRight />} tone="bad" title="Next Steps Adherence Declined" text="Clear next steps established in only 68% of calls." />
            <Insight icon={<Sparkles />} tone="blue" title="New Pattern: Pricing Resistance" text="Competitor mentions increased by 30% in pricing discussions." />
          </div>
        </Panel>
      </section>
    </div>
  )
}

function MetricCard({
  label,
  value,
  suffix,
  icon,
  tone,
}: {
  label: string
  value: string
  suffix?: string
  icon: React.ReactNode
  tone: 'bars' | 'progress' | 'impact' | 'grade'
}) {
  return (
    <Panel className={`metric-card metric-card--${tone}`}>
      <div className="metric-label">
        <span>{label}</span>
        {icon}
      </div>
      <div className="metric-value">
        <strong>{value}</strong>
        {suffix && <span>{suffix}</span>}
      </div>
      {tone === 'bars' && <div className="mini-bars"><i /><i /><i /><i /><i /></div>}
      {tone === 'progress' && <div className="metric-progress"><i /></div>}
      {tone !== 'grade' && (
        <p className="positive-copy">
          <ArrowUpRight size={16} />
          {tone === 'bars' ? '+18% growth' : tone === 'progress' ? '+4% vs last month' : '+12% vs previous period'}
        </p>
      )}
    </Panel>
  )
}

function OpportunityCard({
  impact,
  risk,
  title,
  description,
  rep,
  role,
  initials,
  evidence,
  recommendation,
  onNavigate,
  secondary,
}: {
  impact: string
  risk: string
  title: string
  description: string
  rep: string
  role: string
  initials: string
  evidence: string
  recommendation: string
  onNavigate: (screen: Screen) => void
  secondary?: boolean
}) {
  return (
    <article className={`opportunity-card ${secondary ? 'is-secondary' : ''}`}>
      <div className="opportunity-copy">
        <div className="tag-row">
          <span className={secondary ? 'tag medium' : 'tag high'}>{impact}</span>
          <span className="tag neutral">{risk}</span>
        </div>
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="evidence-line">
          <strong>Evidence</strong>
          <span>{evidence}</span>
        </div>
        <div className="recommendation-line">
          <Sparkles size={20} />
          <div>
            <strong>Recommended Action</strong>
            <span>{recommendation}</span>
          </div>
        </div>
      </div>
      <div className="opportunity-actions">
        <div className="person-row">
          <span className="avatar">{initials}</span>
          <span>
            <strong>{rep}</strong>
            <small>{role}</small>
          </span>
        </div>
        <div>
          <button className="button primary" type="button" onClick={() => onNavigate('opportunity')}>
            Generate insight
          </button>
          <button className="button outline" type="button" onClick={() => onNavigate('opportunity')}>
            View Details
          </button>
        </div>
      </div>
    </article>
  )
}

function Opportunity({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  return (
    <div className="screen opportunity-screen">
      <section className="opportunity-hero">
        <div>
          <div className="tag-row">
            <span className="tag high">HIGH IMPACT</span>
            <span className="tag neutral">REVENUE RISK</span>
            <span className="tag active"><i /> ACTIVE</span>
          </div>
          <h1>Closing Skills Decline</h1>
          <p>Win-rate decline detected in late-stage conversations affecting revenue outcomes.</p>
        </div>
        <button className="button primary large" type="button" onClick={() => onNavigate('plan')}>
          Create Coaching Plan
        </button>
      </section>

      <div className="opportunity-layout">
        <div className="opportunity-main">
          <section>
            <h2>Impact Assessment</h2>
            <div className="impact-cards">
              <SmallMetric label="Win Rate Decline" value="24%" change="−15%" danger />
              <SmallMetric label="Pipeline Affected" value="$1.2M" />
              <SmallMetric label="Deals at Risk" value="8" />
              <SmallMetric label="Potential Recovery" value="+$320K" good />
            </div>
          </section>

          <Panel className="pattern-panel">
            <div className="panel-title-icon">
              <Sparkles size={28} />
              <h2>Detected Performance Pattern</h2>
            </div>
            <p>
              Over the last 14 days, the team’s close rate has dropped by 12% in the
              final negotiation stage. Analysis of 45 late-stage calls indicates a
              consistent failure to secure clear next steps before ending the call,
              leading to stalled deals.
            </p>
            <div className="pattern-metrics">
              <div><span>Impacted Pipeline</span><strong>$1.2M</strong></div>
              <div><span>Win Rate Drop</span><strong className="danger-copy">−12%</strong></div>
              <div><span>Calls Analyzed</span><strong>45</strong></div>
              <div><span>Affected Reps</span><strong>6</strong></div>
            </div>
          </Panel>

          <section className="evidence-base">
            <h2>Evidence Base</h2>
            <Panel>
              <h3>Pattern Evidence</h3>
              <div className="evidence-stat">
                <span>38/45 analyzed calls</span>
                <small>Detected in 38/45 analyzed calls</small>
              </div>
            </Panel>
            <Panel className="call-evidence">
              <h3>Real Call Evidence</h3>
              <CallRow company="Acme Corp · Q3 Expansion" issue="Pricing discussed before value confirmation" rep="Sarah Jenkins" time="04:12" />
              <CallRow company="TechFlow Inc · New Logo" issue="Next step left open-ended" rep="Mike Ross" time="12:45" />
            </Panel>
          </section>
        </div>

        <aside className="opportunity-aside">
          <Panel>
            <div className="detail-row"><strong>Status</strong><span><i className="red-dot" /> Open Issue</span></div>
            <div className="detail-person"><span className="avatar">JD</span><span><strong>Jane Doe</strong><small>Enterprise AE</small></span></div>
            <div className="detail-person"><span className="avatar outline-avatar">SM</span><span><strong>Sarah Manager</strong><small>Manager · Owner</small></span></div>
            <span className="aside-label">Affected Reps (3)</span>
            <div className="avatar-stack"><span>SJ</span><span>MR</span><span>AT</span></div>
          </Panel>
          <Panel className="recommended-plan">
            <h2>Recommended Coaching Plan</h2>
            <strong className="plan-name">Objection Handling Recovery</strong>
            <label><input type="checkbox" defaultChecked /> Review highlighted call snippets.</label>
            <label><input type="checkbox" defaultChecked /> Draft feedback on securing micro-commitments.</label>
            <label><input type="checkbox" defaultChecked /> Schedule a 15-minute roleplay session.</label>
            <span className="aside-label">Suggested Timeline</span>
            <div className="timeline-row"><CalendarDays size={18} /> Within 7 days</div>
            <button className="button outline" type="button"><Plus size={18} /> Add Custom Step</button>
            <button className="button primary" type="button" onClick={() => onNavigate('plan')}>Create Coaching Plan</button>
          </Panel>
        </aside>
      </div>
    </div>
  )
}

function SmallMetric({
  label,
  value,
  change,
  danger,
  good,
}: {
  label: string
  value: string
  change?: string
  danger?: boolean
  good?: boolean
}) {
  return (
    <Panel className="small-metric">
      <span>{label}</span>
      <strong className={good ? 'positive-copy' : ''}>{value}</strong>
      {change && <small className={danger ? 'danger-copy' : ''}>{change}</small>}
    </Panel>
  )
}

function CallRow({ company, issue, rep, time }: { company: string; issue: string; rep: string; time: string }) {
  return (
    <div className="call-row">
      <div>
        <strong>{company}</strong>
        <span>{issue}</span>
        <small>Rep: {rep}</small>
      </div>
      <span>{time}</span>
      <button type="button" aria-label={`Play ${company} call excerpt`}><Play size={17} /></button>
    </div>
  )
}

function PlanBuilder({
  onNavigate,
  onNotify,
}: {
  onNavigate: (screen: Screen) => void
  onNotify: (message: string) => void
}) {
  const [pace, setPace] = useState('Accelerated Recovery (3hr/wk)')
  return (
    <div className="screen plan-screen">
      <div className="plan-layout">
        <div className="plan-main">
          <section className="plan-heading">
            <div className="draft-row"><span>DRAFT</span><small>Last saved 2m ago</small></div>
            <h1>Closing Skills Recovery Plan</h1>
            <p>Structured coaching intervention for <strong>Jane Doe</strong></p>
            <div className="plan-heading-actions">
              <button className="button primary" type="button" onClick={() => onNavigate('session')}>Activate Coaching Plan</button>
              <button className="button outline" type="button" onClick={() => onNotify('Draft saved')}>Save Progress</button>
            </div>
          </section>

          <Panel className="snapshot-panel">
            <div className="panel-heading"><h2>Performance Snapshot</h2><BarChart3 size={21} /></div>
            <div className="snapshot-grid">
              <SmallMetric label="Late-stage Conversion" value="−14%" change="vs Team Benchmark (32%)" danger />
              <SmallMetric label="Stalled Stages" value="62%" change="Pipeline loss at ‘Negotiation’" />
              <SmallMetric label="Business Impact" value="$182K" change="Projected recovery potential" good />
            </div>
            <div className="pattern-callout"><Sparkles size={22} /><p><strong>Detected Performance Pattern:</strong> Late-stage conversations show hesitation when moving from value discussion into commitment confirmation.</p></div>
          </Panel>

          <section className="coaching-path">
            <div className="path-title"><Sparkles size={25} /><h2>Recommended Coaching Path</h2></div>
            <div className="path-grid">
              <PathCard number="01" title="Self-Assessment" text="Review 3 flagged calls from the last week." complete />
              <PathCard number="02" title="Guided Practice" text="Practice handling the ‘Legal Review’ objection." active />
              <PathCard number="03" title="Apply in Calls" text="Manager shadows the ACME Corp closing call." />
              <PathCard number="04" title="Impact Review" text="Review progress and align on next steps." />
            </div>
          </section>

          <Panel className="controls-panel">
            <h2>Customization Controls</h2>
            <div className="controls-grid">
              <label>
                <span>Coaching Pace</span>
                <select value={pace} onChange={(event) => setPace(event.target.value)}>
                  <option>Accelerated Recovery (3hr/wk)</option>
                  <option>Standard Pace (2hr/wk)</option>
                  <option>Light Touch (1hr/wk)</option>
                </select>
              </label>
              <div>
                <span>Focus Topics</span>
                <div className="topic-row"><b>Objection Handling</b><b>Value Multipliers</b><button type="button">+ Add Topic</button></div>
              </div>
            </div>
            <label className="notes-label">
              <span>Coaching Context (Manager’s Private Notes)</span>
              <textarea defaultValue="Mention Jane’s success in Q2 to maintain positive momentum during this transition..." />
            </label>
          </Panel>

          <Panel className="transparency-panel">
            <div className="panel-title-icon"><MessageSquareText size={24} /><div><h2>Growth Alignment & Transparency</h2><p>Ensuring clarity between development goals and performance monitoring.</p></div></div>
            <div className="transparency-grid">
              <div><span>Coaching Evidence View</span><ol><li>Pricing timing</li><li>Commitment clarity</li><li>Competitor response</li></ol><small>Evidence source: 45 calls · Last 30 days</small></div>
              <div><span>Rep Growth View</span><strong>Current Focus: Value-Based Negotiation</strong><p className="positive-copy">Strengths: Discovery quality, customer engagement</p><p className="danger-copy">Improvement: Value positioning, competitor confidence</p></div>
            </div>
          </Panel>
        </div>

        <aside className="plan-aside">
          <Panel>
            <h2>Impact Tracker</h2>
            <span className="aside-label">Linked Plan: Closing Skills Recovery</span>
            <ProgressBar label="Current Closing Skill" value={64} detail="64" />
            <ProgressBar label="Target Skill Level" value={80} detail="80" dark />
            <div className="tracker-row"><span>Timeline</span><strong>30 Days</strong></div>
            <div className="tracker-row"><span>Potential Upside</span><strong>+$24K/mo</strong></div>
          </Panel>
          <Panel>
            <div className="panel-heading"><h2>Next Actions</h2><span className="count-badge">3</span></div>
            <label className="task-row"><input type="checkbox" /> <span><strong>Schedule session</strong><small>Due tomorrow</small></span></label>
            <label className="task-row"><input type="checkbox" /> <span><strong>Share plan with Jane</strong><small>Immediate action</small></span></label>
            <label className="task-row"><input type="checkbox" /> <span><strong>Set review date</strong><small>30-day milestone</small></span></label>
            <button className="button outline" type="button"><Plus size={18} /> Add Custom Task</button>
          </Panel>
        </aside>
      </div>
    </div>
  )
}

function PathCard({ number, title, text, active, complete }: { number: string; title: string; text: string; active?: boolean; complete?: boolean }) {
  return (
    <article className={`path-card ${active ? 'is-active' : ''} ${complete ? 'is-complete' : ''}`}>
      <span>{complete ? <Check size={18} /> : number}</span>
      <strong>{title}</strong>
      <p>{text}</p>
    </article>
  )
}

function CoachingSession({
  onComplete,
  onNotify,
}: {
  onComplete: () => void
  onNotify: (message: string) => void
}) {
  const [practiceStarted, setPracticeStarted] = useState(false)
  return (
    <div className="screen session-screen">
      <div className="session-layout">
        <div className="session-main">
          <Panel className="session-intro">
            <div className="event-label"><CalendarDays size={22} /> <strong>COACHING SESSION</strong></div>
            <h1>Improve value positioning before pricing conversations.</h1>
            <strong>Jane Doe + Sarah Manager · 1:1 Coaching Session</strong>
            <p>Focusing on establishing clear ROI metrics and identifying core business pain points early in the discovery phase.</p>
          </Panel>

          <Panel className="growth-panel">
            <div className="number-title"><span>1</span><h2>Shared Growth Alignment</h2><b>ALIGNED</b></div>
            <div className="growth-grid">
              <div><h3 className="positive-copy">Strengths</h3><ul><li>Strong rapport building in first 5 minutes.</li><li>Clear articulation of feature sets.</li></ul></div>
              <div><h3 className="danger-copy">Growth Areas</h3><ul><li>Quantifying the cost of inaction.</li><li>Delaying pricing until value is confirmed.</li></ul></div>
            </div>
          </Panel>

          <Panel className="call-review-panel">
            <div className="panel-heading"><div className="call-review-title"><button type="button" aria-label="Play call review"><Play size={20} /></button><h2>Call Review: Acme Corp Demo</h2></div><span className="timecode">04:12 / 15:30</span></div>
            <div className="waveform" aria-hidden="true">{Array.from({ length: 16 }).map((_, index) => <i key={index} />)}</div>
            <div className="transcript-card">
              <p><strong>Prospect:</strong><span>“It sounds interesting, but we’re mainly concerned about implementation time disrupting current ops.”</span></p>
              <p><strong>Alex:</strong><span>“Yeah, implementation can take a bit. But once it’s up, it’s pretty smooth. We offer onboarding support.”</span></p>
              <div className="coaching-moment"><Sparkles size={20} /><p><em>Coaching Moment Detected to anchor value.</em><strong>Pattern:</strong> Conversation moved toward solution before business impact was confirmed.<strong>Try:</strong> “What impact would solving this have on your team?”<strong>Why:</strong> <em>Value connection improves negotiation strength.</em></p></div>
            </div>
          </Panel>

          <Panel className="practice-panel">
            <div className="number-title"><span>3</span><h2>Applied Practice</h2></div>
            <div className={`roleplay-card ${practiceStarted ? 'is-started' : ''}`}>
              <Mic2 size={40} />
              <strong>{practiceStarted ? 'Practice in progress' : 'Roleplay: Customer asks for discount'}</strong>
              <span>Skill Focus: Value Positioning</span>
              <div><h3>Success Criteria</h3><p>✓ Confirm business impact</p><p>✓ Avoid early discounting</p><p>✓ Create urgency before pricing discussion</p></div>
              <button className="button primary" type="button" onClick={() => setPracticeStarted((value) => !value)}>{practiceStarted ? 'Pause Practice' : 'Start Practice'}</button>
            </div>
          </Panel>

          <Panel className="commitments-panel">
            <button type="button" onClick={() => onNotify('Action items saved')}>
              <span>Action Items & Commitments</span>
              <ChevronDown size={26} />
            </button>
          </Panel>
          <button className="button primary complete-session" type="button" onClick={onComplete}>Complete Coaching Session</button>
        </div>

        <aside className="assistant-panel">
          <div className="assistant-heading"><Sparkles size={27} /><h2>Reflection Assistant</h2></div>
          <p>Contextually aware intelligence for your coaching session.</p>
          <Panel>
            <span className="aside-label blue">Current Context: Call Review</span>
            <h3>Suggested Conversation Starters for Alex:</h3>
            <div className="starter"><strong>Explore:</strong><p>“What changed when the conversation moved toward pricing?”</p></div>
            <div className="starter"><strong>Reflect:</strong><p>“How could we connect pricing back to business goals?”</p></div>
            <button type="button" onClick={() => onNotify('Conversation starter added to notes')}>Add to Notes</button>
          </Panel>
          <Panel>
            <span className="aside-label blue">Journey Context</span>
            <dl><div><dt>Connected Goal</dt><dd>Closing Skills Recovery</dd></div><div><dt>Current Stage</dt><dd>Guided Practice</dd></div><div><dt>Next Stage</dt><dd>Apply in Calls</dd></div></dl>
            <div className="competency"><span>Discovery Flow <b>Proficient</b></span><i><em style={{ width: '75%' }} /></i></div>
            <div className="competency"><span><strong>Value Anchoring (Focus)</strong><b>Developing</b></span><i><em style={{ width: '48%' }} /></i></div>
          </Panel>
        </aside>
      </div>
    </div>
  )
}

function ProgressModal({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab' && dialogRef.current) {
        const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button,input'))
        if (!items.length) return
        const first = items[0]
        const last = items[items.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    dialogRef.current?.querySelector<HTMLElement>('button')?.focus()
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
      previous?.focus()
    }
  }, [onClose])

  return (
    <div className="progress-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="progress-dialog" role="dialog" aria-modal="true" aria-labelledby="progress-title" ref={dialogRef}>
        <header><span><ShieldCheck size={27} /><h2 id="progress-title">Coaching Progress Updated</h2></span><button type="button" onClick={onClose} aria-label="Close progress update"><X size={24} /></button></header>
        <div className="progress-body">
          <section><h3>Completed Activities</h3><ul className="completed-list"><li><CheckCircle2 /> Practice session completed</li><li><CheckCircle2 /> 5 customer conversations reviewed</li><li><CheckCircle2 /> Manager feedback provided</li></ul></section>
          <section><h3>Observed Changes</h3><div className="observed-grid"><div><span>Value Before Pricing</span><strong><ArrowUpRight /> +35%</strong></div><div><span>Early Discount Behavior</span><strong><ArrowDownRight /> −18%</strong></div><div><span>Next-Step Clarity</span><strong><ArrowUpRight /> +22%</strong></div></div></section>
          <div className="ai-reflection"><Sparkles /><p><strong>AI Reflection</strong>“Jane is showing stronger value framing behavior. Continue reinforcement before expanding focus areas.”</p></div>
          <section className="recommendation-updates"><h3>Future Recommendations Updated</h3><label><input type="checkbox" defaultChecked /><span>Jane’s skill profile updated<small>Value positioning confidence increased</small></span></label><label><input type="checkbox" /><span>Coaching focus adjusted<small>Reduced priority on pricing objections</small></span></label><label><input type="checkbox" /><span>Team patterns refreshed<small>Added successful behavior examples</small></span></label><span className="aside-label">Manager Review</span><p>Sarah confirmed these updates before applying changes.</p></section>
        </div>
        <footer><button className="button primary" type="button" onClick={onClose}>Done</button></footer>
      </div>
    </div>
  )
}

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`panel ${className}`}>{children}</section>
}

function ProgressBar({ label, value, detail, dark }: { label: string; value: number; detail: string; dark?: boolean }) {
  return (
    <div className="progress-item">
      <div><span>{label}</span><strong>{detail}</strong></div>
      <i><em className={dark ? 'dark' : ''} style={{ width: `${value}%` }} /></i>
    </div>
  )
}

function Insight({ icon, tone, title, text }: { icon: React.ReactNode; tone: string; title: string; text: string }) {
  return (
    <div className={`insight ${tone}`}>
      {icon}
      <div><strong>{title}</strong><p>{text}</p></div>
    </div>
  )
}

export default ProductApp
