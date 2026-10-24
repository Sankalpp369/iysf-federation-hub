export type CountryTheme = {
  code: string;
  name: string;
  flag: string;
  accent: string;
  accent2?: string;
};

export const countryThemes: Record<string, CountryTheme> = {
  MX: { code: "MX", name: "Mexico", flag: "🇲🇽", accent: "#006847", accent2: "#CE1126" },
  DK: { code: "DK", name: "Denmark", flag: "🇩🇰", accent: "#C8102E" },
  AU: { code: "AU", name: "Australia", flag: "🇦🇺", accent: "#00008B", accent2: "#CF142B" },
  US: { code: "US", name: "United States", flag: "🇺🇸", accent: "#0A3161", accent2: "#B31942" },
  CZ: { code: "CZ", name: "Czechia", flag: "🇨🇿", accent: "#11457E", accent2: "#D7141A" },
  IT: { code: "IT", name: "Italy", flag: "🇮🇹", accent: "#008C45", accent2: "#CD212A" },
  GB: { code: "GB", name: "United Kingdom", flag: "🇬🇧", accent: "#012169", accent2: "#C8102E" },
  FR: { code: "FR", name: "France", flag: "🇫🇷", accent: "#0055A4", accent2: "#EF4135" },
  MN: { code: "MN", name: "Mongolia", flag: "🇲🇳", accent: "#C4272F", accent2: "#015197" },
  AR: { code: "AR", name: "Argentina", flag: "🇦🇷", accent: "#397FA9", accent2: "#B67A00" },
  CA: { code: "CA", name: "Canada", flag: "🇨🇦", accent: "#D52B1E" },
  TR: { code: "TR", name: "Türkiye", flag: "🇹🇷", accent: "#E30A17" },
  SE: { code: "SE", name: "Sweden", flag: "🇸🇪", accent: "#006AA7", accent2: "#A77F00" },
  LV: { code: "LV", name: "Latvia", flag: "🇱🇻", accent: "#9E3039" },
  CI: { code: "CI", name: "Côte d’Ivoire", flag: "🇨🇮", accent: "#A44F00", accent2: "#007A49" },
  IN: { code: "IN", name: "India", flag: "🇮🇳", accent: "#A95C00", accent2: "#138808" },
  BE: { code: "BE", name: "Belgium", flag: "🇧🇪", accent: "#7C6510", accent2: "#ED2939" },
  NP: { code: "NP", name: "Nepal", flag: "🇳🇵", accent: "#DC143C", accent2: "#003893" },
  MY: { code: "MY", name: "Malaysia", flag: "🇲🇾", accent: "#010066", accent2: "#CC0001" },
  CN: { code: "CN", name: "China", flag: "🇨🇳", accent: "#DE2910", accent2: "#FFDE00" },
  NORDIC: { code: "NORDIC", name: "Nordic region", flag: "🌐", accent: "#003580" },
  INT: { code: "INT", name: "International", flag: "🌐", accent: "#4298D3" },
};

export const countryThemeList = Object.values(countryThemes);
