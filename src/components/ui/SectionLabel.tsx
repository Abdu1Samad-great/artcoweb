import type { ReactNode } from "react";

export default function SectionLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <span
        aria-hidden="true"
        className="h-2 w-2 rounded-full bg-electric-purple"
      />
      <p className="eyebrow">{children}</p>
    </div>
  );
}