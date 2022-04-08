import { SET_RESOURCES, SET_UIMSDEOARTMENT } from './mutations';
import { getResources, getDepartmentData } from '@/api/resources/resources.js';
export const GET_RESOURCES = 'GET_RESOURCES';
export const GET_UIMSRESOURCES = 'GET_UIMSRESOURCES';
export const actions = {
  [GET_RESOURCES]({ commit }) {
    return new Promise((resolve, reject) => {
      getResources()
        .then(res => {
          commit(SET_RESOURCES, res.data);
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  [GET_UIMSRESOURCES]({ commit }) {
    return new Promise((resolve, reject) => {
      getDepartmentData({ skip: 0, limit: 200 })
        .then(res => {
          commit(SET_UIMSDEOARTMENT, res.data.list);
          resolve();
        })
        .catch(err => {
          reject(err);
        });
      // getUserData({ skip: 0, limit: 2000 })
      //   .then(res => {
      //     commit(SET_UIMSUSER, res.data.list);
      //     return getDepartmentData({ skip: 0, limit: 200 });
      //   })
      //   .then(res => {
      //     commit(SET_UIMSDEOARTMENT, res.data.list);
      //     resolve(true);
      //   })
      //   .catch(err => {
      //     reject(err);
      //   });
    });
  },
};
