"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export function ResetPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const passwordStrength = () => {
    let strength = 0;
    if (form.password.length >= 8) strength++;
    if (/[A-Z]/.test(form.password)) strength++;
    if (/[0-9]/.test(form.password)) strength++;
    if (/[^A-Za-z0-9]/.test(form.password)) strength++;
    return strength;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSuccess(true);
    setLoading(false);
  };

  const strength = passwordStrength();
  const strengthLabels = ["Faible", "Moyen", "Bon", "Fort"];
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
  ];

  if (success) {
    return (
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 size={32} className="text-green-400" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-3">
          Mot de passe réinitialisé
        </h2>
        <p className="text-[#64748b] mb-8">
          Votre mot de passe a été modifié avec succès. Vous pouvez maintenant
          vous connecter avec votre nouveau mot de passe.
        </p>
        <motion.button
          onClick={() => router.push("/login")}
          className="w-full h-12 rounded-xl bg-linear-to-r from-[#34d399] to-[#10b981] text-[#0f172a] font-semibold flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(52,211,153,0.4)] transition-all duration-300"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          Se connecter
        </motion.button>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[#34d399]/10 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-[#34d399]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Créer un nouveau mot de passe
        </h2>
        <p className="text-[#64748b]">
          Votre nouveau mot de passe doit être différent des mots de passe
          précédemment utilisés.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Password field */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[#94a3b8]"
          >
            Nouveau mot de passe
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Créer un mot de passe"
              className="w-full h-11 px-4 pr-12 rounded-xl bg-[#1e293b]/80 border border-[#2d4160]/60 text-white placeholder:text-[#475569] focus:outline-none focus:border-[#34d399]/50 focus:ring-2 focus:ring-[#34d399]/20 transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#94a3b8] transition-colors p-1"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {form.password && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      i <= strength
                        ? strengthColors[strength - 1]
                        : "bg-[#2d4160]"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-[#64748b]">
                Force:{" "}
                <span
                  className={
                    strength >= 3
                      ? "text-green-400"
                      : strength >= 2
                        ? "text-yellow-400"
                        : "text-red-400"
                  }
                >
                  {strengthLabels[strength] || "Trop court"}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password field */}
        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-[#94a3b8]"
          >
            Confirmer le mot de passe
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              minLength={8}
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              placeholder="Confirmer le mot de passe"
              className="w-full h-11 px-4 pr-12 rounded-xl bg-[#1e293b]/80 border border-[#2d4160]/60 text-white placeholder:text-[#475569] focus:outline-none focus:border-[#34d399]/50 focus:ring-2 focus:ring-[#34d399]/20 transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#94a3b8] transition-colors p-1"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {form.confirmPassword && form.password !== form.confirmPassword && (
            <p className="text-xs text-red-400">
              Les mots de passe ne correspondent pas
            </p>
          )}
        </div>

        {/* Requirements */}
        <div className="space-y-2 text-xs text-[#64748b]">
          <p className="font-medium text-[#94a3b8] mb-2">
            Le mot de passe doit contenir :
          </p>
          <ul className="space-y-1">
            <li
              className={`flex items-center gap-2 ${form.password.length >= 8 ? "text-green-400" : ""}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${form.password.length >= 8 ? "bg-green-400" : "bg-[#2d4160]"}`}
              />
              Au moins 8 caractères
            </li>
            <li
              className={`flex items-center gap-2 ${/[A-Z]/.test(form.password) ? "text-green-400" : ""}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(form.password) ? "bg-green-400" : "bg-[#2d4160]"}`}
              />
              Une lettre majuscule
            </li>
            <li
              className={`flex items-center gap-2 ${/[0-9]/.test(form.password) ? "text-green-400" : ""}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(form.password) ? "bg-green-400" : "bg-[#2d4160]"}`}
              />
              Un chiffre
            </li>
            <li
              className={`flex items-center gap-2 ${/[^A-Za-z0-9]/.test(form.password) ? "text-green-400" : ""}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${/[^A-Za-z0-9]/.test(form.password) ? "bg-green-400" : "bg-[#2d4160]"}`}
              />
              Un caractère spécial
            </li>
          </ul>
        </div>

        {/* Submit button */}
        <motion.button
          type="submit"
          disabled={
            loading ||
            form.password !== form.confirmPassword ||
            form.password.length < 8
          }
          className="w-full h-12 rounded-xl bg-linear-to-r from-[#34d399] to-[#10b981] text-[#0f172a] font-semibold flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(52,211,153,0.4)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.99 }}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Réinitialisation...
            </>
          ) : (
            "Réinitialiser le mot de passe"
          )}
        </motion.button>
      </form>
    </>
  );
}
