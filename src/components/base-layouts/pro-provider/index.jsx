import { reactive, readonly, provide, inject, toRefs } from 'vue';
const defaultPrefixCls = 'ant-pro';
export const defaultProProviderProps = {
  getPrefixCls: (suffixCls, customizePrefixCls) => {
    if (customizePrefixCls) return customizePrefixCls;
    return `${defaultPrefixCls}-${suffixCls}`;
  },
  i18n: t => t,
  contentWidth: 'Fluid',
};
export const injectProConfigKey = Symbol();
const ProProvider = {
  name: 'ProProvider',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro',
    },
    contentWidth: {
      type: String,
      default: 'Fluid',
    },
    i18n: {
      type: Function,
      default: t => t,
    },
  },

  setup(props, { slots }) {
    const { prefixCls, i18n, contentWidth } = toRefs(props);

    const getPrefixCls = (suffixCls, customizePrefixCls) => {
      if (customizePrefixCls) return customizePrefixCls;
      return suffixCls ? `${prefixCls.value}-${suffixCls}` : prefixCls.value;
    };

    const proConfigProvider = reactive({
      i18n,
      contentWidth,
      getPrefixCls,
    });
    provide(injectProConfigKey, readonly(proConfigProvider));
    return () => slots.default?.();
  },

  install(app) {
    app.component(ProProvider.name, ProProvider);
  },
};
export const useProProvider = () => {
  return inject(injectProConfigKey, defaultProProviderProps);
};
export default ProProvider;
