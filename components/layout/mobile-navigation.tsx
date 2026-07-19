"use client";

import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/config/navigation";

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button type="button" onClick={() => setIsOpen(true)} className="inline-flex rounded-full border border-[var(--line)] p-3 text-[var(--cream)]" aria-label="Open navigation" aria-controls="mobile-navigation" aria-expanded={isOpen}>
        <Menu className="h-5 w-5" />
      </button>
      <div className={`fixed inset-0 z-[60] bg-black/65 transition ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => setIsOpen(false)} aria-hidden="true" />
      <nav id="mobile-navigation" aria-label="Mobile navigation" aria-hidden={!isOpen} inert={!isOpen} className={`fixed inset-y-0 left-0 z-[70] flex w-[min(88vw,360px)] flex-col border-r border-[var(--line)] bg-[var(--panel)] p-6 shadow-2xl transition-transform ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between">
          <span className="font-display uppercase tracking-[0.18em] text-[var(--gold-light)]">Menu</span>
          <button type="button" onClick={() => setIsOpen(false)} className="rounded-full p-2" aria-label="Close navigation"><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-10 grid gap-2">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="rounded-xl px-4 py-3 uppercase tracking-[0.16em] text-[var(--cream)] hover:bg-[rgba(201,150,43,0.1)]">{link.label}</Link>
          ))}
          <Link href="/search" onClick={() => setIsOpen(false)} className="mt-3 inline-flex items-center gap-3 rounded-xl border border-[var(--line)] px-4 py-3 text-[var(--gold-light)]"><Search className="h-4 w-4" /> Search products</Link>
        </div>
      </nav>
    </div>
  );
}
