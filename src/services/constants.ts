/** 订单状态枚举 */
export enum OrderState {
  /** 待付款 */
  DaiFuKuan = 1,
  /** 待发货 */
  DaiFaHuo = 5,
  /** 待收货 */
  DaiShouHuo = 6,
  /** 待评价 */
  DaiPingJia = 7,
  /** 已完成 */
  YiWanCheng = 7,
  /** 已取消 */
  YiQuXiao = 2,
  /**待确认 */
  DaiQueRen = 3,
  /**支付成功 */
  ZhiFuChengGong = 4,
}

export enum OrderType {
  /** 寄售中 */
  JiShouZhong = 2,
  /**待审核 */
  DaiShenHe = 1,
  /**寄售成功 */
  JiShouChengGong = 3,
  /**寄售失败 */
  JiShouShiBai = 4,
}

/** 订单状态列表 */
export const orderStateList = [
  { id: 0, text: '全部' },
  { id: 1, text: '待付款' },
  { id: 2, text: '已取消' },
  { id: 3, text: '待确认' },
  { id: 4, text: '支付成功' },
  { id: 5, text: '待发货' },
  { id: 6, text: '待收货' },
  { id: 7, text: '已完成' },
]

/** 订单寄售列表 */
export const saleStateList = [
  { id: 0, text: '' },
  { id: 1, text: '待审核' },
  { id: 2, text: '寄售中' },
  { id: 3, text: '寄售成功' },
  { id: 4, text: '寄售失败' },
]

/** 抵扣券状态*/

export enum couponState {
  /** 待使用 */
  use = 1,
  /** 已使用 */
  used = 2,
  /** 已过期 */
  expire = 3,
}
