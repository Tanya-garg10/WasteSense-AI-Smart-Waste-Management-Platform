import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'es' | 'fr';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' }
];

export const TRANSLATIONS: Record<string, Record<Language, string>> = {
  // Navigation Tabs
  'nav.citizen_dash': {
    en: "Citizen Dashboard",
    es: "Panel Ciudadano",
    fr: "Tableau de Bord Citoyen"
  },
  'nav.nearby_map': {
    en: "Nearby Map & Heatmap",
    es: "Mapa Cercano y Mapa de Calor",
    fr: "Carte à Proximité & Carte Thermique"
  },
  'nav.scanner': {
    en: "AI Waste Scanner",
    es: "Escáner IA de Residuos",
    fr: "Scanner IA de Déchets"
  },
  'nav.report_issue': {
    en: "Report Issue",
    es: "Reportar Problema",
    fr: "Signaler un Problème"
  },
  'nav.gamification': {
    en: "Eco Rewards",
    es: "Recompensas Eco",
    fr: "Récompenses Éco"
  },
  'nav.collector_dash': {
    en: "Collector Dispatch",
    es: "Despacho de Recolector",
    fr: "Répartiteur de Collecte"
  },
  'nav.smart_route': {
    en: "Collection Route",
    es: "Ruta de Recolección",
    fr: "Itinéraire de Collecte"
  },
  'nav.municipality_dash': {
    en: "Municipality Admin",
    es: "Administración Municipal",
    fr: "Administration Municipale"
  },
  'nav.bin_monitoring': {
    en: "Bin IoT Telematics",
    es: "Telemática IoT de Contenedores",
    fr: "Télématique IoT des Conteneurs"
  },
  'nav.prediction_analytics': {
    en: "AI Predictions",
    es: "Predicciones IA",
    fr: "Prédictions IA"
  },
  'nav.segregation': {
    en: "Segregation Assistant",
    es: "Asistente de Segregación",
    fr: "Assistant de Tri"
  },
  'nav.profile': {
    en: "Profile & Settings",
    es: "Perfil y Configuración",
    fr: "Profil et Paramètres"
  },

  // Profile View Strings
  'profile.header_title': {
    en: "Citizen Profile & Preferences",
    es: "Perfil de Ciudadano y Preferencias",
    fr: "Profil Citoyen et Préférences"
  },
  'profile.language_section_title': {
    en: "Language & Regional Localization",
    es: "Idioma y Localización Regional",
    fr: "Langue et Localisation Régionale"
  },
  'profile.language_saved_notice': {
    en: "Persisted in browser context",
    es: "Persistido en el contexto del navegador",
    fr: "Persisté dans le contexte du navigateur"
  },
  'profile.select_language_label': {
    en: "Select Application Language",
    es: "Seleccionar Idioma de la Aplicación",
    fr: "Sélectionner la Langue de l'Application"
  },
  'profile.language_description': {
    en: "Change application user interface text dynamically across English, Spanish, and French.",
    es: "Cambie dinámicamente el texto de la interfaz de usuario de la aplicación entre inglés, español y francés.",
    fr: "Changez dynamiquement le texte de l'interface utilisateur de l'application entre l'anglais, l'espagnol et le français."
  },
  'profile.current_language': {
    en: "Current Active Language",
    es: "Idioma Activo Actual",
    fr: "Langue Active Actuelle"
  },
  'profile.active_streak': {
    en: "Day Active Streak",
    es: "Días de Racha Activa",
    fr: "Jours d'Activité Consécutifs"
  },
  'profile.eco_points': {
    en: "Eco Points",
    es: "Puntos Eco",
    fr: "Points Éco"
  },
  'profile.ai_scans': {
    en: "AI Scans",
    es: "Escaneos IA",
    fr: "Scans IA"
  },
  'profile.city_rank': {
    en: "City Rank",
    es: "Rango de la Ciudad",
    fr: "Rang de la Ville"
  },
  'profile.appearance_title': {
    en: "Appearance & Interface Theme",
    es: "Apariencia y Tema de Interfaz",
    fr: "Apparence et Thème d'Interface"
  },
  'profile.appearance_notice': {
    en: "Saved in browser storage",
    es: "Guardado en almacenamiento del navegador",
    fr: "Enregistré dans le navigateur"
  },
  'profile.color_mode': {
    en: "Color Mode Preference",
    es: "Preferencia de Modo de Color",
    fr: "Préférence de Mode de Couleur"
  },
  'profile.color_mode_desc': {
    en: "Switch between crisp Light mode and high-contrast Dark mode.",
    es: "Cambie entre el modo Claro y el modo Oscuro de alto contraste.",
    fr: "Basculez entre le mode Clair et le mode Sombre à haut contraste."
  },
  'profile.light_mode': {
    en: "Light Mode",
    es: "Modo Claro",
    fr: "Mode Clair"
  },
  'profile.light_mode_desc': {
    en: "Clean light aesthetic",
    es: "Estética clara y limpia",
    fr: "Esthétique claire"
  },
  'profile.dark_mode': {
    en: "Dark Mode",
    es: "Modo Oscuro",
    fr: "Mode Sombre"
  },
  'profile.dark_mode_desc': {
    en: "Sleek dark canvas",
    es: "Lienzo oscuro elegante",
    fr: "Toile sombre élégante"
  },
  'profile.earned_badges': {
    en: "Earned Badges",
    es: "Insignias Ganadas",
    fr: "Badges Obtenus"
  },
  'profile.demo_controls': {
    en: "Demo State Controls",
    es: "Controles de Estado Demo",
    fr: "Contrôles d'État Démo"
  },
  'profile.reset_demo_title': {
    en: "Reset Demo Data",
    es: "Restablecer Datos de Demostración",
    fr: "Réinitialiser les Données Démo"
  },
  'profile.reset_demo_desc': {
    en: "Restore default smart bin levels, citizen reports, and eco points.",
    es: "Restaurar niveles predeterminados de contenedores, reportes y puntos eco.",
    fr: "Restaurer les niveaux de conteneurs par défaut, les signalements et les points éco."
  },
  'profile.reset_button': {
    en: "Reset State",
    es: "Restablecer Estado",
    fr: "Réinitialiser"
  },

  // Common UI Strings
  'common.role': {
    en: "Role",
    es: "Rol",
    fr: "Rôle"
  },
  'common.launch_demo': {
    en: "Launch Demo Scenario",
    es: "Lanzar Escenario Demo",
    fr: "Lancer Scénario Démo"
  },
  'common.alerts': {
    en: "Citizen Activity Alerts",
    es: "Alertas de Actividad Ciudadana",
    fr: "Alertes d'Activité Citoyenne"
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  currentOption: LanguageOption;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'wastesense_app_language_preference';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved === 'en' || saved === 'es' || saved === 'fr') {
        return saved;
      }
    } catch (e) {
      console.warn('Unable to read language preference from localStorage:', e);
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, lang);
    } catch (e) {
      console.warn('Unable to save language preference to localStorage:', e);
    }
  };

  const t = (key: string, fallback?: string): string => {
    if (TRANSLATIONS[key] && TRANSLATIONS[key][language]) {
      return TRANSLATIONS[key][language];
    }
    return fallback || key;
  };

  const currentOption = LANGUAGE_OPTIONS.find((opt) => opt.code === language) || LANGUAGE_OPTIONS[0];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currentOption }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
