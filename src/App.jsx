import { useEffect, useMemo, useState } from 'react';
import {
  Activity, ArrowLeft, Bell, Bot, CheckCircle2, ChevronRight, CircleUserRound,
  ClipboardList, Clock3, CreditCard, Github, Globe2, LayoutDashboard, MapPin,
  MessageCircle, PackageCheck, Plus, RotateCcw, Search, Send, ShieldCheck,
  Sparkles, Truck, UsersRound, X,
} from 'lucide-react';
import { calculatePrice, drivers, seedJobs, smartParseOrder, vehicles } from './data.js';
import { copy } from './i18n.js';

const STORAGE_KEY = 'autochemix-os-demo-v1';
const statusOrder = ['new', 'assigned', 'on_the_way', 'arrived', 'completed'];

function readJobs() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : seedJobs;
  } catch {
    return seedJobs;
  }
}

function App() {
  const [lang, setLang] = useState('en');
  const [view, setView] = useState('home');
  const [jobs, setJobs] = useState(readJobs);
  const [createOpen, setCreateOpen] = useState(false);
  const [chatJobId, setChatJobId] = useState(null);
  const t = copy[lang];

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs)), [jobs]);

  const updateJob = (id, patch) => setJobs((current) => current.map((job) => (job.id === id ? { ...job, ...patch } : job)));
  const resetDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    setJobs(seedJobs);
  };

  const shellProps = { lang, setLang, t, view, setView, resetDemo };

  return (
    <div className="app-shell">
      {view === 'home' && <Landing {...shellProps} />}
      {view === 'dispatcher' && (
        <Dispatcher {...shellProps} jobs={jobs} updateJob={updateJob} setCreateOpen={setCreateOpen} setChatJobId={setChatJobId} />
      )}
      {view === 'driver' && <DriverPortal {...shellProps} jobs={jobs} updateJob={updateJob} setChatJobId={setChatJobId} />}
      {view === 'customer' && <CustomerTracking {...shellProps} jobs={jobs} updateJob={updateJob} />}
      {view === 'about' && <AboutProject {...shellProps} />}

      {createOpen && <CreateOrderModal t={t} onClose={() => setCreateOpen(false)} onCreate={(job) => setJobs((current) => [job, ...current])} />}
      {chatJobId && (
        <ChatModal
          t={t}
          job={jobs.find((job) => job.id === chatJobId)}
          onClose={() => setChatJobId(null)}
          onUpdate={(messages) => updateJob(chatJobId, { messages })}
        />
      )}
    </div>
  );
}

function Topbar({ lang, setLang, t, setView, compact = false }) {
  return (
    <header className={`topbar ${compact ? 'topbar-compact' : ''}`}>
      <button className="brand-button" onClick={() => setView('home')} aria-label="Autochemix OS home">
        <span className="brand-icon"><Truck size={22} /></span>
        <span><b>{t.app}</b><small>{t.subtitle}</small></span>
      </button>
      <div className="top-actions">
        <span className="demo-pill"><span /> {t.demo}</span>
        <button className="ghost-button" onClick={() => setLang(lang === 'en' ? 'ru' : 'en')}><Globe2 size={17} /> {lang.toUpperCase()}</button>
      </div>
    </header>
  );
}

function Landing({ lang, setLang, t, setView }) {
  const capabilities = [
    [Activity, t.realtime], [Sparkles, t.smart], [ShieldCheck, t.proof], [Globe2, t.languages],
  ];
  return (
    <main className="landing">
      <Topbar lang={lang} setLang={setLang} t={t} setView={setView} />
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15} /> {t.builtFrom}</div>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroText}</p>
          <div className="hero-buttons">
            <button className="primary-button" onClick={() => setView('dispatcher')}>{t.openDispatcher}<ChevronRight size={18} /></button>
            <button className="secondary-button" onClick={() => setView('driver')}>{t.openDriver}</button>
            <button className="text-button" onClick={() => setView('customer')}>{t.trackOrder}</button>
          </div>
          <div className="capability-grid">
            {capabilities.map(([Icon, label]) => <div key={label}><Icon size={19} /><span>{label}</span></div>)}
          </div>
        </div>
        <DashboardPreview t={t} />
      </section>
      <section className="project-strip">
        <div><span>01</span><b>Dispatcher operations</b><p>Orders, pricing, assignment and fleet overview.</p></div>
        <div><span>02</span><b>Driver execution</b><p>Route status, chat and delivery evidence.</p></div>
        <div><span>03</span><b>Customer visibility</b><p>Live timeline, support and feedback.</p></div>
      </section>
      <footer className="landing-footer">
        <span>{t.by}</span>
        <div><button onClick={() => setView('about')}>{t.about}</button><a href="https://github.com/Gek2or/Autochemix-" target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a></div>
      </footer>
    </main>
  );
}

function DashboardPreview({ t }) {
  return (
    <div className="preview-window" aria-label="Dispatcher dashboard preview">
      <div className="preview-toolbar"><span /><span /><span /><small>dispatch.autochemix.demo</small></div>
      <div className="preview-body">
        <div className="preview-sidebar"><div className="preview-logo"><Truck size={18} /></div>{[LayoutDashboard, ClipboardList, UsersRound, CreditCard].map((Icon, index) => <i key={index}><Icon size={17} /></i>)}</div>
        <div className="preview-content">
          <div className="preview-heading"><div><small>{t.dashboard}</small><b>{t.liveOps}</b></div><button><Plus size={13} /> {t.newOrder}</button></div>
          <div className="preview-stats"><span><small>{t.activeJobs}</small><b>2</b></span><span><small>{t.pending}</small><b>1</b></span><span><small>{t.available}</small><b>2</b></span></div>
          <div className="preview-order"><i><PackageCheck size={18} /></i><span><b>Demo Customer A</b><small>Demo Hub A → Demo Hub B</small></span><em>{t.on_the_way}</em><strong>€300</strong></div>
          <div className="preview-map"><span className="road road-one"/><span className="road road-two"/><i className="van-one"><Truck size={13} /></i><i className="van-two"><Truck size={13} /></i><small>{t.simulated}</small></div>
        </div>
      </div>
    </div>
  );
}

function WorkspaceHeader({ lang, setLang, t, setView, title, subtitle, resetDemo, action }) {
  return (
    <>
      <Topbar lang={lang} setLang={setLang} t={t} setView={setView} compact />
      <div className="workspace-heading">
        <div><button className="back-button" onClick={() => setView('home')}><ArrowLeft size={16} /> {t.roleSwitch}</button><h1>{title}</h1><p>{subtitle}</p></div>
        <div className="workspace-actions"><button className="ghost-button" onClick={resetDemo}><RotateCcw size={16} /> {t.reset}</button>{action}</div>
      </div>
    </>
  );
}

function Dispatcher({ lang, setLang, t, setView, resetDemo, jobs, updateJob, setCreateOpen, setChatJobId }) {
  const activeCount = jobs.filter((job) => job.status !== 'completed').length;
  const completedCount = jobs.filter((job) => job.status === 'completed').length;
  const pendingCount = jobs.filter((job) => job.status === 'new').length;
  const assign = (job) => updateJob(job.id, { status: 'assigned', driverId: 'd1', driverName: 'Demo Driver 01' });
  return (
    <main className="workspace">
      <WorkspaceHeader lang={lang} setLang={setLang} t={t} setView={setView} resetDemo={resetDemo} title={t.dashboard} subtitle={t.subtitle} action={<button className="primary-button small" onClick={() => setCreateOpen(true)}><Plus size={17} /> {t.newOrder}</button>} />
      <section className="stats-grid">
        <Stat icon={Activity} label={t.activeJobs} value={activeCount} tone="cyan" />
        <Stat icon={Clock3} label={t.pending} value={pendingCount} tone="amber" />
        <Stat icon={CheckCircle2} label={t.completed} value={completedCount} tone="green" />
        <Stat icon={UsersRound} label={t.available} value={drivers.filter((driver) => driver.available).length} tone="violet" />
      </section>
      <section className="dashboard-grid">
        <div className="panel operations-panel">
          <div className="panel-heading"><div><span className="live-dot" /> <h2>{t.liveOps}</h2></div><span>{jobs.length} {t.jobs.toLowerCase()}</span></div>
          <div className="job-list">
            {jobs.map((job) => <JobCard key={job.id} job={job} t={t} onChat={() => setChatJobId(job.id)} onAssign={() => assign(job)} />)}
          </div>
        </div>
        <aside className="side-stack">
          <FleetMap t={t} />
          <div className="panel activity-panel"><div className="panel-heading"><h2>{t.recentActivity}</h2><Bell size={17} /></div><ActivityItem color="green" title="MX-2048" text={t.on_the_way} time="09:12"/><ActivityItem color="cyan" title="MX-3172" text={t.newOrder} time="09:05"/><ActivityItem color="violet" title="MX-1735" text={t.jobCompleted} time="Yesterday"/></div>
        </aside>
      </section>
    </main>
  );
}

function Stat({ icon: Icon, label, value, tone }) {
  return <div className={`stat-card tone-${tone}`}><div><span>{label}</span><b>{value}</b></div><i><Icon size={21} /></i></div>;
}

function JobCard({ job, t, onChat, onAssign }) {
  return (
    <article className="job-card">
      <div className="job-icon"><PackageCheck size={21} /></div>
      <div className="job-main"><div className="job-title"><div><b>{job.customerName}</b><small>{job.id}</small></div><StatusBadge status={job.status} t={t} /></div><div className="route"><span><MapPin size={14}/>{job.pickupAddress}</span><ChevronRight size={15}/><span>{job.dropoffAddress}</span></div><div className="job-meta"><span><UsersRound size={14}/> {job.movers} {t.movers.toLowerCase()}</span><span><Truck size={14}/> {job.driverName || t.pending}</span></div></div>
      <div className="job-price"><b>€{job.price}</b><small>{t.price}</small><div><button className="icon-button" onClick={onChat} aria-label={t.chat}><MessageCircle size={17}/></button>{job.status === 'new' && <button className="assign-button" onClick={onAssign}>{t.dispatch}</button>}</div></div>
    </article>
  );
}

function StatusBadge({ status, t }) {
  const label = status === 'completed' ? t.jobCompleted : t[status];
  return <span className={`status-badge status-${status}`}>{label}</span>;
}

function FleetMap({ t }) {
  return <div className="panel fleet-panel"><div className="panel-heading"><h2>{t.fleetMap}</h2><MapPin size={17}/></div><div className="map-canvas"><span className="map-road r1"/><span className="map-road r2"/><span className="map-road r3"/><i className="map-van mv1"><Truck size={14}/></i><i className="map-van mv2"><Truck size={14}/></i><i className="map-van mv3 offline"><Truck size={14}/></i><small>{t.simulated}</small></div></div>;
}

function ActivityItem({ color, title, text, time }) {
  return <div className="activity-item"><i className={color}/><div><b>{title}</b><span>{text}</span></div><small>{time}</small></div>;
}

function DriverPortal({ lang, setLang, t, setView, resetDemo, jobs, updateJob, setChatJobId }) {
  const assignedJobs = jobs.filter((job) => job.driverId === 'd1');
  const activeJob = assignedJobs.find((job) => job.status !== 'completed');
  const nextStatus = activeJob ? { assigned: 'on_the_way', new: 'on_the_way', on_the_way: 'arrived', arrived: 'completed' }[activeJob.status] : null;
  const nextLabel = activeJob ? { assigned: t.startRoute, new: t.startRoute, on_the_way: t.markArrived, arrived: t.completeDelivery }[activeJob.status] : null;
  const evidence = activeJob?.evidence || { photo: false, signature: false };
  return (
    <main className="workspace driver-workspace">
      <WorkspaceHeader lang={lang} setLang={setLang} t={t} setView={setView} resetDemo={resetDemo} title={t.driverPortal} subtitle="Demo Driver 01 · Standard Van 15m³" />
      <div className="driver-layout">
        <section className="driver-phone">
          <div className="driver-phone-header"><div><span className="avatar"><CircleUserRound size={28}/></span><span><small>{t.duty}</small><b>Demo Driver 01</b></span></div><i className="online-toggle"><span/></i></div>
          {activeJob ? <div className="active-route"><div className="active-route-top"><StatusBadge status={activeJob.status} t={t}/><small>{activeJob.id}</small></div><h2>{activeJob.customerName}</h2><div className="route-stops"><div><i/><span><small>{t.pickup}</small><b>{activeJob.pickupAddress}</b></span></div><div><i/><span><small>{t.dropoff}</small><b>{activeJob.dropoffAddress}</b></span></div></div><div className="driver-job-meta"><span><small>{t.price}</small><b>€{activeJob.price}</b></span><span><small>{t.movers}</small><b>{activeJob.movers}</b></span></div><button className="secondary-button full" onClick={() => setChatJobId(activeJob.id)}><MessageCircle size={17}/> {t.chat}</button>{activeJob.status === 'arrived' && <div className="evidence-grid"><button className={evidence.photo ? 'done' : ''} onClick={() => updateJob(activeJob.id, { evidence: { ...evidence, photo: true } })}><PackageCheck size={18}/>{evidence.photo ? t.saved : t.addPhoto}</button><button className={evidence.signature ? 'done' : ''} onClick={() => updateJob(activeJob.id, { evidence: { ...evidence, signature: true } })}><ShieldCheck size={18}/>{evidence.signature ? t.saved : t.addSignature}</button></div>}{nextStatus && <button className="primary-button full route-action" disabled={activeJob.status === 'arrived' && (!evidence.photo || !evidence.signature)} onClick={() => updateJob(activeJob.id, { status: nextStatus })}>{nextLabel}<ChevronRight size={18}/></button>}</div> : <div className="empty-state"><CheckCircle2 size={46}/><h2>{t.noJob}</h2></div>}
        </section>
        <aside className="driver-side"><div className="panel"><div className="panel-heading"><h2>{t.upcoming}</h2><Clock3 size={17}/></div>{assignedJobs.filter((job) => job.id !== activeJob?.id).map((job) => <div className="queue-job" key={job.id}><span><b>{job.customerName}</b><small>{job.pickupAddress}</small></span><StatusBadge status={job.status} t={t}/></div>)}</div><div className="driver-note"><Bot size={25}/><div><b>Operations assistant</b><p>Status changes update the dispatcher and customer views immediately in this demo.</p></div></div></aside>
      </div>
    </main>
  );
}

function CustomerTracking({ lang, setLang, t, setView, resetDemo, jobs, updateJob }) {
  const [input, setInput] = useState('MX-2048');
  const [activeId, setActiveId] = useState('MX-2048');
  const [rating, setRating] = useState(5);
  const job = jobs.find((item) => item.id.toLowerCase() === activeId.trim().toLowerCase());
  const currentIndex = job ? statusOrder.indexOf(job.status) : -1;
  return (
    <main className="customer-page">
      <WorkspaceHeader lang={lang} setLang={setLang} t={t} setView={setView} resetDemo={resetDemo} title={t.tracking} subtitle={t.trackingText} />
      <section className="tracking-layout">
        <div className="tracking-search panel"><label htmlFor="order-search">{t.orderId}</label><div><input id="order-search" value={input} onChange={(event) => setInput(event.target.value)} placeholder="MX-2048"/><button className="primary-button small" onClick={() => setActiveId(input)}><Search size={17}/>{t.search}</button></div><small>{t.tryIds}</small></div>
        {!job ? <div className="panel empty-state"><Search size={38}/><h2>{t.notFound}</h2></div> : <div className="tracking-content"><div className="tracking-summary panel"><div><small>{t.currentStatus}</small><h2>{job.status === 'completed' ? t.jobCompleted : t[job.status]}</h2><p>{job.pickupAddress} → {job.dropoffAddress}</p></div><div className="tracking-price"><small>{t.estimatedTotal}</small><b>€{job.price}</b></div></div><div className="panel timeline-panel"><div className="panel-heading"><h2>Delivery timeline</h2><span>{job.id}</span></div><div className="timeline">{statusOrder.map((status, index) => <div className={`${index < currentIndex ? 'past' : ''} ${index === currentIndex ? 'current' : ''}`} key={status}><i>{index < currentIndex ? <CheckCircle2 size={17}/> : <span/>}</i><div><b>{status === 'completed' ? t.jobCompleted : t[status]}</b><small>{index <= currentIndex ? 'Status confirmed' : 'Waiting for update'}</small></div></div>)}</div></div><div className="tracking-details panel"><div><span><small>{t.assignedDriver}</small><b>{job.driverName || t.pending}</b></span><span><small>{t.pickup}</small><b>{job.pickupAddress}</b></span><span><small>{t.dropoff}</small><b>{job.dropoffAddress}</b></span></div>{job.status === 'completed' && <div className="rating-box"><b>{job.rating ? t.thankYou : t.feedback}</b>{!job.rating && <><div>{[1,2,3,4,5].map((star) => <button key={star} onClick={() => setRating(star)} className={star <= rating ? 'selected' : ''}>★</button>)}</div><button className="secondary-button" onClick={() => updateJob(job.id, { rating })}>{t.submitRating}</button></>}</div>}</div></div>}
      </section>
    </main>
  );
}

function AboutProject({ lang, setLang, t, setView }) {
  return <main className="about-page"><Topbar lang={lang} setLang={setLang} t={t} setView={setView}/><section><button className="back-button" onClick={() => setView('home')}><ArrowLeft size={16}/>{t.roleSwitch}</button><div className="eyebrow"><Github size={15}/>{t.githubReady}</div><h1>{t.projectTitle}</h1><p>{t.projectText}</p><div className="tech-grid">{['JavaScript','React','Vite','CSS','localStorage demo adapter','Firebase production path','Gemini production path','GitHub Pages'].map((item) => <span key={item}>{item}</span>)}</div><div className="next-box"><span><Sparkles size={21}/></span><div><b>{t.productionNext}</b><p>Firebase configuration · server-side AI endpoint · secure RBAC · real maps/GPS · stored delivery evidence · invoice generation · automated tests.</p></div></div></section></main>;
}

function CreateOrderModal({ t, onClose, onCreate }) {
  const initial = { customerName: '', phone: '', pickupAddress: '', dropoffAddress: '', vehicleId: 'standard', movers: 2, hours: 3, distanceZone: 'local', trailer: false, packing: false, heavy: false };
  const [form, setForm] = useState(initial);
  const [smartText, setSmartText] = useState('');
  const price = useMemo(() => calculatePrice(form), [form]);
  const field = (name, value) => setForm((current) => ({ ...current, [name]: value }));
  const parse = () => setForm((current) => ({ ...current, ...smartParseOrder(smartText) }));
  const submit = (event) => {
    event.preventDefault();
    const job = { ...form, id: `MX-${Math.floor(1000 + Math.random() * 8999)}`, price, status: 'new', driverId: null, driverName: null, createdAt: new Date().toISOString(), evidence: { photo: false, signature: false }, messages: [] };
    onCreate(job); onClose();
  };
  return <div className="modal-backdrop"><div className="modal order-modal"><div className="modal-heading"><div><span><Sparkles size={18}/></span><h2>{t.createTitle}</h2></div><button onClick={onClose}><X size={20}/></button></div><form onSubmit={submit}><div className="smart-box"><label>{t.smartAutofill}</label><textarea value={smartText} onChange={(event) => setSmartText(event.target.value)} placeholder={t.smartHint}/><button type="button" className="secondary-button" onClick={parse} disabled={!smartText.trim()}><Sparkles size={16}/>{t.recognize}</button></div><div className="form-grid"><Field label={t.customerName} value={form.customerName} onChange={(value) => field('customerName', value)} required/><Field label={t.phone} value={form.phone} onChange={(value) => field('phone', value)} required/><Field label={t.pickup} value={form.pickupAddress} onChange={(value) => field('pickupAddress', value)} required wide/><Field label={t.dropoff} value={form.dropoffAddress} onChange={(value) => field('dropoffAddress', value)} required wide/><label><span>{t.vehicle}</span><select value={form.vehicleId} onChange={(event) => field('vehicleId', event.target.value)}>{vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.name} · €{vehicle.hourlyRate}/h</option>)}</select></label><Field label={t.movers} type="number" min="1" max="6" value={form.movers} onChange={(value) => field('movers', Number(value))}/><Field label={t.hours} type="number" min="1" step="0.5" value={form.hours} onChange={(value) => field('hours', Number(value))}/><label><span>{t.zone}</span><select value={form.distanceZone} onChange={(event) => field('distanceZone', event.target.value)}><option value="local">{t.local}</option><option value="regional">{t.regional}</option><option value="national">{t.national}</option></select></label></div><div className="checkbox-row">{[['trailer',t.trailer],['packing',t.packing],['heavy',t.heavy]].map(([name,label]) => <label key={name}><input type="checkbox" checked={form[name]} onChange={(event) => field(name, event.target.checked)}/><span>{label}</span></label>)}</div><div className="estimate-row"><div><small>{t.estimateNote}</small></div><span><small>{t.estimated}</small><b>€{price}</b></span></div><div className="modal-actions"><button type="button" className="ghost-button" onClick={onClose}>{t.cancel}</button><button type="submit" className="primary-button">{t.create}<ChevronRight size={17}/></button></div></form></div></div>;
}

function Field({ label, value, onChange, wide, ...props }) {
  return <label className={wide ? 'wide' : ''}><span>{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} {...props}/></label>;
}

function ChatModal({ t, job, onClose, onUpdate }) {
  const [text, setText] = useState('');
  if (!job) return null;
  const send = (event) => { event.preventDefault(); if (!text.trim()) return; onUpdate([...(job.messages || []), { id: Date.now(), sender: 'Demo user', text: text.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]); setText(''); };
  return <div className="modal-backdrop"><div className="modal chat-modal"><div className="modal-heading"><div><span><MessageCircle size={18}/></span><h2>{t.chat} · {job.id}</h2></div><button onClick={onClose}><X size={20}/></button></div><div className="messages">{(job.messages || []).length === 0 ? <div className="empty-messages">No messages yet.</div> : job.messages.map((message) => <div key={message.id} className="message"><small>{message.sender} · {message.time}</small><p>{message.text}</p></div>)}</div><form className="chat-form" onSubmit={send}><input value={text} onChange={(event) => setText(event.target.value)} placeholder={t.typeMessage}/><button className="primary-button small" type="submit"><Send size={16}/>{t.send}</button></form></div></div>;
}

export default App;
