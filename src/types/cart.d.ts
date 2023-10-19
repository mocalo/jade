/** 购物车类型 */
export type CartItem = {
  id: number
  goods_id: number
  user_id: number
  buy_num: number
  update_time: number
  create_time: number
  /** 是否选中 给定默认值false*/
  selected?: boolean
  goods: Goods
}

/** 商品基本信息 */
export type Goods = {
  id: number
  goods_name: string
  goods_master_image: string
  goods_price: string
  goods_market_price: string
}
