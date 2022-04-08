import request from '@/utils/request';
import { reactive } from 'vue';

/**
 * 操作员获取当前主体科研概况
 */
export async function getCurrentSubject() {
  return request({
    url: '/research/api/v1/item/index',
    method: 'GET',
  });
}

/**
 * 管理员获取首页信息
 */
export async function getAdminInfo() {
  return request({
    url: '/research/api/v1/item/index_admin',
    method: 'GET',
  });
}

export const useSubjectsSycamore = () => {
  const state = reactive({
    loading: true,
    info: null,
    chart: null,
    table: null,
    year: null,
    category_list: [],
  });
  const getDataCallback = data => {
    state.info = data.subject_info;
    state.chart = data.statistics_data_category_type_list;
    state.table = data.statistics_data_table_list;
    state.year = data.statistics_data_table_years;
    if (data.category_list) {
      state.category_list = data.category_list;
    }
  };
  const fetchSubjectsSycamore = () => {
    getCurrentSubject()
      .then(res => {
        getDataCallback(res.data);
        state.loading = false;
      })
      .catch(() => {});
  };
  const fetchAdminInfo = () => {
    getAdminInfo()
      .then(res => {
        getDataCallback(res.data);
        state.loading = false;
      })
      .catch(() => {});
  };
  return {
    state,
    fetchSubjectsSycamore,
    fetchAdminInfo,
  };
};
