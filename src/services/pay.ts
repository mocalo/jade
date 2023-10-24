import type { paymentSell } from '@/types/home'
import { http } from '@/utils/http'

/**
 * 获取微信支付参数
 * @param data orderId 订单id
 */
export const getPayWxPayMiniPayAPI = (data: { orderId: string }) => {
  return http<WechatMiniprogram.RequestPaymentOption>({
    method: 'GET',
    url: '/pay/wxPay/miniPay',
    data,
  })
}

//确认收款成功
export const orderPayConfirm = (data: { id: Number }) => {
  return http({
    method: 'POST',
    url: '/api/order/comfirm',
    data,
  })
}

//确认发货
export const orderPayNow = (data: { id: Number }) => {
  return http({
    method: 'POST',
    url: '/api/order/chooseDeliver',
    data,
  })
}

//确认寄售
export const orderPaySell = (data: { id: Number; payment_type: string; pay_image: string }) => {
  return http({
    method: 'POST',
    url: '/api/order/consignSale',
    data,
  })
}

export const orderPaySellMoney = (data: { id: Number }) => {
  return http<paymentSell>({
    method: 'GET',
    url: '/api/order/consignSale',
    data,
  })
}

/**
 * 模拟支付-内测版
 * @param data orderId 订单id
 */
export const getPayMockAPI = (data: { orderId: string }) => {
  return http({
    method: 'GET',
    url: '/pay/mock',
    data,
  })
}
