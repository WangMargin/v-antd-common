<template>
  <page-container :show-breadcrumb="false">
    <a-card :bordered="false">
      <a-form :model="formState" ref="formRef" :rules="rules">
        <a-row :gutter="20">
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8" :xxl="8">
            <a-form-item
              label="统计项目"
              :label-col="{
                xs: { span: 6 },
                sm: { span: 4 },
                md: { span: 6 },
                lg: { span: 6 },
                xl: { span: 6 },
                xxl: { span: 6 },
              }"
              :wrapper-col="{
                xs: { span: 18 },
                sm: { span: 20 },
                md: { span: 18 },
                lg: { span: 18 },
                xl: { span: 18 },
                xxl: { span: 18 },
              }"
              name="category"
            >
              <a-select
                v-model:value="formState.category"
                show-search
                placeholder="请选择"
                style="width: 100%"
                :options="allCategoryList"
                @change="categoryChange"
              ></a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8" :xxl="8">
            <a-form-item
              label="所属年份"
              :label-col="{
                xs: { span: 6 },
                sm: { span: 4 },
                md: { span: 4 },
                lg: { span: 6 },
                xl: { span: 6 },
                xxl: { span: 6 },
              }"
              :wrapper-col="{
                xs: { span: 18 },
                sm: { span: 20 },
                md: { span: 18 },
                lg: { span: 18 },
                xl: { span: 18 },
                xxl: { span: 18 },
              }"
              name="year"
            >
              <a-select
                allowClear
                v-model:value="formState.year"
                show-search
                placeholder="请选择"
                style="width: 100%"
                :options="allYearList"
                @change="yearChange"
              ></a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="8" :xxl="8" v-if="isAdmin">
            <a-form-item
              label="任务"
              :label-col="{
                xs: { span: 6 },
                sm: { span: 4 },
                md: { span: 3 },
                lg: { span: 3 },
                xl: { span: 6 },
                xxl: { span: 6 },
              }"
              :wrapper-col="{
                xs: { span: 18 },
                sm: { span: 20 },
                md: { span: 21 },
                lg: { span: 21 },
                xl: { span: 18 },
                xxl: { span: 18 },
              }"
              name="task"
            >
              <a-select
                allowClear
                v-model:value="formState.task"
                show-search
                placeholder="请选择"
                style="width: 100%"
                :options="allTaskList.data"
              ></a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="8" :xxl="8" v-else>
            <a-row style="margin-top: 5px">
              <a-col :xs="0" :sm="0" :md="1" :lg="3" :xl="4" :xxl="4"></a-col>
              <a-col>
                <a-button type="primary" @click="handleSubmit" :loading="formBtnLoading">
                  筛选
                </a-button>
              </a-col>
              <a-col>
                <a-button type="primary" ghost style="margin-left: 10px" @click="resetForm">
                  重置
                </a-button>
              </a-col>
            </a-row>
          </a-col>
        </a-row>

        <a-row :gutter="20" v-if="isAdmin">
          <a-col :xs="24" :sm="24" :md="18" :lg="18" :xl="16" :xxl="16">
            <a-form-item
              label="科研主体"
              :label-col="{
                xs: { span: 6 },
                sm: { span: 4 },
                md: { span: 4 },
                lg: { span: 4 },
                xl: { span: 3 },
                xxl: { span: 3 },
              }"
              :wrapper-col="{
                xs: { span: 18 },
                sm: { span: 20 },
                md: { span: 20 },
                lg: { span: 20 },
                xl: { span: 21 },
                xxl: { span: 21 },
              }"
              name="subjects"
            >
              <a-tree-select
                show-search
                style="width: 100%"
                :dropdown-style="{ maxHeight: '240px', overflow: 'auto' }"
                allow-clear
                multiple
                tree-checkable
                :show-checked-strategy="SHOW_PARENT"
                v-model:value="formState.subjects"
                :tree-data="subjectData.value"
                :replace-fields="{ children: 'children', title: 'name', key: 'key', value: 'key' }"
              ></a-tree-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="8" :xxl="8">
            <a-row style="margin-top: 5px">
              <a-col :xs="0" :sm="0" :md="1" :lg="3" :xl="6" :xxl="6"></a-col>
              <a-col>
                <a-button type="primary" @click="handleSubmit" :loading="formBtnLoading">
                  筛选
                </a-button>
              </a-col>
              <a-col>
                <a-button type="primary" ghost style="margin-left: 10px" @click="resetForm">
                  重置
                </a-button>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card :bordered="false" style="margin-top: 12px" v-if="!listState.loading">
      <a-row type="flex" justify="end" style="margin-bottom: 10px">
        <a-col style="flex: 1">
          <a-button type="link" style="padding: 0">共计 {{ listState.total }} 条数据</a-button>
        </a-col>
        <a-col>
          <a-dropdown :trigger="['click']">
            <template #overlay>
              <a-menu>
                <a-menu-item @click="batchExportClick">批量导出</a-menu-item>
                <a-menu-item @click="batchExportClick('all')">导出全部数据</a-menu-item>
              </a-menu>
            </template>
            <a-button type="primary" ghost>
              批量操作
              <down-outlined />
            </a-button>
          </a-dropdown>
        </a-col>
        <a-col>
          <a-button
            type="primary"
            @click="addSycamore"
            style="margin-left: 20px"
            :disabled="savePermission ? false : true"
          >
            <plus-outlined />
            新建
          </a-button>
        </a-col>
      </a-row>

      <div style="height: 1000px">
        <ag-grid-vue
          style="width: 100%; height: 100%"
          class="ag-theme-balham"
          :defaultColDef="defaultColDef"
          :gridOptions="gridOptions"
          :columnDefs="listState.columnDefs"
          :rowData="listState.rowData"
          :checkboxSelection="true"
          :rowSelection="'multiple'"
          :localeText="localeText"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :sideBar="sideBar"
          :suppressContextMenu="true"
          :rowDragManaged="true"
          :groupSelectsChildren="true"
          :overlayLoadingTemplate="overlayLoadingTemplate"
          :overlayNoRowsTemplate="overlayNoRowsTemplate"
          :defaultExcelExportParams="defaultExcelExportParams"
          @cell-clicked="cellClick"
          @grid-ready="onGridReady"
        ></ag-grid-vue>
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
      @audit="sendBtnClick"
    ></sycamore-detail>
    <!-- 驳回删除填写意见 -->
    <examine-reject
      v-bind="examineRejectModal"
      @close="examineRejectClose"
      @ok="examineRejectOk"
    ></examine-reject>
  </page-container>
  <!-- 数据加载中 loading -->
  <a-modal
    :visible="formBtnLoading"
    :footer="null"
    :closable="false"
    centered
    :maskClosable="false"
  >
    <div style="text-align: center">
      <a-spin size="large" />
      <p style="padding: 20px 0 0 0">加载中...</p>
    </div>
  </a-modal>
</template>
<script>
import { TreeSelect, Modal } from 'ant-design-vue';
import { defineComponent, reactive, ref, onMounted, computed, toRaw, onActivated, h } from 'vue';
import localStorage from '@/utils/local-storage';
import { STORAGE_USER_SELECT_SUBJECT } from '@/store/mutation-type';
import {
  getSycamoreSelectList,
  getSycamoreLabels,
  getSycamoreList,
  submitAuditSycamore,
  formSycamoreKey,
  useSycamoreLables,
} from '@/api/dynamic/dynamic.js';
import { getSubjectsCategoriesList, adminGetTaskList } from '@/api/task/task.js';
import { moneyTransform } from '@/utils/common.js';
import DuplicateChecking from '@/views/task/components/duplicate-checking.vue';
import ExamineReject from '@/views/task/components/examine-reject.vue';
import SycamoreDetail from '@/views/dynamic/components/sycamore-detail.vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { DownOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-enterprise';
const localeText = {
  // for filter panel
  page: '页',
  more: '更多',
  to: '到',
  /* of: 'daOf', */
  next: '下一页',
  last: '最后',
  first: '第一',
  previous: '以前的',
  loadingOoo: '加载中...',

  // for set filter
  selectAll: '全部选择',
  searchOoo: '搜索...',
  blanks: '空',
  Column: '列',
  labels: '标签',
  // for number filter and text filter
  filterOoo: '过滤',
  applyFilter: '确定',
  resetFilter: '重置',
  equals: '等于',
  notEqual: '不等于',
  // for number filter
  lessThan: '少于',
  greaterThan: '多于',
  lessThanOrEqual: '小于等于',
  greaterThanOrEqual: '大于等于',
  inRange: '在范围内',
  // for text filter
  contains: '包含',
  notContains: '不包含',
  startsWith: '开始',
  endsWith: '结束',
  // filter conditions
  andCondition: '并且',
  orCondition: '或者',
  // the header of the default group column
  // group: '分组',
  // tool panel
  columns: '列',
  filters: '过滤器',
  rowGroupColumns: '行列组',
  // rowGroupColumnsEmptyMessage: '行列组为空',
  valueColumns: '列值',
  pivotMode: '透视模式',
  // groups: '分组',
  values: '值',
  // pivots: '中心点',
  valueColumnsEmptyMessage: '列值为空',
  // pivotColumnsEmptyMessage: '中心点为空',
  toolPanelButton: '工具按钮',
  // other
  noRowsToShow: '暂无数据',
  // enterprise menu
  pinColumn: '列位置调整',
  valueAggregation: '聚合值',
  autosizeThiscolumn: '自动调整此列大小',
  autosizeAllColumns: '自动调整所有列的大小',
  groupBy: '分组',
  ungroupBy: '取消分组',
  resetColumns: '重置列',
  expandAll: '展开所有',
  collapseAll: '关闭所有',
  toolPanel: '工具',
  export: '导出',
  csvExport: 'CSV 导出',
  excelExport: 'Excel 导出(.xlsx)',
  excelXmlExport: 'Excel 导出(.xml)',
  // enterprise menu pinning
  PinColumn: '固定',
  pinLeft: '居左',
  pinRight: '居右',
  noPin: '默认',
  // enterprise menu aggregation and status bar
  sum: '合计',
  min: '最小值',
  max: '最大值',
  /* none: 'laNone', */
  count: '计数',
  average: '平均值',
  avg: '平均值',
};
const statusInfo = {
  Failed: { key: 'Failed', value: '未通过' },
  Archived: { key: 'Archived', value: '已审核' },
  Del: { key: 'Deleted', value: '已删除' },
  Send: { key: 'Auditing', value: '审核中' },
};
import vpinyin from '@/utils/hanzi2py.js';
import moment from 'moment';
export default defineComponent({
  name: 'AchievementList',
  components: {
    AgGridVue,
    SycamoreDetail,
    DuplicateChecking,
    ExamineReject,
    DownOutlined,
    PlusOutlined,
  },
  setup() {
    const router = useRouter();
    const SHOW_PARENT = TreeSelect.SHOW_PARENT;
    const isAdmin = ref(false);
    const subjectInfo = localStorage.get(STORAGE_USER_SELECT_SUBJECT);
    subjectInfo.id === 'administrator' ? (isAdmin.value = true) : (isAdmin.value = false);
    const store = useStore();
    const resourcesData = computed(() => store.getters[`resources/data`]);
    const statisticsResource = resourcesData.value.resources;
    const allCategoryList = statisticsResource['all_category_enum'].map(k => {
      return { label: k.value, value: k.key, type: k.type };
    });
    const allYearList = statisticsResource['select_years_list'].map(k => {
      return { label: k.value, value: k.key };
    });
    // 任务
    const allTaskList = reactive({
      data: [],
    });
    // 获取任务列表
    const getAllTaskList = val => {
      const params = {};
      if (val) {
        const filters = [{ op: 'Equal', field: 'year', value: val }];
        params.filter = JSON.stringify(filters);
      }
      adminGetTaskList(params)
        .then(res => {
          allTaskList.data = res.data.list.map(item => {
            const o = { label: '', value: item.id };
            if (item.is_filed) {
              o.label = `${item.name}(${item.filed_time}已归档)`;
            } else {
              o.label = `${item.name}(未归档)`;
            }
            return o;
          });
        })
        .catch(() => {});
    };
    // 主体筛选
    const subjectData = reactive([]);

    const formBtnLoading = ref(false);
    const formRef = ref();
    const formState = reactive({
      category: '',
      year: '',
      task: '',
      subjects: [],
    });
    const rules = {
      category: [
        {
          required: true,
          message: '请选择统计项目',
          trigger: 'change',
        },
      ],
    };
    // 统计项目选择change
    const categoryChange = (val, options) => {
      formState.categoryTitle = options.label;
      formState.categoryType = options.type;
    };
    //年份选择change事件
    const yearChange = val => {
      if (val) {
        getAllTaskList(val);
      }
    };
    // 科研主体选择数据处理
    const subjectsHandler = data => {
      const newData = [];
      if (data.length > 0) {
        data.map(item => {
          if (item.length < 10) {
            const filterSubject = subjectData.value.filter(k => {
              return k.key === item;
            });
            filterSubject[0].children.map(m => {
              newData.push(m.key);
            });
          } else {
            newData.push(item);
          }
        });
      }
      return newData;
    };
    // 筛选条件组装filter
    const handlerFilter = data => {
      const params = {};
      const filters = [];
      if (data.year) {
        filters.push({ op: 'Equal', field: 'year', value: data.year });
      }
      if (data.task) {
        filters.push({ op: 'Equal', field: 'task_id', value: data.task });
      }
      if (data.subjects && data.subjects.length > 0) {
        const subjects = subjectsHandler(data.subjects);
        filters.push({ op: 'In', field: 'subject_id', value: subjects });
      }
      if (filters.length > 0) {
        params.filter = JSON.stringify(filters);
      }
      return params;
    };
    // ag-grid配置参数
    const agGridParam = {
      defaultColDef: { resizable: true },
      localeText: localeText,
      overlayLoadingTemplate: `<span class="ag-overlay-loading-center">正在加载…</span>`,
      overlayNoRowsTemplate: `<span class="ag-overlay-norows-center">暂无数据</span>`,
      gridOptions: {
        floatingFilter: true,
        onCellDoubleClicked: function (res) {
          Modal.info({
            centered: true,
            title: '查看详情',
            content: () =>
              h('div', {}, [h('p', ''), h('p', res.colDef.headerName), h('b', res.value)]),
          });
        },
      },
      sideBar: {
        toolPanels: [
          {
            id: 'columns',
            labelDefault: 'Columns',
            labelKey: 'columns',
            iconKey: 'columns',
            toolPanel: 'agColumnsToolPanel',
            toolPanelParams: {
              suppressRowGroups: true,
              suppressValues: true,
              suppressPivots: true,
              suppressPivotMode: true,
              suppressSideButtons: true,
              suppressColumnFilter: false,
              suppressColumnSelectAll: false,
              suppressColumnExpandAll: false,
            },
          },
          {
            id: 'filters',
            labelDefault: 'Filters',
            labelKey: 'filters',
            iconKey: 'filter',
            toolPanel: 'agFiltersToolPanel',
            toolPanelParams: {
              suppressRowGroups: true,
              suppressValues: true,
              suppressPivots: true,
              suppressPivotMode: true,
              suppressSideButtons: true,
              suppressColumnFilter: false,
              suppressColumnSelectAll: false,
              suppressColumnExpandAll: false,
            },
          },
        ],
        // defaultToolPanel: 'columns', // 默认打开侧边栏 选项
      },
      defaultExcelExportParams: {
        sheetName: '',
        fileName: '',
      },
    };
    // 列表数据
    const listState = reactive({
      total: 0,
      loading: true,
      gridApi: null,
      columnDefs: [],
      rowData: [],
      rowIndex: -1,
    });
    const savePermission = ref(false);
    // 判断当前主体是否有编辑权限
    const checkSubjectPermission = action => {
      if (isAdmin.value) {
        savePermission.value = true;
      } else {
        const subjectType = subjectInfo.type.key;
        const subjectAction = action[subjectType];
        if (subjectAction.length > 0) {
          savePermission.value = subjectAction.some(item => {
            return item.key === 'Save';
          });
        }
      }
    };
    // 链接 邮箱 文件 图片数据处理
    const dataFormatterHandle = (val, type, spl) => {
      const hArr = spl && val.includes(spl) ? val.split(spl) : [val];
      let hHtml = '';
      hArr.map(item => {
        if (type === 'Image' || type === 'File') {
          hHtml += '<a href="' + item + '" target="_blank">查看</a>';
        }
        if (type === 'Link') {
          hHtml += '<a href="' + item + '" target="_blank">链接</a>';
        }
        if (type === 'Link_mail') {
          hHtml += '<a href="mailto:' + item + '" target="_blank">' + item + '</a>';
        }
      });
      return hHtml;
    };
    // 处理labels fields
    const isCheck = ref(false);
    const handleFields = fields => {
      const columns = [];
      fields.map(item => {
        const o = {};
        if (!isCheck.value) {
          o.checkboxSelection = true;
          o.headerCheckboxSelection = true;
          isCheck.value = true;
        }
        o.headerName = item.label;
        if (item.children.length > 0) {
          o.children = handleFields(item.children);
        } else {
          o.field = item.key;
          if (item.key === 'status') {
            o.field = 'statustxt';
            o.width = 120;
          }
          if (item.sort) o.sortable = true;
          // 自定义搜索
          if (item.search !== null && item.search.op) {
            if (item.search.op === 'In') {
              o.filter = true;
            } else {
              o.filter = 'agTextColumnFilter';
            }
            o.floatingFilter = true;
            o.filterParams = { buttons: ['apply', 'reset'] };
          }
          if (Object.keys(item.formatter).length > 0 && item.formatter.type) {
            if (item.formatter.type === 'Money') {
              o.valueFormatter = function (k) {
                return k.data[item.key] ? moneyTransform(k.data[item.key]) : k.data[item.key];
              };
            } else {
              o.cellRenderer = function (k) {
                return k.data[item.key]
                  ? dataFormatterHandle(
                      k.data[item.key],
                      item.formatter.type,
                      item.formatter.split_str,
                    )
                  : k.data[item.key];
              };
            }
          }
          if (item.attribute.width) {
            o.width = parseInt(item.attribute.width);
          }
          o.suppressMenu = false; // 列菜单 true 为隐藏；false 为展示
        }
        columns.push(o);
      });
      return columns;
    };
    const handlerTableThData = data => {
      // 过滤label显示
      const filterLabels = data.filter(k => {
        k.sort = true; // 打开列排序
        return k.depth === 0 && k.key !== 'id';
      });

      const newFields = handleFields(filterLabels);
      return newFields;
    };
    // 操作按钮
    const operateBtn = params => {
      let opetateHtml = '',
        dupHtml = '',
        detailHtml = '',
        editHtml = '',
        sendHtml = '',
        delHtml = '';
      detailHtml =
        params.data.status.key === 'Deleted'
          ? `<a style="margin:0 5px;color:rgba(0,0,0,.45);cursor:not-allowed;">详情</a>`
          : `<a data-operate-type="detail" style="margin:0 5px;">详情</a>`;
      delHtml =
        params.data.status.key === 'Deleted' || !savePermission.value
          ? `<a style="margin:0 5px;color:rgba(0,0,0,.45);cursor:not-allowed;">删除</a>`
          : `<a data-operate-type="delete" style="margin:0 5px;">删除</a>`;

      if (isAdmin.value) {
        dupHtml =
          params.data.status.key === 'Auditing'
            ? `<a data-operate-type="duplicate" style="margin:0 5px;">审核</a>`
            : `<a style="margin:0 5px;color:rgba(0,0,0,.45);cursor:not-allowed;">审核</a>`;
      } else {
        editHtml =
          params.data.status.key === 'Deleted' || !savePermission.value
            ? `<a style="margin:0 5px;color:rgba(0,0,0,.45);cursor:not-allowed;">编辑</a>`
            : `<a data-operate-type="edit" style="margin:0 5px;">编辑</a>`;
        sendHtml =
          listState.status.key === 'Audit' &&
          params.data.status.key === 'Published' &&
          savePermission.value
            ? `<a data-operate-type="send" style="margin:0 5px;">送审</a>`
            : `<a style="margin:0 5px;color:rgba(0,0,0,.45);cursor:not-allowed;">送审</a>`;
      }
      opetateHtml = `${dupHtml}${detailHtml}${editHtml}${sendHtml}${delHtml}`;
      return opetateHtml;
    };
    const { storageData } = useSycamoreLables();
    // 当前统计项存储信息
    const nowCategoryStorageData = {};
    // 获取标题回调方法
    const getLabelsCallback = labels => {
      isCheck.value = false;
      listState.columnDefs = handlerTableThData(labels);
      listState.columnDefs.forEach(item => {
        // 添加自定义排序方式
        item.comparator = (valueA, valueB) => {
          if (vpinyin.chineseToPinYin(valueA) === vpinyin.chineseToPinYin(valueB)) return 0;
          return vpinyin.chineseToPinYin(valueA) > vpinyin.chineseToPinYin(valueB) ? 1 : -1;
        };
      });
      listState.columnDefs[0].rowDrag = true; // 设置table 拖拽排序功能

      listState.columnDefs.push({
        headerName: '操作',
        field: 'action',
        pinned: 'right', // fixed rightdefaultColDef
        cellRenderer: params => {
          const html = operateBtn(params);
          return `<div>${html}</div>`;
        },
        suppressMenu: true,
        width: isAdmin.value ? 124 : 164,
      });
    };
    // 获取统计项信息回调方法
    const getCategoryCallback = data => {
      listState.status = data.status;
      listState.action = data.action;
      checkSubjectPermission(data.action);
    };
    // 获取数据列表处理回调方法
    const getListCallback = data => {
      listState.rowData = data.map(item => {
        item.statustxt = item.status.value;
        return item;
      });
    };
    // 获取数据
    const getLablesListData = () => {
      const params = handlerFilter(formState);
      const tableLabelsStorage = localStorage.get('sycomareTableLabels') || [];
      const findCategory =
        tableLabelsStorage.length > 0
          ? tableLabelsStorage.find(k => k.id === formState.category)
          : null;
      // 本地已有
      if (findCategory && findCategory !== null) {
        getLabelsCallback(findCategory.labels);
        getCategoryCallback(findCategory);
        if (isAdmin.value) {
          getSycamoreSelectList(formState.category, params)
            .then(res => {
              listState.total = res.data.total;
              getListCallback(res.data.list);
            })
            .finally(() => {
              formBtnLoading.value = false;
              listState.loading = false;
            });
        } else {
          getSycamoreList(params, formState.category)
            .then(res => {
              listState.total = res.data.total;
              getListCallback(res.data.list);
            })
            .finally(() => {
              formBtnLoading.value = false;
              listState.loading = false;
            });
        }
      } else {
        savePermission.value = false;
        getSycamoreLabels(formState.category)
          .then(res => {
            nowCategoryStorageData.labels = res.data.labels;
            getLabelsCallback(res.data.labels);
            return formSycamoreKey(formState.category);
          })
          .then(res => {
            nowCategoryStorageData.id = formState.category;
            nowCategoryStorageData.action = res.data.info.action;
            nowCategoryStorageData.remark = res.data.info.description;
            nowCategoryStorageData.status = res.data.info.status;
            nowCategoryStorageData.simpleName = res.data.info.simple_name;
            nowCategoryStorageData.type = res.data.info.type.key;
            storageData(nowCategoryStorageData);
            getCategoryCallback(res.data.info);
            if (isAdmin.value) {
              return getSycamoreSelectList(formState.category, params);
            } else {
              return getSycamoreList(params, formState.category);
            }
          })
          .then(res => {
            listState.total = res.data.total;
            getListCallback(res.data.list);
          })
          .finally(() => {
            formBtnLoading.value = false;
            listState.loading = false;
          });
      }
    };
    //筛选
    const handleSubmit = () => {
      formBtnLoading.value = true;
      formRef.value
        .validate()
        .then(() => {
          if (listState.gridApi !== null) {
            listState.gridApi.showLoadingOverlay();
          }
          agGridParam.defaultExcelExportParams.fileName =
            formState.categoryTitle + '-' + moment().format('YYYYMMDDHHmmss') + '.xlsx';
          agGridParam.defaultExcelExportParams.sheetName = formState.categoryTitle;
          getLablesListData();
        })
        .catch(() => {
          formBtnLoading.value = false;
        });
    };
    // 重置
    const resetForm = () => {
      formRef.value.resetFields();
    };

    // 查看详情
    const detailDrawer = reactive({
      visible: false,
      record: null,
      title: '',
      id: null,
      permission: isAdmin.value ? 'admin' : 'operator',
      savePermission: true,
      zIndex: 1002,
      itemStatus: '',
      categoryId: '',
      isFiled: false,
      taskId: '',
    });
    // 详情按钮点击
    const detailBtnClick = record => {
      detailDrawer.visible = true;
      detailDrawer.record = toRaw(record);
      detailDrawer.id = record.id;
      detailDrawer.title = formState.categoryTitle;
      detailDrawer.categoryId = formState.category;
      detailDrawer.itemStatus = listState.status.key;
      detailDrawer.savePermission = savePermission.value;
      detailDrawer.isFiled = record.is_filed === 0 ? false : true;
      detailDrawer.taskId = formState.task;
    };
    const viewDetailsClose = () => {
      detailDrawer.visible = false;
    };
    // 审核查重页面点击详情按钮
    const examineDuplicateEdit = record => {
      detailBtnClick(record);
    };
    // 查重
    const duplicateCheck = reactive({
      visible: false,
      checkData: null,
      categoryType: '',
      categoryTitle: '',
      source: 'achievement',
    });
    const duplicateBtnClick = record => {
      duplicateCheck.visible = true;
      duplicateCheck.checkData = record;
      duplicateCheck.categoryType = formState.categoryType;
      duplicateCheck.categoryTitle = formState.categoryTitle;
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
    const examineRejectOk = type => {
      examineRejectClose();
      viewDetailsClose();
      duplicateCheckClose();
      // reload();
      listState.rowData[listState.rowIndex].status = statusInfo[type];
      listState.rowData[listState.rowIndex].statustxt = statusInfo[type].value;
    };
    // 列表页删除按钮点击
    const deleteBtnClick = record => {
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
    // 编辑按钮点击
    const editBtnClick = record => {
      router.push({
        path: `/researchdata/edit/${formState.category}/${record.id}`,
      });
    };
    // 送审按钮点击
    const sendBtnClick = record => {
      Modal.confirm({
        zIndex: 1005,
        title: '确定要送审吗？',
        onOk() {
          submitAuditSycamore(record.id, { remark: '' })
            .then(() => {
              // 改变数据状态
              listState.rowData[listState.rowIndex].status = statusInfo['Send'];
              listState.rowData[listState.rowIndex].statustxt = statusInfo['Send'].value;
              viewDetailsClose();
            })
            .catch(() => {});
        },
        onCancel() {},
      });
    };
    // 单元格点击事件
    const cellClick = e => {
      const record = e.data;
      const clickType = e.event.target.getAttribute('data-operate-type');
      listState.rowIndex = e.rowIndex;
      switch (clickType) {
        case 'duplicate':
          duplicateBtnClick(record);
          break;
        case 'detail':
          detailBtnClick(record);
          break;
        case 'delete':
          deleteBtnClick(record);
          break;
        case 'edit':
          editBtnClick(record);
          break;
        case 'send':
          sendBtnClick(record);
          break;
        default:
          listState.rowIndex = -1;
      }
    };
    const onGridReady = params => {
      listState.gridApi = params.api;
    };
    // 导出
    const batchExportClick = type => {
      if (type === 'all') {
        listState.gridApi.exportDataAsExcel();
      } else {
        listState.gridApi.exportDataAsExcel({
          onlySelected: true,
        });
      }
    };
    // 新建
    const addSycamore = () => {
      router.push({
        path: `/researchdata/add/${formState.category}`,
      });
    };
    onActivated(() => {
      const dynamicReload = localStorage.get('dynamicReload');
      if (dynamicReload) {
        if (formState.category) {
          handleSubmit();
        }
        localStorage.remove('dynamicReload');
      }
    });
    onMounted(() => {
      if (isAdmin.value) {
        getAllTaskList();
        getSubjectsCategoriesList()
          .then(res => {
            subjectData.value = res.data.subjects;
          })
          .catch(() => {});
      }
    });
    return {
      savePermission,
      SHOW_PARENT,
      isAdmin,
      formRef,
      rules,
      formState,
      subjectData,
      allCategoryList,
      allYearList,
      allTaskList,
      categoryChange,
      yearChange,
      handleSubmit,
      resetForm,
      onGridReady,
      listState,
      cellClick,
      detailDrawer,
      duplicateCheck,
      duplicateCheckClose,
      examineRejectModal,
      examineRejectClose,
      examineRejectOk,
      examineDuplicateEdit,
      examineDuplicateExamine,
      viewDetailsExamineClickOk,
      viewDetailEdit,
      viewDetailsClose,
      batchExportClick,
      addSycamore,
      sendBtnClick,
      formBtnLoading,
      ...agGridParam,
    };
  },
});
</script>
<style lang="less" scoped>
@import '~ag-grid-community/dist/styles/ag-grid.css';
@import '~ag-grid-community/dist/styles/ag-theme-balham.css';
</style>
