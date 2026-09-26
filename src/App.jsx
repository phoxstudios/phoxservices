import { useEffect, useMemo, useRef, useState } from 'react';
import { Nav, Hero } from './components/Header.jsx';
import { Icons } from './components/Icons.jsx';
import { categories, packageGroups, trustFeatures, steps } from './data/services.js';

const ALL = 'all';

export default function App() {
  const [active, setActive] = useState(ALL);
  const [qrOpen, setQrOpen] = useState(true);
  const [sent, setSent] = useState(false);
  const [pendingJump, setPendingJump] = useState(null);
  const sectionRefs = useRef({});

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

  function selectTab(id) {
    setActive(id);
    if (id !== ALL) setPendingJump(id);
  }

  function jumpTo(id) {
    setActive(id);
    setPendingJump(id);
  }

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
                {cat.services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
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
                    <PackageCard key={tier.id} tier={tier} />
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
                <div className="picker">
                  <span className="picker__flag">P</span>
                  <div>
                    <div className="picker__name">Phox Digital Studio</div>
                    <div className="picker__meta">GCC &amp; India · Remote-first</div>
                  </div>
                  <a className="btn btn--outline btn--sm picker__change" href="#branding">
                    Change service
                  </a>
                </div>

                <select className="field" defaultValue="" aria-label="Service you want">
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
                </select>

                <form
                  className="cta__form-row"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                >
                  <input
                    className="field"
                    style={{ flex: 1, minWidth: 180 }}
                    type="email"
                    required
                    placeholder="Work email"
                    aria-label="Work email"
                  />
                  <button className="btn btn--primary" type="submit">
                    {sent ? 'Received' : 'Send request'}
                  </button>
                </form>
                <p className="cta__note">
                  {sent
                    ? 'Thanks — we\u2019ll reply with scope, timeline, and price within one working day.'
                    : 'No retainer talk. You get an itemised quote for the service you picked.'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer categories={categories} onServiceClick={jumpTo} />

      {qrOpen && (
        <aside className="qr" aria-label="Phox services PDF">
          <button className="qr__close" onClick={() => setQrOpen(false)} aria-label="Dismiss">
            &times;
          </button>
          <div className="qr__code">
            <Qr />
          </div>
          <span className="qr__label">Send this list to your team</span>
        </aside>
      )}
    </>
  );
}

function ServiceCard({ service }) {
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
    </article>
  );
}

function PackageCard({ tier }) {
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
    </article>
  );
}

function Footer({ categories, onServiceClick }) {
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
          <span>
            <a href="mailto:hello@phox.digital">hello@phox.digital</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

function Qr() {
  const cells = [];
  const n = 11;
  for (let y = 0; y < n; y += 1) {
    for (let x = 0; x < n; x += 1) {
      const finder =
        (x < 3 && y < 3) || (x > n - 4 && y < 3) || (x < 3 && y > n - 4);
      const on = finder ? (x % 2 === 0 || y % 2 === 0) : (x * 7 + y * 13) % 3 === 0;
      if (on) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
    }
  }
  return (
    <svg viewBox="0 0 11 11" width="100%" style={{ fill: '#163300' }} aria-hidden="true">
      {cells}
    </svg>
  );
}
