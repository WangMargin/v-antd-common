<template>
  <page-container>
    <a-card :bordered="false" :loading="loading" :body-style="{ paddingTop: 0 }">
      <div class="table ant-pro-table" v-if="!loading">
        <a-card :body-style="{ padding: 0 }" :bordered="false" ref="elRef">
          <div class="ant-pro-table-list-toolbar">
            <div class="ant-pro-table-list-toolbar-container">
              <div class="ant-pro-table-list-toolbar-left">
                <div class="ant-pro-table-list-toolbar-title"></div>
              </div>
              <div class="ant-pro-table-list-toolbar-right">
                <a-space align="center">
                  <a-button type="primary" @click="addOperatorsShow">
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

            <template #is_active="{ text }">
              {{ enableData[text].text }}
            </template>
            <template #scopes="{ text }">
              <template v-for="(subject, index) in text" :key="subject.id">
                <span v-if="index === text.length - 1">{{ subject.name }}</span>
                <span v-else>{{ subject.name }}；</span>
              </template>
            </template>
            <template #action="{ record }">
              <a-button type="link" @click="editAdministratorsInfo(record)">编辑</a-button>
              <!-- <a-button type="link" @click="deleteClick(record)">删除</a-button> -->
            </template>
          </a-table>
        </a-card>
      </div>
      <admin-form
        v-if="editModal.visible"
        v-bind="editModal"
        @cancel="
          () => {
            editModal.visible = false;
          }
        "
        @ok="accountModalOk"
      ></admin-form>
    </a-card>
  </page-container>
</template>
<script>
import { defineComponent, reactive, computed, ref, toRaw } from 'vue';
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
import { getAdministratorsList, deleteOperator } from '@/api/subjects/subject.js';
import AdminForm from './administrators/admin-form.vue';
import { handleFiltersSorter } from '@/utils/common.js';
import { useStore } from 'vuex';
import { GET_UIMSRESOURCES } from '@/store/modules/resources/actions';
import { Modal } from 'ant-design-vue';
const enableData = [
  {
    text: '否',
    value: 0,
  },
  {
    text: '是',
    value: 1,
  },
];
export default defineComponent({
  name: 'Administrators',
  setup() {
    const loading = ref(true);
    const store = useStore();
    const route = useRoute();
    const currentRoute = route.name;
    const resourcesData = computed(() => store.getters[`resources/data`]);
    if (!resourcesData.value.uimsDepartment) {
      store.dispatch(`resources/${GET_UIMSRESOURCES}`).then(() => {
        loading.value = false;
      });
    } else {
      loading.value = false;
    }
    const searchInput = ref();
    const allColumns = [
      {
        title: '姓名',
        dataIndex: 'name',
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
        },
        op: 'Like',
        sk: 'name',
      },
      {
        title: '是否启用',
        dataIndex: 'is_active',
        slots: {
          customRender: 'is_active',
        },
        filters: enableData,
        width: '20%',
        op: 'In',
        sk: 'is_active',
        boolTrans: true,
      },
      {
        title: '操作',
        dataIndex: 'action',
        slots: {
          customRender: 'action',
        },
        width: 160,
      },
    ];
    const {
      state: columnState,
      dynamicColumns,
      dynamicColumnItems,
      handleColumnAllClick,
      handleColumnChange,
      reset,
      move,
    } = useTableDynamicColumns(allColumns, true);
    const [elRef, screenState, { setFull, exitFull }] = useFullscreen();
    const { stripe, reload, setPageInfo, context: state } = useFetchData(getAdministratorsList, {
      current: 1,
      pageSize: 100,
      tableSize: 'middle',
      stripe: false,
    });
    // 搜索筛选处理
    const handleTableChange = ({ current, pageSize }, filters, sorter) => {
      const filters_sorter = handleFiltersSorter(allColumns, filters, sorter);
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
      id: '-1',
    });
    const addOperatorsShow = () => {
      editModal.visible = true;
      editModal.id = '-1';
    };
    const accountModalOk = () => {
      editModal.visible = false;
      reload();
    };
    // 编辑
    const editAdministratorsInfo = record => {
      editModal.visible = true;
      editModal.id = record.id;
      editModal.model = toRaw(record);
    };
    // 删除账号
    const deleteClick = record => {
      Modal.confirm({
        title: `确定要删除吗？`,
        onOk() {
          deleteOperator(record.id)
            .then(() => {
              reload();
            })
            .catch(() => {});
        },
        onCancel() {},
      });
    };
    return {
      enableData,
      currentRoute,
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
      addOperatorsShow,
      accountModalOk,
      searchInput,
      loading,
      editAdministratorsInfo,
      deleteClick,
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
    AdminForm,
  },
});
</script>
