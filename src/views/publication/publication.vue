<template>
  <page-container>
    <a-card :bordered="false">
      <a-tabs v-model:activeKey="state.activeKey" :animated="false" @change="tabChange">
        <a-tab-pane v-for="list in tabList" :key="list.key" :tab="list.title"></a-tab-pane>
      </a-tabs>
      <router-view />
    </a-card>
  </page-container>
</template>
<script>
import { defineComponent, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
export default defineComponent({
  name: 'publication',
  setup() {
    const tabList = [];
    const route = useRoute();
    const router = useRouter();
    const routeMatched = route.matched;
    const routeKey = route.meta.key;
    routeMatched.forEach(item => {
      if (routeKey === item.path) {
        const arr = item.children;
        arr.forEach(i => {
          const obj = {
            title: i.meta.title,
            key: i.name,
          };
          tabList.push(obj);
        });
      }
    });
    const state = reactive({
      activeKey: route.name,
    });
    watch(
      () => route.name,
      newValue => {
        state.activeKey = newValue;
      },
    );
    const tabChange = key => {
      router.push(routeKey + '/' + key);
    };
    return {
      tabList,
      state,
      tabChange,
    };
  },
});
</script>
