"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 bg-[#0f172a]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-6 text-center"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-[#f1f5f9] mb-6 font-display">
          Prêt à transformer la gestion de votre société de sécurité ?
        </h2>
        <p className="text-lg text-[#94a3b8] mb-8 max-w-2xl mx-auto">
          Rejoignez plus de 200 sociétés de sécurité privée qui font confiance à
          Safyr pour piloter leurs équipes au quotidien.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" size="lg" asChild>
            <Link href="/contact">
              Nous contacter
              <ArrowRight size={18} />
            </Link>
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <Link href="/login">Connexion</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;
