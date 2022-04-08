<template>
  <page-container :show-breadcrumb="false">
    <a-card :bordered="false" title="全部任务">
      <template #extra>
        <a-button type="primary" @click="addTask" v-if="isAdmin">
          <plus-outlined />
          新增
        </a-button>
      </template>
      <module-list :is-admin="isAdmin"></module-list>
    </a-card>
  </page-container>
</template>
<script>
import { defineComponent, ref } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import localStorage from '@/utils/local-storage';
import { STORAGE_USER_SELECT_SUBJECT } from '@/store/mutation-type';
import ModuleList from './components/list.vue';
export default defineComponent({
  name: 'TaskList',
  setup() {
    const router = useRouter();
    const isAdmin = ref(false);
    const subjectInfo = localStorage.get(STORAGE_USER_SELECT_SUBJECT);
    subjectInfo.id === 'administrator' ? (isAdmin.value = true) : (isAdmin.value = false);
    //添加任务
    const addTask = () => {
      router.push({
        path: `/data/task/add`,
      });
    };
    return {
      isAdmin,
      addTask,
    };
  },
  components: {
    PlusOutlined,
    ModuleList,
  },
});
</script>
