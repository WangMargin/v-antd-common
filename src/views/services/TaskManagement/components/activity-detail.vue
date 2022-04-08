<template>
  <div ref="replayDrawer" class="sycamore-detail-wrapper">
    <a-drawer
      :get-container="() => $refs.replayDrawer"
      placement="right"
      :closable="false"
      :visible="visible"
      :width="920"
      :destroy-on-close="true"
      :mask-closable="false"
      :zIndex="zIndex"
      :drawer-style="{ padding: '0 18px 18px', backgroundColor: '#ffffff' }"
      :header-style="{ padding: '16px 0' }"
      :body-style="{ border: '15px solid #E9E9E9', padding: '0', backgroundColor: '#E9E9E9' }"
    >
      <template #title>
        <a-space align="center">
          <img src="@/assets/logo.svg" alt="logo" width="32" />
          <span>教师公共服务</span>
        </a-space>
      </template>
      <a class="close" @click="onClose">
        <close-outlined :style="{ fontSize: '20px', color: '#FFFFFF' }" />
      </a>
      <a-card :bordered="false" :body-style="{ padding: '0' }" v-if="!loading" title="基础信息">
        <div style="padding: 18px 24px">
          <a-descriptions layout="vertical">
            <a-descriptions-item>
              <template #label>
                <span class="font-weight-200">服务类别</span>
              </template>
              <span class="font-weight-400">
                {{ state.activity && state.activity.rule.category }}
              </span>
            </a-descriptions-item>
            <a-descriptions-item>
              <template #label>
                <span class="font-weight-200">服务明细</span>
              </template>
              <span class="font-weight-400">
                {{ state.activity && state.activity.rule.detail }}
              </span>
            </a-descriptions-item>
            <a-descriptions-item>
              <template #label>
                <span class="font-weight-200">服务起止日期</span>
              </template>
              <span class="font-weight-400">
                {{ FormatTimestamp(state.activity && state.activity.start_time, 'YYYY-MM-DD') }} ~
                {{ FormatTimestamp(state.activity && state.activity.end_time, 'YYYY-MM-DD') }}
              </span>
            </a-descriptions-item>
            <a-descriptions-item>
              <template #label>
                <span class="font-weight-200">委托部门</span>
              </template>
              <span class="font-weight-400">
                {{ state.activity && state.activity.subject.name }}
              </span>
            </a-descriptions-item>
            <a-descriptions-item>
              <template #label>
                <span class="font-weight-200">当前状态</span>
              </template>
              <span class="font-weight-400">
                {{ state.activity && state.activity.status }}
              </span>
            </a-descriptions-item>
          </a-descriptions>
          <!--          <a-steps-->
          <!--            :current="detailInfo.currentStatusIndex"-->
          <!--            :status="detailInfo.stepStatus"-->
          <!--            style="margin-top: 20px"-->
          <!--          >-->
          <!--            <a-step title="创建">-->
          <!--              <template #description>-->
          <!--                <span-->
          <!--                  v-if="detailInfo.currentStatus === 'Draft'"-->
          <!--                  style="color: rgba(0, 0, 0, 0.45)"-->
          <!--                >-->
          <!--                  草稿-->
          <!--                </span>-->
          <!--              </template>-->
          <!--            </a-step>-->
          <!--            <a-step title="填报">-->
          <!--              <template #description>-->
          <!--                <span-->
          <!--                  v-if="-->
          <!--                    detailInfo.currentStatus === 'Published' ||-->
          <!--                    detailInfo.currentStatus === 'Failed'-->
          <!--                  "-->
          <!--                  style="color: rgba(0, 0, 0, 0.45)"-->
          <!--                >-->
          <!--                  编辑中-->
          <!--                </span>-->
          <!--              </template>-->
          <!--            </a-step>-->
          <!--            <a-step title="审核">-->
          <!--              <template #description>-->
          <!--                <span-->
          <!--                  v-if="detailInfo.currentStatus === 'Auditing'"-->
          <!--                  style="color: rgba(0, 0, 0, 0.45)"-->
          <!--                >-->
          <!--                  审核中-->
          <!--                </span>-->
          <!--                <span-->
          <!--                  v-if="detailInfo.currentStatus === 'Archived'"-->
          <!--                  style="color: rgba(0, 0, 0, 0.45)"-->
          <!--                >-->
          <!--                  已通过-->
          <!--                </span>-->
          <!--                <span v-if="detailInfo.currentStatus === 'Failed'" style="color: #bb133e">-->
          <!--                  已退回-->
          <!--                </span>-->
          <!--              </template>-->
          <!--            </a-step>-->
          <!--          </a-steps>-->
          <!--          <div v-if="savePermission && !isFiled" style="margin-top: 20px">-->
          <!--            <a-button-->
          <!--              type="primary"-->
          <!--              @click="editClick"-->
          <!--              v-if="permission === 'admin' || detailInfo.currentStatus !== 'Deleted'"-->
          <!--            >-->
          <!--              编辑-->
          <!--            </a-button>-->
          <!--            <a-button-->
          <!--              type="primary"-->
          <!--              @click="auditClick"-->
          <!--              v-if="itemStatus === 'Audit' && detailInfo.currentStatus === 'Published'"-->
          <!--              :style="{ marginLeft: '20px' }"-->
          <!--            >-->
          <!--              送审-->
          <!--            </a-button>-->
          <!--          </div>-->
        </div>
      </a-card>
      <a-card title="详细信息" v-if="!loading" :bordered="false" style="margin-top: 15px">
        <a-descriptions layout="vertical" bordered :column="2">
          <a-descriptions-item>
            <template #label>
              <span class="font-weight-200">教师职位要求</span>
            </template>
            <span
              class="font-weight-400"
              v-if="
                state.activity &&
                state.activity.requirement.positions &&
                state.activity.requirement.positions.length
              "
            >
              {{ state.activity.requirement.positions.join('、') }}
            </span>
            <span class="font-weight-400" v-else>无</span>
          </a-descriptions-item>
          <a-descriptions-item>
            <template #label>
              <span class="font-weight-200">教师职称要求</span>
            </template>
            <span
              class="font-weight-400"
              v-if="
                state.activity &&
                state.activity.requirement.job_title &&
                state.activity.requirement.job_title.length
              "
            >
              {{ state.activity.requirement.job_title.join('、') }}
            </span>
            <span class="font-weight-400" v-else>无</span>
          </a-descriptions-item>
          <a-descriptions-item>
            <template #label>
              <span class="font-weight-200">是否要求博导资格</span>
            </template>
            <span class="font-weight-400">
              {{ FormatBool(state.activity && state.activity.requirement.require_phd_supervisor) }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item>
            <template #label>
              <span class="font-weight-200">是否要求硕导资格</span>
            </template>
            <span class="font-weight-400">
              {{
                FormatBool(state.activity && state.activity.requirement.require_master_supervisor)
              }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item>
            <template #label>
              <span class="font-weight-200">是否要求党员</span>
            </template>
            <span class="font-weight-400">
              {{ FormatBool(state.activity && state.activity.requirement.require_party) }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item>
            <template #label>
              <span class="font-weight-200">需求服务数量</span>
            </template>
            <span class="font-weight-400">
              {{ state.activity && state.activity.service_amount }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item>
            <template #label>
              <span class="font-weight-200">服务单位</span>
            </template>
            <span class="font-weight-400">
              {{ state.activity && state.activity.rule.unit }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item>
            <template #label>
              <span class="font-weight-200">服务标准（单位/小时）</span>
            </template>
            <span class="font-weight-400">
              {{ state.activity && state.activity.rule.standard }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item>
            <template #label>
              <span class="font-weight-200">需要教师人数</span>
            </template>
            <span class="font-weight-400">
              {{ state.activity && state.activity.faculty_amount }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item>
            <template #label>
              <span class="font-weight-200">服务小时</span>
            </template>
            <span class="font-weight-400">
              {{ state.activity && state.activity.status }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item>
            <template #label>
              <span class="font-weight-200">是否付酬</span>
            </template>
            <span class="font-weight-400">
              {{ FormatBool(state.activity && state.activity.payment.has_payment) }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item>
            <template #label>
              <span class="font-weight-200">付酬标准</span>
            </template>
            <span
              class="font-weight-400"
              v-if="state.activity && state.activity.payment.has_payment"
            >
              {{ state.activity && state.activity.payment.standard }}
            </span>
            <span v-else>无</span>
          </a-descriptions-item>
          <a-descriptions-item :span="2">
            <template #label>
              <span class="font-weight-200">备注</span>
            </template>
            <span class="font-weight-400">
              {{ state.activity && (state.activity.remark || '-') }}
            </span>
          </a-descriptions-item>
        </a-descriptions>
      </a-card>
      <a-card title="参与教师" v-if="!loading" :bordered="false" style="margin-top: 15px">
        <a-table
          :columns="state.facultyColumns"
          :pagination="false"
          :datasrc="state.activity && state.activity.faculties"
        ></a-table>
      </a-card>
      <a-card title="操作信息" v-if="!loading" :bordered="false" style="margin-top: 15px">
        <a-table
          :columns="state.logColumns"
          :pagination="false"
          :datasrc="state.activity && state.activity.logs"
        ></a-table>
      </a-card>
    </a-drawer>
  </div>
</template>
<script>
import { defineComponent, reactive, ref, watchEffect } from 'vue';
import { message } from 'ant-design-vue';
import { CloseOutlined } from '@ant-design/icons-vue';
import { Activity } from '@/api/services.js';
import { FormatTimestamp, FormatBool } from '@/utils/filter.js';

const facultyColumns = [
  {
    title: '操作',
    dataIndex: 'type.value',
    width: '15%',
    ellipsis: true,
  },
  {
    title: '操作人',
    dataIndex: 'name',
    width: '20%',
    ellipsis: true,
  },
  {
    title: '时间',
    dataIndex: 'date',
    width: '25%',
  },
  {
    title: '详情',
    dataIndex: 'remark',
    slots: {
      customRender: 'remark',
    },
    width: '40%',
  },
];
const logColumns = [
  {
    title: '操作',
    dataIndex: 'type.value',
    width: '15%',
    ellipsis: true,
  },
  {
    title: '操作人',
    dataIndex: 'name',
    width: '20%',
    ellipsis: true,
  },
  {
    title: '时间',
    dataIndex: 'date',
    width: '25%',
  },
  {
    title: '详情',
    dataIndex: 'remark',
    slots: {
      customRender: 'remark',
    },
    width: '40%',
  },
];
export default defineComponent({
  name: 'ActivityDetail',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    zIndex: {
      type: Number,
      default: 1000,
    },
    title: {
      type: String,
      default: '',
    },
    // 活动ID
    id: {
      type: String,
      default: '',
    },
  },
  emits: ['close', 'edit', 'audit', 'ok'],
  setup(props, { emit }) {
    const loading = ref(true);
    const state = reactive({
      activity: null,
      facultyColumns: facultyColumns,
      logColumns: logColumns,
    });
    const onClose = () => {
      emit('close');
    };
    /** 获取活动详情 */
    const getActivity = () => {
      loading.value = true;
      Activity({ activity_id: props.id })
        .then(res => {
          loading.value = false;
          if (res.code === 200) {
            state.activity = res.data.data;
          } else {
            message.warn(res.msg);
          }
        })
        .catch(err => {
          loading.value = false;
          console.error('获取活动详情异常', err);
        });
    };

    watchEffect(() => {
      if (props.visible) {
        getActivity();
      }
    });

    return {
      state,
      loading,
      onClose,
      FormatTimestamp,
      FormatBool,
    };
  },
  components: {
    CloseOutlined,
  },
});
</script>
<style lang="less" scoped>
.sycamore-detail-wrapper ::v-deep(.ant-drawer-content-wrapper) {
  box-shadow: 0 0 0 transparent;
}
.sycamore-detail-wrapper ::v-deep(.ant-drawer-content) {
  padding-left: 30px;
  background-color: transparent;
}
.sycamore-detail-wrapper .close {
  position: absolute;
  top: 80px;
  left: 0;
  width: 30px;
  height: 30px;
  padding: 5px;
  background: #bb133e;
}
.font-weight-200 {
  /*color: #999999;*/
  font-weight: 200;
}
.font-weight-400 {
  color: #000000;
  font-weight: 500;
}
</style>
