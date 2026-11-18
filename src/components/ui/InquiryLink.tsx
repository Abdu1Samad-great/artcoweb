"use client";

import type { ReactNode, MouseEvent } from "react";
import { INQUIRY_SERVICE_EVENT, INQUIRY_SERVICE_KEY } from "@/lib/inquiry";

type InquiryLinkProps = {
  service: string;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
  ariaLabel?: string;
};

export default function InquiryLink({
  service,
  children,
  className,
  onNavigate,
  ariaLabel,
}: InquiryLinkProps) {
  function handleClick(_event: MouseEvent<HTMLAnchorElement>) {
    try {
      window.sessionStorage.setItem(INQUIRY_SERVICE_KEY, service);
      window.dispatchEvent(
        new CustomEvent(INQUIRY_SERVICE_EVENT, { detail: { service } }),
      );
    } catch {
      // Session storage may be unavailable in private or restricted contexts.
    }
    onNavigate?.();
  }

  return (
    <a
      href="/contact"
      className={className}
      onClick={handleClick}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
