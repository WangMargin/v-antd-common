<template>
  <div class="chart">
    <chart :option="chartOption" :style="{ height: chartHeight }" />
  </div>
</template>
<script>
import { defineComponent, ref, watch, computed, onMounted } from 'vue';
import { Chart } from '@/components';
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
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: [],
      },
      grid: {
        left: '3%',
        top: '20%',
        right: '3%',
        bottom: '5%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
      },
      yAxis: {
        type: 'category',
        inverse: true,
        data: [],
      },
      series: [],
    });
    const chartHeight = computed(() => `${props.height}px`);

    const setChartOption = data => {
      const seriesData = [];
      const legend = [];
      data.forEach(item => {
        seriesData.push({
          name: item.category_name,
          type: 'bar',
          stack: '总量',
          label: {
            show: true,
            position: 'insideRight',
            formatter: function(v) {
              let val = v.value;
              if (val > 0) {
                val = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                return val;
              } else {
                return '';
              }
            },
          },
          data: item.value,
        });
        legend.push(item.category_name);
      });
      chartOption.value.legend.data = legend;
      chartOption.value.yAxis.data = data[0].year;
      chartOption.value.series = seriesData;
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
      chartOption,
      chartHeight,
      setChartOption,
    };
  },

  components: {
    Chart,
  },
});
</script>

<style scoped></style>
