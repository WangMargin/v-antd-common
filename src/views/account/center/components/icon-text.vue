<template>
  <span>
    <star-two-tone v-if="type === 'star'" />
    <like-outlined v-else-if="type === 'like'" />
    <message-filled v-else />
    {{ text }}
  </span>
</template>
<script>
import { defineComponent } from 'vue';
import { StarTwoTone, LikeOutlined, MessageFilled } from '@ant-design/icons-vue';
export default defineComponent({
  name: 'IconText',
  props: {
    type: {
      type: String,
      required: true,
    },
    text: {
      type: [String, Number],
      required: true,
    },
  },
  components: {
    StarTwoTone,
    LikeOutlined,
    MessageFilled,
  },
});
</script>
