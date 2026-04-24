import { z } from "zod";

// TODO: will replace inline org and employee definitions when i figure out how to do it
// for now ./shared is not being read by nestjs

export const stripSpaces = (v: string) => v.replace(/\s+/g, "");
export const upperTrim = (v: string) => v.trim().toUpperCase();
export const plainTrim = (v: string) => v.trim();

export const optionalPattern = (
  pattern: RegExp,
  message: string,
  normalize?: (v: string) => string,
) =>
  z
    .string()
    .refine(
      (v) => v === "" || pattern.test(normalize ? normalize(v) : v),
      message,
    )
    .optional();

export const optionalText = (
  max: number,
  message = `${max} caractères maximum`,
) => z.string().trim().max(max, message).optional();

export const isIsoDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v);

export const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const NAME_REGEX = /^[\p{L}][\p{L}\s'’-]*$/u;
export const NAME_MSG =
  "Caractères autorisés: lettres, espaces, tirets, apostrophes";

export const NameSchema = z
  .string()
  .trim()
  .min(1, "Champ requis")
  .max(100, "100 caractères maximum")
  .regex(NAME_REGEX, NAME_MSG);

export const OptionalNameSchema = z
  .string()
  .refine(
    (v) => v === "" || (v.trim().length <= 100 && NAME_REGEX.test(v.trim())),
    "Nom invalide",
  )
  .optional();

export const EmailSchema = z
  .string()
  .refine(
    (v) =>
      v === "" || (v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)),
    "Email invalide",
  )
  .optional();

export const PhoneFrSchema = optionalPattern(
  /^(?:(?:\+|00)33|0)[1-9]\d{8}$/,
  "Numéro de téléphone invalide (format français)",
  stripSpaces,
);

export const SsnFrSchema = optionalPattern(
  /^[12]\d{2}(?:0[1-9]|1[0-2])(?:2[AB]|\d{2})\d{3}\d{3}\d{2}$/,
  "Numéro de sécurité sociale invalide",
  stripSpaces,
);

export const BirthDateSchema = z
  .string()
  .refine((v) => v === "" || isIsoDate(v), "Date invalide")
  .refine(
    (v) => v === "" || new Date(v) < startOfToday(),
    "La date de naissance doit être dans le passé",
  )
  .optional();

export const PastOrTodayDate = z
  .string()
  .refine((v) => v === "" || isIsoDate(v), "Date invalide")
  .refine(
    (v) => v === "" || new Date(v) <= startOfToday(),
    "La date ne peut pas être dans le futur",
  )
  .optional();

export const AnyIsoDate = z
  .string()
  .refine((v) => v === "" || isIsoDate(v), "Date invalide")
  .optional();
