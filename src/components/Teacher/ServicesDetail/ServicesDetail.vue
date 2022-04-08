<template>
  <div class="teacher-services-detail">
    <a-row :gutter="10">
      <a-col :span="8">
        <p>本学年待完成公服时长（小时）</p>
        <p>56</p>
      </a-col>
      <a-col :span="8">
        <p>本学年已完成公服时长（小时）</p>
        <p>126/330</p>
      </a-col>
      <a-col :span="8">
        <p>职务类公服时长（小时）</p>
        <p>33</p>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'ServicesDetail',
};
</script>

<style scoped lang="less">
.teacher-services-detail {
  padding: 10px;
}
</style>
