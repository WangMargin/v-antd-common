<template>
  <a-card :bordered="false">
    <a-tabs v-model:activeKey="state.activeKey">
      <a-tab-pane key="1" tab="我的公共服务数据">
        <p>2022年公共服务数据分布（按月）</p>
        <div>
          <div ref="canvasData" style="width: 100%; height: 300px"></div>
          <div id="customerChart"></div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="数据导出" force-render>
        <slot>
          <p>我的公共服务数据导出</p>
        </slot>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import { reactive, ref, onMounted } from 'vue';
import * as echarts from 'echarts';
export default {
  name: 'DataCanvas',
  setup() {
    const canvasData = ref();
    const state = reactive({
      activeKey: '1',
    });

    /**
     * 设置 canvas
     * */
    const initCanvas = () => {
      const myChart = echarts.init(canvasData.value);
      // 绘制图表
      myChart.setOption({
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: 'value',
        },
        grid: {
          x: 0, // 距离左边
          x2: 0, // 距离右边
          y: 0, // 距离上边
          y2: 0, // 距离下边
          left: 40,
          right: 20,
          top: 20,
          bottom: 20,
        },

        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar',
          },
        ],
      });
    };

    onMounted(() => {
      initCanvas();
    });
    return {
      state,
      canvasData,
    };
  },
};
</script>

<style scoped></style>
