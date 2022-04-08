import localStorage from '@/utils/local-storage';
/**
 * 将钱数逢三用，隔开
 * @param value
 * @return string
 */
export const moneyTransform = value => {
  return value
    ? Number(value)
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : '0.00';
};

/**
 * 列表搜索筛选排序
 * @param {Aryay} columns:	全部列
 * @param {Object} filters: 筛选数据
 * @param {Object} sorter: 排序数据
 * @param {Aryay} subject: 选择主体数据
 */
export const handleFiltersSorter = (columns, filters, sorter, subject) => {
  const orderData = {
    ascend: 1,
    descend: -1,
  };
  const bool = [false, true];
  const filter_sort = {};
  const filterArr = [];
  if (filters && Object.keys(filters).length > 0) {
    Object.keys(filters).forEach(item => {
      if (filters[item].length > 0) {
        const column = columns.find(k => k.dataIndex === item);
        if (column.boolTrans) {
          filters[item] = filters[item].map(v => bool[v]);
        }
        const o =
          column.op === 'In'
            ? { op: column.op, field: column.sk, value: filters[item] }
            : { op: column.op, field: column.sk, value: filters[item][0] };
        filterArr.push(o);
      }
    });
  }
  // 是否有筛选主体
  if (subject && subject.length > 0) {
    filterArr.push({ op: 'In', field: 'subject_id', value: subject });
  }
  if (filterArr.length > 0) {
    filter_sort.filter = JSON.stringify(filterArr);
  }

  if (sorter && Object.keys(sorter).length > 0) {
    if (sorter.order) {
      filter_sort.sort = sorter.field;
      filter_sort.order = orderData[sorter.order];
    }
  }
  return filter_sort;
};
/**
 * 获取当前日期
 */
const getNowDay = () => {
  const date = new Date();
  const yy = date.getFullYear();
  const mm = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
  const dd = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  return `${yy}${mm}${dd}`;
};

/**
 * 下载excel表格文件
 */
export const downloadFileExcel = (res, name) => {
  const customName = name ? `${name}_${getNowDay()}_template.xls` : `${getNowDay()}_template.xls`;
  const reg = new RegExp('"', 'g');
  const cntDis = res.headers['content-disposition'];
  const fileName = cntDis.includes('filename=')
    ? cntDis.split(';')[1].split('=')[1].replace(reg, '')
    : customName;
  const blob = new Blob([res.data], { type: res.headers['content-type'] });
  const href = URL.createObjectURL(blob); //创建新的URL表示指定的blob对象
  const a = document.createElement('a'); //创建a标签
  a.style.display = 'none';
  a.href = href; // 指定下载链接
  a.download = decodeURI(fileName); //指定下载文件名
  a.click(); //触发下载
  URL.revokeObjectURL(a.href); //释放URL对象
};

/**
 * 移除本地存储的导入数据
 */
export const removeLocalBatchData = target => {
  if (target.includes('batch')) {
    const batchSchemaData = localStorage.get('batchSchemaData') || [];
    const id = target.split('/')[3];
    const findIndex = batchSchemaData.findIndex(v => v.id === id);
    if (findIndex !== -1) {
      batchSchemaData.splice(findIndex, 1);
      if (batchSchemaData.length == 0) {
        localStorage.remove('batchSchemaData');
      } else {
        localStorage.set('batchSchemaData', batchSchemaData);
      }
    }
  }
};
