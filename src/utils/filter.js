import moment from 'moment';
// import 'moment/locale/zh-cn';

// moment.locale('zh-cn');

export const NumberFormat = value => {
  if (!value) {
    return '0';
  }
  // 将整数部分逢三一断
  return value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
};

/**
 * 格式化时间戳为可读时间
 * @param timestamp 整型时间戳
 * @param pattern
 * */
export const FormatTimestamp = (timestamp, pattern = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(timestamp * 1000).format(pattern);
};

/** 格式化布尔值 */
export const FormatBool = value => {
  return value ? '是' : '否';
};
