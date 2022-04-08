<template>
  <a-tabs :animated="false" style="margin-top: -14px">
    <a-tab-pane key="sycamore" tab="科研成果数据">
      <a-table
        :row-key="record => record.category_id"
        :columns="columns"
        :data-source="table"
        bordered
        :pagination="false"
        size="middle"
      >
        <template #action="{ record }">
          <a @click="detailClick(record)">详情</a>
        </template>
      </a-table>
    </a-tab-pane>
    <a-tab-pane key="chart" tab="统计图表">
      <a-row type="flex" :gutter="[16, 16]">
        <a-col v-bind="gridLayout" v-for="list in chart" :key="list.type_key">
          <a-card :title="list.type_name" :body-style="{ padding: '10px 0 0 0' }">
            <bar :height="560" :data="list.statistics_data" />
          </a-card>
        </a-col>
      </a-row>
    </a-tab-pane>
  </a-tabs>
</template>
<script>
import { defineComponent, reactive } from 'vue';
import { Bar } from './charts';
import { useRouter } from 'vue-router';
import { eventBus } from '@ai-zen/event-bus';
const gridLayout = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 12,
  xl: 12,
};
export default defineComponent({
  name: 'StatisticsChart',
  props: {
    table: {
      type: Array,
      default: () => [],
    },
    chart: {
      type: Array,
      default: () => [],
    },
    year: {
      type: Array,
      default: () => [],
    },
    isAdmin: {
      type: Boolean,
      default: () => false,
    },
  },
  setup(props) {
    const router = useRouter();
    const yearChildren = reactive([]);
    props.year.map(item => {
      yearChildren.push({
        title: item,
        dataIndex: item,
      });
    });
    const columns = [
      {
        title: '类别',
        dataIndex: 'type_name',
        customCell: function () {
          return {
            style: {
              'background-color': '#fafafa',
            },
          };
        },
      },
      {
        title: '名称',
        dataIndex: 'category_name',
      },
      {
        title: `近${props.year.length}年成果统计`,
        children: yearChildren,
      },
      {
        title: '分类合计',
        dataIndex: 'total',
      },
      {
        title: '操作',
        dataIndex: 'action',
        slots: {
          customRender: 'action',
        },
      },
    ];
    const handleDataColumns = data => {
      const newArr = [0];
      data.map((k, i) => {
        if (i < data.length - 1) {
          if (k['type_key'] !== data[i + 1]['type_key']) newArr.push(i + 1);
        }
      });
      columns[0].customRender = ({ text, index }) => {
        const obj = {
          children: text,
          props: {},
        };
        newArr.map((v, j) => {
          if (index === v) {
            if (j < newArr.length - 1) {
              obj.props.rowSpan = newArr[j + 1] - v;
            } else {
              obj.props.rowSpan = 1;
            }
          }
          if (j < newArr.length - 1) {
            if (index > v && index < newArr[j + 1]) {
              obj.props.colSpan = 0;
            }
          }
        });
        return obj;
      };
    };
    handleDataColumns(props.table);
    const detailClick = record => {
      if (props.isAdmin) {
        sessionStorage.setItem(process.env.VUE_APP_EXAMINE_ID, record.category_id);
        sessionStorage.setItem(process.env.VUE_APP_EXAMINE_FLAG, true);
        eventBus.emit(process.env.VUE_APP_EXAMINE_TYPE, true);
        // process.env.VUE_APP_EXAMINE_TYPE = true;
        router.push({
          path: `/data/examine`,
        });
      } else {
        router.push({
          path: `/achievement/${record.type_key.toLowerCase()}/${record.category_id}`,
        });
      }
    };
    return {
      gridLayout,
      columns,
      detailClick,
    };
  },

  components: {
    Bar,
  },
});
</script>
