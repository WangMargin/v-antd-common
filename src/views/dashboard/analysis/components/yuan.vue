<template>
  <span>{{ formatYuan(value) }}</span>
</template>
<script>
import { defineComponent } from 'vue';
import numeral from 'numeral';
export default defineComponent({
  name: 'Yuan',
  props: {
    value: {
      type: [Number, String],
      required: true,
    },
  },

  setup() {
    const formatYuan = val => `¥ ${numeral(val).format('0,0')}`;

    return {
      formatYuan,
    };
  },
});
</script>

<style scoped></style>
