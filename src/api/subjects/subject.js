import request from '@/utils/request';

/**
 * 添加主体
 */
export async function addSubjects(params) {
  return request({
    url: '/research/api/v1/subject/subject',
    method: 'POST',
    data: params,
  });
}

/**
 * 编辑修改主体
 */
export async function editSubjects(id, params) {
  return request({
    url: `/research/api/v1/subject/subject/${id}`,
    method: 'PUT',
    data: params,
  });
}

/**
 * 获取主体列表
 */
export async function getSubjectsList(params) {
  return request({
    url: '/research/api/v1/subject/subjects',
    method: 'GET',
    params: params,
  });
}

/**
 * 获取操作员列表
 */
export async function getSubjectsOperatorList(params) {
  return request({
    url: '/research/api/v1/subject/operators',
    method: 'GET',
    params: params,
  });
}
/**
 * 获取学院操作员列表
 */
export async function getSubjectsSchoolOperatorList(params) {
  return request({
    url: '/research/api/v1/subject/school_operators',
    method: 'GET',
    params: params,
  });
}
/**
 * 添加学院操作员
 */
export async function addSubjectsSchoolOperator(params) {
  return request({
    url: '/research/api/v1/subject/school_operator',
    method: 'POST',
    data: params,
  });
}

/**
 * 编辑修改学院操作员
 */
export async function editSubjectsSchoolOperator(id, params) {
  return request({
    url: `/research/api/v1/subject/school_operator/${id}`,
    method: 'PUT',
    data: params,
  });
}

/**
 * 添加账号操作员
 */
export async function addSubjectsOperator(params) {
  return request({
    url: '/research/api/v1/subject/operator',
    method: 'POST',
    data: params,
  });
}

/**
 * 编辑修改账号操作员
 */
export async function editSubjectsOperator(id, params) {
  return request({
    url: `/research/api/v1/subject/operator/${id}`,
    method: 'PUT',
    data: params,
  });
}

/**
 * 修改账号操作员状态  是否启用
 */
export async function changeOperatorActive(id, active) {
  return request({
    url: `/research/api/v1/subject/operator/is_active/${id}/${active}`,
    method: 'POST',
  });
}

/**
 * 获取管理员列表
 */
export async function getAdministratorsList(params) {
  return request({
    url: '/research/api/v1/subject/admin_operators',
    method: 'GET',
    params: params,
  });
}

/**
 * 添加管理员
 */
export async function addAdministrators(params) {
  return request({
    url: '/research/api/v1/subject/admin_operator',
    method: 'POST',
    data: params,
  });
}

/**
 * 修改管理员
 */
export async function editAdministrators(id, params) {
  return request({
    url: `/research/api/v1/subject/admin_operator/${id}`,
    method: 'PUT',
    data: params,
  });
}

/**
 * 编辑修改账号操作员
 */
export async function deleteOperator(id) {
  return request({
    url: `/research/api/v1/subject/operator/${id}`,
    method: 'DELETE',
  });
}
