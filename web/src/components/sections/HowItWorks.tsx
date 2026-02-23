"use client";

import { useState, useEffect } from "react";
import { useReducedMotion, motion, AnimatePresence } from "framer-motion";
import { X, Maximize2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const VIDEOS = [
  "https://res.cloudinary.com/dpo7sqgyg/video/upload/rh_f6xn0n.mp4",
  "https://res.cloudinary.com/dpo7sqgyg/video/upload/maincourante_hhghmi.mp4",
  "https://res.cloudinary.com/dpo7sqgyg/video/upload/demo_mg9dxg.mp4",
];

const MOBILE_VIDEO_MAX_W = "max-w-[240px]";

function VideoLightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0f172a]/90 backdrop-blur-md" />

      {/* Video container */}
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 24 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="relative z-10 w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden border border-[#2d4160]/60 shadow-[0_32px_80px_rgba(0,0,0,0.7)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top glow line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#22d3ee]/50 to-transparent z-10" />

        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto max-h-[90vh] object-contain block"
        >
          <source src={src} type="video/mp4" />
        </video>
      </motion.div>

      {/* Close button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        onClick={onClose}
        className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#1e293b]/90 border border-[#2d4160] flex items-center justify-center text-[#94a3b8] hover:text-[#f1f5f9] hover:border-[#22d3ee]/40 hover:bg-[#22d3ee]/10 transition-all duration-200 cursor-pointer"
        aria-label="Fermer"
      >
        <X size={16} />
      </motion.button>
    </motion.div>
  );
}

function StepCard({
  step,
  index,
  isMobile = false,
  onVideoClick,
}: {
  step: (typeof siteConfig.howItWorks)[number];
  index: number;
  isMobile?: boolean;
  onVideoClick: (src: string) => void;
}) {
  const shouldReduce = useReducedMotion();
  const videoSrc = VIDEOS[index];

  return (
    <motion.div
      initial={{ opacity: 0, y: 36, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.65,
        delay: index * 0.14,
        ease: EASE,
      }}
      className="flex flex-col items-center text-center group"
    >
      {/* Step number circle */}
      <div className="relative mb-6">
        {!shouldReduce && (
          <motion.div
            className="absolute inset-0 rounded-full border border-[#22d3ee]/25"
            animate={{
              scale: [1, 1.55, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2.8,
              delay: 0.6 + index * 0.2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        )}

        <motion.div
          initial={shouldReduce ? {} : { scale: 0.7, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{
            duration: 0.5,
            delay: 0.2 + index * 0.14,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          className="w-16 h-16 rounded-full border-2 border-[#22d3ee]/40 bg-[#0f172a] flex items-center justify-center
                     group-hover:border-[#22d3ee] group-hover:shadow-[0_0_28px_rgba(34,211,238,0.25)]
                     transition-all duration-300"
          style={{ boxShadow: "0 0 20px rgba(34,211,238,0.08)" }}
        >
          <span className="text-xl font-bold text-[#22d3ee]">{step.step}</span>
        </motion.div>
      </div>

      <h3 className="text-lg font-semibold text-[#f1f5f9] mb-3">
        {step.title}
      </h3>
      <p className="text-sm text-[#64748b] group-hover:text-[#94a3b8] transition-colors duration-200 leading-relaxed mb-5 max-w-sm">
        {step.description}
      </p>

      {/* Video preview */}
      {videoSrc && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 0.6,
            delay: 0.2 + index * 0.14,
            ease: EASE,
          }}
          onClick={() => onVideoClick(videoSrc)}
          className={`relative w-full ${isMobile ? MOBILE_VIDEO_MAX_W : "max-w-lg"} rounded-xl overflow-hidden border border-[#2d4160]/60 shadow-[0_8px_32px_rgba(0,0,0,0.4)] group-hover:border-[#22d3ee]/30 group-hover:shadow-[0_8px_40px_rgba(34,211,238,0.08)] transition-all duration-300 cursor-zoom-in`}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto pointer-events-none block"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>

          {/* Expand hint overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 bg-[#0f172a]/30">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0f172a]/80 border border-[#2d4160] backdrop-blur-sm">
              <Maximize2 size={13} className="text-[#22d3ee]" />
              <span className="text-xs text-[#94a3b8] font-medium">
                Agrandir
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function HowItWorks() {
  const shouldReduce = useReducedMotion();
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  return (
    <section
      id="how-it-works"
      className="relative py-28 bg-[#1e293b] overflow-hidden"
    >
      {/* Top/bottom decorative lines */}
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-[#22d3ee]/25 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-linear-to-r from-transparent via-[#22d3ee]/15 to-transparent" />

      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(34,211,238,0.04) 0%, transparent 65%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center mb-20 flex flex-col items-center gap-4"
        >
          <Badge variant="cyan">Comment ça marche</Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#f1f5f9] leading-tight">
            Opérationnel en quelques jours,{" "}
            <span className="text-[#22d3ee]">pas des mois</span>
          </h2>
          <p className="text-lg text-[#94a3b8] max-w-xl">
            Notre configuration guidée met votre société de gardiennage en ligne
            rapidement sans perturber vos opérations de sécurité existantes.
          </p>
        </motion.div>

        {/* Steps layout */}
        <div className="flex flex-col gap-20">
          {/* Row 1 — steps 01 & 02 with animated connector */}
          <div className="relative">
            {/* Connector line between step 01 and 02 */}
            <div className="hidden lg:block absolute top-8 left-[calc(25%+2rem)] right-[calc(25%+2rem)] h-px overflow-hidden">
              <div className="absolute inset-0 bg-[#2d4160]/60" />
              {!shouldReduce && (
                <motion.div
                  className="absolute inset-y-0 left-0 bg-linear-to-r from-[#22d3ee]/50 via-[#22d3ee] to-[#22d3ee]/50"
                  initial={{ scaleX: 0, originX: "left" }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
                />
              )}
              {!shouldReduce && (
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#22d3ee]"
                  style={{ boxShadow: "0 0 8px rgba(34,211,238,0.8)" }}
                  initial={{ left: "0%" }}
                  whileInView={{ left: ["0%", "100%"] }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 1.4,
                    delay: 0.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                />
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-12 items-start">
              {siteConfig.howItWorks.slice(0, 2).map((step, i) => (
                <StepCard
                  key={step.step}
                  step={step}
                  index={i}
                  onVideoClick={setLightboxSrc}
                />
              ))}
            </div>
          </div>

          {/* Row 2 — step 03 centred (mobile app) */}
          <div className="flex flex-col items-center">
            <div className="relative h-12 w-px mb-2 overflow-hidden">
              <div className="absolute inset-0 bg-[#2d4160]/60" />
              {!shouldReduce && (
                <motion.div
                  className="absolute inset-x-0 top-0 bg-linear-to-b from-[#22d3ee]/70 to-[#22d3ee]/20"
                  initial={{ scaleY: 0, originY: "top" }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
                />
              )}
            </div>

            <StepCard
              step={siteConfig.howItWorks[2]}
              index={2}
              isMobile
              onVideoClick={setLightboxSrc}
            />
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxSrc && (
          <VideoLightbox
            src={lightboxSrc}
            onClose={() => setLightboxSrc(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
