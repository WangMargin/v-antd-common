<template>
  <a-space direction="horizontal" v-if="data.component.parameter.formatter.length === 10">
    <a-date-picker
      v-model:value="startValue"
      :disabled-date="disabledStartDate"
      :format="data.component.parameter.formatter"
      :valueFormat="data.component.parameter.formatter"
      :disabled="!!data.component.attribute.disable"
      :placeholder="data.component.attribute.placeholder"
      @openChange="handleStartOpenChange"
    />
    <a-date-picker
      v-model:value="endValue"
      :disabled-date="disabledEndDate"
      :format="data.component.parameter.formatter"
      :valueFormat="data.component.parameter.formatter"
      :disabled="checked"
      :placeholder="data.component.attribute.placeholder"
      :open="endOpen"
      @openChange="handleEndOpenChange"
    />
    <a-checkbox v-model:checked="checked" @change="checkedFn">
      至今
    </a-checkbox>
  </a-space>
  <a-space direction="horizontal" v-if="data.component.parameter.formatter.length === 7">
    <a-month-picker
      v-model:value="startValue"
      :disabled-date="disabledStartDate"
      :format="data.component.parameter.formatter"
      :valueFormat="data.component.parameter.formatter"
      :disabled="!!data.component.attribute.disable"
      :placeholder="data.component.attribute.placeholder"
      @openChange="handleStartOpenChange"
    />
    <a-month-picker
      v-model:value="endValue"
      :disabled-date="disabledEndDate"
      :format="data.component.parameter.formatter"
      :valueFormat="data.component.parameter.formatter"
      :disabled="checked"
      :placeholder="data.component.attribute.placeholder"
      :open="endOpen"
      @openChange="handleEndOpenChange"
    />
    <a-checkbox v-model:checked="checked" @change="checkedFn">
      至今
    </a-checkbox>
  </a-space>
  <a-space direction="horizontal" v-if="data.component.parameter.formatter.length === 4">
    <div @click="openStart">
      <a-date-picker
        v-model:value="startValue"
        mode="year"
        :disabled-date="disabledStartDate"
        :format="data.component.parameter.formatter"
        :valueFormat="data.component.parameter.formatter"
        :disabled="!!data.component.attribute.disable"
        :placeholder="data.component.attribute.placeholder"
        :open="startOpen"
        @panelChange="changeStartYearDate"
      />
    </div>
    <div @click="openEnd">
      <a-date-picker
        v-model:value="endValue"
        mode="year"
        :disabled-date="disabledEndDate"
        :format="data.component.parameter.formatter"
        :valueFormat="data.component.parameter.formatter"
        :disabled="checked"
        :placeholder="data.component.attribute.placeholder"
        :open="endOpen"
        @panelChange="changeEndYearDate"
      />
    </div>
    <a-checkbox v-model:checked="checked" @change="checkedFn">
      至今
    </a-checkbox>
  </a-space>
</template>
<script>
import { defineComponent, ref, watch } from 'vue';
import moment from 'moment';
moment.suppressDeprecationWarnings = true;
export default defineComponent({
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    value: {
      type: String,
      default: '',
    },
  },
  emits: ['setValue'],
  setup(props, { emit }) {
    const startValue = ref();
    const checked = ref(false);
    const endValue = ref();
    const endOpen = ref(false);
    const startOpen = ref(false);
    const formatValue = ref(props.data.component.parameter.formatter).value;
    const len = formatValue.length;
    let regStr = '\\d{4}';
    let splitMark = '';
    if (len > 4) {
      splitMark = formatValue.substr(4, 1);
    }
    if (len === 7) {
      regStr = '\\d{4}\\' + splitMark + '\\d{2}';
    }
    if (len === 10) {
      regStr = '\\d{4}\\' + splitMark + '\\d{2}\\' + splitMark + '\\d{2}';
    }
    const reg = new RegExp(regStr);
    if (props.value) {
      const defaultValueArr = props.value.split(' - ');
      if (reg.test(defaultValueArr[0])) {
        startValue.value = defaultValueArr[0];
      } else {
        startValue.value = null;
      }
      if (defaultValueArr[1] === '至今') {
        checked.value = true;
      } else {
        if (reg.test(defaultValueArr[1])) {
          endValue.value = defaultValueArr[1];
        } else {
          endValue.value = null;
        }
      }
    }
    console.log(props.data, props.value);
    const checkedFn = () => {
      console.log(checked.value);
      if (startValue.value && checked.value) {
        const str = startValue.value + ' - ' + '至今';
        emit('setValue', str);
        endValue.value = null;
      }
      if (!checked.value) {
        const str = startValue.value + ' - ' + '';
        emit('setValue', str);
      }
    };
    const disabledStartDate = startValue => {
      if (!startValue || !endValue.value) {
        return false;
      }
      return startValue.valueOf() > moment(endValue.value, formatValue).valueOf();
    };

    const disabledEndDate = endValue => {
      if (!endValue || !startValue.value) {
        return false;
      }
      return moment(startValue.value, formatValue).valueOf() >= endValue.valueOf();
    };

    const handleStartOpenChange = open => {
      if (!open && !checked.value) {
        endOpen.value = true;
      }
    };
    const openStart = () => {
      startOpen.value = !startOpen.value;
      endOpen.value = false;
    };
    const openEnd = () => {
      endOpen.value = !endOpen.value;
    };
    const changeStartYearDate = date => {
      openStart();
      startValue.value = moment(date).format(formatValue);
      if (!startOpen.value && !checked.value) {
        endOpen.value = true;
      }
    };
    const changeEndYearDate = date => {
      endValue.value = moment(date).format(formatValue);
      openEnd();
    };

    const handleEndOpenChange = open => {
      endOpen.value = open;
    };

    watch(startValue, () => {
      console.log('startValue', startValue.value, checked.value);
      if (checked.value) {
        const str = startValue.value + ' - ' + '至今';
        emit('setValue', str);
      } else {
        const str = startValue.value + ' - ' + endValue.value;
        emit('setValue', str);
      }
    });
    watch(endValue, () => {
      console.log('endValue', endValue.value, startValue.value, formatValue);
      if (!startValue.value) return;
      if (checked.value) {
        const str = startValue.value + ' - ' + '至今';
        emit('setValue', str);
      } else {
        const str = startValue.value + ' - ' + endValue.value;
        emit('setValue', str);
      }
    });
    return {
      openEnd,
      openStart,
      changeEndYearDate,
      changeStartYearDate,
      checkedFn,
      checked,
      startValue,
      endValue,
      startOpen,
      endOpen,
      disabledStartDate,
      disabledEndDate,
      handleStartOpenChange,
      handleEndOpenChange,
    };
  },
});
</script>
