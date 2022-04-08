<template>
  <div :class="prefixCls">
    <template v-for="item in items" :key="item.key">
      <layout-block
        :theme="item.key"
        :checked="item.key === value"
        :disabled="item.disabled"
        :title="item.title"
        @click="
          () => {
            !item.disabled && handleChange(item.key);
          }
        "
      />
    </template>
  </div>
</template>
<script>
import PropTypes from 'ant-design-vue/es/_util/vue-types';
import { defineComponent } from 'vue';
import { useProProvider } from '../base-layouts/pro-provider';
import LayoutBlock from './layout-block.vue';
export default defineComponent({
  props: {
    value: PropTypes.string,
    list: PropTypes.array,
    i18n: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]).def(false),
  },
  emits: ['change'],

  setup(props, { emit }) {
    const { i18n, getPrefixCls } = useProProvider();
    const prefixCls = getPrefixCls('setting-drawer-block-checbox');
    const locale = props.i18n || i18n;
    console.log('propslist', props.list);
    const items = props.list || [
      {
        key: 'side',
        title: locale('app.setting.layout.side'),
      },
      {
        key: 'top',
        title: locale('app.setting.layout.top'),
      },
      {
        key: 'mix',
        title: locale('app.setting.layout.mix'),
      },
      {
        key: 'left',
        title: locale('app.setting.layout.leftmenu'),
      },
    ];

    const handleChange = key => {
      emit('change', key);
    };

    return {
      items,
      prefixCls,
      handleChange,
    };
  },

  components: {
    LayoutBlock,
  },
});
</script>
