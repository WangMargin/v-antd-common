import { fakeSubmitForm } from '@/api/form/step-form';
const initState = {
  step: {
    payAccount: undefined,
    receiverAccount: {
      type: 'alipay',
      number: undefined,
    },
    receiverName: 'Sendya',
    amount: 500,
  },
};
export const getters = {
  payAccount: state => state.step.payAccount,
  receiverAccount: state => state.step.receiverAccount,
  receiverName: state => state.step.receiverName,
  amount: state => state.step.amount,
  step: state => state.step,
};
export const stepForm = {
  namespaced: true,
  state: initState,
  getters,
  actions: {
    async submitStepForm({ commit }, payload) {
      await fakeSubmitForm(payload);
      commit('saveStepFormData', {
        payload,
      });
    },

    async saveStepFormData({ commit }, payload) {
      commit('saveStepFormData', {
        payload,
      });
    },

    async clear({ commit }) {
      commit('saveStepFormData', initState.step);
    },
  },
  mutations: {
    saveStepFormData(state, { payload }) {
      state.step = { ...state.step, ...payload };
    },
  },
};
