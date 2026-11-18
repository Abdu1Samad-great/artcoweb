import type { Service } from "@/data/services";
import type { ComponentType } from "react";
import InquiryLink from "@/components/ui/InquiryLink";
import { ArrowUpRight } from "lucide-react";
import { Printer, Layers, Scissors, Sparkles, PenTool, Palette } from "lucide-react";

type ServiceMeta = {
  icon: ComponentType<{ size?: number; className?: string }>;
  iconBg: string;
  iconColor: string;
};

const metaBySlug: Record<string, ServiceMeta> = {
  "vinyl-printing": {
    icon: Printer,
    iconBg: "bg-[#2878D0]/10",
    iconColor: "text-[#2878D0]",
  },
  "flex-printing": {
    icon: Layers,
    iconBg: "bg-[#2878D0]/10",
    iconColor: "text-[#2878D0]",
  },
  "laser-cutting": {
    icon: Scissors,
    iconBg: "bg-[#2878D0]/10",
    iconColor: "text-[#2878D0]",
  },
  "uv-printing": {
    icon: Sparkles,
    iconBg: "bg-[#2878D0]/10",
    iconColor: "text-[#2878D0]",
  },
  engraving: {
    icon: PenTool,
    iconBg: "bg-[#2878D0]/10",
    iconColor: "text-[#2878D0]",
  },
  "paintings-and-custom-artwork": {
    icon: Palette,
    iconBg: "bg-[#2878D0]/10",
    iconColor: "text-[#2878D0]",
  },
};

export default function ServiceItem({ service }: { service: Service }) {
  const meta = metaBySlug[service.slug] ?? metaBySlug["vinyl-printing"];
  const Icon = meta.icon;

  return (
    <article
      className="flex h-full flex-col rounded-2xl bg-[#17263B] p-6"
      style={{ border: "1px solid rgba(255, 255, 255, 0.15)" }}
    >
      <div className={`icon-box ${meta.iconBg} ${meta.iconColor}`}>
        <Icon size={22} />
      </div>

      <h3 className="mt-5 text-[17px] font-bold tracking-tight text-ink transition-colors duration-300 group-hover:text-electric-purple">
        {service.title}
      </h3>
      <p className="mt-2 flex-1 text-[14px] leading-[1.6] text-ink">
        {service.description}
      </p>

      <div className="mt-5">
        <InquiryLink
          service={service.title}
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-electric-purple transition-all duration-300 hover:gap-2.5"
          ariaLabel={`Enquire about ${service.title}`}
        >
          Inquire
          <ArrowUpRight size={13} />
        </InquiryLink>
      </div>
    </article>
  );
}