<template>
  <a-card title="我的管理职务" class="manage-position">
    <div class="manage-position-box">
      <a-tooltip
        placement="topLeft"
        class="badge"
        v-for="(item, index) in state.positionList"
        :key="index"
      >
        <template #title>
          <span>{{ item.value }}</span>
        </template>
        <span id="one" type="link">{{ item.value }}</span>
      </a-tooltip>
      <a-button v-if="state.positionList.length > 4">更多 ></a-button>
    </div>
  </a-card>
</template>

<script>
import { reactive } from 'vue';
export default {
  name: 'ManageModule',
  setup() {
    const state = reactive({
      positionList: [],
    });
    state.positionList = [
      { key: '学院副院长', value: '学院副院长' },
      { key: '学院副院长2', value: '学院副院长2' },
      { key: '学院副院长1', value: '学院副院长1' },
      { key: '教学咨询委员会主任', value: '教学咨询委员会主任' },
      { key: '领导小组委员会', value: '领导小组委员会' },
    ];
    return {
      state,
    };
  },
};
</script>

<style scoped lang="less">
.manage-position {
  .manage-position-box {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  .badge {
    display: inline-block;
    box-sizing: border-box;
    width: 150px;
    margin: 5px;
    padding: 5px;
    cursor: pointer;
  }
}
</style>
