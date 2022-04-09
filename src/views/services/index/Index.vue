<template>
  <div class="home-box">
    <div>
      <position-module></position-module>
      <div v-if="userFlag === 'teacher'">
        <a-row :gutter="{ xs: 8, sm: 10, md: 15 }" style="padding: 15px 0">
          <a-col :xs="24" :sm="24" :md="24" :lg="16">
            <!--        学院公共服务公告栏-->
            <services-notice></services-notice>
          </a-col>
          <a-col :xs="24" :sm="24" :md="24" :lg="8">
            <div>
              <!--        我参加的公共服务事物-->
              <transaction-module></transaction-module>
              <div class="mg-t15">
                <!--        我的管理职务-->
                <manage-module></manage-module>
              </div>
            </div>
          </a-col>
        </a-row>
        <a-row style="padding: 0px 0 15px 0">
          <a-col :xs="24" :sm="24" :md="24" :lg="17">
            <!--          我的公共服务数据-->
            <data-canvas></data-canvas>
          </a-col>
          <a-col :xs="24" :sm="24" :md="24" :lg="7">
            <!--          我参与的公共服务 统计范围-->
            <statistics-module></statistics-module>
          </a-col>
        </a-row>
      </div>
      <div v-else>
        <!--        部门 我的公共服务任务-->
        <div class="mg-t15">
          <tack-module></tack-module>
        </div>
        <div class="mg-t15" v-if="false">
          <!--        学院公共服务公告栏-->
          <services-notice></services-notice>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PositionModule from '@/components/Common/PositionModule/PositionModule';
import ServicesNotice from '@/components/Common/ServicesNotice/ServicesNotice';
import TransactionModule from '@/components/Teacher/TransactionModule/TransactionModule';
import ManageModule from '@/components/Teacher/ManageModule/ManageModule';
import DataCanvas from '@/components/Teacher/DataCanvas/DataCanvas';
import StatisticsModule from '@/components/Teacher/StatisticsModule/StatisticsModule';
import TackModule from '@/components/Department/Task/index';
import { inject, defineComponent, onBeforeMount, onMounted, reactive, provide, ref } from 'vue';
import { ServiceAggregate } from '@/api/services.js';
export default defineComponent({
  components: {
    PositionModule,
    ServicesNotice,
    TransactionModule,
    DataCanvas,
    StatisticsModule,
    ManageModule,
    TackModule,
  },
  setup() {
    const userFlag = inject('userFlag');
    const state = reactive({});
    // 活动管理聚合数据
    const AggregateData = ref();
    provide('Aggregate', AggregateData);
    // 服务总时长
    const ServiceAggregateData = ref();
    provide('ServiceAggregate', ServiceAggregateData);
    onMounted(() => {
      //  总服务时长统计
      ServiceAggregate().then(res => {
        if (res.code === 200) {
          ServiceAggregateData.value = res.data;
        }
      });
    });
    onBeforeMount(() => {});
    return {
      state,
      userFlag,
    };
  },
});
</script>

<style lang="less">
.home-box {
  background: transparent;
}
</style>
