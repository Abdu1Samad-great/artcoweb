"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import SectionLabel from "@/components/ui/SectionLabel";
import AnimatedHeading from "@/components/ui/AnimatedHeading";
import Reveal from "@/components/ui/Reveal";
import { Award, Rocket, Eye, Layers, CheckCircle2 } from "lucide-react";

const reasons = [
  {
    icon: Award,
    title: "Quality-Focused Production",
    copy: "Every output is held to a high standard of quality before it leaves our hands.",
    iconBg: "bg-[#2878D0]/10",
    iconColor: "text-[#2878D0]",
  },
  {
    icon: Rocket,
    title: "Creative Custom Solutions",
    copy: "We tailor every project to your idea — no templates, no shortcuts.",
    iconBg: "bg-[#8DBBEE]/10",
    iconColor: "text-[#8DBBEE]",
  },
  {
    icon: Eye,
    title: "Attention to Detail",
    copy: "Small details define great work. We obsess over every edge and finish.",
    iconBg: "bg-[#A9B6C8]/10",
    iconColor: "text-[#A9B6C8]",
  },
  {
    icon: Layers,
    title: "Multiple Production Services",
    copy: "Print, cut, engrave and create — all under one roof.",
    iconBg: "bg-[#A9B6C8]/10",
    iconColor: "text-[#A9B6C8]",
  },
  {
    icon: CheckCircle2,
    title: "Professional Results",
    copy: "Clean, reliable output delivered on time, every time.",
    iconBg: "bg-[#8DBBEE]/10",
    iconColor: "text-[#8DBBEE]",
  },
];

export default function WhyChoose() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-reason]", {
          autoAlpha: 0,
          y: 20,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: "[data-reasons]",
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
      id="why"
      ref={root}
      aria-labelledby="why-heading"
      className="section-pad relative"
      style={{ backgroundColor: "#111C2E" }}
    >
      <div className="shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <SectionLabel>Why ARTCO</SectionLabel>
            </Reveal>
            <AnimatedHeading
              id="why-heading"
              text={"Why Choose\nARTCO."}
              className="display-section mt-5 max-w-[14ch]"
            />
          </div>
          <Reveal className="max-w-[42ch]" delay={0.1}>
            <p className="body-copy">
              We combine creative thinking with precise production to deliver
              results that feel considered, finished and ready to be seen.
            </p>
          </Reveal>
        </div>

        <div data-reasons className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <div
                key={reason.title}
                data-reason
                className="group rounded-2xl bg-[#17263B] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                style={{ border: "1px solid rgba(255, 255, 255, 0.1)" }}
              >
                <div className={`icon-box ${reason.iconBg} ${reason.iconColor}`}>
                  <Icon size={20} />
                </div>
                <h3 className="mt-5 text-[16px] font-bold text-ink">
                  {reason.title}
                </h3>
                <p className="mt-2 text-[13px] leading-[1.6] text-slate">
                  {reason.copy}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}