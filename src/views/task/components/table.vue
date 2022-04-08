<template>
  <div class="table ant-pro-table">
    <a-table
      :row-key="record => record.id"
      :row-class-name="stripe"
      size="middle"
      :loading="state.loading"
      :columns="allColumns"
      :data-source="state.dataSource.list"
      :pagination="{
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} 条数据`,
        showSizeChanger: true,
        current: state.current,
        pageSize: state.pageSize,
        total: state.total,
        pageSizeOptions: ['25', '50', '100', '200'],
      }"
      @change="handleTableChange"
    >
      <template #filterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters }">
        <div style="padding: 8px">
          <a-input
            ref="searchInput"
            :placeholder="`输入要搜索的内容`"
            :value="selectedKeys[0]"
            style="width: 188px; margin-bottom: 8px; display: block"
            @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
            @pressEnter="confirm()"
          />
          <a-button
            type="primary"
            size="small"
            style="width: 90px; margin-right: 8px"
            @click="confirm()"
          >
            <template #icon><search-outlined /></template>
            搜索
          </a-button>
          <a-button size="small" style="width: 90px" @click="clearFilters()">重置</a-button>
        </div>
      </template>
      <template #filterIcon>
        <search-outlined />
      </template>
      <template #subjects="{ text }">
        <template v-for="(subject, index) in text" :key="subject.id">
          <span v-if="index < text.length - 1">{{ subject.name }},</span>
          <span v-else>{{ subject.name }}</span>
        </template>
      </template>
      <template #action="{ record }">
        <template v-if="isAdmin">
          <a-button
            type="link"
            size="small"
            @click="duplicateChecking(record)"
            :disabled="record.status.key !== 'Auditing' || record.is_filed ? true : false"
          >
            审核
          </a-button>
        </template>
        <a-button
          type="link"
          size="small"
          @click="viewDetails(record)"
          :disabled="record.status.key === 'Deleted' ? true : false"
        >
          详情
        </a-button>
        <a-button
          type="link"
          size="small"
          @click="deleteSycamoreClick(record)"
          :disabled="record.status.key === 'Deleted' || record.is_filed ? true : false"
        >
          删除
        </a-button>
        <template v-if="!isAdmin">
          <a-button
            type="link"
            size="small"
            @click="sendExamine(record)"
            :disabled="record.status.key === 'Published' && canAudit ? false : true"
          >
            送审
          </a-button>
        </template>
      </template>
    </a-table>
    <!-- 审核查重页 -->
    <duplicate-checking
      v-bind="duplicateCheck"
      @close="duplicateCheckClose"
      @edit="examineDuplicateEdit"
      @examine="examineDuplicateExamine"
    ></duplicate-checking>
    <!-- 详情页 -->
    <sycamore-detail
      v-bind="detailDrawer"
      @close="viewDetailsClose"
      @ok="viewDetailsExamineClickOk"
      @edit="viewDetailEdit"
    ></sycamore-detail>
    <!-- 驳回删除填写意见 -->
    <examine-reject
      v-bind="examineRejectModal"
      @close="examineRejectClose"
      @ok="examineRejectOk"
    ></examine-reject>
  </div>
</template>
<script>
import { defineComponent, ref, computed, reactive, toRaw } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { useFetchData } from '@/utils/hooks/useFetchData';
import { getTaskDetailContentTableAdmin, getTaskDetailContentTable } from '@/api/task/task.js';
import { Modal } from 'ant-design-vue';
import { useStore } from 'vuex';
import SycamoreDetail from '@/views/dynamic/components/sycamore-detail.vue';
import DuplicateChecking from './duplicate-checking.vue';
import ExamineReject from './examine-reject.vue';
import { handleFiltersSorter } from '@/utils/common.js';
import { submitAuditSycamore } from '@/api/dynamic/dynamic.js';
export default defineComponent({
  props: {
    // 任务id
    taskId: {
      type: String,
      default: '',
    },
    // 主体id
    subjectId: {
      type: String,
      default: '',
    },
    // 科研数据id
    category: {
      type: String,
      default: '',
    },
    // 科研数据类型
    categoryType: {
      type: String,
      default: '',
    },
    // 科研数据名字
    title: {
      type: String,
      default: '',
    },
    isAdmin: {
      type: Boolean,
      default: () => false,
    },
    // 是否有权限编辑提审数据
    canAudit: {
      type: Boolean,
      default: () => false,
    },
  },
  setup(props) {
    const searchInput = ref();
    const store = useStore();
    const resourcesData = computed(() => store.getters[`resources/data`]);
    const subjectsResource = resourcesData.value.resources;
    const statusFilters = subjectsResource['item_status_enum'].map(k => {
      return { text: k.value, value: k.key };
    });
    const allColumns = props.isAdmin
      ? [
          {
            title: '名称',
            dataIndex: 'name',
            slots: {
              filterDropdown: 'filterDropdown',
              filterIcon: 'filterIcon',
            },
            ellipsis: true,
            op: 'Like',
            sk: 'name',
          },
          {
            title: '年份',
            dataIndex: 'year',
            ellipsis: true,
            width: '12%',
          },
          {
            title: '主体',
            dataIndex: 'subjects',
            ellipsis: true,
            slots: {
              customRender: 'subjects',
            },
            width: '20%',
          },
          {
            title: '更新时间',
            dataIndex: 'modified_time',
            ellipsis: true,
            width: '15%',
            sorter: true,
          },
          {
            title: '操作',
            dataIndex: 'action',
            slots: {
              customRender: 'action',
            },
            width: '180px',
          },
        ]
      : [
          {
            title: '名称',
            dataIndex: 'name',
            slots: {
              filterDropdown: 'filterDropdown',
              filterIcon: 'filterIcon',
            },
            ellipsis: true,
            op: 'Like',
            sk: 'name',
          },
          {
            title: '年份',
            dataIndex: 'year',
            ellipsis: true,
            width: '12%',
          },
          {
            title: '主体',
            dataIndex: 'subjects',
            ellipsis: true,
            slots: {
              customRender: 'subjects',
            },
            width: '20%',
          },
          {
            title: '状态',
            dataIndex: 'status.value',
            filters: statusFilters,
            ellipsis: true,
            width: '15%',
            op: 'In',
            sk: 'status',
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
    const { stripe, reload, setPageInfo, context: state } = props.isAdmin
      ? useFetchData(getTaskDetailContentTableAdmin, {
          current: 1,
          pageSize: 100,
          stripe: true,
          id: props.subjectId
            ? `${props.taskId}/${props.category}/${props.subjectId}`
            : `${props.taskId}/${props.category}/all`,
        })
      : useFetchData(getTaskDetailContentTable, {
          current: 1,
          pageSize: 100,
          stripe: true,
          id: `${props.taskId}/${props.category}`,
        });
    // 搜索筛选处理
    const handleTableChange = ({ current, pageSize }, filters, sorter) => {
      const filters_sorter = handleFiltersSorter(allColumns, filters, sorter);
      setPageInfo({
        current,
        pageSize,
        filters: filters_sorter,
      });
      reload();
    };
    // 查看详情
    const detailDrawer = reactive({
      visible: false,
      record: null,
      title: '',
      id: null,
      permission: props.isAdmin ? 'admin' : 'operator',
      savePermission: true,
      zIndex: 1002,
      isFiled: false,
      taskId: props.taskId,
    });
    const viewDetails = record => {
      detailDrawer.visible = true;
      detailDrawer.record = toRaw(record);
      detailDrawer.id = record.id;
      detailDrawer.title = record.category.name;
      detailDrawer.isFiled = record.is_filed === 1 ? true : false;
    };
    const viewDetailsClose = () => {
      detailDrawer.visible = false;
    };
    // 审核查重页面点击详情按钮
    const examineDuplicateEdit = record => {
      viewDetails(record);
    };
    // 查重
    const duplicateCheck = reactive({
      visible: false,
      checkData: {},
      categoryType: '',
    });
    const duplicateChecking = record => {
      duplicateCheck.visible = true;
      duplicateCheck.checkData = record;
      duplicateCheck.categoryType = props.categoryType;
    };
    const duplicateCheckClose = () => {
      duplicateCheck.visible = false;
    };
    // 通过  驳回  删除 按钮点击
    const examineRejectModal = reactive({
      visible: false,
      id: null,
      type: '',
      zIndex: 1003,
    });
    // 显示通过驳回删除内容填写浮层
    const examineRejectClick = data => {
      examineRejectModal.visible = true;
      examineRejectModal.id = data.id;
      examineRejectModal.type = data.status;
    };
    //填写原因弹层关闭
    const examineRejectClose = () => {
      examineRejectModal.visible = false;
    };
    // 填写原因弹层提交成功后回调
    const examineRejectOk = () => {
      examineRejectClose();
      viewDetailsClose();
      duplicateCheckClose();
      reload();
    };
    // 审核列表页删除按钮点击
    const deleteSycamoreClick = record => {
      examineRejectClick({ status: 'Del', id: record.id });
    };
    // 详情页点击通过驳回删除按钮
    const viewDetailsExamineClickOk = () => {
      examineRejectOk();
    };
    // 审核查重页面点击 通过 驳回 删除
    const examineDuplicateExamine = data => {
      examineRejectClick({ status: data.type, id: data.id });
    };
    // 详情页编辑按钮点击
    const viewDetailEdit = () => {
      viewDetailsClose();
      duplicateCheckClose();
    };
    // 送审
    const sendExamine = record => {
      Modal.confirm({
        zIndex: 1005,
        title: '确定要送审吗？',
        onOk() {
          submitAuditSycamore(record.id, { remark: '' })
            .then(() => {
              reload();
            })
            .catch(() => {});
        },
        onCancel() {},
      });
    };
    return {
      state,
      stripe,
      allColumns,
      handleTableChange,
      searchInput,
      viewDetails,
      viewDetailsClose,
      detailDrawer,
      duplicateChecking,
      duplicateCheck,
      duplicateCheckClose,
      sendExamine,
      examineRejectModal,
      examineRejectClick,
      examineRejectClose,
      examineRejectOk,
      examineDuplicateEdit,
      deleteSycamoreClick,
      viewDetailsExamineClickOk,
      examineDuplicateExamine,
      viewDetailEdit,
    };
  },
  components: {
    SearchOutlined,
    SycamoreDetail,
    DuplicateChecking,
    ExamineReject,
  },
});
</script>
<style lang="less" scoped>
.table {
  .operate {
    margin: 0 5px;
  }
  .disabled {
    color: rgba(0, 0, 0, 0.45);
  }
}
</style>
