import request from '@/utils/request';
export async function postAccountLogin(params) {
  return request.post('/login/account', params);
}
export async function getCurrentUser() {
  return request.get('/currentUser');
}
export async function postLogout() {
  return request.post('/logout');
}
export async function getSmsCaptcha(params) {
  return request.get('/message/captcha/sms', {
    params,
  });
}
