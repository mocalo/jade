import type { GoodsItem } from './global'

/** 首页-广告区域数据类型 */
export type BannerItem = {
  id: number
  ad_name: string
  ad_pic: string
  ad_url: string
  is_show: number
  cate_id: number
  sort: number
  ad_url_type: string
}

/** 首页-前台类目数据类型 */
export type CategoryItem = {
  /** 图标路径 */
  icon: string
  /** id */
  id: string
  /** 分类名称 */
  name: string
}

/** 首页-热门推荐数据类型 */
export type HotItem = {
  /** 说明 */
  alt: string
  /** id */
  id: string
  /** 图片集合[ 图片路径 ] */
  pictures: string[]
  /** 跳转地址 */
  target: string
  /** 标题 */
  title: string
  /** 推荐类型 */
  type: string
}

export type SaleItem = {
  id: number
  //标题
  name: string
  //开始时间
  start_time: string
  //结束时间
  end_time: string
}

//说明文档
export type ArticleItem = {
  id: number
  //标题
  art_name: string
  //内容
  art_content: string
}
export type AgentResult = {
  id: number
  name: string
  money: number
  man_price: number
  dec_price: number
  describe: string
  tag: string
  pay_usdt: string
  update_time: number
  create_time: number
}

export type MyOrderResult = {
  buyer: buyer
  seller: seller
}

export type buyer = {
  wait_count: string
  success_count: string
  delivery_count: string
  received_count: string
}
export type seller = {
  wait_count: string
  delivery_count: string
  confirm_count: string
}

export type paymentSell = {
  total_price: number
  pay_money: string
  pay_usdt: string
  pay_rmb: number
}

/** 猜你喜欢-商品类型 */
export type GuessItem = GoodsItem
export type SaleGoodsItem = GoodsItem
