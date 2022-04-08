<template>
  <div class="timelineChart">
    <h4>{{ title }}</h4>
    <div class="chart">
      <chart :option="refChartOption" :style="{ height: chartHeight }" />
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, computed, watch, onMounted } from 'vue';
import { Chart } from '@/components';
import moment from 'moment';
export default defineComponent({
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '',
    },
    height: {
      type: Number,
      default: 0,
    },
    titleMap: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  setup(props) {
    const legendData = Object.values(props.titleMap);
    const chartOption = {
      color: ['#1790ff', '#12c2c2'],
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: legendData,
      },
      grid: {
        left: '3%',
        right: '4%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [],
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        type: 'value',
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
          },
        },
      },
      dataZoom: {},
      series: [
        {
          name: legendData[0],
          type: 'line',
          data: [],
          showSymbol: false,
        },
        {
          name: legendData[1],
          type: 'line',
          data: [],
          showSymbol: false,
        },
      ],
    };
    const refChartOption = ref(chartOption);
    const chartHeight = computed(() => `${props.height}px`);

    const setChartOption = data => {
      const xAxis = [];
      const seriesData1 = [];
      const seriesData2 = [];
      data.forEach(item => {
        const { x, y1, y2 } = item;
        xAxis.push(moment(x).format('HH:ss'));
        seriesData1.push(y1);
        seriesData2.push(y2);
      });
      refChartOption.value.xAxis.data = xAxis;
      refChartOption.value.series[0].data = seriesData1;
      refChartOption.value.series[1].data = seriesData2;
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
      refChartOption,
    };
  },

  components: {
    Chart,
  },
});
</script>

<style lang="less" scoped src="./index.less"></style>
