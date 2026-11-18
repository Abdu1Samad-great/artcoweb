"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { services } from "@/data/services";
import {
  hasAddress,
  hasEmail,
  hasPhone,
  hasWhatsApp,
  mapsHref,
  navLinks,
  siteConfig,
  telHref,
  whatsappHref,
} from "@/data/site";
import { ArrowUpRight, WhatsAppIcon } from "@/components/ui/Icons";
import Image from "next/image";

export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const year = new Date().getFullYear();
  const address = siteConfig.address.replace(/\|/g, "\n");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-footer-reveal]", {
          autoAlpha: 0,
          y: 20,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: root.current,
            start: "top 90%",
            once: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="relative mt-10 overflow-hidden bg-[#111C2E] text-ink">
      <div className="shell relative py-12">
        <div className="grid gap-y-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-6">
          <div data-footer-reveal className="sm:col-span-2 lg:col-span-4">
            <a href="/" className="inline-flex items-center gap-2" aria-label="ARTCO — back to top">
              <Image
                src="/images/artco-logo-transparent.png"
                alt="ARTCO"
                width={132}
                height={71}
                className="h-9 w-auto"
              />
            </a>
            <p className="mt-5 max-w-[34ch] text-[13px] leading-[1.7] text-slate">
              A visual production studio working across printing, signage,
              engraving, laser cutting and custom artwork.
            </p>
          </div>

          <nav data-footer-reveal aria-label="Footer navigation" className="lg:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
              Explore
            </p>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    className="inline-block py-0.5 text-[13px] text-slate transition-colors duration-300 hover:text-royal-blue"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav data-footer-reveal aria-label="Footer services" className="lg:col-span-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
              Services
            </p>
            <ul className="mt-4 space-y-2.5">
              {services.map((service) => (
                <li key={service.slug}>
                  <a
                    href="/services"
                    className="inline-block py-0.5 text-[13px] text-slate transition-colors duration-300 hover:text-royal-blue"
                  >
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div data-footer-reveal className="lg:col-span-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
              Contact
            </p>
            <div className="mt-4 space-y-2.5 text-[13px] text-slate">
              {hasEmail ? (
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="block py-0.5 transition-colors duration-300 hover:text-royal-blue"
                >
                  {siteConfig.email}
                </a>
              ) : null}
              {hasPhone ? (
                <a
                  href={telHref()}
                  className="block py-0.5 transition-colors duration-300 hover:text-royal-blue"
                >
                  {siteConfig.phone}
                </a>
              ) : null}
              {hasWhatsApp ? (
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 py-0.5 transition-colors duration-300 hover:text-royal-blue"
                >
                  <WhatsAppIcon size={14} />
                  WhatsApp
                </a>
              ) : null}
              {hasAddress ? (
                <p className="whitespace-pre-line text-slate">{address}</p>
              ) : null}
              {!hasEmail && !hasPhone && !hasWhatsApp && !hasAddress ? (
                <a
                  href="/contact"
                  className="inline-block py-0.5 transition-colors duration-300 hover:text-royal-blue"
                >
                  Inquiries via the form
                </a>
              ) : null}
              {mapsHref() ? (
                <a
                  href={mapsHref()}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 py-0.5 transition-colors duration-300 hover:text-royal-blue"
                >
                  Google Maps
                  <ArrowUpRight size={12} />
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-ink/10 py-6 text-[12px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} ARTCO. All rights reserved.</p>
          <a
            href="#top"
            className="inline-flex items-center gap-2 py-0.5 uppercase tracking-[0.12em] transition-colors duration-300 hover:text-royal-blue"
          >
            Back to top
            <ArrowUpRight className="rotate-[-45deg]" size={13} />
          </a>
        </div>
      </div>
    </footer>
  );
}