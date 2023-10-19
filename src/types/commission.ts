export type CommissionResult = {
  total_money: string //总佣金
  total_score: string //总积分
  today_money: string //今日佣金
  today_score: string //今日积分
  money: string //可提现佣金
  score: string //可提现积分
}

export type CommissionLogItem = {
  id: number //佣金记录id
  user_id: number //用户id
  traget_id: number //目标用户id
  order_id: number //订单id
  commission: number //佣金
  money: string //佣金
  score: string //积分
  memo: string //备注
  update_time: number //更新时间
  create_time: number //创建时间
}

export type CommissionLogListResult = {
  items: CommissionListItem[]
  page: number
  pageSize: number
  counts: number
}

export type CommissionListItem = {
  action: number
  after: string
  before: string
  create_time: number
  id: number
  memo: string
  money: string
  user_id: number
}

export type ScoreLogListResult = {
  items: ScoreListItem[]
  page: number
  pageSize: number
  counts: number
}

export type ScoreListItem = {
  action: number
  after: string
  before: string
  create_time: number
  id: number
  memo: string
  score: string
  user_id: number
}

export type CommissionLogResult = {
  items: CommissionLogItem[]
  page: number
  pageSize: number
  counts: number
}
