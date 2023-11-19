import { http } from '@/utils/http'

//获取是否设置了二级密码
export const getIsSetPwdAPI = () => {
  return http<boolean>({
    method: 'GET',
    url: '/api/account/payPassword',
  })
}

//设置二级密码
export const postSetPayPwdAPI = (data: { password: string; old_password: string }) => {
  return http<boolean>({
    method: 'POST',
    url: '/api/account/payPassword',
    data,
  })
}

//设置密码
export const postSetPwdAPI = (data: { password: string; old_password: string }) => {
  return http<boolean>({
    method: 'POST',
    url: '/api/account/changePassword',
    data,
  })
}
