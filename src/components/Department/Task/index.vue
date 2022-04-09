<template>
  <a-card title="我的公共服务任务">
    <template #extra v-if="userFlag === 'team'">
      <a-button size="small" type="primary" @click="handleCreateTask">发起任务</a-button>
    </template>
    <a-tabs v-model:activeKey="state.activeKey" @change="changeActiveTab">
      <a-tab-pane key="all" tab="全部"></a-tab-pane>
      <a-tab-pane v-for="item in state.tabList" :key="item.key">
        <template #tab>
          {{ item.value }}（{{ AggregateData ? AggregateData[item.key] : '-' }}）
        </template>
      </a-tab-pane>
    </a-tabs>
    <div>
      <a-table
        size="small"
        :columns="state.tableData.columns"
        :data-source="state.tableData.dataSource"
        :loading="state.loading"
        :rowKey="record => record.id"
      >
        <template #date="{ record }">
          {{ moment(record.start_time * 1000).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template #category="{ record }">
          <div v-if="record">
            <div>{{ record.rule.category }}</div>
          </div>
        </template>
        <template #detail="{ record }">
          <div v-if="record">
            {{ record.rule.detail }}
          </div>
        </template>
        <template #action="{ record }">
          <a-button type="link" @click="viewDetail(record)">详情</a-button>
        </template>
      </a-table>
    </div>
  </a-card>
  <activity-detail v-bind="detailDrawer" @close="viewDetailClose"></activity-detail>
</template>

<script>
import moment from 'moment';
import { columns } from './customData';
import { reactive, inject, onMounted, defineComponent, watch, ref } from 'vue';
import { useRouter } from 'vue-router';
import ls from '@/utils/local-storage.js';
import { STORAGE_RESOURCE } from '@/store/mutation-type';
import { Activities, Aggregate } from '@/api/services.js';
import ActivityDetail from '@/views/services/TaskManagement/components/activity-detail.vue';
export default defineComponent({
  name: 'index',
  setup(props) {
    const router = useRouter();
    const state = reactive({
      tableData: {},
      tabList: [],
      activeKey: 'all',
      loading: false,
    });
    watch(state, () => {
      // console.log(state);
    });

    const handleCreateTask = () => {
      router.push({
        name: 'servicesaddTask',
      });
    };
    const userFlag = inject('userFlag'); // 当前操作员的身份
    state.tableData = {
      columns: columns,
      dataSource: [],
    };
    // 获取当前活动列表信息
    const getActivities = params => {
      state.loading = true;
      Activities(params)
        .then(res => {
          if (res.code === 200) {
            state.tableData.dataSource = res.data.data;
          }
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => {
          state.loading = false;
        });
    };
    // 查看详情
    const detailDrawer = reactive({
      visible: false,
      title: props.title,
      id: null,
    });
    const viewDetail = record => {
      detailDrawer.visible = true;
      detailDrawer.id = record.id;
    };
    const viewDetailClose = () => {
      detailDrawer.visible = false;
    };
    // 切換當前 tab 任务状态
    const changeActiveTab = e => {
      if (e === 'all') {
        return getActivities({ statuses: 'Submit,Archiving,Archived,WaitingDone' });
      }
      getActivities({ statuses: e });
    };
    // 格式化当前tab的数据
    const formatTabKey = () => {
      const resource = ls.get(STORAGE_RESOURCE);
      const status_list = [
        { label: '审核中', value: 'Submit' },
        { label: '归档中', value: 'Archiving' },
        { label: '已归档', value: 'Archived' },
        // { label: '招募中', value: 'Publish' },
        { label: '待完结', value: 'WaitingDone' },
      ];
      state.tabList = [];
      resource.activity_status_enum.map(item => {
        status_list.map(record => {
          if (item.key === record.value) {
            state.tabList.push({
              key: item.key,
              value: record.label,
              dec_title: item.value,
            });
          }
        });
      });
    };
    const AggregateData = ref(inject('Aggregate'));

    onMounted(() => {
      changeActiveTab('all');
      formatTabKey();
      //  活动管理聚合数据
      Aggregate().then(res => {
        if (res.code === 200) {
          AggregateData.value = res.data;
        }
      });
    });
    return {
      AggregateData,
      changeActiveTab,
      moment,
      state,
      userFlag,
      handleCreateTask,
      detailDrawer,
      viewDetail,
      viewDetailClose,
    };
  },
  components: {
    ActivityDetail,
  },
});
</script>

<style scoped></style>
