<template>
  <a-descriptions bordered :column="2">
    <a-descriptions-item
      v-for="info in subjectInfoData"
      :key="info.key"
      :label="info.label"
      :span="info.column"
    >
      <template v-if="info.value">
        {{ info.value }}
      </template>
      <template v-else>-</template>
    </a-descriptions-item>
  </a-descriptions>
</template>
<script>
import { defineComponent } from 'vue';
const descriptionsLabel = [
  {
    key: 'name',
    label: '姓名',
    value: '',
    column: 2,
  },
  {
    key: 'en_name',
    label: '英文名',
    value: '',
    column: 2,
  },
  {
    key: 'position',
    label: '职位',
    value: '',
    column: 1,
  },
  {
    key: 'title',
    label: '职称',
    value: '',
    column: 1,
  },
  {
    key: 'working_time',
    label: '在职时间',
    value: '',
    column: 2,
  },
  {
    key: 'department',
    label: '所属部门',
    value: '',
    column: 2,
  },
];
export default defineComponent({
  name: 'Faculty',
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const handelInfo = info => {
      const dataKey = descriptionsLabel;
      dataKey.map(item => {
        switch (item.key) {
          case 'working_time':
            if (info.info['leave_time']) {
              item.value = info.info['entry_time'] + ' - ' + info.info['leave_time'];
            } else {
              item.value = info.info['entry_time'] + ' - 至今';
            }
            break;
          case 'en_name':
            item.value = info.info[item.key];
            break;
          case 'position':
          case 'title':
          case 'department':
            item.value = info.info[item.key].value;
            break;
          case 'name':
            item.value = info[item.key];
            break;
        }
      });
      return dataKey;
    };
    const subjectInfoData = handelInfo(props.data);
    return {
      subjectInfoData,
    };
  },
  components: {},
});
</script>
