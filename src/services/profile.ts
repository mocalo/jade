import type { ProfileDetail, ProfileParams } from '@/types/member'
import { http } from '@/utils/http'

/**
 * 获取个人信息
 */
export const getMemberProfileAPI = () => {
  return http<ProfileDetail>({
    method: 'GET',
    url: '/api/account/profile',
  })
}

/**
 * 修改个人信息
 * @param data 请求体参数
 */
export const putMemberProfileAPI = (data: ProfileParams) => {
  return http<ProfileDetail>({
    method: 'POST',
    url: '/api/account/profile',
    data,
  })
}

/**获取我的邀请链接 */
export const getMemberInviteAPI = () => {
  return http<{ link: string; qrcode: string }>({
    method: 'GET',
    url: '/api/account/invite',
  })
}
