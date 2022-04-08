import request from '@/utils/request';
import { reactive } from 'vue';
import localStorage from '@/utils/local-storage';

/**
 * 科研数据表格标题
 */
export async function getSycamoreLabels(id) {
  return request({
    url: `/research/api/v1/item/items/labels/${id}`,
    method: 'GET',
  });
}

/**
 * 科研数据列表
 */
export async function getSycamoreList(params, id) {
  return request({
    url: `/research/api/v1/item/items/${id}`,
    method: 'GET',
    params: params,
  });
}

/**
 * 送审
 */
export async function submitAuditSycamore(id, params) {
  return request({
    url: `/research/api/v1/item/item/audit/${id}/Auditing`,
    method: 'POST',
    data: params,
  });
}

/**
 * 查看数据
 */
export async function viewDetailSycamore(id) {
  return request({
    url: `/research/api/v1/item/item/${id}/show`,
    method: 'GET',
  });
}

/**
 * 查看归档数据
 */
export async function viewDetailFiledSycamore(id, taskId) {
  return request({
    url: `/research/api/v1/item/item/${taskId}/${id}/filed_show`,
    method: 'GET',
  });
}

/**
 * 统计的表单数据
 */
export async function formSycamoreKey(id) {
  return request({
    url: `/research/api/v1/category/category/${id}`,
    method: 'GET',
  });
}

/**
 * 批量送审
 */
export async function batchOperateSendItem(status, params) {
  return request({
    url: `/research/api/v1/item/item/status/${status}`,
    method: 'POST',
    data: params,
  });
}

/**
 * 删除
 */
export async function deleteSycamoreItem(id, params) {
  return request({
    url: `/research/api/v1/item/item/${id}`,
    method: 'DELETE',
    data: params,
  });
}

/**
 * 统计数据导出
 */
export async function catagorySycamoreExport(id, params) {
  return request({
    url: `/research/api/v1/item/items/export/${id}`,
    method: 'GET',
    params: params,
    responseType: 'blob',
  });
}

/**
 * 统计数据模板导出
 */
export async function catagorySycamoreTemplateExport(id) {
  return request({
    url: `/research/api/v1/item/items/export_template/${id}`,
    method: 'GET',
    responseType: 'blob',
  });
}

/**
 * 高级筛选统计数据列表-管理员
 */
export async function getSycamoreSelectList(id, params) {
  return request({
    url: `/research/api/v1/item/admin_items/${id}`,
    method: 'GET',
    params: params,
  });
}

export const useSycamoreLables = () => {
  const state = reactive({
    loading: true,
    labels: [],
    action: null,
    remark: '',
    status: null,
    simpleName: null,
    type: null,
  });
  const storageData = data => {
    const labels = localStorage.get('sycomareTableLabels') || [];
    labels.push({
      id: data.id,
      labels: data.labels,
      action: data.action,
      remark: data.remark,
      status: data.status,
      simpleName: data.simpleName,
      type: data.type,
    });
    localStorage.set('sycomareTableLabels', labels);
  };
  const fetchSycamoreLables = id => {
    state.loading = true;
    getSycamoreLabels(id)
      .then(res => {
        state.labels = res.data.labels;
        return formSycamoreKey(id);
      })
      .then(res => {
        storageData({
          id: id,
          labels: state.labels,
          action: res.data.info.action,
          remark: res.data.info.description,
          status: res.data.info.status,
          simpleName: res.data.info.simple_name,
          type: res.data.info.type.key,
        });
        state.action = res.data.info.action;
        state.remark = res.data.info.description;
        state.status = res.data.info.status;
        state.simpleName = res.data.info.simple_name;
        state.type = res.data.info.type.key;
        state.loading = false;
      })
      .catch(() => {});
  };
  return {
    state,
    fetchSycamoreLables,
    storageData,
  };
};
