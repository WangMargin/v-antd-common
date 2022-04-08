<template>
  <a-dropdown class="ant-pro-dropdown ant-pro-dropdown-action" placement="bottomRight">
    <global-outlined />
    <template #overlay>
      <a-menu class="ant-pro-dropdown-menu" :selected-keys="[currentLang]" @click="handleMenuClick">
        <a-menu-item v-for="locale in locales" :key="locale" :disabled="!languageSupports[locale]">
          <span role="img" :aria-label="languageLabels[locale]">{{ languageIcons[locale] }}</span>
          {{ languageLabels[locale] }}
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
<script>
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { locales } from '@/locales';
import { GlobalOutlined } from '@ant-design/icons-vue';
const languageLabels = {
  'zh-CN': '简体中文',
  'zh-TW': '繁体中文',
  'en-US': 'English',
  'pt-BR': 'Português',
};
const languageIcons = {
  'zh-CN': '🇨🇳',
  'zh-TW': '🇭🇰',
  'en-US': '🇺🇸',
  'pt-BR': '🇧🇷',
};
const languageSupports = {
  'zh-CN': true,
  'zh-TW': false,
  'en-US': true,
  'pt-BR': false,
};
export default defineComponent({
  setup() {
    const store = useStore();
    const currentLang = computed(() => store.getters['app/lang']);

    const handleMenuClick = ({ key }) => {
      store.dispatch('app/SET_LANG', key);
    };

    return {
      currentLang,
      locales,
      languageLabels,
      languageIcons,
      languageSupports,
      handleMenuClick,
    };
  },

  components: {
    GlobalOutlined,
  },
});
</script>
