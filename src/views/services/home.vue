<template>
  <div>
    <a-card>
      <h1>home</h1>
    </a-card>
  </div>
</template>

<script>
import { watch, ref, inject, reactive, onBeforeMount } from 'vue';
import { Resource } from '@/api/services';
import ls from '@/utils/local-storage';
export default {
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
