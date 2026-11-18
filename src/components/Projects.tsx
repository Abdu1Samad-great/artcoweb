"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { categories, projects, type Category } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";
import SectionLabel from "@/components/ui/SectionLabel";
import AnimatedHeading from "@/components/ui/AnimatedHeading";
import Reveal from "@/components/ui/Reveal";
import InquiryLink from "@/components/ui/InquiryLink";
import { ArrowUpRight } from "lucide-react";

type Filter = "All" | Category;

const filters: Filter[] = ["All", ...categories];

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const root = useRef<HTMLElement>(null);
  const isInitial = useRef(true);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return projects;
    return projects.filter((project) => project.category === activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    let innerFrame = 0;
    const frame = window.requestAnimationFrame(() => {
      innerFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(innerFrame);
    };
  }, [activeFilter]);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-project-card]");
      if (!cards.length) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (isInitial.current) {
          gsap.from(cards, {
            autoAlpha: 0,
            y: 30,
            duration: 0.85,
            ease: "power3.out",
            stagger: 0.06,
            scrollTrigger: {
              trigger: "[data-project-grid]",
              start: "top 86%",
              once: true,
            },
          });
          isInitial.current = false;
        } else {
          gsap.fromTo(
            cards,
            { autoAlpha: 0, y: 18 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.55,
              ease: "power3.out",
              stagger: 0.045,
              clearProps: "transform,opacity,visibility",
            },
          );
        }
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [activeFilter] },
  );

  return (
    <section
      id="projects"
      ref={root}
      aria-labelledby="projects-heading"
      className="section-pad relative overflow-hidden"
    >
      <div className="shell">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <SectionLabel>Selected Work</SectionLabel>
            </Reveal>
            <AnimatedHeading
              id="projects-heading"
              text={"A Gallery Of\nOur Creations."}
              className="display-section mt-5 max-w-[14ch]"
            />
          </div>
          <Reveal className="max-w-[40ch]" delay={0.1}>
            <p className="body-copy">
              A selection of production studies across print, signage and custom
              fabrication. Every piece begins with an idea and ends in the details.
            </p>
          </Reveal>
        </div>

        <div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div
            role="group"
            aria-label="Filter projects by service"
            className="no-scrollbar -mx-2 flex items-center gap-2 overflow-x-auto px-2 pb-1 sm:mx-0 sm:px-0"
          >
            {filters.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  aria-pressed={isActive}
                  className={[
                    "shrink-0 rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] transition-all duration-300",
                    isActive
                      ? "bg-electric-purple text-white"
                      : "bg-[#17263B] text-slate hover:text-ink",
                  ].join(" ")}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          <p
            aria-live="polite"
            className="shrink-0 text-[12px] font-semibold uppercase tracking-[0.14em] text-muted"
          >
            {String(filteredProjects.length).padStart(2, "0")}{" "}
            {filteredProjects.length === 1 ? "project" : "projects"}
          </p>
        </div>

        <div
          data-project-grid
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={projects.findIndex((item) => item.slug === project.slug)}
            />
          ))}
        </div>

      </div>
    </section>
  );
}