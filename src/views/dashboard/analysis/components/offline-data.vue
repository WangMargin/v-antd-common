<template>
  <a-card :loading="loading" class="offlineCard" :bordered="false" style="margintop: 32px">
    <a-tabs :active-key="activeKey" @change="handleTabChange">
      <a-tab-pane v-for="shop in offlineData" :key="shop.name">
        <template #tab>
          <a-row :gutter="8" style="width: 70px; margin: 8px 0" type="flex">
            <a-col>
              <number-info
                :title="shop.name"
                :sub-title="t('dashboard.analysis.conversion-rate')"
                :gap="2"
                :total="`${shop.cvr * 100}%`"
                :theme="activeKey !== shop.name ? 'light' : undefined"
              />
            </a-col>
          </a-row>
        </template>
        <div style="padding: 0 24px">
          <timeline-chart
            :height="400"
            :data="offlineChartData"
            :title-map="{
              y1: t('dashboard.analysis.traffic'),
              y2: t('dashboard.analysis.payments'),
            }"
          />
        </div>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { TimelineChart } from './charts';
import NumberInfo from './number-info/index.vue';
export default defineComponent({
  props: {
    activeKey: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
    offlineData: {
      type: Array,
      default: () => [],
    },
    offlineChartData: {
      type: Array,
      default: () => [],
    },
    handleTabChange: {
      type: Function,
      required: true,
    },
  },

  setup() {
    const { t } = useI18n();
    return {
      t,
    };
  },

  components: {
    TimelineChart,
    NumberInfo,
  },
});
</script>
