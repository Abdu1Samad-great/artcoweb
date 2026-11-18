"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

type AnimatedHeadingProps = {
  text: string;
  id?: string;
  as?: "h2" | "h3";
  className?: string;
};

export default function AnimatedHeading({
  text,
  id,
  as = "h2",
  className = "",
}: AnimatedHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const lines = text.split("\n");

  useGSAP(
    () => {
      if (!ref.current) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const lineEls = ref.current?.querySelectorAll("[data-heading-line]");
        if (!lineEls?.length) return;

        gsap.from(lineEls, {
          yPercent: 112,
          duration: 1.05,
          ease: "power4.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 88%",
            once: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  const Tag = as;

  return (
    <Tag ref={ref} id={id} className={className}>
      {lines.map((line, index) => (
        <span
          key={`${line}-${index}`}
          className="-mb-[0.08em] block overflow-hidden pb-[0.08em]"
        >
          <span data-heading-line className="block">
            {line}
            {index < lines.length - 1 ? " " : null}
          </span>
        </span>
      ))}
    </Tag>
  );
}
