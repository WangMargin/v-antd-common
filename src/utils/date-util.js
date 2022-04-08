import moment from 'moment';
export const dateFormat = (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(dataStr).format(pattern);
};
export const dateFormatNow = dataStr => {
  return moment(dataStr).fromNow();
};
