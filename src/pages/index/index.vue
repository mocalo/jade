<script setup lang="ts">
import { getHomeBannerAPI } from '@/services/home'
import type { BannerItem } from '@/types/home'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import CustomNavbar from './components/CustomNavbarNew.vue'
import Gongju from './components/Gongju.vue'
// import Integral from './components/Integral.vue'
import Events from './components/Events.vue'
import PageSkeleton from './components/PageSkeleton.vue'
import { useGuessList } from '@/composables'
// 获取轮播图数据
const bannerList = ref<BannerItem[]>([])

const bannerList2 = ref<BannerItem[]>([])

const getHomeBannerData = async () => {
  var data = {
    tag: 'moblie_home_banner',
  }
  const res = await getHomeBannerAPI(data)
  bannerList.value = res.data
}

const getScoreBannerData = async () => {
  var data = {
    tag: 'mobile_home_score',
  }
  const res = await getHomeBannerAPI(data)
  bannerList2.value = res.data
}

// 是否加载中标记
const isLoading = ref(false)

// 页面加载
onLoad(async () => {
  isLoading.value = true
  await Promise.all([getHomeBannerData()])
  await Promise.all([getScoreBannerData()])
  isLoading.value = false

})

// 猜你喜欢组合式函数调用
const { guessRef, onScrolltolower } = useGuessList()
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
      <Gongju />
      <Events :list="bannerList2" />
      <!-- 首页推荐 -->
      <XtxGuess ref="guessRef" />
    <!-- <XtxSaleGoods ref="guessRef" name="艺术概括" /> -->
    </template>
  </scroll-view>
</template>

<style lang="scss">
page {
  background-color: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.scroll-view {
  flex: 1;
}
</style>
