<template>
  <a-card>
    <a-row algin="middle" :gutter="[0, 20]">
      <a-col
        :sm="24"
        :xs="24"
        :md="24"
        :lg="16"
        class="position-left"
        @click="handleNavServicesDetail()"
      >
        <div>
          <a-avatar size="large" style="background-color: #87d068">
            <template #icon>
              <UserOutlined />
            </template>
          </a-avatar>
        </div>
        <div class="decs">
          <div class="font-20 font-700">{{ state.department.name }}</div>
          <div class="font-14">部门信息</div>
        </div>
      </a-col>
      <a-col :sm="24" :xs="24" :md="24" :lg="8">
        <a-row style="text-align: center">
          <a-col :span="8">
            <div class="font-14 one">进行中的任务</div>
            <div class="font-28">
              <span>6</span>
              <span class="font-16"></span>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="font-14 one">已完成的任务</div>
            <div class="font-28">
              <span>68</span>
              <span class="font-16"></span>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="font-14 one">累计公服时长</div>
            <div class="font-28">
              <span>{{ ServiceAggregateData ? ServiceAggregateData.done : '-' }}</span>
              <span class="font-16"></span>
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <!--    详情页面展开 Drawer-->
    <a-drawer v-model:visible="state.detailVisible" :width="1000" :keyboard="false">
      <template #title>
        <div class="header-title">
          <img class="img-logo" :src="state.logourl" alt="" />
          <div>教师公共服务明细</div>
        </div>
      </template>
      <div class="drawer-box">
        <a-card>
          <div class="font-28">XXX老师</div>
          <a-row :gutter="[15, 15]">
            <a-col :span="8" v-for="(item, index) in state.teacherData" :key="index + 'teach'">
              <div class="">{{ item.title }}</div>
              <div class="">{{ item.num }}</div>
            </a-col>
          </a-row>
        </a-card>
        <a-card class="mg-t15">
          <template #title>职务类服务明细</template>
          <div>
            <a-table
              :rowClassName="(record, index) => (index % 2 === 1 ? 'table-striped' : null)"
              :scroll="{ y: 340 }"
              size="small"
              :pagination="false"
              :rowKey="(record, index) => Math.random() + index"
              :columns="state.columns"
              :data-source="state.dataSource"
            ></a-table>
          </div>
        </a-card>
        <a-card class="mg-t15">
          <template #title>量化类服务明细</template>
        </a-card>
      </div>
    </a-drawer>
  </a-card>
</template>

<script>
import { reactive, onMounted, inject, watch, ref } from 'vue';
import {
  teacherData,
  columns,
  dataSource,
} from '@/components/Common/PositionModule/test/test.table';
import { STORAGE_USER_CURRENT_SUBJECT } from '@/store/mutation-type.js';
import ls from '@/utils/local-storage.js';
// import { Subject } from '@/api/services.js';

export default {
  name: 'PositionModule',
  setup() {
    const state = reactive({
      logourl: require('../../../assets/logo.svg'),
      detailVisible: false,
      positionData: {},
      teacherData,
      columns,
      dataSource,
      department: {},
    });
    const teacher = {
      title: '早上好，xxx老师',
      position: '我的信息职务是xxxxx',
      list: [
        { title: '本学年未完成公服时长', des: '56小时', sub_des: '' },
        { title: '已完成公服时长', des: '268', sub_des: '/324小时' },
        { title: '职务类公服时长', des: '33小时', sub_des: '' },
      ],
    };

    // 公共服务 总时长
    const ServiceAggregateData = ref(inject('ServiceAggregate'));
    const userFlag = inject('userFlag');
    const changePosition = () => {
      if (userFlag.value === 'teacher') {
        state.positionData = teacher;
      }
    };
    watch(userFlag, () => {
      changePosition();
    });

    // watch(
    //   () => ServiceAggregateData.value,
    //   () => {
    //     state.positionData.list[2].des = (ServiceAggregateData.value.done || '-') + '小时';
    //     console.log(ServiceAggregateData, '======服务总时长 ==ServiceAggregateData===position');
    //   },
    // );
    /**
     *公共服务时长 详情
     * */
    const handleNavServicesDetail = () => {
      state.detailVisible = true;
    };

    onMounted(() => {
      changePosition();
      const data = ls.get(STORAGE_USER_CURRENT_SUBJECT);
      state.department = data;
      // const params = {
      //   subject_id: data.id,
      // };
      // Subject(params).then(res => {
      //   console.log(res, '=====subject detail');
      // });
    });
    return {
      ServiceAggregateData,
      state,
      userFlag,
      handleNavServicesDetail,
    };
  },
};
</script>

<style scoped lang="less">
.position-left {
  display: flex;
  align-items: center;
  cursor: pointer;
  .decs {
    margin-left: 15px;
    text-align: left;
  }
}
.header-title {
  display: flex;
  align-items: center;
  font-size: 24px;
  .img-logo {
    width: 50px;
    height: 50px;
    margin-right: 20px;
  }
}
.drawer-box {
  padding: 15px;
  background: #f5f5f5;
}
.ant-table-striped :deep(.table-striped) td {
  background-color: #f5f5f5;
}
</style>
