import request from '@/utils/request';

/**
 * 获取资源数据
 * @param params:资源数据种类
 */
export async function getResources(params) {
  return request({
    url: '/research/api/v1/common/resources',
    method: 'GET',
    params: params,
  });
}

/**
 * 获取部门数据
 */
export async function getDepartmentData(params) {
  return request({
    url: '/research/api/v1/common/uims/departments',
    method: 'GET',
    params: params,
  });
}

/**
 * 获取用户数据
 */
export async function getUserData(params) {
  return request({
    url: '/research/api/v1/common/uims/users',
    method: 'GET',
    params: params,
  });
}
