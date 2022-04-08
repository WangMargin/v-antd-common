import { reactive, onMounted } from 'vue';
export const defaultContext = {
  stripe: false,
  loading: false,
  current: 1,
  pageSize: 20,
  total: 0,
  dataSource: [],
}; // 如果请求数据中，没有分页，仅单列表数据，可以使用该方法进行包装，免去重复写请求方法

export const wrap = req => {
  return () =>
    req().then(res => {
      const data = res;
      return {
        data,
        total: data.length,
        success: data !== null && data !== undefined,
      };
    });
};
export const useFetchData = (getData, context, options) => {
  const state = reactive({ ...defaultContext, ...context });

  const fetchList = async () => {
    // 请求中禁止重复请求
    if (state.loading) {
      return;
    }

    state.loading = true;
    const { pageSize = 20, current = 1 } = state;

    try {
      const params =
        options?.pagination !== false
          ? {
              current,
              pageSize,
              ...state.requestParams,
            }
          : undefined;
      const { data, success, total: dataTotal = 0 } = await getData(params);
      state.loading = false;

      if (success !== false) {
        state.dataSource = data;
        state.total = dataTotal;
      }
    } catch (e) {
      state.loading = false; // 如果没有传递这个方法的话，需要把错误抛出去，以免吞掉错误

      if (options?.onRequestError === undefined) {
        throw new Error(e);
      } else {
        options.onRequestError(e);
      }
    }
  };

  const cancel = () => {};

  const reset = () => {};

  const reload = () => {
    return new Promise(resolve => {
      resolve(fetchList());
    });
  };

  const setPageInfo = pageInfo => {
    pageInfo.current && (state.current = pageInfo.current);
    pageInfo.pageSize && (state.pageSize = pageInfo.pageSize);
    state.requestParams = pageInfo;
  };

  const resetPageIndex = () => {
    state.current = 1;
  };

  const stripe = (_, index) => index % 2 === 1 && state.stripe && 'ant-pro-table-row-striped';

  onMounted(() => {
    fetchList().catch(e => {
      throw new Error(e);
    });
  });
  return {
    stripe,
    cancel,
    reset,
    reload,
    resetPageIndex,
    setPageInfo: info => {
      setPageInfo({
        current: state.current,
        pageSize: state.pageSize,
        ...info,
      });
    },
    context: state,
  };
};
