<template>
  <a-card
    class="salesCard"
    style="height: 100%"
    :loading="loading"
    :bordered="false"
    :title="t('dashboard.analysis.the-proportion-of-sales')"
  >
    <template #extra>
      <div class="salesCardExtra">
        <slot name="dropdownGroup" />
        <div class="salesTypeRadio">
          <a-radio-group :value="salesType" @change="handleChangeSalesType">
            <a-radio-button value="all">
              {{ t('dashboard.analysis.channel.all') }}
            </a-radio-button>
            <a-radio-button value="online">
              {{ t('dashboard.analysis.channel.online') }}
            </a-radio-button>
            <a-radio-button value="stores">
              {{ t('dashboard.analysis.channel.stores') }}
            </a-radio-button>
          </a-radio-group>
        </div>
      </div>
    </template>
    <div>
      <h4 style="margintop: 8px; marginbottom: 32px">
        {{ t('dashboard.analysis.sales') }}
      </h4>
      <pie :data="salesPieData" :height="248" />
    </div>
  </a-card>
</template>
<script>
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { Pie } from './charts';
export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      default: () => false,
    },
    salesType: {
      type: String,
      required: true,
      validator: function (value) {
        return ['all', 'online', 'stores'].indexOf(value) !== -1;
      },
    },
    salesPieData: {
      type: Array,
      default: () => [],
    },
    handleChangeSalesType: {
      type: Function,
      default: () => null,
    },
  },

  setup() {
    const { t } = useI18n();
    return {
      t,
    };
  },

  components: {
    Pie,
  },
});
</script>

<style scoped lang="less" src="../style.less"></style>
