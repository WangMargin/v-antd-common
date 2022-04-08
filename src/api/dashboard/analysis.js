import { reactive } from 'vue';
import request from '@/utils/request';
export function getAnalysisChartData() {
  return request.get('dashboard/fake_chart_data');
}
export function getAnalysisSalesData(range) {
  return request.get('dashboard/fake_chart_sales_data', {
    params: {
      range,
    },
  });
}
export const useAnalysisData = () => {
  const state = reactive({
    loading: true,
    chartData: {
      offlineChartData: [],
      offlineData: [],
      radarData: [],
      salesData: [],
      salesTypeData: [],
      salesTypeDataOffline: [],
      salesTypeDataOnline: [],
      searchData: [],
      visitData: [],
      visitData2: [],
    },
  });

  const fetchAllData = () => {
    state.loading = true; // fetch backend JSON api data.

    getAnalysisChartData()
      .then(res => {
        state.chartData = { ...res };
      })
      .finally(() => {
        state.loading = false;
      });
  };

  const fetchSalesData = rangeDate => {
    state.loading = true;
    getAnalysisSalesData(rangeDate)
      .then(res => {
        state.chartData.salesData = res;
      })
      .finally(() => {
        state.loading = false;
      });
  };

  return {
    state,
    fetchAllData,
    fetchSalesData,
  };
};
