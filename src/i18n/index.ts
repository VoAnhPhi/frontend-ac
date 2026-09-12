import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import vi from './locales/vi.json';

const savedLanguage =
  typeof window !== 'undefined' ? window.localStorage.getItem('taskflow.language') : null;
const initialLanguage = savedLanguage === 'en' ? 'en' : 'vi';

if (typeof document !== 'undefined') document.documentElement.lang = initialLanguage;

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, vi: { translation: vi } },
  lng: initialLanguage,
  fallbackLng: 'vi',
  interpolation: { escapeValue: false },
});

export default i18n;
