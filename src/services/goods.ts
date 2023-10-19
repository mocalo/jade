import type { GoodsResult } from '@/types/goods'
import { http } from '@/utils/http'

/**
 * 商品详情
 * @param id 商品id
 */
export const getGoodsByIdAPI = (id: number) => {
  return http<GoodsResult>({
    method: 'GET',
    url: '/api/goods/show',
    data: { id },
  })
}
