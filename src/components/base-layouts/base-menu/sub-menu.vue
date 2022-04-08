<template>
  <a-sub-menu v-if="!menu.meta?.hideInMenu" :key="menu.path">
    <template #title>
      <!-- 210225 修改 -->
      <!-- <span>{{ i18n(menu.meta.title) }}</span> -->
      <span>{{ menu.meta.title }}</span>
    </template>
    <template #icon>
      <component v-if="menu.meta.icon !== undefined" :is="menu.meta.icon" :key="menu.meta.icon" />
      <component
        v-else-if="collapsed && menu.meta.collapsedIcon !== undefined"
        :is="menu.meta.collapsedIcon"
        :key="menu.meta.collapsedIcon"
      />
    </template>
    <template v-for="child in menu.children">
      <a-menu-item
        @mouseenter="$emit('itemHover', $event)"
        v-if="!child.children && !child.meta.hideInMenu"
        :key="child.path"
      >
        <template #icon>
          <component
            v-if="child.meta.icon !== undefined"
            :is="child.meta.icon"
            :key="child.meta.icon"
          />
          <component
            v-else-if="collapsed && child.meta.collapsedIcon !== undefined"
            :is="child.meta.collapsedIcon"
            :key="child.meta.collapsedIcon"
          />
        </template>

        <!-- 210225 修改 -->
        <!-- <span>{{ i18n(child.meta.title) }}</span> -->
        <span :title="`${child.meta.title}`">{{ child.meta.title }}</span>
      </a-menu-item>
      <sub-menu v-else :menu="child" :key="child.path" :i18n="i18n" :collapsed="collapsed" />
    </template>
  </a-sub-menu>
</template>
<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'SubMenu',
  emits: ['itemHover'],
  props: {
    i18n: {
      type: Function,
      default: t => t,
    },
    menu: {
      type: Object,
      required: true,
    },
    collapsed: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style scoped></style>
