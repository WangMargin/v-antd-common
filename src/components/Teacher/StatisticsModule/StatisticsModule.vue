<template>
  <a-card :bordered="false">
    <div class="statistics-title">
      <span class="font-14">统计范围</span>
      <a-range-picker
        class="data"
        size="small"
        v-model:value="state.date"
        :format="state.dateFormat"
      />
    </div>
    <div class="statistics-box">
      <p class="title">我参与的公共服务（按类型排序）</p>
      <ul class="list">
        <li v-for="(item, index) in state.list" :key="index">
          <span class="l">
            <span :class="index < 3 ? 'ind-bg ind' : 'ind'">{{ index + 1 }}</span>
            <span class="mg-l10 font-14">{{ item.title }}</span>
          </span>
          <span class="r">{{ item.time }}</span>
        </li>
      </ul>
    </div>
  </a-card>
</template>

<script>
import { reactive } from 'vue';
export default {
  name: 'StatisticsModule',
  setup() {
    const state = reactive({
      dataFormat: 'YYYY/MM/DD',
      date: [],
      list: [],
    });
    state.list = [
      { title: '职务类公共服务', time: '130' },
      { title: '职务类公共服务', time: '130' },
      { title: '职务类公共服务', time: '130' },
      { title: '职务类公共服务', time: '130' },
      { title: '职务类公共服务', time: '130' },
      { title: '职务类公共服务', time: '130' },
      { title: '职务类公共服务', time: '130' },
    ];
    return {
      state,
    };
  },
};
</script>

<style scoped lang="less">
.statistics-title {
  padding: 10px 0;
  span {
    margin-right: 10px;
  }
  .date {
    width: 100px;
  }
}
.statistics-box {
  .title {
    padding: 30px 0 10px 0;
  }
  .list {
    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 0;
    }
    .ind {
      display: inline-block;
      width: 20px;
      height: 20px;
      font-size: 12px;
      line-height: 20px;
      text-align: center;
      background: #f5f5f5;
      border-radius: 50%;
    }
    .ind-bg {
      color: #ffffff;
      background: #333333;
    }
  }
}
</style>
