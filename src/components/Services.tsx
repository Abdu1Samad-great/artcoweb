"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { services } from "@/data/services";
import ServiceItem from "@/components/ServiceItem";
import SectionLabel from "@/components/ui/SectionLabel";
import AnimatedHeading from "@/components/ui/AnimatedHeading";
import Reveal from "@/components/ui/Reveal";
import InquiryLink from "@/components/ui/InquiryLink";
import { ArrowUpRight } from "lucide-react";

export default function Services() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-service-card]", {
          autoAlpha: 0,
          y: 24,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: {
            trigger: "[data-services-grid]",
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
      id="services"
      ref={root}
      aria-labelledby="services-heading"
      className="section-pad relative"
      style={{ backgroundColor: "#0B1220" }}
    >
      <div className="shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <SectionLabel>What We Do</SectionLabel>
            </Reveal>
            <AnimatedHeading
              id="services-heading"
              text={"Creative Services\nBuilt For Impact."}
              className="display-section mt-5 max-w-[16ch]"
            />
          </div>
          <Reveal className="max-w-[42ch]" delay={0.1}>
            <p className="body-copy">
              A range of creative production and printing solutions, crafted with
              precision and attention to detail. Each service tailored to your
              idea.
            </p>
          </Reveal>
        </div>

        <div
          data-services-grid
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service) => (
            <ServiceItem key={service.slug} service={service} />
          ))}
        </div>

      </div>
    </section>
  );
}