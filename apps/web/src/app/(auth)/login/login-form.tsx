"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

type Status = "idle" | "sending" | "sent" | "error";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage(null);

    const { error } = await authClient.signIn.magicLink({
      email,
      callbackURL: `${window.location.origin}/dashboard`,
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message ?? "Impossible d'envoyer le lien");
      return;
    }

    setStatus("sent");
  };

  if (status === "sent") {
    return (
      <div className="space-y-4 rounded-xl border border-[#22d3ee]/30 bg-[#22d3ee]/5 p-6 text-center">
        <CheckCircle2 size={40} className="mx-auto text-[#22d3ee]" />
        <h3 className="text-lg font-semibold text-white">Lien envoyé</h3>
        <p className="text-sm text-[#94a3b8]">
          Vérifiez <span className="text-white font-medium">{email}</span> et
          cliquez sur le lien pour vous connecter.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-sm text-[#22d3ee] hover:text-[#06b6d4] transition-colors"
        >
          Utiliser une autre adresse
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-[#94a3b8]"
        >
          Adresse e-mail
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vous@entreprise.com"
          className="w-full h-12 px-4 rounded-xl bg-[#1e293b]/80 border border-[#2d4160]/60 text-white placeholder:text-[#475569] focus:outline-none focus:border-[#22d3ee]/50 focus:ring-2 focus:ring-[#22d3ee]/20 transition-all duration-200"
        />
      </div>

      {errorMessage && (
        <p className="text-sm text-red-400" role="alert">
          {errorMessage}
        </p>
      )}

      <motion.button
        type="submit"
        disabled={status === "sending"}
        className="w-full h-12 rounded-xl bg-gradient-to-r from-[#22d3ee] to-[#06b6d4] text-[#0f172a] font-semibold flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        whileHover={{ scale: status === "sending" ? 1 : 1.01 }}
        whileTap={{ scale: status === "sending" ? 1 : 0.99 }}
      >
        {status === "sending" ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Envoi du lien...
          </>
        ) : (
          "Recevoir un lien de connexion"
        )}
      </motion.button>

      <p className="text-xs text-[#64748b] text-center">
        Pas de mot de passe. Un lien magique sera envoyé à votre adresse e-mail.
      </p>
    </form>
  );
}
