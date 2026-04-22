"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Mail, CheckCircle2 } from "lucide-react";

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 size={32} className="text-green-400" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-3">E-mail envoyé</h2>
        <p className="text-[#64748b] mb-8">
          Nous avons envoyé un lien de réinitialisation à{" "}
          <span className="text-white font-medium">{email}</span>
        </p>
        <p className="text-sm text-[#475569] mb-6">
          Vous n&apos;avez pas reçu l&apos;e-mail ?{" "}
          <button
            onClick={() => setSent(false)}
            className="text-[#fb923c] hover:text-[#f59e0b] transition-colors"
          >
            Renvoyer
          </button>
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-[#fb923c] hover:text-[#f59e0b] transition-colors"
        >
          <ArrowLeft size={16} />
          Retour à la connexion
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[#fb923c]/10 flex items-center justify-center mx-auto mb-4">
          <Mail size={24} className="text-[#fb923c]" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Mot de passe oublié
        </h2>
        <p className="text-[#64748b]">
          Entrez votre adresse e-mail et nous vous enverrons un lien pour
          réinitialiser votre mot de passe.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email field */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#94a3b8]"
          >
            Adresse e-mail
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@entreprise.com"
              className="w-full h-12 px-4 rounded-xl bg-[#1e293b]/80 border border-[#2d4160]/60 text-white placeholder:text-[#475569] focus:outline-none focus:border-[#fb923c]/50 focus:ring-2 focus:ring-[#fb923c]/20 transition-all duration-200"
            />
          </div>
        </div>

        {/* Submit button */}
        <motion.button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-linear-to-r from-[#fb923c] to-[#f59e0b] text-[#0f172a] font-semibold flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(251,146,60,0.4)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.99 }}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Envoi en cours...
            </>
          ) : (
            "Envoyer le lien de réinitialisation"
          )}
        </motion.button>
      </form>

      {/* Back link */}
      <p className="mt-6 text-center text-sm text-[#64748b]">
        Vous vous souvenez de votre mot de passe ?{" "}
        <Link
          href="/login"
          className="text-[#fb923c] hover:text-[#f59e0b] font-medium transition-colors"
        >
          Se connecter
        </Link>
      </p>
    </>
  );
}
