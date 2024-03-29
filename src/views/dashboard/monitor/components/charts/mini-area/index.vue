<template>
  <div class="miniChart" :style="{ height: `${height}px` }">
    <div class="chartContent">
      <chart :option="chartOption" :style="{ height: chartHeight }" />
    </div>
  </div>
</template>
<script>
import { defineComponent, computed, ref, watch, onMounted } from 'vue';
import { Chart } from '@/components'; // charts style

import '../index.less';
export default defineComponent({
  name: 'MiniArea',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    color: {
      type: String,
      default: 'rgba(24, 144, 255, 0.2)',
    },
    borderColor: {
      type: String,
      default: '#1089ff',
    },
    height: {
      type: Number,
      default: 0,
    },
    line: Boolean,
  },

  setup(props) {
    const chartHeight = computed(() => `${props.height + 54}px`);
    const chartOption = ref({
      color: [props.color],
      grid: {
        left: '-5%',
        top: '30%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [],
        show: false,
      },
      yAxis: {
        type: 'value',
        show: false,
      },
      series: {
        data: [],
        type: 'line',
        smooth: true,
        areaStyle: {},
        lineStyle: {
          color: props.line ? props.borderColor : 'none',
        },
        showSymbol: false,
      },
    });

    const setChartOption = data => {
      const xAxis = [];
      const seriesData = [];
      data.forEach(item => {
        const { x, y } = item;
        xAxis.push(x);
        seriesData.push(y);
      });
      chartOption.value.xAxis.data = xAxis;
      chartOption.value.series.data = seriesData;
    };

    watch(
      () => props.data,
      () => {
        setChartOption(props.data);
      },
    );
    onMounted(() => {
      setChartOption(props.data);
    });
    return {
      chartHeight,
      chartOption,
      setChartOption,
    };
  },

  components: {
    Chart,
  },
});
</script>
