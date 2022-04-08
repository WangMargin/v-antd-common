<template>
  <page-container :show-breadcrumb="false">
    <div v-if="fieldsData" class="batch-box">
      <div class="btnsBox">
        <a-button @click="prev" class="prev">
          上一条({{ result.current }}/{{ result.total }})
        </a-button>
        <a-button @click="next" class="next">
          下一条({{ result.current }}/{{ result.total }})
        </a-button>
      </div>
      <div class="resultBox top">
        <a-row justify="center">
          <a-col :xs="8" :sm="8" :md="6" :lg="4">
            <span>已处理：{{ result.processed }} 条</span>
          </a-col>
          <a-col :xs="8" :sm="8" :md="6" :lg="4">
            <span>待处理：{{ result.todo }} 条</span>
          </a-col>
          <a-col :xs="8" :sm="8" :md="6" :lg="4">
            <span>已取消：{{ result.cancelled }} 条</span>
          </a-col>
        </a-row>
      </div>

      <template v-if="isShowFilder">
        <dynamic-form
          :fieldsData="fieldsData"
          :editData="editData"
          @submitFn="submitFn"
          ref="dynamicForm"
          :category_id="category_id"
          @cancelBatchFn="cancelBatchFn"
          :isBatch="true"
        />
      </template>
      <div class="notData" v-else>加载中·····</div>
      <div class="resultBox bottom">
        <a-row justify="center">
          <a-col :xs="8" :sm="8" :md="6" :lg="4">
            <span>已处理：{{ result.processed }} 条</span>
          </a-col>
          <a-col :xs="8" :sm="8" :md="6" :lg="4">
            <span>待处理：{{ result.todo }} 条</span>
          </a-col>
          <a-col :xs="8" :sm="8" :md="6" :lg="4">
            <span>已取消：{{ result.cancelled }} 条</span>
          </a-col>
        </a-row>
      </div>
      <div class="btnsBoxState">
        <div class="btnsBox">
          <a-button @click="prev" class="prev">
            上一条({{ result.current }}/{{ result.total }})
          </a-button>
          <a-button @click="next" class="next">
            下一条({{ result.current }}/{{ result.total }})
          </a-button>
        </div>
      </div>
    </div>
  </page-container>
</template>
<script>
import { useRoute, useRouter } from 'vue-router';
import { defineComponent, ref, onMounted, reactive } from 'vue';
import DynamicForm from '@/components/dynamicForm.vue';
import { getCategoryForm, addCategoryForm } from '@/api/form/basic-form';
import { useMultiTab } from '@/components/multi-tab/multi-tab-store.js';
import localStorage from '@/utils/local-storage';
import { message } from 'ant-design-vue';
export default defineComponent({
  name: 'batch',
  components: {
    DynamicForm,
  },
  setup() {
    const [{ close }] = useMultiTab();
    const fieldsData = ref(null);
    const result = reactive({
      processed: 0,
      todo: 0,
      cancelled: 0,
      current: 1,
      total: 0,
    });
    const isShowFilder = ref(false);
    const route = useRoute();
    const router = useRouter();
    const editData = ref(null);
    const dynamicForm = ref(null);
    const id = route.params.category;
    const category_id = ref(id);
    const batchSchemaData = localStorage.get('batchSchemaData');
    let list = [];
    batchSchemaData.forEach(item => {
      if (item.id === id) {
        list = item.list;
      }
    });
    // console.log(batchSchemaData, list);
    const routeBack = () => {
      localStorage.set('dynamicReload', 'reload');
      const closePath = route.path;
      const pathType = fieldsData.value.type.key.toLowerCase();
      router.push({ path: `/achievement/${pathType}/${fieldsData.value.id}` }).then(() => {
        close(closePath);
      });
    };
    let listIndex = 0;
    const getEditData = index => {
      isShowFilder.value = false;
      if (!list || list.length === 0) {
        const closePath = route.path;
        close(closePath);

        return;
      }
      if (index < 0) {
        listIndex = 0;
        message.info('已经是第一条数据了！');
        setTimeout(() => {
          isShowFilder.value = true;
        }, 0);
        return;
      }
      if (index >= list.length) {
        listIndex = list.length - 1;
        message.info('已经是最后一条数据了！');
        setTimeout(() => {
          isShowFilder.value = true;
        }, 0);
        return;
      }
      listIndex = index;
      result.current = listIndex + 1;
      editData.value = list[listIndex];

      setTimeout(() => {
        isShowFilder.value = true;
      }, 0);
    };
    onMounted(() => {
      getEditData(listIndex);
      result.todo = list.length;
      result.total = list.length;
      isShowFilder.value = true;
    });
    // 取消或保存后，对导入的列表数据处理
    const cancelBatchFn = (str = '取消') => {
      list.splice(listIndex, 1);
      if (listIndex >= list.length) {
        listIndex = list.length - 1;
      }
      if (listIndex < 0) {
        message.warning('已经没有需要导入的数据！', 2);
        localStorage.set('batchSchemaData', batchSchemaData);
        setTimeout(() => {
          routeBack();
        }, 2000);
        return;
      }
      if (str === '取消') {
        result.cancelled += 1;
      } else {
        result.processed += 1;
      }
      result.total = list.length;
      result.todo -= 1;
      result.current = listIndex;
      message.success(str + '成功');
      localStorage.set('batchSchemaData', batchSchemaData);
      getEditData(listIndex);
    };
    const prev = () => {
      listIndex--;
      getEditData(listIndex);
    };
    const next = () => {
      listIndex++;
      getEditData(listIndex);
    };
    const submit = data => {
      addCategoryForm(data).then(res => {
        if (res.code === 200) {
          //console.log(res);
          cancelBatchFn('保存');
        }
      });
    };
    const submitFn = e => {
      if (e) {
        // console.log(e, 8882222);
        const questData = {
          category: id,
          action: e.action,
          year: e.year ? e.year * 1 : null,
          subjects: e.subjects || [],
          schema_data: e.dynamicData,
        };
        submit(questData);
      }
    };
    getCategoryForm(id).then(res => {
      // console.log(res);
      fieldsData.value = res.data.info;
      // fieldsData.value = fromInfoData.data.info;
      // console.log(fieldsData.value, '创建表单结构88888');
    });
    return {
      isShowFilder,
      result,
      category_id,
      dynamicForm,
      cancelBatchFn,
      next,
      prev,
      listIndex,
      editData,
      submitFn,
      fieldsData,
    };
  },
});
</script>
<style lang="less" scoped>
.notData {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 500px;
  color: #999;
  font-size: 14px;
}
.resultBox {
  &.bottom {
    /*bottom: 25px;*/
    top: auto;
  }
  &.top {
    /*top: 25px;*/
    z-index: 9;
  }
  > span {
    margin: 0 25px;
  }
  position: relative;
  position: r tive;
  /*to
  width: 100%;
  padding: 5px 0;
  text-align: center;
  background: #fff;
}
.batch-box {
  position: relative;
}
.btnsBox {
  .next {
    width: 120px;
    margin: 20px 20px 0 0;
  }
  .prev {
    width: 120px;
    margin: 0px 20px 0 0;
    /*  margin-left: 20px;*/
  }
  position: fixed;
  top: 50%;
  right: 0;
  right: 20px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 120px;
  height: 20px;
  padding-right: 20px;
}
.btnsBoxState {
  display: none;
}
@media screen and (max-width: 1200px) {
  .batch-box {
    .btnsBox {
      .next {
        margin: 0px 0px 0 0;
      }
      .prev {
        margin-left: 20px;
      }
      position: relative;
      top: 0;
      right: 0;
      z-index: 999;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 50px;
      background: #fff;
    }
    .btnsBoxState {
      display: block;
    }
  }
}
</style>
