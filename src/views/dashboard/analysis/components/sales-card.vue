<template>
  <a-card :loading="loading" :bordered="false" :body-style="loading ? {} : { padding: 0 }">
    <div class="salesCard">
      <a-tabs size="large" :tab-bar-style="{ marginBottom: '24px' }">
        <template #tabBarExtraContent>
          <div class="salesExtraWrap">
            <div class="salesExtra">
              <a :class="isActive('today')" @click="() => selectDate('today')">
                {{ t('dashboard.analysis.all-day') }}
              </a>
              <a :class="isActive('week')" @click="() => selectDate('week')">
                {{ t('dashboard.analysis.all-week') }}
              </a>
              <a :class="isActive('month')" @click="() => selectDate('month')">
                {{ t('dashboard.analysis.all-month') }}
              </a>
              <a :class="isActive('year')" @click="() => selectDate('year')">
                {{ t('dashboard.analysis.all-year') }}
              </a>
            </div>
            <a-range-picker
              style="width: 256px"
              :value="rangePickerValue"
              @change="handleRangePickerChange"
            />
          </div>
        </template>
        <a-tab-pane key="sales" :tab="t('dashboard.analysis.sales')">
          <a-row type="flex">
            <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
              <div class="salesBar">
                <bar :height="295" :title="t('dashboard.analysis.sales-trend')" :data="salesData" />
              </div>
            </a-col>
            <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
              <div class="salesRank">
                <h4 class="rankingTitle">
                  {{ t('dashboard.analysis.sales-ranking') }}
                </h4>
                <ul class="rankingList">
                  <li v-for="(item, i) in state.rankingListData" :key="item.title">
                    <span :class="['rankingItemNumber', { active: i < 3 }]">
                      {{ i + 1 }}
                    </span>
                    <span class="rankingItemTitle" :title="item.title">
                      {{ item.title }}
                    </span>
                    <span class="rankingItemValue">
                      {{ numeral(item.total).format('0,0') }}
                    </span>
                  </li>
                </ul>
              </div>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="views" :tab="t('dashboard.analysis.visits')">
          <a-row type="flex">
            <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
              <div class="salesBar">
                <bar
                  :height="292"
                  :title="t('dashboard.analysis.visits-trend')"
                  :data="salesData"
                />
              </div>
            </a-col>
            <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
              <div class="salesRank">
                <h4 class="rankingTitle">
                  {{ t('dashboard.analysis.visits-ranking') }}
                </h4>
                <ul class="rankingList">
                  <li v-for="(item, i) in state.rankingListData" :key="item.title">
                    <span :class="['rankingItemNumber', { active: i < 3 }]">
                      {{ i + 1 }}
                    </span>
                    <span class="rankingItemTitle" :title="item.title">
                      {{ item.title }}
                    </span>
                    <span class="rankingItemValue">
                      {{ numeral(item.total).format('0,0') }}
                    </span>
                  </li>
                </ul>
              </div>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-card>
</template>
<script>
import { defineComponent, reactive, watch, onMounted } from 'vue';
import { Bar } from './charts';
import { useI18n } from 'vue-i18n';
import numeral from 'numeral';
export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Function,
      default: () => {
        return undefined;
      },
    },
    selectDate: {
      type: Function,
      default: () => {
        return undefined;
      },
    },
    handleRangePickerChange: {
      type: Function,
      default: () => {
        return undefined;
      },
    },
    rangePickerValue: {
      type: Array,
      required: true,
    },
    salesData: {
      type: Array,
      required: true,
    },
  },

  setup() {
    const { t, locale } = useI18n();
    const state = reactive({
      rankingListData: [],
    });

    const generatorRankingData = () => {
      state.rankingListData = [];

      for (let i = 0; i < 7; i += 1) {
        state.rankingListData.push({
          title: t('dashboard.analysis.test', {
            no: i,
          }),
          total: 323234,
        });
      }
    };

    onMounted(() => {
      generatorRankingData();
      watch(
        () => locale.value,
        () => {
          generatorRankingData();
        },
      );
    });
    return {
      t,
      numeral,
      state,
    };
  },

  components: {
    Bar,
  },
});
</script>

<style scoped lang="less" src="../style.less"></style>
