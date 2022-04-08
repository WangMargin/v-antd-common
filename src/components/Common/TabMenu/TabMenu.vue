<template>
  <div>
    <a-menu
      v-model:openKeys="state.openKeys"
      v-model:selectedKeys="state.current"
      mode="horizontal"
      theme="light"
    >
      <template v-for="(item, index) in state.menu">
        <a-sub-menu v-if="item.children" :key="'submenu' + index">
          <template #title>{{ item.title }}</template>
          <a-menu-item
            v-for="iitem in item.children"
            :key="iitem.name"
            @click="routerSelect(iitem.name)"
          >
            {{ iitem.title }}
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item :key="item.name" @click="routerSelect(item.name)" v-else>
          {{ item.title }}
        </a-menu-item>
      </template>
    </a-menu>
  </div>
</template>

<script>
import { routes } from '../../../router/routes';
import { useRouter, useRoute } from 'vue-router';
import { reactive, onMounted, onBeforeMount } from 'vue';
export default {
  name: 'TabMenu',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      openKeys: [],
      current: [],
      menu: [],
    });

    const routerSelect = res => {
      // state.current[0] = res;
      router.push({
        name: res,
      });
    };
    // 格式化 routers 匹配tabmenu
    const formatMenu = () => {
      const routes_ = routes[0].children;
      let menu = [];
      routes_.map(item => {
        if (item.show_) {
          if (item.children) {
            let children = [];
            item.children.map(i_item => {
              if (i_item.show_) {
                children.push(i_item);
              }
            });
            item.children = children;
          }
          menu.push(item);
        }
      });
      state.menu = menu;
    };
    onBeforeMount(() => {
      state.current = [route.name];
    });
    onMounted(() => {
      formatMenu();
    });
    return {
      state,
      routerSelect,
    };
  },
};
</script>

<style scoped></style>
