export const getters = {
  role: state => state.role,
  info: state => state.extra,
  username: state => state.username,
  nickname: state => state.nickname,
  avatar: state => state.avatar,
  allowRouters: state => state.allowRouters,
  currentUser: state => state,
};
