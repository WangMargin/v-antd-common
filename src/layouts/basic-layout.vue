<template>
  <pro-provider :i18n="t" :content-width="contentWidth">
    <a-layout class="ant-pro-basicLayout">
      <a-drawer
        v-if="isMobile"
        :bodyStyle="{ padding: 0, height: '100%' }"
        placement="left"
        :width="sideWidth"
        :closable="false"
        :visible="!collapsed"
        @update:visible="updateCollapsed"
      >
        <sider-menu
          style="height: 100%"
          :theme="theme"
          :layout="layout"
          :fixed="fixedSidebar"
          :menus="menus"
          :sider-width="sideWidth"
          :split-menus="false"
          :collapsed-button="false"
          :collapsed="false"
          v-model:open-keys="openKeys"
          v-model:selected-keys="selectedKeys"
        />
      </a-drawer>
      <sider-menu
        v-else-if="!hasTopMenu"
        :theme="theme"
        :layout="layout"
        :fixed="fixedSidebar"
        :menus="menus"
        :sider-width="sideWidth"
        :split-menus="splitMenus"
        :collapsed-button="!splitMenus"
        v-model:collapsed="collapsed"
        v-model:open-keys="openKeys"
        v-model:selected-keys="selectedKeys"
      />
      <a-layout>
        <header-view
          :theme="theme"
          :layout="layout"
          :menus="menus"
          :sider-width="sideWidth"
          :has-sider-menu="hasSideMenu"
          :fixed-header="fixedHeader"
          :split-menus="splitMenus"
          v-model:collapsed="collapsed"
          v-model:open-keys="openKeys"
          v-model:selected-keys="selectedKeys"
        >
          <div >
<!--            用户信息-->
            <HeaderModule></HeaderModule>
<!--            隐藏用户选择-->
            <avatar-dropdown :current-user="currentUser" v-if="false" />
<!--            <select-lang />-->
          </div>
        </header-view>
        <multi-tab
          v-if="multiTab"
          :store="multiTabStore"
          :fixed="multiTabFixed"
          :sider-width="sideWidth"
        />
        <router-view v-slot="{ Component }">
          <transition v-if="Component" :name="transitionName">
            <wrap-content>
              <component :is="Component"></component>
            </wrap-content>
          </transition>
        </router-view>
        <global-footer />
      </a-layout>
    </a-layout>
    <setting-drawer v-if="false" />
  </pro-provider>
</template>
<script>
import { defineComponent, computed, inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { genMenuInfo } from '@/utils/menu-util';
import { default as WrapContent } from '@/components/base-layouts/wrap-content/index.vue';
import { default as GlobalFooter } from '@/components/base-layouts/global-footer/index.vue';
import { default as SiderMenu } from '@/components/base-layouts/sider-menu/index.vue';
import { default as HeaderView } from '@/components/base-layouts/header/index.vue';
import { default as SelectLang } from '@/components/select-lang/index.vue';
import { default as AvatarDropdown } from '@/components/avatar-dropdown.vue';
import { default as SettingDrawer } from '@/components/setting-drawer/index.vue';
import HeaderModule from "@/components/Common/HeaderModule/HeaderModule";
import {
  MultiTab,
  MultiTabStoreProducer,
  createMultiTabStoreProducer,
} from '@/components/multi-tab';
import { useStore } from 'vuex';
import { injectMenuState } from './use-menu-state';
const multiTabStore = createMultiTabStoreProducer();
export default defineComponent({
  name: 'BasicLayout',

  setup() {
    const store = useStore();
    const { t } = useI18n();
    const menuState = injectMenuState();
    console.log(menuState);
    const isMobile = inject('isMobile', ref(false));
    const currentUser = computed(() => store.getters['user/currentUser']);
    // const hasSideMenu = computed(
    //   () => menuState.layout.value === 'side' || menuState.layout.value === 'left',
    // );
    const hasSideMenu = 'side';
    // const hasTopMenu = computed(() => menuState.layout.value === 'top'); // gen menus
    const hasTopMenu = 'top'; // gen menus

    const allowRouters = computed(() => store.getters[`user/allowRouters`]); // genMenuInfo(filterMenu(routes)).menus;

    const menus = computed(() => genMenuInfo(allowRouters.value).menus);
    return {
      t,
      currentUser,
      menus,
      ...menuState,
      hasSideMenu,
      hasTopMenu,
      multiTabStore,
      isMobile,
    };
  },

  components: {
    HeaderModule,
    MultiTab,
    MultiTabStoreProducer,
    WrapContent,
    SiderMenu,
    GlobalFooter,
    HeaderView,
    SelectLang,
    AvatarDropdown,
    SettingDrawer,
  },
});
</script>

<style lang="less">
@import '../components/base-layouts/basic-layout.less';
</style>
