import type { couponState } from '@/services/constants'
import type { PageParams } from '@/types/global'

/** 订单详情 返回信息 */
export type CouponResult = {
  /** 订单编号 */
  id: number
  user_id: number
  coupon_id: number
  status: number
  pay_status: number
  pay_image: string //支付截图
  refuse_info: string //拒绝理由
  expire_time: number //过期时间
  update_time: number //更新时间
  create_time: number //创建时间
  coupon: Coupon
}

/**抵扣券信息 */
export type Coupon = {
  id: number //抵扣券id
  money: string //抵扣券金额
  dec_price: string //抵扣券抵扣金额
}

/** 订单列表参数 */
export type CouponListParams = PageParams & { status: number }
