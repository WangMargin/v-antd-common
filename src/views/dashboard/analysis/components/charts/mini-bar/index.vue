<template>
  <div class="miniChart">
    <div class="chartContent">
      <chart :option="chartOption" :style="{ height: chartHeight }" />
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, computed, watch, onMounted } from 'vue';
import { Chart } from '@/components';
import '../../index.less';
export default defineComponent({
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    height: {
      type: Number,
      default: 0,
    },
  },

  setup(props) {
    const chartOption = ref({
      color: ['#3aa1ff'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '-5%',
        top: '30%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        show: false,
        data: [],
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        show: false,
      },
      series: {
        name: 'y',
        type: 'bar',
        barWidth: '50%',
        data: [],
      },
    });
    const chartHeight = computed(() => `${props.height + 100}px`);

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
