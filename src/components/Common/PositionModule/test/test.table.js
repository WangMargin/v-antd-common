import { h } from 'vue';

export const teacherData = [
  {
    title: '本学年待完成公服时长（小时）',
    num: '56',
  },
  {
    title: '本学年已完成公服时长（小时）',
    num: '268/360',
  },
  {
    title: '职务类公服时长（每学年）',
    num: '33',
  },
];
/***
 * 静态展示table数据
 */
export const columns = [
  {
    dataIndex: 'type',
    title: '职务类型',
    customRender: ({ text, index }) => {
      if (index < dataSource.length - 1) {
        return text;
      }
      return {
        children: h('span', {}, text),
        props: {
          colSpan: 2,
        },
      };
    },
  },
  {
    dataIndex: 'name',
    title: '职务名称',
    customRender: ({ text, index }) => {
      if (index < dataSource.length - 1) {
        return text;
      }
      return {
        children: h('span', {}, ''),
        props: {
          colSpan: 0,
        },
      };
    },
  },
  {
    dataIndex: 'time',
    title: '服务小时（每学年）',
  },
];
export const dataSource = [
  {
    type: '学院工作组/委员会成员',
    name: '金融期刊学术委员会成员',
    time: '9',
  },
  {
    type: '学院工作组/委员会成员',
    name: '绿色金融学术委员会成员',
    time: '30',
  },
  {
    type: '学院工作组/委员会成员',
    name: '金融教育成员',
    time: '15',
  },
  {
    type: '总计',
    name: '总计数据一共是',
    time: '15',
  },
];
