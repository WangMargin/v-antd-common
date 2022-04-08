<template>
  <a-modal
    :visible="visible"
    title="查重内容校验"
    :width="800"
    @cancel="handleClose"
    :footer="null"
  >
    <a-card :bordered="false" :body-style="{ padding: '0' }">
      <a-row type="flex">
        <a-col flex="auto">
          <span v-if="source === 'submit'">{{ state.title }}</span>
          <template v-else>
            <a-input
              v-model:value="state.title"
              @press-enter="checkSubmit"
              :placeholder="`请输入项目名称`"
            />
          </template>
        </a-col>
        <a-col>
          <a-button @click="checkSubmit" type="primary" style="margin:0 10px;">查重</a-button>
          <template v-if="source === 'submit'">
            <a-button
              @click="submitOk"
              type="primary"
              style="margin:0 10px;"
              :loading="submitLoading"
            >
              确认
            </a-button>
          </template>
          <template v-else>
            <a-button @click="clickOk" type="primary" style="margin:0 10px;">
              确认
            </a-button>
          </template>
        </a-col>
      </a-row>
      <div style="max-height:260px;overflow-y:auto;margin-top:20px;">
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
                  <template v-for="subject in item.data.subjects" :key="subject.id">
                    <span
                      v-if="
                        !item.data.created_by.subject ||
                          subject.id !== item.data.created_by.subject.id
                      "
                    >
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
                        v-if="item.data.has_permission"
                        @click="viewDetails(item.data)"
                      >
                        详情
                      </a-button>
                      <a-button
                        type="link"
                        size="small"
                        v-else
                        @click="associatedSubjectApply(item.data)"
                      >
                        申请加入
                      </a-button>
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
          1. 请点击“查重”按钮，查询系统中是否存在重复的成果。
          <br />
          2. 如果没有重复成果，请直接点击“确认”按钮。
          <br />
          3. 如果您遇到任何问题，请将本页面截图，联系科研办相关老师协助解决。
        </p>
      </a-space>
    </a-card>
  </a-modal>
  <!-- 详情页 -->
  <sycamore-detail v-bind="detailDrawer" @close="viewDetailsClose"></sycamore-detail>
  <a-modal
    v-model:visible="applyState.visible"
    title="申请加入"
    @ok="applyModalOk"
    v-if="applyState.visible"
  >
    <p>
      【统计项目】：{{ applyState.categoryName }}
      <br />
      【名称】：{{ applyState.name }}
      <br />
      【创建主体】：
      <template v-if="applyState.created_by.subject === null">
        管理员({{ applyState.created_by.name }})
      </template>
      <template v-else>
        {{ applyState.created_by.subject.name }}({{ applyState.created_by.name }})
      </template>
      <br />
      【成果所属的本院教师及博士后、研究中心】：
      <span v-for="(sub, index) in applyState.subjects" :key="index">
        <template v-if="index === 0">{{ sub.name }}</template>
        <template v-else>，{{ sub.name }}</template>
      </span>
    </p>
    <p>
      如果
      {{ subjectInfo.name }}
      也参与了此项科研成果，请点击“确定”，系统会通知此成果的录入员，数据关联后
      {{ subjectInfo.name }} 将拥有此成果，您无需重复录入。
    </p>
  </a-modal>
</template>
<script>
import { defineComponent, watchEffect, reactive, toRaw, ref, onMounted } from 'vue';
import { duplicateCheckNew, notificationEmail } from '@/api/form/basic-form.js';
import { ExclamationCircleFilled } from '@ant-design/icons-vue';
import SycamoreDetail from '@/views/dynamic/components/sycamore-detail.vue';
import { message } from 'ant-design-vue';
import localStorage from '@/utils/local-storage';
import { STORAGE_USER_SELECT_SUBJECT } from '@/store/mutation-type';
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    // 编辑时数据id 新建时可以不传
    id: {
      type: String,
      default: '',
    },
    // 查重标题
    title: {
      type: String,
      default: '',
    },
    // 查重时获取的同一父级下的所有统计项
    categoryIds: {
      type: String,
      default: '',
    },
    // 查重来源 默认提交按钮 统计项field时传值field
    source: {
      type: String,
      default: 'submit',
    },
    // 查重项key
    itemKey: {
      type: String,
      default: '',
    },
  },
  emits: ['close', 'submit', 'sure'],
  components: {
    ExclamationCircleFilled,
    SycamoreDetail,
  },
  setup(props, { emit }) {
    const subjectInfo = localStorage.get(STORAGE_USER_SELECT_SUBJECT);
    const submitLoading = ref(false);
    const applyState = reactive({
      visible: false,
    });
    const state = reactive({
      loading: false,
      list: [],
      title: '',
    });
    // 关闭
    const handleClose = () => {
      emit('close');
    };
    // 直接提交数据
    const submitOk = () => {
      submitLoading.value = true;
      emit('submit');
    };
    // 确认field查重数据没问题
    const clickOk = () => {
      if (!state.title) {
        message.info('请输入查重内容');
        return;
      }
      emit('sure', state.title);
    };
    // 点击查重
    const checkSubmit = () => {
      if (!state.title) {
        message.info('请输入查重内容');
        return;
      }
      state.loading = true;
      const params = `name=${state.title}&exclude_item_id=${props.id}&${props.categoryIds}`;
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
        state.title = props.title;
        state.list = [];
      }
    });
    onMounted(() => {
      if (state.title) {
        checkSubmit();
      }
    });
    // 查看详情
    const detailDrawer = reactive({
      visible: false,
      record: null,
      title: '',
      id: null,
      permission: 'operator',
      savePermission: false,
      zIndex: 1002,
    });
    // 查重列表点击详情按钮
    const viewDetails = record => {
      detailDrawer.visible = true;
      detailDrawer.record = toRaw(record);
      detailDrawer.id = record.id;
      detailDrawer.title = record.category.name;
    };
    const viewDetailsClose = () => {
      detailDrawer.visible = false;
    };
    // 关联主体申请
    const associatedSubjectApply = record => {
      applyState.visible = true;
      applyState.categoryName = record.category.name;
      applyState.name = record.name;
      applyState.id = record.id;
      applyState.subjects = record.subjects;
      applyState.created_by = record.created_by;
    };
    const applyModalOk = () => {
      const params = { item_id: applyState.id };
      notificationEmail(params)
        .then(res => {
          if (res.code === 200) {
            message.success(res.msg);
            applyState.visible = false;
          } else {
            message.error(res.msg);
          }
        })
        .catch(err => {
          console.error(err);
        });
    };
    return {
      submitLoading,
      state,
      submitOk,
      handleClose,
      checkSubmit,
      detailDrawer,
      viewDetails,
      viewDetailsClose,
      associatedSubjectApply,
      applyState,
      applyModalOk,
      clickOk,
      subjectInfo,
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
