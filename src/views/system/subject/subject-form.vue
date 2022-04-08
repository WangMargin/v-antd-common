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
          <template v-if="type === 'staff'">
            <a-form-item label="主体名称" :required="true" v-bind="validateInfos.user_id">
              <a-tree-select
                v-model:value="modelRef.user_id"
                show-search
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="请选择主体"
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
            <a-form-item label="英文名称" :required="true" v-bind="validateInfos['info.en_name']">
              <a-input v-model:value="modelRef.info.en_name" placeholder="请填写英文名称" />
            </a-form-item>
            <a-row :gutter="20">
              <a-col :span="12">
                <a-form-item label="职位" :required="true" v-bind="validateInfos['info.position']">
                  <a-select
                    v-model:value="modelRef.info.position"
                    :options="positionData"
                    placeholder="请选择职位"
                  ></a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="职称" v-bind="validateInfos['info.title']">
                  <a-select
                    v-model:value="modelRef.info.title"
                    :options="titleData"
                    placeholder="请选择职称"
                  ></a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item
              label="所属部门"
              :required="true"
              v-bind="validateInfos['info.departments']"
            >
              <a-select
                v-model:value="modelRef.info.departments"
                :options="uimsDepartmentData"
                placeholder="请选择所属部门"
                @change="departmentChange"
              ></a-select>
            </a-form-item>
            <a-form-item label="操作员" :required="true" v-bind="validateInfos.operator">
              <a-tree-select
                v-model:value="modelRef.operator"
                show-search
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="请选择操作员"
                :tree-node-filter-prop="'title'"
                tree-checkable
                multiple
                @change="operatorChange"
              >
                <a-tree-select-node
                  v-for="tree in uimsUserData"
                  :key="tree.id"
                  :value="tree.id"
                  :title="tree.name"
                  :disabled="tree.accounts.length === 0"
                  :checkable="tree.accounts.length > 0"
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
            <a-form-item label="是否启用" :required="true" v-bind="validateInfos.is_active">
              <a-radio-group v-model:value="modelRef.is_active">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item
              label="入职时间"
              :required="true"
              v-bind="validateInfos['info.entry_time']"
            >
              <a-date-picker
                style="width:100%;"
                :disabledDate="disabledDate"
                v-model:value="modelRef.info.entry_time"
                :format="'YYYY/MM/DD'"
                :value-format="'YYYY/MM/DD'"
                placeholder="请选择入职时间"
              />
            </a-form-item>
            <a-form-item label="离职时间" v-bind="validateInfos['info.leave_time']">
              <a-date-picker
                style="width:100%;"
                :disabledDate="disabledDate"
                v-model:value="modelRef.info.leave_time"
                :format="'YYYY/MM/DD'"
                :value-format="'YYYY/MM/DD'"
                placeholder="请选择离职时间"
              />
            </a-form-item>
            <a-form-item label="备注信息" v-bind="validateInfos.remark">
              <a-textarea
                :auto-size="{ minRows: 2, maxRows: 4 }"
                v-model:value="modelRef.remark"
                placeholder="请填写备注信息"
              />
            </a-form-item>
          </template>
          <template v-if="type === 'team'">
            <a-form-item label="主体名称" :required="true" v-bind="validateInfos.uims_id">
              <a-select
                v-model:value="modelRef.uims_id"
                :disabled="formInfo.disabled"
                placeholder="请选择主体"
                :options="uimsDepartmentData"
                @change="selectChange"
              ></a-select>
            </a-form-item>
            <a-form-item label="所属机构" :required="true" v-bind="validateInfos['info.parent']">
              <a-select
                v-model:value="modelRef.info.parent"
                :options="parentData"
                placeholder="请选择所属机构"
              ></a-select>
            </a-form-item>
            <a-form-item label="操作员" :required="true" v-bind="validateInfos.operator">
              <a-tree-select
                v-model:value="modelRef.operator"
                show-search
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="请选择操作员"
                :tree-node-filter-prop="'title'"
                tree-checkable
                multiple
                @change="operatorChange"
              >
                <a-tree-select-node
                  v-for="tree in uimsUserData"
                  :key="tree.id"
                  :value="tree.id"
                  :title="tree.name"
                  :disabled="tree.accounts.length === 0"
                  :checkable="tree.accounts.length > 0"
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
          </template>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment';
import { defineComponent, ref, reactive, toRaw, computed, watchEffect, onMounted } from 'vue';
import { useStore } from 'vuex';
import { addSubjects, editSubjects } from '@/api/subjects/subject.js';
import { Form } from 'ant-design-vue';
const useForm = Form.useForm;
const contrastData = {
  staff: {
    key: 'Faculty',
    title: '教职工',
    initValues: {
      uims_id: undefined,
      user_id: undefined,
      is_active: 1,
      name: '',
      operator: [],
      operators: [],
      remark: '',
      info: {
        title: null,
        position: undefined,
        departments: undefined,
        department: undefined,
        en_name: '',
        entry_time: '',
        leave_time: '',
      },
    },
    rules: {
      user_id: [{ required: true, whitespace: true, message: '填写主体名称' }],
      is_active: [{ type: 'number', required: true, message: '是否启用' }],
      operator: [{ type: 'array', required: true, message: '选择操作员' }],
      'info.position': [{ required: true, message: '选择职位' }],
      'info.departments': [{ type: 'number', required: true, message: '选择所属部门' }],
      'info.en_name': [
        { required: true, whitespace: true, message: '填写英文名称' },
        { pattern: /^[•\s[a-zA-Z]*$/, message: '只能输入英文、空格以及•' },
      ],
      'info.entry_time': [{ required: true, message: '选择入职时间' }],
    },
  },
  team: {
    key: 'Team',
    title: '研究中心',
    initValues: {
      uims_id: undefined,
      is_active: 1,
      name: '',
      operator: [],
      operators: [],
      remark: '',
      info: {
        parent: undefined,
      },
    },
    rules: {
      uims_id: [{ type: 'number', required: true, whitespace: true, message: '填写主体名称' }],
      is_active: [{ type: 'number', required: true, message: '是否启用' }],
      operator: [{ type: 'array', required: true, message: '选择操作员' }],
      'info.parent': [{ required: true, message: '选择机构' }],
    },
  },
};
export default defineComponent({
  name: 'SubjectForm',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    model: {
      type: Object,
      default: () => {},
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
      department: {},
    });
    const loading = ref(false);
    const initValues = contrastData[props.type].initValues;
    const modelRef = reactive(initValues);
    const rulesRef = reactive(contrastData[props.type].rules);
    const resourcesData = computed(() => store.getters[`resources/data`]);
    const subjectsResource = resourcesData.value.resources;
    const departmentResource = resourcesData.value.uimsDepartment;
    // const userResource = resourcesData.value.uimsUser;
    // uims用户数据
    // const uimsUserData = userResource.map(item => {
    //   return {
    //     value: item.id,
    //     label: item.name,
    //     info: item.departments.length > 0 ? `${item.departments[0].name}` : '',
    //   };
    // });
    const uimsUserData = departmentResource;
    // uims部门数据
    const uimsDepartmentData = departmentResource.map(item => {
      return { value: item.id, label: item.name };
    });
    // 职位
    const positionData = subjectsResource['faculty_position_enum'].map(item => {
      return { value: item.key, label: item.value };
    });
    // 职称
    const titleData = subjectsResource['faculty_title_enum'].map(item => {
      return { value: item.key, label: item.value };
    });
    // 机构
    const parentData = subjectsResource['team_parent_enum'].map(item => {
      return { value: item.key, label: item.value };
    });
    const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

    const treeChange = (val, label) => {
      modelRef.name = label[0].toString().includes('【')
        ? label[0].toString().replace(/【.*?】/g, '')
        : label[0];
      modelRef.uims_id = val.toString().includes('-') ? Number(val.split('-')[1]) : Number(val);
    };
    const selectChange = (val, option) => {
      modelRef.name = option.label;
    };
    const departmentChange = (val, option) => {
      formInfo.department.key = val;
      formInfo.department.value = option.label;
    };
    // 操作员去重
    const duplicateRemoval = data => {
      const newData = [];
      data.map(item => {
        if (!newData.includes(Number(item.split('-')[1]))) {
          newData.push(Number(item.split('-')[1]));
        }
      });
      return newData;
    };
    const operatorChange = val => {
      modelRef.operators = duplicateRemoval(val);
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
    // 处理操作员数组数据
    const handleOperators = (arr, uid) => {
      const operators = [];
      const user_id = uid || '';
      arr.map(k => {
        if (k.user_id !== user_id) {
          operators.push(k.user_id);
        }
      });
      return operators;
    };
    // 操作员数据转为组件数据
    const operatorsToTreeData = data => {
      const newData = [];
      data.map(k => {
        if (userIdToDepartmentUserId(k)) {
          newData.push(userIdToDepartmentUserId(k));
        }
      });
      return newData;
    };
    // 处理Object数据
    const handleObjectData = data => {
      const newData = {};
      Object.keys(data).forEach(k => {
        if (k === 'department') {
          newData['departments'] = data[k].key;
          formInfo.department = data[k];
        }
        if (Object.prototype.toString.call(data[k]) === '[object Object]') {
          newData[k] = data[k].key;
        } else {
          newData[k] = data[k];
        }
      });
      return newData;
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
          if (Object.prototype.toString.call(raw[k]) === '[object Array]') {
            if (props.type === 'staff') {
              modelRef[k] = handleOperators(raw[k], raw.uims_id);
            } else {
              modelRef[k] = handleOperators(raw[k]);
            }
          } else if (Object.prototype.toString.call(raw[k]) === '[object Object]') {
            modelRef[k] = handleObjectData(raw[k]);
          } else {
            if (k === 'user_id') {
              modelRef[k] = userIdToDepartmentUserId(raw['uims_id']);
            } else if (k === 'operator') {
              if (props.type === 'staff') {
                modelRef.operator = operatorsToTreeData(
                  handleOperators(raw['operators'], raw.uims_id),
                );
              } else {
                modelRef.operator = operatorsToTreeData(handleOperators(raw['operators']));
              }
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
          if (data.info.departments) {
            data.info.department = formInfo.department;
          }
          if (props.id === '-1') {
            data.type = contrastData[props.type].key;
            addSubjects(data)
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
            editSubjects(props.id, data)
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
    const handleCancle = () => {
      loading.value = false;
      emit('cancel');
      resetFields();
    };
    return {
      formInfo,
      positionData,
      titleData,
      parentData,
      uimsUserData,
      uimsDepartmentData,
      modelRef,
      loading,
      handleSubmit,
      handleCancle,
      resetFields,
      validateInfos,
      disabledDate,
      selectChange,
      departmentChange,
      operatorChange,
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
