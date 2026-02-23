/**
 * Safyr — Site-wide content configuration
 * All copy, labels, and data live here. Components are purely structural.
 */

export const siteConfig = {
  name: "Safyr",
  tagline: "Plateforme RH & Main courante digitale pour Gardiennage",
  description:
    "Safyr unifie la gestion RH, les registres numériques, la paie et la main courante digitale en une plateforme puissante spécialement conçue pour les sociétés de gardiennage.",
  url: "https://safyr.com",

  nav: [
    { label: "Fonctionnalités", href: "#services" },
    { label: "Comment ça marche", href: "#how-it-works" },
    { label: "Témoignages", href: "#testimonials" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ],

  hero: {
    badge: "Approuvé par plus de 200 sociétés de gardiennage",
    headline: "Plateforme RH & Main courante digitale pour Gardiennage",
    subheadline:
      "Safyr unifie la gestion RH, les registres numériques, la paie et la main courante digitale en une plateforme puissante spécialement conçue pour les sociétés de gardiennage.",
    cta: "Nous contacter",
    ctaHref: "#contact",
    secondaryCta: "Voir comment ça marche",
    secondaryCtaHref: "#how-it-works",
  },

  stats: [
    { value: "200+", label: "Sociétés de gardiennage" },
    { value: "15k+", label: "Agents de sécurité gérés" },
    { value: "99.9%", label: "Disponibilité de la plateforme" },
    { value: "3x", label: "Traitement RH plus rapide" },
  ],

  about: {
    badge: "À propos de Safyr",
    headline: "Conçu pour les sociétés de gardiennage",
    body: "Safyr a été créé pour alléger la charge opérationnelle des équipes RH et de gestion des sociétés de gardiennage. Nous avons construit une plateforme qui intègre chaque flux de travail — de l'embauche à la retraite — dans un système unique, auditable et intelligent. Que vous gériez 10 ou 10 000 agents de sécurité, Safyr s'adapte à vos ambitions.",
    values: [
      { icon: "Shield", label: "Conception axée sur la conformité" },
      { icon: "Zap", label: "Opérations en temps réel" },
      { icon: "Users", label: "Gestion centralisée des agents" },
      { icon: "BarChart3", label: "Décisions basées sur les données" },
    ],
  },

  services: [
    {
      icon: "Users",
      title: "Gestion RH des agents",
      description:
        "Centralisez les dossiers de vos agents de sécurité, leurs certifications, habilitations, formations et évaluations de performance en un seul endroit.",
    },
    {
      icon: "BookOpen",
      title: "Registre numérique de gardiennage",
      description:
        "Suivez les présences, les quarts de travail, les rondes et les journaux d'activité quotidienne avec une synchronisation en temps réel et des enregistrements prêts pour l'audit.",
    },
    {
      icon: "DollarSign",
      title: "Automatisation de la paie",
      description:
        "Automatisez les calculs de salaire, les heures supplémentaires, les primes de garde, les déductions et la génération de bulletins de paie sans erreur.",
    },
    {
      icon: "ShieldCheck",
      title: "Conformité et rapports",
      description:
        "Restez prêt pour l'audit avec des contrôles de conformité intégrés, des rapports réglementaires spécifiques au gardiennage et l'application des politiques.",
    },
    {
      icon: "Settings2",
      title: "Gestion des opérations",
      description:
        "Coordonnez les affectations de sites, les plannings de garde, les rondes de sécurité et les flux de travail d'équipe depuis un tableau de bord unifié.",
    },
    {
      icon: "BarChart3",
      title: "Analyses et tableaux de bord",
      description:
        "Découvrez des insights sur vos équipes de gardiennage avec des tableaux de bord en temps réel, des analyses de tendances et des rapports exportables.",
    },
    {
      icon: "FolderOpen",
      title: "Gestion de documents",
      description:
        "Stockez, signez et gérez les contrats d'agents, les certifications, les habilitations et les documents réglementaires en toute sécurité dans le cloud.",
    },
  ],

  howItWorks: [
    {
      step: "01",
      title: "Module RH",
      description:
        "Gérez vos agents de sécurité avec le module RH : dossiers complets, certifications, habilitations, formations, évaluations de performance et gestion de la paie, le tout centralisé en un seul endroit.",
    },
    {
      step: "02",
      title: "Module Main courante digitale",
      description:
        "Utilisez la main courante digitale pour suivre les présences, les rondes de sécurité, les incidents et générer des rapports conformes aux exigences réglementaires en temps réel. Tous vos enregistrements sont traçables et auditable pour une conformité totale.",
    },
    {
      step: "03",
      title: "Application mobile pour les agents",
      description:
        "Vos agents utilisent l'application mobile pour enregistrer leurs présences, effectuer leurs rondes, signaler des incidents et consulter leurs plannings directement depuis leur smartphone.",
    },
  ],

  testimonials: [
    {
      quote:
        "Safyr a réduit notre temps de traitement de la paie de 70 %. Ce qui prenait une semaine complète à notre équipe RH est maintenant fait en quelques heures. Parfait pour gérer nos 500 agents de sécurité.",
      name: "Marcus Fontaine",
      title: "Directeur RH, Sécurité Gardiennage Pro",
      avatar: 0,
    },
    {
      quote:
        "Enfin une plateforme qui gère notre conformité du registre de gardiennage et la RH en un seul endroit. La piste d'audit seule nous a évité deux problèmes réglementaires majeurs.",
      name: "Priya Nair",
      title: "Directrice des opérations, Gardiennage Sécuritas",
      avatar: 1,
    },
    {
      quote:
        "L'intégration a pris moins d'une journée et l'équipe de support était exceptionnelle. Nos responsables de sites apprécient vraiment d'utiliser Safyr pour gérer leurs équipes.",
      name: "Sophie Laurent",
      title: "PDG, Protection & Surveillance",
      avatar: 2,
    },
    {
      quote:
        "Nous gérons 1 200 agents de sécurité avec Safyr. Le suivi en temps réel des présences, des rondes et la synchronisation de la paie sont exactement ce dont nous avions besoin.",
      name: "Daniel Reyes",
      title: "Directeur Opérations, Gardiennage Express",
      avatar: 3,
    },
  ],

  faq: [
    {
      question: "Combien de temps prend l'intégration ?",
      answer:
        "La plupart des sociétés de gardiennage sont entièrement opérationnelles en 1 à 3 jours ouvrables. Notre assistant de configuration guidé et notre spécialiste d'intégration dédié assurent une transition en douceur sans interruption de vos opérations.",
    },
    {
      question:
        "Safyr peut-il gérer des règles de paie complexes pour le gardiennage ?",
      answer:
        "Oui. Safyr prend en charge les structures salariales spécifiques au gardiennage, les heures supplémentaires, les primes de garde de nuit, les primes de week-end, les règles fiscales et les cycles de paie personnalisés adaptés aux horaires décalés.",
    },
    {
      question: "Nos données sont-elles sécurisées ?",
      answer:
        "Absolument. Safyr est conforme SOC 2 Type II, utilise le chiffrement AES-256 au repos et en transit, et offre des contrôles complets de résidence des données. La sécurité est notre priorité, surtout pour les données sensibles de gardiennage.",
    },
    {
      question: "S'intègre-t-il à nos outils existants ?",
      answer:
        "Safyr s'intègre aux plateformes comptables (QuickBooks, Xero), aux systèmes de pointage, aux fournisseurs d'identité (Okta, Azure AD) et offre une API REST pour les intégrations personnalisées avec vos systèmes de gestion de sites.",
    },
    {
      question: "Quelles options de support sont disponibles ?",
      answer:
        "Tous les plans incluent le support par e-mail et chat. Les clients Enterprise bénéficient d'un gestionnaire de succès client dédié et d'un support téléphonique 24/7, essentiel pour les opérations de gardiennage qui fonctionnent en continu.",
    },
    {
      question: "Puis-je essayer Safyr avant de m'engager ?",
      answer:
        "Oui — réservez un appel de démonstration personnalisé et nous vous guiderons à travers la plateforme en utilisant votre propre structure de société de gardiennage comme environnement de démonstration.",
    },
  ],

  contact: {
    headline: "Parlons de vos besoins",
    subheadline:
      "Réservez un appel avec notre équipe et découvrez comment Safyr s'adapte à votre organisation. Sans pression, sans jargon — juste une conversation honnête.",
    email: "hello@safyr.com",
    phone: "+1 (555) 012-3456",
    address: "123 Operations Ave, Suite 400, San Francisco, CA 94105",
  },

  footer: {
    tagline: "Le système d'exploitation pour vos agents de sécurité.",
    links: [
      {
        label: "Produit",
        items: [
          { title: "Gestion RH", href: "#services" },
          { title: "Paie", href: "#services" },
          { title: "Registre de gardiennage", href: "#services" },
          { title: "Analyses", href: "#services" },
        ],
      },
      {
        label: "Entreprise",
        items: [
          { title: "À propos", href: "#about" },
          { title: "Carrières", href: "#" },
          { title: "Blog", href: "#" },
          { title: "Presse", href: "#" },
        ],
      },
      {
        label: "Légal",
        items: [
          { title: "Politique de confidentialité", href: "#" },
          { title: "Conditions d'utilisation", href: "#" },
          { title: "Politique des cookies", href: "#" },
          { title: "Sécurité", href: "#" },
        ],
      },
    ],
  },
} as const;
