/** 添加收货地址: 请求参数 */
export type AddressParams = {
  /** 收货人姓名 */
  receive_name: string
  /** 联系方式 */
  receive_tel: string
  /** 省份编码 */
  province_id: string
  /** 城市编码 */
  city_id: string
  /** 区/县编码 */
  region_id: string
  /** 详细地址 */
  address: string
  /** 默认地址，1为是，0为否 */
  isDefault: number
}

/** 收货地址项 */
export type AddressItem = AddressParams & {
  /** 收货地址 id */
  id: number
  /** 省市区 */
  area_info: string
}

export type RegionItem = {
  /** 区域id */
  id: number
  /** 区域名称 */
  name: string
  /** 区域编码 */
  code: string
  /** 区域父级编码 */
  pid: string
  /** 区域层级 */
  deep: number
  /** 区域层级 */
  lev: number
  /** 区域子集 */
  children: RegionItem[]
}
