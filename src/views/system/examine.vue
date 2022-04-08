<template>
  <page-container>
    <a-card :bordered="false">
      <a-row type="flex" :gutter="[10, 10]">
        <a-col flex="1">
          <a-tree-select
            show-search
            style="width: 100%"
            :dropdown-style="{ maxHeight: '240px', overflow: 'auto' }"
            placeholder="选择科研主体"
            allow-clear
            multiple
            tree-checkable
            v-model:value="subjectData.val"
            :tree-data="subjectData.subjects"
            :replace-fields="{ children: 'children', title: 'name', key: 'key', value: 'key' }"
          ></a-tree-select>
        </a-col>
        <a-col>
          <a-button type="primary" @click="searchClick">筛选</a-button>
        </a-col>
      </a-row>
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
                        <!-- <a-menu-item
                          @click="batchOperateClick('Archived')"
                          :disabled="batchDisabled"
                        >
                          批量通过
                        </a-menu-item>
                        <a-menu-item @click="batchOperateClick('Failed')" :disabled="batchDisabled">
                          批量驳回
                        </a-menu-item> -->
                        <a-menu-item @click="batchExportClick" :disabled="batchDisabled">
                          批量导出
                        </a-menu-item>
                        <a-menu-item @click="batchExportClick('all')">导出全部数据</a-menu-item>
                      </a-menu>
                    </template>
                    <a-button type="primary" ghost>
                      批量操作
                      <down-outlined />
                    </a-button>
                  </a-dropdown>
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
            :scroll="{ x: 1260 }"
            :row-key="record => record.id"
            :row-selection="{
              selectedRowKeys: state.selectedRowKeys,
              onChange: onSelectChange,
              getCheckboxProps: getCheckboxProps,
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
            <template #name="{ record }">
              <a-tooltip placement="topLeft" :title="record.name">
                {{ record.name }}
              </a-tooltip>
            </template>
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

            <template #scopes="{ text }">
              <template v-for="(scopes, index) in text" :key="scopes.key">
                <span v-if="index === 0">{{ scopes.value }}</span>
                <span v-else>，{{ scopes.value }}</span>
              </template>
            </template>
            <template #action="{ record }">
              <a-button
                type="link"
                size="small"
                @click="duplicateChecking(record)"
                :disabled="record.status.key === 'Auditing' ? false : true"
              >
                审核
              </a-button>
              <a-button
                type="link"
                size="small"
                @click="viewDetails(record)"
                :disabled="record.status.key === 'Deleted' ? true : false"
              >
                详情
              </a-button>
              <a-button
                type="link"
                size="small"
                @click="deleteSycamoreClick(record)"
                :disabled="record.status.key === 'Deleted' ? true : false"
              >
                删除
              </a-button>
            </template>
          </a-table>
        </a-card>
      </div>
    </a-card>
    <!-- 审核查重页 -->
    <duplicate-checking
      v-bind="duplicateCheck"
      @close="duplicateCheckClose"
      @edit="examineDuplicateEdit"
      @examine="examineDuplicateExamine"
    ></duplicate-checking>
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
    <div class="importLoading" v-if="importLoading.show">
      <div class="container">
        <a-spin :tip="importLoading.txt" />
      </div>
    </div>
  </page-container>
</template>
<script>
import { defineComponent, computed, ref, reactive, onActivated, toRaw, onMounted } from 'vue';
import {
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
import { getExamineList, batchExportStatisticsItem } from '@/api/subjects/statistics.js';
import { batchOperateSendItem } from '@/api/dynamic/dynamic.js';
import { useStore } from 'vuex';
import { Modal } from 'ant-design-vue';
import SycamoreDetail from '../dynamic/components/sycamore-detail.vue';
import { useRoute } from 'vue-router';
import { handleFiltersSorter, downloadFileExcel } from '@/utils/common.js';
import localStorage from '@/utils/local-storage';
import DuplicateChecking from '@/views/task/components/duplicate-checking.vue';
import ExamineReject from '@/views/task/components/examine-reject.vue';
import { getSubjectsCategoriesList } from '@/api/task/task.js';
import { eventBus } from '@ai-zen/event-bus';
export default defineComponent({
  name: 'Examine',
  setup() {
    const batchDisabled = ref(true);
    const importLoading = reactive({
      show: false,
      txt: '正在导出，请稍后…',
    });
    const route = useRoute();
    const store = useStore();
    const searchInput = ref();
    const resourcesData = computed(() => store.getters[`resources/data`]);
    const statisticsResource = resourcesData.value.resources;
    console.log(route);
    // 所属年份
    const yearFilters = statisticsResource['select_years_list'].map(k => {
      return { text: k.value, value: k.key };
    });
    //统计类别
    const categoryFilters = statisticsResource['category_type_enum'].map(k => {
      return { text: k.value, value: k.key };
    });
    //统计项目
    const allCategoryFilters = statisticsResource['all_category_enum'].map(k => {
      return { text: k.value, value: k.key, type: k.type };
    });

    const allColumns = [
      {
        title: '统计类别',
        dataIndex: 'category_type.value',
        filters: categoryFilters,
        width: 150,
        ellipsis: true,
        op: 'In',
        sk: 'category.type',
      },
      {
        title: '统计项目',
        dataIndex: 'category.name',
        width: 220,
        ellipsis: true,
        filteredValue: [],
        filters: allCategoryFilters,
        op: 'In',
        sk: 'category.id',
      },
      {
        title: '成果名称',
        dataIndex: 'name',
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'name',
        },
        ellipsis: true,
        op: 'Like',
        sk: 'name',
      },
      {
        title: '所属年份',
        dataIndex: 'year',
        filters: yearFilters,
        width: 160,
        ellipsis: true,
        sorter: true,
        op: 'In',
        sk: 'year',
      },
      {
        title: '创建主体',
        dataIndex: 'create_subject_name',
        width: 150,
        ellipsis: true,
      },
      {
        title: '当前状态',
        dataIndex: 'status.value',
        filters: [
          { text: '审核中', value: 'Auditing' },
          { text: '已审核', value: 'Archived' },
        ],
        width: 120,
        ellipsis: true,
        op: 'In',
        sk: 'status',
      },
      {
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
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
    const { stripe, reload, setPageInfo, context: state } = useFetchData(getExamineList, {
      current: 1,
      pageSize: 100,
      tableSize: 'middle',
      stripe: false,
    });
    const listFilter = reactive({
      filter: null,
    });
    // 主体筛选
    const subjectData = reactive({
      val: [],
    });

    // 搜索筛选
    const searchClick = () => {
      const filters_sorter = handleFiltersSorter([], {}, {}, subjectData.val);
      setPageInfo({
        filters: filters_sorter,
      });
      reload();
      if (filters_sorter.filter) {
        listFilter.filter = filters_sorter.filter;
      }
    };

    // filters 搜索父子级特殊处理
    const filterParentChildHandle = filters => {
      if (filters && Object.keys(filters).length > 0) {
        const filterArr = Object.keys(filters);
        if (filterArr.includes('category_type.value')) {
          if (filters['category_type.value'].length > 0) {
            allColumns[1].filters = allCategoryFilters.filter(k => {
              return filters['category_type.value'].includes(k.type);
            });
          } else {
            allColumns[1].filters = allCategoryFilters;
          }
        }
        if (filterArr.includes('category.name')) {
          if (filters['category.name'].length > 0) {
            allColumns[1].filteredValue = filters['category.name'];
          } else {
            allColumns[1].filteredValue = [];
          }
        }
        if (
          filterArr.includes('category_type.value') &&
          filters['category_type.value'].length > 0 &&
          filterArr.includes('category.name') &&
          filters['category.name'].length > 0
        ) {
          allColumns[1].filteredValue = [];
          allColumns[1].filters.map(item => {
            if (filters['category.name'].includes(item.value)) {
              allColumns[1].filteredValue.push(item.value);
            }
          });
          if (allColumns[1].filteredValue.length > 0) {
            delete filters['category_type.value'];
          } else {
            delete filters['category.name'];
          }
        }
      }
      return filters;
    };
    const handleTableChange = ({ current, pageSize }, filters, sorter) => {
      const newfilters = filterParentChildHandle(filters);
      const filters_sorter = handleFiltersSorter(allColumns, newfilters, sorter, subjectData.val);
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
      }
      state.selectedRowKeys = selectedRowKeys;
    };
    const getCheckboxProps = () => ({
      // disabled: record.status.key !== 'Auditing',
      disabled: false,
    });
    const removeExamineSessionFn = _name => {
      sessionStorage.removeItem(_name);
    };
    const initListFromHome = () => {
      if (sessionStorage.getItem(process.env.VUE_APP_EXAMINE_FLAG)) {
        removeExamineSessionFn(process.env.VUE_APP_EXAMINE_FLAG);
        const _name = sessionStorage.getItem(process.env.VUE_APP_EXAMINE_ID);
        if (!_name) {
          return;
        }
        setTimeout(() => {
          handleTableChange({ current: 1, pageSize: 100 }, { 'category.name': [_name] });
        }, 1000);
      }
    };
    onMounted(async () => {
      await getSubjectsCategoriesList()
        .then(res => {
          subjectData.subjects = res.data.subjects;
        })
        .catch(() => {});
      await initListFromHome();
      eventBus.on(process.env.VUE_APP_EXAMINE_TYPE, () => {
        initListFromHome();
      });
    });
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
    const viewDetails = record => {
      detailDrawer.visible = true;
      detailDrawer.record = toRaw(record);
      detailDrawer.id = record.id;
      detailDrawer.title = record.category.name;
    };
    const viewDetailsClose = () => {
      detailDrawer.visible = false;
    };
    // 审核查重页面点击详情按钮
    const examineDuplicateEdit = record => {
      viewDetails(record);
    };
    // 查重
    const duplicateCheck = reactive({
      visible: false,
      checkData: {},
      categoryType: '',
    });
    const duplicateChecking = record => {
      duplicateCheck.visible = true;
      duplicateCheck.checkData = record;
      duplicateCheck.categoryType = record.category_type.key;
    };
    const duplicateCheckClose = () => {
      duplicateCheck.visible = false;
    };
    // 通过  驳回  删除 按钮点击
    const examineRejectModal = reactive({
      visible: false,
      id: null,
      type: '',
      zIndex: 1003,
    });
    // 显示通过驳回删除内容填写浮层
    const examineRejectClick = data => {
      examineRejectModal.visible = true;
      examineRejectModal.id = data.id;
      examineRejectModal.type = data.status;
    };
    //填写原因弹层关闭
    const examineRejectClose = () => {
      examineRejectModal.visible = false;
    };
    // 填写原因弹层提交成功后回调
    const examineRejectOk = () => {
      examineRejectClose();
      viewDetailsClose();
      duplicateCheckClose();
      reload();
    };
    // 审核列表页删除按钮点击
    const deleteSycamoreClick = record => {
      examineRejectClick({ status: 'Del', id: record.id });
    };
    // 详情页点击通过驳回删除按钮
    const viewDetailsExamineClickOk = () => {
      examineRejectOk();
    };
    // 审核查重页面点击 通过 驳回 删除
    const examineDuplicateExamine = data => {
      examineRejectClick({ status: data.type, id: data.id });
    };
    // 详情页编辑按钮点击
    const viewDetailEdit = () => {
      viewDetailsClose();
      duplicateCheckClose();
    };

    // 批量通过  批量驳回
    const batchOperateClick = str => {
      if (str === 'Archived') {
        Modal.confirm({
          title: '确定要全部通过吗？',
          onOk() {
            batchOperateSendItem('Archived', { item_ids: state.selectedRowKeys, remark: '' })
              .then(() => {
                state.selectedRowKeys = [];
                batchDisabled.value = true;
                reload();
              })
              .catch(() => {});
          },
          onCancel() {},
        });
      }
      if (str === 'Failed') {
        examineRejectClick('', 'all');
      }
    };
    // 批量导出  导出全部
    const concatFilter = (type, val) => {
      const filterArr = listFilter.filter !== null ? JSON.parse(listFilter.filter) : [];
      if (listFilter.filter === null || !listFilter.filter.includes('status')) {
        filterArr.push({ field: 'status', op: 'In', value: ['Archived', 'Auditing'] });
      }
      if (type !== 'all') {
        filterArr.push({ field: 'id', op: 'In', value: val }); /* field值由_id改为id 0512*/
      }
      return JSON.stringify(filterArr);
    };
    const batchExportClick = type => {
      const filters = concatFilter(type, state.selectedRowKeys);
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
    onActivated(() => {
      const dynamicReload = localStorage.get('dynamicReload');
      if (dynamicReload) {
        reload();
        localStorage.remove('dynamicReload');
      }
    });
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
      viewDetails,
      detailDrawer,
      viewDetailsClose,
      getCheckboxProps,
      batchOperateClick,
      batchExportClick,
      duplicateCheck,
      duplicateChecking,
      duplicateCheckClose,
      examineRejectModal,
      examineRejectClick,
      examineRejectClose,
      examineRejectOk,
      deleteSycamoreClick,
      examineDuplicateEdit,
      examineDuplicateExamine,
      viewDetailsExamineClickOk,
      viewDetailEdit,
      subjectData,
      searchClick,
    };
  },
  components: {
    DragIcon,
    ReloadOutlined,
    ColumnHeightOutlined,
    SettingOutlined,
    FullscreenOutlined,
    FullscreenExitOutlined,
    SearchOutlined,
    Draggable,
    DragContainer,
    SycamoreDetail,
    DownOutlined,
    DuplicateChecking,
    ExamineReject,
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
  top: 0;
  left: 0;
  z-index: 99;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.45);
  .container {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200px;
    padding: 40px 0;
    text-align: center;
    background-color: #ffffff;
    border-radius: 8px;
    transform: translate(-50%, -50%);
  }
}
</style>
