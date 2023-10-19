import type { LoginResult } from '@/types/member'
import { http } from '@/utils/http'

type LoginParams = {
  mobile: string
  password: string
}

type SigninParams = {
  mobile: string
  password: string
  invite_code: string
  nickname: string
  avatar: string
  captchaId: number
}
/**
 * 小程序登录
 * @param data 请求参数
 */
export const postLoginWxMinAPI = (data: LoginParams) => {
  return http<LoginResult>({
    method: 'POST',
    url: '/login/wxMin',
    data,
  })
}

/**
 * 小程序登录_内测版
 * @param phoneNumber 模拟手机号码
 */
export const postLoginWxMinSimpleAPI = (phoneNumber: string) => {
  return http<LoginResult>({
    method: 'POST',
    url: '/login/wxMin/simple',
    data: {
      phoneNumber,
    },
  })
}

/**
 * 登录
 */
export const postLoginAPI = (data: LoginParams) => {
  return http<LoginResult>({
    method: 'POST',
    url: '/api/auth/login',
    data,
  })
}

/**
 * 退出登录
 */
export const postLogoutAPI = () => {
  return http<LoginResult>({
    method: 'POST',
    url: '/api/auth/logout',
  })
}

/**
 * 注册
 */
export const postSigninAPI = (data: SigninParams) => {
  return http<LoginResult>({
    method: 'POST',

    url: '/api/auth/register',
    data,
  })
}
