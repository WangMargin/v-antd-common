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
          <a-form-item label="姓名" :required="true" v-bind="validateInfos.uid">
            <a-tree-select
              v-model:value="modelRef.uid"
              show-search
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              placeholder="请选择姓名"
              :tree-node-filter-prop="'title'"
              :disabled="formInfo.disabled"
              @change="treeChange"
            >
              <a-tree-select-node
                v-for="tree in uimsUserData"
                :key="tree.id"
                :value="tree.id"
                :title="tree.name"
                :disabled="tree.accounts.length === 0"
                :selectable="false"
              >
                <a-tree-select-node
                  v-for="child in tree.accounts"
                  :key="`${tree.id}-${child.id}`"
                  :value="`${tree.id}-${child.id}`"
                  :title="
                    child.position === null || !child.position
                      ? `${child.name}`
                      : `${child.name}【${child.position}】`
                  "
                ></a-tree-select-node>
              </a-tree-select-node>
            </a-tree-select>
          </a-form-item>
          <a-form-item label="角色" :required="true" v-bind="validateInfos.type">
            <a-select
              v-model:value="modelRef.type"
              :options="roleData"
              placeholder="请选择角色"
              :disabled="id === '-1' ? true : false"
            ></a-select>
          </a-form-item>

          <a-form-item label="是否启用" :required="true" v-bind="validateInfos.is_active">
            <a-radio-group v-model:value="modelRef.is_active">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
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
import { addAdministrators, editAdministrators } from '@/api/subjects/subject.js';
import { Form } from 'ant-design-vue';
const useForm = Form.useForm;
const contrastData = {
  title: '管理员',
  initValues: {
    name: '',
    type: 'Admin',
    user_id: undefined,
    uid: undefined,
    is_active: 1,
    remark: '',
  },
  rules: {
    uid: [{ required: true, whitespace: true, message: '选择姓名' }],
    type: [{ required: true, message: '选择角色' }],
    is_active: [{ type: 'number', required: true, message: '是否启用' }],
  },
};
export default defineComponent({
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
      title: contrastData.title,
      disabled: false,
    });
    const loading = ref(false);
    const resourcesData = computed(() => store.getters[`resources/data`]);
    const subjectsResource = resourcesData.value.resources;
    const departmentResource = resourcesData.value.uimsDepartment;
    const uimsUserData = departmentResource;
    // 角色
    const roleData = subjectsResource['operator_type_enum'].map(k => {
      return { value: k.key, label: k.value };
    });
    const initValues = contrastData.initValues;
    const modelRef = reactive(initValues);
    const rulesRef = reactive(contrastData.rules);
    const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
    // 获取姓名
    const treeChange = (val, label) => {
      modelRef.name = label[0].toString().includes('【')
        ? label[0].toString().replace(/【.*?】/g, '')
        : label[0];
      modelRef.user_id = val.toString().includes('-') ? Number(val.split('-')[1]) : Number(val);
    };
    // 用户id处理成部门id-用户id
    const userIdToDepartmentUserId = userid => {
      let matching = {},
        filter = [];
      uimsUserData.forEach(item => {
        if (item.accounts.length > 0 && filter.length === 0) {
          filter = item.accounts.filter(k => k.id === userid);
          if (filter.length > 0) matching = item;
        }
      });
      if (matching.id) {
        return `${matching.id}-${userid}`;
      }
    };
    const formAssignmentData = data => {
      const raw = data;
      resetFields();
      if (props.id === '-1') {
        Object.assign(modelRef, initValues);
        formInfo.disabled = false;
      } else {
        formInfo.disabled = true;
        Object.keys(modelRef).forEach(k => {
          if (Object.prototype.toString.call(raw[k]) === '[object Object]') {
            modelRef[k] = raw[k].key;
          } else {
            if (k === 'uid') {
              modelRef[k] = userIdToDepartmentUserId(raw['user_id']);
            } else {
              modelRef[k] = raw[k];
            }
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
            addAdministrators(data)
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
            editAdministrators(props.id, data)
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
    const handleCancle = () => {
      loading.value = false;
      emit('cancel');
      resetFields();
    };
    return {
      formInfo,
      roleData,
      uimsUserData,
      modelRef,
      loading,
      handleSubmit,
      handleCancle,
      resetFields,
      validateInfos,
      treeChange,
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
