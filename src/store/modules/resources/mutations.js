export const SET_RESOURCES = 'SET_RESOURCES';
export const SET_UIMSDEOARTMENT = 'SET_UIMSDEOARTMENT';
export const SET_UIMSUSER = 'SET_UIMSUSER';
export const mutations = {
  [SET_RESOURCES]: (state, resources) => {
    state.resources = resources;
  },
  [SET_UIMSDEOARTMENT]: (state, uimsDepartment) => {
    state.uimsDepartment = uimsDepartment;
  },
  [SET_UIMSUSER]: (state, uimsUser) => {
    state.uimsUser = uimsUser;
  },
};
