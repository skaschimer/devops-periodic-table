import { ArrowsUpFromLine } from "lucide-react";

export const siteConfig = {
  title: 'Skratsch Solutions',
  url: 'https://devopsperiodictable.com/',
  github: 'https://github.com/skaschimer/azure-periodic-table-app',
  linkedin: 'https://www.linkedin.com/in/skaschimer/',
};

const encodedWebsite = encodeURIComponent(siteConfig.url);
const hashtag = '%23DevOpsPeriodicTable';

export const socialConfig = {
  linkedinUsername: 'skaschimer',
  linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${siteConfig.url}`,
};

export const colorConfig = {
  gray: 'bg-gray-500',
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  yellow: 'bg-yellow-500',
  lime: 'bg-lime-500',
  green: 'bg-green-500',
  cyan: 'bg-cyan-400',
  blue: 'bg-blue-500',
  indigo: 'bg-indigo-500',
  violet: 'bg-violet-500',
  fuchsia: 'bg-fuchsia-500',
  pink: 'bg-pink-500',
  rose: 'bg-rose-500',
  darkgreen: 'bg-green-900',
  teal: 'bg-cyan-600',
  darkorange: 'bg-orange-900',
  darkindigo: 'bg-violet-900',
  lightorange: 'bg-orange-400',
  darkteal: 'bg-cyan-800',
  darkblue: 'bg-blue-700',
  lightblue: 'bg-blue-400',
  medgreen: 'bg-green-700',
  lightindigo: 'bg-violet-300',
  medindigo: 'bg-indigo-700'
};
