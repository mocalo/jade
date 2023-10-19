export type EarningsResult = {
  income: string //总收益
  order_count: number //订单数
}

export type EarningsLogItem = {
  id: number
  user_id: number
  order_id: number
  income: string
  update_time: number
  create_time: number
}

export type EarningsLogResult = {
  items: EarningsLogItem[]
  page: number
  pageSize: number
  counts: number
}
