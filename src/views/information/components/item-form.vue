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
          <template v-if="type === 'member'">
            <a-form-item label="姓名" :required="true" v-bind="validateInfos.name">
              <a-input
                v-model:value="modelRef.name"
                placeholder="请填写姓名"
                :disabled="formInfo.disabled"
              />
            </a-form-item>
            <a-form-item label="职务" :required="true" v-bind="validateInfos.position">
              <a-select
                v-model:value="modelRef.position"
                :options="positionData"
                placeholder="请选择职务"
              ></a-select>
            </a-form-item>
            <a-form-item label="学历" :required="true" v-bind="validateInfos.education">
              <a-select
                v-model:value="modelRef.education"
                :options="educationData"
                placeholder="请选择学历"
              ></a-select>
            </a-form-item>
            <a-form-item label="状态" :required="true" v-bind="validateInfos.status">
              <a-select
                v-model:value="modelRef.status"
                :options="statusData"
                placeholder="请选择状态"
                @change="statusChange"
              ></a-select>
            </a-form-item>
            <a-form-item label="入职时间" :required="true" v-bind="validateInfos.entry_time">
              <a-date-picker
                style="width: 100%"
                :disabledDate="disabledDate"
                v-model:value="modelRef.entry_time"
                :format="'YYYY/MM/DD'"
                :value-format="'YYYY/MM/DD'"
                placeholder="请选择入职时间"
              />
            </a-form-item>
            <a-form-item
              label="离职时间"
              v-bind="validateInfos.leave_time"
              v-if="modelRef.status === 'LeaveJob'"
            >
              <a-date-picker
                style="width: 100%"
                :disabledDate="disabledDate"
                v-model:value="modelRef.leave_time"
                :format="'YYYY/MM/DD'"
                :value-format="'YYYY/MM/DD'"
                placeholder="请选择离职时间"
              />
            </a-form-item>
          </template>
          <template v-if="type === 'donation'">
            <a-form-item label="捐赠单位" :required="true" v-bind="validateInfos.name">
              <a-input
                v-model:value="modelRef.name"
                placeholder="请填写捐赠单位"
                :disabled="formInfo.disabled"
              />
            </a-form-item>
            <a-form-item label="捐赠时间" :required="true" v-bind="validateInfos.donation_time">
              <a-date-picker
                style="width: 100%"
                :disabledDate="disabledDate"
                v-model:value="modelRef.donation_time"
                :format="'YYYY/MM/DD'"
                :value-format="'YYYY/MM/DD'"
                placeholder="请选择捐赠时间"
              />
            </a-form-item>
            <a-form-item label="合同金额（单位：元）" :required="true" v-bind="validateInfos.money">
              <a-input-number
                v-model:value="modelRef.money"
                placeholder="请填写合同金额"
                style="width: 100%"
                :precision="2"
                :min="1"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
              />
            </a-form-item>
            <a-form-item label="备注" v-bind="validateInfos.remark">
              <a-textarea
                :auto-size="{ minRows: 2, maxRows: 4 }"
                v-model:value="modelRef.remark"
                placeholder="请填写备注"
              />
            </a-form-item>
          </template>
          <template v-if="type === 'funds'">
            <a-form-item label="经费来源" :required="true" v-bind="validateInfos.source">
              <a-input
                v-model:value="modelRef.source"
                placeholder="请填写经费来源"
                :disabled="formInfo.disabled"
              />
            </a-form-item>
            <a-form-item label="经费类别" :required="true" v-bind="validateInfos.type">
              <a-select
                v-model:value="modelRef.type"
                :options="typeData"
                placeholder="请选择经费类别"
              ></a-select>
            </a-form-item>
            <a-form-item label="收款时间" :required="true" v-bind="validateInfos.income_time">
              <a-date-picker
                style="width: 100%"
                :disabledDate="disabledDate"
                v-model:value="modelRef.income_time"
                :format="'YYYY/MM/DD'"
                :value-format="'YYYY/MM/DD'"
                placeholder="请选择收款时间"
              />
            </a-form-item>
            <a-form-item
              label="收款金额（单位：元）"
              :required="true"
              v-bind="validateInfos.income_money"
            >
              <a-input-number
                v-model:value="modelRef.income_money"
                placeholder="请填写收款金额"
                style="width: 100%"
                :precision="2"
                :min="1"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
              />
            </a-form-item>
            <a-form-item label="备注" v-bind="validateInfos.remark">
              <a-textarea
                :auto-size="{ minRows: 2, maxRows: 4 }"
                v-model:value="modelRef.remark"
                placeholder="请填写备注"
              />
            </a-form-item>
          </template>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment';
import { defineComponent, ref, reactive, toRaw, computed, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { addSubjectsItem, editSubjectsItem } from '@/api/subjects/information.js';
import { Form } from 'ant-design-vue';
const useForm = Form.useForm;
const contrastData = {
  member: {
    key: 'Member',
    title: '团队成员',
    initValues: {
      name: '',
      position: undefined,
      education: undefined,
      status: undefined,
      entry_time: '',
      leave_time: '',
    },
    rules: {
      name: [{ required: true, message: '填写姓名' }],
      position: [{ required: true, message: '选择职务' }],
      education: [{ required: true, message: '选择学历' }],
      status: [{ required: true, message: '选择状态' }],
      entry_time: [{ required: true, message: '选择入职时间' }],
    },
  },
  donation: {
    key: 'Donation',
    title: '捐赠情况',
    initValues: {
      name: '',
      donation_time: '',
      money: undefined,
      remark: '',
    },
    rules: {
      name: [{ required: true, message: '填写捐赠单位' }],
      donation_time: [{ required: true, message: '选择捐赠时间' }],
      money: [{ type: 'number', required: true, message: '填写合同金额', trigger: 'blur' }],
    },
  },
  funds: {
    key: 'Funds',
    title: '经费情况',
    initValues: {
      source: '',
      type: undefined,
      income_time: '',
      income_money: undefined,
      remark: '',
    },
    rules: {
      source: [{ required: true, message: '填写经费来源' }],
      type: [{ required: true, message: '选择经费类别' }],
      income_time: [{ required: true, message: '选择收款时间' }],
      income_money: [{ type: 'number', required: true, message: '填写收款金额', trigger: 'blur' }],
    },
  },
};
export default defineComponent({
  name: 'ItemForm',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    model: {
      type: Object,
      default: () => null,
    },
    type: {
      type: String,
      default: '',
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
      title: contrastData[props.type].title,
      disabled: false,
    });
    const loading = ref(false);
    const initValues = contrastData[props.type].initValues;
    const modelRef = reactive(initValues);
    const rulesRef = reactive(contrastData[props.type].rules);
    if (props.type === 'member') {
      rulesRef.leave_time = [
        {
          required: true,
          validator: function (rule, value) {
            if (!value && modelRef.status === 'LeaveJob') {
              return Promise.reject('选择离职时间');
            } else {
              return Promise.resolve();
            }
          },
        },
      ];
    }
    const resourcesData = computed(() => store.getters[`resources/data`]);
    const subjectsResource = resourcesData.value.resources;
    // 职务
    const positionData = subjectsResource['subject_item_member_info_position'].map(item => {
      return { value: item.key, label: item.value };
    });
    //学历
    const educationData = subjectsResource['subject_item_member_info_education'].map(item => {
      return { value: item.key, label: item.value };
    });
    // 状态
    const statusData = subjectsResource['subject_item_member_status'].map(item => {
      return { value: item.key, label: item.value };
    });
    // 类别
    const typeData = subjectsResource['subject_item_funds_type'].map(item => {
      return { value: item.key, label: item.value };
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
        const info = raw.info;
        Object.keys(modelRef).forEach(k => {
          if (Object.prototype.toString.call(info[k]) === '[object Object]') {
            modelRef[k] = info[k].key;
          } else {
            modelRef[k] = info[k];
          }
        });
      }
    };
    watchEffect(() => {
      if (props.visible) {
        formAssignmentData(toRaw(props.model));
      }
    });
    // 离职在职切换
    const statusChange = val => {
      if (val === 'OnJob') {
        modelRef.leave_time = '';
      }
    };
    // 提交
    const handleSubmit = e => {
      e.preventDefault();
      loading.value = true;
      validate()
        .then(() => {
          const data = toRaw(modelRef);
          if (data.money) {
            data.money = data.money.toFixed('2');
          }
          if (data.income_money) {
            data.income_money = data.income_money.toFixed('2');
          }
          if (props.id === '-1') {
            addSubjectsItem({ type: contrastData[props.type].key, info: data })
              .then(res => {
                if (res.code === 200) {
                  loading.value = false;
                  emit('ok');
                  resetFields();
                }
              })
              .catch(() => {
                loading.value = false;
              });
          } else {
            editSubjectsItem(props.id, { info: data })
              .then(res => {
                if (res.code === 200) {
                  loading.value = false;
                  emit('ok');
                  resetFields();
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
    const disabledDate = current => {
      return current && current > moment().endOf('day');
    };
    // 取消按钮点击
    const handleCancle = () => {
      loading.value = false;
      emit('cancel');
      resetFields();
    };
    return {
      formInfo,
      positionData,
      educationData,
      statusData,
      typeData,
      modelRef,
      loading,
      handleSubmit,
      handleCancle,
      resetFields,
      validateInfos,
      disabledDate,
      statusChange,
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
