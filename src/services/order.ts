import type { PageParams } from '@/types/global'
import type {
  BlindBoxOrderItem,
  BlindBoxResult,
  OrderExpress,
  OrderListResult,
} from '@/types/order'
import type { OrderCreateParams, OrderListParams, OrderResult } from '@/types/order'
import { http } from '@/utils/http'

export type PayOrderParams = {
  /** 订单Id */
  id: number
  payment_type: string
  pay_image: string
}

/**
 * 提交订单
 *
 */
export const postMemberOrderAPI = (id: number, sale_id: number, coupon_id: number) => {
  return http<{ id: number }>({
    method: 'POST',
    url: '/api/order/add',
    data: {
      goods_id: id,
      sale_id: sale_id,
      coupon_id: coupon_id,
    },
  })
}

/**
 * 获取订单详情
 * @param id 订单id
 */
export const getMemberOrderByIdAPI = (id: number) => {
  return http<OrderResult>({
    method: 'GET',
    url: `/api/order/show/`,
    data: { id },
  })
}

/**
 * 模拟发货-内测版
 * @description 在DEV环境下使用，仅在订单状态为待发货时，可模拟发货，调用后订单状态修改为待收货，包含模拟物流。
 * @param id 订单id
 */
export const getMemberOrderConsignmentByIdAPI = (id: string) => {
  return http({
    method: 'GET',
    url: `/member/order/consignment/${id}`,
  })
}

/**
 * 获取物流信息
 */
export const getMemberOrderExpressByIdAPI = (id: number) => {
  return http<OrderExpress>({
    method: 'GET',
    url: `/api/order/logistics`,
    data: { id },
  })
}

/**
 * 获取物流信息
 */
export const getAgentOrderExpressByIdAPI = (id: number) => {
  return http<OrderExpress>({
    method: 'GET',
    url: `/api/AgentOrder/logistics`,
    data: { id },
  })
}

//盲盒确认收货
export const postAgentOrderReceiptByIdAPI = (id: number) => {
  return http({
    method: 'POST',
    url: `/api/AgentOrder/receive`,
    data: { id: id },
  })
}

//获取盲盒订单列表
export const getAgentOrderListAPI = (data: PageParams) => {
  return http<BlindBoxResult>({
    method: 'GET',
    url: `/api/AgentOrder/index`,
    data,
  })
}

/**支付订单 */
export const postMemberOrderPayAPI = (data: PayOrderParams) => {
  return http({
    method: 'POST',
    url: `/api/order/pay`,
    data,
  })
}
/**根据用户id查询相关订单
 * @param data user_id 用户id
 */
export const getMemberOrderListAPI = (data: {
  page: number
  pageSize: number
  user_id: number
}) => {
  return http<OrderListResult>({
    method: 'GET',
    url: `/api/order/list`,
    data,
  })
}

/**
 * 确认发货
 */
export const getMemberOrderDeliverByIdAPI = (id: number) => {
  return http({
    method: 'POST',
    url: `/api/order/deliver`,
    data: { id: id },
  })
}
/**
 * 确认收货
 * @description 仅在订单状态为待收货时，可确认收货。
 * @param id 订单id
 */
export const putMemberOrderReceiptByIdAPI = (id: number) => {
  return http<OrderResult>({
    method: 'POST',
    url: `/api/order/receive`,
    data: { id: id },
  })
}

/**
 * 删除订单
 * @description 仅在订单状态为待评价，已完成，已取消时，可删除订单。
 * @param data ids 订单集合
 */
export const deleteMemberOrderAPI = (data: { ids: number[] }) => {
  return http({
    method: 'DELETE',
    url: `/member/order`,
    data,
  })
}

/**
 * 取消订单
 * @description 仅在订单状态为待付款时，可取消订单。
 * @param id 订单id
 * @param data cancelReason 取消理由
 */
export const getMemberOrderCancelByIdAPI = (id: number, data: { cancelReason: string }) => {
  return http<OrderResult>({
    method: 'PUT',
    url: `/member/order/${id}/cancel`,
    data,
  })
}

/**
 * 获取订单列表
 * @param data orderState 订单状态
 */
export const getMemberOrderAPI = (data: OrderListParams) => {
  return http<OrderListResult>({
    method: 'GET',
    url: `/api/order/index`,
    data,
  })
}
