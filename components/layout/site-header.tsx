import Image from "next/image";
import Link from "next/link";
import { CartIconButton } from "@/components/layout/cart-icon-button";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { NAV_LINKS } from "@/lib/config/navigation";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Search } from "lucide-react";

export function SiteHeader() {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--line-soft)] bg-[rgba(10,10,10,0.86)] backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <MobileNavigation />
          <Link href="/" className="flex items-center gap-3" aria-label="Valbridge Group">
            <Image
              src="/logo.png"
              alt="Valbridge Group logo"
              width={180}
              height={56}
              className="h-14 w-auto object-contain"
            />
          </Link>

          <nav className="hidden items-center gap-6 text-[0.7rem] uppercase tracking-[0.2em] text-[var(--mist)] lg:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="relative py-1 transition hover:text-[var(--gold-light)] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-[var(--gold)] after:transition-all after:duration-300 hover:after:w-full">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/search" className="hidden rounded-full border border-[var(--line)] p-3 text-[var(--cream)] transition hover:border-[var(--gold)] hover:text-[var(--gold-light)] sm:inline-flex" aria-label="Search products">
              <Search className="h-5 w-5" />
            </Link>
            <CartIconButton />
          </div>
        </div>
      </header>
      <CartDrawer />
    </>
  );
}
