<template>
  <div class="ant-pro-table">
    <a-table
      style="min-width: 800px"
      :row-key="record => record.id"
      :row-class-name="(record, index) => (index % 2 === 1 ? 'ant-pro-table-row-striped' : null)"
      :columns="columns"
      :data-source="data"
      :pagination="false"
      size="middle"
    >
      <template #filterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
        <div style="padding: 8px">
          <a-input
            ref="searchInput"
            :placeholder="`输入要搜索的内容`"
            :value="selectedKeys[0]"
            style="width: 188px; margin-bottom: 8px; display: block"
            @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
            @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
          />
          <a-button
            type="primary"
            size="small"
            style="width: 90px; margin-right: 8px"
            @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
          >
            <template #icon><search-outlined /></template>
            搜索
          </a-button>
          <a-button size="small" style="width: 90px" @click="handleReset(clearFilters)">
            重置
          </a-button>
        </div>
      </template>
      <template #filterIcon>
        <search-outlined />
      </template>

      <template #customRender="{ text }">
        {{ text }}
      </template>

      <template #action="{ record }">
        <a
          @click="subjectDetail(record)"
          :disabled="true"
          class="operate"
          data-action="action_change"
        >
          操作
        </a>
        <a @click="subjectDetail(record)" class="operate">详情</a>
        <a @click="markChange(record)" class="operate" v-if="record.status.key === 'Audit'">
          标记完成
        </a>
        <a class="operate disabled" v-else>标记完成</a>
      </template>
    </a-table>
  </div>
</template>
<script>
import { defineComponent, ref, reactive, computed } from 'vue';
import moment from 'moment';
import { Modal } from 'ant-design-vue';
import { taskSubjectChangeStatusAdmin } from '@/api/task/task.js';
import { SearchOutlined } from '@ant-design/icons-vue';
import { useStore } from 'vuex';
export default defineComponent({
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    taskId: {
      type: String,
      default: '',
    },
  },
  emits: ['change', 'select'],
  setup(props, { emit }) {
    const store = useStore();
    const resourcesData = computed(() => store.getters[`resources/data`]);
    const subjectsResource = resourcesData.value.resources;
    const statusFilters = subjectsResource['subject_task_status_enum'].map(k => {
      return { text: k.value, value: k.key };
    });
    const state = reactive({
      searchText: '',
      searchedColumn: '',
    });
    const searchInput = ref();
    const columns = [
      {
        title: '主体名称',
        dataIndex: 'name',
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'customRender',
        },
        onFilter: (value, record) =>
          record.name.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              searchInput.value.focus();
            }, 0);
          }
        },
        ellipsis: true,
      },
      {
        title: '成果数',
        dataIndex: 'count',
        width: '12%',
      },
      {
        title: '状态',
        dataIndex: 'status.value',
        filters: statusFilters,
        ellipsis: true,
        onFilter: (value, record) => record.status.key.indexOf(value) === 0,
        width: '12%',
      },
      {
        title: '更新时间',
        dataIndex: 'modified_time',
        width: '20%',
        sorter: (a, b) => a.modified_at - b.modified_at,
      },
      {
        title: '操作',
        dataIndex: 'action',
        slots: {
          customRender: 'action',
        },
        width: '180px',
      },
    ];
    // 搜索
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      state.searchText = selectedKeys[0];
      state.searchedColumn = dataIndex;
    };
    // 重置
    const handleReset = clearFilters => {
      clearFilters();
      state.searchText = '';
    };
    // 详情
    const subjectDetail = record => {
      emit('select', record.id);
    };
    // 标记完成
    const markChange = record => {
      const status = 'Complete';
      Modal.confirm({
        title: '确定要标记完成吗？',
        onOk() {
          taskSubjectChangeStatusAdmin(props.taskId, record.id, status)
            .then(() => {
              emit('change');
            })
            .catch(() => {});
        },
        onCancel() {},
      });
    };
    return {
      state,
      moment,
      columns,
      subjectDetail,
      markChange,
      searchInput,
      handleSearch,
      handleReset,
    };
  },
  components: {
    SearchOutlined,
  },
});
</script>
<style lang="less" scoped>
.ant-pro-table {
  width: 100%;
  overflow: auto;
}
.operate {
  margin: 0 8px;
}
.disabled {
  color: rgba(0, 0, 0, 0.45);
}
</style>
