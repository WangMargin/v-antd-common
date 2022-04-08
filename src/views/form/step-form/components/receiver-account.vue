<template>
  <a-input-group compact>
    <a-select v-model:value="value.type" :style="selectStyle">
      <a-select-option value="alipay">支付宝</a-select-option>
      <a-select-option value="bank">银行账户</a-select-option>
    </a-select>
    <a-input v-model:value="value.number" :style="inputStyle" />
  </a-input-group>
</template>
<script>
import { defineComponent, computed } from 'vue';
export default defineComponent({
  props: {
    // define `modelValue` use `v-model` no arguments
    // if you use `v-model:value` please change `modelValue` to `value`
    modelValue: {
      type: Object,
      default: () => {
        return {
          type: 'alipay',
          number: undefined,
        };
      },
    },
    selectStyle: {
      type: Object,
      default: () => {
        return {
          width: '130px',
        };
      },
    },
    inputStyle: {
      type: Object,
      default: () => {
        return {
          width: 'calc(100% - 130px)',
        };
      },
    },
  },
  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const value = computed({
      get() {
        return props.modelValue;
      },

      set(value) {
        emit('update:modelValue', value);
      },
    });
    return {
      value,
    };
  },
});
</script>
