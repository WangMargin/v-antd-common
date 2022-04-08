<template>
  <page-container :show-breadcrumb="false">
    <template #title>
      <template v-if="!loading">
        <a-space align="center" :size="0">
          <a-avatar :style="{ backgroundColor: state.color }">
            {{ state.simpleName }}
          </a-avatar>
          {{ state.title }}
        </a-space>
      </template>
    </template>
    <template #content>
      <template v-if="!loading">
        <div class="page-header-content">
          <p style="white-space: pre-line;font-weight: bold;">统计范围：{{ state.remark }}</p>
        </div>
      </template>
    </template>
    <dynamic @load="loadData"></dynamic>
    <!--    <div v-if="!loading" style="padding: 30px 10px 10px;background: #ffffff;">-->
    <!--      <a-divider orientation="left" :style="{ fontSize: '16px', height: '24px' }">-->
    <!--        统计说明-->
    <!--      </a-divider>-->
    <!--      <div class="page-header-content">-->
    <!--        <p style="white-space: pre-line;line-height: 2">统计范围：{{ state.remark }}</p>-->
    <!--      </div>-->
    <!--    </div>-->
  </page-container>
</template>
<script>
import { defineComponent, reactive, ref } from 'vue';
import Dynamic from './dynamic.vue';
export default defineComponent({
  name: 'Category',
  setup() {
    const loading = ref(true);
    const state = reactive({
      title: '',
      simpleName: '',
      remark: '',
      color: '',
    });
    const loadData = data => {
      state.simpleName = data.simpleName;
      state.remark = data.remark;
      state.color = data.color;
      state.title = data.title;
      loading.value = false;
    };
    return {
      loadData,
      loading,
      state,
    };
  },
  components: {
    Dynamic,
  },
});
</script>
