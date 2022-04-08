import { KeepAlive, cloneVNode, reactive, createVNode, toRaw, defineComponent, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { flattenChildren } from '@/utils/vnode-util';

const getName = comp => {
  return comp.displayName || comp.name;
};

let g = 1;

const guid = () => {
  return ++g;
}; // 定义保留的多标签状态

const state = reactive({
  cacheList: [],
  caches: new Map(),
  current: '',
  exclude: [],
  include: [],
  add: item => {
    if (!state.cacheList.find(c => c.path === item.path)) {
      state.cacheList.push(item);
    }
  },
});

const hasCache = path => {
  return state.cacheList.find(item => item.path === path);
}; // 创建消费端

export const MultiTabStoreProducer = defineComponent({
  name: 'MultiTabStoreProducer',

  setup(_props, { slots = {} }) {
    const route = useRoute();
    watch(
      () => route.path,
      () => {
        state.current = route.path;
      },
      {
        immediate: true,
      },
    );
    return () => {
      const component = flattenChildren((slots.default && slots.default()) || [])[0];

      if (!component) {
        return null;
      }

      const comp = component.type;
      let name = getName(comp);
      const newVNode = component;

      if (name === undefined && newVNode) {
        // 没有设置组件名字
        name = route.name;
      } // 是否存在 cache

      let cacheItem = hasCache(route.path);

      if (!cacheItem) {
        cacheItem = {
          path: route.path,
          route: { ...route },
          name,
          key: guid(),
        };
        console.log(cacheItem);
        state.cacheList.push(cacheItem);
      }

      newVNode.type.displayName = name;
      const key = `${name}-${cacheItem.key}`;
      return createVNode(
        KeepAlive,
        {
          exclude: state.exclude,
        },
        {
          default: () =>
            cloneVNode(newVNode, {
              key,
            }),
        },
      );
    };
  },
});
let initStore = false;
export const createMultiTabStoreProducer = (initCacheList = []) => {
  if (initStore) {
    return state;
  }

  state.cacheList.push(...initCacheList.map(item => ({ ...item, key: guid() })));
  initStore = true;
  return state;
};
export const useMultiTab = () => {
  const router = useRouter();
  const route = useRoute();

  const clearCache = path => {
    const cacheItem = state.cacheList.find(item => item.path === path) || {
      name: '',
    };
    state.exclude = [cacheItem?.name];
    setTimeout(() => {
      state.exclude = [];
    });
  };

  const close = path => {
    if (!path) {
      path = state.current;
    }

    const currentPageIndex = state.cacheList.findIndex(item => item.path === path);

    if (state.cacheList.length === 1) {
      message.info('这是最后一个标签了, 无法被关闭');
      return;
    }

    clearCache(path);

    if (path !== state.current) {
      state.cacheList.splice(currentPageIndex, 1);
      return;
    }

    const targetIndex = currentPageIndex === 0 ? currentPageIndex + 1 : currentPageIndex - 1;
    router
      .replace({
        path: state.cacheList[targetIndex].route.path,
      })
      .then(() => {
        state.cacheList.splice(currentPageIndex, 1);
      })
      .catch();
  };

  const open = path => {
    router
      .push({
        path: path,
      })
      .catch();
  };

  const getCaches = () => {
    return state.caches;
  }; // alias

  const refresh = async path => {
    if (!path) {
      path = state.current;
    }

    clearCache(path);
    const cacheItemIndex = state.cacheList.findIndex(item => item.path === path);
    const cacheItem = state.cacheList[cacheItemIndex];
    state.cacheList[cacheItemIndex] = { ...toRaw(cacheItem), key: guid() };
    return new Promise(resolve => {
      router
        .replace({
          path: cacheItem?.route.path || path,
        })
        .finally(() => {
          // 模拟loading效果，加载太快，loading 不明显，主动加个延时 ，如不需要可删除延迟
          setTimeout(() => {
            resolve();
          }, 900);
        });
    });
  };

  const closeAll = () => {
    state.cacheList = [];
    state.caches = new Map(); // if (options?.defaultHomePage) {
    //   open(options.defaultHomePage);
    // }
  };

  const deleteCaches = (start, index) => {
    const closed = state.cacheList.splice(start, index);
    closed.forEach(item => {
      state.caches.delete(item.path);
    });
  };

  const closeLeft = selectedPath => {
    const index = state.cacheList.findIndex(item => item.path === selectedPath);
    const currentIndex = state.cacheList.findIndex(item => item.path === route.path);

    if (currentIndex < index) {
      router
        .replace({
          path: selectedPath,
        })
        .then(() => {
          deleteCaches(0, index);
        })
        .catch();
    } else {
      deleteCaches(0, index);
    }
  };

  const closeRight = selectedPath => {
    const index = state.cacheList.findIndex(item => item.path === selectedPath);
    const currentIndex = state.cacheList.findIndex(item => item.path === route.path);

    if (currentIndex > index) {
      router
        .replace({
          path: selectedPath,
        })
        .then(() => {
          deleteCaches(index + 1, state.cacheList.length - index - 1);
        })
        .catch();
    } else {
      deleteCaches(index + 1, state.cacheList.length - index - 1);
    }
  };

  const closeOther = selectedPath => {
    const index = state.cacheList.findIndex(cached => cached.path === selectedPath);
    router
      .replace({
        path: selectedPath,
      })
      .then(() => {
        deleteCaches(index + 1, state.cacheList.length - index - 1);
        deleteCaches(0, index);
      })
      .catch();
  };

  return [
    {
      open,
      close,
      getCaches,
      clearCache,
      closeAll,
      closeLeft,
      closeRight,
      closeOther,
      refresh,
    },
  ];
};
export default useMultiTab;
