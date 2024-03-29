<template>
  <a-card
    style="height: 100%"
    :loading="loading"
    :bordered="false"
    :title="t('dashboard.analysis.online-top-search')"
  >
    <template #extra>
      <slot name="dropdownGroup" />
    </template>
    <a-row :gutter="68" type="flex">
      <a-col :sm="12" :xs="24" style="marginbottom: 24px">
        <number-info :gap="8" :total="numeral(12321).format('0,0')" status="up" :sub-total="17.1">
          <template #subTitle>
            <span>
              {{ t('dashboard.analysis.search-users') }}
              <a-tooltip :title="t('dashboard.analysis.introduce')">
                <info-circle-outlined style="marginleft: 8px" />
              </a-tooltip>
            </span>
          </template>
        </number-info>
        <mini-area line :height="45" :data="visitData2" />
      </a-col>
      <a-col :sm="12" :xs="24" style="marginbottom: 24px">
        <number-info :total="2.7" status="down" :sub-total="26.2" :gap="8">
          <template #subTitle>
            <span>
              {{ t('dashboard.analysis.per-capita-search') }}
              <a-tooltip :title="t('dashboard.analysis.introduce')">
                <info-circle-outlined style="marginleft: 8px" />
              </a-tooltip>
            </span>
          </template>
        </number-info>
        <mini-area line :height="45" :data="visitData2" />
      </a-col>
    </a-row>
    <a-table
      size="small"
      :row-key="record => record.index"
      :columns="state.columns"
      :data-source="searchData"
      :pagination="{
        style: { marginBottom: 0 },
        pageSize: 5,
      }"
    >
      <template #keywordRender="{ text }">
        <a href="/">{{ text }}</a>
      </template>

      <template #rangeRender="{ text, record }">
        <trend :flag="record.status === 1 ? 'down' : 'up'">
          <span style="marginright: 4px">{{ text }}%</span>
        </trend>
      </template>
    </a-table>
  </a-card>
</template>
<script>
import { defineComponent, reactive } from 'vue';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import { useI18n } from 'vue-i18n';
import { MiniArea } from './charts';
import NumberInfo from './number-info/index.vue';
import Trend from './trend/index.vue';
import numeral from 'numeral';
export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      default: () => false,
    },
    visitData2: {
      type: Array,
      default: () => [],
    },
    searchData: {
      type: Array,
      default: () => [],
    },
  },

  setup() {
    const { t } = useI18n();
    const columns = [
      {
        title: t('dashboard.analysis.table.rank'),
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: t('dashboard.analysis.table.search-keyword'),
        dataIndex: 'keyword',
        key: 'keyword',
        scopedSlots: {
          customRender: 'keywordRender',
        },
      },
      {
        title: t('dashboard.analysis.table.users'),
        dataIndex: 'count',
        key: 'count',
        sorter: (a, b) => a.count.length - b.count.length,
        class: 'alignRight',
      },
      {
        title: t('dashboard.analysis.table.weekly-range'),
        dataIndex: 'range',
        key: 'range',
        sorter: (a, b) => a.range - b.range,
        scopedSlots: {
          customRender: 'rangeRender',
        },
      },
    ];
    const state = reactive({
      columns,
    });
    return {
      t,
      numeral,
      state,
    };
  },

  components: {
    NumberInfo,
    Trend,
    MiniArea,
    // icons
    InfoCircleOutlined,
  },
});
</script>

<style scoped lang="less" src="../style.less"></style>
