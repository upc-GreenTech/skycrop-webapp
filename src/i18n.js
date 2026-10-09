import {createI18n} from 'vue-i18n';
import {watch} from 'vue';
import en from './locales/en.json';
import es from './locales/es.json';

let preferredLocale = 'en';
try {
  const savedLocale = localStorage.getItem('skycrop-language');
  if (['en', 'es'].includes(savedLocale)) preferredLocale = savedLocale;
} catch {}

const i18n = createI18n({
  legacy: false,
  locale: preferredLocale,
  fallbackLocale: 'en',
  messages: {en, es}
});

watch(i18n.global.locale, locale => {
  document.documentElement.lang = locale;
  try { localStorage.setItem('skycrop-language', locale); } catch {}
}, {immediate: true});

export default i18n;
