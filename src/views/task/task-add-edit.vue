<template>
  <page-container :show-breadcrumb="false">
    <a-form layout="vertical" ref="formRef" :model="formData" :rules="rules">
      <a-card :bordered="false" title="填写基础信息" :body-style="{ padding: '20px 20px 0 20px' }">
        <a-row :gutter="20">
          <a-col :span="12">
            <a-form-item ref="name" label="任务名称" required name="name">
              <a-input placeholder="请填写任务名称" v-model:value="formData.name" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="所属年份" required name="year">
              <a-date-picker
                v-model:value="formData.year"
                mode="year"
                format="YYYY"
                :open="state.open"
                style="width: 100%"
                @openChange="openChange"
                @panelChange="panelChange"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="20">
          <a-col :span="12">
            <a-form-item label="统计开始时间和结束时间" required name="time">
              <a-range-picker style="width: 100%" v-model:value="formData.time" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card :bordered="false" title="选择科研主体" style="margin-top: 14px">
        <a-form-item name="subjects">
          <a-tree-select
            show-search
            style="width: 100%"
            :dropdown-style="{ maxHeight: '240px', overflow: 'auto' }"
            placeholder="选择科研主体"
            allow-clear
            multiple
            tree-checkable
            v-model:value="formData.subjects"
            :tree-data="state.subjects"
            :replace-fields="{ children: 'children', title: 'name', key: 'key', value: 'key' }"
          ></a-tree-select>
        </a-form-item>
      </a-card>
      <a-card
        :bordered="false"
        style="margin-top: 14px"
        :body-style="{ padding: '4px 20px 60px 20px' }"
      >
        <template #title>
          选择科研项目
          <em v-if="formData.error" style="font-style: normal; font-size: 14px; color: #ff4d4f">
            请选择科研项目
          </em>
        </template>
        <a-row :gutter="30">
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
            <a-card
              :bordered="false"
              title="学院科研项目"
              :body-style="{ padding: 0 }"
              :head-style="{ padding: 0 }"
            >
              <a-form-item name="school">
                <a-tree-select
                  show-search
                  style="width: 100%"
                  :dropdown-style="{ maxHeight: '240px', overflow: 'auto' }"
                  placeholder="选择学院科研项目"
                  allow-clear
                  multiple
                  tree-checkable
                  v-model:value="formData.school"
                  tree-default-expand-all
                  :tree-data="state.school"
                  :replace-fields="{
                    children: 'children',
                    title: 'name',
                    key: 'key',
                    value: 'key',
                  }"
                ></a-tree-select>
              </a-form-item>
            </a-card>
          </a-col>
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
            <a-card
              :bordered="false"
              title="中心科研项目"
              :body-style="{ padding: 0 }"
              :head-style="{ padding: 0 }"
            >
              <a-form-item name="team">
                <a-tree-select
                  show-search
                  style="width: 100%"
                  :dropdown-style="{ maxHeight: '240px', overflow: 'auto' }"
                  placeholder="选择中心科研项目"
                  allow-clear
                  multiple
                  tree-checkable
                  v-model:value="formData.team"
                  tree-default-expand-all
                  :tree-data="state.team"
                  :replace-fields="{
                    children: 'children',
                    title: 'name',
                    key: 'key',
                    value: 'key',
                  }"
                ></a-tree-select>
              </a-form-item>
            </a-card>
          </a-col>
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
            <a-card
              :bordered="false"
              title="个人科研项目"
              :body-style="{ padding: 0 }"
              :head-style="{ padding: 0 }"
            >
              <a-form-item name="faculty">
                <a-tree-select
                  show-search
                  style="width: 100%"
                  :dropdown-style="{ maxHeight: '240px', overflow: 'auto' }"
                  placeholder="选择个人科研项目"
                  allow-clear
                  multiple
                  tree-checkable
                  v-model:value="formData.faculty"
                  tree-default-expand-all
                  :tree-data="state.faculty"
                  :replace-fields="{
                    children: 'children',
                    title: 'name',
                    key: 'key',
                    value: 'key',
                  }"
                ></a-tree-select>
              </a-form-item>
            </a-card>
          </a-col>
        </a-row>
      </a-card>
      <a-row :gutter="20" type="flex" justify="center" style="margin-top: 60px">
        <a-col>
          <a-button style="margin-right: 30px" @click="cancleClick">取消</a-button>
          <a-button type="primary" :loading="submitLoading" @click="onSubmit">保存</a-button>
        </a-col>
      </a-row>
    </a-form>
  </page-container>
</template>
<script>
import moment from 'moment';
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { getSubjectsCategoriesList, addTask, getTaskDetail, editTask } from '@/api/task/task.js';
import { useRouter, useRoute } from 'vue-router';
import { useMultiTab } from '@/components/multi-tab/multi-tab-store.js';
import localStorage from '@/utils/local-storage';
export default defineComponent({
  name: 'TaskAddEdit',
  setup() {
    const submitLoading = ref(false);
    const [{ close }] = useMultiTab();
    const router = useRouter();
    const route = useRoute();
    const formRef = ref();
    const state = reactive({
      loading: true,
      open: false,
      id: route.params.id,
    });
    const formData = reactive({
      name: '',
      year: null,
      time: [],
      subjects: [],
      faculty: [],
      team: [],
      school: [],
      error: false,
    });
    const validateCategories = async (rule, value) => {
      if (value) {
        formData.error = false;
      }
      return Promise.resolve();
    };
    const rules = {
      name: [
        {
          required: true,
          message: '请填写任务名称',
          trigger: 'change',
        },
      ],
      year: [
        {
          type: 'object',
          required: true,
          message: '请选择所属年份',
          trigger: 'change',
        },
      ],
      time: [
        {
          type: 'array',
          required: true,
          message: '请选择起始结束时间',
          trigger: 'change',
        },
      ],
      subjects: [
        {
          type: 'array',
          required: true,
          message: '请选择主体',
          trigger: 'change',
        },
      ],
      faculty: [
        {
          validator: validateCategories,
          trigger: 'change',
        },
      ],
      team: [
        {
          validator: validateCategories,
          trigger: 'change',
        },
      ],
      school: [
        {
          validator: validateCategories,
          trigger: 'change',
        },
      ],
    };
    // form选择科研项目重组为接口数据
    const stringToObject = (data, type) => {
      const newData = [];
      if (data.length > 0) {
        data.map(k => {
          newData.push({ type: type, id: k });
        });
      }
      return newData;
    };
    // 接口数据重组为form数据
    const objectToString = (data, type) => {
      const newData = [];
      data.map(k => {
        if (k.type.key === type) newData.push(k.id);
      });
      return newData;
    };
    // form数据转为提交接口数据
    const formDataToInterfaceData = data => {
      const params = {
        name: data.name,
        year: moment(data.year).format('YYYY'),
        begin_date: moment(data.time[0]).format('YYYY-MM-DD'),
        end_date: moment(data.time[1]).format('YYYY-MM-DD'),
        subjects: data.subjects,
      };
      params.categories = stringToObject(data.faculty, 'Faculty')
        .concat(stringToObject(data.team, 'Team'))
        .concat(stringToObject(data.school, 'School'));
      return params;
    };
    // 接口数据转为form数据
    const interfaceDataToFormData = data => {
      formData.name = data.name;
      formData.year = moment(data.year, 'YYYY');
      formData.time.push(moment(data.begin_date, 'YYYY-MM-DD'));
      formData.time.push(moment(data.end_date, 'YYYY-MM-DD'));
      formData.subjects = data.subjects.map(k => k.id);
      formData.school = objectToString(data.categories, 'School');
      formData.team = objectToString(data.categories, 'Team');
      formData.faculty = objectToString(data.categories, 'Faculty');
    };
    onMounted(() => {
      getSubjectsCategoriesList()
        .then(res => {
          state.subjects = res.data.subjects;
          state.faculty = res.data.categories.Faculty.children;
          state.team = res.data.categories.Team.children;
          state.school = res.data.categories.School.children;
        })
        .catch(() => {});
      // 获取任务信息
      if (state.id) {
        getTaskDetail(state.id)
          .then(res => {
            state.loading = false;
            interfaceDataToFormData(res.data.info);
          })
          .catch(() => {
            state.loading = false;
          });
      }
    });
    const openChange = status => {
      if (status) state.open = true;
      else state.open = false;
    };
    const panelChange = value => {
      formData.year = value;
      state.open = false;
    };
    // 提交数据后回调
    const submitCallBack = () => {
      localStorage.set('taskReload', 'reload');
      const closePath = route.path;
      if (state.id) {
        router.push({ path: `/data/task/${state.id}` }).then(() => {
          close(closePath);
        });
      } else {
        router.push({ path: `/data/task` }).then(() => {
          close(closePath);
        });
      }
    };
    const onSubmit = () => {
      formRef.value
        .validate()
        .then(() => {
          const params = formDataToInterfaceData(formData);
          if (params.categories.length === 0) {
            formData.error = true;
            return false;
          }
          submitLoading.value = true;
          if (state.id) {
            editTask(state.id, params)
              .then(res => {
                if (res.code === 200) submitCallBack();
              })
              .finally(() => {
                submitLoading.value = false;
              });
          } else {
            addTask(params)
              .then(res => {
                if (res.code === 200) submitCallBack();
              })
              .finally(() => {
                submitLoading.value = false;
              });
          }
        })
        .catch(error => {
          const params = formDataToInterfaceData(error.values);
          if (params.categories.length === 0) formData.error = true;
        });
    };
    const cancleClick = () => {
      close(route.path);
    };
    return {
      formRef,
      rules,
      state,
      formData,
      onSubmit,
      openChange,
      panelChange,
      cancleClick,
      submitLoading,
    };
  },
  components: {},
});
</script>
