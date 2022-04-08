<template>
  <a-result v-if="!auth && noMatch" :staus="403" title="403" sub-title="无权限" />
  <slot v-else-if="auth" />
</template>
<script>
import { isArray } from 'lodash-es';
import { computed, ref, defineComponent } from 'vue';
import { useStore } from 'vuex';
export default defineComponent({
  name: 'Authority',
  props: {
    authority: {
      type: [String, Array, Function],
      default: () => true,
    },
    noMatch: {
      type: [String, Boolean, Object],
      default: () => undefined,
    },
  },

  setup(props) {
    const store = useStore();
    const role = computed(() => store.getters['user/role']);
    const auth = ref(false);

    if (role.value.permissions) {
      const permissions = role.value.permissions;
      const isArr = isArray(props.authority);

      if (typeof props.authority === 'string' || isArr) {
        auth.value = permissions.some(value => {
          return isArr ? props.authority.includes(value.name) : props.authority === value.name;
        });
      } else if (typeof props.authority === 'function') {
        auth.value = props.authority(permissions);
      }
    }

    return {
      auth,
    };
  },
});
</script>
