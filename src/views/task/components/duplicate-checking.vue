<template>
  <a-modal
    :visible="visible"
    title="数据审核"
    :width="1080"
    @ok="handleClose"
    @cancel="handleClose"
    :footer="null"
  >
    <a-card :bordered="false" :body-style="{ border: '15px solid #E9E9E9', padding: '0' }">
      <a-card :bordered="false" title="当前成果" :body-style="{ padding: '24px 24px 0 24px' }">
        <a-row type="flex" :gutter="20">
          <a-col flex="auto">
            <div>
              {{ state.summary.name }}
            </div>
            <div style="color:rgba(0,0,0,.45);">
              <template v-if="source === 'achievement'">
                <span>{{ state.createSubject }}</span>
                <template v-for="(subject, idx) in state.relationSubject" :key="idx">
                  <span>; {{ subject }}</span>
                </template>
              </template>
              <template v-else>
                <span v-if="state.summary.created_by.subject === null">
                  管理员({{ state.summary.created_by.name }})
                </span>
                <span v-else>
                  {{ state.summary.created_by.subject.name }}({{ state.summary.created_by.name }})
                </span>
                <template v-for="(subject, idx) in state.summary.subjects" :key="idx">
                  <span
                    v-if="
                      !state.summary.created_by.subject ||
                        subject.id !== state.summary.created_by.subject.id
                    "
                  >
                    ; {{ subject.name }}
                  </span>
                </template>
              </template>
            </div>
          </a-col>
          <a-col>
            <div style="margin-right:20px;">
              <span style="color:rgba(0,0,0,.45);display:block;">统计项目</span>
              <template v-if="source === 'achievement'">
                {{ categoryTitle }}
              </template>
              <template v-else>
                {{ state.summary.category.name }}
              </template>
            </div>
          </a-col>
          <a-col>
            <div style="margin-right:20px;">
              <span style="color:rgba(0,0,0,.45);display:block;">状态</span>
              {{ state.summary.status.value }}
            </div>
          </a-col>
        </a-row>
      </a-card>
      <a-divider />
      <a-row type="flex" style="margin-bottom:24px;">
        <a-col flex="auto"></a-col>
        <a-col>
          <a-button
            type="primary"
            ghost
            style="margin-right:20px;"
            @click="viewDetailsClick(state.summary)"
          >
            详情
          </a-button>
          <a-button
            type="primary"
            style="margin-right:20px;"
            @click="viewDetailsExamineClick('Archived', state.summary.id)"
          >
            通过
          </a-button>
          <a-button
            type="primary"
            ghost
            style="margin-right:20px;"
            @click="viewDetailsExamineClick('Del', state.summary.id)"
          >
            删除
          </a-button>
          <a-button
            type="primary"
            ghost
            style="margin-right:20px;"
            @click="viewDetailsExamineClick('Failed', state.summary.id)"
          >
            驳回
          </a-button>
        </a-col>
      </a-row>
      <a-card
        :bordered="false"
        title="查重成果"
        :body-style="{ padding: '24px 24px 0 24px' }"
        :head-style="{ borderTop: '15px solid #E9E9E9' }"
      >
        <div style="max-height:260px;overflow-y:auto;">
          <a-list
            item-layout="horizontal"
            :loading="state.loading"
            :data-source="state.list"
            class="duplicate-list"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta>
                  <template #title>
                    <div v-html="item.highlight"></div>
                  </template>
                  <template #description>
                    <span v-if="item.data.created_by.subject === null">
                      管理员({{ item.data.created_by.name }})
                    </span>
                    <span v-else>
                      {{ item.data.created_by.subject.name }}({{ item.data.created_by.name }})
                    </span>
                    <template v-for="(subject, idx) in item.data.subjects" :key="idx">
                      <span v-if="subject.id !== item.data.created_by.subject.id">
                        ; {{ subject.name }}
                      </span>
                    </template>
                  </template>
                </a-list-item-meta>
                <template #extra>
                  <div class="duplicate-right">
                    <a-space align="center">
                      <div class="list-content-item" style="width:120px;">
                        <span>统计项目</span>
                        <p :title="`${item.data.category.name}`">{{ item.data.category.name }}</p>
                      </div>
                      <div class="list-content-item" style="width:60px;">
                        <span>状态</span>
                        <p>{{ item.data.status.value }}</p>
                      </div>
                      <div class="list-content-item" style="width:60px;">
                        <span>相似度</span>
                        <p>{{ item.percentage }}</p>
                      </div>
                      <div class="list-content-item" style="width:72px;">
                        <a-button
                          type="link"
                          size="small"
                          @click="CheckListViewDetailsClick(item.data)"
                          :disabled="item.data.status.key === 'Deleted' ? true : false"
                        >
                          详情
                        </a-button>
                        <a-button
                          type="link"
                          size="small"
                          :disabled="item.data.status.key === 'Auditing' ? false : true"
                          @click="CheckListExamineClick('Archived', item.data.id)"
                        >
                          通过
                        </a-button>
                        <a-dropdown :trigger="['click']">
                          <template #overlay>
                            <a-menu>
                              <a-menu-item
                                :key="'Failed'"
                                :disabled="item.data.status.key === 'Auditing' ? false : true"
                                @click="CheckListExamineClick('Failed', item.data.id)"
                              >
                                <a-button
                                  type="link"
                                  size="small"
                                  :disabled="item.data.status.key === 'Auditing' ? false : true"
                                >
                                  驳回
                                </a-button>
                              </a-menu-item>
                              <a-menu-item
                                :key="'Del'"
                                :disabled="item.data.status.key === 'Deleted' ? true : false"
                                @click="CheckListExamineClick('Del', item.data.id)"
                              >
                                <a-button
                                  type="link"
                                  size="small"
                                  :disabled="item.data.status.key === 'Deleted' ? true : false"
                                >
                                  删除
                                </a-button>
                              </a-menu-item>
                            </a-menu>
                          </template>
                          <a-button type="link" size="small">更多</a-button>
                        </a-dropdown>
                      </div>
                    </a-space>
                  </div>
                </template>
              </a-list-item>
            </template>
          </a-list>
        </div>
        <a-space align="start" :size="10" style="margin-top:20px;">
          <exclamation-circle-filled
            :style="{ color: '#BB133E', fontSize: '16px' }"
          ></exclamation-circle-filled>
          <p style="color:rgba(0,0,0,.45);">
            提示：
            <br />
            1.
            查重的结果按“相似度”由高到低排序。请注意成果的所属分类，不同分类下可能存在两项相同的成果数据。
            <br />
            2. 相似度较低的数据，系统默认隐藏。
          </p>
        </a-space>
      </a-card>
    </a-card>
  </a-modal>
  <!-- 详情页 -->
  <sycamore-detail
    v-bind="detailDrawer"
    @close="viewDetailsClose"
    @ok="viewDetailsExamineClickOk"
    @edit="viewDetailEdit"
  ></sycamore-detail>
  <!-- 驳回删除填写意见 -->
  <examine-reject
    v-bind="examineRejectModal"
    @close="examineRejectClose"
    @ok="examineRejectOk"
  ></examine-reject>
</template>
<script>
import { defineComponent, watchEffect, reactive, computed, toRaw } from 'vue';
import { duplicateCheckNew } from '@/api/form/basic-form.js';
import { ExclamationCircleFilled } from '@ant-design/icons-vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import ExamineReject from '@/views/task/components/examine-reject.vue';
import SycamoreDetail from '@/views/dynamic/components/sycamore-detail.vue';
import { viewDetailSycamore } from '@/api/dynamic/dynamic.js';
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    checkData: {
      type: Object,
      default: () => {},
    },
    categoryType: {
      type: String,
      default: '',
    },
    // 高级筛选点击审核
    source: {
      type: String,
      default: '',
    },
    // 高级筛选点击审核 传参
    categoryTitle: {
      type: String,
      default: '',
    },
  },
  emits: ['close', 'edit', 'examine', 'delete'],
  components: {
    ExclamationCircleFilled,
    ExamineReject,
    SycamoreDetail,
  },
  setup(props, { emit }) {
    const store = useStore();
    const resourcesData = computed(() => store.getters[`resources/data`]);
    const subjectsResource = resourcesData.value.resources;
    const state = reactive({
      loading: false,
      list: [],
      name: '',
      summary: {},
      createSubject: '',
      relationSubject: [],
    });
    const handleClose = () => {
      emit('close');
    };
    // 获取详情数据
    const getDetailData = id => {
      viewDetailSycamore(id)
        .then(res => {
          const info = res.data.base_info;
          state.createSubject = info.create_subject;
          if (info.relation_subject && info.relation_subject.indexOf(';') > -1) {
            const createName = info.create_subject.split('(')[0];
            const relationArr = info.relation_subject.split('; ');
            const newRealtionArr = relationArr.filter(k => k !== createName);
            state.relationSubject = newRealtionArr;
          }
        })
        .catch(() => {});
    };
    // 点击查重
    const checkSubmit = () => {
      state.loading = true;
      const categorySome = subjectsResource['all_category_enum'].filter(item => {
        return item.type === props.categoryType;
      });
      const category_idArr = categorySome.map(k => {
        return `category_ids=${k.key}`;
      });
      const category_ids = category_idArr.join('&');
      const params = `name=${props.checkData.name}&exclude_item_id=${props.checkData.id}&${category_ids}`;
      duplicateCheckNew(params)
        .then(res => {
          state.list = res.data.list;
          state.loading = false;
        })
        .catch(() => {
          state.loading = false;
        });
    };
    watchEffect(() => {
      if (props.visible) {
        state.name = props.checkData.name;
        state.summary = props.checkData;
        state.list = [];
        state.createSubject = '';
        state.relationSubject = [];
        if (props.source === 'achievement') {
          getDetailData(props.checkData.id);
        }
        checkSubmit();
      }
    });
    // 通过或者驳回 删除
    const viewDetailsExamineClick = (type, id) => {
      emit('examine', { type: type, id: id });
    };
    // 查看详情
    const viewDetailsClick = record => {
      emit('edit', record);
    };
    // 编辑
    const router = useRouter();
    const viewDetailsEdit = data => {
      emit('close');
      router.push({
        path: `/researchdata/edit/${data.category.id}/${data.id}`,
      });
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
      checkSubmit();
      examineRejectClose();
    };
    // 查重列表点击 驳回 删除 通过按钮
    const CheckListExamineClick = (type, id) => {
      examineRejectModal.visible = true;
      examineRejectModal.id = id;
      examineRejectModal.type = type;
    };

    // 查看详情
    const detailDrawer = reactive({
      visible: false,
      record: null,
      title: '',
      id: null,
      permission: 'admin',
      savePermission: true,
      zIndex: 1002,
    });
    // 查重列表点击详情按钮
    const CheckListViewDetailsClick = record => {
      detailDrawer.visible = true;
      detailDrawer.record = toRaw(record);
      detailDrawer.id = record.id;
      detailDrawer.title = record.category.name;
    };
    const viewDetailsClose = () => {
      detailDrawer.visible = false;
    };
    const viewDetailsExamineClickOk = () => {
      checkSubmit();
      viewDetailsClose();
    };
    const viewDetailEdit = () => {
      emit('close');
      viewDetailsClose();
    };
    return {
      state,
      handleClose,
      checkSubmit,
      viewDetailsClick,
      viewDetailsExamineClick,
      viewDetailsEdit,
      CheckListViewDetailsClick,
      CheckListExamineClick,
      examineRejectModal,
      examineRejectClose,
      examineRejectOk,
      detailDrawer,
      viewDetailsClose,
      viewDetailsExamineClickOk,
      viewDetailEdit,
    };
  },
});
</script>
<style lang="less" scoped>
.duplicate-list {
  ::v-deep(.ant-spin-container) {
    min-height: 100px;
  }
}
@import '~ant-design-vue/es/style/themes/default.less';
.duplicate-right {
  padding-left: 24px;
  .list-content-item {
    margin: 0 10px;
    font-size: @font-size-base;
    vertical-align: middle;
    > span {
      line-height: 20px;
      color: @text-color-secondary;
    }
    > p {
      margin-bottom: 0;
      line-height: 22px;
      height: 22px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
