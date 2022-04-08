<template>
  <a-result
    status="403"
    title="403"
    style="background: none"
    sub-title="你没有权限，如有疑问，请联系管理员。"
  >
    <template #extra>
      <a-button type="primary" @click="backHome">返回工作台</a-button>
    </template>
  </a-result>
</template>
<script>
import { defineComponent } from 'vue';
import { Result } from 'ant-design-vue';
export default defineComponent({
  name: 'Exception403',
  setup() {
    const backHome = () => {
      location.href = process.env.VUE_APP_SYCAMORE_WEB_URL;
    };
    return {
      backHome,
    };
  },

  components: {
    // custom register component
    [Result.name]: Result,
  },
});
</script>
