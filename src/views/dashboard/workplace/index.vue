<template>
  <page-container :showBreadcrumb="false" :title="t('pages.dashboard.workplace.title')">
    <template #content>
      <div class="page-header-content">
        <div class="avatar">
          <a-avatar size="large" :src="currentUser.avatar" />
        </div>
        <div class="content">
          <div class="content-title">
            早安，{{ currentUser.nickname }}
            <span class="welcome-text">，祝你开心每一天！</span>
          </div>
          <div class="pb10">{{ currentUser.extra.group }}</div>
        </div>
      </div>
    </template>
    <template #extraContent>
      <div class="extra-content">
        <div class="stat-item">
          <a-statistic title="项目数" :value="56" />
        </div>
        <div class="stat-item">
          <a-statistic title="团队内排名" :value="8" suffix="/ 24" />
        </div>
        <div class="stat-item">
          <a-statistic title="项目访问" :value="2223" />
        </div>
      </div>
    </template>
    <div>
      <a-row :gutter="24">
        <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card
            style="margin-bottom: 24px"
            class="project-list"
            title="进行中的项目"
            :loading="projects.loading"
            :bordered="false"
            :body-style="{ padding: 0 }"
          >
            <template #extra>
              <a>全部项目</a>
            </template>
            <a-card-grid
              class="project-card-grid"
              :key="item.id"
              v-for="item in projects.dataSource"
            >
              <a-card :bordered="false" :body-style="{ padding: 0 }">
                <a-card-meta>
                  <template #title>
                    <div class="card-title">
                      <a-avatar size="small" :src="item.logo" />
                      <a>{{ item.title }}</a>
                    </div>
                  </template>
                  <template #description>
                    <div class="card-description">
                      {{ item.description }}
                    </div>
                  </template>
                </a-card-meta>
                <div class="project-item">
                  <a href="/#/">科学搬砖组</a>
                  <span class="datetime">9小时前</span>
                </div>
              </a-card>
            </a-card-grid>
          </a-card>

          <a-card :loading="activities.loading" title="动态" :bordered="false">
            <a-list>
              <a-list-item :key="item.id" v-for="item in activities.dataSource">
                <a-list-item-meta>
                  <template #avatar>
                    <a-avatar :src="item.user.avatar" />
                  </template>
                  <template #title>
                    <div>
                      <a>{{ item.user.name }}</a>
                      &nbsp;
                      <span class="events">
                        <template
                          v-for="event in item.template.split(/@\{([^{}]*)\}/gi)"
                          :key="event"
                        >
                          <a v-if="item[event]" :href="item[event].link">
                            {{ item[event].name }}
                          </a>
                          <span v-else>{{ event }}</span>
                        </template>
                      </span>
                    </div>
                  </template>
                  <template #description>
                    <div>{{ item.time }}</div>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>
        <a-col style="padding: 0 12px" :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card
            title="快速开始 / 便捷导航"
            style="margin-bottom: 24px"
            :bordered="false"
            :body-style="{ padding: 0 }"
          >
            <div class="item-group">
              <a>操作一</a>
              <a>操作二</a>
              <a>操作三</a>
              <a>操作四</a>
              <a>操作五</a>
              <a>操作六</a>
              <a-button size="small" type="primary" ghost>
                <template #icon><plus-outlined /></template>
                添加
              </a-button>
            </div>
          </a-card>
          <a-card
            title="XX 指数"
            style="margin-bottom: 24px"
            :loading="radar.loading"
            :bordered="false"
            :body-style="{ padding: 0 }"
          >
            <div style="min-height: 400px">
              <!-- :scale="scale" :axis1Opts="axis1Opts" :axis2Opts="axis2Opts"  -->
              <radar :data="radar.dataSource" :height="350" />
            </div>
          </a-card>
          <a-card :loading="projects.loading" title="团队" :bordered="false">
            <div class="members">
              <a-row>
                <a-col
                  v-for="item in projects.dataSource"
                  :key="`members-item-${item.id}`"
                  :span="12"
                >
                  <a :href="item.href">
                    <a-avatar size="small" :src="item.logo" />
                    <span class="member">{{ item.member }}</span>
                  </a>
                </a-col>
              </a-row>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </page-container>
</template>
<script>
import { defineComponent, reactive, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { PlusOutlined } from '@ant-design/icons-vue';
import { useFetchData } from '@/utils/hooks/useFetchData';
import { fakeChartData, queryActivities, queryProjectNotice } from '@/api/dashboard/workplace';
import Radar from './components/radar/index.vue';
import { useStore } from 'vuex';
export default defineComponent({
  setup() {
    const { t } = useI18n();
    const store = useStore();
    const state = reactive({
      loading: true,
      radarLoading: true,
      teams: [],
      // data
      axis1Opts: {
        dataKey: 'item',
        line: null,
        tickLine: null,
        grid: {
          lineStyle: {
            lineDash: null,
          },
          hideFirstLine: false,
        },
      },
      axis2Opts: {
        dataKey: 'score',
        line: null,
        tickLine: null,
        grid: {
          type: 'polygon',
          lineStyle: {
            lineDash: null,
          },
        },
      },
      scale: [
        {
          dataKey: 'score',
          min: 0,
          max: 80,
        },
      ],
      axisData: [
        {
          item: '引用',
          a: 70,
          b: 30,
          c: 40,
        },
        {
          item: '口碑',
          a: 60,
          b: 70,
          c: 40,
        },
        {
          item: '产量',
          a: 50,
          b: 60,
          c: 40,
        },
        {
          item: '贡献',
          a: 40,
          b: 50,
          c: 40,
        },
        {
          item: '热度',
          a: 60,
          b: 70,
          c: 40,
        },
        {
          item: '引用',
          a: 70,
          b: 50,
          c: 40,
        },
      ],
    });
    const { context: projects } = useFetchData(() => {
      return queryProjectNotice().then(res => {
        return {
          data: res,
          total: 100,
        };
      });
    });
    const { context: activities } = useFetchData(() => {
      return queryActivities().then(res => {
        return {
          data: res,
          total: 100,
        };
      });
    });
    const { context: radar } = useFetchData(() => {
      return fakeChartData().then(res => {
        return {
          data: res.radarData,
          total: 100,
        };
      });
    });
    return {
      t,
      state,
      currentUser: computed(() => store.getters[`user/currentUser`]),
      projects,
      activities,
      radar,
    };
  },

  components: {
    Radar,
    PlusOutlined,
  },
});
</script>

<style scoped lang="less" src="./index.less"></style>
