<template>
  <li :class="['avatar-item', `avatar-item-${parentProps.size}`]">
    <a-tooltip :title="tips">
      <a-avatar
        :class="`avatar-list-item-${parentProps.size}`"
        :size="parentProps.size"
        :src="src"
        :style="!src && parentProps.excessItemsStyle"
      >
        <slot />
      </a-avatar>
    </a-tooltip>
  </li>
</template>
<script>
import { defineComponent, inject } from 'vue';
import { Tooltip, Avatar } from 'ant-design-vue';
import { avatarListKey } from './list.vue';
export default defineComponent({
  name: 'AvatarListItem',
  props: {
    tips: {
      type: String,
      default: () => undefined,
    },
    src: {
      type: String,
      default: '',
    },
  },

  setup() {
    const parentProps = inject(avatarListKey, {
      size: 'default',
      excessItemsStyle: {},
    });
    return {
      parentProps,
    };
  },

  components: {
    [Tooltip.name]: Tooltip,
    [Avatar.name]: Avatar,
  },
});
</script>

<style lang="less" scoped>
.avatar-item {
  display: inline-block;
  width: @avatar-size-base;
  height: @avatar-size-base;
  margin-left: -8px;
  font-size: @font-size-base;

  ::v-deep(.ant-avatar) {
    border: 1px solid @border-color-base;
  }
}

.avatar-item-large {
  width: @avatar-size-lg;
  height: @avatar-size-lg;
}

.avatar-item-small {
  width: @avatar-size-sm;
  height: @avatar-size-sm;
}

.avatar-item-mini {
  width: 20px;
  height: 20px;

  ::v-deep(.ant-avatar) {
    width: 20px;
    height: 20px;
    line-height: 20px;

    .ant-avatar-string {
      font-size: 12px;
      line-height: 18px;
    }
  }
}
</style>
