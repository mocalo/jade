import type { XtxGuessInstance, XtxIntegralInstance } from '@/types/components'
import type { XtxSaleInstance, XtxSaleGoodsInstance } from '@/types/components'
import { ref } from 'vue'

/**
 * 猜你喜欢组合式函数
 */
export const useGuessList = () => {
  // 获取猜你喜欢组件实例
  const guessRef = ref<XtxGuessInstance>()

  // 滚动触底事件
  const onScrolltolower = () => {
    guessRef.value?.getMore()
  }

  // 返回 ref 和事件处理函数
  return {
    guessRef,
    onScrolltolower,
  }
}

/**
 * 获取更多场次组合式函数
 */
export const useSaleList = () => {
  // 获取猜你喜欢组件实例
  const guessRef = ref<XtxSaleInstance>()

  // 滚动触底事件
  const onScrolltolower = () => {
    guessRef.value?.getMore()
  }

  // 返回 ref 和事件处理函数
  return {
    guessRef,
    onScrolltolower,
  }
}

/**
 * 获取更多场次组合式函数
 */
export const useSaleGoodsList = () => {
  // 获取猜你喜欢组件实例
  const guessRef = ref<XtxSaleGoodsInstance>()

  // 滚动触底事件
  const onScrolltolower = () => {
    guessRef.value?.getMore()
  }

  // 返回 ref 和事件处理函数
  return {
    guessRef,
    onScrolltolower,
  }
}

export const useIntegralList = () => {
  // 获取猜你喜欢组件实例
  const guessRef = ref<XtxIntegralInstance>()

  // 滚动触底事件
  const onScrolltolower = () => {
    guessRef.value?.getMore()
  }

  // 返回 ref 和事件处理函数
  return {
    guessRef,
    onScrolltolower,
  }
}
