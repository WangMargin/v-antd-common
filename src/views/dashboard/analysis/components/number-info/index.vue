<template>
  <div :class="['numberInfo', { [`numberInfo${theme}`]: theme }]">
    <div v-if="title" class="numberInfoTitle" :title="title">
      {{ title }}
    </div>
    <div v-else-if="$slots.title" class="numberInfoTitle">
      <slot name="title" />
    </div>
    <div v-if="subTitle" class="numberInfoSubTitle" :title="subTitle">
      {{ subTitle }}
    </div>
    <div v-else-if="$slots.subTitle" class="numberInfoSubTitle">
      <slot name="subTitle" />
    </div>
    <div class="numberInfoValue" :style="{ marginTop: gap ? `${gap}px` : 'none' }">
      <span>
        {{ total }}
        <em v-if="suffix" class="suffix">{{ suffix }}</em>
      </span>
      <span v-if="subTotal || status" class="subTotal">
        {{ subTotal }}
        <caret-up-outlined v-if="status === 'up'" />
        <caret-down-outlined v-else />
      </span>
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons-vue';
export default defineComponent({
  props: {
    title: {
      type: String,
      default: () => undefined,
    },
    subTitle: {
      type: String,
      default: () => undefined,
    },
    total: {
      type: [String, Number],
      default: 0,
    },
    status: {
      type: String,
      default: 'up',
      validator: function (value) {
        return ['up', 'down'].indexOf(value) !== -1;
      },
    },
    theme: {
      type: String,
      default: 'light',
    },
    gap: {
      type: Number,
      default: 0,
    },
    subTotal: {
      type: [Number, String],
      default: '',
    },
    suffix: {
      type: String,
      default: '',
    },
  },
  components: {
    CaretDownOutlined,
    CaretUpOutlined,
  },
});
</script>

<style scoped lang="less" src="./index.less"></style>
