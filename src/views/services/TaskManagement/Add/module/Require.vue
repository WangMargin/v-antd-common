<template>
  <div>
    <a-card>
      <template #title>师资要求</template>
      <template #extra>
        <a-button type="link" @click="changeSpan(0)">关闭</a-button>
      </template>
      <a-form ref="refRequire" layout="vertical" :model="formDataRequire">
        <a-row :gutter="[20, 10]" v-if="state.Resource">
          <!--          教师职务要求-->
          <a-col :span="24">
            <a-form-item name="position">
              <template #label>教师职务要求</template>
              <a-checkbox-group v-model:value="formDataRequire.position">
                <a-row :gutter="[10, 10]">
                  <a-col v-for="item in state.Resource.position_choices" :key="item">
                    <a-checkbox :value="item">
                      {{ item }}
                    </a-checkbox>
                  </a-col>
                </a-row>
              </a-checkbox-group>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item name="require">
              <!--          教师职称要求-->
              <template #label>教师职称要求</template>
              <a-radio-group v-model:value="formDataRequire.require">
                <a-row :gutter="[10, 10]">
                  <a-col v-for="item in state.Resource.job_title_choices" :key="item">
                    <a-radio :value="item">
                      {{ item }}
                    </a-radio>
                  </a-col>
                </a-row>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="doctor">
              <template #label>是否要求博导资格</template>
              <a-radio-group v-model:value="formDataRequire.doctor">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="degreeStatus">
              <template #label>是否要求硕导资格</template>
              <a-radio-group v-model:value="formDataRequire.degreeStatus">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="partyMember">
              <template #label>是否要求党员</template>
              <a-radio-group v-model:value="formDataRequire.partyMember">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </div>
</template>

<script>
import { inject, reactive, ref, watch, onMounted } from 'vue';
export default {
  props: {
    Resource: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  name: 'Require',
  setup() {
    const refRequire = ref();
    let formDataRequire = reactive({
      position: undefined,
      require: ['无'],
      degreeStatus: false,
      doctor: false,
      partyMember: false,
    });

    // 师资要求 数据
    let requireData = ref(inject('requireData'));

    // 开启关闭 右侧 师资要求
    let Span = ref(inject('changeSpan'));
    watch(formDataRequire, () => {
      requireData.value = JSON.stringify(formDataRequire);
      // console.log(requireData.value, '====== 同步填写数据 ====');
    });

    const changeSpan = n => {
      Span.value = n;
      refRequire.value
        .validate()
        .then(() => {})
        .catch(err => {
          console.error(err);
        });
    };
    const state = reactive({
      Resource: undefined,
    });
    state.Resource = inject('ResourceData');
    onMounted(() => {});
    return {
      requireData,
      state,
      Span,
      refRequire,
      formDataRequire,
      changeSpan,
    };
  },
};
</script>

<style scoped></style>
