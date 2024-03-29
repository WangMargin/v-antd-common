<template>
  <page-container>
    <div class="basic-list-standard-list">
      <a-card :bordered="false">
        <a-row>
          <a-col :sm="8" :xs="24">
            <info title="我的待办" value="8个任务" :bordered="true" />
          </a-col>
          <a-col :sm="8" :xs="24">
            <info title="本周任务平均处理时间" value="32分钟" :bordered="true" />
          </a-col>
          <a-col :sm="8" :xs="24">
            <info title="本周完成任务数" value="24个任务" />
          </a-col>
        </a-row>
      </a-card>
      <a-card
        title="基本列表"
        class="basic-list-card"
        style="margin-top: 24px"
        :bordered="false"
        :body-style="{ padding: '0 32px 40px 32px' }"
      >
        <template #extra>
          <div class="extra-content">
            <a-radio-group default-value="all">
              <a-radio-button value="all">全部</a-radio-button>
              <a-radio-button value="progress">进行中</a-radio-button>
              <a-radio-button value="waiting">等待中</a-radio-button>
            </a-radio-group>
            <a-input-search
              class="extra-content-search"
              placeholder="请输入"
              @search="() => ({})"
            />
          </div>
        </template>
        <a-button type="dashed" style="width: 100%; margin-bottom: 8px">
          <plus-outlined />
          添加
        </a-button>
        <a-list
          size="large"
          row-key="id"
          :loading="context.loading"
          :pagination="options"
          :data-source="context.dataSource"
        >
          <template #renderItem="{ item }">
            <a-list-item :key="item.id">
              <template #actions>
                <a
                  key="edit"
                  @click="
                    e => {
                      e.preventDefault();
                      showEditModal(item);
                    }
                  "
                >
                  编辑
                </a>
                <a-dropdown>
                  <template #overlay>
                    <a-menu @click="({ key }) => editAndDelete(key, item)">
                      <a-menu-item key="edit">编辑</a-menu-item>
                      <a-menu-item key="delete">删除</a-menu-item>
                    </a-menu>
                  </template>
                  <a>更多</a>
                </a-dropdown>
              </template>
              <a-list-item-meta :description="item.subDescription">
                <template #avatar>
                  <a-avatar :src="item.logo" shape="square" size="large" />
                </template>
                <template #title>
                  <a :href="item.href">{{ item.title }}</a>
                </template>
              </a-list-item-meta>
              <div class="list-content">
                <div class="list-content-item">
                  <span>Owner</span>
                  <p>{{ item.owner }}</p>
                </div>
                <div class="list-content-item">
                  <span>开始时间</span>
                  <p>{{ moment(item.createdAt).format('YYYY-MM-DD HH:mm') }}</p>
                </div>
                <div class="list-content-item">
                  <a-progress
                    :percent="item.percent"
                    :status="item.status"
                    :stroke-width="6"
                    style="width: 180px"
                  />
                </div>
              </div>
            </a-list-item>
          </template>
        </a-list>
      </a-card>
    </div>
  </page-container>
</template>
<script>
import { defineComponent, reactive, toRefs } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { queryFakeList } from '@/api/list/basic-list';
import Info from './info.vue';
import moment from 'moment';
import { useFetchData } from '@/utils/hooks/useFetchData';
export default defineComponent({
  setup() {
    const { reload, context } = useFetchData(
      params => {
        return new Promise((resolve, reject) => {
          queryFakeList({
            count: params?.pageSize || 10,
          })
            .then(res => {
              resolve({
                data: res,
                success: true,
                total: 10,
              });
            })
            .catch(reject);
        });
      },
      {
        loading: false,
        pageSize: 5,
      },
    );
    const { total, pageSize } = toRefs(context);
    const options = reactive({
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['5', '10', '15', '20'],
      pageSize,
      total,
      onChange: (page, pageSize) => {
        context.current = page;
        context.pageSize = pageSize;
        reload();
      },
      onShowSizeChange: (current, size) => {
        context.pageSize = size;
        reload();
      },
    });
    return {
      moment,
      options,
      context,
    };
  },

  components: {
    Info,
    PlusOutlined,
  },
});
</script>

<style lang="less" scoped>
.basic-list-standard-list {
  ::v-deep(.ant-card-head-title) {
    padding: 24px 0;
    line-height: 32px;
  }
  ::v-deep(.ant-input-search),
  .extra-content-search {
    width: 272px;
    margin-left: 16px;
  }
}
.basic-list-card {
  ::v-deep(.ant-card-extra) {
    flex: 1;
  }
  .list-content {
    font-size: 0;
    .list-content-item {
      display: inline-block;
      margin-left: 40px;
      color: @text-color-secondary;
      font-size: @font-size-base;
      vertical-align: middle;
      > span {
        line-height: 20px;
      }
      > p {
        margin-top: 4px;
        margin-bottom: 0;
        line-height: 22px;
      }
    }
  }
}
</style>
