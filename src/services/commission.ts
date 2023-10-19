import type {
  CommissionListItem,
  CommissionLogListResult,
  CommissionLogResult,
  CommissionResult,
  ScoreListItem,
  ScoreLogListResult,
} from '@/types/commission'
import { http } from '@/utils/http'
import type { PageParams, PageResult } from '@/types/global'

/**查询我的佣金和积分 */
export async function queryMyCommission() {
  return http<CommissionResult>({
    method: 'GET',
    url: '/api/UserCommissionLog/show',
  })
}

/**查询佣金记录 */
export async function queryCommissionLog(data: PageParams) {
  return http<CommissionLogResult>({
    method: 'GET',
    url: '/api/UserCommissionLog/index',
  })
}

/**查询佣金明细 */
export async function queryCommissionLogList(data: PageParams) {
  return http<CommissionLogListResult>({
    method: 'GET',
    url: '/api/UserMoneyLog/index',
  })
}

/**查询积分明细 */
export async function queryScoreLogList(data: PageParams) {
  return http<ScoreLogListResult>({
    method: 'GET',
    url: '/api/UserScoreLog/index',
  })
}
