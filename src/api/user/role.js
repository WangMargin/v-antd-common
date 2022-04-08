import request from '@/utils/request';
export async function getRoles() {
  return request.get('/roles');
}
export async function getPermissions() {
  return request.get('/permissions');
}
export async function addPermission(data) {
  return request.post('/permission', data);
}
export async function updatePermission(data) {
  return request.put('/permission', data);
}
