<template>
  <a-row :gutter="[16, 16]" v-for="(row, index) in formatFields" :key="index">
    <a-col
      :span="col.component.scene_layout.save.column_length"
      v-for="(col, idx) in row"
      :key="idx"
    >
      <formItem
        :allList="fields"
        :formState="formObj"
        :item="col"
        :index="index"
        :idx="idx"
        :labelCol="{ span: row.length * labelCol.span }"
        @submitItemFn="getItemFn"
      />
    </a-col>
  </a-row>
</template>
<script>
import { defineComponent, reactive, toRaw, watch } from 'vue';
import formItem from './formItem';
export default defineComponent({
  name: 'formLayout',
  components: { formItem },
  props: {
    labelCol: {
      type: Object,
      default: () => {},
    },
    editData: {
      type: Object,
      default: () => {},
    },
    fields: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['getAllSubmitItemFn', 'linkToSubject'],
  setup(props, { emit }) {
    if (false) {
      isDraft.value = false;
      if (data.status.key === 'Draft') {
        isDraft.value = true;
      }
      formState.formState = ref(data.data);
      formState.submitData = data.data;
      yearValue.value = moment(String(data.year));
      formState.formState['relationInfoYear'] = String(data.year);
      let resOptionArr = data.subjects;
      if (resOptionArr) {
        resOptionArr = resOptionArr.map(item => {
          return {
            ...item,
            subjectId: item.id,
            value: item.name,
          };
        });
        getOptions(resOptionArr);
        changeSelectTags('', resOptionArr);
        resOptionArr.forEach(item => {
          if (item.subjectId !== user_select_subjectId) {
            subjects.value.push(item.name);
          }
        });
      }
    }
    const formatFields = reactive([]);
    const editData = reactive(props.editData);
    const formObj = editData;
    const fieldsArr = reactive(props.fields);
    let rowArr = [];
    const formatFieldsFn = (arr, key = '') => {
      arr.forEach((item, index) => {
        if (key) {
          item.key = `${key}.` + item.key;
        }
        formObj[item.key] = item.default;
        const columnNum = arr[index + 1] && arr[index + 1].component.scene_layout.save.column_begin;
        rowArr.push(item);
        if (columnNum === 0 || columnNum === undefined) {
          formatFields.push(rowArr);
          rowArr = [];
        }

        if (item.components && item.components.length > 0) {
          formatFieldsFn(item.components, item.key);
        }
      });
    };
    formatFieldsFn(fieldsArr);
    watch(
      () => props.editData,
      n => {
        formatFields.forEach(listArr => {
          listArr.forEach(list => {
            const key = list.key;
            // const isComponentsKey = key.split('.');
            // const componentKey = list.component.type && list.component.type.key;
            const defaultValue = n[key];
            // if (isComponentsKey.length > 1 && !list.component.skip) {
            //   defaultValue = n[isComponentsKey[0]][isComponentsKey[1]];
            // }

            formObj[key] = defaultValue;
            // if (
            //   componentKey === 'Select' ||
            //   componentKey === 'SelectTags' ||
            //   componentKey === 'Tags'
            // ) {
            //   const valueType = Object.prototype.toString.call(defaultValue);
            //   switch (valueType) {
            //     case '[object Array]':
            //       defaultValue = defaultValue.map(item => {
            //         return item.value || item;
            //       });
            //       break;
            //     case '[object Object]':
            //       if (list.type.key === 'String') {
            //         n[key] = defaultValue.value;
            //       }
            //       defaultValue = [defaultValue.value];
            //       break;
            //     default:
            //       console.log(`未处理默认值类型，${valueType}`);
            //   }
            // }
            list.default = defaultValue;
            console.log(list.default, 5555555);
          });
        });
      },
    );

    const labelInfo = {};
    const getItemFn = e => {
      console.log(e, '组件提交的数据getItem');
      if (e.isClass) {
        formatFields[e.index][e.idx].component.attribute.isClass = e.value;
        return;
      }
      if (e.isVisible) {
        formatFields[e.index][e.idx].component.attribute.visible = e.value;
        return;
      }
      if (e.isDisable) {
        formatFields[e.index][e.idx].component.attribute.disable = e.value;
        return;
      }
      if (e.otherKey) {
        formObj[e.otherKey] = e.otherValue;
      }
      if (e.isOtherInput) {
        formObj[e.key] = e.value;
        formObj[e.key] = e.value;
        return;
      }
      formObj[e.key] = e.value;
      console.log(formObj[e.key], e.key, 6655555);
      if (e.isSkip) {
        const key = e.key.split('.')[1];
        formObj[key] = e.value;
      }
      emit('getAllSubmitItemFn', { formObj, isForm: true });
      if (e.date) {
        formatFields[e.index][e.idx].default = e.date;
        return;
      }
      if (e.option || e.link_to_subject) {
        if (e.option) {
          formatFields[e.index][e.idx].default = e.option;
        }
        if (e.link_to_subject) {
          labelInfo[e.key] = [];
          if (Array.isArray(e.value)) {
            e.value.forEach(item => {
              if (item.subjectId) {
                labelInfo[e.key].push({ ...item, disabled: true });
              }
            });
          } else {
            if (e.value.subjectId) {
              e.value['disabled'] = true;
              labelInfo[e.key].push(e.value);
            }
          }
          emit('linkToSubject', labelInfo);
        }
        return;
      }
      if (e.submitValue) {
        formObj[e.key] = e.submitValue;
      }
      if (e.fnArgs) {
        const arr = [];
        const strRules = [',', '. ', '，'];
        e.fnArgs.forEach((item, index) => {
          const value = toRaw(formObj[item]);
          if (value) {
            arr[index] = formObj[item];

            let strRul = strRules[0];
            let str = '';
            if (index === 1) {
              arr[index] = '"' + formObj[item] + '"';
            }
            if (e.isCn) {
              strRul = strRules[2];
              if (index === 1) {
                arr[index] = '“' + formObj[item] + '”';
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
            formatFields[e.index][e.idx].default = str;
          }
        });
        return;
      }
      formatFields[e.index][e.idx].default = e.value;
    };
    return {
      wrapperCol: {
        span: 24,
      },
      formObj,
      formatFields,
      getItemFn,
    };
  },
});
</script>
<style lang="less" scoped></style>
