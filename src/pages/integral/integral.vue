<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useIntegralList } from '@/composables'

// 页面加载
onLoad(async () => {})

// 猜你喜欢组合式函数调用
const { guessRef, onScrolltolower } = useIntegralList()
// 当前下拉刷新状态
const isTriggered = ref(false)
// 自定义下拉刷新被触发
const onRefresherrefresh = async () => {
  // 开始动画
  isTriggered.value = true
  console.log('开始刷新')
  // 加载数据
  // await getHomeBannerData()
  // await getHomeCategoryData()
  // await getHomeHotData()
  // 重置猜你喜欢组件数据
  guessRef.value?.resetData()
  await Promise.all([guessRef.value?.getMore()])
  // 关闭动画
  isTriggered.value = false
}
</script>

<template>
  <!-- 滚动容器 -->
  <scroll-view
    enable-back-to-top
    refresher-enabled
    @refresherrefresh="onRefresherrefresh"
    :refresher-triggered="isTriggered"
    @scrolltolower="onScrolltolower"
    class="scroll-view"
    scroll-y
  >
    <XtxIntegral ref="guessRef" />
  </scroll-view>
</template>

<style lang="scss">
page {
  background-color: #f7f7f7;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.scroll-view {
  flex: 1;
}
</style>
