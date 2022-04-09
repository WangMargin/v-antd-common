<template>
  <div>
    <a-row :gutter="[15, 15]" :wrap="state.wrap">
      <a-col :span="((24-requireSpan) === 0 ? 24 : (24-requireSpan))">
        <a-card>
          <template #title>填写基础信息</template>
          <template #extra>
            <a-button type="link" @click="changeSpan(8)">师资要求填写</a-button>
          </template>
          <div>
            <a-form ref="taskRef" layout="vertical" :model="formTask" :rules="rulesTask">
              <a-row :gutter="[20, 10]">
                <a-col :xs="24" :sm="24" :md="12" :xl="12">
                  <a-form-item name="serviceType">
                    <template #label>服务类别</template>
                    <a-select
                      placeholder="请选择服务类别"
                      :options="state.typeOptions"
                      v-model:value="formTask.serviceType"
                      @change="formatServiceType"
                      style="width: 100%"
                      block
                    ></a-select>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="12">
                  <a-form-item name="serviceDetail">
                    <template #label>服务明细</template>
                    <a-select
                      :disabled="!formTask.serviceType"
                      placeholder="请选择服务明细"
                      :options="state.detailOptions"
                      v-model:value="formTask.serviceDetail"
                      @change="changeServicesDetail"
                      style="width: 100%"
                      block
                    ></a-select>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="12">
                  <a-form-item name="serviceStartDate">
                    <template #label>服务开始日期</template>
                    <a-date-picker
                      show-time
                      :disabled-date="disabledFnStart"
                      placeholder="请选择服务开始日期"
                      v-model:value="formTask.serviceStartDate"
                      inputReadOnly
                      valueFormat="YYYY-MM-DD HH:mm:ss"
                      style="width: 100%"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="12">
                  <a-form-item name="serviceEndDate">
                    <template #label>服务结束日期</template>
                    <a-date-picker
                      :disabled-date="disabledFnEnd"
                      show-time
                      valueFormat="YYYY-MM-DD HH:mm:ss"
                      inputReadOnly
                      placeholder="请选择服务结束日期"
                      v-model:value="formTask.serviceEndDate"
                      style="width: 100%"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="12">
                  <a-form-item name="serviceNum">
                    <template #label>需求服务数量</template>
                    <a-input-number
                      :min="0"
                      v-model:value="formTask.serviceNum"
                      placeholder="请填写需求服务数量"
                      style="width: 100%"
                    ></a-input-number>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="12">
                  <a-form-item>
                    <template #label>服务单位</template>
                    <a-space>{{ formTask.serviceUnit }}</a-space>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="12">
                  <a-form-item name="serviceStandard">
                    <template #label>服务标准（小时）</template>
                    <a-space block placeholder="服务标准（小时）" style="width: 100%">
                      {{ formTask.serviceStandard }}
                    </a-space>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="12">
                  <a-form-item name="serviceWorkload">
                    <template #label>服务工作量（小时）</template>
                    <a-space block placeholder="服务工作量（小时）" style="width: 100%">
                      {{ formTask.serviceWorkload }}
                    </a-space>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="12">
                  <a-form-item name="serviceReward">
                    <template #label>是否付酬</template>
                    <a-radio-group v-model:value="formTask.serviceReward">
                      <a-radio :value="true" key="true">付酬</a-radio>
                      <a-radio :value="false" key="false">不付酬</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="12" v-if="formTask.serviceReward">
                  <a-form-item name="servicePaymentStandard">
                    <template #label>付酬标准</template>
                    <a-select
                      v-model:value="formTask.servicePaymentStandard"
                      v-if="state.Resource"
                      placeholder="请选择付酬标准"
                    >
                      <a-select-option
                        v-for="item in state.Resource.payment_standard"
                        :value="item"
                        :key="item"
                      >
                        {{ item }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="24" :xl="24">
                  <a-form-item name="serviceNote">
                    <template #label>备注</template>
                    <a-textarea
                      v-model:value="formTask.serviceNote"
                      placeholder="请填写备注..."
                      :rows="4"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="24" :xl="24" v-if="false">
                  <a-form-item>
                    <div style="text-align: center" class="mg-t15">
                      <a-button @click="resetTaskForm" type="primary" ghost>重置</a-button>
                      <a-button @click="submitTaskForm" type="primary" class="mg-l10">
                        提交
                      </a-button>
                    </div>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div>
        </a-card>
      </a-col>
      <a-col :span="requireSpan">
        <div style="background: #ffffff; height: 100%">
          <require-module></require-module>
        </div>
      </a-col>
    </a-row>
    <a-card style="" class="mg-t15">
      <template #title>
        参与教师
        <span style="color: #444; font-size: 14px; margin-left: 20px">
          ( {{ formTask.serviceTeacherNum }} 人 )
        </span>
      </template>
      <template #extra>
        <a-button type="link" @click="handleApplyStatus">查看报名情况</a-button>
      </template>
      <div>
        <teacher-table-module :formTask="formTask"></teacher-table-module>
      </div>
    </a-card>
    <!--    提交-->
    <div style="text-align: center; padding-top: 50px" class="mg-t15">
      <a-button @click="resetTaskForm" type="primary" ghost>取消</a-button>
      <a-button @click="submitTaskForm" type="primary" class="mg-l10">提交</a-button>
    </div>
    <!--    本院教师报名情况-->
    <a-modal
      title="本院教师报名情况"
      centered
      :destroyOnClose="true"
      :footer="null"
      :visible="state.visibleApply"
      @cancel="state.visibleApply = !state.visibleApply"
    >
      <apply-table></apply-table>
    </a-modal>
  </div>
</template>

<script>
import { isMobileClient } from '@/utils/judge';
import { reactive, onMounted, ref, defineComponent, provide, watch } from 'vue';
import RequireModule from './module/Require';
import { Modal, message } from 'ant-design-vue';
import TeacherTableModule from './module/TeacherTable';
import ApplyTable from './module/ApplyTable';
import { STORAGE_USER_CURRENT_SUBJECT } from '@/store/mutation-type.js';
import ls from '@/utils/local-storage.js';
import { DepartmentRules, Resource, ActivityCreat } from '@/api/services.js';
import { useRouter } from 'vue-router';
import moment from 'moment';
export default defineComponent({
  name: 'index',
  components: {
    RequireModule,
    TeacherTableModule,
    ApplyTable,
  },
  setup() {
    const router = useRouter();
    const taskRef = ref();
    const formTask = reactive({
      serviceType: '',
      serviceDetail: '',
      serviceStandard: '-',
      servicePaymentStandard: '',
      serviceWorkload: '-',
      serviceReward: '',
      serviceTeacherNum: 0,
      serviceStartDate: '',
      serviceEndDate: '',
      serviceNum: '',
      serviceUnit: '-',
      serviceNote: '',
    });
    const rulesTask = {
      serviceType: [
        {
          required: true,
          trigger: 'blur',
          // type: 'string',
          message: '请检查填写是否正确',
        },
      ],
      serviceDetail: [
        {
          required: true,
          trigger: 'blur',
          message: '请检查填写是否正确',
        },
      ],
      serviceStartDate: [
        {
          required: true,
          trigger: 'change',
          type: 'string',
          message: '请选择服务开始日期',
        },
      ],
      serviceEndDate: [
        {
          required: true,
          trigger: 'change',
          type: 'string',
          message: '请选择服务结束日期',
        },
      ],
      serviceNum: [
        {
          required: true,
          trigger: 'blur',
          type: 'number',
          message: '需求服务数量',
        },
      ],
      serviceTeacherNum: [
        {
          required: false,
          trigger: 'blur',
          type: 'number',
          message: '请填写需要教师人数',
        },
      ],
      serviceReward: [
        {
          required: true,
          type: 'boolean',
          trigger: 'change',
          message: '是否付酬',
        },
      ],
      servicePaymentStandard: [
        {
          required: true,
          trigger: 'blur',
          message: '请确定付酬标准',
        },
      ],
      serviceNote: [
        {
          required: false,
          trigger: 'blur',
          message: '请填写备注信息',
        },
      ],
    };
    // 师资要求 数据
    let requireData = ref();
    let json_requireData = ref();
    provide('requireData', requireData);
    watch(
      () => requireData.value,
      () => {
        json_requireData.value = JSON.parse(requireData.value);
        // console.log(json_requireData);
      },
    );
    const state = reactive({
      facultiesJson: {
        name: '', // 教师姓名
        id: '', // 教师主体id
        service_date: '', // 教师 服务日期
        service_amount: '', // 教师 服务数量
        payment_amount: '', // 拟付报酬金额
      }, // 参与教师信息
      faculties: [],
      Resource: undefined, // 右侧资源列表信息
      wrap: false,
      visibleApply: false,
      typeOptions: [], // 服务类别 options
      detailOptions: [{ label: '01', value: '测试value' }], // 服务明细 options
      serviceDetailDisabled: true, // 服務明细 禁用
    });
    // 开启、关闭 右侧师资要求
    const requireSpan = ref(8);
    provide('changeSpan', requireSpan);

    const changeSpan = n => {
      if (isMobileClient()) {
        requireSpan.value = n === 0 ? 0 : 24;
      } else {
        requireSpan.value = n;
      }
    };

    // 参与教师 数据提交
    const faculties = ref();
    provide('teacherList', faculties);
    watch(
      () => faculties.value,
      () => {
        // console.log(faculties.value);
        let data = JSON.parse(faculties.value);
        formTask.serviceTeacherNum = data.length;
      },
    );

    // 过滤 教师填写 数据
    const formatTeacherList = data => {
      let list = JSON.parse(data);
      let format_list = [];
      list.forEach(item => {
        format_list.push({
          name: item.name, // 教师姓名
          id: item.id, // 教师主体id
          service_date: item.date, // 教师 服务日期
          service_amount: item.serviceNum, // 教师 服务数量
          payment_amount: item.amount, // 拟付报酬金额
        });
      });
      return format_list;
    };

    // 提交信息 创建活动
    const submitTaskForm = () => {
      taskRef.value
        .validate()
        .then(() => {
          if (formTask.serviceTeacherNum < 1) {
            message.warning('教师需求人数不得1人');
            return;
          } else {
            const data = formatTeacherList(faculties.value);

            let flag = false;
            data.forEach(item => {
              if (!item.id) {
                flag = true;
              }
            });
            if (flag) {
              message.warning('请检查是否指定教师');
            }
          }
          let params = {
            rule_id: formTask.serviceDetail, // 活动规则id
            start_time: formTask.serviceStartDate, // 服务开始时间
            end_time: formTask.serviceEndDate, // 服务结束时间
            service_amount: formTask.serviceNum, // 服务需求数量
            faculty_amount: formTask.serviceTeacherNum, // 教师需求人数
            payment: {
              has_payment: formTask.serviceReward, // 是否付酬
              standard: formTask.servicePaymentStandard, // 付酬标准
            }, // 付酬信息
            requirement: {
              positions: json_requireData.value ? json_requireData.value.position : [], // 职务要求
              job_title: json_requireData.value ? [json_requireData.value.require] : [], // 职称要求
              require_phd_supervisor: json_requireData.value
                ? json_requireData.value.doctor
                : undefined, // 是否要求博导资格 boolean
              require_master_supervisor: json_requireData.value
                ? json_requireData.value.degreeStatus
                : undefined, // 是否要求领导资格 boolean
              require_party: json_requireData.value
                ? json_requireData.value.partyMember
                : undefined, // 是否要求党员 boolean
            }, // 附属要求
            comment: formTask.serviceNote, // 备注
            faculties: formatTeacherList(faculties.value),
          };
          ActivityCreat(params)
            .then(res => {
              if (res.code === 200) {
                Modal.success({
                  title: res.msg,
                  onOk: function () {
                    router.go(0);
                  },
                });
              }
            })
            .catch(err => {
              console.error(err);
              message.error('请检查指定教师数据是否填写正确！');
            });
        })
        .catch(err => {
          console.error(err);
        });
    };
    const resetTaskForm = () => {
      taskRef.value.resetFields();
    };
    const formatServiceType = e => {
      formTask.serviceDetail = undefined;
      formTask.serviceStandard = '-';
      formTask.serviceUnit = '-';
      formatOptions(e);
    };
    let teacherTableData = ref();
    provide('teacherTableData', teacherTableData);
    // 服务需求数量 * 服务标准 = 服务工作量
    watch(formTask, () => {
      // 切换付酬状态  更改付酬标准信息
      teacherTableData.value = JSON.stringify(formTask);

      if (formTask.serviceStandard > 0 && formTask.serviceNum > 0) {
        formTask.serviceWorkload =
          (parseFloat(formTask.serviceNum * 100) * parseFloat(formTask.serviceStandard * 100)) /
          10000;
      }
    });

    // 选择 服务明细
    const changeServicesDetail = e => {
      for (let i in state.detailOptions) {
        if (state.detailOptions[i].value === e) {
          formTask.serviceStandard = state.detailOptions[i].detail.standard;
          formTask.serviceUnit = state.detailOptions[i].detail.unit;
        }
      }
    };
    // 格式化options格式
    const formatOptions = str => {
      state.detailOptions = [];
      for (let i in state.typeOptions) {
        if (state.typeOptions[i].label === str) {
          for (let j in state.typeOptions[i].list) {
            // console.log(state.typeOptions[i], j);
            state.detailOptions.push({
              label: j,
              value: state.typeOptions[i].list[j].id,
              detail: state.typeOptions[i].list[j],
            });
          }
        }
      }
      // console.log(state.detailOptions);
    };
    // 获取资源列表
    let Resource_ = ref();
    provide('ResourceData', Resource_); // 同步至 右侧 师资要求 组件
    const getResource = () => {
      Resource()
        .then(res => {
          // console.log(res, '====获取资源列表 信息');
          // state.Resource = ['不付酬'];
          Resource_.value = res.data;
          state.Resource = res.data;
        })
        .catch(err => {
          console.error(err);
        });
    };
    // 获取当前服务类别&服务明细信息
    const getServiceData = () => {
      const current = ls.get(STORAGE_USER_CURRENT_SUBJECT);
      const param = {
        department_id: current.id,
      };
      DepartmentRules(param)
        .then(res => {
          // 格式化服务类别 为 select 的 options 数据
          const d = res.data;
          state.typeOptions = [];
          for (let i in d) {
            state.typeOptions.push({
              label: i,
              value: i,
              list: d[i],
            });
          }
          // state.typeOptions = res.data;
        })
        .catch(err => {
          console.error(err);
        });
    };

    onMounted(() => {
      getServiceData();
      getResource();
      if (isMobileClient()) {
        state.wrap = true;
      }
      if (isMobileClient()) {
        requireSpan.value = 24;
      }
    });
    const handleApplyStatus = () => {
      state.visibleApply = true;
    };
    const disabledFnEnd = current => {
      return moment(current).unix() < moment(formTask.serviceStartDate).unix();
    };
    const disabledFnStart = current => {
      return moment(current).unix() > moment(formTask.serviceEndDate).unix();
    };
    return {
      disabledFnEnd,
      disabledFnStart,
      Resource_,
      changeServicesDetail,
      formatServiceType,
      handleApplyStatus,
      requireSpan,
      resetTaskForm,
      formTask,
      rulesTask,
      state,
      taskRef,
      submitTaskForm,
      changeSpan,
    };
  },
});
</script>

<style scoped></style>
