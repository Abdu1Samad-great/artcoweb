const env = {
  url: process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() ?? "",
  whatsapp: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP?.trim() ?? "",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? "",
  address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS?.trim() ?? "",
  mapsUrl: process.env.NEXT_PUBLIC_MAPS_URL?.trim() ?? "",
  mapsEmbedUrl: process.env.NEXT_PUBLIC_MAPS_EMBED_URL?.trim() ?? "",
};

export const siteConfig = {
  name: "ARTCO",
  legalName: "ARTCO",
  title: "ARTCO — Printing, Signage & Visual Production",
  description:
    "ARTCO is a visual production studio working across premium printing, custom signage, laser cutting, engraving, UV printing and custom artwork. Share your idea and start a conversation.",
  shortDescription:
    "Printing, signage, engraving and visual production — crafted with precision and attention to detail.",
  url: (env.url || "https://artco.example").replace(/\/+$/, ""),
  email: env.email,
  phone: env.phone || "0321 9660904",
  whatsapp: env.whatsapp || "+92 321 9660904",
  address: env.address,
  mapsUrl: env.mapsUrl || "https://share.google/OH2t4GkPaECQGnJUM",
  mapsEmbedUrl:
    env.mapsEmbedUrl ||
    "https://www.google.com/maps?q=Artco+Digital+Sign&output=embed",
  defaultWhatsAppMessage:
    "Hello ARTCO, I would like to inquire about a project.",
} as const;

export const navLinks = [
  { label: "Home", href: "/", id: "home" },
  { label: "Services", href: "/services", id: "services" },
  { label: "Projects", href: "/projects", id: "projects" },
  { label: "About", href: "/about", id: "about" },
  { label: "Contact", href: "/contact", id: "contact" },
] as const;

export function digitsOnly(value: string) {
  return value.replace(/[^\d]/g, "");
}

export function telHref(phone = siteConfig.phone) {
  const digits = digitsOnly(phone);
  return digits ? `tel:${digits}` : "";
}

export function whatsappHref(message: string = siteConfig.defaultWhatsAppMessage) {
  const digits = digitsOnly(siteConfig.whatsapp);
  if (!digits) return "";
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function mapsHref() {
  if (siteConfig.mapsUrl) return siteConfig.mapsUrl;
  if (siteConfig.address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      siteConfig.address,
    )}`;
  }
  return "";
}

export function mapsEmbedHref() {
  if (siteConfig.mapsEmbedUrl) return siteConfig.mapsEmbedUrl;
  if (siteConfig.address) {
    return `https://www.google.com/maps?q=${encodeURIComponent(
      siteConfig.address,
    )}&output=embed`;
  }
  return "";
}

export const hasWhatsApp = Boolean(digitsOnly(siteConfig.whatsapp));
export const hasPhone = Boolean(digitsOnly(siteConfig.phone));
export const hasEmail = Boolean(siteConfig.email);
export const hasAddress = Boolean(siteConfig.address);
