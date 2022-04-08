import { SET_LANG } from './mutations';
import { loadLanguageAsync } from '@/locales';
import { localStorage } from '@/utils/local-storage';
import { STORAGE_LANG_KEY } from '@/store/mutation-type';
export const actions = {
  [SET_LANG]({ commit }, lang) {
    return new Promise((resolve, reject) => {
      loadLanguageAsync(lang)
        .then(() => {
          commit(SET_LANG, lang);
          localStorage.set(STORAGE_LANG_KEY, lang);
          resolve();
        })
        .catch(e => {
          reject(e);
        });
    });
  },
};
