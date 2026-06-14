"use client";

import { useCallback } from "react";
const links = [
  { label: "Inicio", href: "inicio" },
  { label: "Experiencia", href: "experiencia" },
  { label: "Educación", href: "educacion" },
];

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function smoothScrollTo(targetY: number, duration = 800) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  let startTime: number | null = null;

  function step(timestamp: number) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

export default function Navbar() {
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const navHeight = 56;
    const targetY = el.getBoundingClientRect().top + window.scrollY - navHeight;
    smoothScrollTo(targetY);
  }, []);

  return (
    <nav className="cv-navbar">
      <div className="cv-navbar-inner">
      <span style={{ fontFamily: "var(--font-newsreader), Georgia, serif", fontWeight: 700, fontSize: "17px", color: "#15171C" }}>
        Ric
      </span>
      <div className="cv-nav-links">
        {links.map((link) => (
          <a
            key={link.href}
            href={`#${link.href}`}
            className="cv-nav-link"
            onClick={(e) => handleClick(e, link.href)}
          >
            {link.label}
          </a>
        ))}
      </div>
      </div>
    </nav>
  );
}
