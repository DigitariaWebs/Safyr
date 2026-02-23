"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useUiStore } from "@/lib/stores/uiStore";

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { contactFormSubmitted: submitted, setContactFormSubmitted } =
    useUiStore();

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setContactFormSubmitted(true);
    setLoading(false);
  };

  const contactDetails = [
    {
      icon: Mail,
      label: "Envoyez-nous un e-mail",
      value: siteConfig.contact.email,
      href: `mailto:${siteConfig.contact.email}`,
    },
    {
      icon: Phone,
      label: "Appelez-nous",
      value: siteConfig.contact.phone,
      href: `tel:${siteConfig.contact.phone}`,
    },
    {
      icon: MapPin,
      label: "Visitez-nous",
      value: siteConfig.contact.address,
      href: "#",
    },
  ];

  return (
    <section
      id="contact"
      ref={ref}
      className="relative py-28 bg-[#0f172a] overflow-hidden"
    >
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-100"
          style={{
            background:
              "radial-gradient(ellipse at top, rgba(34,211,238,0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 flex flex-col items-center gap-4"
        >
          <Badge variant="cyan">Contact</Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#f1f5f9]">
            {siteConfig.contact.headline}
          </h2>
          <p className="text-lg text-[#94a3b8] max-w-xl">
            {siteConfig.contact.subheadline}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* Left — contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-2 flex flex-col gap-5"
          >
            {contactDetails.map((detail) => (
              <a
                key={detail.label}
                href={detail.href}
                className="flex items-start gap-4 p-5 rounded-xl border border-[#2d4160]/60 bg-[#1a2d45]/40 hover:border-[#22d3ee]/40 hover:bg-[#1a2d45]/70 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#22d3ee]/10 flex items-center justify-center shrink-0 group-hover:bg-[#22d3ee]/20 transition-colors mt-0.5">
                  <detail.icon size={18} className="text-[#22d3ee]" />
                </div>
                <div>
                  <p className="text-xs text-[#64748b] mb-0.5">
                    {detail.label}
                  </p>
                  <p className="text-sm text-[#94a3b8] group-hover:text-[#f1f5f9] transition-colors leading-relaxed">
                    {detail.value}
                  </p>
                </div>
              </a>
            ))}
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="lg:col-span-3"
          >
            <div className="p-8 rounded-2xl border border-[#2d4160]/60 bg-[#1a2d45]/40">
              {submitted ? (
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                  <CheckCircle2 size={48} className="text-[#10b981]" />
                  <h3 className="text-xl font-semibold text-[#f1f5f9]">
                    Message envoyé !
                  </h3>
                  <p className="text-[#94a3b8] text-sm max-w-sm">
                    Merci de nous avoir contactés. Notre équipe vous répondra
                    dans un délai d&apos;un jour ouvrable.
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setContactFormSubmitted(false)}
                  >
                    Envoyer un autre message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="name"
                        className="text-xs font-medium text-[#94a3b8]"
                      >
                        Nom complet <span className="text-[#22d3ee]">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Jean Dupont"
                        className="h-10 px-3 rounded-lg bg-[#0f172a] border border-[#2d4160] text-[#f1f5f9] text-sm placeholder:text-[#3d5170] focus:outline-none focus:ring-2 focus:ring-[#22d3ee]/40 focus:border-[#22d3ee]/60 transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="email"
                        className="text-xs font-medium text-[#94a3b8]"
                      >
                        E-mail professionnel{" "}
                        <span className="text-[#22d3ee]">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="jean@entreprise.com"
                        className="h-10 px-3 rounded-lg bg-[#0f172a] border border-[#2d4160] text-[#f1f5f9] text-sm placeholder:text-[#3d5170] focus:outline-none focus:ring-2 focus:ring-[#22d3ee]/40 focus:border-[#22d3ee]/60 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="company"
                      className="text-xs font-medium text-[#94a3b8]"
                    >
                      Nom de l&apos;entreprise
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Acme Corp"
                      className="h-10 px-3 rounded-lg bg-[#0f172a] border border-[#2d4160] text-[#f1f5f9] text-sm placeholder:text-[#3d5170] focus:outline-none focus:ring-2 focus:ring-[#22d3ee]/40 focus:border-[#22d3ee]/60 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="message"
                      className="text-xs font-medium text-[#94a3b8]"
                    >
                      Message <span className="text-[#22d3ee]">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Parlez-nous de la taille de votre équipe et de ce que vous souhaitez résoudre..."
                      className="px-3 py-2.5 rounded-lg bg-[#0f172a] border border-[#2d4160] text-[#f1f5f9] text-sm placeholder:text-[#3d5170] focus:outline-none focus:ring-2 focus:ring-[#22d3ee]/40 focus:border-[#22d3ee]/60 transition-all resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={loading}
                    className="mt-2 w-full justify-center"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Envoi en cours...
                      </span>
                    ) : (
                      <>
                        <Send size={16} />
                        Envoyer le message
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-[#64748b] text-center">
                    Nous répondons dans un délai d&apos;un jour ouvrable. Jamais
                    de spam.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
