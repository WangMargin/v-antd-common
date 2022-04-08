import request from '@/utils/request';
import { reactive } from 'vue';

/**
 * 管理员获取任务列表
 */
export async function adminGetTaskList(params) {
  return request({
    url: '/research/api/v1/task/admin_tasks',
    method: 'GET',
    params: params,
  });
}

/**
 * 操作员获取任务列表
 */
export async function getTaskList(params) {
  return request({
    url: '/research/api/v1/task/tasks',
    method: 'GET',
    params: params,
  });
}

/**
 * 管理员获取主体以及科研项目数据
 */
export async function getSubjectsCategoriesList() {
  return request({
    url: '/research/api/v1/common/tree_list',
    method: 'GET',
  });
}

/**
 * 创建任务接口
 */
export async function addTask(params) {
  return request({
    url: '/research/api/v1/task/task',
    method: 'POST',
    data: params,
  });
}

/**
 * 编辑任务接口
 */
export async function editTask(id, params) {
  return request({
    url: `/research/api/v1/task/task/${id}`,
    method: 'PUT',
    data: params,
  });
}

/**
 * 获取任务信息
 */
export async function getTaskDetail(id) {
  return request({
    url: `/research/api/v1/task/task/${id}`,
    method: 'GET',
  });
}

/**
 * 修改任务状态-管理员
 */
export async function taskChangeStatusAdmin(id, status) {
  return request({
    url: `/research/api/v1/task/task/status/${id}/${status}`,
    method: 'POST',
  });
}

/**
 * 更改任务主体状态-管理员
 */
export async function taskSubjectChangeStatusAdmin(taskId, subjectId, status) {
  return request({
    url: `/research/api/v1/task/admin_subject/status/${taskId}/${subjectId}/${status}`,
    method: 'POST',
  });
}

/**
 * 任务主体状态修改-操作员
 */
export async function taskSubjectChangeStatus(id, status) {
  return request({
    url: `/research/api/v1/task/subject/status/${id}/${status}`,
    method: 'POST',
  });
}

/**
 * 获取任务详情页内容-管理员
 */
export async function getTaskDetailContentAdmin(id) {
  return request({
    url: `/research/api/v1/task/admin_show/${id}`,
    method: 'GET',
  });
}

/**
 * 获取任务详情页科研成果表格数据-管理员
 */
export async function getTaskDetailContentTableAdmin(params, id) {
  return request({
    url: `/research/api/v1/task/admin_items/${id}`,
    method: 'GET',
    params: params,
  });
}

/**
 * 获取任务详情页内容-操作员
 */
export async function getTaskDetailContent(id) {
  return request({
    url: `/research/api/v1/task/show/${id}`,
    method: 'GET',
  });
}

/**
 * 获取任务详情页科研成果表格数据-操作员
 */
export async function getTaskDetailContentTable(params, id) {
  return request({
    url: `/research/api/v1/task/items/${id}`,
    method: 'GET',
    params: params,
  });
}

/**
 * 任务归档-管理员
 */
export async function taskFile(id) {
  return request({
    url: `/research/api/v1/task/task/filed/${id}`,
    method: 'POST',
  });
}

export const useGetTaskList = () => {
  const state = reactive({
    loading: true,
    list: [],
    total: 0,
  });
  const fetchAdminGetTaskList = params => {
    adminGetTaskList(params)
      .then(res => {
        state.list = res.data.list;
        state.total = res.data.total;
        state.loading = false;
      })
      .catch(() => {});
  };
  const fetchGetTaskList = params => {
    getTaskList(params)
      .then(res => {
        state.list = res.data.list;
        state.total = res.data.total;
        state.loading = false;
      })
      .catch(() => {});
  };
  return {
    state,
    fetchAdminGetTaskList,
    fetchGetTaskList,
  };
};
