<template>
  <page-container :show-breadcrumb="false">
    <template v-if="fieldsData">
      <dynamic-form :fieldsData="fieldsData" :category_id="category_id" @submitFn="submitFn" />
    </template>
  </page-container>
</template>
<script>
import { useRoute, useRouter } from 'vue-router';
import { defineComponent, ref } from 'vue';
import DynamicForm from '@/components/dynamicForm.vue';
// import fromInfoData from '@/components/form-item/testFormJson.json';
import { getCategoryForm, addCategoryForm } from '@/api/form/basic-form';
import { useMultiTab } from '@/components/multi-tab/multi-tab-store.js';
import localStorage from '@/utils/local-storage';
import { STORAGE_USER_SELECT_SUBJECT } from '@/store/mutation-type';
export default defineComponent({
  name: 'Add',
  components: {
    DynamicForm,
  },
  setup() {
    const isAdmin = ref(false);
    const subjectInfo = localStorage.get(STORAGE_USER_SELECT_SUBJECT);
    subjectInfo.id === 'administrator' ? (isAdmin.value = true) : (isAdmin.value = false);
    const [{ close }] = useMultiTab();
    const fieldsData = ref(null);
    const route = useRoute();
    const router = useRouter();
    const id = route.params.category;
    const category_id = ref(id);
    const submit = data => {
      addCategoryForm(data).then(res => {
        if (res.code === 200) {
          //console.log(res);
          const closePath = route.path;
          if (isAdmin.value) {
            localStorage.set('dynamicReload', 'reload');
            router.push({ path: `/data/achievement` }).then(() => {
              close(closePath);
            });
          } else {
            localStorage.set('dynamicReload', 'reload');
            const pathType = fieldsData.value.type.key.toLowerCase();
            router.push({ path: `/achievement/${pathType}/${fieldsData.value.id}` }).then(() => {
              close(closePath);
            });
          }
        }
      });
    };
    const submitFn = e => {
      if (e) {
        // console.log(e, 8882222);
        const questData = {
          category: id,
          action: e.action,
          year: e.year ? e.year * 1 : null,
          subjects: e.subjects || [],
          schema_data: e.dynamicData,
        };
        submit(questData);
      }
    };
    getCategoryForm(id).then(res => {
      fieldsData.value = res.data.info;
      // fieldsData.value = fromInfoData.data.info;
      // console.log(fieldsData.value, '创建表单结构88888');
    });
    return {
      category_id,
      submitFn,
      fieldsData,
    };
  },
});
</script>
