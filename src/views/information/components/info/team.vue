<template>
  <a-descriptions bordered :column="1">
    <template v-for="info in subjectInfoData" :key="info.key">
      <a-descriptions-item :span="info.column">
        <template #label>
          <div style="width: 100px">{{ info.label }}</div>
        </template>
        <template v-if="info.value">
          <template v-if="info.key === 'web_url'">
            <a :href="info.value" target="_blank">{{ info.value }}</a>
          </template>
          <template v-else-if="info.key === 'summary'">
            <div style="white-space: pre-line">{{ info.value }}</div>
          </template>
          <template v-else>{{ info.value }}</template>
        </template>
        <template v-else>-</template>
      </a-descriptions-item>
    </template>
  </a-descriptions>
  <div class="edit-button" style="margin-top: 20px">
    <a-button type="primary" @click="editFormShow">编辑</a-button>
  </div>
  <info-form
    v-bind="editModal"
    @cancel="
      () => {
        editModal.visible = false;
      }
    "
    @ok="subjectModalOk"
  ></info-form>
</template>
<script>
import { defineComponent, reactive, toRaw } from 'vue';
import InfoForm from './info-form.vue';
const descriptionsLabel = [
  {
    key: 'name',
    label: '中心名称',
    value: '',
    column: 1,
  },
  {
    key: 'en_name',
    label: '英文名称',
    value: '',
    column: 1,
  },
  {
    key: 'director',
    label: '主任',
    value: '',
    column: 1,
  },
  {
    key: 'assistant',
    label: '主任助理',
    value: '',
    column: 1,
  },
  {
    key: 'deputy_director',
    label: '副主任',
    value: '',
    column: 1,
  },
  {
    key: 'create_time',
    label: '成立时间',
    value: '',
    column: 1,
  },
  {
    key: 'parent',
    label: '所属机构',
    value: '',
    column: 1,
  },
  {
    key: 'summary',
    label: '中心简介',
    value: '',
    column: 1,
  },
  {
    key: 'web_url',
    label: '网址',
    value: '',
    column: 1,
  },
];
export default defineComponent({
  name: 'Team',
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  emits: ['updateLoad'],
  setup(props, { emit }) {
    const handelInfo = info => {
      const dataKey = descriptionsLabel;
      dataKey.map(item => {
        switch (item.key) {
          case 'en_name':
          case 'director':
          case 'assistant':
          case 'deputy_director':
          case 'create_time':
          case 'summary':
          case 'web_url':
            item.value = info.info[item.key];
            break;
          case 'parent':
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
    const editModal = reactive({
      visible: false,
      model: undefined,
    });
    const editFormShow = () => {
      editModal.visible = true;
      editModal.model = toRaw(props.data);
    };
    const subjectModalOk = () => {
      editModal.visible = false;
      emit('updateLoad');
    };
    return {
      subjectInfoData,
      editModal,
      subjectModalOk,
      editFormShow,
    };
  },
  components: {
    InfoForm,
  },
});
</script>
