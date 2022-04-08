<template>
  <a-card :loading="state.loading" :bordered="false">
    <list-table
      :category="dymamicInfo.category"
      :title="dymamicInfo.title"
      :labels="state.labels"
      :action="state.action"
      :remark="state.remark"
      :status="state.status"
      v-if="!state.loading"
    ></list-table>
  </a-card>
</template>
<script>
import { defineComponent, reactive, computed, watch } from 'vue';
import ListTable from './components/list-table.vue';
import { useRoute } from 'vue-router';
import { useSycamoreLables } from '@/api/dynamic/dynamic.js';
import localStorage from '@/utils/local-storage';
import { useStore } from 'vuex';
export default defineComponent({
  name: 'Dynamic',
  emits: ['load'],
  setup(props, { emit }) {
    const store = useStore();
    const resourcesData = computed(() => store.getters[`resources/data`]);
    const subjectsResource = resourcesData.value.resources;
    const categoryTypeColor = reactive({});
    // 统计项四大类
    const categoryTypeEnum = subjectsResource['category_type_enum'];
    categoryTypeEnum.map(item => {
      categoryTypeColor[item.key] = item.color;
    });
    const route = useRoute();

    const dymamicInfo = reactive({
      category: route.name,
      title: route.meta.title,
    });
    const { state, fetchSycamoreLables } = useSycamoreLables();
    const tableLabelsStorage = localStorage.get('sycomareTableLabels') || [];
    const findCategory =
      tableLabelsStorage.length > 0 ? tableLabelsStorage.find(k => k.id === route.name) : null;
    if (findCategory && findCategory !== null) {
      Object.assign(state, findCategory);
      state.loading = false;
    } else {
      fetchSycamoreLables(route.name);
    }
    watch(
      () => state.loading,
      n => {
        if (!n) {
          emit('load', {
            title: dymamicInfo.title,
            simpleName: state.simpleName,
            remark: state.remark,
            color: categoryTypeColor[state.type],
          });
        }
      },
      {
        immediate: true,
      },
    );
    return {
      state,
      dymamicInfo,
      categoryTypeColor,
    };
  },
  components: {
    ListTable,
  },
});
</script>
<style lang="less" scoped>
.dynamic-loading {
  text-align: center;
  padding: 135px 0;
}
</style>
