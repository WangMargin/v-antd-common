<template>
  <div class="radar">
    <div>
      <h4 v-if="$slots.title" style="margin-bottom: 20px">
        <slot name="title" />
      </h4>
      <h4 v-else-if="title" style="margin-bottom: 20px">
        {{ title }}
      </h4>
      <chart :option="chartOption" :style="{ height: `${chartHeight}` }" />
    </div>
  </div>
</template>
<script>
import { computed, defineComponent, ref, onMounted, watch, inject } from 'vue';
import { Chart } from '@/components';
export default defineComponent({
  name: 'Radar',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    height: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: undefined,
    },
  },

  setup(props) {
    const isRealDark = inject('isRealDark', ref(false));
    const chartOption = ref({
      color: [
        '#167CDB',
        '#FACC14',
        '#2FC25B',
        '#8543E0',
        '#F04864',
        '#13C2C2',
        '#fa8c16',
        '#a0d911',
      ],
      tooltip: {},
      radar: {
        center: ['50%', '50%'],
        radius: '65%',
        name: {
          textStyle: {
            color: isRealDark ? 'rgba(255, 255, 255, 0.65)' : '#3D4D65',
          },
        },
        axisLine: {
          lineStyle: {
            color: '#DEDEDE',
            width: 1,
            type: 'dotted',
          },
        },
        splitLine: {
          lineStyle: {
            color: ['#DEDEDE'],
            width: 1,
          },
        },
        splitArea: {
          areaStyle: {
            color: [
              'rgba(255, 255, 255, 0)',
              'rgba(255, 255, 255, 0)',
              'rgba(255, 255, 255, 0)',
              'rgba(255, 255, 255, 0)',
            ],
            shadowColor: '#fff',
          },
        },
        indicator: [],
      },
      series: {
        type: 'radar',
        data: [],
      },
    });
    const chartHeight = computed(() => `${props.height}px`);

    const setChartOption = data => {
      // {
      //   label:"热度"
      //   name:"部门"
      //   value:7
      // }
      const radarData = new Set();
      const seriesData = {};
      data.forEach(item => {
        const { label, name, value } = item;
        radarData.add(label);

        if (seriesData[name]) {
          seriesData[name].push(value);
        } else {
          seriesData[name] = [value];
        }
      });
      const radarDataArr = [...radarData];
      chartOption.value.radar.indicator = radarDataArr.map(item => {
        return {
          name: item,
          max: 10,
        };
      });
      chartOption.value.series.data = Object.keys(seriesData).map(item => {
        return {
          name: item,
          value: seriesData[item],
        };
      });
    };

    onMounted(() => {
      watch(
        () => props.data,
        data => {
          setChartOption(data);
        },
        {
          immediate: true,
        },
      );
    });
    return {
      chartOption,
      chartHeight,
    };
  },

  components: {
    Chart,
  },
});
</script>

<style scoped></style>
