<template>
  <div>
    <div class="subject-loading" v-if="loading">
      <a-spin />
    </div>
    <div class="table ant-pro-table" v-else>
      <a-card :body-style="{ padding: 0 }" :bordered="false" ref="elRef">
        <div class="ant-pro-table-list-toolbar">
          <div class="ant-pro-table-list-toolbar-container">
            <div class="ant-pro-table-list-toolbar-left">
              <div class="ant-pro-table-list-toolbar-title"></div>
            </div>
            <div class="ant-pro-table-list-toolbar-right">
              <a-space align="center">
                <a-button type="primary" @click="addSubjetsShow">
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
          <template #operators="{ text }">
            <template v-for="operator in text" :key="operator.id">
              <a-tag>{{ operator.name }}</a-tag>
            </template>
          </template>
          <template #action="{ record }">
            <a @click="editSubjects(record)">编辑</a>
          </template>
        </a-table>
      </a-card>
    </div>
    <template v-if="currentRoute === 'college'">
      <operator-form
        v-if="editModal.visible"
        v-bind="editModal"
        @cancel="
          () => {
            editModal.visible = false;
          }
        "
        @ok="subjectModalOk"
      ></operator-form>
    </template>
    <template v-else>
      <subject-form
        v-if="editModal.visible"
        v-bind="editModal"
        @cancel="
          () => {
            editModal.visible = false;
          }
        "
        @ok="subjectModalOk"
      ></subject-form>
    </template>
  </div>
</template>
<script>
import { defineComponent, reactive, onMounted, computed, toRaw, ref } from 'vue';
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
import { getSubjectsList, getSubjectsSchoolOperatorList } from '@/api/subjects/subject.js';
import SubjectForm from './subject-form.vue';
import OperatorForm from './operator-form.vue';
import { handleFiltersSorter } from '@/utils/common.js';
import { useStore } from 'vuex';
import { GET_UIMSRESOURCES } from '@/store/modules/resources/actions';
const contrastData = {
  staff: 'Faculty',
  team: 'Team',
  college: 'School',
};
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
  name: 'Content',
  setup() {
    const loading = ref(true);
    const store = useStore();
    const route = useRoute();
    const currentRoute = route.name;
    const resourcesData = computed(() => store.getters[`resources/data`]);
    const subjectsResource = resourcesData.value.resources;
    if (!resourcesData.value.uimsDepartment) {
      store.dispatch(`resources/${GET_UIMSRESOURCES}`).then(() => {
        loading.value = false;
      });
    } else {
      loading.value = false;
    }
    // 职位
    const positionFilters = subjectsResource['faculty_position_enum'].map(k => {
      return { text: k.value, value: k.key };
    });
    // 机构
    const parentFilters = subjectsResource['team_parent_enum'].map(k => {
      return { text: k.value, value: k.key };
    });
    // 角色
    // const roleFilters = subjectsResource['operator_type_enum'].map(k => {
    //   return { text: k.value, value: k.key };
    // });
    const searchInput = ref();
    const allColumns = {
      Faculty: [
        {
          title: '主体名称',
          dataIndex: 'name',
          slots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
          },
          ellipsis: true,
          width: '18%',
          op: 'Like',
          sk: 'name',
        },
        {
          title: '职位',
          dataIndex: 'info.position.value',
          filters: positionFilters,
          ellipsis: true,
          width: '12%',
          op: 'In',
          sk: 'info.position',
        },
        {
          title: '所属部门',
          dataIndex: 'info.department.value',
          ellipsis: true,
          width: '20%',
        },
        {
          title: '是否启用',
          dataIndex: 'is_active',
          slots: {
            customRender: 'is_active',
          },
          filters: enableData,
          ellipsis: true,
          width: '10%',
          op: 'In',
          sk: 'is_active',
          boolTrans: true,
        },
        {
          title: '操作员',
          dataIndex: 'operators',
          slots: {
            customRender: 'operators',
          },
          ellipsis: true,
          width: '30%',
        },
        {
          title: '操作',
          dataIndex: 'action',
          slots: {
            customRender: 'action',
          },
          ellipsis: true,
          width: '10%',
        },
      ],
      Team: [
        {
          title: '主体名称',
          dataIndex: 'name',
          slots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
          },
          ellipsis: true,
          width: '30%',
          op: 'Like',
          sk: 'name',
        },
        {
          title: '所属机构',
          dataIndex: 'info.parent.value',
          filters: parentFilters,
          op: 'In',
          sk: 'info.parent',
          ellipsis: true,
          width: '18%',
        },
        {
          title: '是否启用',
          dataIndex: 'is_active',
          slots: {
            customRender: 'is_active',
          },
          filters: enableData,
          ellipsis: true,
          width: '12%',
          op: 'In',
          sk: 'is_active',
          boolTrans: true,
        },
        {
          title: '操作员',
          dataIndex: 'operators',
          slots: {
            customRender: 'operators',
          },
          ellipsis: true,
        },
        {
          title: '操作',
          dataIndex: 'action',
          slots: {
            customRender: 'action',
          },
          ellipsis: true,
          width: '10%',
        },
      ],
      School: [
        {
          title: '姓名',
          dataIndex: 'name',
          slots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
          },
          ellipsis: true,
          op: 'Like',
          sk: 'name',
        },
        // {
        //   title: '角色',
        //   dataIndex: 'type.value',
        //   filters: roleFilters,
        //   ellipsis: true,
        //   width: '30%',
        //   op: 'In',
        //   sk: 'type',
        // },
        // {
        //   title: '是否启用',
        //   dataIndex: 'is_active',
        //   slots: {
        //     customRender: 'is_active',
        //   },
        //   filters: enableData,
        //   ellipsis: true,
        //   width: '20%',
        //   op: 'In',
        //   sk: 'is_active',
        //   boolTrans: true,
        // },
        {
          title: '操作',
          dataIndex: 'action',
          slots: {
            customRender: 'action',
          },
          ellipsis: true,
          width: '20%',
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
    const getDataInterface = reactive({
      interface: getSubjectsList,
      params: {
        type: contrastData[route.name],
      },
    });
    if (route.name === 'college') {
      getDataInterface.interface = getSubjectsSchoolOperatorList;
      getDataInterface.params = {};
    }
    const { stripe, reload, setPageInfo, context: state } = useFetchData(
      getDataInterface.interface,
      {
        current: 1,
        pageSize: 100,
        tableSize: 'middle',
        stripe: false,
        params: getDataInterface.params,
      },
    );
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
    const addSubjetsShow = () => {
      editModal.visible = true;
      editModal.id = '-1';
    };
    onMounted(() => {});
    const subjectModalOk = () => {
      editModal.visible = false;
      reload();
    };
    const editSubjects = record => {
      editModal.visible = true;
      editModal.id = record.id;
      editModal.model = toRaw(record);
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
      addSubjetsShow,
      subjectModalOk,
      editSubjects,
      searchInput,
      loading,
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
    SubjectForm,
    OperatorForm,
  },
});
</script>
<style lang="less" scoped>
.subject-loading {
  padding: 135px 0;
  text-align: center;
}
</style>
