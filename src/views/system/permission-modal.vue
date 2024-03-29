<template>
  <a-modal
    title="权限编辑"
    :visible="visible"
    :width="600"
    :confirmLoading="loading"
    centered
    @ok="handleSubmit"
    @cancel="
      () => {
        resetFields();
        Object.assign(modelRef, initValues);
        $emit('cancel');
      }
    "
  >
    <a-spin :spinning="loading">
      <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="编号" disabled v-bind="validateInfos.id">
          <a-input disabled v-model:value="modelRef.id" />
        </a-form-item>
        <a-form-item label="权限名称" v-bind="validateInfos.name">
          <a-input v-model:value="modelRef.name" />
        </a-form-item>
        <a-form-item label="显示名称" v-bind="validateInfos.label">
          <a-input v-model:value="modelRef.label" />
        </a-form-item>
        <a-form-item label="操作类型">
          <a-select v-model:value="modelRef.actions" mode="tags" style="width: 100%">
            <a-select-option v-for="action in permissionActions" :key="action">
              {{ action }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { useForm } from '@ant-design-vue/use';
import { defineComponent, ref, reactive, toRaw, watchEffect } from 'vue';
import { message } from 'ant-design-vue';
import { addPermission, updatePermission } from '@/api/user/role';
const formLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 7,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 13,
    },
  },
};
const permissionActions = ['add', 'delete', 'update', 'query', 'import', 'export'];
export default defineComponent({
  name: 'PermissionModal',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    model: {
      type: Object,
      default: () => null,
    },
  },
  emits: ['ok', 'cancel'],

  setup(props, { emit }) {
    const loading = ref(false);
    const initValues = {
      id: -1,
      name: '',
      label: '',
      actions: [],
    };
    const modelRef = reactive(initValues);
    const rulesRef = reactive({
      // 注意如果数据类型不相同，一定要指定数据类型 `type` 否则会校验失败
      id: [
        {
          required: true,
          message: '编码必须填写',
          type: 'number',
        },
      ],
      name: [
        {
          required: true,
          message: '权限名称必须填写',
        },
      ],
      label: [
        {
          required: true,
          message: '显示名称必须填写',
        },
      ],
    });
    watchEffect(() => {
      if (props.model) {
        console.log('update model', props.model);
        const raw = toRaw(props.model);
        modelRef.id = raw.id;
        modelRef.name = raw.name;
        modelRef.label = raw.label;
        modelRef.actions = raw.actions;
      }
    });
    const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

    const handleSubmit = e => {
      e.preventDefault();
      loading.value = true;
      validate()
        .then(() => {
          const data = toRaw(modelRef);

          if (data.id === -1) {
            addPermission(data)
              .then(res => {
                message.success('新增中权限成功');
                loading.value = false;
                emit('ok', res);
              })
              .catch(err => {
                message.error(err.response.data.message);
                loading.value = false;
              });
          } else {
            updatePermission(data)
              .then(res => {
                message.success('修改权限成功');
                loading.value = false;
                emit('ok', res);
              })
              .catch(err => {
                message.error(err.response.data.message);
                loading.value = false;
              });
          }
        })
        .catch(err => {
          console.log('error', err);
          loading.value = false;
        });
    };

    return {
      ...formLayout,
      initValues,
      modelRef,
      loading,
      handleSubmit,
      resetFields,
      validateInfos,
      permissionActions,
    };
  },
});
</script>
