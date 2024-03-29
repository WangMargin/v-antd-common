<template>
  <page-container :title="t('pages.profile.basic.title')">
    <a-card :bordered="false">
      <a-descriptions title="退款申请">
        <a-descriptions-item label="取货单号">1000000000</a-descriptions-item>
        <a-descriptions-item label="状态">已取货</a-descriptions-item>
        <a-descriptions-item label="销售单号">1234123421</a-descriptions-item>
        <a-descriptions-item label="子订单">3214321432</a-descriptions-item>
      </a-descriptions>
      <a-divider style="margin-bottom: 32px" />
      <a-descriptions title="用户信息">
        <a-descriptions-item label="用户姓名">付小小</a-descriptions-item>
        <a-descriptions-item label="联系电话">18100000000</a-descriptions-item>
        <a-descriptions-item label="常用快递">菜鸟仓储</a-descriptions-item>
        <a-descriptions-item label="取货地址">浙江省杭州市西湖区万塘路18号</a-descriptions-item>
        <a-descriptions-item label="备注">无</a-descriptions-item>
      </a-descriptions>
      <a-divider style="margin-bottom: 32px" />

      <div class="title">退货商品</div>
      <a-table
        style="margin-bottom: 24px"
        row-key="id"
        :pagination="false"
        :loading="context.loading"
        :columns="goodsColumns"
        :data-source="context.dataSource"
        :components="tableComponents"
      >
        <template #id="{ text }">
          <a>{{ text }}</a>
        </template>
        <template #summary>
          <div>123</div>
        </template>
      </a-table>

      <div class="title">退货进度</div>
      <a-table
        style="margin-bottom: 24px"
        row-key="key"
        :loading="context2.loading"
        :pagination="false"
        :columns="scheduleColumns"
        :data-source="context2.dataSource"
      >
        <template #status="{ text }">
          <a-badge :status="text" :text="statusMap[text]" />
        </template>
      </a-table>
    </a-card>
  </page-container>
</template>
<script>
import { defineComponent, reactive } from 'vue';
import { Badge } from 'ant-design-vue';
import { goodsData, scheduleData } from './mockData';
import { useFetchData } from '@/utils/hooks/useFetchData';
import { default as TableTotalRow } from '@/components/table/total-table';
import { useI18n } from 'vue-i18n';
const statusMap = {
  processing: '进行中',
  success: '完成',
  failed: '失败',
};
const goodsColumns = [
  {
    title: '商品编号',
    dataIndex: 'id',
    key: 'id',
    slots: {
      customRender: 'id',
    },
    summary: () => {
      return '总计';
    },
  },
  {
    title: '商品名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '商品条码',
    dataIndex: 'barcode',
    key: 'barcode',
  },
  {
    title: '单价',
    dataIndex: 'price',
    key: 'price',
    align: 'right',
  },
  {
    title: '数量（件）',
    dataIndex: 'num',
    key: 'num',
    align: 'right',
    summary: (data, h) => {
      const total = data
        .map(it => {
          return parseInt(it['num']) || 0;
        })
        .reduce((prev, cur) => {
          return prev + cur;
        });
      return h(
        'span',
        {
          style: 'color: red;font-weight: bold;',
        },
        total,
      );
    },
  },
  {
    title: '金额',
    dataIndex: 'amount',
    key: 'amount',
    align: 'right',
    summary: true,
  },
];
const scheduleColumns = [
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: '当前进度',
    dataIndex: 'rate',
    key: 'rate',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    slots: {
      customRender: 'status',
    },
  },
  {
    title: '操作员ID',
    dataIndex: 'operator',
    key: 'operator',
  },
  {
    title: '耗时',
    dataIndex: 'cost',
    key: 'cost',
  },
];
export default defineComponent({
  setup() {
    const { t } = useI18n();
    const { context } = useFetchData(() => {
      return new Promise(resolve => {
        resolve({
          data: goodsData,
          total: 5,
        });
      });
    });
    const { context: context2 } = useFetchData(() => {
      return new Promise(resolve => {
        resolve({
          data: scheduleData,
          total: 5,
        });
      });
    });
    const tableComponents = reactive({
      body: {
        wrapper: TableTotalRow,
      },
    });
    return {
      t,
      tableComponents,
      goodsColumns,
      scheduleColumns,
      statusMap,
      context,
      context2,
    };
  },

  components: {
    [Badge.name]: Badge,
  },
});
</script>

<style lang="less" scoped>
.title {
  margin-bottom: 16px;
  color: @text-color;
  font-weight: 500;
  font-size: 16px;
}
</style>
