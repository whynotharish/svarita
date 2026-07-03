"use client";

import { AudioLines } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import AuthButton from "./AuthButton";

const LINKS = [
  { label: "Studio", href: "#studio" },
  { label: "Batch", href: "#batch" },
  { label: "History", href: "#history" },
];

export default function Navbar() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="glass sticky top-0 z-40 border-b border-border/80 bg-base/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white">
            <AudioLines size={17} />
          </div>
          <span className="font-display text-[15px] font-semibold tracking-tight text-ink">
            Svarita <span className="ml-1 text-xs font-normal text-muted">· Udaan Voice Studio</span>
          </span>
        </div>

        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <button
              key={l.href}
              onClick={() => scrollTo(l.href)}
              className="text-sm text-muted transition-colors hover:text-ink"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
