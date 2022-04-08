<template>
  <div style="">
    <div>
      <a-button @click="addTeacher" style="margin-bottom: 10px">添加教师</a-button>
    </div>
    <div>
      <a-table
        :pagination="false"
        :columns="columns"
        :data-source="data"
        :locale="{ emptyText: '暂无数据' }"
        :rowKey="(record, index) => index"
        :scroll="{ x: 1000 }"
      >
        <template #index="{ index }">
          {{ index + 1 }}
        </template>
        <template #name="{ text }">
          <a-space style="color: #333333" type="link" ghost>
            {{ text || '待招募' }}
          </a-space>
        </template>
        <template #date="{ record, index }">
          <a-date-picker
            placeholder="请选择服务日期"
            valueFormat="YYYY-MM-DD"
            inputReadOnly
            v-model:value="record.date"
            :allowClear="false"
            @change="changeDate"
            @focus="focusDate(index)"
          />
        </template>
        <template #serviceNum="{ record, index }">
          <a-input-number
            :min="0"
            v-model:value="record.serviceNum"
            @focus="focusServiceNum(index)"
          ></a-input-number>
        </template>
        <template #amount="{ record, index }">
          <a-input-number
            :min="0"
            v-model:value="record.amount"
            @focus="focusServiceNum(index)"
            :formatter="value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/¥\s?|(,*)/g, '')"
          ></a-input-number>
        </template>
        <template #standard>
          <span>{{ state.formTask ? state.formTask.serviceStandard : '-' }}</span>
        </template>
        <template #unit>
          <span>{{ state.formTask ? state.formTask.serviceUnit : '-' }}</span>
        </template>
        <template #action="{ record, index }">
          <a-button size="small" @click="selectChange(record, index)" type="link">
            指定教师
          </a-button>
          <a-popconfirm
            placement="topRight"
            ok-text="确定"
            cancel-text="取消"
            @confirm="addTeacher(index, false)"
          >
            <template #title>
              <p>确定删除当前指定教师？</p>
            </template>
            <a-button size="small" type="link">删除</a-button>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
    <teacher-tree @ok="treeOK"></teacher-tree>
  </div>
</template>

<script>
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 80,
    slots: {
      customRender: 'index',
    },
  },
  {
    title: '教师姓名',
    dataIndex: 'name',
    slots: {
      customRender: 'name',
    },
  },
  {
    title: '服务日期',
    dataIndex: 'date',
    width: 200,
    slots: {
      customRender: 'date',
    },
  },
  {
    title: '服务数量',
    dataIndex: 'serviceNum',
    slots: {
      customRender: 'serviceNum',
    },
  },
  {
    title: '服务单位',
    dataIndex: 'unit',
    slots: {
      customRender: 'unit',
    },
  },
  {
    title: '服务标准（单位/小时）',
    dataIndex: 'standard',
    slots: {
      customRender: 'standard',
    },
  },
  {
    title: '服务小时',
    dataIndex: 'serviceHours',
  },
  {
    title: '拟付酬金额',
    dataIndex: 'amount',
    slots: {
      customRender: 'amount',
    },
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 200,
    slots: {
      customRender: 'action',
    },
  },
];
const _data = [
  // {_data
];
import TeacherTree from '@/components/Teacher/TeacherTree/TeacherTree';
import moment from 'moment';
import { reactive, provide, ref, inject, onMounted, watch } from 'vue';
export default {
  props: {
    formTask: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  components: {
    TeacherTree,
  },
  name: 'TeacherTable',
  setup(props) {
    // const instance = getCurrentInstance();

    const dateFormat = 'YYYY/MM/DD';
    const state = reactive({
      visibleTeacher: false,
      datePicker: '',
      exitIndex: 0,
      formTask: undefined,
    });

    // 组件通信 更新数据
    const teacherList = ref(inject('teacherList'));

    const data = reactive(_data);
    watch(data, () => {
      teacherList.value = JSON.stringify(data);
      // teacherList.value = data;
      if (data.length > 0) {
        data[state.exitIndex].serviceHours =
          data[state.exitIndex].serviceNum * state.formTask.serviceStandard || 0;
      }
    });
    const visibleTeacher = ref(false);
    provide('visibleTeacher', visibleTeacher);
    const selectChange = (record, index) => {
      state.exitIndex = index;
      visibleTeacher.value = true;
    };
    // 修改当前 教师姓名和id
    const teacherChangeTree = ref([]);
    provide('teacherChangeTree', teacherChangeTree);
    watch(
      () => teacherChangeTree.value,
      () => {
        // console.log(teacherChangeTree.value);
      },
    );
    // 获取当前参与教师 时间
    const changeDate = e => {
      if (e) {
        // console.log(moment(e).format('YYYY-MM-DD'));
        // const d = moment(e).format('YYYY-MM-DD');
        const ind = state.exitIndex;
        // data[ind].date = d;
        data[ind].date = e;
      } else {
        const ind = state.exitIndex;
        data[ind].date = '';
      }
    };
    // 获取当前修改的时间位置
    const focusDate = e => {
      state.exitIndex = e;
    };
    let teacherTableData = ref(inject('teacherTableData'));

    watch(
      () => teacherTableData.value,
      () => {
        state.formTask = JSON.parse(teacherTableData.value);
        // console.log('===', state.formTask);
        data.forEach(item => {
          // console.log(item);
          if (!item.date) {
            // console.log('=====当前尚未选择时间===');
            item.date = !moment(state.formTask.serviceStartDate).unix()
              ? ''
              : moment(state.formTask.serviceStartDate).format('YYYY-MM-DD');
          }
          if (item.serviceNum === '') {
            item.serviceNum = state.formTask.serviceNum;
          }
        });
      },
    );

    onMounted(() => {
      // instance.proxy.$forceUpdate();
      // console.log(props.formTask);
      state.formTask = props.formTask;
    });

    const addTeacher = (ind, flag) => {
      if (flag === false) {
        data.splice(ind, 1);
      } else {
        data.push({
          name: '待招募',
          date: '',
          serviceNum: '',
          unit: '',
          standard: '',
          serviceHours: 0,
          id: '',
          amount: 0,
        });
      }
    };
    const focusServiceNum = ind => {
      // console.log(ind);
      state.exitIndex = ind;
    };
    // 教师 树形选择
    const treeOK = e => {
      // console.log(data, '=====', state.exitIndex);
      data[state.exitIndex].name = e[0].title;
      data[state.exitIndex].id = e[0].key;
      // console.log(e);
    };
    return {
      treeOK,
      addTeacher,
      focusServiceNum,
      focusDate,
      changeDate,
      dateFormat,
      visibleTeacher,
      state,
      columns,
      data,
      selectChange,
    };
  },
};
</script>

<style>
.ant-table td {
  /*white-space: nowrap;*/
}
</style>
