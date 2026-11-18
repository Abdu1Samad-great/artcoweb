"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  hasWhatsApp,
  navLinks,
  siteConfig,
  whatsappHref,
} from "@/data/site";
import { WhatsAppIcon } from "@/components/ui/Icons";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 16);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    const focusTimer = window.setTimeout(() => {
      menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    }, 160);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const menuFocusables = Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ) ?? [],
      );
      const focusables = [toggleRef.current, ...menuFocusables].filter(
        (element): element is HTMLElement => Boolean(element),
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [open]);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (query.matches) setOpen(false);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 md:pt-4">
        <div
          className={[
            "flex w-full max-w-5xl items-center justify-between gap-4 rounded-full px-4 py-2.5 transition-all duration-300 md:px-6",
            scrolled || open
              ? "bg-[#0B1220]/90 shadow-md backdrop-blur-md"
              : "bg-[#0B1220]/70 shadow-sm backdrop-blur-md",
          ].join(" ")}
          style={{ border: "1px solid rgba(139,187,238,0.25)" }}
        >
          <a
            href="/"
            aria-label="ARTCO — back to top"
            className="group inline-flex items-center gap-2"
            onClick={closeMenu}
          >
            <Image
              src="/images/artco-logo-transparent.png"
              alt="ARTCO"
              width={120}
              height={65}
              className="h-8 w-auto"
              priority
            />
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className={[
                  "rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all duration-200",
                  pathname === link.href
                    ? "bg-electric-purple/10 text-electric-purple"
                    : "text-slate hover:bg-[#17263B] hover:text-ink",
                ].join(" ")}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {hasWhatsApp ? (
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-soft-mint text-ink transition-transform hover:scale-105"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon size={16} />
              </a>
            ) : null}
            <a href="#contact" className="btn-primary !px-4 !py-2 !text-[13px]">
              Let's Talk
            </a>
          </div>

          <button
            ref={toggleRef}
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#17263B] md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span
              aria-hidden="true"
              className={[
                "absolute h-0.5 w-5 rounded-full bg-ink transition-transform duration-300",
                open ? "translate-y-0 rotate-45" : "-translate-y-1.5",
              ].join(" ")}
            />
            <span
              aria-hidden="true"
              className={[
                "absolute h-0.5 w-5 rounded-full bg-ink transition-transform duration-300",
                open ? "translate-y-0 -rotate-45" : "translate-y-1.5",
              ].join(" ")}
            />
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={menuRef}
        aria-hidden={!open}
        inert={!open}
        className={[
          "fixed inset-0 z-40 flex flex-col bg-[#0B1220]/95 backdrop-blur-xl transition-opacity duration-300 md:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      >
        <div className="flex flex-1 flex-col justify-center gap-2 px-6">
          {navLinks.map((link, index) => (
            <a
              key={link.id}
              href={link.href}
              onClick={closeMenu}
              className={[
                "rounded-2xl px-6 py-4 text-2xl font-bold tracking-tight transition-all duration-300",
                open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                pathname === link.href
                  ? "bg-electric-purple/10 text-electric-purple"
                  : "text-ink hover:bg-[#17263B]",
              ].join(" ")}
              style={{ transitionDelay: open ? `${80 + index * 50}ms` : "0ms" }}
            >
              {link.label}
            </a>
          ))}
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#contact" onClick={closeMenu} className="btn-primary">
              Let's Talk
            </a>
            {hasWhatsApp ? (
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                <WhatsAppIcon size={16} /> WhatsApp
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}