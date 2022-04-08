import request from '@/utils/request';
import { reactive } from 'vue';
export async function queryRule(params) {
  return request.get('/rule', {
    params,
  });
}
export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'delete' },
  });
}
export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'post' },
  });
}
export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'update' },
  });
}
export function useRuleData() {
  const state = reactive({
    loading: true,
    current: 0,
    pageSize: 10,
    total: 0,
    dataSource: [],
  });

  const fetchRule = params => {
    // 使 table 打开加载状态指示
    state.loading = true; // 发起 AJAX 请求到后端

    queryRule(
      Object.assign(
        {
          current: state.current,
          pageSize: state.pageSize,
        },
        params,
      ),
    )
      .then(res => {
        // 更新数据
        state.dataSource = res.data;
        state.total = res.total;
      })
      .finally(() => {
        // 使 table 关闭加载状态指示
        state.loading = false;
      });
  };

  return {
    state,
    fetch: fetchRule,
  };
}
