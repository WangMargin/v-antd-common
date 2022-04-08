<template>
  <div>
    <a-card>
      <a-form>
        <a-row :gutter="[20, 10]">
          <a-col :xs="24" :sm="12" :md="8">
            <a-form-item>
              <template #label>任务发布年份</template>
              <a-select ref="select" style="width: 100%">
                <a-select-option value="2022">2022</a-select-option>
                <a-select-option value="2021">2021</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12" :md="8">
            <a-form-item>
              <template #label>服务类别</template>
              <a-select ref="select" style="width: 100%">
                <a-select-option value="2022">2022</a-select-option>
                <a-select-option value="2021">2021</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12" :md="8">
            <a-form-item>
              <template #label>服务明细</template>
              <a-select ref="select" style="width: 100%">
                <a-select-option value="2022">2022</a-select-option>
                <a-select-option value="2021">2021</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="24">
            <a-form-item>
              <div style="text-align: right">
                <a-button type="primary">筛选</a-button>
                <a-button class="mg-l10">重置</a-button>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <div class="mg-t15">
      <custom-table></custom-table>
    </div>
  </div>
</template>

<script>
import CustomTable from '../Table/index';
export default {
  name: 'index',
  components: {
    CustomTable,
  },
};
</script>

<style scoped></style>
