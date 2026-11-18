export type Service = {
  slug: string;
  index: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  position?: string;
};

export const services: Service[] = [
  {
    slug: "vinyl-printing",
    index: "01",
    title: "Vinyl Printing",
    description:
      "Custom vinyl printing for branding, promotional displays, decorative applications and visual projects.",
    image: "/images/services/vinyl.jpg",
    alt: "Hands trimming freshly printed sheets on a production table",
    position: "50% 55%",
  },
  {
    slug: "flex-printing",
    index: "02",
    title: "Flex Printing",
    description:
      "High-quality flex printing for banners, advertising displays, promotional graphics and signage.",
    image: "/images/services/flex.jpg",
    alt: "Large-format printer pulling a printed graphic through its rollers",
    position: "55% 50%",
  },
  {
    slug: "laser-cutting",
    index: "03",
    title: "Laser Cutting",
    description:
      "Precision laser cutting for custom shapes, signage, decorative pieces and creative production.",
    image: "/images/services/laser.jpg",
    alt: "Laser cutting head tracing a precise line across a sheet",
    position: "50% 45%",
  },
  {
    slug: "uv-printing",
    index: "04",
    title: "UV Printing",
    description:
      "Professional UV printing for customized graphics and suitable materials.",
    image: "/images/services/uv.jpg",
    alt: "Roll-fed wide format printer with printed material and warm orange rollers",
    position: "45% 50%",
  },
  {
    slug: "engraving",
    index: "05",
    title: "Engraving",
    description:
      "Detailed engraving for personalized designs, branding and decorative work.",
    image: "/images/services/engraving.jpg",
    alt: "Close-up of an engraving bit milling a detailed metal surface",
    position: "50% 50%",
  },
  {
    slug: "paintings-and-custom-artwork",
    index: "06",
    title: "Paintings & Custom Artwork",
    description:
      "Creative paintings, customized artwork and decorative visual pieces.",
    image: "/images/services/paintings.jpg",
    alt: "Artist painting a landscape at an easel",
    position: "50% 45%",
  },
];
