<template>
  <div>
    <a-modal
      :visible="visibleTeacher"
      centered
      :closable="false"
      :bodyStyle="{ padding: 0 }"
      :destroyOnClose="false"
      @cancel="visibleTeacher = !visibleTeacher"
      @ok="changeTeacherId"
    >
      <a-card
        :bordered="false"
        @tabChange="key => onTabChange(key)"
        :active-tab-key="state.tabkey"
        :tab-list="[
          {
            key: '教师',
            tab: '教师',
          },
          {
            key: '院外教师',
            tab: '院外教师',
          },
        ]"
      >
        <div v-if="state.tabkey === '院外教师'">
          <a-select
            v-model:value="state.teacherName"
            show-search
            placeholder="请填写院外教师姓名"
            style="width: 100%"
            :options="state.ExternalFaculties"
            @change="handleChange"
          ></a-select>
        </div>
        <div v-if="state.tabkey === '教师'">
          <a-input-search
            v-model:value="searchValue"
            style="margin-bottom: 8px"
            placeholder="请选择教师"
          />
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
      </a-card>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, watch, inject } from 'vue';
import { Subjects, ExternalFaculties } from '@/api/services';
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
  name: 'TeacherTree',
  setup(props, { emit }) {
    const visibleTeacher = ref(inject('visibleTeacher'));

    const state = reactive({
      selectedKeys: [],
      tabkey: '教师',
      ExternalFaculties: [], // 院外教师列表
      teacherName: '', // 院外教师姓名
    });
    const teacherChangeTree = ref(inject('teacherChangeTree'));
    watch(
      () => state.selectedKeys,
      () => {
        // teacherChangeTree.value = state.selectedKeys;

        let data_ = {};
        gData.value.forEach(item => {
          if (item.key === state.selectedKeys[0]) {
            data_ = item;
          }
        });
        teacherChangeTree.value = [data_];
      },
    );
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
    const changeTeacherId = () => {
      if (state.teacherName) {
        emit('ok', [{ title: state.teacherName, key: '' }]);
      } else {
        emit('ok', teacherChangeTree.value);
      }
      visibleTeacher.value = false;
    };
    // 获取院外教师列表
    const getExternalFaculties = () => {
      state.ExternalFaculties = [];
      ExternalFaculties()
        .then(res => {
          if (res.code === 200) {
            if (res.data.length > 0) {
              res.data.forEach(item => {
                state.ExternalFaculties.push({
                  label: item,
                  value: item,
                });
              });
            }
          }
        })
        .catch(err => {
          console.error(err);
        });
    };
    const onTabChange = value => {
      // console.log(value, type);
      state.teacherName = undefined;
      state.tabkey = value;
      if (value === '院外教师') {
        getExternalFaculties();
      }
    };

    return {
      onTabChange,
      changeTeacherId,
      state,
      expandedKeys,
      searchValue,
      autoExpandParent,
      gData,
      onExpand,
      visibleTeacher,
    };
  },
});
</script>

<style scoped></style>
