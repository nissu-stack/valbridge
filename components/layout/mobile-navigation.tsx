"use client";

import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NAV_LINKS } from "@/lib/config/navigation";

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const openButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        openButtonRef.current?.focus();
        setIsOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const closeNavigation = () => {
    openButtonRef.current?.focus();
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden">
      <button ref={openButtonRef} type="button" onClick={() => setIsOpen(true)} className="inline-flex border border-[var(--line)] p-3 text-[var(--cream)]" aria-label="Open navigation" aria-controls="mobile-navigation" aria-expanded={isOpen}>
        <Menu className="h-5 w-5" />
      </button>
      <div className={`fixed inset-0 z-[60] bg-black/65 transition ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={closeNavigation} aria-hidden="true" />
      <nav id="mobile-navigation" aria-label="Mobile navigation" aria-hidden={!isOpen} inert={!isOpen} style={{ backgroundColor: "#141210" }} className={`fixed inset-y-0 left-0 z-[70] isolate flex w-[min(88vw,360px)] flex-col border-r border-[var(--line)] p-6 shadow-2xl transition-transform ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between">
          <span className="font-display uppercase tracking-[0.18em] text-[var(--gold-light)]">Menu</span>
          <button type="button" onClick={closeNavigation} className="border border-[var(--line)] p-2" aria-label="Close navigation"><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-10 grid gap-2">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={closeNavigation} className="px-4 py-3 uppercase tracking-[0.16em] text-[var(--cream)] hover:bg-[rgba(201,150,43,0.1)]">{link.label}</Link>
          ))}
          <Link href="/search" onClick={closeNavigation} className="site-button site-button--secondary mt-3 justify-start"><Search className="h-4 w-4" /> Search products</Link>
        </div>
      </nav>
    </div>
  );
}
