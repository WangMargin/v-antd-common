<template>
  <page-container>
    <a-card :bordered="false" :body-style="{ paddingTop: 0 }">
      <div class="table ant-pro-table">
        <a-card :body-style="{ padding: 0 }" :bordered="false" ref="elRef">
          <div class="ant-pro-table-list-toolbar">
            <div class="ant-pro-table-list-toolbar-container">
              <div class="ant-pro-table-list-toolbar-left">
                <div class="ant-pro-table-list-toolbar-title"></div>
              </div>
              <div class="ant-pro-table-list-toolbar-right">
                <a-space align="center">
                  <a-dropdown :trigger="['click']">
                    <template #overlay>
                      <a-menu>
                        <a-menu-item
                          @click="batchOperateClick('Published')"
                          :disabled="batchDisabled"
                        >
                          批量发布
                        </a-menu-item>
                        <a-menu-item @click="batchOperateClick('Audit')" :disabled="batchDisabled">
                          批量统计
                        </a-menu-item>
                        <a-menu-item @click="batchExportClick()" :disabled="batchDisabled">
                          批量导出
                        </a-menu-item>
                        <!-- <a-menu-item @click="batchExportClick('all')">
                          导出全部统计
                        </a-menu-item> -->
                      </a-menu>
                    </template>
                    <a-button type="primary" ghost>
                      批量操作
                      <down-outlined />
                    </a-button>
                  </a-dropdown>
                  <a-button type="primary" @click="addStatistics">
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
            :scroll="{ x: 1200 }"
            :row-key="record => record.id"
            :row-selection="{
              selectedRowKeys: state.selectedRowKeys,
              onChange: onSelectChange,
            }"
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
                <a-button size="small" style="width: 90px" @click="clearFilters()">
                  重置
                </a-button>
              </div>
            </template>
            <template #filterIcon>
              <search-outlined />
            </template>

            <template #scopes="{ text }">
              <template v-for="(scopes, index) in text" :key="scopes.key">
                <span v-if="index === 0">{{ scopes.value }}</span>
                <span v-else>，{{ scopes.value }}</span>
              </template>
            </template>
            <template #action="{ record }">
              <!-- 未发布 -->
              <template v-if="record.status.key === 'Draft'">
                <a class="operate" @click="publish(record)">发布</a>
                <a class="operate" @click="editStatistics(record)">编辑</a>
              </template>
              <!-- 已发布 -->
              <template v-if="record.status.key === 'Published'">
                <a class="operate" @click="cancelPublish(record)">取消发布</a>
                <a class="operate" @click="audit(record)">统计</a>
                <a class="operate" @click="editStatistics(record)">编辑</a>
              </template>
              <!-- 统计中 -->
              <template v-if="record.status.key === 'Audit'">
                <a class="operate" @click="cancelAudit(record)">取消统计</a>
              </template>
            </template>
          </a-table>
        </a-card>
      </div>
      <statistics-form
        v-bind="editModal"
        @cancel="
          () => {
            editModal.visible = false;
          }
        "
        @ok="subjectModalOk"
      ></statistics-form>
      <div class="importLoading" v-if="importLoading.show">
        <div class="container">
          <a-spin :tip="importLoading.txt" />
        </div>
      </div>
    </a-card>
  </page-container>
</template>
<script>
import { defineComponent, computed, ref, toRaw, reactive } from 'vue';
import {
  PlusOutlined,
  ReloadOutlined,
  ColumnHeightOutlined,
  SettingOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  SearchOutlined,
  DownOutlined,
} from '@ant-design/icons-vue';
import { Container as DragContainer, Draggable } from '@/components/draggable';
import { useFetchData } from '@/utils/hooks/useFetchData';
import { useFullscreen } from '@/utils/hooks/useFullscreen';
import { useTableDynamicColumns } from '@/utils/hooks/useTableColumn';
import DragIcon from '@/components/table/drag-icon.vue';
import {
  getStatisticsList,
  publishStatisticsItem,
  auditStatisticsItem,
  deprecateStatisticsItem,
  batchOperateStatisticsItem,
  batchExportStatisticsItem,
  cancelAuditStatisticsItem,
  cancelPublishStatisticsItem,
} from '@/api/subjects/statistics.js';
import { useStore } from 'vuex';
import StatisticsForm from './statistics/statistics-form.vue';
import { Modal } from 'ant-design-vue';
import { handleFiltersSorter, downloadFileExcel } from '@/utils/common.js';
export default defineComponent({
  name: 'Statistics',
  setup() {
    const batchDisabled = ref(true);
    const importLoading = reactive({
      show: false,
      txt: '正在导出，请稍后…',
    });
    const store = useStore();
    const searchInput = ref();
    const resourcesData = computed(() => store.getters[`resources/data`]);
    const statisticsResource = resourcesData.value.resources;
    //状态
    const statusFilters = statisticsResource['category_status_enum'].map(k => {
      return { text: k.value, value: k.key };
    });
    // 统计范围
    const scopesFilters = statisticsResource['category_scope_enum'].map(k => {
      return { text: k.value, value: k.key };
    });
    //统计类别
    const categoryFilters = statisticsResource['category_type_enum'].map(k => {
      return { text: k.value, value: k.key };
    });
    const allColumns = [
      {
        title: '统计类别',
        dataIndex: 'type.value',
        filters: categoryFilters,
        ellipsis: true,
        width: 150,
        op: 'In',
        sk: 'type',
      },
      {
        title: '统计项目',
        dataIndex: 'name',
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
        },
        ellipsis: true,
        width: 220,
        op: 'Like',
        sk: 'name',
      },
      {
        title: '描述',
        dataIndex: 'description',
        ellipsis: true,
      },
      {
        title: '统计范围',
        dataIndex: 'scopes',
        slots: {
          customRender: 'scopes',
        },
        filters: scopesFilters,
        ellipsis: true,
        width: 180,
        op: 'In',
        sk: 'scopes',
      },
      {
        title: '状态',
        dataIndex: 'status.value',
        filters: statusFilters,
        ellipsis: true,
        width: 120,
        op: 'In',
        sk: 'status',
      },
      {
        title: '操作',
        dataIndex: 'action',
        slots: {
          customRender: 'action',
        },
        width: 180,
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
    const { stripe, reload, setPageInfo, context: state } = useFetchData(getStatisticsList, {
      current: 1,
      pageSize: 100,
      tableSize: 'middle',
      stripe: false,
    });
    const listFilter = reactive({
      filter: null,
    });
    // 搜索筛选处理
    const handleTableChange = ({ current, pageSize }, filters) => {
      const filters_sorter = handleFiltersSorter(allColumns, filters);
      setPageInfo({
        current,
        pageSize,
        filters: filters_sorter,
      });
      reload();
      if (filters_sorter.filter) {
        listFilter.filter = filters_sorter.filter;
      }
    };
    // 勾选
    state.selectedRowKeys = [];
    const onSelectChange = selectedRowKeys => {
      if (selectedRowKeys.length > 0) {
        batchDisabled.value = false;
      } else {
        batchDisabled.value = true;
      }
      state.selectedRowKeys = selectedRowKeys;
    };
    // const getCheckboxProps = record => ({
    //   disabled: record.status.key === 'Audit' || record.status.key === 'Deprecated',
    // });
    const editModal = reactive({
      visible: false,
      model: undefined,
      id: '-1',
    });
    const subjectModalOk = () => {
      editModal.visible = false;
      reload();
    };
    // 添加
    const addStatistics = () => {
      editModal.visible = true;
      editModal.id = '-1';
    };
    // 编辑
    const editStatistics = record => {
      editModal.visible = true;
      editModal.id = record.id;
      editModal.model = toRaw(record);
    };
    // 发布
    const publish = record => {
      publishStatisticsItem(record.id)
        .then(() => {
          reload();
        })
        .catch(() => {});
    };
    // 取消发布
    const cancelPublish = record => {
      Modal.confirm({
        title: '取消后统计将不会在菜单中展示，请确定要取消吗？',
        onOk() {
          cancelPublishStatisticsItem(record.id)
            .then(() => {
              reload();
            })
            .catch(() => {});
        },
        onCancel() {},
      });
    };
    // 统计
    const audit = record => {
      auditStatisticsItem(record.id)
        .then(() => {
          reload();
        })
        .catch(() => {});
    };
    // 取消统计
    const cancelAudit = record => {
      Modal.confirm({
        title: '取消后统计将不会继续统计，请确定要取消吗？',
        onOk() {
          cancelAuditStatisticsItem(record.id)
            .then(() => {
              reload();
            })
            .catch(() => {});
        },
        onCancel() {},
      });
    };
    // 作废
    const deprecate = record => {
      Modal.confirm({
        title: '确定要作废当前统计项目吗？',
        onOk() {
          deprecateStatisticsItem(record.id)
            .then(() => {
              reload();
            })
            .catch(() => {});
        },
        onCancel() {},
      });
    };
    // 批量操作发布 统计
    const batchOperateClick = str => {
      batchOperateStatisticsItem(str, { category_ids: state.selectedRowKeys })
        .then(() => {
          state.selectedRowKeys = [];
          batchDisabled.value = true;
          reload();
        })
        .catch(() => {});
    };
    const handleExportFilter = data => {
      if (data) {
        const dataArr = JSON.parse(data);
        dataArr.map(item => {
          item.field = `category.${item.field}`;
        });
        return JSON.stringify(dataArr);
      } else {
        return data;
      }
    };
    // 批量导出  导出全部
    const batchExportClick = type => {
      const filters =
        type === 'all'
          ? handleExportFilter(listFilter.filter)
          : JSON.stringify([
              { field: 'category.id', op: 'In', value: state.selectedRowKeys },
            ]); /* field值由category._id改为category.id 0512*/
      Modal.confirm({
        title: '确定要导出吗？',
        onOk() {
          importLoading.show = true;
          batchExportStatisticsItem({ filter: filters })
            .then(res => {
              downloadFileExcel(res);
              state.selectedRowKeys = [];
              batchDisabled.value = true;
              importLoading.show = false;
            })
            .catch(() => {
              importLoading.show = false;
            });
        },
        onCancel() {},
      });
    };
    return {
      batchDisabled,
      importLoading,
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
      searchInput,
      onSelectChange,
      // 操作
      publish,
      audit,
      deprecate,
      subjectModalOk,
      addStatistics,
      editStatistics,
      editModal,
      // getCheckboxProps,
      batchOperateClick,
      batchExportClick,
      cancelPublish,
      cancelAudit,
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
    DownOutlined,
    Draggable,
    DragContainer,
    StatisticsForm,
  },
});
</script>
<style lang="less" scoped>
.table {
  .operate {
    margin: 0 16px 0 0;
  }
  .disabled {
    color: rgba(0, 0, 0, 0.45);
  }
}
.importLoading {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 99;
  .container {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 200px;
    background-color: #ffffff;
    transform: translate(-50%, -50%);
    text-align: center;
    padding: 40px 0;
    border-radius: 8px;
  }
}
</style>
