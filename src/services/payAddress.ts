import { http } from '@/utils/http'
import type { PayAddressRes } from '@/types/payAddress'
/**
 * 商品详情
 * @param payFlag 商品id
 */

export type PaymentParams = {
  payment_type: string
  user_id: number
}

export type PayAddressParams = {
  payment_type: string
}

export type PaySaveParams = {
  payment_type: string
  /**收款二维码 */
  qrcode_url: string
  /**收款姓名 */
  name: string
  /**收款账号 */
  bank_no: string
  /**收款银行 */
  bank_name: string
  /**开户行地址 */
  bank_address: string
  /**支付密码 */
  password: string
}

//保存银行卡
export const postPayAddressAPI = (data: PaySaveParams) => {
  return http({
    method: 'POST',
    url: '/api/userPayment/add',
    data,
  })
}

export const postPayUpdateAPI = (data: PaySaveParams) => {
  return http({
    method: 'POST',
    url: '/api/userPayment/edit',
    data,
  })
}

export const getPayAddressAPI = (data: PayAddressParams) => {
  return http<PayAddressRes>({
    method: 'GET',
    url: '/api/userPayment/show',
    data,
  })
}
export const getPayAgencyAPI = (data: PayAddressParams) => {
  return http<PayAddressRes>({
    method: 'GET',
    url: '/api/userPayment/master',
    data,
  })
}

export const getPaymentByUserAPI = (data: PaymentParams) => {
  return http<PayAddressRes>({
    method: 'GET',
    url: '/api/userPayment/show',
    data,
  })
}
