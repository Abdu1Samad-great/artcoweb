export const categories = [
  "Vinyl Printing",
  "Flex Printing",
  "Laser Cutting",
  "UV Printing",
  "Engraving",
  "Paintings",
  "Custom Projects",
] as const;

export type Category = (typeof categories)[number];

export type Project = {
  slug: string;
  title: string;
  category: Category;
  description: string;
  image: string;
  alt: string;
  position?: string;
  featured?: boolean;
};

/**
 * These are production and material studies used as portfolio placeholders.
 * Replace the image files and copy with real ARTCO project photography when available.
 * Keep the category values aligned with `categories` above.
 */
export const projects: Project[] = [
  {
    slug: "ink-and-grain",
    title: "Ink & Grain",
    category: "Vinyl Printing",
    description:
      "A production study in layered ink, registration and clean hand-finished edges.",
    image: "/images/projects/ink-and-grain.jpg",
    alt: "Hands pulling a colourful screen print from a production press",
    position: "50% 55%",
  },
  {
    slug: "signal-study",
    title: "Signal Study",
    category: "Flex Printing",
    description:
      "An open-air flex print study exploring scale, silence and a single empty frame.",
    image: "/images/projects/signal-study.jpg",
    alt: "Blank outdoor billboard against a pale sky",
    position: "50% 50%",
  },
  {
    slug: "light-cut",
    title: "Light Cut",
    category: "Laser Cutting",
    description:
      "A study of heat, precision and the fine line between material and light.",
    image: "/images/projects/light-cut.jpg",
    alt: "Sparks and a bright cut line at a laser cutting machine",
    position: "50% 50%",
  },
  {
    slug: "paper-architecture",
    title: "Paper Architecture",
    category: "UV Printing",
    description:
      "Printed surfaces stacked into quiet geometry; a study in weight and repetition.",
    image: "/images/projects/paper-architecture.jpg",
    alt: "Neatly stacked printed sheets with a small printed card on top",
    position: "50% 50%",
  },
  {
    slug: "imprint",
    title: "Imprint",
    category: "Engraving",
    description:
      "Typography incised into metal, capturing the texture of a considered mark.",
    image: "/images/projects/imprint.jpg",
    alt: "Close-up of engraved lettering on a metal surface",
    position: "50% 50%",
  },
  {
    slug: "colour-field",
    title: "Colour Field",
    category: "Paintings",
    description:
      "An in-progress landscape study in warm pigment, built up in quiet layers.",
    image: "/images/projects/colour-field.jpg",
    alt: "Artist applying paint to a landscape canvas in a studio",
    position: "50% 45%",
  },
  {
    slug: "surface-study",
    title: "Surface Study",
    category: "Paintings",
    description:
      "A detail of layered brushwork exploring movement, warmth and texture.",
    image: "/images/projects/surface-study.jpg",
    alt: "Close-up of warm orange and red paint strokes on canvas",
    position: "50% 50%",
  },
  {
    slug: "warm-grain",
    title: "Warm Grain",
    category: "Custom Projects",
    description:
      "A bespoke making study where material, hand and finish meet.",
    image: "/images/projects/warm-grain.jpg",
    alt: "Craftsperson working at a bench in a warm timber workshop",
    position: "50% 45%",
  },
  {
    slug: "sign-study",
    title: "Sign Study",
    category: "Custom Projects",
    description:
      "Hand-lettered window signage; a study in character, contrast and craft.",
    image: "/images/projects/sign-study.jpg",
    alt: "Hand-painted typographic signage on a shop window",
    position: "50% 50%",
  },
];
