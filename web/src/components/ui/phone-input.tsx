"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const COUNTRY_CODES = [
  { code: "+33", country: "FR", label: "France (+33)" },
  { code: "+32", country: "BE", label: "Belgique (+32)" },
  { code: "+41", country: "CH", label: "Suisse (+41)" },
  { code: "+44", country: "GB", label: "Royaume-Uni (+44)" },
  { code: "+49", country: "DE", label: "Allemagne (+49)" },
  { code: "+34", country: "ES", label: "Espagne (+34)" },
  { code: "+39", country: "IT", label: "Italie (+39)" },
  { code: "+31", country: "NL", label: "Pays-Bas (+31)" },
  { code: "+352", country: "LU", label: "Luxembourg (+352)" },
  { code: "+1", country: "US", label: "États-Unis (+1)" },
  { code: "+1", country: "CA", label: "Canada (+1)" },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export function PhoneInput({
  value,
  onChange,
  placeholder = "6 12 34 56 78",
  className,
  required,
}: PhoneInputProps) {
  const [countryCode, setCountryCode] = useState("+33");

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/[^\d\s]/g, "");
    onChange(input);
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\s/g, "");
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4)}`;
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)}`;
  };

  const displayValue = value ? formatPhoneNumber(value) : "";

  return (
    <div className={cn("flex", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-1 h-9 px-3 rounded-l-lg bg-[#1e293b]/80 border border-[#2d4160]/60 border-r-0 text-white text-xs hover:border-[#a78bfa]/50 focus:outline-none focus:border-[#a78bfa]/50 transition-all duration-200"
          >
            <span>{countryCode}</span>
            <ChevronDown size={12} className="text-[#64748b]" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="bg-[#1e293b] border-[#2d4160] max-h-60 overflow-y-auto"
          style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}
          align="start"
        >
          {COUNTRY_CODES.map((country) => (
            <DropdownMenuItem
              key={`${country.code}-${country.country}`}
              onClick={() => setCountryCode(country.code)}
              className="text-xs text-[#94a3b8] focus:bg-[#2d4160] focus:text-white cursor-pointer"
            >
              <span className="flex-1">{country.label}</span>
              {countryCode === country.code && (
                <span className="text-[#a78bfa]">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <input
        type="tel"
        required={required}
        value={displayValue}
        onChange={handleNumberChange}
        placeholder={placeholder}
        className="flex-1 h-9 px-3 rounded-r-lg bg-[#1e293b]/80 border border-[#2d4160]/60 text-white text-xs placeholder:text-[#475569] focus:outline-none focus:border-[#a78bfa]/50 focus:ring-1 focus:ring-[#a78bfa]/20 transition-all duration-200"
      />
    </div>
  );
}
