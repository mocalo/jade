import type { AddressItem, AddressParams, RegionItem } from '@/types/address'
import { http } from '@/utils/http'

/**
 * 添加收货地址
 * @param data 请求参数
 */
export const postMemberAddressAPI = (data: AddressParams) => {
  return http({
    method: 'POST',
    url: '/api/address/add',
    data,
  })
}

/**获取区域信息 */
export const getRegionAPI = () => {
  return http<RegionItem[]>({
    method: 'GET',
    url: '/api/area/index',
  })
}

/**
 * 获取收货地址列表
 */
export const getMemberAddressAPI = () => {
  return http<AddressItem[]>({
    method: 'GET',
    url: '/api/address/index',
  })
}

/**
 * 获取收货地址详情
 */
export const getMemberAddressByIdAPI = () => {
  return http<AddressItem>({
    method: 'GET',
    url: `/api/address/getdefault`,
  })
}

/**
 * 修改收货地址
 * @param data 表单数据(请求体参数)
 */
export const putMemberAddressByIdAPI = (data: AddressParams) => {
  return http({
    method: 'POST',
    url: `/api/address/edit`,
    data,
  })
}

/**
 * 删除收货地址
 * @param id 地址id(路径参数)
 */
export const deleteMemberAddressByIdAPI = (id: number) => {
  return http({
    method: 'DELETE',
    url: `/member/address/${id}`,
  })
}
