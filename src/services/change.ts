import { http } from '@/utils/http'

//获取当前交易状态
export const getAdviserAPI = () => {
  return http<{
    id: number
    trade_status: number
  }>({
    method: 'GET',
    url: 'api/Adviser/edit',
  })
}

//设置二级密码
export const postAdviserAPI = (data: { id: number; trade_status: number }) => {
  return http<boolean>({
    method: 'POST',
    url: '/api/account/payPassword',
    data,
  })
}
