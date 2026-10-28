const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function LogoMark() {
  return (
    <svg width="18" height="20" viewBox="0 0 18 20" aria-hidden="true">
      <path d="M9 0 L15 8 H12 L17 15 H1 L6 8 H3 Z" fill="currentColor" />
      <rect x="8" y="15" width="2" height="5" fill="currentColor" />
    </svg>
  );
}

export function LeafIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 13C3 7 7 3 14 2c-1 7-5 11-11 11zM3 13l6-6" {...stroke} />
    </svg>
  );
}

export function ArrowLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M13 8H3M7 4L3 8l4 4" {...stroke} />
    </svg>
  );
}

export function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" {...stroke} />
    </svg>
  );
}

export function ArrowUpRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M5 11l6-6M6 5h5v5" {...stroke} />
    </svg>
  );
}

export function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="5" y="5" width="8.5" height="8.5" rx="1.5" {...stroke} />
      <path
        d="M10.5 5V3.5A1.5 1.5 0 0 0 9 2H3.5A1.5 1.5 0 0 0 2 3.5V9a1.5 1.5 0 0 0 1.5 1.5H5"
        {...stroke}
      />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8.5l3 3 7-7" {...stroke} />
    </svg>
  );
}

export function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3 7h14M3 13h14" {...stroke} />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M5 5l10 10M15 5L5 15" {...stroke} />
    </svg>
  );
}
