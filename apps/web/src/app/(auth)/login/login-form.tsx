"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    router.push("/dashboard");
  };

  return (
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
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="vous@entreprise.com"
            className="w-full h-12 px-4 pr-4 rounded-xl bg-[#1e293b]/80 border border-[#2d4160]/60 text-white placeholder:text-[#475569] focus:outline-none focus:border-[#22d3ee]/50 focus:ring-2 focus:ring-[#22d3ee]/20 transition-all duration-200"
          />
        </div>
      </div>

      {/* Password field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[#94a3b8]"
          >
            Mot de passe
          </label>
          <Link
            href="/forgot-password"
            className="text-xs text-[#22d3ee] hover:text-[#06b6d4] transition-colors"
          >
            Mot de passe oublié ?
          </Link>
        </div>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
            className="w-full h-12 px-4 pr-12 rounded-xl bg-[#1e293b]/80 border border-[#2d4160]/60 text-white placeholder:text-[#475569] focus:outline-none focus:border-[#22d3ee]/50 focus:ring-2 focus:ring-[#22d3ee]/20 transition-all duration-200"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#94a3b8] transition-colors p-1"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Remember me */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            checked={form.remember}
            onChange={(e) => setForm({ ...form, remember: e.target.checked })}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
              form.remember
                ? "bg-[#22d3ee] border-[#22d3ee]"
                : "border-[#2d4160] group-hover:border-[#3d5170]"
            }`}
          >
            {form.remember && (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-3 h-3 text-[#0f172a]"
                viewBox="0 0 12 12"
                fill="none"
              >
                <motion.path
                  d="M10 3L4.5 8.5L2 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                />
              </motion.svg>
            )}
          </div>
        </div>
        <span className="text-sm text-[#64748b] group-hover:text-[#94a3b8] transition-colors">
          Se souvenir de moi
        </span>
      </label>

      {/* Submit button */}
      <motion.button
        type="submit"
        disabled={loading}
        className="w-full h-12 rounded-xl bg-gradient-to-r from-[#22d3ee] to-[#06b6d4] text-[#0f172a] font-semibold flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        whileHover={{ scale: loading ? 1 : 1.01 }}
        whileTap={{ scale: loading ? 1 : 0.99 }}
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Connexion en cours...
          </>
        ) : (
          "Se connecter"
        )}
      </motion.button>
    </form>
  );
}
