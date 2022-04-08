const api = {
  // 活动管理
  Aggregate: '/service/api/v1/activity/aggregate', // 活动管理聚合数据
  ServiceAggregate: '/service/api/v1/statistics/service_aggregate', // 总服务时长 统计
  ExternalFaculties: '/service/api/v1/activity/external_faculties', // 院外教师列表
  Activity: '/service/api/v1/activity/activity', // 查询活动详情
  Activities: '/service/api/v1/activity/activities', //活动列表
  DepartmentRules: '/service/api/v1/activity/department_rules', // 获取委托部门活动规则【创建服务的时候 服务类别信息就是从这里获取】
  // 主体管理
  SubjectInfo: '/service/api/v1/subject/subject_info', //  主体管理
  Subjects: '/service/api/v1/subject/subjects', // 获取主体列表 【管理员】
  Subject: '/service/api/v1/subject/subject', // 获取主体信息 【管理员】
  Operator: '/service/api/v1/subject/operator', // 获取操作员信息
  Operators: '/service/api/v1/subject/operators', // 获取操作员列表
  // 通用服务
  Init: '/service/api/v1/common/init', // 查询当前操作员主体列表及用户信息
  Resource: '/service/api/v1/common/resource', // 获取资源列表
};
export default api;
