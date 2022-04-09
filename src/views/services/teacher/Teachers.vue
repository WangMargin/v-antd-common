<template>
  <page-container :show-breadcrumb="true">
    <div>
      <a-card>
        <div style="text-align: center">
          <a-space align="center">
            <a-input placeholder="搜索姓名" v-model:value="state.searchValue"></a-input>
            <a-button type="primary" @click="searchBtn">搜索</a-button>
          </a-space>
        </div>
      </a-card>
      <a-card style="margin-top: 15px">
        <a-button block style="margin-bottom: 15px; width: 100%">新增教师</a-button>
        <!--        教师列表-->
        <div>
          <a-list
            class="demo-loadmore-list"
            :loading="initLoading"
            item-layout="horizontal"
            :data-source="list"
          >
            <template #loadMore>
              <div
                v-if="!initLoading && !loading"
                :style="{
                  textAlign: 'center',
                  marginTop: '12px',
                  height: '32px',
                  lineHeight: '32px',
                }"
              ></div>
            </template>
            <template #renderItem="{ item, index }">
              <a-list-item>
                <template #actions>
                  <a-button type="link" @click="editTeacher(item, index)">
                    编辑
                    <edit-outlined />
                  </a-button>
                  <!--                  <a key="list-loadmore-more">more</a>-->
                </template>
                <a-skeleton avatar :title="false" :loading="!!item.loading" active>
                  <a-list-item-meta>
                    <template #description>{{ item.info.position }}</template>
                    <template #title>{{ item.name }}</template>
                    <template #avatar>
                      <a-avatar shape="square" size="large">
                        {{ item.name[0] }}
                      </a-avatar>
                      <!--                      <a-avatar :src="item.picture.large" />-->
                    </template>
                  </a-list-item-meta>
                  <a-row :gutter="[10, 10]">
                    <a-col>
                      <div>教师职称</div>
                      <div style="color: #999999">{{ item.info.title }}</div>
                    </a-col>
                    <a-col>
                      <div>是否党员</div>
                      <div style="color: #999999">-</div>
                    </a-col>
                  </a-row>
                </a-skeleton>
              </a-list-item>
            </template>
          </a-list>
        </div>
      </a-card>
    </div>
     <edit-teacher @ok="editTeacherOk"></edit-teacher>
  </page-container>
</template>

<script>
// import { message } from 'ant-design-vue';
import EditTeacher from './module/EditTeacher';
import { defineComponent, onMounted, reactive, ref, provide } from 'vue';
import { Subjects } from '@/api/services.js';
export default defineComponent({
  name: 'Teachers',
  components: {
    EditTeacher,
  },
  setup() {
    const state = reactive({
      searchValue: '',
    });

    const initLoading = ref(true);
    const loading = ref(false);
    const data = ref([]);
    const list = ref([]);

    // 正在编辑中的 教师信息
    const editTeacherData = ref();
    provide('editTeacherData', editTeacherData);
    const editVisible = ref(false);
    provide('editVisible', editVisible);

    // 获取教师主体列表
    const getSubjects = params => {
      Subjects(params)
        .then(res => {
          if (res.code === 200) {
            list.value = res.data.data;
            data.value = res.data.data;
          }
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => {
          initLoading.value = false;
        });
    };

    // 搜索教师
    const searchBtn = () => {
      let params = {
        subject_type: 'Faculty',
        name: state.searchValue,
      };
      getSubjects(params);
    };

    // 编辑教师
    const editTeacher = (record, index) => {
      console.log(record, index);
      editTeacherData.value = record;
      editVisible.value = true;
    };
    onMounted(() => {
      const params = {
        subject_type: 'Faculty',
      };
      getSubjects(params);
    });
    // 编辑教师职务确定修改
    const editTeacherOk = data => {
      console.log(data, '=====编辑教师数据确定修改 同步至当前数据中');
    };
    return {
      editTeacherOk,
      editTeacher,
      searchBtn,
      loading,
      initLoading,
      data,
      list,
      state,
    };
  },
});
</script>

<style scoped>
.demo-loadmore-list {
  min-height: 350px;
}
</style>
