<template>
  <div class="table ant-pro-table" style="">
    <a-card :body-style="{ padding: 0 }" :bordered="false" ref="elRef">
      <div class="ant-pro-table-list-toolbar">
        <div class="ant-pro-table-list-toolbar-container">
          <div class="ant-pro-table-list-toolbar-left">
            <div class="ant-pro-table-list-toolbar-title"></div>
          </div>
          <div class="ant-pro-table-list-toolbar-right">
            <a-space align="center">
              <a-dropdown v-if="savePermission" :trigger="['click']">
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="importConfirm">导入数据</a-menu-item>
                    <a-menu-item @click="batchExportTemplateClick">下载模板</a-menu-item>
                  </a-menu>
                </template>
                <a-button type="primary" ghost>
                  批量导入数据
                  <down-outlined />
                </a-button>
              </a-dropdown>
              <a-dropdown :trigger="['click']">
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="batchExamineClick('Auditing')" :disabled="batchDisabled">
                      批量送审
                    </a-menu-item>
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
              <a-button type="primary" @click="addSycamore" v-if="savePermission">
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
      <div data-table="table">
        <a-table
          :scroll="{ x: 1000 }"
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
          bordered
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
          <template #name="{ text }">
            <span
              :title="text"
              :style="`display:block;overflow : hidden;text-overflow: ellipsis;white-space: nowrap;width:${tableInfo.nameWidth}px;`"
            >
              {{ text }}
            </span>
          </template>
          <template #status="{ text }">
            {{ text.value }}
          </template>
          <template #action="{ record }">
            <a-button
              size="small"
              type="link"
              @click="viewDetails(record)"
              :disabled="record.status.key === 'Deleted' ? true : false"
            >
              查看
            </a-button>
            <a-button
              v-if="false"
              size="small"
              type="link"
              @click="editSycamore(record)"
              :disabled="record.status.key === 'Deleted' || !savePermission ? true : false"
            >
              编辑
            </a-button>
            <a-button
              size="small"
              type="link"
              @click="sendExamine(record)"
              :disabled="
                record.status.key === 'Published' && status.key === 'Audit' && savePermission
                  ? false
                  : true
              "
              v-show="
                record.status.key === 'Published' && status.key === 'Audit' && savePermission
                  ? true
                  : false
              "
            >
              送审
            </a-button>
            <a-button
              size="small"
              type="link"
              @click="deleteSycamore(record)"
              :disabled="record.status.key === 'Deleted' || !savePermission ? true : false"
            >
              删除
            </a-button>
          </template>
        </a-table>
      </div>
    </a-card>
    <sycamore-detail
      v-bind="detailDrawer"
      @close="viewDetailsClose"
      @edit="viewDetailsEdit"
      @audit="viewDetailAudit"
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
    <!--    <a-modal :visible="importModalVisible" :closable="false">-->
    <a-modal
      title="导入数据"
      :visible="importModalVisible"
      :closable="true"
      @cancel="handleCancel"
      :maskClosable="false"
    >
      <a-upload-dragger
        accept=".xls,.xlsx"
        :multiple="false"
        :showUploadList="false"
        :before-upload="selectExcel"
        @change="handleOk"
      >
        <p class="ant-upload-drag-icon">
          <inbox-outlined></inbox-outlined>
        </p>
        <p class="ant-upload-text">点击或拖拽文件至此区域进行上传</p>
        <p class="ant-upload-hint">
          请通过下载的模板填写数据，仅支持上传一个 ".xls" 或 ".xlsx" 文件
        </p>
      </a-upload-dragger>
      <template #footer>
        <a-button key="back" @click="handleCancel" style="margin-right: 20px">取消</a-button>
        <a-button type="primary" @click="batchExportTemplateClick">下载模板</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { defineComponent, ref, computed, reactive, onActivated, h } from 'vue';
import {
  PlusOutlined,
  ReloadOutlined,
  ColumnHeightOutlined,
  SettingOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  SearchOutlined,
  DownOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons-vue';
import { Container as DragContainer, Draggable } from '@/components/draggable';
import { useFetchData } from '@/utils/hooks/useFetchData';
import { useFullscreen } from '@/utils/hooks/useFullscreen';
import { useTableDynamicColumns } from '@/utils/hooks/useTableColumn';
import DragIcon from '@/components/table/drag-icon.vue';
import {
  getSycamoreList,
  submitAuditSycamore,
  batchOperateSendItem,
  catagorySycamoreExport,
  catagorySycamoreTemplateExport,
  formSycamoreKey,
} from '@/api/dynamic/dynamic.js';
import { Modal, message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import SycamoreDetail from './sycamore-detail.vue';
import { moneyTransform, downloadFileExcel, handleFiltersSorter } from '@/utils/common.js';
import { excelDataAnalysis } from '@/utils/xlsx.js';
import localStorage from '@/utils/local-storage';
import { STORAGE_USER_SELECT_SUBJECT } from '@/store/mutation-type';
import moment from 'moment';
import ExamineReject from '@/views/task/components/examine-reject.vue';
export default defineComponent({
  name: 'ListTable',
  props: {
    category: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    // 动态数据介绍
    remark: {
      type: String,
      default: '',
    },
    labels: {
      type: Array,
      default: () => [],
    },
    // 操作权限
    action: {
      type: Object,
      default: () => null,
    },
    // 当前统计项状态
    status: {
      type: Object,
      default: () => null,
    },
  },
  setup(props) {
    const tableInfo = reactive({
      width: 200, // 表格总宽
      height: 480, // 表格总高
      defaultWidth: 160, // 每列默认宽度
      actionWidth: 120, //操作列宽度
      nameWidth: 160, // 名字列宽度
    });
    const batchDisabled = ref(true);
    const importLoading = reactive({
      show: false,
      txt: '正在导入，请稍后…',
    });
    const searchInput = ref();
    const store = useStore();
    const resourcesData = computed(() => store.getters[`resources/data`]);
    const statisticsResource = resourcesData.value.resources;
    // 链接 邮箱 文件 图片转为超链
    const labelATransform = (text, link, title) => {
      return h(
        'a',
        {
          style: {
            margin: '0 10px 0 0',
          },
          title: title,
          href: link,
          target: '_blank',
        },
        text,
      );
    };
    // 链接 邮箱 文件 图片数据处理
    const dataFormatterHandle = (val, type, spl) => {
      const hArr = spl && val.includes(spl) ? val.split(spl) : [val];
      const hHtml = [];
      hArr.map(item => {
        if (type === 'Image' || type === 'File') {
          hHtml.push(labelATransform('查看', item));
        }
        if (type === 'Link') {
          hHtml.push(labelATransform('链接', item, item));
        }
        if (type === 'Link_mail') {
          hHtml.push(labelATransform(item, `mailto:${item}`));
        }
      });
      return hHtml;
    };
    // 处理labels fields
    const handleFields = fields => {
      const columns = [];
      fields.map(item => {
        const o = {};
        o.title = item.label;
        if (item.children.length > 0) {
          o.children = handleFields(item.children);
        } else {
          o.dataIndex = item.key;
          o.ellipsis = true;
          if (item.sort) o.sorter = true;
          // 自定义搜索
          if (item.search !== null && item.search.op) {
            o.op = item.search.op;
            o.sk = item.search.field ? item.search.field : item.key;
            if (item.search.op === 'In') {
              if (item.search.data_source) {
                if (item.search.data_source.type === 'Resource') {
                  o.filters = statisticsResource[item.search.data_source.value].map(k => {
                    return { text: k.value, value: k.key };
                  });
                }
                if (item.search.data_source.type === 'Enum') {
                  o.filters = item.search.data_source.enum.map(k => {
                    return { text: k.value, value: k.key };
                  });
                }
              } else {
                o.filters = [];
              }
            } else {
              o.slots = {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'customRender',
              };
            }
          }
          if (item.key === 'name') {
            o.ellipsis = false;
            o.slots = {
              customRender: 'name',
            };
            tableInfo.nameWidth = item.attribute.width
              ? parseInt(item.attribute.width) - 34
              : tableInfo.defaultWidth - 34;
          }
          if (item.key === 'status') {
            o.slots = {
              customRender: 'status',
            };
          }
          if (Object.keys(item.formatter).length > 0 && item.formatter.type) {
            if (item.formatter.type === 'Money') {
              o.customRender = function ({ text }) {
                return text ? moneyTransform(text) : text;
              };
            } else {
              o.customRender = function ({ text }) {
                return text
                  ? dataFormatterHandle(text, item.formatter.type, item.formatter.split_str)
                  : text;
              };
            }
          }
          o.width = item.attribute.width ? parseInt(item.attribute.width) : tableInfo.defaultWidth;
          tableInfo.width += item.attribute.width
            ? parseInt(item.attribute.width)
            : tableInfo.defaultWidth;
        }
        columns.push(o);
      });
      return columns;
    };
    // 过滤label显示
    const filterLabels = props.labels.filter(k => {
      return k.depth === 0 && k.key !== 'id';
    });
    const allColumns = handleFields(filterLabels);
    allColumns.push({
      title: '操作',
      dataIndex: 'action',
      slots: {
        customRender: 'action',
      },
      fixed: 'right',
      width: tableInfo.actionWidth,
    });

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

    const { stripe, reload, setPageInfo, context: state } = useFetchData(getSycamoreList, {
      current: 1,
      pageSize: 100,
      tableSize: 'middle',
      stripe: false,
      id: props.category,
    });
    const listFilter = reactive({
      filter: null,
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
      if (filters_sorter.filter) {
        listFilter.filter = filters_sorter.filter;
      }
    };
    onActivated(() => {
      const dynamicReload = localStorage.get('dynamicReload');
      if (dynamicReload) {
        reload();
        localStorage.remove('dynamicReload');
      }
    });
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
    //   disabled: record.status.key !== 'Published',
    // });
    const router = useRouter();
    // 新建数据
    const addSycamore = () => {
      router.push({
        path: `/researchdata/add/${props.category}`,
      });
    };
    // 查看详情
    const detailDrawer = reactive({
      visible: false,
      record: null,
      title: props.title,
      id: null,
      permission: 'operator',
      savePermission: false,
      itemStatus: props.status.key,
      categoryId: '',
    });
    const viewDetails = record => {
      detailDrawer.visible = true;
      detailDrawer.record = record;
      detailDrawer.id = record.id;
      detailDrawer.categoryId = props.category;
    };
    const viewDetailsClose = () => {
      detailDrawer.visible = false;
    };
    // 编辑
    const editSycamore = record => {
      router.push({
        path: `/researchdata/edit/${props.category}/${record.id}`,
      });
    };
    const viewDetailsEdit = () => {
      detailDrawer.visible = false;
    };
    // 送审
    const sendExamine = record => {
      Modal.confirm({
        title: '确定要送审吗？',
        onOk() {
          submitAuditSycamore(record.id, { remark: '' })
            .then(() => {
              detailDrawer.visible = false;
              reload();
            })
            .catch(() => {});
        },
        onCancel() {},
      });
    };
    const viewDetailAudit = record => {
      sendExamine(record);
    };
    // 通过  驳回  删除 按钮点击
    const examineRejectModal = reactive({
      visible: false,
      id: null,
      type: '',
      zIndex: 1003,
    });
    // 显示通过驳回删除内容填写浮层
    const deleteSycamore = record => {
      examineRejectModal.visible = true;
      examineRejectModal.id = record.id;
      examineRejectModal.type = 'Del';
    };
    //填写原因弹层关闭
    const examineRejectClose = () => {
      examineRejectModal.visible = false;
    };
    // 填写原因弹层提交成功后回调
    const examineRejectOk = () => {
      examineRejectClose();
      reload();
    };
    const savePermission = ref(false);
    // 判断当前主体是否有编辑权限
    const checkSubjectPermission = () => {
      const selectSubject = localStorage.get(STORAGE_USER_SELECT_SUBJECT);
      const subjectType = selectSubject.type.key;
      const subjectAction = props.action[subjectType];
      if (subjectAction.length > 0) {
        savePermission.value = subjectAction.some(item => {
          return item.key === 'Save';
        });
        detailDrawer.savePermission = savePermission.value;
      }
    };
    checkSubjectPermission();
    // 批量送审
    const batchExamineClick = status => {
      Modal.confirm({
        title: '确定要全部送审吗？',
        onOk() {
          batchOperateSendItem(status, { item_ids: state.selectedRowKeys, remark: '' })
            .then(() => {
              state.selectedRowKeys = [];
              batchDisabled.value = true;
              reload();
            })
            .catch(() => {});
        },
        onCancel() {},
      });
    };
    // 批量导出 导出全部
    const batchExportClick = type => {
      const filters =
        type === 'all'
          ? listFilter.filter
          : JSON.stringify([
              { field: 'id', op: 'In', value: state.selectedRowKeys },
            ]); /* field值由_id改为id 0512*/
      Modal.confirm({
        title: '确定要导出吗？',
        onOk() {
          importLoading.show = true;
          importLoading.txt = '正在导出，请稍后…';
          catagorySycamoreExport(props.category, { filter: filters })
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
    // 导出模板
    const batchExportTemplateClick = () => {
      importLoading.show = true;
      importLoading.txt = '正在导出，请稍后…';
      catagorySycamoreTemplateExport(props.category)
        .then(res => {
          downloadFileExcel(res);
          importLoading.show = false;
        })
        .catch(() => {
          importLoading.show = false;
        });
    };
    // 处理表格数据对照以及数据格式化
    const excelDateTransform = (val, formatter) => {
      const time = moment(val).valueOf();
      return moment(time + 86400000).format(formatter);
    };
    // 数据格式处理
    const valueFormatterFun = (field, value) => {
      let val = null,
        newVal = null;
      if (!value) {
        return value;
      }
      // 日期格式处理
      if (field.component.type.key === 'DatePicker') {
        if (typeof value === 'object')
          val = excelDateTransform(value, field.component.parameter.formatter);
        else val = value;
      } else if (
        field.component.type.key === 'UIMS_Users' ||
        field.component.type.key === 'UIMS_Departments'
      ) {
        if (value) val = { id: 0, value: value };
        else val = value;
      } else val = value;
      if (field.type.key === 'Number') newVal = Number(val);
      else if (field.type.key === 'String') newVal = String(val).trim();
      else newVal = val;
      return newVal;
    };
    // 数据是否在数据源中
    const valueMateFun = (field, value) => {
      let val = value,
        findArr = null;
      if (
        field.component.data_source !== null &&
        field.component.type.key !== 'SelectTags' &&
        !field.component.has_other_input
      ) {
        if (field.component.data_source.type.key === 'Resource') {
          findArr = statisticsResource[field.component.data_source.value].filter(
            k => k.value === value.toString().trim(),
          );
        }
        if (field.component.data_source.type.key === 'Enum') {
          findArr = field.component.data_source.enum.filter(
            k => k.value === value.toString().trim(),
          );
        }
      }
      if (findArr !== null) {
        if (findArr.length === 0) val = '';
        else {
          val = findArr[0].key;
          if (!val) val = findArr[0].value;
        }
      }
      return val;
    };
    // fields对照  fields:组件数组   item:匹配前数据   o:匹配后数据   parentO:匹配后父级数据  parentItem:匹配前父级数据
    const schemaFieldsHandle = (fields, item, o, parentO, parentItem) => {
      fields.map(f => {
        // 父子组件
        if (f.components !== null) {
          if (item[f.label] !== undefined) {
            o[f.key] = {};
            schemaFieldsHandle(f.components, item[f.label], o[f.key], o, item);
          }
        } else {
          if (item[f.label] === undefined && f.component.skip !== 1) return false;
          const itemVal = f.component.skip === 1 ? parentItem[f.label] : item[f.label];
          if (itemVal) {
            let newV = null;
            if (f.multiple === 1) {
              o[f.key] = [];
              const spl = f.component.formatter.split_str;
              if (itemVal.toString().includes(spl)) {
                itemVal.split(spl).map(v => {
                  newV = valueMateFun(f, v);
                  if (newV) o[f.key].push(valueFormatterFun(f, newV));
                });
              } else {
                newV = valueMateFun(f, itemVal);
                if (newV) o[f.key].push(valueFormatterFun(f, newV));
              }
            } else {
              newV = valueMateFun(f, itemVal);
              o[f.key] = valueFormatterFun(f, newV);
            }
          } else {
            o[f.key] = f.multiple === 1 ? [] : '';
          }
          if (f.component.skip === 1) {
            parentO[f.key] = o[f.key];
            delete o[f.key];
          }
        }
      });
    };
    const schemaStructureHandle = (fields, data) => {
      const result = [];
      data.map(item => {
        const o = {
          data: {},
          year: null,
        };
        schemaFieldsHandle(fields, item, o.data);
        o.year =
          item['所属年份'] && !isNaN(Number(item['所属年份'])) ? Number(item['所属年份']) : null;
        result.push(o);
      });
      return result;
    };
    // 导入确认
    const importModalVisible = ref(false);
    const importConfirm = () => {
      importModalVisible.value = true;
    };
    const handleOk = () => {
      importModalVisible.value = false;
    };

    const handleCancel = () => {
      importModalVisible.value = false;
    };
    // 选择表格导入
    const selectExcel = file => {
      // 读取表格文件
      if (!/.(xls|xlsx)$/.test(file.name.toLowerCase())) {
        message.error('上传格式不正确，请上传xls或者xlsx格式');
        return false;
      }
      importLoading.show = true;
      importLoading.txt = '正在导入，请稍后…';
      excelDataAnalysis(file)
        .then(data => {
          if (data.length === 0) {
            message.error('导入数据为空！');
            importLoading.show = false;
            return false;
          }
          if (data.length > 100) {
            message.error('导入数据超过100条！');
            importLoading.show = false;
            return false;
          }
          formSycamoreKey(props.category)
            .then(res => {
              const batchImportData = schemaStructureHandle(res.data.info.schema.fields, data);
              if (Object.keys(batchImportData[0].data).length === 0) {
                message.error('导入数据与统计项目不符！');
                importLoading.show = false;
                return false;
              }
              const batchSchemaData = localStorage.get('batchSchemaData') || [];
              const findIndex = batchSchemaData.findIndex(v => v.id === props.category);
              if (findIndex !== -1) {
                if (batchSchemaData[findIndex].list.length > 0) {
                  message.error('当前正在导入中，请提交完再次导入！！！');
                } else {
                  batchSchemaData[findIndex].list = batchImportData;
                }
              } else {
                batchSchemaData.push({ id: props.category, list: batchImportData });
              }
              importLoading.show = false;
              localStorage.set('batchSchemaData', batchSchemaData);
              router.push({
                path: `/researchdata/batch/${props.category}`,
              });
            })
            .catch(err => {
              console.log(err);
              message.error('excel表格导入失败，请重新导入');
              importLoading.show = false;
              return false;
            });
        })
        .catch(err => {
          message.error(err || 'excel表格解析失败，请重新导入');
          importLoading.show = false;
          return false;
        });
      return false;
    };
    return {
      importLoading,
      tableInfo,
      batchDisabled,
      savePermission,
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
      sendExamine,
      editSycamore,
      viewDetails,
      addSycamore,
      viewDetailsClose,
      detailDrawer,
      viewDetailsEdit,
      viewDetailAudit,
      onSelectChange,
      // getCheckboxProps,
      batchExamineClick,
      deleteSycamore,
      batchExportClick,
      selectExcel,
      batchExportTemplateClick,
      importConfirm,
      importModalVisible,
      handleOk,
      handleCancel,
      examineRejectModal,
      examineRejectClose,
      examineRejectOk,
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
    SycamoreDetail,
    DownOutlined,
    InfoCircleOutlined,
    ExamineReject,
  },
});
</script>
<style lang="less" scoped>
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
