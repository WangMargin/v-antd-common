<template>
  <page-container :show-breadcrumb="false">
    <a-card :loading="state.loading" :bordered="false">
      <faculty
        v-if="subjectInfo.type.key === 'Faculty' && !state.loading"
        :data="state.info"
      ></faculty>
      <team v-if="subjectInfo.type.key === 'Team' && !state.loading" :data="state.info"></team>
      <school
        v-if="subjectInfo.type.key === 'School' && !state.loading"
        :data="state.info"
      ></school>
      <admin v-if="subjectInfo.type.key === 'Admin' && !state.loading" :data="state.info"></admin>
    </a-card>
    <template v-if="taskIsShow">
      <a-card :bordered="false" style="margin-top:14px">
        <template #title>
          统计任务
          <em style="font-size: 12px;color: rgba(0, 0, 0, 0.45);font-style:normal;">
            请按照要求完成科研项目的填报并提交审核
          </em>
        </template>
        <template #extra>
          <a-button type="primary" v-if="isAdmin" @click="enterTaskList">管理</a-button>
          <a-button v-else @click="enterTaskList">显示全部</a-button>
        </template>
        <module-list
          :is-admin="isAdmin"
          :page-size="3"
          :source="'home'"
          @load="loadShow"
        ></module-list>
      </a-card>
    </template>
    <template v-if="state.category_list.length > 0">
      <a-card
        :loading="state.loading"
        title="成果填报"
        :bordered="false"
        style="margin-top:14px;"
        :body-style="{ padding: '0' }"
      >
        <a-tabs :animated="false" style="padding: 0;" :tabBarStyle="{ marginBottom: '0' }">
          <a-tab-pane
            v-for="card in state.category_list"
            :key="`${card.key}`"
            :tab="`${card.value}`"
          >
            <a-card :bordered="false">
              <a-card-grid
                v-for="l in card.list"
                :key="l.key"
                style="padding: 10px;"
                class="project-card-grid"
              >
                <a-card class="typography-card" :bordered="false" :body-style="{ padding: '10px' }">
                  <a-card-meta>
                    <template #title>
                      <div class="card-title">
                        <span>
                          <a-avatar
                            :size="22"
                            :style="{ backgroundColor: categoryTypeColor[l.type] }"
                          >
                            {{ l.simple_name }}
                          </a-avatar>
                        </span>
                        <span style="padding:0 5px;" class="line-1">{{ l.name }}</span>
                        <span>
                          <a-popover placement="topRight" :overlayStyle="{ width: '300px' }">
                            <template #content>
                              {{ l.description }}
                            </template>
                            <template #title>
                              <span>
                                <b>{{ l.name }}</b>
                              </span>
                            </template>
                            <InfoCircleOutlined style="color:#999" />
                          </a-popover>
                        </span>
                      </div>
                    </template>
                    <template #description>
                      <text-ellipsis
                        :title="`${l.name}`"
                        :content="`包括：${l.description}`"
                      ></text-ellipsis>
                    </template>
                  </a-card-meta>
                  <div class="project-item">
                    <span @click="linkClick(l)">累计 {{ l.count }} 项</span>
                    <a-button
                      type="primary"
                      ghost
                      @click="linkClick(l, 'add')"
                      class="datetime"
                      size="small"
                    >
                      填报
                    </a-button>
                  </div>
                </a-card>
              </a-card-grid>
            </a-card>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </template>
    <a-card :loading="state.loading" :bordered="false" style="margin-top:14px;">
      <statistics-chart
        v-if="!state.loading"
        :year="state.year"
        :table="state.table"
        :chart="state.chart"
        :is-admin="isAdmin"
      ></statistics-chart>
    </a-card>
  </page-container>
</template>
<script>
import { defineComponent, onMounted, ref, computed, reactive } from 'vue';
import { useSubjectsSycamore } from '@/api/home/home.js';
import { Admin, Team, School, Faculty } from './components/summary';
import StatisticsChart from './components/statistics-chart.vue';
import ModuleList from '@/views/task/components/list.vue';
import localStorage from '@/utils/local-storage';
import { STORAGE_USER_SELECT_SUBJECT } from '@/store/mutation-type';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import TextEllipsis from './components/text-ellipsis.vue';
export default defineComponent({
  name: 'Home',
  setup() {
    const router = useRouter();
    const isAdmin = ref(false);
    const subjectInfo = localStorage.get(STORAGE_USER_SELECT_SUBJECT);
    subjectInfo.id === 'administrator' ? (isAdmin.value = true) : (isAdmin.value = false);
    const store = useStore();
    const resourcesData = computed(() => store.getters[`resources/data`]);
    const subjectsResource = resourcesData.value.resources;
    const categoryTypeColor = reactive({});
    // 统计项四大类
    const categoryTypeEnum = subjectsResource['category_type_enum'];
    categoryTypeEnum.map(item => {
      categoryTypeColor[item.key] = item.color;
    });
    const { state, fetchSubjectsSycamore, fetchAdminInfo } = useSubjectsSycamore();
    onMounted(() => {
      if (isAdmin.value) {
        fetchAdminInfo();
      } else {
        fetchSubjectsSycamore();
      }
    });
    const enterTaskList = () => {
      if (isAdmin.value) {
        router.push({
          path: `/data/task`,
        });
      } else {
        router.push({
          path: `/statistics/task`,
        });
      }
    };
    // 点击跳转
    const linkClick = (record, t) => {
      const type = record.type.toLowerCase();
      if (t === 'add') {
        router.push({
          path: `/researchdata/add/${record.id}`,
        });
      } else {
        router.push({
          path: `/achievement/${type}/${record.id}`,
        });
      }
    };
    // 任务模块加载后反馈
    const taskIsShow = ref(true);
    const loadShow = data => {
      taskIsShow.value = data;
    };
    // 省略事件
    const ellipsisOnExpand = e => {
      console.log(e);
    };
    const ellipsisOnEllipsis = ellipsis => {
      console.log(ellipsis);
    };
    return {
      isAdmin,
      subjectInfo,
      state,
      enterTaskList,
      linkClick,
      categoryTypeColor,
      taskIsShow,
      loadShow,
      ellipsisOnExpand,
      ellipsisOnEllipsis,
    };
  },
  components: {
    StatisticsChart,
    Faculty,
    Admin,
    Team,
    School,
    ModuleList,
    TextEllipsis,
  },
});
</script>
<style lang="less" scoped>
.typography-card ::v-deep(div.ant-typography, .ant-typography p) {
  margin-bottom: 0;
}

@media screen and (min-width: 1200px) {
  .project-card-grid {
    width: 25%;
  }
}
@media screen and (max-width: 1200px) {
  .project-card-grid {
    width: 50%;
  }
}
@media screen and (max-width: 768px) {
  .project-card-grid {
    width: 100%;
  }
}

.project-item {
  display: flex;
  margin-top: 15px;
  padding: 0 6px;
  overflow: hidden;
  font-size: 12px;
  /*height: 20px;*/
  line-height: 20px;

  span {
    cursor: pointer;
    color: rgba(0, 0, 0, 0.45);
    display: inline-block;
    flex: 1 1 0;

    &:hover {
      color: #bb133e;
    }
  }
  .datetime {
    flex: 0 0 auto;
    height: 18px;
    line-height: 16px;
    float: right;
    font-size: 12px;
  }
}
.card-title {
  display: flex;
  align-items: center;
  span:nth-child(2) {
    flex: auto;
    display: inline-block;
    margin: 0 5px;
  }
}
</style>
