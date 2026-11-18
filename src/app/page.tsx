import Hero from "@/components/Hero";
import ServiceItem from "@/components/ServiceItem";
import SectionLabel from "@/components/ui/SectionLabel";
import AnimatedHeading from "@/components/ui/AnimatedHeading";
import Reveal from "@/components/ui/Reveal";
import InquiryLink from "@/components/ui/InquiryLink";
import { services } from "@/data/services";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const featuredServices = services.slice(0, 3);

  return (
    <>
      <Hero />

      <section className="section-pad relative" style={{ backgroundColor: "#111C2E" }}>
        <div className="shell">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Reveal>
                <SectionLabel>What We Do</SectionLabel>
              </Reveal>
              <AnimatedHeading
                text={"Featured Services."}
                className="display-section mt-5 max-w-[16ch]"
              />
            </div>
            <Reveal delay={0.1}>
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-electric-purple hover:gap-2.5 transition-all"
              >
                View all services
                <ArrowRight size={14} />
              </Link>
            </Reveal>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service) => (
              <ServiceItem key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad relative">
        <div className="shell">
          <Reveal>
            <SectionLabel>Let's Connect</SectionLabel>
          </Reveal>
          <AnimatedHeading
            text={"Have A Project\nIn Mind?"}
            className="display-section mt-5 max-w-[16ch]"
          />
          <Reveal className="mt-6 max-w-[48ch]" delay={0.1}>
            <p className="body-copy">
              Tell us what you have in mind. We'd love to help bring your next
              idea to life.
            </p>
          </Reveal>
          <Reveal className="mt-8" delay={0.15}>
            <InquiryLink service="Not sure yet" className="btn-primary">
              Start an inquiry
              <ArrowRight size={16} />
            </InquiryLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}