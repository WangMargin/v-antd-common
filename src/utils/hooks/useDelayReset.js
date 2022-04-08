import { onMounted, ref } from 'vue';
/**
 * Similar with `useLock`, but this hook will always execute last value.
 * When set to `true`, it will keep `true` for a short time even if `false` is set.
 */

export default function useDelayReset(timeout = 10) {
  const bool = ref(false);
  let delay;

  const cancelLatest = () => {
    window.clearTimeout(delay);
  };

  onMounted(() => {
    cancelLatest();
  });

  const delaySetBool = (value, callback) => {
    cancelLatest();
    delay = window.setTimeout(() => {
      bool.value = value;

      if (callback) {
        callback();
      }
    }, timeout);
  };

  return [bool, delaySetBool, cancelLatest];
}
