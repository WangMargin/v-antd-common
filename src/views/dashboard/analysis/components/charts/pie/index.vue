<template>
  <div class="pieClassName">
    <div class="chart">
      <chart :option="refChartOption" :style="{ height: `${chartHeight}` }" />
    </div>
  </div>
</template>
<script>
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { Chart } from '@/components';
const COLOR = '#666';
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
    const chartOption = {
      color: ['#1790ff', '#12c2c2', '#2fc25b', '#f04864', '#8542e0'],
      legend: {
        orient: 'vartical',
        x: 'left',
        top: 'center',
        left: '55%',
        bottom: '0%',
        data: [],
        itemGap: 12,
        textStyle: {
          color: COLOR,
        }, // formatter: (name) => {
        //   const oa: PieDataType | undefined = chartOption.series[0].data;
        //   const num = oa && oa.reduce(function(total: number, num: SeriesPie.DataObject) {
        //     return total + (num.value || 0);
        //   }, 0) || 0;
        // },
      },
      series: [
        {
          zlevel: 1,
          type: 'pie',
          clockwise: false,
          //饼图的扇区是否是顺时针排布
          minAngle: 2,
          //最小的扇区角度（0 ~ 360）
          radius: ['40%', '70%'],
          center: ['30%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            //图形样式
            normal: {
              borderColor: '#fff',
              borderWidth: 1,
            },
          },
          label: {
            normal: {
              show: false,
              position: 'center',
            },
            emphasis: {
              show: false,
              textStyle: {
                color: COLOR,
              },
            },
          },
          data: [],
        },
        {
          name: '',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['30%', '50%'],
          itemStyle: {
            //图形样式
            normal: {
              borderColor: '#fff',
              borderWidth: 1,
            },
          },
          label: {
            normal: {
              show: true,
              position: 'center',
              formatter: '{text|{c}}',
              rich: {
                text: {
                  color: COLOR,
                  fontSize: 14,
                  align: 'center',
                  verticalAlign: 'middle',
                  padding: 8,
                },
                value: {
                  color: COLOR,
                  fontSize: 12,
                  align: 'center',
                  verticalAlign: 'middle',
                },
              },
            },
          },
          data: [
            {
              value: '销售额',
              name: '',
            },
          ],
        },
      ],
    };
    const refChartOption = ref(chartOption);
    const chartHeight = computed(() => `${props.height + 100}px`);

    const setChartOption = data => {
      const xAxis = [];
      const seriesData = [];
      data.forEach(item => {
        const { x, y } = item;
        xAxis.push(x);
        seriesData.push({
          name: x,
          value: y,
        });
      });
      refChartOption.value.legend.data = xAxis;
      refChartOption.value.series[0].data = seriesData;
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
      setChartOption,
    };
  },

  components: {
    Chart,
  },
});
</script>

<style lang="less" scoped src="./index.less"></style>
