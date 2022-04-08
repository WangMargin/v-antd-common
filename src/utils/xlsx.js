import XLSX from 'xlsx';
// 获取表头的行数
const getMergeRowNum = merges => {
  const cellArr = merges
    .map(k => {
      return k.e.r - k.s.r;
    })
    .sort();
  return cellArr[cellArr.length - 1] + 1;
};
// 获取表头的合并列数
const getMergeColNum = merges => {
  const cellArr = merges
    .map(k => {
      return k.e.c - k.s.c;
    })
    .sort();
  return cellArr[cellArr.length - 1] + 1;
};
// 获取当前单元格左侧一行数据 coordinate:{c:c,r:r}当前单元格坐标
const getCellLeftStr = (coordinate, sheet, n) => {
  const colLen = getMergeColNum(sheet['!merges']);
  const leftCoor = { c: coordinate.c - 1, r: coordinate.r };
  const cell = sheet[XLSX.utils.encode_cell(leftCoor)];
  let str = '';
  if (cell && cell.t) str = XLSX.utils.format_cell(cell);
  else {
    if (n - leftCoor.c < colLen - 1) {
      str = getCellLeftStr(leftCoor, sheet, n);
    }
  }
  return str;
};
// 获取当前单元格下一行数据 coordinate:{c:c,r:r}当前单元格坐标
const getCellNextStr = (coordinate, sheet) => {
  const rowLen = getMergeRowNum(sheet['!merges']);
  const nextCoor = { c: coordinate.c, r: coordinate.r + 1 };
  const cell = sheet[XLSX.utils.encode_cell(nextCoor)];
  let str = '';
  if (cell && cell.t) str = XLSX.utils.format_cell(cell);
  else {
    if (!sheet[XLSX.utils.encode_cell(coordinate)])
      str = getCellLeftStr(nextCoor, sheet, nextCoor.c);
  }
  if (nextCoor.r < rowLen - 1 && str && getCellNextStr(nextCoor, sheet))
    str = str + '=' + getCellNextStr(nextCoor, sheet);
  return str;
};
// 获取excel表头header
const getHeaderRow = sheet => {
  const headers = [];
  if (!sheet['!ref']) {
    return headers;
  }
  const range = XLSX.utils.decode_range(sheet['!ref']);
  const merges = sheet['!merges'];
  let C;
  const R = range.s.r;
  for (C = range.s.c; C <= range.e.c; ++C) {
    let hdr = 'UNKNOWN ' + C;
    const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })];
    if (merges) {
      // 多级表头
      if (cell && cell.t) {
        hdr = XLSX.utils.format_cell(cell);
        if (getCellNextStr({ c: C, r: R }, sheet)) {
          hdr = hdr + '=' + getCellNextStr({ c: C, r: R }, sheet);
        }
      } else {
        hdr =
          getCellLeftStr({ c: C, r: R }, sheet, C) + '=' + getCellNextStr({ c: C, r: R }, sheet);
      }
    } else {
      if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
    }
    headers.push(hdr);
  }
  return headers;
};
const stringToObject = (item, arr, i, val) => {
  if (i === arr.length - 1) {
    item[arr[i]] = val;
  } else {
    if (!item[arr[i]]) item[arr[i]] = {};
  }
};
// 处理解析表格后的数据格式转换(多级表头)
const excelDataTransform = data => {
  data.map(item => {
    Object.keys(item).forEach(k => {
      if (k.includes('=')) {
        const arr = k.split('=');
        for (let i = 0; i < arr.length; i++) {
          let ostr = 'item';
          for (let j = 0; j < i; j++) {
            ostr += '[arr[' + j + ']]';
          }
          stringToObject(eval(ostr), arr, i, item[k]);
        }
      }
    });
  });
  return data;
};
// 表格数据解析
export const excelDataAnalysis = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary', cellDates: true }); //cellDates: true,
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const headers = getHeaderRow(worksheet);
      if (headers.length === 0) {
        reject('上传表格为空表格，请检查！');
      } else {
        const results = XLSX.utils.sheet_to_json(worksheet, {
          header: headers,
          defval: '',
        });
        const transformResults = excelDataTransform(results);
        const cellRowNum = worksheet['!merges'] ? getMergeRowNum(worksheet['!merges']) : 1;
        const resultArr = transformResults.slice(cellRowNum, transformResults.length);
        resolve(resultArr);
      }
    };
    reader.readAsBinaryString(file);
  });
};
