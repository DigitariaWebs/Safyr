"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="relative py-28 bg-[#1e293b] overflow-hidden"
    >
      {/* Top/bottom decorative lines */}
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-[#22d3ee]/25 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-linear-to-r from-transparent via-[#22d3ee]/15 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20 flex flex-col items-center gap-4"
        >
          <Badge variant="cyan">Comment ça marche</Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#f1f5f9]">
            Opérationnel en quelques jours, pas des mois
          </h2>
          <p className="text-lg text-[#94a3b8] max-w-xl">
            Notre configuration guidée met votre société de gardiennage en ligne
            rapidement sans perturber vos opérations de sécurité existantes.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line - seulement entre les 2 premiers points */}
          <div className="hidden lg:block absolute top-13 left-[calc(25%+32px)] right-[calc(25%+32px)] h-px">
            <div className="w-full h-full bg-linear-to-r from-[#22d3ee]/20 via-[#22d3ee]/50 to-[#22d3ee]/20" />
          </div>

          <div className="flex flex-col gap-12">
            {/* Première ligne : Points 1 et 2 */}
            <div className="grid sm:grid-cols-2 gap-8 items-start">
              {siteConfig.howItWorks.slice(0, 2).map((step, i) => {
                // Mapping des vidéos pour chaque étape
                const videos = [
                  "https://res.cloudinary.com/dpo7sqgyg/video/upload/rh_f6xn0n.mp4",
                  "https://res.cloudinary.com/dpo7sqgyg/video/upload/maincourante_hhghmi.mp4",
                  "https://res.cloudinary.com/dpo7sqgyg/video/upload/demo_mg9dxg.mp4",
                ];
                const videoSrc = videos[i];

                return (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: i * 0.12 }}
                    className="flex flex-col items-center text-center group h-full"
                  >
                    {/* Step number circle */}
                    <div className="relative mb-6">
                      <div className="w-16 h-16 rounded-full border-2 border-[#22d3ee]/40 bg-[#0f172a] flex items-center justify-center group-hover:border-[#22d3ee] transition-colors duration-300 shadow-[0_0_20px_rgba(34,211,238,0.1)] group-hover:shadow-[0_0_28px_rgba(34,211,238,0.25)]">
                        <span className="text-xl font-bold text-[#22d3ee]">
                          {step.step}
                        </span>
                      </div>
                      {/* Pulse ring */}
                      <div className="absolute inset-0 rounded-full border border-[#22d3ee]/20 scale-125 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500" />
                    </div>

                    <h3 className="text-lg font-semibold text-[#f1f5f9] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#64748b] group-hover:text-[#94a3b8] transition-colors leading-relaxed mb-4">
                      {step.description}
                    </p>

                    {/* Video */}
                    {videoSrc && (
                      <div className="w-full max-w-lg rounded-lg overflow-hidden border border-[#2d4160]/60 shadow-lg">
                        <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-auto pointer-events-none"
                          style={{ display: "block" }}
                        >
                          <source src={videoSrc} type="video/mp4" />
                          Votre navigateur ne supporte pas la lecture de vidéos.
                        </video>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Deuxième ligne : Point 3 centré */}
            <div className="flex justify-center">
              {siteConfig.howItWorks.slice(2, 3).map((step) => {
                const videoSrc =
                  "https://res.cloudinary.com/dpo7sqgyg/video/upload/demo_mg9dxg.mp4";
                const actualIndex = 2; // Index réel pour l'animation

                return (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: actualIndex * 0.12 }}
                    className="flex flex-col items-center text-center group max-w-md"
                  >
                    {/* Step number circle */}
                    <div className="relative mb-6">
                      <div className="w-16 h-16 rounded-full border-2 border-[#22d3ee]/40 bg-[#0f172a] flex items-center justify-center group-hover:border-[#22d3ee] transition-colors duration-300 shadow-[0_0_20px_rgba(34,211,238,0.1)] group-hover:shadow-[0_0_28px_rgba(34,211,238,0.25)]">
                        <span className="text-xl font-bold text-[#22d3ee]">
                          {step.step}
                        </span>
                      </div>
                      {/* Pulse ring */}
                      <div className="absolute inset-0 rounded-full border border-[#22d3ee]/20 scale-125 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500" />
                    </div>

                    <h3 className="text-lg font-semibold text-[#f1f5f9] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#64748b] group-hover:text-[#94a3b8] transition-colors leading-relaxed mb-4">
                      {step.description}
                    </p>

                    {/* Video */}
                    {videoSrc && (
                      <div className="w-full max-w-60 rounded-lg overflow-hidden border border-[#2d4160]/60 shadow-lg">
                        <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-auto pointer-events-none"
                          style={{ display: "block" }}
                        >
                          <source src={videoSrc} type="video/mp4" />
                          Votre navigateur ne supporte pas la lecture de vidéos.
                        </video>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
