<template>
  <div :style="{ minHeight: height + 'px' }">
    <div class="ellipsisBox" :style="{ height: state.txtHeight }">
      <div ref="ellipsisBox" class="line-2">
        <p style="height: 38px; line-height: 19px">{{ content }}</p>
        <!--        <a @click="closeBtnClick" v-if="CloseBtnShow">点击隐藏</a>-->
      </div>
      <!--      <span @click="openBtnClick" v-if="openBtnShow" class="more">-->
      <!--        …-->
      <!--        <a>更多> </a>-->
      <!--      </span>-->
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted, ref, reactive } from 'vue';
export default defineComponent({
  props: {
    title: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    height: {
      type: Number,
      // default: 66,
      default: 37.76,
    },
  },
  setup(props) {
    const ellipsisBox = ref();
    const state = reactive({
      txtHeight: 'auto',
    });
    const openBtnShow = ref(false);
    const CloseBtnShow = ref(false);
    onMounted(() => {
      if (ellipsisBox.value.clientHeight > props.height) {
        state.txtHeight = props.height + 'px';
        openBtnShow.value = true;
      }
    });
    // 省略事件
    const openBtnClick = () => {
      state.txtHeight = 'auto';
      openBtnShow.value = false;
      CloseBtnShow.value = true;
    };
    const closeBtnClick = () => {
      state.txtHeight = props.height + 'px';
      openBtnShow.value = true;
      CloseBtnShow.value = false;
    };
    return {
      ellipsisBox,
      state,
      openBtnShow,
      CloseBtnShow,
      openBtnClick,
      closeBtnClick,
    };
  },
  components: {},
});
</script>
<style lang="less" scoped>
.ellipsisBox {
  position: relative;
  padding: 0 20px;
  overflow: hidden;
  font-size: 12px;
  word-break: break-all;
  .more {
    position: absolute;
    right: 20px;
    bottom: 0;
    background-color: #ffffff;
  }
}
</style>
