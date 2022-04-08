<template>
  <a-modal
    :visible="visible"
    :title="state.title"
    :width="600"
    :zIndex="zIndex"
    @ok="handleSubmit"
    @cancel="handleClose"
    :confirm-loading="confirmLoading"
  >
    <a-form layout="vertical" ref="formRef" :model="formData" :rules="rules">
      <a-form-item name="reason">
        <a-textarea v-model:value="formData.reason" :placeholder="state.placeholder"></a-textarea>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { defineComponent, watchEffect, reactive, ref } from 'vue';
import { examineSycamore } from '@/api/subjects/statistics.js';
import { deleteSycamoreItem } from '@/api/dynamic/dynamic.js';

const texts = {
  Archived: {
    title: '审核意见（通过）',
    placeholder: '请填写审核意见',
  },
  Failed: {
    title: '审核意见（驳回）',
    placeholder: '请填写审核意见',
  },
  Del: {
    title: '删除原因',
    placeholder: '请填写删除原因',
  },
};
const rule = {
  Archived: {
    reason: [],
  },
  Failed: {
    reason: [
      {
        required: true,
        message: '请填写驳回原因',
        trigger: 'blur',
      },
    ],
  },
  Del: {
    reason: [],
  },
};
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    // 操作类型 删除Del 通过Archived 驳回Failed
    type: {
      type: String,
      default: 'Archived',
    },
    // 成果id
    id: {
      type: String || Array,
      default: '' || [],
    },
    zIndex: {
      type: Number,
      default: 1000,
    },
  },
  emits: ['close', 'ok'],
  setup(props, { emit }) {
    const formRef = ref();
    const confirmLoading = ref(false);
    const formData = reactive({
      reason: undefined,
    });
    const rules = reactive({});
    const state = reactive({});
    const handleClose = () => {
      emit('close');
      formRef.value.resetFields();
    };
    // 提交通过驳回删除原因
    const handleSubmit = () => {
      formRef.value
        .validate()
        .then(() => {
          confirmLoading.value = true;
          // console.log(props.id + ',' + props.type + ',' + formData.reason);
          if (props.type === 'Del') {
            deleteSycamoreItem(props.id, { remark: formData.reason })
              .then(() => {
                emit('ok', props.type);
              })
              .finally(() => {
                confirmLoading.value = false;
              });
          } else {
            examineSycamore(props.id, props.type, { remark: formData.reason })
              .then(() => {
                emit('ok', props.type);
              })
              .finally(() => {
                confirmLoading.value = false;
              });
          }
        })
        .catch(() => {});
    };
    watchEffect(() => {
      if (props.visible) {
        formData.reason = undefined;
        Object.assign(state, texts[props.type]);
        Object.assign(rules, rule[props.type]);
      }
    });
    return {
      state,
      formData,
      rules,
      formRef,
      handleClose,
      handleSubmit,
      confirmLoading,
    };
  },
  components: {},
});
</script>
