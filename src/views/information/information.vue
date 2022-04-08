<template>
  <page-container>
    <template v-if="state.route === 'basic'">
      <a-card :loading="state.loading" :bordered="false">
        <template v-if="!state.loading">
          <faculty v-if="subjectInfo.type.key === 'Faculty'" :data="state.info"></faculty>
          <team
            v-if="subjectInfo.type.key === 'Team'"
            :data="state.info"
            @updateLoad="updateLoad"
          ></team>
        </template>
      </a-card>
    </template>
    <list-table v-else></list-table>
  </page-container>
</template>
<script>
import { defineComponent, onMounted } from 'vue';
import localStorage from '@/utils/local-storage';
import { STORAGE_USER_SELECT_SUBJECT } from '@/store/mutation-type';
import { useRoute } from 'vue-router';
import { Faculty, Team } from './components/info';
import ListTable from './components/list-table.vue';
import { useSubjectsInfo } from '@/api/subjects/information.js';
export default defineComponent({
  name: 'Information',
  setup() {
    const route = useRoute();
    const subjectInfo = localStorage.get(STORAGE_USER_SELECT_SUBJECT);
    const { state, fetchSubjectsInfo } = useSubjectsInfo();
    state.route = route.name;
    onMounted(() => {
      if (route.name === 'basic') {
        fetchSubjectsInfo();
      }
    });
    const updateLoad = () => {
      fetchSubjectsInfo();
    };
    return {
      state,
      subjectInfo,
      updateLoad,
    };
  },
  components: {
    Faculty,
    Team,
    ListTable,
  },
});
</script>
