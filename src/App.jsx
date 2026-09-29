import { useEffect, useMemo, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Nav, Hero } from './components/Header.jsx';
import { Icons } from './components/Icons.jsx';
import { categories, packageGroups, trustFeatures, steps } from './data/services.js';
import { addLead, loadLeads, updateLead, removeLead, clearLeads, leadMailto } from './lib/leads.js';
import { leadsToCsv, download, openServicesPdf } from './lib/exporters.js';

const ALL = 'all';

const ALL_ITEMS = [
  ...categories.flatMap((c) => c.services.map((s) => ({ id: s.id, title: s.title }))),
  ...packageGroups.flatMap((g) => g.tiers.map((t) => ({ id: t.id, title: t.name }))),
];

export default function App() {
  const [active, setActive] = useState(ALL);
  const [qrOpen, setQrOpen] = useState(true);
  const [sent, setSent] = useState(false);
  const [pendingJump, setPendingJump] = useState(null);
  const [serviceId, setServiceId] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [lastLead, setLastLead] = useState(null);
  const [view, setView] = useState(() =>
    window.location.hash === '#/leads' ? 'leads' : 'site'
  );
  const sectionRefs = useRef({});
  const selectRef = useRef(null);

  const totalServices = useMemo(
    () => categories.reduce((sum, c) => sum + c.services.length, 0),
    []
  );

  const visible = useMemo(
    () => (active === ALL ? categories : categories.filter((c) => c.id === active)),
    [active]
  );

  useEffect(() => {
    if (!pendingJump) return;
    const node = sectionRefs.current[pendingJump];
    if (node) node.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setPendingJump(null);
  }, [pendingJump]);

  useEffect(() => {
    const onHash = () => setView(window.location.hash === '#/leads' ? 'leads' : 'site');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  function selectTab(id) {
    setActive(id);
    if (id !== ALL) setPendingJump(id);
  }

  function jumpTo(id) {
    setActive(id);
    setPendingJump(id);
  }

  function requestItem(id) {
    setServiceId(id);
    setSent(false);
    const node = document.getElementById('start');
    if (node) node.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => selectRef.current && selectRef.current.focus(), 700);
  }

  function browseAndPick() {
    setActive(ALL);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => selectRef.current && selectRef.current.focus(), 700);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const item = ALL_ITEMS.find((i) => i.id === serviceId);
    const lead = addLead({
      serviceId: item ? item.id : null,
      serviceTitle: item ? item.title : 'General enquiry',
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      message: form.message.trim(),
    });
    setLastLead(lead);
    setSent(true);
  }

  function resetForm() {
    setSent(false);
    setLastLead(null);
    setForm({ name: '', email: '', phone: '', message: '' });
    setServiceId('');
  }

  if (view === 'leads') {
    return <LeadsView />;
  }

  const siteUrl = window.location.href.split('#')[0];

  return (
    <>
      <Nav onJump={jumpTo} />
      <main>
        <Hero totalServices={totalServices} totalCategories={categories.length} />

        <div className="tabs-wrap">
          <div className="container">
            <div className="tabs" role="tablist" aria-label="Filter services by category">
              <button
                role="tab"
                aria-selected={active === ALL}
                className={`tab ${active === ALL ? 'tab--active' : ''}`}
                onClick={() => setActive(ALL)}
              >
                All services <span className="tab__count">{totalServices}</span>
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={active === c.id}
                  className={`tab ${active === c.id ? 'tab--active' : ''}`}
                  onClick={() => selectTab(c.id)}
                >
                  {c.name} <span className="tab__count">{c.services.length}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {visible.map((cat, i) => (
          <section
            key={cat.id}
            id={cat.id}
            ref={(node) => {
              sectionRefs.current[cat.id] = node;
            }}
            className={`section ${i % 2 === 1 ? 'section--band' : ''}`}
            style={{ scrollMarginTop: 120 }}
          >
            <div className="container">
              <div className="cat-head">
                <div className="cat-head__row">
                  <span className="tag">
                    Category {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="caption">{cat.services.length} services</span>
                </div>
                <h2 className="subheading">{cat.name}</h2>
                <p className="body-lg">{cat.intro}</p>
              </div>

              <div className="grid">
                {cat.services.map((svc) => (
                  <ServiceCard key={svc.id} service={svc} onRequest={requestItem} />
                ))}
              </div>
            </div>
          </section>
        ))}

        <section
          className="section section--band"
          id="packages"
          style={{ scrollMarginTop: 80 }}
        >
          <div className="container">
            <div className="cat-head">
              <div className="cat-head__row">
                <span className="tag">Bundled packages</span>
                <span className="caption">{packageGroups.length} package groups</span>
              </div>
              <h2 className="subheading">Fixed-scope packages, ready to pick.</h2>
              <p className="body-lg">
                Prefer a bundle over a single service? These packages combine branding, web, social,
                and growth work into one fixed scope — each with everything listed, so you know
                exactly what is included.
              </p>
            </div>

            {packageGroups.map((group) => (
              <div key={group.id} id={group.id} style={{ scrollMarginTop: 120, marginBottom: 'var(--spacing-48)' }}>
                <div className="cat-head" style={{ marginBottom: 'var(--spacing-24)' }}>
                  <div className="cat-head__row">
                    <span className="tag">
                      Package {group.num}: {group.name}
                    </span>
                  </div>
                </div>
                <div className="grid">
                  {group.tiers.map((tier) => (
                    <PackageCard key={tier.id} tier={tier} onRequest={requestItem} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="cat-head">
              <span className="eyebrow">Why this list</span>
              <h2 className="heading">No vague retainers.</h2>
            </div>
            <div className="features">
              {trustFeatures.map((f) => {
                const Icon = Icons[f.icon];
                return (
                  <div className="feature" key={f.title}>
                    <span className="feature__icon">
                      <Icon size={24} />
                    </span>
                    <h3 className="feature__title">{f.title}</h3>
                    <p className="feature__body">{f.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section section--dark" id="start" style={{ scrollMarginTop: 80 }}>
          <div className="container">
            <div className="cat-head">
              <span className="tag tag--on-dark">How we start</span>
              <h2 className="heading" style={{ color: 'var(--color-lime-voltage)' }}>
                Four steps to a signed scope.
              </h2>
            </div>
            <div className="steps">
              {steps.map((s) => (
                <div className="step" key={s.num}>
                  <span className="step__num">{s.num}</span>
                  <h3 className="step__title">{s.title}</h3>
                  <p className="step__body">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--wash">
          <div className="container">
            <div className="cta">
              <div>
                <h2 className="cta__title">Pick a service. We send the quote.</h2>
                <p className="cta__body" style={{ marginTop: 'var(--spacing-16)' }}>
                  Tell us which number from this list you want, and we will come back with a fixed
                  deliverable list, timeline, and price — usually within one working day.
                </p>
              </div>

              <div className="cta__inset">
                {sent && lastLead ? (
                  <div className="quote-done">
                    <span className="quote-done__icon">
                      <Icons.check size={28} />
                    </span>
                    <h3 className="quote-done__title">Request received</h3>
                    <p className="quote-done__body">
                      <strong>{lastLead.serviceTitle}</strong>
                      {lastLead.name ? ` — thanks ${lastLead.name}` : ''}. We’ll reply to{' '}
                      {lastLead.email} with scope, timeline, and price within one working day.
                    </p>
                    <div className="quote-done__actions">
                      <a className="btn btn--primary btn--sm" href={leadMailto(lastLead)}>
                        Also email it now <Icons.arrow size={16} />
                      </a>
                      <button className="link-underline" type="button" onClick={resetForm}>
                        Send another request
                      </button>
                    </div>
                    <p className="cta__note">
                      Your request is saved on this device too — the studio inbox above keeps a copy
                      until you export it.
                    </p>
                  </div>
                ) : (
                  <form className="quote-form" onSubmit={handleSubmit}>
                    <div className="picker">
                      <span className="picker__flag">P</span>
                      <div>
                        <div className="picker__name">Phox Digital Studio</div>
                        <div className="picker__meta">GCC &amp; India · Remote-first</div>
                      </div>
                      <button
                        type="button"
                        className="btn btn--outline btn--sm picker__change"
                        onClick={browseAndPick}
                      >
                        Change service
                      </button>
                    </div>

                    <select
                      ref={selectRef}
                      className="field"
                      value={serviceId}
                      onChange={(e) => setServiceId(e.target.value)}
                      aria-label="Service you want"
                      required
                    >
                      <option value="" disabled>
                        Which service do you need?
                      </option>
                      {categories.map((cat) => (
                        <optgroup key={cat.id} label={cat.name}>
                          {cat.services.map((s) => (
                            <option key={s.id} value={s.id}>
                              {String(s.num).padStart(2, '0')} · {s.title}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                      {packageGroups.map((g) => (
                        <optgroup key={g.id} label={g.name}>
                          {g.tiers.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>

                    <input
                      className="field"
                      type="text"
                      placeholder="Your name"
                      aria-label="Your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />

                    <div className="cta__form-row">
                      <input
                        className="field"
                        style={{ flex: 1, minWidth: 150 }}
                        type="email"
                        required
                        placeholder="Work email"
                        aria-label="Work email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                      <input
                        className="field"
                        style={{ flex: 1, minWidth: 130 }}
                        type="tel"
                        placeholder="Phone (optional)"
                        aria-label="Phone"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>

                    <textarea
                      className="field quote-form__message"
                      rows={3}
                      placeholder="Anything specific? Timeline, budget, links…"
                      aria-label="Message"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />

                    <button className="btn btn--primary" type="submit">
                      Send request <Icons.arrow size={16} />
                    </button>
                    <p className="cta__note">
                      No retainer talk. You get an itemised quote for the service you picked.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer
        categories={categories}
        onServiceClick={jumpTo}
        onDownloadPdf={() => openServicesPdf(categories, packageGroups)}
      />

      {qrOpen && (
        <aside className="qr" aria-label="Phox services PDF">
          <button className="qr__close" onClick={() => setQrOpen(false)} aria-label="Dismiss">
            &times;
          </button>
          <a
            className="qr__code"
            href={siteUrl}
            target="_blank"
            rel="noreferrer"
            title="Open this page on your phone"
          >
            <QRCodeSVG value={siteUrl} size={96} bgColor="#ffffff" fgColor="#163300" level="M" />
          </a>
          <span className="qr__label">Scan to open this list on your phone</span>
          <button
            className="btn btn--primary btn--sm qr__pdf"
            type="button"
            onClick={() => openServicesPdf(categories, packageGroups)}
          >
            Save as PDF
          </button>
        </aside>
      )}
    </>
  );
}

function ServiceCard({ service, onRequest }) {
  const Icon = Icons[service.icon] ?? Icons.check;
  return (
    <article className="card" id={service.id}>
      <div className="card__top">
        <span className="card__icon">
          <Icon size={24} />
        </span>
        <span className="card__num">{String(service.num).padStart(2, '0')}</span>
      </div>

      <div>
        <h3 className="card__title">{service.title}</h3>
        {service.note && (
          <span className="caption" style={{ display: 'block', marginTop: 4 }}>
            {service.note}
          </span>
        )}
      </div>

      <p className="card__desc">{service.what}</p>

      <div>
        <div className="card__label" style={{ marginBottom: 8 }}>
          Deliverables
        </div>
        <ul className="card__list">
          {service.deliverables.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>

      <div className="card__foot">
        <span>Ideal for</span>
        <strong>{service.idealFor}</strong>
      </div>

      <button className="btn btn--outline btn--sm card__cta" type="button" onClick={() => onRequest(service.id)}>
        Request a quote <Icons.arrow size={16} />
      </button>
    </article>
  );
}

function PackageCard({ tier, onRequest }) {
  return (
    <article className="card" id={tier.id}>
      <div className="card__top">
        <span className="card__title" style={{ fontSize: 'var(--text-body-lg)' }}>
          {tier.name}
        </span>
        {tier.popular && (
          <span className="tag tag--ink" style={{ marginLeft: 'auto' }}>
            Most Popular
          </span>
        )}
      </div>

      <p className="card__desc">{tier.for}</p>

      <div>
        <div className="card__label" style={{ marginBottom: 8 }}>
          Includes
        </div>
        <ul className="card__list">
          {tier.includes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <button className="btn btn--outline btn--sm card__cta" type="button" onClick={() => onRequest(tier.id)}>
        Request a quote <Icons.arrow size={16} />
      </button>
    </article>
  );
}

function Footer({ categories, onServiceClick, onDownloadPdf }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <a className="brand" href="#top" style={{ color: 'var(--color-lime-voltage)' }}>
              <span className="brand__mark" style={{ background: 'var(--color-lime-voltage)' }}>
                <i style={{ background: 'var(--color-forest-ink)' }} />
              </span>
              Phox
            </a>
            <p className="caption" style={{ marginTop: 16, maxWidth: '34ch' }}>
              A digital marketing studio covering brand identity, web and digital build, and growth
              marketing for businesses in the GCC and India.
            </p>
          </div>

          {categories.map((cat) => (
            <div key={cat.id}>
              <div className="footer__title">{cat.name}</div>
              <ul className="footer__list">
                {cat.services.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} onClick={() => onServiceClick && onServiceClick(cat.id)}>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <span>© 2026 Phox Digital. All services listed are fixed-scope.</span>
          <span className="footer__actions">
            <button className="footer__action" type="button" onClick={onDownloadPdf}>
              Download services PDF
            </button>
            <a className="footer__action" href="#/leads">
              Studio inbox
            </a>
            <a className="footer__action" href="mailto:hello@phox.digital">
              hello@phox.digital
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

const STATUS_COLORS = {
  new: 'var(--color-lime-voltage)',
  contacted: 'var(--color-signal-blue)',
  won: 'var(--color-spruce)',
  lost: 'var(--color-alarm-red)',
};

function LeadsView() {
  const [leads, setLeads] = useState(() => loadLeads());
  const [filter, setFilter] = useState('all');

  const shown = useMemo(
    () => (filter === 'all' ? leads : leads.filter((l) => l.status === filter)),
    [leads, filter]
  );

  const counts = useMemo(() => {
    const c = { all: leads.length, new: 0, contacted: 0, won: 0, lost: 0 };
    leads.forEach((l) => {
      c[l.status] = (c[l.status] || 0) + 1;
    });
    return c;
  }, [leads]);

  function setStatus(id, status) {
    setLeads(updateLead(id, { status }));
  }

  function deleteLead(id) {
    setLeads(removeLead(id));
  }

  function exportCsv() {
    download(
      `phox-leads-${new Date().toISOString().slice(0, 10)}.csv`,
      leadsToCsv(leads),
      'text/csv'
    );
  }

  function wipe() {
    if (window.confirm('Delete every saved lead on this device? This cannot be undone.')) {
      setLeads(clearLeads());
    }
  }

  return (
    <div className="inbox">
      <header className="nav">
        <div className="container nav__inner">
          <a className="brand" href="#top">
            <span className="brand__mark">
              <i />
            </span>
            Phox
          </a>
          <span className="inbox__title">Studio inbox</span>
          <div className="nav__actions">
            <button className="btn btn--outline btn--sm" type="button" onClick={exportCsv} disabled={!leads.length}>
              Export CSV
            </button>
            <a className="btn btn--primary btn--sm" href="#top">
              Back to site
            </a>
          </div>
        </div>
      </header>

      <main className="container inbox__main">
        <div className="inbox__head">
          <h1 className="subheading">Quote requests</h1>
          <p className="body-sm inbox__sub">
            Every request submitted from the services page is stored in this browser. Mark status,
            email the client, or export the list when you move it to your CRM.
          </p>
        </div>

        <div className="tabs inbox__tabs" role="tablist" aria-label="Filter leads">
          {['all', 'new', 'contacted', 'won', 'lost'].map((s) => (
            <button
              key={s}
              role="tab"
              aria-selected={filter === s}
              className={`tab ${filter === s ? 'tab--active' : ''}`}
              onClick={() => setFilter(s)}
            >
              {s === 'all' ? 'All' : s[0].toUpperCase() + s.slice(1)}{' '}
              <span className="tab__count">{counts[s] || 0}</span>
            </button>
          ))}
        </div>

        {shown.length === 0 ? (
          <div className="empty">
            <p>
              <strong>No {filter === 'all' ? '' : filter + ' '}requests yet.</strong>
            </p>
            <p style={{ marginTop: 8 }}>
              Submit the quote form on the services page and it will land here.{' '}
              <a href="#top" className="link-underline">
                Go back and try one
              </a>
              .
            </p>
          </div>
        ) : (
          <ul className="inbox__list">
            {shown.map((l) => (
              <li key={l.id} className="lead">
                <div className="lead__main">
                  <div className="lead__row">
                    <strong className="lead__service">{l.serviceTitle}</strong>
                    <span
                      className="lead__status"
                      style={{ background: STATUS_COLORS[l.status] || 'var(--color-fog)' }}
                    >
                      {l.status}
                    </span>
                  </div>
                  <p className="lead__meta">
                    {l.name || 'Anonymous'} · {l.email}
                    {l.phone ? ` · ${l.phone}` : ''} ·{' '}
                    {new Date(l.createdAt).toLocaleString()}
                  </p>
                  {l.message && <p className="lead__msg">{l.message}</p>}
                </div>
                <div className="lead__actions">
                  <a className="btn btn--outline btn--sm" href={leadMailto(l)}>
                    Email client
                  </a>
                  <select
                    className="field field--sm"
                    value={l.status}
                    onChange={(e) => setStatus(l.id, e.target.value)}
                    aria-label="Lead status"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                  </select>
                  <button className="link-underline lead__del" type="button" onClick={() => deleteLead(l.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {leads.length > 0 && (
          <p className="inbox__foot">
            <button className="link-underline" type="button" onClick={wipe}>
              Clear all leads on this device
            </button>
          </p>
        )}
      </main>
    </div>
  );
}
