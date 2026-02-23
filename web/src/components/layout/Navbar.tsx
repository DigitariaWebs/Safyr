"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { assets } from "@/config/assets";
import { useUiStore } from "@/lib/stores/uiStore";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUiStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    closeMobileMenu();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[#0f172a]/90 backdrop-blur-xl border-b border-[#2d4160]/60 shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
            : "bg-transparent",
        )}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center group transition-opacity hover:opacity-90"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            aria-label={`${siteConfig.name} — retour en haut`}
          >
            <Image
              src={assets.logo.src}
              alt={assets.logo.alt}
              width={assets.logo.width}
              height={assets.logo.height}
              priority
              className="h-11 w-auto object-contain drop-shadow-[0_0_8px_rgba(34,211,238,0.25)] group-hover:drop-shadow-[0_0_14px_rgba(34,211,238,0.4)] transition-all duration-300"
            />
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {siteConfig.nav.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="px-4 py-2 text-sm text-[#94a3b8] hover:text-[#f1f5f9] rounded-md hover:bg-[rgba(255,255,255,0.05)] transition-all duration-200 cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleNavClick("#contact")}
            >
              Réserver une démo
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleNavClick("#contact")}
            >
              Nous contacter
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => toggleMobileMenu()}
            className="md:hidden text-[#94a3b8] hover:text-[#f1f5f9] p-2 rounded-md hover:bg-[rgba(255,255,255,0.05)] transition-all"
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 inset-x-0 z-40 bg-[#0f172a]/95 backdrop-blur-xl border-b border-[#2d4160] md:hidden"
          >
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
              {siteConfig.nav.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className="text-left px-4 py-3 text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-all text-sm cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-3 flex flex-col gap-2 border-t border-[#2d4160]">
                <Button
                  variant="secondary"
                  onClick={() => handleNavClick("#contact")}
                  className="w-full justify-center"
                >
                  Réserver une démo
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleNavClick("#contact")}
                  className="w-full justify-center"
                >
                  Nous contacter
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
