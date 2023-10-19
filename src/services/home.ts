import type { PageParams, PageResult } from '@/types/global'
import type {
  BannerItem,
  CategoryItem,
  GuessItem,
  HotItem,
  SaleItem,
  SaleGoodsItem,
  MyOrderResult,
} from '@/types/home'
import { http } from '@/utils/http'

import type { ArticleItem, AgentResult } from '@/types/home'

export type PayOrderParams = {
  payment_type: string
  pay_image: string
}

export type CouponParams = {
  tag: string
}

type bannerParams = {
  tag: string
}

/**
 * 首页-广告区域-小程序
 */
export const getHomeBannerAPI = (data: bannerParams) => {
  return http<BannerItem[]>({
    method: 'POST',
    url: '/api/Ad/index',
    data,
  })
}

/**
 * 首页-前台分类-小程序
 */
export const getHomeCategoryAPI = () => {
  return http<CategoryItem[]>({
    method: 'GET',
    url: '/home/category/mutli',
  })
}

/**
 * 首页-热门推荐-小程序
 */
export const getHomeHotAPI = () => {
  return http<HotItem[]>({
    method: 'GET',
    url: '/home/hot/mutli',
  })
}

/**获取我购买的抵扣券 */
export const getMyCouponAPI = () => {
  return http<{
    id: number
    user_id: number
    order_no: string
    receive_name: string
    receive_tel: string
    area_info: string
    address: string
    order_price: number
    pay_image: string
    order_status: number
    refuse_info: string
    verify_time: number
  }>({
    method: 'GET',
    url: '/api/agent/show',
  })
}

/**根据type获取说明文档 */
export const getArticleByTypeAPI = (tag: string) => {
  return http<ArticleItem[]>({
    method: 'GET',
    url: '/api/article/index',
    data: {
      tag: tag,
    },
  })
}

/**购买代理 */
export const postAgencyAPI = (data: PayOrderParams) => {
  return http({
    method: 'POST',
    url: `/api/agent/add`,
    data,
  })
}

/**
 * 获取订单
 */
export const getMyOrderResultAPI = () => {
  return http<MyOrderResult>({
    method: 'GET',
    url: `/api/order/statistics`,
  })
}

/**订单统计 */
export const getOrderCountAPI = () => {
  return http({
    method: 'GET',
    url: `/api/order/count`,
  })
}

/**查询抵扣券详情 */
export const getCouponAPI = (data: CouponParams) => {
  return http<AgentResult>({
    method: 'GET',
    url: `/api/coupon/show`,
    data,
  })
}

/**购买抵扣券 */
export const postCouponAPI = (data: PayOrderParams) => {
  return http({
    method: 'POST',
    url: `/api/coupon/pay`,
    data,
  })
}

/**
 * 猜你喜欢-小程序
 */
export const getHomeGoodsGuessLikeAPI = (data?: PageParams) => {
  return http<PageResult<GuessItem>>({
    method: 'GET',
    url: '/api/goods/index',
    data,
  })
}

/**
 *获取所有的抢购活动场次
 */
export const getHomeSaleAPI = (data?: PageParams) => {
  return http<PageResult<SaleItem>>({
    method: 'GET',
    url: '/api/flashSale/index',
    data,
  })
}
export const getHomeSaleGoodsAPI = (data?: PageParams) => {
  return http<PageResult<SaleGoodsItem>>({
    method: 'GET',
    url: '/api/goods/index',
    data,
  })
}
export const getHomeSaleByIdAPI = (id: number) => {
  return http<SaleItem>({
    method: 'GET',
    url: '/home/goods/saleById',
    data: {
      id,
    },
  })
}
