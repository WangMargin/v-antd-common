<template>
  <a-collapse accordion class="ant-collapse-special">
    <a-collapse-panel
      v-for="data in collapseData"
      :key="data.key"
      :header="`${data.name}(${data.count})`"
    >
      <a-collapse v-if="data.children.length > 0" accordion class="ant-collapse-special-son">
        <a-collapse-panel
          v-for="son in data.children"
          :key="son.key"
          :header="`${son.name}(${son.count})`"
        >
          <template #extra>
            <a-button
              size="small"
              type="primary"
              v-if="!isAdmin"
              @click="enterAchievement(data.key, son.key)"
            >
              去填报
            </a-button>
          </template>
          <task-table
            :can-audit="son.can_audit_item"
            :task-id="taskId"
            :subject-id="subjectId"
            :category="son.key"
            :category-type="data.key"
            :title="son.name"
            :is-admin="isAdmin"
          ></task-table>
        </a-collapse-panel>
      </a-collapse>
    </a-collapse-panel>
  </a-collapse>
</template>
<script>
import { defineComponent } from 'vue';
import TaskTable from './table.vue';
import { useRouter } from 'vue-router';
export default defineComponent({
  props: {
    // 任务id
    taskId: {
      type: String,
      default: '',
    },
    // 主体id
    subjectId: {
      type: String,
      default: '',
    },
    collapseData: {
      type: Array,
      default: () => [],
    },
    isAdmin: {
      type: Boolean,
      default: () => false,
    },
  },
  setup() {
    const router = useRouter();
    const enterAchievement = (menu, submenu) => {
      router.push({
        path: `/achievement/${menu.toLowerCase()}/${submenu}`,
      });
    };
    return {
      enterAchievement,
    };
  },

  components: {
    TaskTable,
  },
});
</script>
<style lang="less" scoped>
.ant-collapse-special {
  ::v-deep(.ant-collapse-content-box) {
    padding: 8px;
  }
}
.ant-collapse-special-son {
  ::v-deep(.ant-collapse-content-box) {
    padding: 0px;
  }
}
</style>
