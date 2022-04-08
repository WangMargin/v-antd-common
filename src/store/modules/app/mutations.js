export const SET_LANG = 'SET_LANG';
export const SET_DEVICE = 'SET_DEVICE';
export const SET_LAYOUT = 'SET_LAYOUT';
export const SET_NAV_THEME = 'SET_NAV_THEME';
export const SET_CONTENT_WIDTH = 'SET_CONTENT_WIDTH';
export const SET_FIXED_HEADER = 'SET_FIXED_HEADER';
export const SET_FIXED_SIDEBAR = 'SET_FIXED_SIDEBAR';
export const SET_PRIMARY_COLOR = 'SET_PRIMARY_COLOR';
export const SET_COLOR_WEAK = 'SET_COLOR_WEAK';
export const SET_SPLIT_MENUS = 'SET_SPLIT_MENUS';
export const SET_TRANSITION_NAME = 'SET_TRANSITION_NAME';
export const SET_MULTI_TAB = 'SET_MULTI_TAB';
export const SET_FIXED_MULTI_TAB = 'SET_FIXED_MULTI_TAB';
export const mutations = {
  [SET_LANG](state, lang) {
    state.lang = lang;
  },

  [SET_DEVICE](state, device) {
    state.device = device;
  },

  [SET_LAYOUT](state, layout) {
    state.layout = layout;
  },

  [SET_NAV_THEME](state, navTheme) {
    state.navTheme = navTheme;
  },

  [SET_CONTENT_WIDTH](state, contentWidth) {
    state.contentWidth = contentWidth;
  },

  [SET_FIXED_HEADER](state, fixedHeader) {
    state.fixedHeader = fixedHeader;
  },

  [SET_FIXED_SIDEBAR](state, fixedSidebar) {
    state.fixedSidebar = fixedSidebar;
  },

  [SET_PRIMARY_COLOR](state, color) {
    state.primaryColor = color;
  },

  [SET_COLOR_WEAK](state, colorWeak) {
    state.colorWeak = colorWeak;
  },

  [SET_SPLIT_MENUS](state, split) {
    state.splitMenus = split;
  },

  [SET_TRANSITION_NAME](state, name) {
    state.transitionName = name;
  },

  [SET_MULTI_TAB](state, isOpen) {
    state.multiTab = isOpen;
  },

  [SET_FIXED_MULTI_TAB](state, fixed) {
    state.multiTabFixed = fixed;
  },
};
