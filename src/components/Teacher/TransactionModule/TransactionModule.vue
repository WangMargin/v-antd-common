<template>
  <a-card title="我参加的公服事务">
    <a-table
      size="small"
      :columns="columns"
      :data-source="data"
      :rowClassName="(record, index) => (index % 2 === 1 ? 'table-striped' : null)"
    ></a-table>
  </a-card>
</template>

<script>
import { reactive } from 'vue';
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
];
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Ben Kang',
    age: 15,
    address: 'Sidney No. 1 Lake Park',
  },
];
export default {
  name: 'TransactionModule',
  setup() {
    const state = reactive({});
    return {
      state,
      columns,
      data,
    };
  },
};
</script>

<style scoped></style>
