/** 订单详情 返回信息 */
export type PayAddressRes = {
  //id
  id: number
  /**收款方式  */
  payment_type: string
  /**收款二维码 */
  qrcode_url: string
  /**收款姓名 */
  name: string
  /**收款账号 */
  bank_no: string
  /**收款银行 */
  bank_name: string
  /**开户行地址 */
  bank_address: string
  qrcode_image: string
  address: string
}
