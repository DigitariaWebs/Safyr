interface UserDisplaySource {
  name?: string | null;
  email?: string | null;
  role?: string | null;
  image?: string | null;
}

interface UserDisplayOptions {
  fallbackName?: string;
  fallbackEmail?: string;
  fallbackRole?: string;
  fallbackInitials?: string;
  fallbackAvatar?: string;
}

export function getUserDisplayData(
  user: UserDisplaySource | null | undefined,
  options: UserDisplayOptions = {},
) {
  const {
    fallbackName = "Utilisateur",
    fallbackEmail = "—",
    fallbackRole = "Membre",
    fallbackInitials = "U",
    fallbackAvatar,
  } = options;

  const normalizedName = user?.name?.trim() || "";
  const normalizedEmail = user?.email?.trim() || "";
  const normalizedRole = user?.role?.trim() || "";

  const initialsFromName = normalizedName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const initialsFromEmail = normalizedEmail[0]?.toUpperCase() ?? "";

  return {
    displayName: normalizedName || fallbackName,
    displayEmail: normalizedEmail || fallbackEmail,
    displayRole: normalizedRole || fallbackRole,
    initials: initialsFromName || initialsFromEmail || fallbackInitials,
    avatarSrc: user?.image ?? fallbackAvatar,
  };
}
