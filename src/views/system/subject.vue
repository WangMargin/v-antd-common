<template>
  <page-container>
    <a-card :bordered="false" :body-style="{ paddingTop: 0 }">
      <subject-content></subject-content>
    </a-card>
  </page-container>
</template>
<script>
import { defineComponent } from 'vue';
import SubjectContent from './subject/content.vue';
export default defineComponent({
  name: 'Subject',
  setup() {
    return {};
  },
  components: {
    SubjectContent,
  },
});
</script>
