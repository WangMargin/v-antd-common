import { reactive } from 'vue';
import request from '@/utils/request';

/**
 * 获取主体信息
 */
export function getSubjectsInfo() {
  return request({
    url: '/research/api/v1/subject/subject_info',
    method: 'GET',
  });
}

/**
 * 操作员修改主体信息
 */
export async function editSubjectsInfo(params) {
  return request({
    url: '/research/api/v1/subject/subject_info',
    method: 'PUT',
    data: params,
  });
}

/**
 * 获取主体团队成员，捐赠情况，经费情况列表
 */
export async function getSubjectsItemList(params) {
  return request({
    url: '/research/api/v1/subject/subject_items',
    method: 'GET',
    params: params,
  });
}

/**
 * 主体添加团队成员，捐赠情况以及经费情况
 */
export async function addSubjectsItem(params) {
  return request({
    url: '/research/api/v1/subject/subject_item',
    method: 'POST',
    data: params,
  });
}

/**
 * 主体编辑团队成员，捐赠情况以及经费情况
 */
export async function editSubjectsItem(id, params) {
  return request({
    url: `/research/api/v1/subject/subject_item/${id}`,
    method: 'PUT',
    data: params,
  });
}

export const useSubjectsInfo = () => {
  const state = reactive({
    loading: true,
    info: null,
  });

  const fetchSubjectsInfo = () => {
    state.loading = true;
    getSubjectsInfo()
      .then(res => {
        state.info = res.data.info;
        state.loading = false;
      })
      .catch(() => {});
  };
  return {
    state,
    fetchSubjectsInfo,
  };
};
