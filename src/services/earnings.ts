import type { EarningsLogResult, EarningsResult } from '@/types/earnings'
import { http } from '@/utils/http'
import type { PageParams, PageResult } from '@/types/global'

/**查询我的佣金和积分 */
export async function queryMyEarnings() {
  return http<EarningsResult>({
    method: 'GET',
    url: '/api/UserIncomeLog/show',
  })
}

/**查询佣金记录 */
export async function queryEarningsLog(data: PageParams) {
  return http<EarningsLogResult>({
    method: 'GET',
    url: '/api/UserIncomeLog/index',
  })
}
