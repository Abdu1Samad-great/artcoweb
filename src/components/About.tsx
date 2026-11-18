"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import SectionLabel from "@/components/ui/SectionLabel";
import AnimatedHeading from "@/components/ui/AnimatedHeading";
import Reveal from "@/components/ui/Reveal";

import { ArrowUpRight, Sparkles, Zap, Heart } from "lucide-react";

const pillars = [
  {
    icon: Sparkles,
    title: "Creative Vision",
    copy: "We interpret your idea and translate it into a striking visual language.",
    iconBg: "bg-[#2878D0]/10",
    iconColor: "text-[#2878D0]",
  },
  {
    icon: Zap,
    title: "Precision Craft",
    copy: "Every cut, print and finish is executed with meticulous attention.",
    iconBg: "bg-[#8DBBEE]/10",
    iconColor: "text-[#8DBBEE]",
  },
  {
    icon: Heart,
    title: "Lasting Quality",
    copy: "Materials and finishes chosen to endure and impress over time.",
    iconBg: "bg-[#A9B6C8]/10",
    iconColor: "text-[#A9B6C8]",
  },
];

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-about-media]", {
          autoAlpha: 0,
          y: 24,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-about-media]",
            start: "top 86%",
            once: true,
          },
        });
        gsap.from("[data-about-card]", {
          autoAlpha: 0,
          y: 20,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: "[data-about-cards]",
            start: "top 86%",
            once: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="about"
      ref={root}
      aria-labelledby="about-heading"
      className="section-pad relative"
    >
      <div className="shell">
        <div className="max-w-3xl">
          <Reveal>
            <SectionLabel>Who We Are</SectionLabel>
          </Reveal>
          <AnimatedHeading
            id="about-heading"
            text={"Creativity Meets\nCraftsmanship."}
            className="display-statement mt-5"
          />
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          {/* Image */}
          <div className="lg:col-span-6">
            <div
              data-about-media
              className="relative overflow-hidden rounded-2xl shadow-md"
              style={{ border: "1px solid rgba(255, 255, 255, 0.1)" }}
            >
              <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]">
                <Image
                  src="/images/about.jpg"
                  alt="Professional vinyl printing equipment in a modern printing workshop"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  style={{ objectPosition: "50% 52%" }}
                />
              </div>
            </div>
          </div>

          {/* Text + cards */}
          <div className="lg:col-span-6 lg:pt-2">
            <Reveal>
              <p className="text-[clamp(1.1rem,1.6vw,1.35rem)] leading-[1.5] tracking-[-0.01em] text-ink font-semibold">
                ARTCO is dedicated to bringing ideas to life through professional
                printing, creative production and custom visual solutions.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="mt-5 max-w-[52ch] text-[15px] leading-[1.7] text-slate">
                From everyday printing needs to detailed custom projects, we focus
                on quality, precision and attention to every detail. We work
                closely with you from first sketch to final finish.
              </p>
            </Reveal>

            <div
              data-about-cards
              className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3"
            >
              {pillars.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.title}
                    data-about-card
                    className="rounded-2xl bg-[#17263B] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    style={{ border: "1px solid rgba(255, 255, 255, 0.1)" }}
                  >
                    <div
                      className={`icon-box ${p.iconBg} ${p.iconColor}`}
                    >
                      <Icon size={20} />
                    </div>
                    <h3 className="mt-4 text-[15px] font-bold text-ink">
                      {p.title}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-[1.55] text-slate">
                      {p.copy}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}