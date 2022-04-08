<template>
  <a-card title="学院公共服务公告栏" class="services-box">
    <a-list item-layout="horizontal" :data-source="data">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta description="3天前发布">
            <template #title>
              <strong>{{ item.title }}</strong>
              <span>于2022年08月15日在北京召开讲座，需要三位老师参加。</span>
            </template>
            <template #avatar>
              <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            </template>
          </a-list-item-meta>
          <template #actions>
            <div v-if="userFlag !== 'teacher'">
              <a-button size="small">1/3 报名</a-button>
              <a-button size="small" :disabled="true">已结束</a-button>
            </div>
            <div v-else>
              <a-button size="small" @click="handleJoinServices()">我要参加</a-button>
              <a-button size="small" disabled>名额已满</a-button>
            </div>
          </template>
        </a-list-item>
      </template>
    </a-list>
    <!--    教师参加公共服务弹窗-->
    <a-modal
      :visible="state.visible"
      centered
      :maskClosable="false"
      :keyboard="false"
      :destroyOnClose="true"
      :closable="false"
      :footer="null"
    >
      <template #title>
        <div class="center">教师公共服务邀约</div>
      </template>
      <div>
        <p>
          <strong>服务类别：</strong>
          <span>学位|非学位项目招生项目审核</span>
        </p>
        <p>
          <strong>服务明细：</strong>
          <span>博士项目材料审核</span>
        </p>
        <p>
          <strong>服务起始日期：</strong>
          <span>2021/01/02-2022/03/09</span>
        </p>
        <p>
          <strong>备注信息：</strong>
          <span>上午下午各一场</span>
        </p>
      </div>
      <div class="center">
        <a-button @click="changeVisible(false)">取消</a-button>
        <a-button @click="handleSignUp()" class="mg-l10" type="primary">报名</a-button>
      </div>
    </a-modal>
  </a-card>
</template>
<script>
import { defineComponent, inject, reactive, h } from 'vue';
import { Modal } from 'ant-design-vue';
const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
];
export default defineComponent({
  setup() {
    const userFlag = inject('userFlag');
    const state = reactive({
      visible: false,
    });
    const handleSignUp = () => {
      Modal.success({
        title: () => '已报名',
        centered: true,
        okText: '知道了',
        content: () => h('div', {}, [h('p', '巴拉巴拉。。。。。'), h('p', '巴拉巴拉。。。。。')]),
      });
      setTimeout(() => {
        changeVisible(false);
      }, 1000);
    };
    const changeVisible = flag => {
      state.visible = flag;
    };
    const handleJoinServices = () => {
      changeVisible(true);
    };
    return {
      data,
      state,
      handleSignUp,
      changeVisible,
      handleJoinServices,
      userFlag,
    };
  },
});
</script>
<style lang="less" scoped>
.services-box {
  text-align: left;
}
</style>
