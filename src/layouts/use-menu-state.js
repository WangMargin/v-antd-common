import { computed, inject, onMounted, reactive, ref, toRefs, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { xor } from 'lodash-es';
import { genMenuInfo, filterMenu } from '@/utils/menu-util';
import { routes } from '@/router';
const sideWidth = 208;
const collapsedWidth = 48;
const firstSideWidth = 140; // for leftmenu-layout

const secondSideWidth = 160; // for leftmenu-layout

const state = reactive({
  collapsed: false,
  openKeys: [],
  selectedKeys: [],
  current: undefined,
});
let res = null; // 用 symbol 类型是最好的，但由于热更新会导致 symbol 更新，导致获取不到正确的 provide 值

export const MenuStateSymbol = 'proGlobalMenuState';
export const injectMenuState = () => {
  return inject(MenuStateSymbol, { ...toRefs(reactive({})) });
};
export default function useMenuState(initialState) {
  const { t, locale } = useI18n();
  const route = useRoute();
  const router = useRouter();
  const store = useStore();
  const isMobile =
    initialState && initialState.isMobile ? initialState.isMobile : inject('isMobile', ref(false));
  Object.assign(state, res ? {} : initialState); // define layoutSettings

  const layoutState = reactive({
    layout: computed(() => (isMobile.value ? 'side' : store.getters['app/layout'])),
    theme: computed(() => {
      const navTheme = store.getters['app/navTheme'];
      return navTheme === 'realDark' ? 'dark' : navTheme;
    }),
    fixedSidebar: computed(() => store.getters['app/fixedSidebar']),
    fixedHeader: computed(() => store.getters['app/fixedHeader']),
    contentWidth: computed(() => store.getters['app/contentWidth']),
    // only work layout `mix` `side`
    splitMenus: computed(() => !isMobile.value && store.getters['app/splitMenus']),
    transitionName: computed(() => store.getters['app/transitionName']),
    multiTab: computed(() => store.getters['app/multiTab']),
    multiTabFixed: computed(() => store.getters['app/multiTabFixed']),
  });
  const hasSideMenu = computed(() => {
    return layoutState.layout !== 'top';
  });
  const isTopMenu = computed(() => layoutState.layout === 'top');
  const menuWidth = computed(() => {
    if (isMobile.value) {
      return sideWidth;
    }

    const width = layoutState.layout === 'left' ? firstSideWidth : sideWidth;
    return hasSideMenu.value ? (state.collapsed ? collapsedWidth : width) : undefined;
  });
  const { menuKeyMap } = genMenuInfo(filterMenu(routes));

  const getOpenKeysBySelectKey = key => {
    return menuKeyMap[key]?.parentKeys;
  };

  watch(
    () => state.collapsed,
    () => {
      if (state.collapsed && !isMobile.value) {
        state.openKeys = [];
      } else {
        state.openKeys = getOpenKeysBySelectKey(route.path);
      }
    },
  ); // 布局变化时 openKeys 为空

  watch([computed(() => layoutState.layout), computed(() => layoutState.splitMenus)], () => {
    state.openKeys = [];
  });
  watch(
    () => state.selectedKeys,
    () => {
      if (state.selectedKeys) {
        if (isMobile.value) {
          state.collapsed = true;
        }

        const path = state.selectedKeys[state.selectedKeys.length - 1];

        if (
          !state.collapsed &&
          layoutState.layout !== 'left' &&
          (layoutState.layout === 'side' ||
            layoutState.layout === 'mix' ||
            layoutState.splitMenus === true)
        ) {
          const openKeys = getOpenKeysBySelectKey(path);

          if (xor(state.openKeys, openKeys).length) {
            state.openKeys = openKeys || [];
          }
        }

        router.push({
          path: path,
        });
      }
    },
  );

  const updateMenuState = path => {
    const cachedKeys = getOpenKeysBySelectKey(path) || [];
    state.selectedKeys = [...cachedKeys, path];
  };

  const breadcrumb = ref([]);

  const updateBreadcrumb = () => {
    breadcrumb.value = route.matched.concat().map(r => {
      return {
        path: r.path,
        breadcrumbName: r.path === '/' ? t('pages.home') : t(`${r.meta.title}`),
      };
    });
  };

  const updateSelectKeys = keys => {
    state.selectedKeys = keys;
  };

  const updateCollapsed = val => {
    state.collapsed = !val;
  };

  onMounted(() => {
    watch(
      () => route.path,
      () => {
        updateMenuState(route.path); // // 更新面包屑

        updateBreadcrumb();
      }, // { immediate: true },
    ); // 动态刷新面包屑多语言

    watch(
      () => locale.value,
      () => updateBreadcrumb(),
    );
  });
  res = {
    ...toRefs(state),
    ...toRefs(layoutState),
    isMobile,
    hasSideMenu,
    isTopMenu,
    sideWidth: menuWidth,
    secondSideWidth: ref(secondSideWidth),
    breadcrumb,
    collapsedWidth,
    updateSelectKeys,
    updateCollapsed,
  };
  return res;
}
