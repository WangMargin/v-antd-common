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
        <a-form :layout="formInfo.direction" style="margin-top: 20px">
          <a-form-item label="中心名称" :required="true">
            <a-input
              v-model:value="formInfo.name"
              placeholder="请填写中心名称"
              :disabled="formInfo.disabled"
            />
          </a-form-item>
          <a-form-item label="英文名称" v-bind="validateInfos.en_name">
            <a-input v-model:value="modelRef.en_name" placeholder="请填写英文名称" />
          </a-form-item>
          <a-form-item label="主任" :required="true" v-bind="validateInfos.director">
            <a-input v-model:value="modelRef.director" placeholder="请填写主任" />
          </a-form-item>
          <a-form-item label="主任助理" v-bind="validateInfos.assistant">
            <a-input v-model:value="modelRef.assistant" placeholder="请填写主任助理" />
          </a-form-item>
          <a-form-item label="副主任" v-bind="validateInfos.deputy_director">
            <a-input v-model:value="modelRef.deputy_director" placeholder="请填写副主任" />
          </a-form-item>
          <a-form-item label="成立时间" :required="true" v-bind="validateInfos.create_time">
            <a-date-picker
              style="width: 100%"
              :disabledDate="disabledDate"
              v-model:value="modelRef.create_time"
              :format="'YYYY/MM/DD'"
              :value-format="'YYYY/MM/DD'"
              placeholder="请选择成立时间"
            />
          </a-form-item>
          <a-form-item label="所属机构" :required="true" v-bind="validateInfos.parent">
            <a-select
              v-model:value="modelRef.parent"
              :options="parentData"
              :disabled="formInfo.disabled"
              placeholder="请选择所属机构"
            ></a-select>
          </a-form-item>
          <a-form-item label="中心简介" v-bind="validateInfos.summary">
            <a-textarea
              :auto-size="{ minRows: 2, maxRows: 4 }"
              v-model:value="modelRef.summary"
              placeholder="请填写中心简介"
            />
          </a-form-item>
          <a-form-item label="网址" v-bind="validateInfos.web_url">
            <a-input
              v-model:value="modelRef.web_url"
              placeholder="输入网址，http://或https://开头"
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment';
import { useStore } from 'vuex';
import { defineComponent, ref, reactive, toRaw, computed, watchEffect } from 'vue';
import { editSubjectsInfo } from '@/api/subjects/information.js';
import { Form } from 'ant-design-vue';
const useForm = Form.useForm;
export default defineComponent({
  name: 'InfoForm',
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
    const store = useStore();
    const formInfo = reactive({
      direction: 'vertical',
      okTxt: '保存',
      title: '基本情况',
      disabled: false,
      name: '',
    });
    const resourcesData = computed(() => store.getters[`resources/data`]);
    const subjectsResource = resourcesData.value.resources;
    // 机构
    const parentData = subjectsResource['team_parent_enum'].map(item => {
      return { value: item.key, label: item.value };
    });
    const loading = ref(false);
    const modelRef = reactive({});
    const rulesRef = reactive({
      en_name: [{ pattern: /^[•\s[a-zA-Z]*$/, message: '只能输入英文、空格以及•' }],
      director: [{ required: true, message: '填写主任' }],
      // deputy_director: [{ required: true, message: '填写副主任' }],
      create_time: [{ required: true, message: '选择成立时间' }],
      web_url: [{ type: 'url', message: '填写正确的网址' }],
    });
    const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
    const handleObjectData = data => {
      const newData = {};
      Object.keys(data).forEach(k => {
        if (Object.prototype.toString.call(data[k]) === '[object Object]') {
          newData[k] = data[k].key;
        } else {
          newData[k] = data[k];
        }
      });
      return newData;
    };
    const formAssignmentData = data => {
      formInfo.disabled = true;
      formInfo.name = data.name;
      const dataInfo = handleObjectData(data.info);
      Object.assign(modelRef, dataInfo);
    };
    watchEffect(() => {
      if (props.visible) {
        resetFields();
        formAssignmentData(toRaw(props.model));
      }
    });

    // 提交
    const handleSubmit = e => {
      e.preventDefault();
      validate()
        .then(() => {
          loading.value = true;
          const data = toRaw(modelRef);
          editSubjectsInfo({ info: data })
            .then(res => {
              if (res.code === 200) {
                loading.value = false;
                emit('ok');
              }
            })
            .catch(() => {
              loading.value = false;
            });
        })
        .catch(() => {});
    };
    const disabledDate = current => {
      return current && current > moment().endOf('day');
    };
    // 取消按钮点击
    const handleCancle = () => {
      loading.value = false;
      resetFields();
      emit('cancel');
    };
    return {
      formInfo,
      parentData,
      modelRef,
      loading,
      handleSubmit,
      handleCancle,
      resetFields,
      validateInfos,
      disabledDate,
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
  padding: 10px 16px 20px;
  text-align: center;
  border-top: 0 none;
}
.subject-modal-form ::v-deep(.ant-modal-footer .ant-btn-primary) {
  margin-left: 40px;
}
.subject-modal-form ::v-deep(.ant-form-vertical .ant-form-item-label) {
  padding-bottom: 2px;
}
</style>
