<template>
  <a-modal
    :visible="visible"
    title="修改状态"
    :width="480"
    @ok="handleSubmit"
    @cancel="handleClose"
    :confirm-loading="confirmLoading"
  >
    <a-form layout="vertical" ref="formRef" :model="formData" :rules="rules">
      <a-form-item
        label="是否修改为以下状态"
        required
        name="status"
        style="margin-bottom: 0; padding-bottom: 0"
      >
        <a-radio-group v-model:value="formData.status">
          <a-radio v-for="(s, i) in formData.statusData" :key="i" :value="s.value">
            {{ s.label }}
          </a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { defineComponent, reactive, ref, watchEffect } from 'vue';
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    // 任务id
    id: {
      type: String,
      default: '',
    },
    // 任务状态||任务主体状态
    status: {
      type: String,
      default: '',
    },
    confirmLoading: {
      type: Boolean,
      required: false,
    },
    isAdmin: {
      type: Boolean,
      required: false,
    },
  },
  emits: ['close', 'ok'],
  setup(props, { emit }) {
    const formRef = ref();
    const formData = reactive({
      status: undefined,
      statusData: [],
    });
    const statusData = () => {
      if (props.isAdmin) {
        // 任务状态-管理员
        if (props.status === 'NotStart') {
          formData.statusData = [{ label: '填报中', value: 'Start' }];
        }
        if (props.status === 'Start') {
          formData.statusData = [
            // { label: '未开始', value: 'NotStart' },
            { label: '已完成', value: 'Complete' },
          ];
        }
        if (props.status === 'Complete') {
          formData.statusData = [{ label: '填报中', value: 'Start' }];
        }
      } else {
        // 主体状态-操作员
        if (props.status === 'Start') {
          formData.statusData = [{ label: '已提交', value: 'Audit' }];
        }
        if (props.status === 'Complete' || props.status === 'Audit') {
          formData.statusData = [{ label: '填报中', value: 'Start' }];
        }
        if (props.status === 'NotComplete') {
          formData.statusData = [
            { label: '填报中', value: 'Start' },
            { label: '已提交', value: 'Audit' },
          ];
        }
      }
    };
    const rules = {
      status: [
        {
          required: true,
          message: '请选择要改变的状态',
          trigger: 'change',
        },
      ],
    };
    const handleClose = () => {
      emit('close');
      formRef.value.resetFields();
    };
    // 状态修改
    const handleSubmit = () => {
      formRef.value
        .validate()
        .then(() => {
          emit('ok', {
            id: props.id,
            status: formData.status,
          });
        })
        .catch(() => {});
    };
    watchEffect(() => {
      if (props.visible) {
        statusData();
        formData.status = formData.statusData[0].value;
      }
    });
    return {
      formData,
      rules,
      formRef,
      handleClose,
      handleSubmit,
    };
  },
  components: {},
});
</script>
