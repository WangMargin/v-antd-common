<template>
  <div>
    <a-input-search v-model:value="searchValue" style="margin-bottom: 8px" placeholder="Search" />
    <a-directory-tree
      multiple
      blockNode
      :showIcon="false"
      :checkStrictly="false"
      :expandedKeys="expandedKeys"
      :auto-expand-parent="autoExpandParent"
      :tree-data="gData"
      v-model:selectedKeys="state.selectedKeys"
      @expand="onExpand"
    >
      <template #title="{ title }">
        <span v-if="title.indexOf(searchValue) > -1">
          {{ title.substr(0, title.indexOf(searchValue)) }}
          <span style="color: #f50">{{ searchValue }}</span>
          {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
        </span>
        <span v-else>{{ title }}</span>
      </template>
    </a-directory-tree>
  </div>
</template>
<script>
import { Subjects } from '@/api/services';
import { defineComponent, ref, watch, onMounted, reactive } from 'vue';
const dataList = [];

const getParentKey = (key, tree) => {
  let parentKey;

  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];

    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }

  return parentKey;
};

export default defineComponent({
  setup() {
    const state = reactive({
      selectedKeys: [],
    });

    const expandedKeys = ref([]);
    const searchValue = ref('');
    const autoExpandParent = ref(true);
    const gData = ref();

    const onExpand = keys => {
      expandedKeys.value = keys;
      autoExpandParent.value = false;
    };

    watch(searchValue, value => {
      const expanded = dataList
        .map(item => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, gData.value);
          }

          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      expandedKeys.value = expanded;
      searchValue.value = value;
      autoExpandParent.value = true;
    });
    const installSubjectList = () => {
      Subjects({
        subject_type: 'Faculty',
      })
        .then(res => {
          gData.value = [];
          res.data.data.forEach(item => {
            gData.value.push({
              key: item.id,
              title: item.name,
            });
          });
          // if (res.code === 200) {
          //   installTreeDataFn(res.data.data);
          // }
        })
        .catch(err => {
          console.error(err);
        });
    };
    onMounted(() => {
      installSubjectList();
    });
    return {
      state,
      expandedKeys,
      searchValue,
      autoExpandParent,
      gData,
      onExpand,
    };
  },
});
</script>
