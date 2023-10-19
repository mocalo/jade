import XtxSwiper from '@/components/XtxSwiper.vue'
import XtxGuess from '@/components/XtxGuess.vue'
import XtxSale from '@/components/XtxSale.vue'
import XtxIntegral from '@/components/XtxIntegral.vue'
import XtxSaleGoods from '@/components/XtxSaleGoods.vue'
declare module 'vue' {
  export interface GlobalComponents {
    XtxSwiper: typeof XtxSwiper
    XtxGuess: typeof XtxGuess
    XtxSale: typeof XtxSale
    XtxIntegral: typeof XtxIntegral
    XtxSaleGoods: typeof XtxSaleGoods
  }
}

// 组件实例类型
export type XtxGuessInstance = InstanceType<typeof XtxGuess>
export type XtxSwiperInstance = InstanceType<typeof XtxSwiper>
export type XtxSaleInstance = InstanceType<typeof XtxSale>
export type XtxIntegralInstance = InstanceType<typeof XtxIntegral>
export type XtxSaleGoodsInstance = InstanceType<typeof XtxSaleGoods>
