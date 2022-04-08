import { createStore, createLogger } from 'vuex';
import { app } from './modules/app';
import { user } from './modules/user';
import { stepForm } from '@/views/form/step-form/model';
import createPersistedState from 'vuex-persistedstate';
import ls from '@/utils/local-storage';
const debug = process.env.NODE_ENV !== 'production';
const persistedPlugin = createPersistedState({
  paths: ['app'],
  storage: {
    getItem: key => ls.get(key),
    setItem: (key, value) => ls.set(key, value),
    removeItem: key => ls.remove(key),
  },
});
export default createStore({
  modules: {
    app,
    user,
    // business
    stepForm,
  },
  strict: debug,
  plugins: debug ? [createLogger(), persistedPlugin] : [],
});
