import { useMemo } from "react";
import { Link } from "react-router-dom";
import { mulberry32 } from "../forest/forest";
import { site } from "../content";

const WIDTH = 1600;
const HEIGHT = 100;

function buildTreeline(seed) {
  const rand = mulberry32(seed);
  const parts = [];
  let x = -10;

  while (x < WIDTH + 10) {
    const h = HEIGHT * (0.35 + rand() * 0.6);
    const w = h * 0.5;
    for (let i = 0; i < 3; i++) {
      const top = HEIGHT - h + h * 0.28 * i;
      const tierH = h * 0.45;
      const tierW = w * (0.5 + i * 0.25);
      parts.push(
        `M${x.toFixed(1)} ${top.toFixed(1)}` +
          `L${(x + tierW / 2).toFixed(1)} ${(top + tierH).toFixed(1)}` +
          `L${(x - tierW / 2).toFixed(1)} ${(top + tierH).toFixed(1)}Z`,
      );
    }
    x += 8 + rand() * 18;
  }

  parts.push(`M0 ${HEIGHT - 4}H${WIDTH}V${HEIGHT}H0Z`);
  return parts.join("");
}

export default function Footer() {
  const path = useMemo(() => buildTreeline(3), []);
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <svg
        className="footer-trees"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d={path} fill="currentColor" />
      </svg>
      <div className="footer-bar">
        <span>
          © {year} {site.name}
        </span>
        <nav className="footer-links">
          {site.nav.map((item) => (
            <Link key={item.to} to={item.to}>
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="footer-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Back to the canopy ↑
        </button>
      </div>
    </footer>
  );
}
