<script setup lang="ts">
import type { BannerItem } from '@/types/home'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useSaleGoodsList } from '@/composables'

// 获取轮播图数据
const bannerList = ref<BannerItem[]>([])

// 接收页面参数
const query = defineProps<{
  name: string
}>()

// 是否加载中标记
const isLoading = ref(false)

// 页面加载
onLoad(async () => {
  isLoading.value = true
  isLoading.value = false
})

// 猜你喜欢组合式函数调用
const { guessRef, onScrolltolower } = useSaleGoodsList()
// 当前下拉刷新状态
const isTriggered = ref(false)
// 自定义下拉刷新被触发
const onRefresherrefresh = async () => {
  console.log('开始刷新')
  console.log(guessRef.value)
  // 开始动画
  isTriggered.value = true
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
    <!-- <template> -->
    <!-- 自定义导航栏 -->
    <XtxSaleGoods ref="guessRef" :name="query.name" />
    <!-- </template> -->
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
