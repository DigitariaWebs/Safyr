/**
 * Safyr — Site-wide content configuration
 * All copy, labels, and data live here. Components are purely structural.
 */

export const siteConfig = {
  name: "Safyr",
  tagline: "La plateforme de gestion tout-en-un pour sociétés de gardiennage",
  description:
    "Safyr unifie la gestion RH, la paie, la comptabilité, la facturation, la banque, la planification, la géolocalisation, la gestion de stock, l'OCR et la main courante digitale en une plateforme puissante spécialement conçue pour les sociétés de gardiennage.",
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
    headline:
      "La plateforme de gestion tout-en-un pour sociétés de gardiennage",
    subheadline:
      "Safyr unifie RH, paie, comptabilité, facturation, banque, planification, géolocalisation, stock, OCR et main courante digitale en une seule plateforme puissante spécialement conçue pour les sociétés de gardiennage.",
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
      title: "Main courante digitale",
      description:
        "Suivez les présences, les quarts de travail, les rondes et les journaux d'activité quotidienne avec une synchronisation en temps réel et des enregistrements prêts pour l'audit.",
    },
    {
      icon: "DollarSign",
      title: "Paie",
      description:
        "Automatisez les calculs de salaire, les heures supplémentaires, les primes de garde, les déductions et la génération de bulletins de paie sans erreur.",
    },
    {
      icon: "BarChart3",
      title: "Comptabilité",
      description:
        "Gérez la comptabilité de votre société de gardiennage avec un suivi des dépenses, des journaux comptables et des rapports financiers intégrés.",
    },
    {
      icon: "Receipt",
      title: "Facturation",
      description:
        "Créez et envoyez des factures clients, suivez les paiements et gérez vos cycles de facturation directement depuis la plateforme.",
    },
    {
      icon: "Landmark",
      title: "Banque",
      description:
        "Connectez vos comptes bancaires, réconciliez vos transactions et gardez une vue consolidée de votre trésorerie en temps réel.",
    },
    {
      icon: "CalendarDays",
      title: "Planification",
      description:
        "Planifiez les gardes, gérez les rotations d'agents et coordonnez les affectations de sites depuis un calendrier centralisé et interactif.",
    },
    {
      icon: "MapPin",
      title: "Géolocalisation",
      description:
        "Suivez en temps réel la position de vos agents sur le terrain, contrôlez les rondes et vérifiez les présences sur site par géofencing.",
    },
    {
      icon: "Package",
      title: "Gestion de stock",
      description:
        "Gérez les équipements, uniformes et matériels de vos agents avec un suivi des stocks, des attributions et des alertes de réapprovisionnement.",
    },
    {
      icon: "ScanLine",
      title: "OCR & Documents",
      description:
        "Numérisez et extrayez automatiquement les données des documents papier — contrats, pièces d'identité, certifications — grâce à la reconnaissance optique de caractères.",
    },
  ],

  howItWorks: [
    {
      step: "01",
      title: "Ressources Humaines",
      description:
        "Centralisez l'intégralité de la vie RH de vos agents : dossiers complets, contrats, certifications, habilitations, médecine du travail, formations, entretiens, discipline et offboarding. Un tableau de bord customisable avec des widgets glissables vous donne une vue instantanée sur les effectifs, l'absentéisme, le turnover et la conformité réglementaire.",
    },
    {
      step: "02",
      title: "Paie",
      description:
        "Automatisez entièrement le cycle de paie : saisie des variables, calcul des bulletins, contrôle des charges sociales, gestion des acomptes et archivage légal. Le module intègre le bilan social, les déclarations DSN et un comparatif N/N-1 pour piloter la masse salariale sans risque d'erreur.",
    },
    {
      step: "03",
      title: "Main Courante Digitale",
      description:
        "Enregistrez en temps réel chaque événement de sécurité : incidents, rondes, alertes critiques et validations. Le journal est horodaté, géolocalisé et enrichi de photos, vidéos ou notes vocales. Tous les enregistrements sont traçables et exportables pour répondre aux exigences réglementaires du CNAPS.",
    },
    {
      step: "04",
      title: "Planning",
      description:
        "Construisez et diffusez les plannings de gardes en quelques clics : gestion des agents, des postes, des sites et des vacations. Le moteur détecte automatiquement les conflits de qualifications, les heures supplémentaires et les absences pour vous garantir une couverture opérationnelle sans faille.",
    },
    {
      step: "05",
      title: "Géolocalisation",
      description:
        "Suivez en direct la position de chaque agent sur une carte interactive. Contrôlez l'autonomie des batteries, le statut de connexion et les déplacements. Le géofencing déclenche des alertes automatiques en cas de sortie de zone ou de ronde manquée.",
    },
    {
      step: "06",
      title: "Facturation",
      description:
        "Gérez l'intégralité du cycle de facturation client : devis, bons de commande, factures, avoirs et ajustements. Le module calcule automatiquement les heures facturables à partir du planning validé, suit les paiements et génère des rapports KPI de chiffre d'affaires par client et par site.",
    },
    {
      step: "07",
      title: "Comptabilité",
      description:
        "Pilotez la santé financière de votre société en temps réel : trésorerie disponible, chiffre d'affaires mensuel et annuel, résultat estimé instantané et factures en retard. La préparation de la TVA, la génération du FEC et les rapports comptables sont intégrés directement dans la plateforme.",
    },
    {
      step: "08",
      title: "Banque",
      description:
        "Connectez vos comptes bancaires et consultez un tableau de bord unifié de votre trésorerie. Visualisez les dernières transactions, distinguez crédits et débits et réconciliez vos flux financiers avec les factures émises pour une vision comptable complète et à jour.",
    },
    {
      step: "09",
      title: "Gestion de Stock",
      description:
        "Inventoriez les équipements, uniformes et matériels de vos agents. Suivez les quantités disponibles, la valeur totale du stock et les références à réapprovisionner. Les attributions par agent sont tracées pour éviter les pertes et optimiser les dotations.",
    },
    {
      step: "10",
      title: "OCR & Documents",
      description:
        "Importez n'importe quel document papier — carte d'identité, certificat de qualification, contrat, facture — et laissez l'OCR en extraire automatiquement les données structurées. Plus de ressaisie manuelle : les informations sont directement intégrées aux dossiers agents ou aux workflows administratifs.",
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
          { title: "Main courante digitale", href: "#services" },
          { title: "Comptabilité & Facturation", href: "#services" },
          { title: "Planification & Géolocalisation", href: "#services" },
          { title: "Stock & OCR", href: "#services" },
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
