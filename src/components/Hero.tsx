"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.1 });
        tl.from("[data-hero-logo]", { autoAlpha: 0, y: 16, duration: 0.7 })
          .from("[data-hero-title]", { autoAlpha: 0, y: 20, duration: 0.8 }, "-=0.4")
          .from("[data-hero-copy]", { autoAlpha: 0, y: 16, duration: 0.7 }, "-=0.4")
          .from("[data-hero-cta]", { autoAlpha: 0, y: 12, duration: 0.6, stagger: 0.1 }, "-=0.4")
          .from("[data-hero-float]", { autoAlpha: 0, y: 30, duration: 1 }, "-=0.6");

        if (floatRef.current) {
          gsap.to(floatRef.current, {
            y: -12,
            duration: 4,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        }
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="top"
      ref={root}
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-[#0B1220] pt-24 pb-28 md:pb-36"
    >
      <div className="shell">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left column */}
          <div className="flex flex-col items-start">
            <div data-hero-logo>
              <Image
                src="/images/artco-logo-transparent.png"
                alt="ARTCO"
                width={180}
                height={97}
                className="h-auto w-[150px] md:w-[180px]"
                priority
              />
            </div>

            <h1
              id="hero-heading"
              data-hero-title
              className="display-hero mt-6 text-ink"
            >
              WE MAKE IDEAS
              <br />
              <span className="text-royal-blue">LOOK EXTRAORDINARY.</span>
            </h1>

            <p data-hero-copy className="mt-5 max-w-[46ch] text-[16px] leading-[1.7] text-slate md:text-[18px]">
              From custom printing to precision laser cutting, ARTCO transforms
              creative ideas into high-quality visual experiences.
            </p>

            <div data-hero-cta className="mt-8 flex flex-wrap items-center gap-3">
              <a href="/projects" className="btn-primary">
                Explore Our Work
                <ArrowRight size={16} />
              </a>
              <a href="/contact" className="btn-ghost">
                Let's Talk
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>

          {/* Right column */}
          <div data-hero-float ref={floatRef} className="flex justify-center lg:justify-end">
            <Image
              src="/images/hero-float.png"
              alt="ARTCO wide-format printer in action"
              width={520}
              height={347}
              className="h-auto w-[300px] md:w-[460px]"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}