const columns = [
  {
    title: '日期',
    dataIndex: 'date',
    key: 'date',
    slots: {
      customRender: 'date',
    },
  },
  {
    title: '服务类别',
    dataIndex: 'category',
    key: 'category',
    slots: {
      customRender: 'category',
    },
  },
  {
    title: '服务明细',
    dataIndex: 'detail',
    key: 'detail',
    slots: {
      customRender: 'detail',
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    sortDirections: ['descend', 'ascend'],
    sorter: (a, b) => a.status - b.status,
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    slots: {
      customRender: 'action',
    },
  },
];
const dataSource = [
  {
    key: '1',
    date: '2022-10-11',
    time: 32,
    status: '待审批',
    title: 'EMBA宣讲会（京外）',
  },
  {
    key: '2',
    date: '2021-12-12',
    time: 42,
    status: '已完结',
    title: '学生节新生晚会交流会',
  },
];
export { columns, dataSource };
