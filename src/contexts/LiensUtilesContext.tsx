"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface UsefulLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  category: "government" | "business" | "social" | "custom";
  description?: string;
  isCustom?: boolean;
}

interface LiensUtilesContextType {
  isOpen: boolean;
  links: UsefulLink[];
  openLiensUtiles: () => void;
  closeLiensUtiles: () => void;
  addLink: (link: Omit<UsefulLink, "id">) => void;
  updateLink: (id: string, link: Partial<UsefulLink>) => void;
  deleteLink: (id: string) => void;
}

const LiensUtilesContext = createContext<LiensUtilesContextType | undefined>(
  undefined,
);

const defaultLinks: UsefulLink[] = [
  {
    id: "1",
    name: "Impots.gouv.fr",
    url: "https://www.impots.gouv.fr",
    icon: "FileText",
    category: "government",
    description: "Service des impôts",
  },
  {
    id: "2",
    name: "URSSAF",
    url: "https://www.urssaf.fr",
    icon: "Building2",
    category: "government",
    description: "Cotisations sociales",
  },
  {
    id: "3",
    name: "Net-entreprises",
    url: "https://www.net-entreprises.fr",
    icon: "Briefcase",
    category: "government",
    description: "Déclarations sociales",
  },
  {
    id: "4",
    name: "Infogreffe",
    url: "https://www.infogreffe.fr",
    icon: "FileText",
    category: "government",
    description: "Registre du commerce",
  },
  {
    id: "5",
    name: "AKTO",
    url: "https://www.akto.fr",
    icon: "Users",
    category: "business",
    description: "Formation professionnelle",
  },
  {
    id: "6",
    name: "ANCV",
    url: "https://www.ancv.com",
    icon: "Briefcase",
    category: "business",
    description: "Chèques vacances",
  },
  {
    id: "7",
    name: "Légifrance",
    url: "https://www.legifrance.gouv.fr",
    icon: "FileText",
    category: "government",
    description: "Service public de la diffusion du droit",
  },
  {
    id: "8",
    name: "France Travail",
    url: "https://www.francetravail.fr",
    icon: "Users",
    category: "government",
    description: "Emploi et formation",
  },
  {
    id: "9",
    name: "DRAC",
    url: "https://www.culture.gouv.fr/Regions",
    icon: "Building2",
    category: "government",
    description: "Direction régionale des affaires culturelles",
  },
];

export function LiensUtilesProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [links, setLinks] = useState<UsefulLink[]>([...defaultLinks]);

  // Load custom links from localStorage on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedLinks = localStorage.getItem("customLinks");
      if (savedLinks) {
        try {
          const parsed: UsefulLink[] = JSON.parse(savedLinks);
          // Merge default links with custom links
          const customLinks = parsed.filter((link) => link.isCustom);
          setLinks([...defaultLinks, ...customLinks]);
        } catch (e) {
          console.error("Failed to load custom links", e);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Save only custom links to localStorage
  const saveCustomLinks = (allLinks: UsefulLink[]) => {
    const customLinks = allLinks.filter((link) => link.isCustom);
    localStorage.setItem("customLinks", JSON.stringify(customLinks));
  };

  const openLiensUtiles = () => {
    setIsOpen(true);
  };

  const closeLiensUtiles = () => {
    setIsOpen(false);
  };

  const addLink = (linkData: Omit<UsefulLink, "id">) => {
    const generateId = () =>
      `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newLink: UsefulLink = {
      ...linkData,
      id: generateId(),
      isCustom: true,
    };

    const updatedLinks = [...links, newLink];
    setLinks(updatedLinks);
    saveCustomLinks(updatedLinks);
  };

  const updateLink = (id: string, updates: Partial<UsefulLink>) => {
    const updatedLinks = links.map((link) =>
      link.id === id ? { ...link, ...updates } : link,
    );
    setLinks(updatedLinks);
    saveCustomLinks(updatedLinks);
  };

  const deleteLink = (id: string) => {
    const updatedLinks = links.filter((link) => link.id !== id);
    setLinks(updatedLinks);
    saveCustomLinks(updatedLinks);
  };

  return (
    <LiensUtilesContext.Provider
      value={{
        isOpen,
        links,
        openLiensUtiles,
        closeLiensUtiles,
        addLink,
        updateLink,
        deleteLink,
      }}
    >
      {children}
    </LiensUtilesContext.Provider>
  );
}

export function useLiensUtiles() {
  const context = useContext(LiensUtilesContext);
  if (context === undefined) {
    throw new Error("useLiensUtiles must be used within a LiensUtilesProvider");
  }
  return context;
}
