<template>
  <div>
    <a-table
      :bordered="false"
      :dataSource="state.dataSource"
      :pagination="state.pagination || false"
      :columns="state.columns"
      :size="state.size"
      :rowKey="record => record.index"
      :locale="{ emptyText: '暂无数据' }"
      @change="onChange"
    >
      <template v-slot:status="{ record }">
        <a-badge :color="badgeFromat(record)" :text="record.status"></a-badge>
      </template>
    </a-table>
  </div>
</template>

<script>
import { reactive, onMounted } from 'vue';
export default {
  name: 'index',
  props: {
    tableData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  setup(props) {
    const state = reactive({
      dataSource: [],
      columns: [],
      size: 'small',
    });
    const onChange = (pagination, filters, sorter) => {
      console.log('params', pagination, filters, sorter);
    };
    const badgeFromat = record => {
      const list = [
        { key: '已确认', col: '#bb133e', value: '' },
        { key: '已报名', col: '#87d068', value: '' },
        { key: '已婉拒', col: '#f50', value: '' },
        { key: '已读', col: '#dddddd', value: '' },
        { key: '未读', col: 'gold', value: '' },
      ];
      let col = '';
      list.map(item => {
        if (item.key === record.status) {
          col = item.col;
        }
      });
      return col;
    };
    onMounted(() => {
      // console.log(props);
      state.dataSource = props.tableData.dataSource;
      state.columns = props.tableData.columns;
    });
    return {
      onChange,
      badgeFromat,
      state,
    };
  },
};
</script>

<style scoped></style>
