<template>
  <a-row :gutter="[16, 16]" type="flex" justify="space-between">
    <a-col :sm="24" :md="12" :lg="12">
      <a-space :size="16" align="center">
        <user-outlined
          :style="{ fontSize: '32px', color: '#BB133E' }"
          v-if="data.type === 'Faculty'"
        ></user-outlined>
        <team-outlined :style="{ fontSize: '32px', color: '#BB133E' }" v-else></team-outlined>
        <div class="summary">
          <h6 class="name">{{ data.title }}</h6>
          <p class="desc">{{ data.sub_title }}</p>
        </div>
      </a-space>
    </a-col>
    <a-col :xs="24" :sm="24" :md="12" :lg="12">
      <a-row :gutter="10" align="middle" justify="end">
        <a-col :xs="8" :sm="8" :md="8" :lg="6" :xl="5">
          <a-statistic title="累计成果" :value="data.item_all_count" style="text-align: center" />
        </a-col>
        <a-col :xs="8" :sm="8" :md="8" :lg="6" :xl="5">
          <a-statistic
            title="本年度成果"
            :value="data.item_this_year_count"
            style="text-align: center"
          />
        </a-col>
        <a-col :xs="8" :sm="8" :md="8" :lg="6" :xl="5">
          <a-statistic title="科研主体" :value="data.subject_count" style="text-align: center" />
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>
<script>
import { defineComponent } from 'vue';
import { UserOutlined, TeamOutlined } from '@ant-design/icons-vue';
export default defineComponent({
  name: 'Admin',
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  setup() {
    return {};
  },
  components: {
    UserOutlined,
    TeamOutlined,
  },
});
</script>
<style lang="less" scoped>
.summary {
  .name {
    margin: 0;
    padding: 0;
    font-size: 20px;
    line-height: 28px;
  }
  .desc {
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.6);
    font-size: 12px;
    line-height: 20px;
  }
}
</style>
