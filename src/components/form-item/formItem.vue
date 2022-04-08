<template>
  <div v-if="item" class="dynamic-box" :class="item.component.class">
    <a-form-item
      validate-first
      :label="item.label"
      :name="item.key"
      :label-col="labelCol"
      :rules="validateArr"
      :extra="item.component.attribute.extra"
      v-show="item.component.attribute.visible === 0 ? false : true"
    >
      <template v-if="item.component.type && item.component.type.key">
        <template v-if="item.component.type.key === 'Cascader' && data_source">
          <a-cascader
            style="width:100%;"
            v-model:value="defaultValue"
            :options="data_source.list"
            :display-render="displayRender"
            :disabled="!!item.component.attribute.disable"
            expand-trigger="hover"
            :fieldNames="{ label: 'label', value: 'value', children: 'chlidren' }"
            @change="changeCascader"
          />
        </template>
        <template v-if="item.component.type.key === 'InputTextarea'">
          <a-textarea
            @change="changeInput"
            @focus="focusInput"
            :rows="4"
            :showCount="false"
            v-model:value="defaultValue"
            v-show="item.component.attribute.visible === 0 ? false : true"
            :maxlength="item.component.attribute.maxlength"
            :disabled="!!item.component.attribute.disable"
            :placeholder="item.component.attribute.placeholder"
            @blur="blurInput"
          />
        </template>
        <template v-if="item.component.type.key === 'RangeDate'">
          <a-input v-model:value="defaultValue" type="hidden" />
          <rangeDate :data="item" :value="defaultValue" @setValue="getValue" />
        </template>
        <template v-if="item.component.type.key === 'DatePicker'">
          <div @click="openFn">
            <template v-if="item.component.parameter.formatter === 'YYYY'">
              <a-date-picker
                style="width:100%;"
                mode="year"
                :open="isOpen"
                @panelChange="changeYearDate"
                v-model:value="defaultValue"
                :format="item.component.parameter.formatter"
                :valueFormat="item.component.parameter.formatter"
                v-show="item.component.attribute.visible === 0 ? false : true"
                :disabled="!!item.component.attribute.disable"
                :placeholder="item.component.attribute.placeholder"
              />
            </template>
            <template v-else-if="item.component.parameter.formatter.length == 7">
              <a-month-picker
                style="width:100%;"
                mode="month"
                :open="isOpen"
                @panelChange="changeYearDate"
                @change="changeYearDate"
                v-model:value="defaultValue"
                :format="item.component.parameter.formatter"
                :valueFormat="item.component.parameter.formatter"
                v-show="item.component.attribute.visible === 0 ? false : true"
                :disabled="!!item.component.attribute.disable"
                :placeholder="item.component.attribute.placeholder"
              />
            </template>
            <template v-else>
              <a-date-picker
                style="width:100%;"
                @change="changeDate"
                v-model:value="defaultValue"
                :format="item.component.parameter.formatter"
                :valueFormat="item.component.parameter.formatter"
                v-show="item.component.attribute.visible === 0 ? false : true"
                :disabled="!!item.component.attribute.disable"
                :placeholder="item.component.attribute.placeholder"
              />
            </template>
          </div>
        </template>
        <template v-if="item.component.type.key === 'DateRangePicker'">
          <div @click="openFn">
            <template v-if="item.component.parameter.formatter === 'YYYY'">
              <a-range-picker
                style="width:100%;"
                :mode="rangeYearMode"
                :open="isOpen"
                @panelChange="changeRangeYearDate"
                v-model:value="defaultValue"
                :format="item.component.parameter.formatter"
                v-show="item.component.attribute.visible === 0 ? false : true"
                :disabled="!!item.component.attribute.disable"
              />
            </template>
            <template v-else-if="item.component.parameter.formatter.length == 7">
              <a-range-picker
                style="width:100%;"
                :mode="rangeMonthMode"
                :open="isOpen"
                @panelChange="changeRangeMonthDate"
                v-model:value="defaultValue"
                :format="item.component.parameter.formatter"
                v-show="item.component.attribute.visible === 0 ? false : true"
                :disabled="!!item.component.attribute.disable"
              />
            </template>
            <template v-else>
              <a-range-picker
                style="width:100%;"
                @change="changeRangeDate"
                v-model:value="defaultValue"
                :format="item.component.parameter.formatter"
                v-show="item.component.attribute.visible === 0 ? false : true"
                :disabled="!!item.component.attribute.disable"
              />
            </template>
          </div>
        </template>
        <template v-if="item.component.type.key === 'Input'">
          <a-input
            @change="changeInput"
            @focus="focusInput"
            v-model:value="defaultValue"
            v-show="item.component.attribute.visible === 0 ? false : true"
            :maxlength="item.component.attribute.maxlength"
            :disabled="!!item.component.attribute.disable"
            :placeholder="item.component.attribute.placeholder"
            @blur="blurInput"
          />
          <a-button
            type="primary"
            style="margin-left:10px;flex:none;"
            v-if="item.duplicate_check === 1"
            @click="showDuplicateCheckModal"
          >
            查重
          </a-button>
        </template>
        <template v-if="item.component.type.key === 'InputNumber'">
          <a-input-number
            style="width:100%;"
            @change="changeInputNumber"
            v-model:value="defaultValue"
            v-show="item.component.attribute.visible === 0 ? false : true"
            :maxlength="item.component.attribute.maxlength"
            :disabled="!!item.component.attribute.disable"
            :placeholder="item.component.attribute.placeholder"
          />
        </template>
        <template v-if="item.component.type.key === 'Checkbox'">
          <a-checkbox-group
            v-model:value="defaultValue"
            @change="changeCheckbox"
            :disabled="!!item.component.attribute.disable"
          >
            <a-checkbox :value="check.key" :key="check.key" v-for="check in data_source.enum">
              {{ check.value }}
            </a-checkbox>
          </a-checkbox-group>
          <a-input
            class="otherInput"
            v-if="!!item.component.has_other_input"
            @input="
              e => {
                changeOtherInput(e, item);
              }
            "
            v-model:value="otherInputObj.otherInputValue"
            :disabled="otherInputObj.disable"
            :placeholder="otherInputObj.placeholder"
          />
        </template>
        <template v-if="item.component.type.key === 'Radio'">
          <a-radio-group
            name="radioGroup"
            @change="changeRadio"
            v-model:value="defaultValue"
            :disabled="!!item.component.attribute.disable"
          >
            <a-radio :value="radio.key" :key="radio.key" v-for="radio in data_source.enum">
              {{ radio.value }}
            </a-radio>
          </a-radio-group>
          <a-input
            class="otherInput"
            v-if="!!item.component.has_other_input"
            @input="
              e => {
                changeOtherInput(e, item);
              }
            "
            v-model:value="otherInputObj.otherInputValue"
            :disabled="otherInputObj.disable"
            :placeholder="otherInputObj.placeholder"
          />
        </template>
        <template v-if="item.component.type.key === 'Select'">
          <template v-if="!!item.multiple">
            <a-select
              mode="multiple"
              :dropdownMatchSelectWidth="false"
              :dropdownClassName="link_to_subject ? 'noneSelect' : ''"
              :allowClear="true"
              v-model:value="defaultValue"
              :disabled="!!item.component.attribute.disable"
              v-show="item.component.attribute.visible === 0 ? false : true"
              :placeholder="item.component.attribute.placeholder"
              @focus="focusSelect"
              @change="changeSelect"
            >
              <template v-if="data_source">
                <a-select-option
                  :value="option.key"
                  :key="option.key"
                  :subject="option.subject_id"
                  v-for="option in data_source.enum"
                >
                  {{ option.value }}
                </a-select-option>
              </template>
            </a-select>
          </template>
          <template v-else>
            <a-select
              :allowClear="true"
              :dropdownMatchSelectWidth="false"
              v-model:value="defaultValue"
              :dropdownClassName="link_to_subject ? 'noneSelect' : ''"
              :disabled="!!item.component.attribute.disable"
              v-show="item.component.attribute.visible === 0 ? false : true"
              :placeholder="item.component.attribute.placeholder"
              :show-search="item.component.attribute.showSearch === 1 ? true : false"
              @focus="focusSelect"
              @change="changeSelect"
            >
              <template v-if="data_source">
                <a-select-option
                  :value="option.key"
                  :key="option.key"
                  :subject="option.subject_id"
                  v-for="option in data_source.enum"
                >
                  {{ option.value }}
                </a-select-option>
              </template>
            </a-select>
          </template>
          <a-input
            class="otherInput"
            v-if="!!item.component.has_other_input"
            @input="
              e => {
                changeOtherInput(e, item);
              }
            "
            v-model:value="otherInputObj.otherInputValue"
            :disabled="otherInputObj.disable"
          />
        </template>
        <template v-if="item.component.type.key === 'UIMS_Departments'">
          <a-select
            mode="tags"
            :allowClear="true"
            :dropdownMatchSelectWidth="false"
            :disabled="!!item.component.attribute.disable"
            :dropdownClassName="link_to_subject ? 'noneSelect' : ''"
            v-model:value="defaultValue"
            v-show="item.component.attribute.visible === 0 ? false : true"
            :placeholder="item.component.attribute.placeholder"
            @focus="focusSelectTags"
            @change="changeSelectTags"
          >
            <template v-if="data_source">
              <a-select-option
                :value="option.value"
                :key="option.key"
                :subject="option.subject_id"
                v-for="option in data_source.enum"
              >
                {{ option.value }}
              </a-select-option>
            </template>
          </a-select>
        </template>
        <template v-if="item.component.type.key === 'UIMS_Users'">
          <a-select
            mode="tags"
            :dropdownMatchSelectWidth="false"
            :allowClear="true"
            :disabled="!!item.component.attribute.disable"
            :dropdownClassName="link_to_subject ? 'noneSelect' : ''"
            v-model:value="defaultValue"
            v-show="item.component.attribute.visible === 0 ? false : true"
            :placeholder="item.component.attribute.placeholder"
            @focus="focusSelectTags"
            @change="changeSelectTags"
          >
            <template v-if="data_source">
              <a-select-option
                :value="option.value"
                :key="option.key"
                :subject="option.subject_id"
                v-for="option in data_source.enum"
              >
                {{ option.value }}
              </a-select-option>
            </template>
          </a-select>
        </template>
        <template v-if="item.component.type.key === 'SelectTags'">
          <a-select
            mode="tags"
            :dropdownMatchSelectWidth="false"
            :allowClear="true"
            :disabled="!!item.component.attribute.disable"
            :dropdownClassName="link_to_subject ? 'noneSelect' : ''"
            v-model:value="defaultValue"
            v-show="item.component.attribute.visible === 0 ? false : true"
            :placeholder="item.component.attribute.placeholder"
            @focus="focusSelectTags"
            @change="changeSelectTags"
          >
            <template v-if="data_source">
              <a-select-option
                :value="option.value"
                :key="option.key"
                :subject="option.subject_id"
                v-for="option in data_source.enum"
              >
                {{ option.value }}
              </a-select-option>
            </template>
          </a-select>
          <a-input
            class="otherInput"
            v-if="!!item.component.has_other_input"
            @input="
              e => {
                changeOtherInput(e, item);
              }
            "
            v-model:value="otherInputObj.otherInputValue"
            :disabled="otherInputObj.disable"
            :placeholder="otherInputObj.placeholder"
          />
        </template>
        <template v-if="item.component.type.key === 'Tags'">
          <a-select
            mode="tags"
            :dropdownMatchSelectWidth="false"
            :disabled="!!item.component.attribute.disable"
            dropdownClassName="noneSelect"
            v-model:value="defaultValue"
            notFoundContent=""
            v-show="item.component.attribute.visible === 0 ? false : true"
            :placeholder="item.component.attribute.placeholder"
            @focus="focusSelectTags"
            @change="changeSelectTags"
          ></a-select>
        </template>
        <template v-if="item.component.type.key === 'Upload'">
          <a-upload-dragger
            v-model:fileList="fileList"
            :disabled="!!item.component.attribute.disable"
            :multiple="!!item.multiple"
            :before-upload="beforeUpload"
            :customRequest="uploadFileFn"
            @change="changeFile"
          >
            <p class="ant-upload-drag-icon">
              <inbox-outlined></inbox-outlined>
            </p>
            <p class="ant-upload-text">{{ item.component.attribute.placeholder }}</p>
            <p class="ant-upload-text" style="font-size:10px;color:#999">
              请上传{{ item.component.parameter.type }}格式的文件，文件不能小于
              {{ item.component.parameter.min_size }}KB，大于{{
                item.component.parameter.max_size / 1024
              }}M
            </p>
          </a-upload-dragger>
        </template>
        <template v-if="item.component.type.key === 'Uploads'">
          <a-upload-dragger
            v-model:fileList="fileList"
            :disabled="!!item.component.attribute.disable"
            name="file"
            :multiple="!!item.multiple"
            :before-upload="beforeUpload"
            :customRequest="uploadFileFn"
            @change="changeFile"
          >
            <p class="ant-upload-drag-icon">
              <inbox-outlined></inbox-outlined>
            </p>
            <p class="ant-upload-text">{{ item.component.attribute.placeholder }}</p>
            <p class="ant-upload-text" style="font-size:10px;color:#999">
              请上传{{ item.component.parameter.type }}格式的文件，文件不能小于
              {{ item.component.parameter.min_size }}KB，大于{{
                item.component.parameter.max_size / 1024
              }}M
            </p>
          </a-upload-dragger>
        </template>
      </template>
    </a-form-item>
    <a-modal
      v-model:visible="linkToSubjectVisible"
      v-if="linkToSubjectVisible"
      width="800px"
      :title="item.label + '输入'"
    >
      <a-select
        style="display:block; margin-bottom:15px"
        mode="tags"
        :dropdownMatchSelectWidth="false"
        :placeholder="'请输入' + item.label"
        dropdownClassName="noneSelect"
        v-model:value="linkToSubjectValue"
        @change="
          e => {
            inputLinkToSubject(e);
          }
        "
      ></a-select>
      <a-table
        :columns="linkToSubjectColumns"
        :row-key="record => record.job"
        :data-source="linkToSubjectColumnsData"
        :pagination="false"
      >
        <template #isInner="{ record,text }">
          <a-radio-group
            v-model:value="record.linkToSubjectValue"
            @change="
              event => {
                linkToSubjectRadio(event, record);
              }
            "
          >
            <a-radio :value="1" :disabled="!text">院内</a-radio>
            <a-radio :value="2">院外</a-radio>
          </a-radio-group>
        </template>
      </a-table>
      <dl class="tipsBox">
        <dt>提示</dt>
        <dd>
          <p>1,请在输入框输入姓名后，按回车键完成添加；</p>
          <p>2,请在匹配结果中确认添加成员的职务；</p>
        </dd>
      </dl>
      <template #footer>
        <a-button key="back" @click="handleLinkToSubjectCancel">取消</a-button>
        <a-button key="submit" type="primary" @click="handleLinkToSubjectOk">保存</a-button>
      </template>
    </a-modal>
    <!-- 查重 -->
    <duplicate-check
      v-if="duplicateCheckData.visible"
      v-bind="duplicateCheckData"
      @close="duplicateCheckClose"
      @sure="duplicateCheckSure"
    ></duplicate-check>
  </div>
</template>
<script>
import { useStore } from 'vuex';
import { message } from 'ant-design-vue';
import { InboxOutlined } from '@ant-design/icons-vue';
import { defineComponent, computed, ref, watch, reactive } from 'vue';
import { uploadfile, uniqueCheck } from '@/api/form/basic-form';
import { getSubjectsList } from '@/api/subjects/subject';
import rangeDate from './rangeDate.vue';
import moment from 'moment';
import DuplicateCheck from '@/views/researchdata/components/duplicate-check.vue';
moment.suppressDeprecationWarnings = true;
const linkToSubjectColumns = [
  {
    title: '匹配结果',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '院内职务',
    dataIndex: 'job',
    key: 'job',
  },
  {
    title: '身份确认',
    dataIndex: 'isInner',
    key: 'isInner',
    slots: {
      customRender: 'isInner',
    },
  },
];
export default defineComponent({
  name: 'formItem',
  components: {
    InboxOutlined,
    rangeDate,
    DuplicateCheck,
  },
  props: {
    index: {
      type: Number,
      default: -1,
    },
    pathName: {
      type: String,
      default: '',
    },
    category_id: {
      type: String,
      default: '',
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    editId: {
      type: String,
      default: '',
    },
    idx: {
      type: Number,
      default: -1,
    },
    allList: {
      type: Array,
      default: () => [],
    },
    item: {
      type: Object,
      default: () => {},
    },
    formState: {
      type: Object,
      default: () => {},
    },
    labelCol: {
      type: Object,
      default: () => {},
    },
    // 查重时获取的同一父级下的所有统计项
    categoryIds: {
      type: String,
      default: '',
    },
  },
  emits: ['submitItemFn'],
  setup(props, { emit }) {
    let dateString = null; // 需要提交的字符串时间或者时间段
    let submitVal = null; // 需要提交的特殊处理的值
    let isTestOtherValue = false; // 是否走监听默认值触发提交
    const store = useStore();
    const user_select_subject = JSON.parse(localStorage.getItem('user_select_subject'));
    const linkToSubjectVisible = ref(false);
    const linkToSubjectValue = ref([]);
    const duplicateList = ref([]);
    const duplicateCheckValue = ref('');
    const otherInputObj = ref({
      otherInputValue: '',
      disable: true,
    });
    const resourcesData = computed(() => store.getters[`resources/data`]).value;
    const item = ref(props.item).value; // 初始化item到本地
    const link_to_subject = ref(false);
    let linkToSubjectType = ''; // 主体类型
    const data_source = reactive(item.component.data_source);
    const type = item.component.type && item.component.type.key;
    if (type === 'UIMS_Users') {
      linkToSubjectType = 'Faculty';
      link_to_subject.value = true;
    }
    if (type === 'UIMS_Departments') {
      linkToSubjectType = 'Team';
      link_to_subject.value = true;
    }
    const resourceData = data_source && data_source.type && data_source.type.key;
    if (resourceData === 'Resource') {
      data_source['enum'] = resourcesData.resources[data_source.value];
    }
    const enums = data_source && data_source.enum; // 当前组件下拉源数据
    let validateArr = reactive([]);
    // 格式化验证规则事件名称转换
    const triggerFn = data => {
      let str = '';
      if (data && data.key) {
        switch (data.key) {
          case 'OnChange':
            str = 'change';
            break;
          case 'OnBlur':
            str = 'blur';
            break;
          default:
            str = '';
        }
      }
      return str;
    };
    // 统计项唯一校验方法
    const customCheckValidator = async (rule, value) => {
      if (value) {
        const check = await uniqueCheck(props.category_id, {
          field: item.key,
          value: value,
          exclude_item_id: props.editId,
        })
          .then(res => {
            if (res.data.success === 0) {
              return true;
            } else {
              return false;
            }
          })
          .catch(() => {
            return false;
          });
        if (check) {
          return Promise.reject(new Error('校验失败'));
        } else {
          return Promise.resolve();
        }
      }
    };
    // 格式化验证规则
    validateArr = item.component.validation;
    if (validateArr && validateArr.length > 0) {
      validateArr.forEach((once, idx) => {
        if (once.type.key) {
          once.type = once.type.key.toLowerCase();
          once.trigger = triggerFn(item.component.trigger);
          if (once.type === 'required') {
            once['required'] = Boolean(once.value);
          } else if (once.type === 'length') {
            once.type = 'array';
            if (idx !== 0) {
              validateArr[0].type = 'array';
            }
          } else if (once.type === 'pattern') {
            once['pattern'] = RegExp(once.value);
          } else if (once.type === 'in') {
            once.type = 'number';
          } else if (once.type === 'unique') {
            once.type = 'any';
            once.validator = customCheckValidator;
          } else {
            once.type = 'any';
          }
        }
      });
    }
    const itemKey = item.key; // 组件关键字
    const fileList = ref([]); // 文件上传列表
    const defaultValue = ref(item.default); // 初始化默认值到本地
    let $target = {};
    const key = item.component.type && item.component.type.key; // 组件类型
    const skip = item.component.skip; // 组件是否对父级可见

    const isOpen = ref(false);

    const getValue = e => {
      defaultValue.value = e;
    };
    /*
     *  setOtherInputData
     * 对has_other_input字段特殊处理，因为选择其他的时候，选择框提交的值为空，所以这里单独定义内部字段来处理输入框
     * data： 当前选择器选择的value
     * return: true | false
     *  true: 选择了其他，选择框不往下执行另外的步骤
     *  false: 未选择其他，选择框继续执行另外的步骤
     */
    const setOtherInputData = data => {
      if (item.component.has_other_input) {
        isTestOtherValue = true;
        if (data === '' || data === '其他') {
          otherInputObj.value.disable = false;
          emit('submitItemFn', {
            key: itemKey,
            otherKey: '_' + itemKey,
            value: data,
            isOtherValue: true,
            otherValue: '其他',
            index: props.index,
            isSkip: skip,
            idx: props.idx,
          });
          setTimeout(() => {
            isTestOtherValue = false;
          }, 0);
          return true;
        } else {
          otherInputObj.value.disable = true;
          otherInputObj.value.otherInputValue = '';
          emit('submitItemFn', {
            key: itemKey,
            value: defaultValue.value,
            otherKey: '_' + itemKey,
            otherValue: '',
            index: props.index,
            idx: props.idx,
            isSkip: skip,
          });
          setTimeout(() => {
            isTestOtherValue = false;
          }, 0);

          return false;
        }
      }
    };

    const changeOtherInput = () => {
      emit('submitItemFn', {
        key: itemKey,
        value: otherInputObj.value.otherInputValue,
        isOtherInput: true,
        otherKey: '_' + itemKey,
        otherValue: '其他',
        isSkip: skip,
        index: props.index,
        idx: props.idx,
      });
    };
    /*
     *  isOtherTest
     * 联动规则是否选择其他检测
     * conditionData： 联动规则
     * item： 联动规则每一项
     * return: true | false
     *  true: 联动规则运行正确，即符合联动规则条件
     *  false: 反之
     */
    const isOtherTest = (conditionData, item) => {
      if (!conditionData) return false; // 如果没有验证规则
      const isOtherKey = conditionData.indexOf('其他');
      let isValue = false;
      // 如果监听的是是否为“其他”这个选项， 特殊情况，因为其他字段的值为‘’，所以使用自定义字段变相监听
      if (isOtherKey > -1) {
        isValue = eval(
          conditionData.replace('$target.value ', "'" + props.formState['_' + item.target] + "'"),
        );
      } else {
        if (conditionData.indexOf('$target.value') > -1) {
          isValue = eval(conditionData.replace('$target.value ', "'" + $target.value + "'"));
        } else {
          isValue = eval(conditionData);
        }
      }
      return isValue;
    };

    /*
     *  obj
     * 联动方法
     * dataName： 联动目标字段key
     * return: {} 联动目标各种key和value
     */
    const obj = dataName => {
      let targetObj = props.allList.filter(item => {
        return item.key === dataName;
      })[0];
      if (dataName === 'outer_year') {
        dataName = 'relationInfoYear';
      }
      if (dataName === 'project_member') {
        dataName = 'project_author';
      }
      if (dataName === 'project_author') {
        targetObj = {};
        targetObj.disable = true;
        targetObj.visible = true;
      } else if (dataName === 'relationInfoYear') {
        targetObj = {};
        targetObj.disable = true;
        targetObj.visible = true;
      } else {
        if (targetObj.component.attribute && targetObj.component.attribute.disable) {
          targetObj.disable = targetObj.component.attribute.disable;
        }
        if (targetObj.component.attribute && targetObj.component.attribute.visible) {
          targetObj.visible = targetObj.component.attribute.visible;
        }
      }
      targetObj.value = props.formState[dataName];

      return targetObj;
    };
    /*
     *  getDefaultValue
     * 对默认值进行类型处理及格式化
     * val： 默认值
     *
     */

    const linkages = item.component.linkages;
    const getDefaultValue = (val, isEditValue) => {
      if (key === 'citation') {
        console.log(val, key, 7777);
      }
      if (key === 'RangeDate') {
        defaultValue.value = val;
        return;
      }
      // 如果有联动规则，则执行
      if (linkages && linkages.length && isEditValue) {
        setTimeout(() => {
          // 遍历联动规则
          linkages.forEach(linkage => {
            // 获取符合联动规则的联动属性列表
            const schemaObj = linkage.schema;
            let serveData = '';
            // 监控值类型
            if (linkage.type.key === 'Value' || linkage.type === 'Value') {
              if (linkage.target === 'outer_year') {
                linkage.target = 'relationInfoYear';
              }
              const n = props.formState[linkage.target];
              if (!n || n === '其他') {
                defaultValue.value = val;
                return;
              }
              if (n !== '其他' && props.formState['_' + linkage.target] === '其他') {
                defaultValue.value = val;
                return;
              }
              if (Array.isArray(n) && !n.length) {
                defaultValue.value = val;
                return;
              }
              $target = obj(linkage.target);
              $target.value = n;
              const conditionData = linkage.condition.replace(/{{ | }}/gi, '');
              if (isOtherTest(conditionData, linkage)) {
                for (const key in schemaObj) {
                  switch (key) {
                    case 'value':
                      serveData = linkage.schema.value;
                      if (/{{ | }}/gi.test(serveData)) {
                        serveData = serveData.replace(/{{ | (}}|}}\.)$/gi, '');
                        if (serveData.indexOf('citation') > -1) {
                          eval(serveData);
                          return;
                        }
                        // 如果是数据源联动, 需要获取options变量
                        const options = {};
                        let linkObj = {};
                        props.allList.forEach(list => {
                          if (list.key === linkage.target) {
                            linkObj = list;
                          }
                        });
                        if (linkObj.component) {
                          const data_source = linkObj.component.data_source;
                          const type = data_source && data_source.type && data_source.type.key;
                          if (type === 'Resource') {
                            data_source['enum'] = resourcesData.resources[data_source.value];
                          }
                          if (data_source && data_source['enum'].length > 0) {
                            data_source['enum'].forEach(enumItem => {
                              options[enumItem.value] = enumItem;
                            });
                          }
                        }
                        defaultValue.value = eval(serveData);
                      } else {
                        defaultValue.value = serveData;
                      }
                      emit('submitItemFn', {
                        key: itemKey,
                        value: defaultValue.value,
                        index: props.index,
                        idx: props.idx,
                      });
                      isTestOtherValue = true;
                      setTimeout(() => {
                        isTestOtherValue = false;
                      }, 0);
                      break;
                    case 'disable':
                      serveData = linkage.schema.disable;
                      if (/{{ | }}/gi.test(serveData)) {
                        serveData = serveData.replace(/{{ | }}/gi, '');
                        emit('submitItemFn', {
                          key: itemKey,
                          value: isOtherTest(serveData, linkage),
                          index: props.index,
                          idx: props.idx,
                          isDisable: true,
                        });
                        isTestOtherValue = true;
                      } else {
                        emit('submitItemFn', {
                          key: itemKey,
                          value: eval(serveData),
                          index: props.index,
                          idx: props.idx,
                          isDisable: true,
                        });
                        isTestOtherValue = true;
                      }

                      setTimeout(() => {
                        isTestOtherValue = false;
                      }, 0);
                      break;
                    case 'visible':
                      serveData = linkage.schema.visible;
                      if (/{{ | }}/gi.test(serveData)) {
                        serveData = serveData.replace(/{{ | }}/gi, '');
                        emit('submitItemFn', {
                          key: itemKey,
                          value: isOtherTest(serveData, linkage),
                          index: props.index,
                          idx: props.idx,
                          isVisible: true,
                        });
                        isTestOtherValue = true;
                      } else {
                        emit('submitItemFn', {
                          key: itemKey,
                          value: eval(serveData),
                          index: props.index,
                          idx: props.idx,
                          isVisible: true,
                        });
                        isTestOtherValue = true;
                      }

                      setTimeout(() => {
                        isTestOtherValue = false;
                      }, 0);
                      break;
                    case 'class':
                      serveData = linkage.schema.class;
                      if (/{{ | }}/gi.test(serveData)) {
                        serveData = serveData.replace(/{{ | }}/gi, '');
                        emit('submitItemFn', {
                          key: itemKey,
                          value: isOtherTest(serveData, linkage),
                          index: props.index,
                          idx: props.idx,
                          isClass: true,
                        });
                        isTestOtherValue = true;
                      } else {
                        emit('submitItemFn', {
                          key: itemKey,
                          value: eval(serveData),
                          index: props.index,
                          idx: props.idx,
                          isClass: true,
                        });
                        isTestOtherValue = true;
                      }

                      setTimeout(() => {
                        isTestOtherValue = false;
                      }, 0);
                      break;
                    case 'enum':
                      serveData = linkage.schema.enum;
                      if (/{{ | }}/gi.test(serveData)) {
                        serveData = serveData.replace(/{{ | }}/gi, '');
                        data_source.enum = eval(serveData);
                        const isExistEnum = data_source.enum.some(k => {
                          return k.key === defaultValue.value;
                        });
                        if (!isExistEnum) {
                          emit('submitItemFn', {
                            key: itemKey,
                            value: data_source.enum[0].key,
                            index: props.index,
                            idx: props.idx,
                            notTest: true,
                          });
                        }
                      }
                      setTimeout(() => {
                        isTestOtherValue = false;
                      }, 0);
                      break;
                    default:
                      console.error('没有找到相关key值');
                  }
                }
              }
            }
          });
        }, 0);
        return;
      } else {
        defaultValue.value = val;
      }
      if (key) {
        if (key === 'UIMS_Users' || key === 'UIMS_Departments') {
          if (!item.multiple && val) {
            defaultValue.value = [val.value];
          } else {
            defaultValue.value = [];
          }
        }
        if (key === 'Cascader') {
          if (Array.isArray(val)) {
            defaultValue.value = val;
          } else {
            if (val) {
              const formatStr = item.component.formatter.split_str;
              defaultValue.value = val.split(formatStr);
            } else {
              defaultValue.value = [];
            }
          }
          const list = data_source && data_source['list'];
          if (data_source) {
            let num = 0;
            const testFn = (arr, value) => {
              const isTest = arr.filter(item => {
                return item.value === value;
              });
              if (isTest.length > 0) {
                defaultValue.value[num] = value;
                num += 1;
                if (num < defaultValue.value.length) {
                  testFn(isTest[0].chlidren, defaultValue.value[num]);
                }
              }
              if (num === 0 && isTest.length === 0) {
                defaultValue.value = [];
                emit('submitItemFn', {
                  key: itemKey,
                  value: null,
                  index: props.index,
                  idx: props.idx,
                  isSkip: skip,
                });
              }
            };
            testFn(list, defaultValue.value[num]);
          } else {
            defaultValue.value = [];
            emit('submitItemFn', {
              key: itemKey,
              value: null,
              index: props.index,
              idx: props.idx,
              isSkip: skip,
            });
            return;
          }
          return;
        }
        if (key === 'Upload' || key === 'Uploads') {
          if (!val) {
            fileList.value = [];
          } else {
            let fileArr = [];
            if (Array.isArray(val)) {
              fileArr = val;
            } else {
              fileArr = val.split(',');
            }

            for (let i = 0; i < fileArr.length; i++) {
              const resStr = fileArr[i];
              fileList.value[i] = {};
              fileList.value[i]['name'] = resStr.substring(
                resStr.lastIndexOf('com/') + 4,
                resStr.length,
              );
              fileList.value[i]['response'] = resStr;
              fileList.value[i]['uid'] = resStr;
            }
          }
          return;
        }
        if (key === 'DatePicker') {
          let value = null;
          const reg = validateArr.filter(item => {
            return item.type === 'pattern';
          })[0].pattern;
          if (reg.test(val)) {
            value = String(val);
          }
          defaultValue.value = value;
          return;
        }
        if (key === 'DateRangePicker') {
          const formatValue = item.component.parameter.formatter;
          const reg = validateArr.filter(item => {
            return item.type === 'pattern';
          })[0].pattern;
          if (reg.test(val)) {
            const dateRangeArr = val.split(' - ');
            const val1 = dateRangeArr[0] ? moment(dateRangeArr[0], formatValue) : null;
            const val2 = dateRangeArr[1] ? moment(dateRangeArr[1], formatValue) : null;
            defaultValue.value = [val1, val2];
          } else {
            defaultValue.value = [];
          }
          return;
        }
        if (item.multiple || key === 'SelectTags' || key === 'Tags') {
          if (val) {
            const valueType = Object.prototype.toString.call(val);
            let splitStr = '';
            switch (valueType) {
              case '[object Array]':
                defaultValue.value = val.map(item => {
                  return item.value || item;
                });
                break;
              case '[object Object]':
                defaultValue.value = [val.value];
                break;
              case '[object String]':
                splitStr = item.component.formatter && item.component.formatter.split_str;
                if (splitStr) {
                  defaultValue.value = val.split(splitStr);
                }
                break;
              default:
                console.log(`未处理默认值类型，${valueType}`);
            }
          } else {
            defaultValue.value = [];
          }
        }
        if (data_source && data_source['enum']) {
          // 获取当前组件是否有其他输入框
          const has_other_input = item.component.has_other_input;
          // 如果选择的值只是字符串类型
          if (!Array.isArray(defaultValue.value)) {
            // 判断选择的值是否包含在备选项里
            const isSelectOther = data_source['enum'].some(enumItem => {
              return enumItem.key === defaultValue.value;
            });
            // 如果在备选项里
            if (isSelectOther) {
              // console.log(defaultValue.value, key, '正常单选选择的值');
            } else {
              // 如果不在备选项里
              // 是否有其他输入框，如果有，并且值类型为string,则执行其他输入逻辑
              if (has_other_input && typeof defaultValue.value === 'string') {
                otherInputObj.value.otherInputValue = val;
                defaultValue.value = '其他';
                setOtherInputData('其他');
                setTimeout(() => {
                  changeOtherInput();
                }, 0);
              } else {
                // 如果没有，则说明这个值非法，默认值置为空
                defaultValue.value = null;
              }
            }
            return;
          }
          defaultValue.value.forEach((value, index) => {
            // 判断选择的值是否包含在备选项里
            const isSelectOther = data_source['enum'].some(item => {
              return item.value === value || item.key === value;
            });
            // 如果在备选项里
            if (isSelectOther) {
              // console.log(value, key, '正常多选选择的值');
            } else {
              // 如果不在备选项里
              // 是否有其他输入框，如果有，则执行其他输入逻辑
              if (has_other_input) {
                otherInputObj.value.otherInputValue = value;
                defaultValue.value = '其他';
                setOtherInputData('其他');
                setTimeout(() => {
                  changeOtherInput();
                }, 0);
              } else {
                // 如果没有，则说明这个值非法，移除这项值
                defaultValue.value.splice(index, 1);
              }
            }
          });
        }
        if (isEditValue) {
          const linkages = item.component.linkages;
          if (linkages) {
            setTimeout(() => {
              emit('submitItemFn', {
                key: itemKey,
                value: val,
                index: props.index,
                idx: props.idx,
                isSkip: skip,
              });
              defaultValue.value = val;
            }, 0);
          }
        }
      }
    };
    // 查重浮层数据
    const duplicateCheckData = reactive({
      visible: false,
      id: '',
      title: '',
      categoryIds: '',
      source: 'field',
    });
    const showDuplicateCheckModal = () => {
      duplicateCheckData.title = defaultValue.value;
      duplicateCheckData.visible = true;
      duplicateCheckData.id = props.isEdit ? props.editId : '';
      duplicateCheckData.categoryIds = props.categoryIds;
    };
    // 查重弹层关闭
    const duplicateCheckClose = () => {
      duplicateCheckData.visible = false;
    };
    // 查重弹层确认
    const duplicateCheckSure = data => {
      emit('submitItemFn', {
        key: itemKey,
        value: data,
        index: props.index,
        isDuplicate: true,
        idx: props.idx,
        isSkip: skip,
      });
      duplicateCheckClose();
    };
    // 关联信息关联主体数据获取
    const linkToSubjectColumnsData = ref([]);
    const linkToSubjectRadio = (e, data) => {
      if (data.linkToSubjectValue === 2) {
        data.job = '';
        data.subject_id = '';
        data.key = 0;
      } else {
        data.job = data._job;
        data.subject_id = data._subjectId;
        data.key = data._key;
      }
    };

    const handleLinkToSubjectCancel = () => {
      linkToSubjectVisible.value = false;
    };
    const handleLinkToSubjectOk = () => {
      let arr = linkToSubjectColumnsData.value.map(item => {
        return {
          id: item.key || 0,
          value: item.value,
          subjectId: item.subject_id,
        };
      });
      if (!item.multiple) {
        arr = { ...arr[0] };
      }

      emit('submitItemFn', {
        key: itemKey,
        value: arr,
        index: props.index,
        idx: props.idx,
        isSkip: skip,
        option: arr.map(item => {
          return item.value;
        }),
        link_to_subject: link_to_subject.value,
      });
      handleLinkToSubjectCancel();
    };
    const inputLinkToSubject = (value, isChangeWrap) => {
      const isQuest = value;
      linkToSubjectValue.value = value;

      if (isQuest.length === 0) {
        linkToSubjectColumnsData.value = [];
        return;
      }
      const maxLen = item.component.attribute.maxlength;
      if (!item.multiple && isQuest.length > 1) {
        isQuest.splice(isQuest.length - 1, 1);
        message.info(`${item.label}只允许添加一个`);
        return;
      }
      if (maxLen && isQuest.length > maxLen) {
        isQuest.splice(isQuest.length - 1, 1);
        message.info(`${item.label}超出允许添加总数`);
        return;
      }
      const questObj = {
        filter: JSON.stringify([
          {
            value: isQuest,
            field: 'name',
            op: 'In',
          },
        ]),
        type: linkToSubjectType,
      };
      getSubjectsList(questObj).then(res => {
        const list = res.data.list;
        linkToSubjectColumnsData.value = [];
        isQuest.forEach(item => {
          const obj = {
            name: item,
            value: item,
            key: 0,
            _key: 0,
            job: '',
            _job: '',
            subject_id: '',
            _subjectId: '',
            isInner: false,
            linkToSubjectValue: 2,
          };
          const filterArr = list.filter(data => {
            return data.name === item;
          });
          if (filterArr.length > 0) {
            const data = filterArr[0].info;
            let str = '';
            if (linkToSubjectType === 'Faculty') {
              str += data.department.value + ':' + data.position.value;
              if (data.title && data.title.value) {
                str += '(' + data.title.value + ')';
              }
            } else {
              if (data.parent) {
                str += data.parent.value;
              }
              if (data.director) {
                str += ' ' + data.director;
              }
              if (data.assistant) {
                str += ' ' + data.assistant;
              }
              if (data.deputy_director) {
                str += ' ' + data.deputy_director;
              }
            }

            obj.job = str;
            obj._job = str;
            obj.key = list[0].uims_id;
            obj._key = list[0].uims_id;
            obj.subject_id = list[0].id;
            obj._subjectId = list[0].id;
            obj.isInner = true;
            obj.linkToSubjectValue = 1;
          }
          linkToSubjectColumnsData.value.push(obj);
        });
        if (isChangeWrap) {
          handleLinkToSubjectOk();
        }
      });
    };
    const showLinkToSubjectModal = () => {
      linkToSubjectValue.value = [...defaultValue.value];
      inputLinkToSubject(linkToSubjectValue.value);
      linkToSubjectVisible.value = true;
    };
    // 级联事件监听
    const changeCascader = value => {
      const muliple = item.multiple;
      const formatStr = item.component.formatter.split_str;
      if (!muliple) {
        // defaultValue.value = value.join(formatStr);
        submitVal = value.join(formatStr);
      }
    };
    // 级联组件选择后展示的渲染函数
    const displayRender = ({ labels }) => {
      return labels[labels.length - 1];
    };
    // 联动规则，中文拼接
    const citation_cn = (...args) => {
      emit('submitItemFn', {
        key: itemKey,
        isCn: true,
        value: item.default,
        fnArgs: args,
        index: props.index,
        idx: props.idx,
        isSkip: skip,
      });
    };
    // 联动规则，英文拼接
    const citation_en = (...args) => {
      emit('submitItemFn', {
        key: itemKey,
        value: item.default,
        fnArgs: args,
        index: props.index,
        idx: props.idx,
        isSkip: skip,
      });
    };

    // 如果有联动规则，则执行
    if (linkages && linkages.length) {
      // 遍历联动规则
      linkages.forEach(linkage => {
        // 获取联动规则每条的限制条件
        const conditionData = linkage.condition.replace(/{{ | }}/gi, '');
        // 获取符合联动规则的联动属性列表
        const schemaObj = linkage.schema;
        // 获取不符合联动规则的联动属性列表
        const otherwiseObj = linkage.otherwise;
        let serveData = '';
        // 监控值类型
        if (linkage.type.key === 'Value' || linkage.type === 'Value') {
          if (linkage.target === 'outer_year') {
            linkage.target = 'relationInfoYear';
          }
          watch(
            // 观察联动对象的值
            [() => props.formState[linkage.target], () => props.formState['_' + linkage.target]],
            ([n, _n], [o, _o]) => {
              console.log(n, _n, o, _o, 333333);
              // if (!n && _n !== '其他') return;
              // if (_n) return;
              if (Array.isArray(n) && !n.length) return;
              $target = obj(linkage.target);
              $target.value = n;
              if (isOtherTest(conditionData, linkage)) {
                for (const key in schemaObj) {
                  switch (key) {
                    case 'value':
                      serveData = linkage.schema.value;
                      if (/{{ | }}/gi.test(serveData)) {
                        serveData = serveData.replace(/{{ | }}/gi, '');
                        if (serveData.indexOf('citation') > -1) {
                          eval(serveData);
                          return;
                        }
                        // 如果是数据源联动, 需要获取options变量
                        const options = {};
                        let linkObj = {};
                        props.allList.forEach(list => {
                          if (list.key === linkage.target) {
                            linkObj = list;
                          }
                        });
                        if (linkObj.component) {
                          const data_source = linkObj.component.data_source;
                          const type = data_source && data_source.type && data_source.type.key;
                          if (type === 'Resource') {
                            data_source['enum'] = resourcesData.resources[data_source.value];
                          }
                          if (data_source && data_source['enum'].length > 0) {
                            data_source['enum'].forEach(enumItem => {
                              options[enumItem.value] = enumItem;
                            });
                          }
                        }
                        emit('submitItemFn', {
                          key: itemKey,
                          value: eval(serveData),
                          index: props.index,
                          idx: props.idx,
                          isSkip: skip,
                        });
                        isTestOtherValue = true;
                      } else {
                        emit('submitItemFn', {
                          key: itemKey,
                          value: serveData,
                          index: props.index,
                          idx: props.idx,
                          isSkip: skip,
                        });
                        isTestOtherValue = true;
                      }

                      setTimeout(() => {
                        isTestOtherValue = false;
                      }, 0);
                      break;
                    case 'disable':
                      serveData = linkage.schema.disable;
                      if (/{{ | }}/gi.test(serveData)) {
                        serveData = serveData.replace(/{{ | }}/gi, '');
                        emit('submitItemFn', {
                          key: itemKey,
                          value: isOtherTest(serveData, linkage),
                          index: props.index,
                          idx: props.idx,
                          isDisable: true,
                        });
                        isTestOtherValue = true;
                      } else {
                        emit('submitItemFn', {
                          key: itemKey,
                          value: eval(serveData),
                          index: props.index,
                          idx: props.idx,
                          isDisable: true,
                        });
                        isTestOtherValue = true;
                      }

                      setTimeout(() => {
                        isTestOtherValue = false;
                      }, 0);
                      break;
                    case 'visible':
                      serveData = linkage.schema.visible;
                      if (/{{ | }}/gi.test(serveData)) {
                        serveData = serveData.replace(/{{ | }}/gi, '');
                        emit('submitItemFn', {
                          key: itemKey,
                          value: isOtherTest(serveData, linkage),
                          index: props.index,
                          idx: props.idx,
                          isVisible: true,
                        });
                        isTestOtherValue = true;
                      } else {
                        emit('submitItemFn', {
                          key: itemKey,
                          value: eval(serveData),
                          index: props.index,
                          idx: props.idx,
                          isVisible: true,
                        });
                        isTestOtherValue = true;
                      }

                      setTimeout(() => {
                        isTestOtherValue = false;
                      }, 0);
                      break;
                    case 'class':
                      serveData = linkage.schema.class;
                      if (/{{ | }}/gi.test(serveData)) {
                        serveData = serveData.replace(/{{ | }}/gi, '');
                        emit('submitItemFn', {
                          key: itemKey,
                          value: isOtherTest(serveData, linkage),
                          index: props.index,
                          idx: props.idx,
                          isClass: true,
                        });
                        isTestOtherValue = true;
                      } else {
                        emit('submitItemFn', {
                          key: itemKey,
                          value: eval(serveData),
                          index: props.index,
                          idx: props.idx,
                          isClass: true,
                        });
                        isTestOtherValue = true;
                      }

                      setTimeout(() => {
                        isTestOtherValue = false;
                      }, 0);
                      break;
                    case 'enum':
                      serveData = linkage.schema.enum;
                      if (/{{ | }}/gi.test(serveData)) {
                        serveData = serveData.replace(/{{ | }}/gi, '');
                        data_source.enum = eval(serveData);
                        emit('submitItemFn', {
                          key: itemKey,
                          value: data_source.enum[0].key,
                          index: props.index,
                          idx: props.idx,
                          notTest: true,
                        });
                      }
                      setTimeout(() => {
                        isTestOtherValue = false;
                      }, 0);
                      break;
                    default:
                      console.error('没有找到相关key值');
                  }
                }
              } else {
                for (const key in otherwiseObj) {
                  switch (key) {
                    case 'value':
                      serveData = linkage.otherwise.value;
                      if (/{{ | }}/gi.test(serveData)) {
                        serveData = serveData.replace(/{{ | }}/gi, '');
                        if (serveData.indexOf('citation') > -1) {
                          eval(serveData);
                          return;
                        }
                        // 如果是数据源联动, 需要获取options变量
                        const options = {};
                        let linkObj = {};
                        props.allList.forEach(list => {
                          if (list.key === linkage.target) {
                            linkObj = list;
                          }
                        });
                        if (linkObj.component) {
                          const data_source = linkObj.component.data_source;
                          const type = data_source && data_source.type && data_source.type.key;
                          if (type === 'Resource') {
                            data_source['enum'] = resourcesData.resources[data_source.value];
                          }
                          if (data_source && data_source['enum'].length > 0) {
                            data_source['enum'].forEach(enumItem => {
                              options[enumItem.value] = enumItem;
                            });
                          }
                        }
                        emit('submitItemFn', {
                          key: itemKey,
                          value: eval(serveData),
                          index: props.index,
                          idx: props.idx,
                          isSkip: skip,
                        });
                      } else {
                        emit('submitItemFn', {
                          key: itemKey,
                          value: serveData,
                          index: props.index,
                          idx: props.idx,
                          isSkip: skip,
                        });
                        isTestOtherValue = true;
                      }

                      setTimeout(() => {
                        isTestOtherValue = false;
                      }, 0);
                      break;
                    case 'disable':
                      serveData = linkage.otherwise.disable;
                      if (/{{ | }}/gi.test(serveData)) {
                        serveData = serveData.replace(/{{ | }}/gi, '');
                        emit('submitItemFn', {
                          key: itemKey,
                          value: isOtherTest(serveData, linkage),
                          index: props.index,
                          idx: props.idx,
                          isDisable: true,
                        });
                        isTestOtherValue = true;
                      } else {
                        emit('submitItemFn', {
                          key: itemKey,
                          value: eval(serveData),
                          index: props.index,
                          idx: props.idx,
                          isDisable: true,
                        });
                        isTestOtherValue = true;
                      }

                      setTimeout(() => {
                        isTestOtherValue = false;
                      }, 0);
                      break;
                    case 'visible':
                      serveData = linkage.otherwise.visible;
                      if (/{{ | }}/gi.test(serveData)) {
                        serveData = serveData.replace(/{{ | }}/gi, '');
                        emit('submitItemFn', {
                          key: itemKey,
                          value: isOtherTest(serveData, linkage),
                          index: props.index,
                          idx: props.idx,
                          isVisible: true,
                        });
                        isTestOtherValue = true;
                      } else {
                        emit('submitItemFn', {
                          key: itemKey,
                          value: eval(serveData),
                          index: props.index,
                          idx: props.idx,
                          isVisible: true,
                        });
                        isTestOtherValue = true;
                      }

                      setTimeout(() => {
                        isTestOtherValue = false;
                      }, 0);
                      break;
                    case 'class':
                      serveData = linkage.otherwise.class;
                      if (/{{ | }}/gi.test(serveData)) {
                        serveData = serveData.replace(/{{ | }}/gi, '');
                        emit('submitItemFn', {
                          key: itemKey,
                          value: isOtherTest(serveData, linkage),
                          index: props.index,
                          idx: props.idx,
                          isClass: true,
                        });
                        isTestOtherValue = true;
                      } else {
                        emit('submitItemFn', {
                          key: itemKey,
                          value: eval(serveData),
                          index: props.index,
                          idx: props.idx,
                          isClass: true,
                        });
                        isTestOtherValue = true;
                      }

                      setTimeout(() => {
                        isTestOtherValue = false;
                      }, 0);
                      break;
                    default:
                      console.error('没有找到相关key值');
                  }
                }
              }
            },
            {
              deep: true,
            },
          );
        }
      });
    }
    if (itemKey === 'citation') {
      // console.log(defaultValue.value, itemKey, 88888);
    }
    getDefaultValue(defaultValue.value, true);

    // 监听默认值的变化，因为默认值来源于父组件，子组件的修改也是通过修改父组件的默认值实现，所以实时监听并赋值到子组件的默认值
    watch(
      () => props.item.default,
      n => {
        getDefaultValue(n);
      },
    );
    // 上传文件前的验证
    const beforeUpload = file => {
      const fileType = file.name.substring(file.name.lastIndexOf('.'), file.name.length);
      const testData = item.component.parameter;
      if (!props.item.multiple && fileList.value.length >= 1) {
        setTimeout(() => {
          message.error(`只允许上传一个文件!`);
          fileList.value = fileList.value.slice(0, fileList.value.length - 1);
        }, 0);
        return false;
      }
      if (!(testData && testData.type)) return true;
      const isFormaterType = testData.type.some(item => {
        return fileType === item;
      });
      if (!isFormaterType) {
        setTimeout(() => {
          message.error(`只能上传${testData.type.join(',')}格式的文件!`);
          fileList.value = fileList.value.slice(0, fileList.value.length - 1);
        }, 0);
        return false;
      }
      const fileSize = file.size / 1024;
      const isLt = fileSize > testData.min_size && fileSize < testData.max_size;

      if (!isLt) {
        setTimeout(() => {
          message.error('超出了文件大小限制，请修改后再上传!');
          fileList.value = fileList.value.slice(0, fileList.value.length - 1);
        }, 0);
        return false;
      }
      return true;
    };
    // 文件上传
    const uploadFileFn = data => {
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('path', `/${user_select_subject.name}/${props.pathName}`);
      uploadfile(formData)
        .then(res => {
          data.onSuccess(res.data.url);
        })
        .catch(err => {
          data.onError();
          console.log(err);
        });
    };
    // 文件上传变化事件
    const changeFile = info => {
      const status = info.file.status;

      if (status === 'done') {
        let value = [];
        for (let i = 0; i < info.fileList.length; i++) {
          const resStr = info.fileList[i].response;
          info.fileList[i].name = resStr.substring(resStr.lastIndexOf('com/') + 4, resStr.length);
          value.push(info.fileList[i].response);
        }
        if (!props.item.multiple) {
          value = value.join(',');
        }
        emit('submitItemFn', {
          key: itemKey,
          value: value,
          index: props.index,
          idx: props.idx,
          isSkip: skip,
        });
        message.success(`${info.file.name} 上传成功.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} 上传失败.`);
      }
    };
    const focusInput = () => {
      // if (item.duplicate_check) {
      //   showDuplicateCheckModal();
      // }
    };
    const blurInput = () => {
      // if (item.duplicate_check) {
      //   showDuplicateCheckModal();
      // }
    };
    // Select组件的聚焦事件，用来获取下拉源数据
    const focusSelect = () => {
      if (link_to_subject.value) {
        showLinkToSubjectModal();
      }
    };
    // SelectTags组件的聚焦事件，用来获取下拉源数据
    const focusSelectTags = () => {
      if (link_to_subject.value) {
        showLinkToSubjectModal();
      }
    };
    const changeSelectTags = (value, option) => {
      // 如果是uims类型的数据，直接运行弹窗逻辑
      if (link_to_subject.value) {
        inputLinkToSubject(value, true);
        return;
      }
      const type = item.type.key; // 当前组件提交值的类型， String = '文本' Number = '数字' Boolean = '布尔值' Object = '对象'
      const multiple = item.multiple; // 当前组件提交值是否为Array
      const maxLen = item.component.attribute.maxlength; // 当前组件提交值的最大个数
      // 如果组件提交的值有最大个数限制，并且用户添加的个数已经超过最大限制，则移除最后一个，并提示用户
      if (maxLen && value.length > maxLen) {
        value.splice(value.length - 1, 1);
        option.splice(value.length - 1, 1);
        message.info(`${item.label}超出允许添加总数`);
        return;
      }
      submitVal = value;
      switch (type) {
        case 'String':
          // console.log('要求数组每一项为String类型', submitVal);
          if (!multiple) {
            const joinStr = item.component.formatter.split_str;
            submitVal = submitVal.join(joinStr);
          }
          break;
        case 'Number':
          submitVal = value.map(item => {
            if (item) {
              return Number(item);
            } else {
              return null;
            }
          });
          // console.log('要求数组每一项为Number类型', submitVal);

          break;
        case 'Boolean':
          submitVal = value.map(item => {
            return Boolean(item);
          });
          // console.log('要求数组每一项为Boolean类型', submitVal);

          break;
        case 'Object':
          submitVal = [];
          // 如果有下拉菜单，则获取选择的那一项数据作为提交对象
          if (enums) {
            enums.forEach(item => {
              value.forEach(val => {
                if (item.value === val) {
                  submitVal.push(item);
                }
              });
            });
          } else {
            submitVal = value.map(item => {
              return {
                value: item,
              };
            });
          }
          // console.log('要求为Object类型,目前为父子组件才是这个类型，父组件有方法处理', submitVal);

          break;
        default:
          console.log('要求数组每一项类型为', type, '未特殊处理');
      }
    };
    const changeSelect = (value, option) => {
      if (typeof value === 'undefined') return;
      if (link_to_subject.value) {
        inputLinkToSubject(value, true);
        return;
      }
      const type = item.type.key;
      const maxLen = item.component.attribute.maxlength;
      const isOther = setOtherInputData(value);
      const multiple = item.multiple; // 当前组件提交值是否为Array
      if (isOther) return;

      submitVal = value;
      if (Array.isArray(value)) {
        if (maxLen && value.length > maxLen) {
          value.splice(value.length - 1, 1);
          option.splice(value.length - 1, 1);
          message.info(`${item.label}超出允许添加总数`);
          return;
        }
        switch (type) {
          case 'String':
            // console.log('要求数组每一项为String类型', submitVal);
            if (!multiple) {
              const joinStr = item.component.formatter.split_str;
              submitVal = submitVal.join(joinStr);
            }
            break;
          case 'Number':
            submitVal = value.map(item => {
              if (item) {
                return Number(item);
              } else {
                return null;
              }
            });
            // console.log('要求数组每一项为Number类型', submitVal);

            break;
          case 'Boolean':
            submitVal = value.map(item => {
              return Boolean(item);
            });
            // console.log('要求数组每一项为Boolean类型', submitVal);

            break;
          case 'Object':
            submitVal = [];
            // 如果有下拉菜单，则获取选择的那一项数据作为提交对象
            if (enums) {
              enums.forEach(item => {
                value.forEach(val => {
                  if (item.value === val) {
                    submitVal.push(item);
                  }
                });
              });
            } else {
              submitVal = value.map(item => {
                return {
                  value: item,
                };
              });
            }
            // console.log('要求为Object类型,目前为父子组件才是这个类型，父组件有方法处理', submitVal);

            break;
          default:
            console.log('要求数组每一项类型为', type, '未特殊处理');
        }
      }
    };
    const changeRadio = () => {
      // console.log(e.target.value, defaultValue.value, 88777);
    };
    const changeCheckbox = value => {
      const type = item.type.key; // 当前组件提交值的类型， String = '文本' Number = '数字' Boolean = '布尔值' Object = '对象'
      const multiple = item.multiple; // 当前组件提交值是否为Array
      const maxLen = item.component.attribute.maxlength; // 当前组件提交值的最大个数
      // 如果组件提交的值有最大个数限制，并且用户添加的个数已经超过最大限制，则移除最后一个，并提示用户
      if (maxLen && value.length > maxLen) {
        value.splice(value.length - 1, 1);
        message.info(`${item.label}超出允许选择总数`);
        return;
      }
      submitVal = value;
      switch (type) {
        case 'String':
          //console.log('要求数组每一项为String类型', submitVal);
          if (!multiple) {
            const joinStr = item.component.formatter.split_str;
            submitVal = submitVal.join(joinStr);
          }
          break;
        case 'Number':
          submitVal = value.map(item => {
            if (item) {
              return Number(item);
            } else {
              return null;
            }
          });
          //console.log('要求数组每一项为Number类型', submitVal);

          break;
        case 'Boolean':
          submitVal = value.map(item => {
            return Boolean(item);
          });
          //console.log('要求数组每一项为Boolean类型', submitVal);

          break;
        case 'Object':
          submitVal = [];
          // 如果有下拉菜单，则获取选择的那一项数据作为提交对象
          if (enums) {
            enums.forEach(item => {
              value.forEach(val => {
                if (item.value === val) {
                  submitVal.push(item);
                }
              });
            });
          } else {
            submitVal = value.map(item => {
              return {
                value: item,
              };
            });
          }
          //console.log('要求为Object类型,目前为父子组件才是这个类型，父组件有方法处理', submitVal);

          break;
        default:
          console.log('要求数组每一项类型为', type, '未特殊处理');
      }
    };
    const changeInputNumber = e => {
      const valueType = item.type && item.type.key;
      let value = e;
      if (value) {
        if (valueType && valueType === 'String') {
          value = String(e);
        }
        if (valueType && valueType === 'Number') {
          value = Number(e);
        }
        defaultValue.value = value;
      }
    };
    const changeInput = () => {
      //console.log('输入框值改变：', e);
    };
    const changeYearDate = date => {
      // console.log('时间年选择:', date);
      if (!date) {
        return;
      }
      const formatValue = item.component.parameter.formatter;
      defaultValue.value = moment(date, formatValue);
      const isString = typeof date === 'string';
      if (isString) {
        dateString = date;
      } else {
        dateString = moment(date).format(formatValue);
      }
      isOpen.value = false;
    };
    const changeDate = (date, dateStr) => {
      //console.log('时间选择:', date, dateStr);
      dateString = dateStr;
    };
    let rangeMonthMode = reactive(['month', 'month']);
    let rangeYearMode = reactive(['year', 'year']);
    const dateStringArr = [];
    const changeRangeMonthDate = (value, mode) => {
      isTestOtherValue = true;
      defaultValue.value = value;
      //console.log('时间月段选择:', value, mode, defaultValue.value);
      rangeMonthMode = [
        mode[0] === 'date' ? 'month' : mode[0],
        mode[1] === 'date' ? 'month' : mode[1],
      ];
      const formatValue = item.component.parameter.formatter;
      if (!moment(value[0], formatValue).isValid()) {
        dateStringArr[0] = moment(new Date()).format(formatValue);
      } else {
        dateStringArr[0] = moment(value[0]).format(formatValue);
      }
      if (mode[0] === 'date') {
        const val = moment(value[0]).format(formatValue);
        dateStringArr[0] = val;
      }
      if (mode[1] === 'date') {
        const val = moment(value[1]).format(formatValue);
        dateStringArr[1] = val;
      }
      if (dateStringArr.length === 2) {
        dateString = dateStringArr.join(' - ');
        isTestOtherValue = false;
        isOpen.value = false;
      }
    };
    const changeRangeYearDate = (value, mode) => {
      isTestOtherValue = true;
      defaultValue.value = value;
      //console.log('时间年段选择:', value, mode, defaultValue.value);
      rangeYearMode = [!mode[0] ? 'year' : mode[0], !mode[1] ? 'year' : mode[1]];
      const formatValue = item.component.parameter.formatter;
      if (!moment(value[0], formatValue).isValid()) {
        dateStringArr[0] = moment(new Date()).format(formatValue);
      } else {
        dateStringArr[0] = moment(value[0]).format(formatValue);
      }
      if (!mode[0]) {
        const val = moment(value[0]).format(formatValue);
        dateStringArr[0] = val;
      }
      if (!mode[1]) {
        const val = moment(value[1]).format(formatValue);
        dateStringArr[1] = val;
      }
      if (dateStringArr.length === 2) {
        dateString = dateStringArr.join(' - ');
        isTestOtherValue = false;
        isOpen.value = false;
      }
    };
    const changeRangeDate = (date, dateStr) => {
      //console.log('时间段选择:', date, dateStr, defaultValue.value);
      dateString = dateStr.join(' - ');
    };
    const openFn = () => {
      isOpen.value = !isOpen.value;
    };
    let timerValue = null;
    watch(
      () => defaultValue.value,
      n => {
        if (isTestOtherValue) return;
        clearTimeout(timerValue);
        let values = [];
        timerValue = setTimeout(() => {
          switch (key) {
            case 'Cascader':
            case 'Checkbox':
            case 'UIMS_Departments':
            case 'UIMS_Users':
            case 'SelectTags':
            case 'Select':
            case 'Tags':
              if (Array.isArray(n)) {
                values = [...n];
              }
              if (typeof n === 'string') {
                values = [n];
              }
              emit('submitItemFn', {
                key: itemKey,
                isSkip: skip,
                value: values,
                submitValue: submitVal,
                index: props.index,
                idx: props.idx,
                isSelect: true,
              });
              break;
            case 'DatePicker':
            case 'DateRangePicker':
              emit('submitItemFn', {
                key: itemKey,
                value: dateString,
                index: props.index,
                idx: props.idx,
                isSkip: skip,
                date: true,
              });
              break;
            default:
              emit('submitItemFn', {
                key: itemKey,
                value: n,
                index: props.index,
                idx: props.idx,
                isSkip: skip,
              });
          }
        }, 50);
      },
      { deep: true },
    );
    return {
      getValue,
      obj,
      citation_en,
      citation_cn,
      data_source,
      openFn,
      isOpen,
      duplicateList,
      duplicateCheckValue,
      link_to_subject,
      focusInput,
      showDuplicateCheckModal,
      linkToSubjectValue,
      linkToSubjectRadio,
      linkToSubjectColumnsData,
      linkToSubjectColumns,
      inputLinkToSubject,
      handleLinkToSubjectCancel,
      handleLinkToSubjectOk,
      showLinkToSubjectModal,
      linkToSubjectVisible,
      validateArr,
      otherInputObj,
      changeOtherInput,
      changeRangeMonthDate,
      changeRangeYearDate,
      rangeYearMode,
      rangeMonthMode,
      changeYearDate,
      changeCascader,
      displayRender,
      defaultValue,
      beforeUpload,
      uploadFileFn,
      changeFile,
      fileList,
      changeCheckbox,
      changeRadio,
      changeInputNumber,
      changeRangeDate,
      focusSelect,
      focusSelectTags,
      changeSelectTags,
      changeSelect,
      changeInput,
      changeDate,
      duplicateCheckData,
      duplicateCheckClose,
      duplicateCheckSure,
      blurInput,
    };
  },
});
</script>
<style lang="less" scoped>
.tipsBox {
  dt {
    margin-right: 5px;
  }
  p {
    margin-bottom: 0;
  }
  display: flex;
  margin-top: 15px;
  justify-content: flex-start;
  align-items: flex-start;
  font-size: 12px;
  color: #888;
  line-height: 18px;
}
.dynamic-box ::v-deep(.ant-form-item) {
  .ant-form-item-control-input-content {
    > * {
      flex: 1;
    }
    > .otherInput {
      margin-left: 15px;
    }
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  margin-bottom: 8px;
}
</style>
