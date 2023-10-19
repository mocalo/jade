import type { CouponResult } from '@/types/coupon'
import { http } from '@/utils/http'
import type { PageParams, PageResult } from '@/types/global'
/**
 * 商品详情
 * @param id 商品id
 */
export const getCouponByTypeAPI = (data?: PageParams) => {
  return http<PageResult<CouponResult>>({
    method: 'GET',
    url: '/api/coupon/index',
    data,
  })
}
