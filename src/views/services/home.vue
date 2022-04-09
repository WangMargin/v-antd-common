<template>
  <div>
    <index-module></index-module>
  </div>
</template>

<script>
import { watch, ref, inject, reactive, onBeforeMount } from 'vue';
import { Resource } from '@/api/services';
import ls from '@/utils/local-storage';
import {STORAGE_RESOURCE} from '@/store/mutation-type';
import IndexModule from '@/views/services/index/Index'
export default {
  components: {
    IndexModule
  },
  name: 'home',
  setup() {
    const userFlag = ref(inject('userFlag'));
    watch(
      () => userFlag.value,
      () => {
        console.log(userFlag, '=======home');
      },
    );
    const state = reactive({});
    // 获取当前常量信息 并存储ls
    const getResource = () => {
      Resource()
        .then(res => {
          ls.set(STORAGE_RESOURCE, res.data);
        })
        .catch(err => {
          console.error(err);
        });
    };
    onBeforeMount(() => {
      getResource();
    });
    return {
      state,
    };
  },
};
</script>

<style scoped></style>
