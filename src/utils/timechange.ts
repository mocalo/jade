//将时间戳转换成yyyy-mm-dd hh:mm:ss格式
export function timechange(time: number) {
  let date = new Date(time * 1000)
  let Y = date.getFullYear() + '-'
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return Y + M + D + h + m + s
}
//隐藏手机号中间四位
export function phoneNumShow(mobile: string) {
  return mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}
