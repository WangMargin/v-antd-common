<template>
  <page-container :show-breadcrumb="false">
    <a-card :bordered="false" :loading="taskState.loading">
      <a-row type="flex" justify="space-between">
        <a-col>
          <a-dropdown-button :trigger="['click']" placement="bottomRight" v-if="!taskState.loading">
            {{ dropdownDefault[0].name }}
            <template #overlay>
              <a-menu @click="handleMenuClick">
                <a-menu-item v-for="menu in taskState.list" :key="menu.id">
                  {{ menu.name }}
                </a-menu-item>
                <a-menu-item v-if="taskState.total > 10" key="more">查看更多</a-menu-item>
              </a-menu>
            </template>
            <template #icon>切换</template>
          </a-dropdown-button>
        </a-col>
        <a-col>
          <template v-if="!state.loading && isAdmin">
            <a-tree-select
              show-search
              style="min-width: 180px;margin-right:20px;"
              :dropdown-style="{ maxHeight: '240px', overflow: 'auto' }"
              placeholder="选择主体"
              allow-clear
              v-model:value="state.subjectId"
              :tree-data="state.subjectsMap"
              :replace-fields="{ children: 'children', title: 'name', key: 'key', value: 'key' }"
              @change="subjectChange"
            ></a-tree-select>
            <a-button @click="editTaskClick">编辑任务</a-button>
          </template>
        </a-col>
      </a-row>
    </a-card>
    <a-card :loading="state.loading" :bordered="false" title="任务信息" style="margin-top:14px;">
      <template #extra v-if="!state.loading">
        <template v-if="isAdmin">
          <a-button type="primary" @click="taskStatusChange">
            修改状态
          </a-button>
          <template v-if="state.info.status.key === 'Complete'">
            <a-button type="primary" @click="taskFileClick" style="margin-left:20px;">
              归档
            </a-button>
          </template>
        </template>
        <template v-else>
          <template v-if="state.info.status.key === 'Start'">
            <a-button
              type="primary"
              @click="taskStatusChange"
              v-if="state.info.subject.status.key === 'Start'"
            >
              提交审核
            </a-button>
            <a-button
              type="primary"
              @click="taskStatusChange"
              :style="{ backgroundColor: '#DF942C', borderColor: '#DF942C' }"
              v-else-if="state.info.subject.status.key === 'Audit'"
            >
              撤回提交
            </a-button>
            <a-button type="primary" @click="taskStatusChange" v-else>
              修改状态
            </a-button>
          </template>
          <template v-else>
            <a-button type="primary" disabled>
              修改状态
            </a-button>
          </template>
        </template>
      </template>
      <a-row :gutter="[16, 16]" type="flex" v-if="!state.loading" class="taskDetailSummary">
        <a-col :xs="12" :sm="12" :md="8" :lg="4">
          任务名称
          <p>{{ state.info.name }}</p>
        </a-col>
        <a-col :xs="12" :sm="12" :md="8" :lg="4">
          起始时间
          <p>{{ state.info.begin_date }} {{ state.info.end_date }}</p>
        </a-col>
        <a-col :xs="12" :sm="12" :md="8" :lg="4">
          统计年份
          <p class="txt">{{ state.info.year }}</p>
        </a-col>
        <a-col :xs="12" :sm="12" :md="8" :lg="4">
          成果数
          <p class="txt">{{ state.info.item_archived_count }}/ {{ state.info.item_total_count }}</p>
        </a-col>
        <a-col v-if="isAdmin && !state.subjectId" :xs="12" :sm="12" :md="8" :lg="4">
          统计主体
          <p class="txt">
            {{ state.info.subject_complete_count }}/ {{ state.info.subject_total_count }}
          </p>
        </a-col>
        <a-col :xs="12" :sm="12" :md="8" :lg="4">
          任务状态
          <p class="txt">
            <template v-if="state.info.status.key === 'Complete'">已结束</template>
            <template v-else>{{ state.info.status.value }}</template>
          </p>
        </a-col>
        <a-col v-if="!isAdmin" :xs="12" :sm="12" :md="8" :lg="4">
          主体状态
          <p class="txt">
            <template v-if="state.info.status.key === 'NotStart'">-</template>
            <template v-else>{{ state.info.subject.status.value }}</template>
          </p>
        </a-col>
        <template v-if="isAdmin">
          <a-col :xs="12" :sm="12" :md="8" :lg="4">
            归档
            <p class="txt" v-if="state.info.is_filed === 1">
              上次归档时间 {{ state.info.filed_time }}
            </p>
            <p class="txt" v-else>未归档</p>
          </a-col>
        </template>
      </a-row>
    </a-card>
    <a-card :loading="state.loading" :bordered="false" style="margin-top:14px;">
      <a-tabs :animated="false" style="margin-top:-14px;" v-if="!state.loading">
        <a-tab-pane key="sycamore" tab="科研成果数据">
          <achievements
            :task-id="state.taskId"
            :subject-id="state.subjectId"
            :collapse-data="state.categories"
            :is-admin="isAdmin"
          ></achievements>
        </a-tab-pane>
        <a-tab-pane key="completion" tab="主体完成情况" v-if="isAdmin && !state.subjectId">
          <subject-completion
            :data="state.subjects"
            :task-id="state.taskId"
            @change="subjectStatusChange"
            @select="subjectChange"
          ></subject-completion>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <status-change
      v-bind="statusChange"
      @close="statusChangeClose"
      @ok="statusChangeOk"
    ></status-change>
  </page-container>
</template>
<script>
import { computed, defineComponent, reactive, ref, onActivated } from 'vue';
import Achievements from './components/achievements.vue';
import SubjectCompletion from './components/subject-completion.vue';
import localStorage from '@/utils/local-storage';
import { STORAGE_USER_SELECT_SUBJECT } from '@/store/mutation-type';
import {
  useGetTaskList,
  getTaskDetailContentAdmin,
  getTaskDetailContent,
  taskChangeStatusAdmin,
  taskSubjectChangeStatus,
  taskFile,
} from '@/api/task/task.js';
import { useRouter, useRoute } from 'vue-router';
import StatusChange from './components/status-change.vue';
import { message } from 'ant-design-vue';
export default defineComponent({
  name: 'TaskDetail',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const isAdmin = ref(false);
    const state = reactive({
      loading: true,
      taskId: route.params.id,
      subjectId: undefined,
      subjectsMap: [],
    });
    const subjectInfo = localStorage.get(STORAGE_USER_SELECT_SUBJECT);
    subjectInfo.id === 'administrator' ? (isAdmin.value = true) : (isAdmin.value = false);
    const getDataFun = () => {
      state.loading = true;
      if (isAdmin.value) {
        const params = state.subjectId ? `${state.taskId}/${state.subjectId}` : `${state.taskId}`;
        getTaskDetailContentAdmin(params)
          .then(res => {
            state.subjects = res.data.subject_list;
            state.info = res.data.info;
            state.categories = res.data.category_list;
            state.subjectsMap = res.data.subject_map.map(k => {
              if (k.children && k.children.length === 0) k.disabled = true;
              if (k.children && k.children.length > 0) k.selectable = false;
              return k;
            });
            state.loading = false;
          })
          .catch(() => {});
      } else {
        getTaskDetailContent(state.taskId)
          .then(res => {
            state.subjects = res.data.subject_list;
            state.info = res.data.info;
            state.categories = res.data.category_list;
            state.loading = false;
          })
          .catch(() => {});
      }
    };
    const { state: taskState, fetchAdminGetTaskList, fetchGetTaskList } = useGetTaskList();
    if (isAdmin.value) {
      fetchAdminGetTaskList({ skip: 0, limit: 10 });
    } else {
      fetchGetTaskList({ skip: 0, limit: 10 });
    }
    getDataFun();
    const dropdownDefault = computed(() => taskState.list.filter(k => k.id === state.taskId));
    // 切换任务
    const handleMenuClick = item => {
      if (isAdmin.value) {
        if (item.key === 'more') {
          router.push({
            path: `/data/task`,
          });
        } else {
          router.push({
            path: `/data/task/${item.key}`,
          });
        }
      } else {
        if (item.key === 'more') {
          router.push({
            path: `/statistics/task`,
          });
        } else {
          router.push({
            path: `/statistics/task/${item.key}`,
          });
        }
      }
    };
    // 主体标记完成 刷新数据
    const subjectStatusChange = () => {
      getDataFun();
    };
    // 编辑任务
    const editTaskClick = () => {
      router.push({
        path: `/data/task/edit/${state.taskId}`,
      });
    };
    // 选择主体
    const subjectChange = val => {
      state.subjectId = val;
      getDataFun();
    };
    onActivated(() => {
      const taskReload = localStorage.get('taskReload');
      if (taskReload) {
        getDataFun();
        localStorage.remove('taskReload');
      }
    });
    const statusChange = reactive({
      visible: false,
      id: undefined,
      status: undefined,
      confirmLoading: false,
      isAdmin: isAdmin.value,
    });
    // 改变任务状态或者提审
    const taskStatusChange = () => {
      statusChange.visible = true;
      statusChange.id = state.taskId;
      if (isAdmin.value) {
        statusChange.status = state.info.status.key;
      } else {
        statusChange.status = state.info.subject.status.key;
      }
    };
    const statusChangeClose = () => {
      statusChange.visible = false;
    };
    const statusChangeOk = data => {
      statusChange.confirmLoading = true;
      if (isAdmin.value) {
        taskChangeStatusAdmin(data.id, data.status)
          .then(() => {
            statusChange.visible = false;
            getDataFun();
          })
          .finally(() => {
            statusChange.confirmLoading = false;
          });
      } else {
        taskSubjectChangeStatus(data.id, data.status)
          .then(() => {
            statusChange.visible = false;
            getDataFun();
          })
          .finally(() => {
            statusChange.confirmLoading = false;
          });
      }
    };
    // 归档
    const taskFileClick = () => {
      taskFile(state.taskId)
        .then(() => {
          message.success('归档成功');
          getDataFun();
        })
        .catch(() => {});
    };
    return {
      isAdmin,
      state,
      taskState,
      dropdownDefault,
      handleMenuClick,
      subjectStatusChange,
      editTaskClick,
      taskStatusChange,
      subjectChange,
      statusChange,
      statusChangeClose,
      statusChangeOk,
      taskFileClick,
    };
  },
  components: {
    Achievements,
    SubjectCompletion,
    StatusChange,
  },
});
</script>
<style lang="less" scoped>
.duplicate-list {
  ::v-deep(.ant-spin-container) {
    min-height: 100px;
  }
}
@import '~ant-design-vue/es/style/themes/default.less';
.taskDetailSummary {
  p {
    margin-bottom: 0;
  }
  .txt {
    font-size: 12px;
    line-height: 22px;
    color: @text-color-secondary;
  }
}
</style>
