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
      :body-style="{ border: '15px solid #E9E9E9', padding: '0' }"
    >
      <template #title>
        <a-space align="center">
          <img src="@/assets/logo.svg" alt="logo" width="32" />
          <span>{{ title }}</span>
        </a-space>
      </template>
      <a class="close" @click="onClose">
        <close-outlined :style="{ fontSize: '20px', color: '#FFFFFF' }" />
      </a>
      <a-card :bordered="false" :body-style="{ padding: '0' }" v-if="!loading">
        <div style="padding: 18px 24px">
          <a-descriptions title="基础信息" layout="vertical">
            <a-descriptions-item>
              <template #label>
                <span class="font-weight-200">创建主体</span>
              </template>
              <span class="font-weight-400">{{ detailInfo.base_info.create_subject }}</span>
            </a-descriptions-item>
            <a-descriptions-item>
              <template #label>
                <span class="font-weight-200">创建时间</span>
              </template>
              <span class="font-weight-400">{{ detailInfo.base_info.create_time }}</span>
            </a-descriptions-item>
            <a-descriptions-item>
              <template #label>
                <span class="font-weight-200">所属年份</span>
              </template>
              <span class="font-weight-400">{{ detailInfo.base_info.year }}</span>
            </a-descriptions-item>
            <a-descriptions-item>
              <template #label>
                <span class="font-weight-200">成果所属的本院教师及博士后、研究中心</span>
              </template>
              <span class="font-weight-400">{{ detailInfo.base_info.relation_subject }}</span>
            </a-descriptions-item>
          </a-descriptions>
          <a-steps
            :current="detailInfo.currentStatusIndex"
            :status="detailInfo.stepStatus"
            style="margin-top: 20px"
          >
            <a-step title="创建">
              <template #description>
                <span
                  v-if="detailInfo.currentStatus === 'Draft'"
                  style="color: rgba(0, 0, 0, 0.45)"
                >
                  草稿
                </span>
              </template>
            </a-step>
            <a-step title="填报">
              <template #description>
                <span
                  v-if="
                    detailInfo.currentStatus === 'Published' ||
                    detailInfo.currentStatus === 'Failed'
                  "
                  style="color: rgba(0, 0, 0, 0.45)"
                >
                  编辑中
                </span>
              </template>
            </a-step>
            <a-step title="审核">
              <template #description>
                <span
                  v-if="detailInfo.currentStatus === 'Auditing'"
                  style="color: rgba(0, 0, 0, 0.45)"
                >
                  审核中
                </span>
                <span
                  v-if="detailInfo.currentStatus === 'Archived'"
                  style="color: rgba(0, 0, 0, 0.45)"
                >
                  已通过
                </span>
                <span v-if="detailInfo.currentStatus === 'Failed'" style="color: #bb133e">
                  已退回
                </span>
              </template>
            </a-step>
          </a-steps>
          <div v-if="savePermission && !isFiled" style="margin-top: 20px">
            <a-button
              type="primary"
              @click="editClick"
              v-if="permission === 'admin' || detailInfo.currentStatus !== 'Deleted'"
            >
              编辑
            </a-button>
            <a-button
              type="primary"
              @click="auditClick"
              v-if="itemStatus === 'Audit' && detailInfo.currentStatus === 'Published'"
              :style="{ marginLeft: '20px' }"
            >
              送审
            </a-button>
          </div>
        </div>
        <div style="padding: 18px 24px; border-top: 15px solid #e9e9e9">
          <a-descriptions
            layout="vertical"
            :bordered="false"
            :column="2"
            size="middle"
            title="填报信息"
            :labelStyle="{ background: '#ffffff' }"
          >
            <template v-for="(data, index) in detailInfo.data_info" :key="index">
              <a-descriptions-item :span="data.scene_layout.column" style="width: 50%">
                <template #label>
                  <span class="font-weight-200">{{ data.label }}</span>
                </template>
                <template v-if="data.value">
                  <template v-if="data.formatter.type === 'Object'">
                    <a-descriptions
                      layout="vertical"
                      bordered
                      :column="2"
                      size="small"
                      style="margin: 0 -12px"
                    >
                      <template v-for="(val, k) in data.value" :key="k">
                        <a-descriptions-item
                          :label="val.label"
                          :span="val.scene_layout.column"
                          style="width: 50%"
                        >
                          <template v-if="val.value">
                            <div
                              style="white-space: pre-line; width: 280px"
                              v-html="val.value"
                            ></div>
                          </template>
                          <template v-else>-</template>
                        </a-descriptions-item>
                      </template>
                    </a-descriptions>
                  </template>
                  <template v-else>
                    <div style="white-space: pre-line; width: 330px" v-html="data.value"></div>
                  </template>
                </template>
                <template v-else>-</template>
              </a-descriptions-item>
            </template>
          </a-descriptions>
        </div>
        <div
          style="padding: 0 24px 18px; border-top: 15px solid #e9e9e9"
          v-if="
            detailInfo.log.length > 0 ||
            (permission === 'admin' && detailInfo.currentStatus === 'Auditing')
          "
        >
          <a-card
            :bordered="false"
            :body-style="{ padding: '0' }"
            :head-style="{ padding: '0' }"
            :title="'审核信息'"
            v-if="detailInfo.log.length > 0"
          >
            <a-table
              :row-key="record => record.id"
              :columns="columns"
              :data-source="detailInfo.log"
              size="middle"
              :pagination="false"
            >
              <template #remark="{ text, record }">
                <template v-if="record.type.key === 'Update' || record.type.key === 'UpdateDraft'">
                  <div
                    style="white-space: pre-line; width: 280px"
                    v-for="(diff, index) in record.update_data_desc"
                    :key="index"
                  >
                    {{ diff.label }}从{{ diff.old }}修改为{{ diff.new }}；
                  </div>
                </template>
                <template v-else>
                  <div style="white-space: pre-line; width: 280px" v-if="text">{{ text }}</div>
                  <span v-else>-</span>
                </template>
              </template>
            </a-table>
          </a-card>
          <div
            style="margin-top: 20px"
            v-if="permission === 'admin' && detailInfo.currentStatus === 'Auditing' && !isFiled"
          >
            <a-button
              type="primary"
              @click="examineHandle('Archived')"
              :style="{ marginRight: '20px' }"
            >
              通过
            </a-button>
            <a-button type="primary" @click="examineHandle('Failed')">驳回</a-button>
          </div>
        </div>
      </a-card>
    </a-drawer>
  </div>
  <!-- 驳回删除填写意见 -->
  <examine-reject
    v-bind="examineRejectModal"
    @close="examineRejectClose"
    @ok="examineRejectOk"
  ></examine-reject>
</template>
<script>
import { defineComponent, reactive, ref, watchEffect } from 'vue';
import { viewDetailSycamore, viewDetailFiledSycamore } from '@/api/dynamic/dynamic.js';
import { CloseOutlined } from '@ant-design/icons-vue';
import { moneyTransform } from '@/utils/common.js';
import { useRouter } from 'vue-router';
import ExamineReject from '@/views/task/components/examine-reject.vue';
const columns = [
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
  name: 'Detail',
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
    // 成果id
    id: {
      type: String,
      default: '',
    },
    record: {
      type: Object,
      default: () => {},
    },
    // 管理员还是操作员
    permission: {
      type: String,
      default: '',
    },
    // 是否有编辑送审权限
    savePermission: {
      type: Boolean,
      default: false,
    },
    // 当前统计项状态
    itemStatus: {
      type: String,
      default: '',
    },
    // 当前统计项id 点击详情时使用
    categoryId: {
      type: String,
      default: '',
    },
    // 数据是否是归档数据 任务详情用到
    isFiled: {
      type: Boolean,
      default: false,
    },
    // 任务详情数据列表点击归档数据详情用到
    taskId: {
      type: String,
      default: '',
    },
  },
  emits: ['close', 'edit', 'audit', 'ok'],
  setup(props, { emit }) {
    const loading = ref(true);
    const detailInfo = reactive({
      stepStatus: 'finish',
      currentStatusIndex: 0,
      currentStatus: '',
    });
    const splitDataHandle = (val, spl, type) => {
      const dataArr = spl && val.includes(spl) ? val.split(spl) : [val];
      let hHtml = '';
      dataArr.map(item => {
        if (type === 'Image' || type === 'File') {
          hHtml += `<a href="${item}" target="_blank">查看</a>`;
        }
        if (type === 'Link') {
          hHtml += `<a href="${item}" target="_blank">链接</a>`;
        }
        if (type === 'Link_mail') {
          hHtml += `<a href="mailto:${item}" target="_blank">${item}</a>`;
        }
      });
      return hHtml;
    };
    const dataHandleInfo = data => {
      data.map(k => {
        if (Object.keys(k.formatter).length > 0) {
          switch (k.formatter.type) {
            case 'Image':
            case 'File':
            case 'Link':
            case 'Link_mail':
              k.value = k.value
                ? splitDataHandle(k.value, k.formatter.split_str, k.formatter.type)
                : '-';
              break;
            case 'Money':
              k.value = k.value ? moneyTransform(k.value) : '-';
              break;
            case 'Object':
              k.value = dataHandleInfo(k.value);
              break;
          }
        }
      });
      return data;
    };
    const getDetailDataCallback = res => {
      const data = res.data;
      detailInfo.currentStatus = data.base_info.status.key;
      data.data_info = dataHandleInfo(data.data_info);
      Object.assign(detailInfo, data);
      switch (res.data.base_info.status.key) {
        case 'Draft':
          detailInfo.currentStatusIndex = 0;
          detailInfo.stepStatus = 'process';
          break;
        case 'Published':
          detailInfo.currentStatusIndex = 1;
          detailInfo.stepStatus = 'process';
          break;
        case 'Auditing':
          detailInfo.currentStatusIndex = 2;
          detailInfo.stepStatus = 'process';
          break;
        case 'Archived':
          detailInfo.currentStatusIndex = 2;
          detailInfo.stepStatus = 'finish';
          break;
        case 'Failed':
          detailInfo.currentStatusIndex = 1;
          detailInfo.stepStatus = 'finish';
          break;
      }
      loading.value = false;
    };
    const getDetailData = () => {
      loading.value = true;
      if (props.isFiled) {
        viewDetailFiledSycamore(props.id, props.taskId)
          .then(res => {
            getDetailDataCallback(res);
          })
          .catch(() => {});
      } else {
        viewDetailSycamore(props.id)
          .then(res => {
            getDetailDataCallback(res);
          })
          .catch(() => {});
      }
    };
    watchEffect(() => {
      if (props.visible) {
        Object.assign(detailInfo, {});
        getDetailData();
      }
    });
    const onClose = () => {
      emit('close');
    };
    // 编辑
    const router = useRouter();
    const editClick = () => {
      emit('edit');
      const path = props.categoryId
        ? `/researchdata/edit/${props.categoryId}/${props.record.id}`
        : `/researchdata/edit/${props.record.category.id}/${props.record.id}`;
      router.push({
        path: path,
      });
    };
    // 送审
    const auditClick = () => {
      emit('audit', props.record);
    };
    const examineRejectModal = reactive({
      visible: false,
      id: null,
      type: '',
      zIndex: 1003,
    });
    const examineRejectClose = () => {
      examineRejectModal.visible = false;
    };
    const examineRejectOk = () => {
      emit('ok');
      examineRejectClose();
    };
    // 通过驳回按钮点击
    const examineHandle = status => {
      examineRejectModal.visible = true;
      examineRejectModal.id = props.id;
      examineRejectModal.type = status;
    };
    return {
      loading,
      detailInfo,
      onClose,
      columns,
      examineHandle,
      editClick,
      auditClick,
      examineRejectModal,
      examineRejectClose,
      examineRejectOk,
    };
  },
  components: {
    CloseOutlined,
    ExamineReject,
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
  color: #999999;
  font-weight: 200;
}
.font-weight-400 {
  color: #000000;
  font-weight: 500;
}
</style>
