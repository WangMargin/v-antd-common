import request from '@/utils/request';
export async function queryFakeList(params = {}) {
  return request.get('/fake_list', {
    params,
  });
}
