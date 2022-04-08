import isUrl from './isUrl';
import isImg from './isImg';
import isNil from './isNil';
export const warn = (valid, message) => {
  // Support uglify
  if (process.env.NODE_ENV !== 'production' && !valid && console !== undefined) {
    console.error(`Warning: ${message}`);
  }
};
export const warning = (valid, message) => {
  warn(valid, `[@ant-design-vue/pro-layout] ${message}`);
};
export { isUrl, isImg, isNil };
