<template>
  <div class="header-module">
    <div class="logo backhome" @click="handleBackHome">
      <slot></slot>
    </div>
    <div class="handle">
      <!--      通知-->
      <div style="margin-right: 30px" v-if="false">
        <a-badge count="1" :offset="[10, 0]">
          <BellOutlined />
        </a-badge>
      </div>
      <!--      主体切换-->
      <a-space>
        <a-select
          style="min-width: 140px"
          v-model:value="state.currentSubjectName"
          :dropdownMatchSelectWidth="false"
          :options="state.subjectsList"
          @change="changeSubject"
        >
          <template #suffixIcon>
            <SwapOutlined />
          </template>
        </a-select>
      </a-space>
      <!--   操作   -->
      <a-dropdown placement="bottomRight">
        <template #overlay>
          <a-menu @click="logoutFn">
            <a-menu-item key="back">
              <RollbackOutlined />
              返回工作台
            </a-menu-item>
            <a-menu-item key="signOut">
              <LogoutOutlined />
              退出登录
            </a-menu-item>
          </a-menu>
        </template>
        <span class="handle-user mgl-10" type="link">
          <a-avatar style="background-color: #87d068" size="small" :src="state.userInfo.avatar" />
          <span>{{ state.userInfo.name }}</span>
        </span>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import { STORAGE_USER_INFO, STORAGE_USER_CURRENT_SUBJECT } from '@/store/mutation-type.js';
import ls from '@/utils/local-storage';
import { inject, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { Init } from '@/api/services';
export default {
  name: 'HeaderModule',
  setup() {
    const router = useRouter();
    const state = reactive({
      subjectsList: [],
      userInfo: {},
      currentSubject: {},
      currentSubjectName: '',
      flag: 'teacher',
      logourl: require('../../../assets/logo.svg'),
    });
    const flag = inject('userFlag');
    const changeSubject = res => {
      // flag.value = res.key;
      for (let i in state.subjectsList) {
        if (state.subjectsList[i].id === res) {
          ls.set(STORAGE_USER_CURRENT_SUBJECT, state.subjectsList[i]);
        }
      }
      // 切换成功后 需要重新加载当前subject下的数据 重置当前页面
      router.go(0);
    };
    const logoutFn = res => {
      if (res.key === 'back') {
        message.success('返回工作台');
      } else {
        message.success('退出登录');
      }
    };
    const initCurrentSubject = () => {
      const _active = ls.get(STORAGE_USER_CURRENT_SUBJECT);
      if (_active.type === '教师') {
        flag.value = 'teacher'; // teacher 显示tabmenu
      } else if (_active.type === '委托部门') {
        flag.value = 'team';
      } else {
        flag.value = 'school';
      }
    };
    // init
    const initSubject = () => {
      Init().then(res => {
        if (res.code === 200) {
          if (res.data.subjects.length < 1) {
            state.ModalVisible = true;
            return;
          }
          state.subjectsList = res.data.subjects.map(item => {
            let d = { label: item.name, value: item.id };
            return Object.assign(d, item);
          });
          state.userInfo = res.data.user;
          if (ls.get(STORAGE_USER_CURRENT_SUBJECT)) {
            state.currentSubject = ls.get(STORAGE_USER_CURRENT_SUBJECT);
          } else {
            state.currentSubject = res.data.subjects[0];
            ls.set(STORAGE_USER_CURRENT_SUBJECT, state.currentSubject);
          }
          // 判断当前是否是教师
          initCurrentSubject();
          state.currentSubjectName = state.currentSubject.name;
          ls.set(STORAGE_USER_INFO, res.data.user);
        }
      });
    };

    onMounted(async () => {
      await initSubject();
    });
    return {
      state,
      logoutFn,
      flag,
      changeSubject,
    };
  },
};
</script>

<style scoped lang="less">
.header-module {
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  /*padding: 10px;*/
  background: #ffffff;

  .handle {
    display: flex;
    align-items: center;
  }
  .handle-user {
    display: flex;
    align-items: center;
    padding: 0 12px;
    font-size: 16px;
    cursor: pointer;
    span {
      margin-right: 10px;
    }
  }
}
.mgl-10 {
  margin-left: 10px;
}
</style>
