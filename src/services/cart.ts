import type { CartItem } from '@/types/cart'
import { http } from '@/utils/http'
/**
 * 加入购物车
 * @param data 请求体参数
 */
type CartParams = {
  goods_id: number
  num: number
}
export const postMemberCartAPI = (data: CartParams) => {
  return http({
    method: 'POST',
    url: '/api/cart/add',
    data,
  })
}

/**
 * 获取购物车列表
 */
export const getMemberCartAPI = () => {
  return http<CartItem[]>({
    method: 'GET',
    url: '/api/cart/index',
  })
}

/**
 * 删除/清空购物车单品
 * @param data 请求体参数 id 集合
 */
export const deleteMemberCartAPI = (data: { cart_id: number }) => {
  return http({
    method: 'POST',
    url: '/api/cart/del',
    data,
  })
}

/**
 * 修改购物车单品
 * @param skuId SKUID
 * @param data selected 选中状态 count 商品数量
 */
export const putMemberCartBySkuIdAPI = (
  skuId: string,
  data: { selected?: boolean; count?: number },
) => {
  return http({
    method: 'PUT',
    url: `/member/cart/${skuId}`,
    data,
  })
}

/**
 * 购物车全选/取消全选
 * @param data selected 是否选中
 */
export const putMemberCartSelectedAPI = (data: { selected: boolean }) => {
  return http({
    method: 'PUT',
    url: '/member/cart/selected',
    data,
  })
}
