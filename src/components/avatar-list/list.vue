<template>
  <div :class="['avatar-list', `avatar-list-${size}`]" v-bind="$attrs">
    <ul>
      <slot />
      <template v-if="totalSize > maxLength">
        <li>
          <avatar-list-item>{{ `+${totalSize - maxLength}` }}</avatar-list-item>
        </li>
      </template>
    </ul>
  </div>
</template>
<script>
import { defineComponent, provide, reactive, ref, readonly } from 'vue';
import { filterEmpty } from '@/utils/vnode-util';
import AvatarListItem from './item.vue';
export const avatarListKey = Symbol();
export default defineComponent({
  name: 'AvatarList',
  props: {
    size: {
      type: String,
      default: 'default',
    },
    maxLength: {
      type: Number,
      default: 5,
    },
    excessItemsStyle: {
      type: Object,
      default: () => undefined,
    },
  },

  setup(props, { slots }) {
    const children = filterEmpty(slots.default?.());
    const totalSize = ref(children.length);
    const injectProps = reactive({
      size: props.size,
      excessItemsStyle: props.excessItemsStyle,
    });
    provide(avatarListKey, readonly(injectProps));
    return {
      totalSize,
    };
  },

  components: {
    AvatarListItem,
  },
});
</script>

<style lang="less" scoped>
.avatar-list {
  display: inline-block;

  ul {
    display: inline-block;
    margin-left: 8px;
    font-size: 0;
  }
}
</style>
