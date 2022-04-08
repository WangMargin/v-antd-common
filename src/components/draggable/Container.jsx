/* eslint-disable curly */
import { smoothDnD, dropHandlers } from 'smooth-dnd';
import { defineComponent, onMounted, onUpdated, onUnmounted, ref, reactive } from 'vue';
smoothDnD.dropHandler = dropHandlers.reactDropHandler().handler;
smoothDnD.wrapChild = false;
const Container = defineComponent({
  name: 'Container',
  emits: ['drop', 'dragStart', 'dragEnd', 'dragEnter', 'dragLeave', 'dropReady'],

  setup(props, { slots }) {
    const rootRef = ref();
    const data = reactive({
      container: ref(),
    });
    onMounted(() => {
      data.container = smoothDnD(rootRef.value, props);
    });
    onUpdated(() => {
      data.container.setOptions(props);
    });
    onUnmounted(() => {
      if (data.container) {
        data.container.dispose();
      }
    });
    return () => {
      const Tag = props.tag;
      return <Tag ref={rootRef}>{slots.default?.()}</Tag>;
    };
  },
});
Container.props = {
  behaviour: String,
  groupName: String,
  orientation: String,
  dragHandleSelector: String,
  nonDragAreaSelector: String,
  dragBeginDelay: Number,
  animationDuration: Number,
  autoScrollEnabled: {
    type: Boolean,
    default: true,
  },
  lockAxis: String,
  dragClass: String,
  dropClass: String,
  removeOnDropOut: {
    type: Boolean,
    default: false,
  },
  getChildPayload: Function,
  shouldAnimateDrop: Function,
  shouldAcceptDrop: Function,
  tag: {
    type: String,
    default: 'div',
  },
  getGhostParent: Function,
  dropPlaceholder: [Object, Boolean],
  onDrop: Function,
  onDragStart: Function,
  onDragEnd: Function,
  onDragEnter: Function,
  onDragLeave: Function,
  onDropReady: Function,
};
export default Container;
