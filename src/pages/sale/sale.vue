<script setup lang="ts">
import { getHomeBannerAPI } from '@/services/home'
import type { BannerItem } from '@/types/home'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import CustomNavbar from './components/CustomNavbar.vue'

import PageSkeleton from './components/PageSkeleton.vue'
import { useSaleList } from '@/composables'

// 获取轮播图数据
const bannerList = ref<BannerItem[]>([])
const getHomeBannerData = async () => {
  var data = {
    tag: 'mobile_rob_banner',
  }
  const res = await getHomeBannerAPI(data)
  bannerList.value = res.data
}

// 是否加载中标记
const isLoading = ref(false)

// 页面加载
onLoad(async () => {
  isLoading.value = true
  await Promise.all([getHomeBannerData()])
  isLoading.value = false
})

// 猜你喜欢组合式函数调用
const { guessRef, onScrolltolower } = useSaleList()
// 当前下拉刷新状态
const isTriggered = ref(false)
// 自定义下拉刷新被触发
const onRefresherrefresh = async () => {
  // 开始动画
  isTriggered.value = true
  // 加载数据
  // await getHomeBannerData()
  // await getHomeCategoryData()
  // await getHomeHotData()
  // 重置猜你喜欢组件数据
  guessRef.value?.resetData()
  await Promise.all([
    getHomeBannerData(),
    //getHomeCategoryData(),
    //getHomeHotData(),
    guessRef.value?.getMore(),
  ])
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
    <PageSkeleton v-if="isLoading" />
    <template v-else>
      <!-- 自定义导航栏 -->
      <CustomNavbar />
      <!-- 自定义轮播图 -->
      <XtxSwiper :list="bannerList" />
      <XtxSale ref="guessRef" />
    </template>
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
