<template>
  <div ref="replayModal" class="subject-modal-form">
    <a-modal
      :get-container="() => $refs.replayModal"
      :centered="true"
      :closable="false"
      :destroy-on-close="true"
      :mask-closable="false"
      :width="680"
      :body-style="{ padding: '10px 70px 0 70px' }"
      :style="{ padding: '0' }"
      :ok-text="formInfo.okText"
      :visible="visible"
      :confirm-loading="loading"
      @ok="handleSubmit"
      @cancel="handleCancle"
    >
      <a-spin :spinning="loading">
        <a-divider :style="{ fontSize: '18px', height: '24px' }">{{ formInfo.title }}</a-divider>
        <a-form :layout="formInfo.direction" style="margin-top:20px">
          <a-form-item label="统计类别" :required="true" v-bind="validateInfos.type">
            <a-select
              v-model:value="modelRef.type"
              :options="categoryTypeData"
              :disabled="formInfo.disabled"
              placeholder="请选择统计类别"
            ></a-select>
          </a-form-item>
          <a-form-item label="统计项目" :required="true" v-bind="validateInfos.name">
            <a-input v-model:value="modelRef.name" placeholder="请填写统计项目" />
          </a-form-item>
          <a-form-item label="描述" :required="true" v-bind="validateInfos.description">
            <a-input v-model:value="modelRef.description" placeholder="请填写描述" />
          </a-form-item>
          <a-form-item label="统计范围" :required="true" v-bind="validateInfos.scopes">
            <a-checkbox-group
              v-model:value="modelRef.scopes"
              :options="scopesData"
            ></a-checkbox-group>
          </a-form-item>
          <a-form-item label="备注信息" v-bind="validateInfos.remark">
            <a-textarea
              :auto-size="{ minRows: 2, maxRows: 4 }"
              v-model:value="modelRef.remark"
              placeholder="请填写备注信息"
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>
<script>
import { defineComponent, ref, reactive, toRaw, computed, watchEffect, onMounted } from 'vue';
import { useStore } from 'vuex';
import { addStatisticsItem, editStatisticsItem } from '@/api/subjects/statistics.js';
import { Form } from 'ant-design-vue';
const useForm = Form.useForm;
export default defineComponent({
  name: 'StatisticsForm',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    model: {
      type: Object,
      default: () => null,
    },
    id: {
      type: String,
      default: '-1',
    },
  },
  emits: ['ok', 'cancel'],
  setup(props, { emit }) {
    const store = useStore();
    const formInfo = reactive({
      direction: 'vertical',
      okTxt: '保存',
      title: '项目信息',
      disabled: false,
    });
    const loading = ref(false);
    const resourcesData = computed(() => store.getters[`resources/data`]);
    const subjectsResource = resourcesData.value.resources;
    // 一级分类
    const categoryTypeData = subjectsResource['category_type_enum'].map(item => {
      return { value: item.key, label: item.value };
    });
    // 统计范围
    const scopesData = subjectsResource['category_scope_enum'].map(item => {
      return { value: item.key, label: item.value };
    });
    const initValues = {
      name: '',
      remark: '',
      description: '',
      scopes: [],
      type: undefined,
    };
    const modelRef = reactive(initValues);
    const rulesRef = reactive({
      type: [{ required: true, whitespace: true, message: '选择统计类别' }],
      name: [{ required: true, whitespace: true, message: '填写统计项目' }],
      description: [{ required: true, whitespace: true, message: '填写描述' }],
      scopes: [{ type: 'array', required: true, message: '选择统计范围' }],
    });
    const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
    const formAssignmentData = data => {
      const raw = data;
      resetFields();
      if (props.id === '-1') {
        Object.assign(modelRef, initValues);
        formInfo.disabled = false;
      } else {
        formInfo.disabled = true;
        Object.keys(modelRef).forEach(k => {
          if (Object.prototype.toString.call(raw[k]) === '[object Array]') {
            modelRef[k] = raw[k].map(item => item.key);
          } else if (Object.prototype.toString.call(raw[k]) === '[object Object]') {
            modelRef[k] = raw[k].key;
          } else {
            modelRef[k] = raw[k];
          }
        });
      }
    };
    onMounted(() => {
      watchEffect(() => {
        if (props.visible) {
          formAssignmentData(toRaw(props.model));
        }
      });
    });

    const handleSubmit = e => {
      e.preventDefault();
      loading.value = true;
      validate()
        .then(() => {
          const data = toRaw(modelRef);
          if (props.id === '-1') {
            addStatisticsItem(data)
              .then(res => {
                if (res.code === 200) {
                  loading.value = false;
                  emit('ok');
                }
              })
              .catch(() => {
                loading.value = false;
              });
          } else {
            editStatisticsItem(props.id, data)
              .then(res => {
                if (res.code === 200) {
                  loading.value = false;
                  emit('ok');
                }
              })
              .catch(() => {
                loading.value = false;
              });
          }
        })
        .catch(() => {
          loading.value = false;
        });
    };
    const handleCancle = () => {
      loading.value = false;
      emit('cancel');
    };
    return {
      formInfo,
      modelRef,
      loading,
      handleSubmit,
      handleCancle,
      resetFields,
      validateInfos,
      scopesData,
      categoryTypeData,
    };
  },
});
</script>
<style lang="less" scoped>
.subject-modal-form ::v-deep(.ant-modal-content) {
  border-radius: 15px;
}
.subject-modal-form ::v-deep(.ant-form-vertical .ant-form-item) {
  padding-bottom: 0;
}
.subject-modal-form ::v-deep(.ant-modal-footer) {
  border-top: 0 none;
  padding: 10px 16px 20px;
  text-align: center;
}
.subject-modal-form ::v-deep(.ant-modal-footer .ant-btn-primary) {
  margin-left: 40px;
}
.subject-modal-form ::v-deep(.ant-form-vertical .ant-form-item-label) {
  padding-bottom: 2px;
}
</style>
