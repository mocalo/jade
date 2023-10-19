import type { AddressItem } from './address'
import type { GoodsItem } from './global'

/** 商品信息 */
export type GoodsResult = {
  /**藏品所有者 */
  belongs: Belongs
  /**商品收藏 */
  goods_collect: number
  /**商品内容 */
  goods_content: string
  /**商品市场价 */
  goods_market_price: string
  /**商品主图 */
  goods_master_image: string
  /**商品名称 */
  goods_name: string
  /**商品价格 */
  goods_price: string
  /**商品销量 */
  goods_sale: number
  /**商品状态 */
  goods_status: number
  /**库存 */
  goods_stock: number
  id: number
  /**是否新品 */
  is_new: number
  /**是否推荐 */
  is_recommend: number
  /**是否抢购 */
  is_rob: number
  goodsImages: GoodsImages[]
}
/**藏品图片 */
export type GoodsImages = {
  /**图片地址 */
  image_url: string
  /**图片id */
  id: number
  /**图片排序 */
  goods_id: number
}
/**藏品归属人 */
export type Belongs = {
  /** id */
  id: number
  /** 归属人名称 */
  mobile: string
  /**呢称 */
  nickname: string
}
