<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
import { reactive } from 'vue';

export default {
  setup() {
    const state = reactive({});
    return { state };
  },
};
</script>

<style></style>
