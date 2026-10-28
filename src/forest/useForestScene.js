import { useEffect, useRef } from "react";
import {
  FAR_LAYERS,
  NEAR_LAYERS,
  mulberry32,
  setupCanvas,
  drawStars,
  drawLayer,
} from "./forest";

const TREE_DPR_CAP = 1.5;
const FLY_DPR_CAP = 1;
const FLY_FPS = 30;
const FRAME_MS = 1000 / FLY_FPS;
const SPRITE_SIZE = 32;
const HEIGHT_REDRAW_THRESHOLD = 80; // ignore mobile address-bar jiggle

function makeFireflySprite() {
  const sprite = document.createElement("canvas");
  sprite.width = SPRITE_SIZE;
  sprite.height = SPRITE_SIZE;
  const ctx = sprite.getContext("2d");
  if (!ctx) throw new Error("makeFireflySprite: 2D context unavailable");

  const c = SPRITE_SIZE / 2;
  const g = ctx.createRadialGradient(c, c, 0, c, c, c);
  g.addColorStop(0, "rgba(235, 255, 170, 0.9)");
  g.addColorStop(0.25, "rgba(190, 240, 110, 0.35)");
  g.addColorStop(1, "rgba(190, 240, 110, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
  return sprite;
}

export function useForestScene(seed = 42) {
  const backRef = useRef(null);
  const frontRef = useRef(null);
  const fliesRef = useRef(null);

  useEffect(() => {
    const back = backRef.current;
    const front = frontRef.current;
    const flies = fliesRef.current;
    if (!back || !front || !flies) {
      throw new Error("useForestScene: canvas refs are not attached");
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const sprite = makeFireflySprite();
    const flyRand = mulberry32(seed + 1000);
    const fireflies = Array.from({ length: 40 }, () => ({
      fx: flyRand(),
      fy: 0.42 + flyRand() * 0.5,
      ax: 10 + flyRand() * 30,
      ay: 6 + flyRand() * 18,
      speed: 0.15 + flyRand() * 0.35,
      phase: flyRand() * Math.PI * 2,
      blink: 0.6 + flyRand() * 1.4,
      size: (1 + flyRand() * 1.6) * 12,
    }));

    let fctx = null;
    let fw = 0;
    let fh = 0;
    let rafId = 0;
    let resizeRaf = 0;
    let lastFrame = 0;
    let lastW = 0;
    let lastH = 0;
    let running = false;

    function paintTrees() {
      const rand = mulberry32(seed);

      const b = setupCanvas(back, TREE_DPR_CAP);
      drawStars(b.ctx, b.w, b.h, rand);
      FAR_LAYERS.forEach((layer) => drawLayer(b.ctx, b.w, b.h, layer, rand));

      const f = setupCanvas(front, TREE_DPR_CAP);
      NEAR_LAYERS.forEach((layer) => drawLayer(f.ctx, f.w, f.h, layer, rand));
    }

    function renderFireflies(t) {
      fctx.clearRect(0, 0, fw, fh);

      const count = Math.round(Math.min(40, Math.max(14, fw / 34)));
      for (let i = 0; i < count; i++) {
        const p = fireflies[i];
        const glow = Math.max(0, Math.sin(t * p.blink + p.phase)) ** 3;
        if (glow < 0.02) continue;

        const x =
          p.fx * fw +
          Math.sin(t * p.speed + p.phase) * p.ax +
          Math.sin(t * p.speed * 0.37 + p.phase * 2) * p.ax * 0.6;
        const y = p.fy * fh + Math.cos(t * p.speed * 0.8 + p.phase) * p.ay;

        fctx.globalAlpha = glow;
        fctx.drawImage(sprite, x - p.size / 2, y - p.size / 2, p.size, p.size);
      }

      fctx.globalAlpha = 1;
    }

    function loop(ms) {
      if (!running) return;
      rafId = requestAnimationFrame(loop);
      if (ms - lastFrame < FRAME_MS) return;
      lastFrame = ms;
      renderFireflies(ms / 1000);
    }

    function start() {
      if (running || reduceMotion) return;
      running = true;
      rafId = requestAnimationFrame(loop);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(rafId);
    }

    function resize() {
      const w = back.clientWidth;
      const h = back.clientHeight;
      const sameWidth = w === lastW;
      const smallHeightChange = Math.abs(h - lastH) < HEIGHT_REDRAW_THRESHOLD;
      if (lastW !== 0 && sameWidth && smallHeightChange) return;
      lastW = w;
      lastH = h;

      paintTrees();

      const s = setupCanvas(flies, FLY_DPR_CAP);
      fctx = s.ctx;
      fw = s.w;
      fh = s.h;
      fctx.globalCompositeOperation = "lighter";

      if (reduceMotion) renderFireflies(4);
    }

    function scheduleResize() {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(resize);
    }

    resize();

    const resizeObserver = new ResizeObserver(scheduleResize);
    resizeObserver.observe(back);

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });
    visibilityObserver.observe(back);

    return () => {
      stop();
      cancelAnimationFrame(resizeRaf);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [seed]);

  return { backRef, frontRef, fliesRef };
}
