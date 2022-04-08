<template>
  <page-container :show-breadcrumb="false">
    <template v-if="fieldsData && editData">
      <dynamic-form
        :fieldsData="fieldsData"
        :category_id="category_id"
        :editData="editData"
        :isEdit="true"
        :editId="id"
        @submitFn="submitFn"
      />
    </template>
  </page-container>
</template>
<script>
import { useRoute, useRouter } from 'vue-router';
import { defineComponent, ref } from 'vue';
import DynamicForm from '@/components/dynamicForm.vue';
import { editItemForm, getCategoryForm, getItemForm } from '@/api/form/basic-form';
import { useMultiTab } from '@/components/multi-tab/multi-tab-store.js';
import localStorage from '@/utils/local-storage';
import { STORAGE_USER_SELECT_SUBJECT } from '@/store/mutation-type';
export default defineComponent({
  name: 'edit',
  components: {
    DynamicForm,
  },
  setup() {
    const isAdmin = ref(false);
    const subjectInfo = localStorage.get(STORAGE_USER_SELECT_SUBJECT);
    subjectInfo.id === 'administrator' ? (isAdmin.value = true) : (isAdmin.value = false);
    const [{ close }] = useMultiTab();
    const fieldsData = ref(null);
    const editData = ref(null);
    const route = useRoute();
    const router = useRouter();
    // console.log(route, 9998888);
    const id = ref(route.params.id);
    const category_id = ref(route.params.category);
    getItemForm(id.value).then(res => {
      const data = res.data.info;
      editData.value = data;
    });
    const submit = (id, data) => {
      editItemForm(id, data).then(res => {
        if (res.code === 200) {
          // console.log(res);
          localStorage.set('dynamicReload', 'reload');
          const closePath = route.path;
          const pathType = fieldsData.value.type.key.toLowerCase();
          if (isAdmin.value) {
            //router.push({ path: `/data/examine` }).then(() => {
            close(closePath);
            //});
          } else {
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
          id: category_id.value,
          action: e.action,
          year: e.year ? e.year * 1 : null,
          subjects: e.subjects || [],
          schema_data: e.dynamicData,
        };
        submit(id.value, questData);
      }
    };
    getCategoryForm(category_id.value).then(res => {
      // console.log(res);
      fieldsData.value = res.data.info;
    });
    return {
      category_id,
      editData,
      id,
      submitFn,
      fieldsData,
    };
  },
});
</script>
