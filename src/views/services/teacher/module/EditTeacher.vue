<template>
  <a-modal
    :visible="editVisible"
    :closable="false"
    :keyboard="false"
    :maskClosable="false"
    :footer="null"
    centered
    @cancel="editVisible = !editVisible"
  >
    <a-divider>教师</a-divider>
    <a-form
      ref="formRef"
      layout="vertical"
      name="custom-validation"
      :model="formState"
      :rules="rules"
      @finish="handleFinish"
      @finishFailed="handleFinishFailed"
    >
      <a-row :gutter="[10, 10]">
        <a-col :sm="24" :xs="24" :md="12">
          <a-form-item label="教师姓名" name="name">
            <a-input v-model:value="formState.name" />
          </a-form-item>
        </a-col>
        <a-col :sm="24" :xs="24" :md="12">
          <a-form-item label="教师职称" name="title">
            <a-radio-group v-model:value="formState.title">
              <a-radio value="无">无</a-radio>
              <a-radio value="副高">副高</a-radio>
              <a-radio value="正高">正高</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :sm="24" :xs="24" :md="24">
          <a-form-item label="教师职务" name="position">
            <a-checkbox-group v-model:value="formState.position">
              <a-row :gutter="[10, 10]">
                <a-col v-for="item in state.positionList" :key="item">
                  <a-checkbox :value="item">{{ item }}</a-checkbox>
                </a-col>
              </a-row>
            </a-checkbox-group>
          </a-form-item>
        </a-col>
        <a-col :sm="24" :xs="24" :md="12">
          <a-form-item label="是否部门主任" name="leaders">
            <a-radio-group v-model:value="formState.leaders">
              <a-radio :value="true">是</a-radio>
              <a-radio :value="false">否</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :sm="24" :xs="24" :md="12" v-if="formState.leaders">
          <a-form-item label="部门名称" name="departmentName">
            <a-select
              v-model:value="formState.departmentName"
              show-search
              placeholder="Select a person"
              style="width: 100%"
              :options="state.subject_team_list"
            ></a-select>
          </a-form-item>
        </a-col>
        <a-col :sm="24" :xs="24" :md="12">
          <a-form-item label="是否博导" name="doctor">
            <a-radio-group v-model:value="formState.doctor">
              <a-radio :value="true">是</a-radio>
              <a-radio :value="false">否</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :sm="24" :xs="24" :md="12">
          <a-form-item label="是否硕导" name="degreeStatus">
            <a-radio-group v-model:value="formState.degreeStatus">
              <a-radio :value="true">是</a-radio>
              <a-radio :value="false">否</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :sm="24" :xs="24" :md="12">
          <a-form-item label="是否党员" name="partyMember">
            <a-radio-group v-model:value="formState.partyMember">
              <a-radio :value="true">是</a-radio>
              <a-radio :value="false">否</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item>
        <div style="text-align: center; padding: 30px 0">
          <a-button @click="resetForm">取消</a-button>
          <a-button style="margin-left: 30px" type="primary" @click="handleValidate">确定</a-button>
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { watch, defineComponent, reactive, ref, onBeforeMount, inject } from 'vue';
import ls from '@/utils/local-storage.js';
import { STORAGE_RESOURCE } from '@/store/mutation-type.js';
export default defineComponent({
  setup(props, { emit }) {
    const formRef = ref();
    const formState = reactive({
      name: '',
      title: '',
      position: undefined,
      leaders: false,
      departmentName: '',
      partyMember: false,
      doctor: false,
      degreeStatus: false,
    });
    const editVisible = ref(inject('editVisible'));
    const editTeacher = ref(inject('editTeacherData'));
    watch(editTeacher, () => {
      console.log(editTeacher.value);
      formState.name = editTeacher.value.name;
      // formState.title = editTeacher.value.info.title;
      // formState.position = editTeacher.value.info.position.split(',');
      // formState.leaders = editTeacher.value.leaders || false;
      // formState.departmentName = editTeacher.value.info.department.value;
      // formState.partyMember = editTeacher.value.partyMember || false;
      // formState.doctor = editTeacher.value.doctor || false;
      // formState.degreeStatus = editTeacher.value.degreeStatus || false;
    });
    const state = reactive({
      positionList: undefined,
      subject_team_list: [],
    });
    const validatePosition = async (rule, value) => {
      if (!value) {
        return Promise.reject('请选择教师职务');
      } else if (value.length < 1) {
        return Promise.reject('请选择教师职务');
      } else {
        return Promise.resolve();
      }
    };

    const rules = {
      partyMember: [
        {
          required: true,
          message: '是否党员',
          type: 'boolean',
          trigger: 'change',
        },
      ],
      doctor: [
        {
          required: true,
          message: '是否博导',
          type: 'boolean',
          trigger: 'change',
        },
      ],
      degreeStatus: [
        {
          required: true,
          message: '是否硕导',
          type: 'boolean',
          trigger: 'change',
        },
      ],
      departmentName: [
        {
          required: true,
          message: '部门名称',
          trigger: 'blur',
        },
      ],
      leaders: [
        {
          required: true,
          message: '是否部门主任',
          type: 'boolean',
          trigger: 'change',
        },
      ],
      name: [
        {
          required: true,
          message: '请选择教师姓名',
          trigger: 'blur',
        },
      ],
      title: [
        {
          required: true,
          message: '请选择教师职称',
          trigger: 'change',
        },
      ],
      position: [
        {
          required: true,
          validator: validatePosition,
          message: '请选择教师职务',
          type: 'array',
          trigger: 'change',
        },
      ],
    };

    const handleFinish = values => {
      console.log(values, formState);
    };

    const handleFinishFailed = errors => {
      console.log(errors);
    };

    const resetForm = () => {
      formRef.value.resetFields();
      editVisible.value = false;
    };

    const handleValidate = () => {
      formRef.value.validate().then(res => {
        console.log(res);
        editTeacher.value = formState;
        emit('ok', formState);
      });
    };

    onBeforeMount(() => {
      const data = ls.get(STORAGE_RESOURCE);
      state.positionList = data.position_choices;
      state.subject_team_list = data.subject_team_list.map(item => {
        return { label: item.name, value: item.id };
      });
    });
    return {
      editVisible,
      state,
      formState,
      formRef,
      rules,
      handleFinishFailed,
      handleFinish,
      resetForm,
      handleValidate,
    };
  },
});
</script>
