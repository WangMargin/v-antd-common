<template>
  <page-container :title="t('pages.nested.menu1.title')">
    <a-alert type="success">
      <template #message>
        <h2>Menu 3</h2>
        <router-view />
      </template>
    </a-alert>
  </page-container>
</template>
<script>
import { defineComponent } from 'vue';
import { Alert } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
export default defineComponent({
  name: 'Menu3',

  setup() {
    const { t } = useI18n();
    return {
      t,
    };
  },

  components: {
    [Alert.name]: Alert,
  },
});
</script>
