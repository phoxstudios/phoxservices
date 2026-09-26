const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function Svg({ children, size = 24, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...base} {...rest}>
      {children}
    </svg>
  );
}

export const Icons = {
  brand: (p) => (
    <Svg {...p}>
      <path d="M12 3l2.4 5.1 5.6.8-4.1 3.9 1 5.6-4.9-2.7-4.9 2.7 1-5.6L4 8.9l5.6-.8z" />
    </Svg>
  ),
  kit: (p) => (
    <Svg {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18M7 15h5" />
    </Svg>
  ),
  package: (p) => (
    <Svg {...p}>
      <path d="M12 3l8 4.2v9.6L12 21l-8-4.2V7.2z" />
      <path d="M4 7.2l8 4.3 8-4.3M12 11.5V21" />
    </Svg>
  ),
  brochure: (p) => (
    <Svg {...p}>
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M15 3v4h4M9 12h6M9 16h6" />
    </Svg>
  ),
  web: (p) => (
    <Svg {...p}>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M3 9h18M7 14h4" />
    </Svg>
  ),
  cart: (p) => (
    <Svg {...p}>
      <path d="M4 5h3l2 10h8l2-7H8" />
      <circle cx="10" cy="19" r="1.4" />
      <circle cx="17" cy="19" r="1.4" />
    </Svg>
  ),
  video: (p) => (
    <Svg {...p}>
      <rect x="3" y="6" width="12" height="12" rx="2" />
      <path d="M15 10l6-3v10l-6-3z" />
    </Svg>
  ),
  social: (p) => (
    <Svg {...p}>
      <circle cx="6" cy="12" r="2.4" />
      <circle cx="18" cy="6" r="2.4" />
      <circle cx="18" cy="18" r="2.4" />
      <path d="M8.2 10.9l7.6-3.7M8.2 13.1l7.6 3.7" />
    </Svg>
  ),
  campaign: (p) => (
    <Svg {...p}>
      <path d="M4 10v4h3l7 4V6L7 10z" />
      <path d="M18 9a4 4 0 010 6" />
    </Svg>
  ),
  search: (p) => (
    <Svg {...p}>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-4.5-4.5" />
    </Svg>
  ),
  ads: (p) => (
    <Svg {...p}>
      <path d="M3 17V9l10-4v16L3 17z" />
      <path d="M13 11h5a3 3 0 010 6h-2" />
      <path d="M6 21v-4" />
    </Svg>
  ),
  arrow: (p) => (
    <Svg {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Svg>
  ),
  check: (p) => (
    <Svg {...p}>
      <path d="M4 12.5l5 5L20 6.5" />
    </Svg>
  ),
};
