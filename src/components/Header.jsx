import { Icons } from './Icons.jsx';

export function Nav({ onJump }) {
  return (
    <header className="nav">
      <div className="container nav__inner">
        <a className="brand" href="#top">
          <span className="brand__mark">
            <i />
          </span>
          Phox
        </a>
        <nav className="nav__links" aria-label="Service categories">
          <a className="nav__link" href="#branding" onClick={() => onJump && onJump('branding')}>
            Branding
          </a>
          <a className="nav__link" href="#web" onClick={() => onJump && onJump('web')}>
            Web &amp; Digital
          </a>
          <a className="nav__link" href="#growth" onClick={() => onJump && onJump('growth')}>
            Growth
          </a>
          <a className="nav__link" href="#packages">
            Packages
          </a>
        </nav>
        <div className="nav__actions">
          <a className="nav__link" href="mailto:hello@phox.digital">
            Contact
          </a>
          <a className="btn btn--outline btn--sm" href="#start">
            Get a quote
          </a>
        </div>
      </div>
    </header>
  );
}

export function Hero({ totalServices, totalCategories }) {
  return (
    <section className="hero" id="top">
      <div className="container hero__inner">
        <span className="tag tag--ink">Services list — 2026</span>
        <h1 className="display hero__headline">Everything we make for you</h1>
        <p className="body-lg hero__lede">
          {totalServices} services across {totalCategories} disciplines — branding, web, and growth
          marketing. Every one of them listed below with its deliverables, so you know exactly what you
          are buying before you ever send an email.
        </p>
        <div className="hero__actions">
          <a className="btn btn--primary" href="#start">
            Start a project <Icons.arrow size={18} />
          </a>
          <a className="link-underline" href="#branding">
            Browse all services
          </a>
        </div>
        <div className="hero__stats">
          <div className="stat">
            <span className="stat__num">{totalServices}</span>
            <span className="stat__label">Services</span>
          </div>
          <div className="stat">
            <span className="stat__num">{totalCategories}</span>
            <span className="stat__label">Categories</span>
          </div>
          <div className="stat">
            <span className="stat__num">50+</span>
            <span className="stat__label">Deliverables</span>
          </div>
          <div className="stat">
            <span className="stat__num">GCC / India</span>
            <span className="stat__label">Markets served</span>
          </div>
        </div>
        <Globe />
      </div>
    </section>
  );
}

function Globe() {
  return (
    <svg className="globe" viewBox="0 0 420 240" aria-hidden="true">
      <defs>
        <clipPath id="ball">
          <circle cx="210" cy="120" r="96" />
        </clipPath>
      </defs>
      <ellipse cx="210" cy="228" rx="118" ry="10" fill="#e8ebe6" />
      <circle cx="210" cy="120" r="96" fill="#163300" />
      <g clipPath="url(#ball)" fill="none" stroke="#9fe870" strokeOpacity="0.5" strokeWidth="1.5">
        <ellipse cx="210" cy="120" rx="34" ry="96" />
        <ellipse cx="210" cy="120" rx="70" ry="96" />
        <path d="M114 92h192M114 120h192M114 148h192" />
      </g>
      <g clipPath="url(#ball)">
        <path d="M150 78c22-10 44 4 60-6s38 2 44 18-16 26-6 40-6 30-28 26-34-16-52-8-32-10-26-28-4-34 8-42z" fill="#054d28" />
        <path d="M244 150c16-6 30 6 26 20s-22 14-30 6-12-20 4-26z" fill="#054d28" />
      </g>
      <g fill="#9fe870">
        <circle cx="312" cy="72" r="15" />
        <circle cx="336" cy="104" r="9" />
      </g>
      <g fill="#163300" fontFamily="Inter, sans-serif" fontWeight="900" textAnchor="middle">
        <text x="312" y="77" fontSize="14">
          $
        </text>
        <text x="336" y="108" fontSize="9">
          $
        </text>
      </g>
    </svg>
  );
}
