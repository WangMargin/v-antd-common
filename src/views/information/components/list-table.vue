<template>
  <a-card :bordered="false">
    <div class="table ant-pro-table" style="margin-top: -16px">
      <a-card :body-style="{ padding: 0 }" :bordered="false" ref="elRef">
        <div class="ant-pro-table-list-toolbar">
          <div class="ant-pro-table-list-toolbar-container">
            <div class="ant-pro-table-list-toolbar-left">
              <div class="ant-pro-table-list-toolbar-title"></div>
            </div>
            <div class="ant-pro-table-list-toolbar-right">
              <a-space align="center">
                <a-button type="primary" @click="addFormShow">
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
                            <drag-icon />
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
          :scroll="{ x: '100%' }"
          :row-key="record => record.id"
          :row-class-name="stripe"
          :size="state.tableSize"
          :loading="state.loading"
          :columns="dynamicColumns"
          :data-source="state.dataSource.list"
          :pagination="{
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} 条数据`,
            showSizeChanger: true,
            current: state.current,
            pageSize: state.pageSize,
            total: state.total,
            pageSizeOptions: ['25', '50', '100', '200'],
          }"
          @change="handleTableChange"
        >
          <template #filterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters }">
            <div style="padding: 8px">
              <a-input
                ref="searchInput"
                :placeholder="`输入要搜索的内容`"
                :value="selectedKeys[0]"
                style="width: 188px; margin-bottom: 8px; display: block"
                @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                @pressEnter="confirm()"
              />
              <a-button
                type="primary"
                size="small"
                style="width: 90px; margin-right: 8px"
                @click="confirm()"
              >
                <template #icon><search-outlined /></template>
                搜索
              </a-button>
              <a-button size="small" style="width: 90px" @click="clearFilters()">重置</a-button>
            </div>
          </template>
          <template #filterIcon>
            <search-outlined />
          </template>

          <template #workingtime="{ record }">
            <template v-if="record.info.leave_time && record.info.status.key === 'LeaveJob'">
              {{ record.info.entry_time }} - {{ record.info.leave_time }}
            </template>
            <template v-else>{{ record.info.entry_time }} - 至今</template>
          </template>

          <template #operation="{ record }">
            <a @click="editSubjects(record)">编辑</a>
          </template>
        </a-table>
      </a-card>
    </div>
    <item-form
      v-bind="editModal"
      @cancel="
        () => {
          editModal.visible = false;
          editModal.id = '-1';
        }
      "
      @ok="subjectModalOk"
    ></item-form>
  </a-card>
</template>
<script>
import { defineComponent, reactive, computed, toRaw, ref } from 'vue';
import { useRoute } from 'vue-router';
import {
  PlusOutlined,
  ReloadOutlined,
  ColumnHeightOutlined,
  SettingOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue';
import { Container as DragContainer, Draggable } from '@/components/draggable';
import { useFetchData } from '@/utils/hooks/useFetchData';
import { useFullscreen } from '@/utils/hooks/useFullscreen';
import { useTableDynamicColumns } from '@/utils/hooks/useTableColumn';
import DragIcon from '@/components/table/drag-icon.vue';
import { getSubjectsItemList } from '@/api/subjects/information.js';
import { useStore } from 'vuex';
import ItemForm from './item-form.vue';
import { moneyTransform, handleFiltersSorter } from '@/utils/common.js';
const contrastData = {
  member: 'Member',
  donation: 'Donation',
  funds: 'Funds',
};
export default defineComponent({
  name: 'ListTable',
  setup() {
    const store = useStore();
    const route = useRoute();
    const resourcesData = computed(() => store.getters[`resources/data`]);
    const subjectsResource = resourcesData.value.resources;
    // 职务
    const positionFilters = subjectsResource['subject_item_member_info_position'].map(k => {
      return { text: k.value, value: k.key };
    });
    // 学历
    const educationFilters = subjectsResource['subject_item_member_info_education'].map(k => {
      return { text: k.value, value: k.key };
    });
    // 经费类别
    const typeFilters = subjectsResource['subject_item_funds_type'].map(k => {
      return { text: k.value, value: k.key };
    });
    const searchInput = ref();
    const allColumns = {
      Member: [
        {
          title: '姓名',
          dataIndex: 'info.name',
          slots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
          },
          ellipsis: true,
          width: '20%',
          op: 'Like',
          sk: 'info.name',
        },
        {
          title: '职务',
          dataIndex: 'info.position.value',
          filters: positionFilters,
          ellipsis: true,
          width: '20%',
          op: 'In',
          sk: 'info.position',
        },
        {
          title: '学历',
          dataIndex: 'info.education.value',
          filters: educationFilters,
          ellipsis: true,
          width: '20%',
          op: 'In',
          sk: 'info.education',
        },
        {
          title: '在职时间',
          dataIndex: 'workingtime',
          slots: {
            customRender: 'workingtime',
          },
          ellipsis: true,
          width: '30%',
        },
        {
          title: '操作',
          key: 'operation',
          slots: {
            customRender: 'operation',
          },
          ellipsis: true,
          width: '10%',
        },
      ],
      Donation: [
        {
          title: '捐赠单位',
          dataIndex: 'info.name',
          slots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
          },
          ellipsis: true,
          width: '30%',
          op: 'Like',
          sk: 'info.name',
        },
        {
          title: '捐赠时间',
          dataIndex: 'info.donation_time',
          sorter: true,
          ellipsis: true,
          width: '30%',
        },
        {
          title: '合同金额(元)',
          dataIndex: 'info.money',
          sorter: true,
          customRender: function (text) {
            return moneyTransform(text.text);
          },
          ellipsis: true,
          width: '30%',
        },
        {
          title: '操作',
          key: 'operation',
          slots: {
            customRender: 'operation',
          },
          ellipsis: true,
          width: '10%',
        },
      ],
      Funds: [
        {
          title: '经费来源',
          dataIndex: 'info.source',
          slots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
          },
          ellipsis: true,
          width: '30%',
          op: 'Like',
          sk: 'info.source',
        },
        {
          title: '经费类别',
          dataIndex: 'info.type.value',
          filters: typeFilters,
          ellipsis: true,
          width: '20%',
          op: 'In',
          sk: 'info.type',
        },
        {
          title: '收款时间',
          dataIndex: 'info.income_time',
          sorter: true,
          ellipsis: true,
          width: '20%',
        },
        {
          title: '收款金额(元)',
          dataIndex: 'info.income_money',
          sorter: true,
          customRender: function (text) {
            return moneyTransform(text.text);
          },
          ellipsis: true,
          width: '20%',
        },
        {
          title: '操作',
          key: 'operation',
          slots: {
            customRender: 'operation',
          },
          ellipsis: true,
          width: '10%',
        },
      ],
    };
    const {
      state: columnState,
      dynamicColumns,
      dynamicColumnItems,
      handleColumnAllClick,
      handleColumnChange,
      reset,
      move,
    } = useTableDynamicColumns(allColumns[contrastData[route.name]], true);
    const [elRef, screenState, { setFull, exitFull }] = useFullscreen();
    const { stripe, reload, setPageInfo, context: state } = useFetchData(getSubjectsItemList, {
      current: 1,
      pageSize: 100,
      tableSize: 'middle',
      stripe: false,
      params: {
        type: contrastData[route.name],
      },
    });
    // 搜索筛选处理
    const handleTableChange = ({ current, pageSize }, filters, sorter) => {
      const filters_sorter = handleFiltersSorter(
        allColumns[contrastData[route.name]],
        filters,
        sorter,
      );
      setPageInfo({
        current,
        pageSize,
        filters: filters_sorter,
      });
      reload();
    };
    const editModal = reactive({
      visible: false,
      model: undefined,
      type: route.name,
      id: '-1',
    });
    const addFormShow = () => {
      editModal.visible = true;
      editModal.id = '-1';
    };
    const subjectModalOk = () => {
      editModal.visible = false;
      editModal.id = '-1';
      reload();
    };
    const editSubjects = record => {
      editModal.visible = true;
      editModal.id = record.id;
      editModal.model = toRaw(record);
    };
    return {
      state,
      stripe,
      columnState,
      dynamicColumns,
      dynamicColumnItems,
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
      editModal,
      addFormShow,
      subjectModalOk,
      editSubjects,
      searchInput,
    };
  },
  components: {
    DragIcon,
    PlusOutlined,
    ReloadOutlined,
    ColumnHeightOutlined,
    SettingOutlined,
    FullscreenOutlined,
    FullscreenExitOutlined,
    SearchOutlined,
    Draggable,
    DragContainer,
    ItemForm,
  },
});
</script>
