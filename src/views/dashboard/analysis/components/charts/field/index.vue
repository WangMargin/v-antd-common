<template>
  <div class="field">
    <span v-if="label" class="label">
      {{ label }}
    </span>
    <span v-else>
      <slot name="label" />
    </span>
    <span v-if="value" class="number">
      {{ value }}
    </span>
    <span v-else>
      <slot name="value" />
    </span>
  </div>
</template>
<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Field',
  props: {
    label: {
      type: String,
      default: () => undefined,
    },
    value: {
      type: [Number, String],
      default: () => undefined,
    },
  },
});
</script>

<style scoped lang="less" src="./index.less"></style>
