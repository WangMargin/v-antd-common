import request from '../utils/request';
import api from './index';

/**
 * 活动管理
 **/

/**
 * 活活动管理聚合数据
 * Aggregate
 */
export async function Aggregate(param) {
  return request({
    url: api.Aggregate,
    method: 'get',
    params: param,
  });
}

/**
 * 总服务时长统计
 * ServiceAggregate
 */
export async function ServiceAggregate(param) {
  return request({
    url: api.ServiceAggregate,
    method: 'get',
    params: param,
  });
}

/**
 * 查询活动详情
 * "summary": "查询活动详情",
 * "description": "查询活动详情\n:param activity_id: 活动ID\n:param operator:\n:return:",
 * */
export async function Activity(param) {
  return request({
    url: api.Activity,
    method: 'get',
    params: param,
  });
}

/**
 * 创建活动
 */
export async function ActivityCreat(param) {
  return request({
    url: api.Activity,
    method: 'post',
    data: param,
  });
}

/**
 * 活动列表
 */
export async function Activities(param) {
  return request({
    url: api.Activities,
    method: 'get',
    params: param,
  });
}

/*
 *主体管理
 * 获取主体信息 【操作员】
 *  */
export async function SubjectInfoAdmin(param) {
  return request({
    url: api.SubjectInfo,
    method: 'get',
    params: param,
  });
}

/**
 * 获取主体列表 【管理员】
 * @param param
 * @returns {AxiosPromise<any>}
 * @constructor
 */
export async function Subjects(param) {
  return request({
    url: api.Subjects,
    method: 'get',
    params: param,
  });
}
/**
 * 获取主体信息 【管理员】
 * @param param
 * @returns {AxiosPromise<any>}
 * @constructor
 */
export async function Subject(param) {
  return request({
    url: api.Subject,
    method: 'get',
    params: param,
  });
}

/***
 * 获取操作员信息
 * Operator
 * params.operator_id 操作员id
 */
export async function Operator(param) {
  return request({
    url: api.Operator,
    method: 'get',
    params: param,
  });
}

/**
 * 获取操作员列表
 * Operators
 */
export async function Operators(param) {
  return request({
    url: api.Operators,
    method: 'get',
    params: param,
  });
}

/**
 * 通用服务
 * 查询当前操作员主体列表及用户信息
 * @param param
 * @returns {AxiosPromise<any>}
 * @constructor
 */
export async function Init(param) {
  return request({
    url: api.Init,
    method: 'get',
    params: param,
  });
}

/**
 * 通用服务
 * Resource
 * 获取资源列表里
 */
export async function Resource(param) {
  return request({
    url: api.Resource,
    method: 'get',
    params: param,
  });
}

/***
 * DepartmentRules
 * 获取委托部门活动规则【创建服务的时候 服务类别信息就是从这里获取】
 * @param department_id: 当前主体id
 *
 * @returns {AxiosPromise<any>}
 * @constructor
 */
export async function DepartmentRules(param) {
  return request({
    url: api.DepartmentRules,
    method: 'get',
    params: param,
  });
}

/**
 * 院外教师列表
 * ExternalFaculties
 */
export async function ExternalFaculties(param) {
  return request({
    url: api.ExternalFaculties,
    method: 'get',
    params: param,
  });
}
