import type { PageParams } from '@/types/global'
import { http } from '@/utils/http'
/**
 * 查询我的总业绩
 */
export const getAchievementAll = () => {
  return http<string>({
    method: 'GET',
    url: '/api/achievement/show',
  })
}

/**查询我的有效推荐人 */
export const queryMyReferrer = () => {
  return http<number>({
    method: 'GET',
    url: '/api/relation/show',
  })
}

export type teamResult = {
  items: {
    id: number
    mobile: string
    nickname: string
  }[]
  page: number
  pageSize: number
  counts: number
}

/**查询我的团队 */
export const queryMyTeam = (data: PageParams) => {
  return http<teamResult>({
    method: 'GET',
    url: '/api/relation/index',
  })
}
