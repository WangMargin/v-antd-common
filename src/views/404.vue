<template>
  <a-result status="404" title="页面找不到" style="background: none" sub-title="访问的页面不存在">
    <template #extra>
      <router-link to="/">
        <a-button type="primary">返回首页</a-button>
      </router-link>
    </template>
  </a-result>
</template>
<script>
import { defineComponent } from 'vue';
import { Result } from 'ant-design-vue';
export default defineComponent({
  name: 'Exception404',
  setup() {
    return {};
  },

  components: {
    // custom register component
    [Result.name]: Result,
  },
});
</script>
