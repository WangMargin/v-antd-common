<template>
  <a-row :gutter="[16, 16]" type="flex" justify="space-between">
    <a-col :xs="24" :sm="24" :md="12" :lg="12">
      <a-space :size="16" align="center">
        <user-outlined
          :style="{ fontSize: '32px', color: '#BB133E' }"
          v-if="data.type === 'Faculty'"
        ></user-outlined>
        <team-outlined :style="{ fontSize: '32px', color: '#BB133E' }" v-else></team-outlined>
        <div class="summary">
          <h6 class="name">{{ data.title }}</h6>
          <!-- <p class="desc">{{ data.sub_title }}</p> -->
        </div>
      </a-space>
    </a-col>
    <a-col :xs="24" :sm="24" :md="12" :lg="12">
      <a-row :gutter="10" align="middle" justify="end">
        <a-col :xs="8" :sm="8" :md="8" :lg="6" :xl="5">
          <a-statistic title="累计成果" :value="data.item_all_count" style="text-align:center;" />
        </a-col>
        <a-col :xs="8" :sm="8" :md="8" :lg="6" :xl="5">
          <a-statistic
            title="本年度成果"
            :value="data.item_this_year_count"
            style="text-align:center;"
          />
        </a-col>
        <a-col :xs="8" :sm="8" :md="8" :lg="6" :xl="5">
          <a-statistic
            title="团队成员"
            :value="data.team_member_count"
            style="text-align:center;"
          />
        </a-col>
        <!-- <a-statistic
          title="累计经费(万元)"
          :value="`${moneyToTenThousand(data.team_funds_total)}`"
          style="text-align:center;"
        ></a-statistic>
        <a-statistic
          title="累计捐赠(万元)"
          :value="`${moneyToTenThousand(data.team_donation_total)}`"
          style="text-align:center;"
        ></a-statistic> -->
      </a-row>
    </a-col>
  </a-row>
</template>
<script>
import { defineComponent } from 'vue';
import { UserOutlined, TeamOutlined } from '@ant-design/icons-vue';
export default defineComponent({
  name: 'Team',
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  setup() {
    const moneyToTenThousand = val => {
      const money = (parseFloat(val) / 10000).toFixed('2');
      return money;
    };
    return {
      moneyToTenThousand,
    };
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
    font-size: 24px;
    line-height: 28px;
    margin: 0;
    padding: 0;
  }
  .desc {
    font-size: 12px;
    line-height: 20px;
    color: rgba(0, 0, 0, 0.6);
    margin: 0;
    padding: 0;
  }
}
</style>
