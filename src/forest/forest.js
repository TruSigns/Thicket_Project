/* All layer values are fractions of the scene height */
export const FAR_LAYERS = [
  {
    base: 0.52,
    minH: 0.06,
    maxH: 0.12,
    minGap: 0.012,
    maxGap: 0.024,
    widthRatio: 0.42,
    color: "#1b2f33",
    fog: 0.1,
    fogAlpha: 0.22,
  },
  {
    base: 0.58,
    minH: 0.09,
    maxH: 0.17,
    minGap: 0.018,
    maxGap: 0.034,
    widthRatio: 0.42,
    color: "#132428",
    fog: 0.1,
    fogAlpha: 0.18,
  },
  {
    base: 0.64,
    minH: 0.12,
    maxH: 0.22,
    minGap: 0.024,
    maxGap: 0.046,
    widthRatio: 0.42,
    color: "#0c191d",
    fog: 0.08,
    fogAlpha: 0.14,
  },
];

export const NEAR_LAYERS = [
  {
    base: 0.8,
    minH: 0.32,
    maxH: 0.52,
    minGap: 0.05,
    maxGap: 0.09,
    widthRatio: 0.4,
    color: "#071114",
    clearing: 0.2,
    fog: 0.06,
    fogAlpha: 0.08,
  },
  {
    base: 0.96,
    minH: 0.55,
    maxH: 0.85,
    minGap: 0.08,
    maxGap: 0.14,
    widthRatio: 0.38,
    color: "#03080a",
    clearing: 0.3,
  },
];

export function mulberry32(seed) {
  return function rand() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function setupCanvas(canvas, maxDpr = 1.5) {
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("setupCanvas: 2D context unavailable");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}

function drawPine(ctx, x, base, height, width) {
  const tiers = 4;
  ctx.beginPath();
  for (let i = 0; i < tiers; i++) {
    const top = base - height + height * 0.22 * i;
    const tierH = height * 0.38;
    const tierW = width * (0.45 + i * 0.18);
    ctx.moveTo(x, top);
    ctx.lineTo(x + tierW / 2, top + tierH);
    ctx.lineTo(x - tierW / 2, top + tierH);
    ctx.closePath();
  }
  ctx.rect(x - width * 0.04, base - height * 0.15, width * 0.08, height * 0.15);
  ctx.fill();
}

export function drawStars(ctx, w, h, rand) {
  const count = Math.floor((w * h) / 9000);
  for (let i = 0; i < count; i++) {
    const x = rand() * w;
    const y = rand() * h * 0.45;
    const r = rand() * 1.1 + 0.2;
    const alpha = (0.15 + rand() * 0.5) * (1 - y / (h * 0.45));
    ctx.fillStyle = `rgba(220, 235, 230, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawLayer(ctx, w, h, layer, rand) {
  const base = layer.base * h;
  const center = w / 2;
  ctx.fillStyle = layer.color;

  let x = -20;
  while (x < w + 20) {
    const dist = Math.abs(x - center);
    const clearingPx = layer.clearing ? layer.clearing * w : 0;
    const treeH = (layer.minH + rand() * (layer.maxH - layer.minH)) * h;

    if (dist >= clearingPx) {
      const edge = layer.clearing
        ? Math.min(1, 0.45 + (dist - clearingPx) / (0.15 * w))
        : 1;
      const th = treeH * edge;
      drawPine(ctx, x, base, th, th * layer.widthRatio);
    }

    x += (layer.minGap + rand() * (layer.maxGap - layer.minGap)) * h;
  }

  ctx.fillRect(0, base - 1, w, h - base + 1);

  if (layer.fog) {
    const top = base - layer.fog * h;
    const bottom = base + 0.03 * h;
    const g = ctx.createLinearGradient(0, top, 0, bottom);
    g.addColorStop(0, "rgba(140, 170, 165, 0)");
    g.addColorStop(1, `rgba(140, 170, 165, ${layer.fogAlpha})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, top, w, bottom - top);
  }
}
