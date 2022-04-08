// 判断是否手机客户端访问
export const isMobileClient = () => {
  return /mobile/gi.test(navigator.userAgent);
};
