<template>
  <div style="width:100%;overflow-x: auto">
    <a-list
      class="task-list"
      :loading="state.loading"
      :data-source="state.dataSource.list"
      :pagination="
        source === 'task'
          ? {
              onChange: pageChange,
              current: state.current,
              pageSize: state.pageSize,
              hideOnSinglePage: true,
              total: state.total,
            }
          : false
      "
    >
      <template #renderItem="{ item }">
        <a-list-item>
          <template #actions>
            <a-button type="primary" ghost size="small" @click="detailClick(item)">
              本任务统计成果
            </a-button>
            <template v-if="isAdmin">
              <a-button type="primary" @click="taskStatusChange(item)" size="small">
                修改状态
              </a-button>
            </template>
            <template v-else>
              <template v-if="item.status.key === 'Start'">
                <a-button
                  type="primary"
                  @click="taskStatusChange(item)"
                  size="small"
                  v-if="item.subject_status.key === 'Start'"
                >
                  提交审核
                </a-button>
                <a-button
                  type="primary"
                  @click="taskStatusChange(item)"
                  size="small"
                  v-else-if="item.subject_status.key === 'Audit'"
                  :style="{ backgroundColor: '#DF942C', borderColor: '#DF942C' }"
                >
                  撤回提交
                </a-button>
                <a-button type="primary" @click="taskStatusChange(item)" size="small" v-else>
                  修改状态
                </a-button>
              </template>
              <a-button type="primary" disabled v-else size="small">
                修改状态
              </a-button>
            </template>
          </template>
          <a-list-item-meta
            :description="
              `${moment(item.begin_date).format('YYYY年MM月DD日')} - ${moment(item.end_date).format(
                'YYYY年MM月DD日',
              )}`
            "
          >
            <template #title>
              <a @click="detailClick(item)">{{ item.name }}</a>
            </template>
            <template #avatar>
              <a-avatar
                :style="{ backgroundColor: 'rgba(16,142,233,.7)' }"
                v-if="item.status.key === 'NotStart'"
              >
                <template #icon><clock-circle-outlined /></template>
              </a-avatar>
              <a-avatar
                :style="{ backgroundColor: 'rgba(128,128,128,.7)' }"
                v-if="item.status.key === 'Start'"
              >
                <template #icon><edit-outlined /></template>
              </a-avatar>
              <a-avatar
                :style="{ backgroundColor: 'rgba(135,208,152,.7)' }"
                v-if="item.status.key === 'Complete'"
              >
                <template #icon><check-outlined /></template>
              </a-avatar>
            </template>
          </a-list-item-meta>
          <div class="list-content">
            <div class="list-content-item">
              <span>统计年份</span>
              <p>{{ item.year }}</p>
            </div>
            <div class="list-content-item">
              <span>成果数</span>
              <p>{{ item.item_archived_count }}/{{ item.item_total_count }}</p>
            </div>
            <div class="list-content-item" v-if="!isAdmin">
              <span>状态</span>
              <p>
                <template v-if="item.status.key === 'NotStart'">-</template>
                <template v-else>{{ item.subject_status.value }}</template>
              </p>
            </div>
          </div>
        </a-list-item>
      </template>
    </a-list>
  </div>
  <status-change
    v-bind="statusChange"
    @close="statusChangeClose"
    @ok="statusChangeOk"
  ></status-change>
</template>
<script>
import moment from 'moment';
import { defineComponent, onActivated, reactive, watch } from 'vue';
import {
  adminGetTaskList,
  getTaskList,
  taskChangeStatusAdmin,
  taskSubjectChangeStatus,
} from '@/api/task/task.js';
import { useRouter } from 'vue-router';
import { useFetchData } from '@/utils/hooks/useFetchData';
import localStorage from '@/utils/local-storage';
import StatusChange from './status-change.vue';
import { EditOutlined, ClockCircleOutlined, CheckOutlined } from '@ant-design/icons-vue';
export default defineComponent({
  props: {
    isAdmin: {
      type: Boolean,
      default: () => false,
    },
    pageSize: {
      type: Number,
      default: 20,
    },
    source: {
      type: String,
      default: 'task',
    },
  },
  emits: ['load'],
  setup(props, { emit }) {
    const router = useRouter();
    const { reload, setPageInfo, context: state } = props.isAdmin
      ? useFetchData(adminGetTaskList, {
          current: 1,
          pageSize: props.pageSize,
        })
      : useFetchData(getTaskList, {
          current: 1,
          pageSize: props.pageSize,
          params:
            props.source === 'home'
              ? {
                  filter: JSON.stringify([{ op: 'In', field: 'status', value: ['Start'] }]),
                }
              : {},
        });
    onActivated(() => {
      const taskReload = localStorage.get('taskReload');
      if (taskReload) {
        reload();
        localStorage.remove('taskReload');
      }
    });
    watch(
      () => state.loading,
      n => {
        if (!n && state.total === 0 && props.source === 'home') {
          emit('load', false);
        }
      },
    );
    const pageChange = (page, pageSize) => {
      setPageInfo({
        current: page,
        pageSize: pageSize,
      });
      reload();
    };
    // 任务详情
    const detailClick = record => {
      if (props.isAdmin) {
        router.push({
          path: `/data/task/${record.id}`,
        });
      } else {
        router.push({
          path: `/statistics/task/${record.id}`,
        });
      }
    };
    const statusChange = reactive({
      visible: false,
      id: undefined,
      status: undefined,
      confirmLoading: false,
      isAdmin: props.isAdmin,
    });
    // 改变状态
    const taskStatusChange = record => {
      statusChange.visible = true;
      statusChange.id = record.id;
      if (props.isAdmin) {
        statusChange.status = record.status.key;
      } else {
        statusChange.status = record.subject_status.key;
      }
    };
    const statusChangeClose = () => {
      statusChange.visible = false;
    };
    const statusChangeOk = data => {
      statusChange.confirmLoading = true;
      if (props.isAdmin) {
        taskChangeStatusAdmin(data.id, data.status)
          .then(() => {
            statusChange.visible = false;
            reload();
          })
          .finally(() => {
            statusChange.confirmLoading = false;
          });
      } else {
        taskSubjectChangeStatus(data.id, data.status)
          .then(() => {
            statusChange.visible = false;
            reload();
          })
          .finally(() => {
            statusChange.confirmLoading = false;
          });
      }
    };
    return {
      state,
      pageChange,
      detailClick,
      taskStatusChange,
      moment,
      statusChange,
      statusChangeClose,
      statusChangeOk,
    };
  },
  components: {
    StatusChange,
    EditOutlined,
    ClockCircleOutlined,
    CheckOutlined,
  },
});
</script>
<style lang="less" scoped>
@import '~ant-design-vue/es/style/themes/default.less';
.task-list {
  min-width: 880px;
  .list-content {
    font-size: 0;
    .list-content-item {
      display: inline-block;
      width: 100px;
      font-size: @font-size-base;
      vertical-align: middle;
      > span {
        line-height: 20px;
      }
      > p {
        margin-bottom: 0;
        line-height: 22px;
        color: @text-color-secondary;
      }
    }
  }
}
.task-list ::v-deep(.ant-list-item-action) {
  margin-left: 0;
}
</style>
