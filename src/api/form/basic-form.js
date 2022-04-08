import request from '@/utils/request';

/**
 * Save basic form data to backend
 *
 * @param formData
 * @return Promise<ResponseBody<BasicFormResponse>>
 */
export function saveBasicFormData(formData) {
  return request.post('forms/basic-form', formData);
}
