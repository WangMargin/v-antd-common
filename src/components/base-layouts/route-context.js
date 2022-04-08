import { defineComponent, provide, inject, readonly } from 'vue';
export const routeContextProps = {
  isMobile: {
    type: Boolean,
    default: false,
  },
  menuData: {
    type: Object,
    default: undefined,
  },
  prefixCls: {
    type: String,
    default: 'ant-pro',
  },
  collapsed: {
    type: Boolean,
  },
  hasSiderMenu: {
    type: Boolean,
  },
  siderWidth: {
    type: Number,
  },
  hasFooterToolbar: {
    type: Boolean,
  },
  hasFooter: {
    type: Boolean,
  },
  setHasFooterToolbar: {
    type: Function,
  },
};
export const defaultRouteContext = {};
export const contextKey = Symbol();
export const useContext = () => {
  return inject(contextKey, defaultRouteContext);
};
export const RouteContextProvider = defineComponent({
  name: 'RouteContextProvider',
  props: {
    value: {
      type: Object,
      required: true,
    },
  },

  setup(props, { slots }) {
    // const routeContext = reactive({
    //   ...toRefs(props.value),
    // });
    provide(contextKey, readonly(props.value));
    return () => slots.default?.();
  },
});
