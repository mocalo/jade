<script setup lang="ts">
import { ref } from 'vue'
import PayAddressList from './components/agency_one.vue'

// 获取页面参数
const query = defineProps<{
  type: string
}>()

// tabs 数据
const couponTabs = ref([
  { payFlag: 1, title: '银行卡', isRender: false },
  { payFlag: 2, title: '支付宝', isRender: false },
  { payFlag: 3, title: '微信', isRender: false },
])

// 高亮下标
const activeIndex = ref(couponTabs.value.findIndex((v) => v.payFlag === Number(query.type)))
// 默认渲染容器
couponTabs.value[activeIndex.value].isRender = true
</script>

<template>
  <view class="viewport">
    <!-- tabs -->
    <view class="tabs">
      <text
        class="item"
        v-for="(item, index) in couponTabs"
        :key="item.title"
        @tap="
          () => {
            activeIndex = index
            item.isRender = true
          }
        "
      >
        {{ item.title }}
      </text>
      <!-- 游标 -->
      <view class="cursor" :style="{ left: activeIndex * 35 + '%' }"></view>
    </view>
    <!-- 滑动容器 -->
    <swiper class="swiper" :current="activeIndex" @change="activeIndex = $event.detail.current">
      <!-- 滑动项 -->
      <swiper-item v-for="item in couponTabs" :key="item.title">
        <!-- 抵扣券列表 -->
        <!-- <CouponList v-if="item.isRender" :payFlag="item.payFlag" /> -->
        <PayAddressList v-if="item.isRender" :payFlag="item.payFlag" />
      </swiper-item>
    </swiper>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}

.viewport {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

// tabs
.tabs {
  display: flex;
  justify-content: space-around;
  line-height: 60rpx;
  margin: 0 10rpx;
  background-color: #fff;
  box-shadow: 0 4rpx 6rpx rgba(240, 240, 240, 0.6);
  position: relative;
  z-index: 9;

  .item {
    flex: 1;
    text-align: center;
    padding: 20rpx;
    font-size: 28rpx;
    color: #262626;
  }

  .cursor {
    position: absolute;
    left: 10%;
    bottom: 0;
    width: 30%;
    height: 6rpx;
    padding: 0 50rpx;
    background-color: #799372;
    /* 过渡效果 */
    transition: all 0.4s;
  }
}

// swiper
.swiper {
  background-color: #f7f7f8;
}
</style>
