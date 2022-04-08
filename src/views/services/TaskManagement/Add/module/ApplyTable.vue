<template>
  <div>
    <table-module :tableData="state.tableData"></table-module>
  </div>
</template>

<script>
import TableModule from '@/components/Common/Table/index';
import { reactive } from 'vue';
export default {
  name: 'ApplyTable',
  components: {
    TableModule,
  },
  setup() {
    const state = reactive({
      tableData: {
        dataSource: [
          {
            index: 0,
            name: '教师姓名',
            status: '已确认',
            date: '2022-09-09',
          },
        ],
        columns: [
          // {
          //   dataIndex: 'index',
          //   title: '序号',
          // },
          {
            dataIndex: 'name',
            title: '姓名',
          },
          {
            dataIndex: 'status',
            title: '报名情况',
            slots: {
              customRender: 'status',
            },
          },
          {
            dataIndex: 'date',
            title: '日期',
          },
        ],
      },
    });
    return {
      state,
    };
  },
};
</script>

<style scoped></style>
