<template>
  <a-card s :bordered="false">
    <a-row>
      <a-col
        :xs="{ span: 24 }"
        :md="{ span: 20, offset: 2 }"
        :xl="{ span: 18, offset: 3 }"
        :xxl="{ span: 16, offset: 4 }"
      >
        <div class="dynamicFormWrap">
          <a-divider orientation="center" :style="{ height: '24px' }">
            {{ fieldsData.name }}
          </a-divider>
          <a-form
            layout="vertical"
            ref="formRef"
            :scrollToFirstError="true"
            :model="formState.formState"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <template v-if="formObj.fields && formObj.fields.length > 0">
              <a-row :gutter="[16, 16]" v-for="(row, index) in formObj.formatFields" :key="index">
                <a-col
                  :span="col.component.scene_layout.save.column_length"
                  v-for="(col, idx) in row"
                  :key="idx"
                >
                  <formItem
                    :allList="formObj.fields"
                    :category_id="category_id"
                    :formState="formState.formState"
                    :item="col"
                    :pathName="fieldsData.name"
                    :isEdit="isEdit"
                    :editId="editId"
                    :index="index"
                    :idx="idx"
                    :labelCol="{ span: row.length * labelCol.span }"
                    :categoryIds="categoryIds"
                    @submitItemFn="getItemFn"
                  />
                </a-col>
              </a-row>
            </template>
            <a-divider orientation="center" :style="{ height: '24px' }">关联信息</a-divider>
            <a-form-item
              label="所属年份"
              name="relationInfoYear"
              :rules="rules['relationInfoYear']"
              required
            >
              <div @click="openFn">
                <a-date-picker
                  @panelChange="changeDate"
                  mode="year"
                  :open="isOpen"
                  v-model:value="yearValue"
                  valueFormat="yyyy"
                  format="yyyy"
                  placeholder="请选择年份"
                  style="width:100%;"
                />
              </div>
            </a-form-item>
            <a-form-item
              label="成果所属"
              name="relationInfoSubject"
              :rules="rules['relationInfoSubject']"
              :extra="`请勾选所有参与此成果的本院教师及博士后、研究中心`"
            >
              <div @click="focusShowTreeFn">
                <!--                <span v-for="item in state.showTreeData">{{item}}</span>-->
                <a-select
                  :dropdownMenuStyle="{ opcity: '0' }"
                  :dropdownMatchSelectWidth="false"
                  dropdownClassName="noneSelect"
                  v-model:value="state.showTreeData"
                  mode="multiple"
                  style="width: 100%"
                  placeholder="选择成果所属"
                />
              </div>
              <!--              <a-tree-select-->
              <!--                show-search-->
              <!--                style="width: 100%"-->
              <!--                :dropdown-style="{ maxHeight: '240px', overflow: 'auto' }"-->
              <!--                placeholder="选择成果所属"-->
              <!--                tree-checkable-->
              <!--                v-model:value="subjectVal"-->
              <!--                :tree-data="subjectData"-->
              <!--                :replace-fields="{ children: 'children', title: 'name', key: 'key', value: 'key' }"-->
              <!--                @change="treeSelect"-->
              <!--              ></a-tree-select>-->
            </a-form-item>
            <a-form-item class="error-infos" style="text-align:center;">
              <a-button
                type="primary"
                @click.prevent="onSubmit('Published')"
                :disabled="fieldsData.status.key !== 'Audit' ? true : isSubmitDisable"
              >
                提交
              </a-button>
              <a-button
                type="primary"
                style="margin-left: 10px;"
                :disabled="isSubmitDisable"
                @click.prevent="onSubmit('Draft')"
                v-if="isDraft"
              >
                保存草稿
              </a-button>
              <a-button style="margin-left: 10px" @click="cancelBatch" v-if="isBatch">
                取消
              </a-button>
              <a-button style="margin-left: 10px" @click="resetForm" v-else>重置</a-button>
            </a-form-item>
          </a-form>
        </div>
      </a-col>
    </a-row>
  </a-card>
  <!--  选择成果所属 modal-->
  <a-modal
    v-model:visible="state.showTreeVisible"
    centered
    title="请选择成果所属"
    :closable="false"
    :destroyOnClose="true"
    :keyboard="false"
    :maskClosable="false"
    @ok="changeShoTreeFn(true)"
    @cancel="changeShoTreeFn(false)"
  >
    <a-input-search
      v-model:value="state.searchValue"
      style="margin-bottom: 8px"
      placeholder="请输入关键字"
    />
    <a-directory-tree
      checkable
      multiple
      blockNode
      :tree-data="state.treeData"
      @expand="onExpand"
      showIcon
      :checkStrictly="true"
      :auto-expand-parent="state.autoExpandParent"
      v-model:expandedKeys="state.expandedKeys"
      v-model:selectedKeys="state.selectedKeys"
      v-model:checkedKeys="state.checkedKeys"
    >
      <!--      // 设置自定义 叶子节点 icon-->
      <template #child></template>
    </a-directory-tree>
  </a-modal>
</template>
<script>
import { defineComponent, reactive, toRaw, ref, watch, onMounted, computed } from 'vue';
import formItem from './form-item/formItem';
import moment from 'moment';
import { useStore } from 'vuex';
import { getSubjectsCategoriesList } from '@/api/task/task.js';
export default defineComponent({
  name: 'dynamicForm',
  props: {
    category_id: {
      type: String,
      default: '',
    },
    category_type: {
      type: String,
      default: '',
    },
    editData: {
      type: Object,
      default: () => {},
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    editId: {
      type: String,
      default: '',
    },
    fieldsData: {
      type: Object,
      default: () => {},
    },
    isBatch: {
      type: Boolean,
      default: false,
    },
    // 接口提交状态
    submitStatus: {
      type: Object,
      default: () => {},
    },
  },
  components: { formItem },
  emits: ['submitFn', 'cancelBatchFn'],
  setup(props, { emit }) {
    // console.log(props.fieldsData);
    const store = useStore();
    const resourcesData = computed(() => store.getters[`resources/data`]);
    const subjectsResource = resourcesData.value.resources;
    const categorySome = subjectsResource['all_category_enum'].filter(item => {
      return item.type === props.fieldsData.type.key;
    });
    const categoryIdArr = categorySome.map(k => {
      return `category_ids=${k.key}`;
    });
    const categoryIds = categoryIdArr.join('&');
    const formObj = reactive({ fields: [], formatFields: [] });
    const formRef = ref();
    const yearValue = ref();
    const isDraft = ref(true);
    const isOpen = ref(false);
    const isSubmitDisable = ref(false);
    const isShowSelect = ref(false);
    const subjects = ref([]);
    const options = ref([]);
    const formState = reactive({ formState: {}, submitData: {} });
    // 获取关联主体树形列表
    const subjectData = ref([]);
    const subjectVal = ref([]);
    // 选择成果所属 modal
    const state = reactive({
      searchValue: '',
      autoExpandParent: true,
      showTreeVisible: false,
      validatorTreeData: [],
      showTreeData: [],
      treeData: [],
      expandedKeys: [],
      selectedKeys: [],
      checkedKeys: [],
      before_checkedKeys: [],
    });
    const validatorSubject = (rule, value) => {
      if (!state.checkedKeys) {
        return Promise.reject('请选择成果所属');
      } else if (state.checkedKeys.length < 1) {
        return Promise.reject('请选择成果所属');
      } else {
        return Promise.resolve();
      }
      // if (!subjectVal.value) {
      //   return Promise.reject('请选择成果所属');
      // } else if (subjectVal.value.length < 1) {
      //   return Promise.reject('请选择成果所属');
      // } else {
      //   return Promise.resolve();
      // }
    };
    const rules = reactive({
      relationInfoSubject: [
        {
          required: true,
          trigger: 'change',
          message: '请选择成果所属',
          validator: validatorSubject,
        },
      ],
    });
    const fields = JSON.stringify(props.fieldsData.schema.fields);
    const user_select_subject = JSON.parse(localStorage.getItem('user_select_subject'));
    const openFn = () => {
      isOpen.value = !isOpen.value;
    };
    const cancelBatch = () => {
      emit('cancelBatchFn');
    };
    // 关联信息所属年份设置
    const changeDate = (e, notValidate) => {
      yearValue.value = e || '';
      isOpen.value = false;
      if (e) {
        formState.formState.relationInfoYear = moment(e).format('YYYY');
      } else {
        formState.formState.relationInfoYear = '';
      }
      if (!notValidate) {
        formRef.value.validate('relationInfoYear');
      }
    };

    const treeSelect = val => {
      formState.formState['relationInfoSubject'] = val;
    };
    // 格式化表单列表项，展开子集到一级表单及布局分组
    let rowArr = [];
    const formatFieldsFn = (arr, key = '', defaultValue) => {
      arr.forEach((item, index) => {
        if (key) {
          if (defaultValue) {
            item.default = defaultValue[item.key];
          }
          if (!item.component.skip) {
            item.key = `${key}.` + item.key;
          } else {
            if (props.editData && defaultValue) {
              item.default = props.editData.data[item.key];
            }
          }
        }
        const type = item.type.key;
        switch (type) {
          case 'Number':
            if (item.default || item.default === 0) {
              item.default = Number(item.default);
            } else {
              item.default = null;
            }
            break;
          case 'Boolean':
            if (item.default) {
              item.default = Boolean(item.default);
            }
            break;
          default:
          // console.log('默认值类型' + type);
        }
        formState.formState[item.key] = item.default;
        formState.submitData[item.key] = item.default;
        const columnNum = arr[index + 1] && arr[index + 1].component.scene_layout.save.column_begin;
        rowArr.push(item);
        if (columnNum === 0 || columnNum === undefined) {
          formObj.formatFields.push(rowArr);
          rowArr = [];
        }

        if (item.components && item.components.length > 0) {
          formatFieldsFn(item.components, item.key, item.default);
        }
      });
    };
    // 初始表单项简单处理
    const fieldsFn = () => {
      // 过滤不需要的项
      const list = JSON.parse(fields);
      const arr = list.filter(item => {
        return item.is_active;
      });
      formObj.fields = arr;
      // 每项默认值设置
      formObj.fields.forEach(item => {
        let defaultValue = item.default;
        if (props.editData) {
          defaultValue = props.editData.data[item.key];
          const key = item.component.type && item.component.type.key;
          const formatValue = item.component.parameter && item.component.parameter.formatter;
          switch (key) {
            case 'DatePicker': {
              const isDate = moment(defaultValue, formatValue).isValid();
              const validation = item.component.validation;
              const reg = new RegExp(
                validation.filter(item => {
                  return item.type.key === 'Pattern';
                })[0].value,
              );
              const isTest = reg.test(defaultValue);
              if (!isDate || !isTest) {
                defaultValue = item.default;
              }
              break;
            }
            case 'DateRangePicker': {
              const validation = item.component.validation;
              const reg = new RegExp(
                validation.filter(item => {
                  return item.type.key === 'Pattern';
                })[0].value,
              );
              const isTest = reg.test(defaultValue);
              if (!isTest) {
                defaultValue = item.default;
              }
              break;
            }
            default:
            // console.log(key, defaultValue, '未排查编辑值是否符合规则的类型及值');
          }
          item.default = defaultValue;
          if (item.key === 'year') {
            if (defaultValue) {
              item.default = String(defaultValue);
            }
          }
        }
        formState.formState[item.key] = defaultValue;
        formState.submitData[item.key] = defaultValue;
        if (props.isBatch) {
          setTimeout(() => {
            const validation = item.component.validation;
            const required = validation.some(val => {
              const required = val && val.type;
              return required === 'required';
            });
            if (required) {
              formRef.value.validate(item.key);
            }
          }, 0);
        }
      });
      formatFieldsFn(formObj.fields);
      rules['relationInfoYear'] = ref([
        {
          required: true,
          trigger: 'change',
          message: '请选择所属年份',
        },
      ]).value;

      if (props.editData) {
        // 获取关联信息年份并赋值
        changeDate(String(props.editData.year ? props.editData.year : ''), true);
        if (props.editData.subjects) {
          subjectVal.value = [];
          if (user_select_subject.id !== 'administrator') {
            subjectVal.value.push(user_select_subject.id);
          }
          props.editData.subjects.map(item => {
            if (item.id !== user_select_subject.id) {
              subjectVal.value.push(item.id);
            }
            // new subjects
            state.showTreeData.push(item.name);
            state.checkedKeys.push(item.id);
          });
          formState.formState['relationInfoSubject'] = subjectVal.value;
        }

        // 获取编辑信息草稿箱按钮状态
        if (props.editData.status && props.editData.status.key !== 'Draft') {
          isDraft.value = false;
        }
      } else {
        formState.formState.relationInfoYear = '';
      }
    };

    const dataList = ref([]);

    const generateList = data => {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const key = node.key;
        dataList.value.push({
          key,
          // title: key,
          title: node.title,
        });

        if (node.children) {
          generateList(node.children);
        }
      }
    };

    // generateList(state.treeData);

    const getParentKey = (key, tree) => {
      let parentKey;

      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];

        if (node.children) {
          if (node.children.some(item => item.key === key)) {
            parentKey = node.key;
          } else if (getParentKey(key, node.children)) {
            parentKey = getParentKey(key, node.children);
          }
        }
      }
      return parentKey;
    };

    watch(
      () => state.searchValue,
      value => {
        if (value.length < 1) return (state.expandedKeys = []);
        const expanded = dataList.value
          .map(item => {
            if (item.title.indexOf(value) > -1) {
              return getParentKey(item.key, state.treeData);
            }
            return null;
          })
          .filter((item, i, self) => item && self.indexOf(item) === i);
        state.expandedKeys = expanded;
        state.searchValue = value;
        state.autoExpandParent = true;
      },
    );
    const onExpand = keys => {
      state.expandedKeys = keys;
      state.autoExpandParent = false;
    };
    watch(
      () => state.showTreeData,
      () => {
        state.checkedKeys = [];
        state.showTreeData.forEach(item => {
          state.validatorTreeData.forEach(item2 => {
            if (item2.title2 == item) {
              state.checkedKeys.push(item2.key2);
            }
          });
        });
      },
    );
    // 获取焦点 显示modal
    const focusShowTreeFn = () => {
      state.showTreeVisible = true;
    };
    const changeShoTreeFn = flag => {
      const arr = state.showTreeData;
      if (flag) {
        const arr = state.checkedKeys.checked;
        state.checkedKeys = [];
        state.showTreeData = [];
        arr.forEach(item => {
          if (item.length === 24) {
            state.checkedKeys.push(item);
            state.validatorTreeData.forEach(item2 => {
              if (item2.key2 == item) {
                state.showTreeData.push(item2.title2);
                // state.showTreeData.push({ title: item2.title2, key: item2.key2 })
              }
            });
          }
        });
        state.searchValue = '';
        state.expandedKeys = [];
        state.showTreeVisible = false;
        return;
      } else {
        // 取消选中key 则恢复为打开前状态
        state.searchValue = '';
        state.expandedKeys = [];
        state.showTreeData = arr;
        state.checkedKeys = state.before_checkedKeys;
        // installTreeDataFn(subjectData.value)
      }

      state.showTreeVisible = flag;
    };
    watch(
      () => state.showTreeVisible,
      val => {
        if (val) {
          state.before_checkedKeys = state.checkedKeys;
        }
      },
    );
    // 去重处理函数
    const newArrFn = arr => {
      const hash = {};
      return arr.reduce((s, next) => {
        hash[next.key] ? '' : (hash[next.key] = true && s.push(next));
        return s;
      }, []);
    };
    // 过滤简写字段 为 指定title
    const list = [
      { key: 'Professor', val: '教授' },
      { key: 'VisitingProfessor', val: '访问学者' },
      { key: 'PostDoctor', val: '博士后' },
      { key: 'Researcher', val: '研究员' },
      { key: 'is_active', val: '已离职' },
      { key: 'NIFR', val: '国家金融研究院' },
      { key: 'IFR', val: '金融科技研究院' },
      { key: 'School', val: '学院直属研究中心' },
    ];
    const filterInfoTitleFn = title => {
      list.forEach(item => {
        if (title === item.key) {
          title = item.val;
        }
      });
      return title;
    };
    // 格式化 tree-data 排序
    const formatTreeData = l => {
      l.forEach(item => {
        item.children.forEach(item2 => {
          item2.i = JSON.stringify(list).indexOf(item2.title); // 判断已确定的字符串位置 提前定位排序index
        });
        item.children.sort((a, b) => a.i - b.i);
      });
      return l;
    };
    // 格式化 选择成果所属部门的 数据
    const installTreeDataFn = data => {
      const n_arr = [];
      const sub = data.subjects;
      // 生成完整的三册数据 等待后边自行提取组装
      sub.forEach((item, index) => {
        item.children.forEach((item2, index2) => {
          if (item2.is_active) {
            n_arr.push({
              key1: item.key,
              title1: item.name,
              key2: item2.key,
              title2: item2.name,
              key3: item2.info.parent || item2.info.position,
              title3: filterInfoTitleFn(item2.info.parent || item2.info.position),
              checkable: true,
              isLeaf: true,
            });
          } else {
            // 离职人员处理
            n_arr.push({
              key1: item.key,
              title1: item.name,
              key2: item2.key,
              title2: item2.name,
              key3: 'is_active',
              title3: '已离职',
              checkable: true,
              isLeaf: true,
            });
          }
        });
      });
      // 将 subjects 两层数据 分别设置三层后 在自行组装 treeData 三层数据
      let newArr1 = []; // 第一层展示
      let newArr3 = []; // 第二层展示
      let newArr2 = []; // 第三层展示
      state.validatorTreeData = n_arr;
      // newArr3.push({ key: 'is_active', title: '已离职', dec: 'is_active' });
      n_arr.forEach((item, index) => {
        newArr1.push({
          key: item.key1,
          title: item.title1,
          checkable: false,
          selectable: false,
          children: [],
          slots: {
            icon: 'child', // 设置自定义 叶子节点 icon
          },
        });
        newArr2.push({
          key: item.key2,
          title: item.title2,
          dec: item.key3,
          selectable: false,
          slots: {
            icon: 'child',
          },
        });
        // newArr2.push({ key: item.key2, title: item.title2, dec: item.key3 });
        newArr3.push({
          key: item.key3,
          title: item.title3,
          dec: item.key1,
          checkable: false,
          selectable: false,
          children: [],
          slots: {
            icon: 'child',
          },
        });
      });

      // 将分开的三层数据去重处理
      newArr1 = newArrFn(newArr1);
      newArr2 = newArrFn(newArr2);
      newArr3 = newArrFn(newArr3);
      // 开始组装三层展示数据
      newArr3.forEach((item, index) => {
        newArr2.forEach((item2, index2) => {
          if (item.key === item2.dec) {
            newArr3[index].children.push(item2);
          }
        });
      });
      newArr1.forEach((item, index) => {
        newArr3.forEach((item2, index2) => {
          if (item.key === item2.dec) {
            newArr1[index].children.push(item2);
          }
        });
        if (item.key === 'School') {
          const child_ = item.children[0].children;
          if (!item.children[0].key) {
            item.children = [];
            item.children = child_;
          }
        }
      });
      state.treeData = formatTreeData(newArr1);
      generateList(state.treeData);
    };
    onMounted(() => {
      getSubjectsCategoriesList()
        .then(res => {
          if (res.code === 200) {
            installTreeDataFn(res.data);
          }
          if (user_select_subject.id !== 'administrator' && subjectVal.value.length === 0) {
            subjectVal.value = [user_select_subject.id];
          }
          subjectData.value = res.data.subjects;
        })
        .catch(() => {});
      fieldsFn();
    });
    const getValFn = (obj, keyArr, value) => {
      const len = keyArr.length;
      if (len > 1) {
        if (!obj[keyArr[0]]) {
          obj[keyArr[0]] = {};
        }
        getValFn(obj[keyArr[0]], keyArr.slice(1, len), value);
      } else {
        obj[keyArr[0]] = value;
      }
    };
    // 关联主体下拉框数据显示及处理
    const getLinkToSubject = e => {
      const obj = e;
      for (const key in obj) {
        obj[key].forEach(item => {
          subjects.value.push(item.subjectId);
        });
      }
      formState.formState['relationInfoSubject'] = subjects.value;
    };
    const labelInfo = {};
    // 获取表单单项组件提交的值
    const getItemFn = e => {
      // console.log(e, '组件提交的数据getItem');
      // 类名，主要用于联动观察，对观察对象进行类名设置
      if (e.isClass) {
        formObj.formatFields[e.index][e.idx].component.attribute.isClass = e.value;
        return;
      }
      // 是否显示，主要用于联动观察，对观察对象进行显示/隐藏设置
      if (e.isVisible) {
        formObj.formatFields[e.index][e.idx].component.attribute.visible = e.value;
        return;
      }
      // 是否可编辑，主要用于联动观察，对观察对象进行编辑/不可编辑设置
      if (e.isDisable) {
        formObj.formatFields[e.index][e.idx].component.attribute.disable = e.value;
        return;
      }
      // 是否选择其他，因为选择其他时，值为空，所以自定义一个内部字段，_key:value，用于特殊处理
      if (e.otherKey) {
        formState.formState[e.otherKey] = e.otherValue;
      }
      // 是否其他输入框，选择其他的时候，如果有补充输入框，则使用输入框的值作为提交的值
      if (e.isOtherInput) {
        formState.formState[e.key] = e.value;
        formState.submitData[e.key] = e.value;
        formRef.value.validate(e.key);
        return;
      }
      // 获取表单项提交的值，给表单，用于验证及提交
      if (e.isOtherValue) {
        formState.formState[e.key] = '';
        formState.submitData[e.key] = '';
      } else {
        formState.formState[e.key] = e.value;
        formState.submitData[e.key] = e.value;
        if (!e.notTest) {
          setTimeout(() => {
            formRef.value.validate(e.key);
          }, 50);
        }
      }
      // 是否查重
      if (e.isDuplicate) {
        formRef.value.validate(e.key);
      }
      // 是否子集对父级可见，如果可见，则提升到一级表单字段提交，目前只处理两级表单
      if (e.isSkip) {
        const key = e.key.split('.')[1];
        formState.submitData[key] = e.value;
      }
      // 是否为多选或者是关联主体
      if (e.option || e.link_to_subject) {
        if (e.option) {
          formObj.formatFields[e.index][e.idx].default = e.option;
        }
        if (e.link_to_subject) {
          labelInfo[e.key] = [];
          if (Array.isArray(e.value)) {
            e.value.forEach(item => {
              if (item.subjectId) {
                labelInfo[e.key].push({ ...item });
              }
            });
          } else {
            if (e.value.subjectId) {
              labelInfo[e.key].push(e.value);
            }
          }
          getLinkToSubject(labelInfo);
        }
        formRef.value.validate(e.key);
        return;
      }
      // 如果有特殊的提交字段，提交是则使用特殊的提交值
      if (e.submitValue) {
        formState.submitData[e.key] = e.submitValue;
        return;
      }
      // 是否联动函数调用
      if (e.fnArgs) {
        const arr = [];
        const strRules = [',', '. ', '，'];
        e.fnArgs.forEach((item, index) => {
          let value = toRaw(formState.formState[item]);
          if (item === 'outer_year') {
            value = formState.formState.relationInfoYear;
          }
          if (value) {
            arr[index] = value;

            let strRul = strRules[0];
            let str = '';
            if (index === 1) {
              arr[index] = '"' + value + '"';
            }
            if (e.isCn) {
              strRul = strRules[2];
              if (index === 1) {
                arr[index] = '“' + value + '”';
              }
            }
            arr.forEach(val => {
              if (Array.isArray(val)) {
                str +=
                  val
                    .map(name => {
                      return name.value || name;
                    })
                    .join(strRul) + strRul;
              } else {
                str += val + strRul;
              }
            });
            str = str.slice(0, str.length - 1);
            formState.formState[e.key] = str;
            formState.submitData[e.key] = str;
            formObj.formatFields[e.index][e.idx].default = str;
          }
        });
        return;
      }
      if (e.isSelect) return;
      formObj.formatFields[e.index][e.idx].default = e.value;
    };
    // 保存
    const onSubmit = action => {
      const dynamicData = toRaw(formState.submitData);
      isSubmitDisable.value = true;
      for (const key in dynamicData) {
        const keyArr = key.split('.');
        if (keyArr.length > 1) {
          getValFn(dynamicData, keyArr, dynamicData[key]);
          delete dynamicData[key];
        }
      }
      if (action === 'Published') {
        formRef.value
          .validate()
          .then(() => {
            emit('submitFn', {
              dynamicData: dynamicData,
              action: action,
              year: formState.formState.relationInfoYear,
              subjects: state.checkedKeys,
              // subjects: formState.formState['relationInfoSubject'],
            });
            setTimeout(() => {
              isSubmitDisable.value = false;
            }, 500);
          })
          .catch(error => {
            isSubmitDisable.value = false;
            const key = error.errorFields[0].name[0];
            formRef.value.scrollToField(key);
            console.error('error', error, key);
          });
      } else {
        emit('submitFn', {
          dynamicData: dynamicData,
          action: action,
          year: formState.formState.relationInfoYear,
          subjects: formState.formState['relationInfoSubject'],
        });
        isSubmitDisable.value = false;
      }
    };

    const resetForm = () => {
      formObj.formatFields.forEach(item => {
        item.forEach(list => {
          list.default = null;
        });
      });
      yearValue.value = '';
      formRef.value.resetFields();
    };

    watch(
      () => props.editData,
      (n, o) => {
        if (n !== o) {
          formObj.fields = [];
          formObj.formatFields = [];
          fieldsFn();
          isSubmitDisable.value = false;
        }
      },
      { deep: true },
    );
    return {
      state,
      onExpand,
      changeShoTreeFn,
      focusShowTreeFn,
      subjectVal,
      subjectData,
      treeSelect,
      openFn,
      isOpen,
      isSubmitDisable,
      isShowSelect,
      cancelBatch,
      getLinkToSubject,
      getItemFn,
      isDraft,
      options,
      subjects,
      yearValue,
      changeDate,
      formObj,
      formRef,
      labelCol: {
        span: 24,
      },
      wrapperCol: {
        span: 24,
      },
      other: '',
      formState,
      rules,
      onSubmit,
      resetForm,
      categoryIds,
    };
  },
});
</script>
