export function getTargetElement(target, defaultElement) {
  if (!target) {
    return defaultElement;
  }

  let targetElement;

  if (typeof target === 'function') {
    targetElement = target();
  } else if ('value' in target) {
    targetElement = target.value?.$el;
  } else {
    targetElement = target;
  }

  return targetElement;
}
