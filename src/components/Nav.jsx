import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { site } from "../content";
import { LogoMark, LeafIcon, MenuIcon, CloseIcon } from "./Icons";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const classes = ["nav"];
  if (scrolled) classes.push("is-scrolled");
  if (open) classes.push("is-open");

  return (
    <header className={classes.join(" ")}>
      <Link to="/" className="nav-logo">
        <LogoMark />
        <span>{site.brand}</span>
      </Link>

      <nav className="nav-menu" id="nav-menu">
        {site.nav.map((item) => (
          <NavLink key={item.to} to={item.to}>
            {item.label}
          </NavLink>
        ))}
        <a
          className="nav-resume"
          href={site.resumeHref}
          target="_blank"
          rel="noreferrer"
        >
          <LeafIcon />
          Résumé
        </a>
      </nav>

      <button
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="nav-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>
    </header>
  );
}
