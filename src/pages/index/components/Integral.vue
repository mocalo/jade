<script setup lang="ts">
import type { BannerItem } from '@/types/home'
import { ref } from 'vue'

const activeIndex = ref(0)

// 当 swiper 下标发生变化时触发
const onChange: UniHelper.SwiperOnChange = (ev) => {
  activeIndex.value = ev.detail.current
}
// 定义 props 接收
defineProps<{
  list: BannerItem[]
}>()

//跳转页面
const changePage = (e: UniHelper.CustomEvent) => {
  uni.navigateTo({ url: '/pages/integral/integral' })
}
</script>

<template>
  <view class="category">
    <view class="cate">
      <image class="icon" src="../../../static/images/integral.png"></image>
    </view>
    <view class="carousel" @tap="changePage">
      <swiper :circular="true" :autoplay="false" :interval="3000" @change="onChange">
        <swiper-item v-for="item in list" :key="item.id">
          <navigator :url="item.ad_url" hover-class="none" class="navigator">
            <image mode="aspectFill" class="image" :src="item.ad_pic"></image>
          </navigator>
        </swiper-item>
      </swiper>
      <!-- 指示点 -->
      <view class="indicator">
        <text
          v-for="(item, index) in list"
          :key="item.id"
          class="dot"
          :class="{ active: index === activeIndex }"
        ></text>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.category {
  min-height: 440rpx;
  margin: 40rpx 0rpx 0rpx;
  //border-radius: 10rpx;
  background-color: #fff;
  .cate {
    width: 260rpx;
    height: 60rpx;
    .icon {
      width: 195rpx;
      height: 45rpx;
    }
  }
  .img_inte {
    .img_in {
      width: 100%;
      height: 400rpx;
    }
  }
}
.carousel {
  height: 380rpx;
  position: relative;
  overflow: hidden;
  transform: translateY(0);
  background-color: #efefef;
  .indicator {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 16rpx;
    display: flex;
    justify-content: center;
    .dot {
      width: 30rpx;
      height: 6rpx;
      margin: 0 8rpx;
      border-radius: 6rpx;
      background-color: rgba(255, 255, 255, 0.4);
    }
    .active {
      background-color: #fff;
    }
  }
  .navigator,
  .image {
    width: 100%;
    height: 100%;
  }
}
</style>
