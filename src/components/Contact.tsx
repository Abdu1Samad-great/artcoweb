import {
  hasEmail,
  hasPhone,
  hasWhatsApp,
  mapsEmbedHref,
  mapsHref,
  siteConfig,
  telHref,
  whatsappHref,
} from "@/data/site";
import SectionLabel from "@/components/ui/SectionLabel";
import AnimatedHeading from "@/components/ui/AnimatedHeading";
import Reveal from "@/components/ui/Reveal";
import { ArrowUpRight, MapPin, Phone, Mail } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/Icons";

export default function Contact() {
  const address = siteConfig.address.replace(/\|/g, "\n");
  const mapUrl = mapsHref();
  const embedUrl = mapsEmbedHref();

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="section-pad relative overflow-hidden"
    >
      <div className="shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <SectionLabel>Let's Connect</SectionLabel>
            </Reveal>
            <AnimatedHeading
              id="contact-heading"
              text={"Have A Project\nIn Mind?"}
              className="display-section mt-5 max-w-[12ch]"
            />
          </div>
          <Reveal className="max-w-[40ch]" delay={0.1}>
            <p className="body-copy">
              Tell us what you have in mind. We'd love to help bring your next
              idea to life.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid items-center gap-8 lg:grid-cols-12">
          {/* Left: Google Maps */}
          <div className="lg:col-span-7">
            <Reveal>
              <div
                className="rounded-2xl bg-[#17263B] p-4 shadow-md md:p-6"
                style={{ border: "1px solid rgba(255, 255, 255, 0.1)" }}
              >
                <p className="eyebrow">Location</p>
                <h3 className="mt-3 text-[1.5rem] font-bold leading-tight text-ink">
                  Find Us Here
                </h3>
                <p className="mt-2 text-[14px] leading-[1.6] text-slate">
                  Visit our studio or get directions straight to ARTCO.
                </p>

                <div
                  className="mt-5 overflow-hidden rounded-2xl bg-[#111C2E]"
                  style={{ border: "1px solid rgba(255, 255, 255, 0.1)" }}
                >
                  {embedUrl ? (
                    <div className="relative w-full" style={{ paddingBottom: "62%" }}>
                      <iframe
                        title="ARTCO location on Google Maps"
                        src={embedUrl}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full border-0"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-video items-center justify-center text-slate">
                      Map unavailable
                    </div>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-4">
                  {mapUrl ? (
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary"
                    >
                      <MapPin size={17} />
                      Get Directions
                      <ArrowUpRight size={15} />
                    </a>
                  ) : null}
                  {mapUrl ? (
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#8DBBEE] hover:gap-2.5 transition-all"
                    >
                      Open in Google Maps
                      <ArrowUpRight size={13} />
                    </a>
                  ) : null}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: Direct Contact, vertically centered */}
          <div className="flex items-center lg:col-span-5">
            <Reveal delay={0.08} className="w-full">
              <div
                className="rounded-2xl bg-[#17263B] p-7 shadow-md md:p-9"
                style={{ border: "1px solid rgba(255, 255, 255, 0.1)" }}
              >
                <p className="eyebrow">Direct contact</p>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-4 rounded-2xl bg-[#111C2E] p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2878D0]/10 text-[#2878D0]">
                      <Phone size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                        Phone
                      </p>
                      {hasPhone ? (
                        <a
                          href={telHref()}
                          className="block truncate text-[15px] font-medium text-ink hover:text-[#8DBBEE]"
                        >
                          {siteConfig.phone}
                        </a>
                      ) : (
                        <span className="text-[14px] text-slate">
                          Available on request
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl bg-[#111C2E] p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#17263B] text-[#8DBBEE]">
                      <WhatsAppIcon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                        WhatsApp
                      </p>
                      {hasWhatsApp ? (
                        <a
                          href={whatsappHref()}
                          target="_blank"
                          rel="noreferrer"
                          className="block truncate text-[15px] font-medium text-ink hover:text-[#8DBBEE]"
                        >
                          {siteConfig.whatsapp}
                        </a>
                      ) : (
                        <span className="text-[14px] text-slate">
                          Available on request
                        </span>
                      )}
                    </div>
                  </div>

                  {hasEmail ? (
                    <div className="flex items-center gap-4 rounded-2xl bg-[#111C2E] p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2878D0]/10 text-[#2878D0]">
                        <Mail size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                          Email
                        </p>
                        <a
                          href={`mailto:${siteConfig.email}`}
                          className="block truncate text-[15px] font-medium text-ink hover:text-[#8DBBEE]"
                        >
                          {siteConfig.email}
                        </a>
                      </div>
                    </div>
                  ) : null}

                  {siteConfig.address ? (
                    <div className="flex items-center gap-4 rounded-2xl bg-[#111C2E] p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2878D0]/10 text-[#2878D0]">
                        <MapPin size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                          Studio
                        </p>
                        <p className="whitespace-pre-line text-[15px] font-medium text-ink">
                          {address}
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {hasPhone ? (
                    <a href={telHref()} className="btn-primary w-full sm:w-auto">
                      <Phone size={17} />
                      Call
                    </a>
                  ) : null}
                  {hasWhatsApp ? (
                    <a
                      href={whatsappHref()}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-ghost w-full sm:w-auto"
                    >
                      <WhatsAppIcon size={17} />
                      WhatsApp
                    </a>
                  ) : null}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}