<template>
  <div>
    <a-card :body-style="{ padding: 0 }" ref="elRef">
      <div class="ant-pro-table-list-toolbar">
        <div class="ant-pro-table-list-toolbar-container">
          <div class="ant-pro-table-list-toolbar-left">
            <div class="ant-pro-table-list-toolbar-title">查询表格</div>
          </div>
          <div class="ant-pro-table-list-toolbar-right">
            <a-space align="center">
              <a-button type="primary" @click="addTask">
                <plus-outlined />
                新建
              </a-button>
              <div class="ant-pro-table-list-toolbar-setting-item">
                <a-tooltip title="表格斑马纹">
                  <a-switch
                    checked-children="开"
                    un-checked-children="关"
                    v-model:checked="state.stripe"
                  />
                </a-tooltip>
              </div>
            </a-space>
            <div class="ant-pro-table-list-toolbar-divider">
              <a-divider type="vertical" />
            </div>
            <div class="ant-pro-table-list-toolbar-setting-item">
              <a-tooltip title="刷新">
                <reload-outlined @click="handleTableChange" />
              </a-tooltip>
            </div>
            <div class="ant-pro-table-list-toolbar-setting-item">
              <a-tooltip title="密度">
                <a-dropdown :trigger="['click']" placement="bottomRight">
                  <column-height-outlined />
                  <template #overlay>
                    <a-menu
                      style="width: 80px"
                      :selected-keys="[state.tableSize]"
                      @click="
                        ({ key }) => {
                          state.tableSize = key;
                        }
                      "
                    >
                      <a-menu-item key="default">
                        <a href="javascript:;">默认</a>
                      </a-menu-item>
                      <a-menu-item key="middle">
                        <a href="javascript:;">中等</a>
                      </a-menu-item>
                      <a-menu-item key="small">
                        <a href="javascript:;">紧凑</a>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </a-tooltip>
            </div>
            <div class="ant-pro-table-list-toolbar-setting-item">
              <a-popover
                placement="bottomRight"
                arrowPointAtCenter
                trigger="click"
                overlayClassName="ant-pro-table-column-setting-overlay"
              >
                <template #title>
                  <div class="ant-pro-table-column-setting-title">
                    <a-checkbox
                      v-model:checked="columnState.checkAll"
                      :indeterminate="columnState.indeterminate"
                      @change="handleColumnAllClick"
                    >
                      列展示
                    </a-checkbox>
                    <a @click="reset">重置</a>
                  </div>
                </template>
                <template #content>
                  <span class="ant-pro-table-column-setting-list">
                    <drag-container
                      lockAxis="y"
                      dragClass="ant-pro-table-drag-ghost"
                      dropClass="ant-pro-table-drop-ghost"
                      @drop="({ removedIndex, addedIndex }) => move(removedIndex, addedIndex)"
                    >
                      <draggable :key="column.key" v-for="column in dynamicColumnItems">
                        <div class="ant-pro-table-column-setting-list-item">
                          <a-checkbox
                            :checked="column.checked"
                            @change="handleColumnChange($event, column)"
                          >
                            {{ column.label }}
                          </a-checkbox>
                        </div>
                      </draggable>
                    </drag-container>
                  </span>
                </template>
                <a-tooltip title="列设置">
                  <setting-outlined />
                </a-tooltip>
              </a-popover>
            </div>
            <div class="ant-pro-table-list-toolbar-setting-item">
              <a-tooltip :title="screenState ? '退出全屏' : '全屏'">
                <fullscreen-outlined v-if="!screenState" @click="setFull" />
                <fullscreen-exit-outlined v-else @click="exitFull" />
              </a-tooltip>
            </div>
          </div>
        </div>
      </div>
      <a-table
        :row-class-name="stripe"
        :size="state.tableSize"
        :loading="state.loading"
        :columns="dynamicColumns"
        :data-source="state.dataSource"
        :pagination="{
          current: state.current,
          pageSize: state.pageSize,
          total: state.total,
        }"
        @change="handleTableChange"
      >
        <template #status="{ text }">
          <!--                    <a-badge :status="statusMap[text].status" :text="statusMap[text].text" />-->
          {{ text }}
        </template>
        <template #action="{ text }">
          <a :title="text">编辑</a>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import {
  ColumnHeightOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  PlusOutlined,
  ReloadOutlined,
  SettingOutlined,
} from '@ant-design/icons-vue';
import { Container as DragContainer, Draggable } from '@/components/draggable';
import { queryRule } from '@/api/list/table-list';
import { useFetchData } from '@/utils/hooks/useFetchData';
import { useFullscreen } from '@/utils/hooks/useFullscreen';
import { useTableDynamicColumns } from '@/utils/hooks/useTableColumn';
import { useRouter } from 'vue-router';
import { reactive, toRaw } from 'vue';
//======
const statusMap = {
  0: {
    text: '关闭',
    status: 'default',
  },
  1: {
    text: '运行中',
    status: 'processing',
  },
  2: {
    text: '已上线',
    status: 'success',
  },
  3: {
    text: '异常',
    status: 'error',
  },
};
const status = ['关闭', '运行中', '已上线', '异常'];
const baseColumns = [
  {
    title: '规则名称',
    dataIndex: 'name',
  },
  {
    title: '描述',
    dataIndex: 'desc',
  },
  {
    title: '服务调用次数',
    dataIndex: 'callNo',
    sorter: true,
    align: 'right',
    customRender: ({ text }) => `${text} 万`,
    // mark to display a total number
    needTotal: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    slots: {
      customRender: 'status',
    },
    filters: [
      {
        text: status[0],
        value: '0',
      },
      {
        text: status[1],
        value: '1',
      },
      {
        text: status[2],
        value: '2',
      },
      {
        text: status[3],
        value: '3',
      },
    ],
  },
  {
    title: '上次调度时间',
    dataIndex: 'updatedAt',
    sorter: true,
  },
  {
    title: '操作',
    dataIndex: 'action',
    slots: {
      customRender: 'action',
    },
  },
];
export default {
  name: 'index',
  setup() {
    const router = useRouter();
    const {
      state: columnState,
      dynamicColumns,
      dynamicColumnItems,
      handleColumnAllClick,
      handleColumnChange,
      reset,
      move,
    } = useTableDynamicColumns(baseColumns, true);
    const [elRef, screenState, { setFull, exitFull }] = useFullscreen();
    const { stripe, reload, setPageInfo, context: state } = useFetchData(queryRule, {
      current: 1,
      pageSize: 10,
      tableSize: 'middle',
      // 'default' | 'middle' | 'small'
      stripe: false,
    });

    const handleTableChange = ({ current, pageSize }, filters) => {
      setPageInfo({
        current,
        pageSize,
        ...filters,
      });
      reload();
    };

    const queryParam = reactive({
      ruleName: undefined,
      desc: undefined,
      callNo: undefined,
    });

    const handleSearch = () => {
      setPageInfo({ ...toRaw(queryParam) });
      reload();
    };

    // 新建任务
    const addTask = () => {
      router.push({
        name: 'servicesaddTask',
      });
    };
    return {
      // ======
      addTask,
      // ======
      statusMap,
      state,
      stripe,
      columnState,
      dynamicColumns,
      dynamicColumnItems,
      queryParam,
      handleSearch,
      // fullscreen
      elRef,
      screenState,
      setFull,
      exitFull,
      handleTableChange,
      handleColumnChange,
      handleColumnAllClick,
      reset,
      move,
    };
  },
  components: {
    Draggable,
    DragContainer,
    PlusOutlined,
    ReloadOutlined,
    ColumnHeightOutlined,
    SettingOutlined,
    FullscreenOutlined,
    FullscreenExitOutlined,
    // [Badge.name]: Badge
  },
};
</script>

<style scoped></style>
