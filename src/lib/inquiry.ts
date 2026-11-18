export const INQUIRY_SERVICE_KEY = "artco:inquiry-service";
export const INQUIRY_SERVICE_EVENT = "artco:inquiry-service";

export const inquiryServiceOptions = [
  "Vinyl Printing",
  "Flex Printing",
  "Laser Cutting",
  "UV Printing",
  "Engraving",
  "Paintings & Custom Artwork",
  "Custom Project",
  "Not sure yet",
] as const;

export function isKnownService(value: string) {
  return (inquiryServiceOptions as readonly string[]).includes(value);
}
