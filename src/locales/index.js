import { ref } from 'vue';
import { createI18n } from 'vue-i18n';
import moment from 'moment';
import enUS from './lang/en-US';
export const locales = ['zh-CN', 'zh-TW', 'en-US', 'pt-BR'];
export const defaultLang = 'en-US';
const loadedLanguages = ref([defaultLang]);
const i18n = createI18n({
  missingWarn: false,
  fallbackWarn: false,
  locale: defaultLang,
  messages: {
    ['en-US']: enUS,
  },
});

function setI18nLanguage(lang) {
  i18n.global.locale = lang; // request.headers['Accept-Language'] = lang

  const HTML = document.querySelector('html');
  HTML && HTML.setAttribute('lang', lang);
  return lang;
}

export function loadLanguageAsync(lang = defaultLang) {
  return new Promise(resolve => {
    const currentLocale = i18n.global;

    if (currentLocale.locale !== lang) {
      if (!loadedLanguages.value.includes(lang)) {
        return import(
          /* webpackChunkName: "lang-[request]" */
          // eslint-disable-next-line comma-dangle
          `./lang/${lang}`
        ).then(result => {
          const loadedLang = result.default; // set vue-i18n lang

          currentLocale.setLocaleMessage(lang, loadedLang); // set moment lang

          moment.updateLocale(loadedLang.momentLocaleName, loadedLang.moment); // save loaded

          loadedLanguages.value.push(lang);
          return resolve(setI18nLanguage(lang));
        });
      }

      return resolve(setI18nLanguage(lang));
    }

    resolve(lang);
  });
}
export default i18n;
