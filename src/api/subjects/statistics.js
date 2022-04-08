import request from '@/utils/request';

/**
 * 获取统计管理列表数据
 */
export async function getStatisticsList(params) {
  return request({
    url: '/research/api/v1/category/categories',
    method: 'GET',
    params: params,
  });
}

/**
 * 添加统计项目
 */
export async function addStatisticsItem(params) {
  return request({
    url: '/research/api/v1/category/category',
    method: 'POST',
    data: params,
  });
}

/**
 * 编辑修改统计项目
 */
export async function editStatisticsItem(id, params) {
  return request({
    url: `/research/api/v1/category/category/${id}`,
    method: 'PUT',
    data: params,
  });
}

/**
 * 发布统计项目
 */
export async function publishStatisticsItem(id) {
  return request({
    url: `/research/api/v1/category/category/publish/${id}`,
    method: 'POST',
  });
}

/**
 * 取消发布统计项目
 */
export async function cancelPublishStatisticsItem(id) {
  return request({
    url: `/research/api/v1/category/category/cancel_publish/${id}`,
    method: 'POST',
  });
}

/**
 * 统计统计项目
 */
export async function auditStatisticsItem(id) {
  return request({
    url: `/research/api/v1/category/category/audit/${id}`,
    method: 'POST',
  });
}

/**
 * 取消统计统计项目
 */
export async function cancelAuditStatisticsItem(id) {
  return request({
    url: `/research/api/v1/category/category/cancel_audit/${id}`,
    method: 'POST',
  });
}

/**
 * 作废统计项目
 */
export async function deprecateStatisticsItem(id) {
  return request({
    url: `/research/api/v1/category/category/deprecate/${id}`,
    method: 'POST',
  });
}

/**
 * 批量操作统计项目
 */
export async function batchOperateStatisticsItem(status, params) {
  return request({
    url: `/research/api/v1/category/category/status/${status}`,
    method: 'POST',
    data: params,
  });
}

/**
 * 获取审核管理列表数据
 */
export async function getExamineList(params) {
  return request({
    url: '/research/api/v1/item/audit_items',
    method: 'GET',
    params: params,
  });
}

/**
 * 通过驳回审核数据
 */
export async function examineSycamore(id, status, params) {
  return request({
    url: `/research/api/v1/item/item/audit/${id}/${status}`,
    method: 'POST',
    data: params,
  });
}

/**
 * 批量导出 到处全部统计项目
 */
export async function batchExportStatisticsItem(params) {
  return request({
    url: `/research/api/v1/item/items/export`,
    method: 'GET',
    params: params,
    responseType: 'blob',
  });
}
