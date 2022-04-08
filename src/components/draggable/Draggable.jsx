import { constants } from 'smooth-dnd';

const Draggable = (props, { slots }) => {
  const Tag = props.tag || 'div';
  return <Tag class={constants.wrapperClass}>{slots.default?.()}</Tag>;
};

Draggable.displayName = 'Draggable';
export default Draggable;
