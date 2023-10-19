/** 通用分页结果类型 */
export type PageResult<T> = {
  /** 列表数据 */
  items: T[]
  /** 总条数 */
  counts: number
  /** 当前页数 */
  page: number
  /** 总页数 */
  pages: number
  /** 每页条数 */
  pageSize: number
}

/** 通用分页参数类型 */
export type PageParams = {
  /** 页码：默认值为 1 */
  page?: number
  /** 页大小：默认值为 10 */
  pageSize?: number
}

/**藏品归属人 */
export type Belongs = {
  /** id */
  id: number
  /** 归属人名称 */
  mobile: string
}

/** 通用商品类型 */
export type GoodsItem = {
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
}
