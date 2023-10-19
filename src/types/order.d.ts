import type { OrderState } from '@/services/constants'
import type { AddressItem } from './address'
import type { PageParams } from '@/types/global'

/** 提交订单 请求参数 */
export type OrderCreateParams = {
  /** 所选地址Id */
  addressId: number
  /** 商品集合[ 商品信息 ] */
  goods: number
  /** 支付渠道：支付渠道，1支付宝、2微信 3银行卡--支付方式为在线支付时，传值，为货到付款时，不传值 */
  payChannel: 1 | 2 | 3
  /** 支付方式，1为在线支付 */
  payType: 1
}

/** 提交订单 返回信息 */
export type OrderCreateResult = {
  /** 订单Id */
  id: number
}

/** 订单详情 返回信息 */
export type OrderResult = {
  /** 订单Id */
  id: number
  seller_id: number
  buyer_id: number
  order_no: string
  order_type: number //订单类型 0普通订单 1抢购订单 2积分订单
  goods_id: number
  order_price: string
  pay_money: string
  pay_score: string
  pay_cash: string
  discount: string
  sale_status: number
  rob_status: number
  order_status: number
  payment_name: string
  pay_image: string
  pay_price: string
  pay_time: number
  update_time: number
  create_time: number
  goods: goods
  seller: seller
  buyer: buyer
}

/** 商品信息 */
export type goods = {
  id: number
  goods_name: string
  goods_master_image: string
  goods_price: string
  goods_market_price: string
}

/** 订单列表参数 */
export type OrderListParams = PageParams & { order_status: number } & { order_tag: string }
//支付成功截图
export type PayImage = {
  url: string
  full_url: string
}

/** 订单列表 */
export type OrderListResult = {
  /** 总记录数 */
  counts: number
  /** 数据集合    [ 订单信息 ] */
  items: OrderItem[]
  /** 当前页码 */
  page: number
  /** 总页数 */
  pages: number
  /** 页尺寸 */
  pageSize: number
}

export type seller = {
  id: number
  mobile: string
  nickname: string
}

export type buyer = {
  id: number
  mobile: string
  nickname: string
}

/** 订单列表项 */
export type OrderItem = OrderResult & {
  /** 总件数 */
  totalNum: number
}

/**订单物流信息 */
export type OrderExpress = {
  com: string
  condition: string
  data: ExpressData[]
  ischeck: string
  message: string
  nu: string
  state: string
  status: string
}

//物流信息
export type ExpressData = {
  areaCode: string
  areaName: string
  context: string
  ftime: string
  status: string
  time: string
}

/** 订单列表 */
export type BlindBoxResult = {
  /** 总记录数 */
  counts: number
  /** 数据集合    [ 订单信息 ] */
  items: BlindBoxOrderItem[]
  /** 当前页码 */
  page: number
  /** 总页数 */
  pages: number
  /** 页尺寸 */
  pageSize: number
}

//盲盒订单item
export type BlindBoxOrderItem = {
  address: string
  area_info: string
  delivery_code: string
  delivery_name: string
  delivery_no: string
  delivery_time: string
  id: number
  order_no: string
  order_price: number
  order_status: number
  pay_image: string
  receive_name: string
  receive_tel: string
  refuse_info: string
  user_id: number
  verify_status: number
  verify_time: number
}
