<script setup lang="ts">
import { ref } from 'vue'
import PayAddressList from './components/PayAddressList.vue'

// 获取页面参数
const query = defineProps<{
  type: string
}>()

// tabs 数据
const couponTabs = ref([
  { payFlag: 1, title: '银行卡收款', isRender: false },
  { payFlag: 2, title: '支付宝收款', isRender: false },
  { payFlag: 3, title: '微信收款', isRender: false },
  { payFlag: 4, title: 'BSC-USDT', isRender: false },
  { payFlag: 5, title: 'TRC-USDT', isRender: false },
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
      <view
        :class="activeIndex == index ? 'active item' : 'item'"
        v-for="(item, index) in couponTabs"
        :key="item.title"
        @tap="
          () => {
            activeIndex = index
            item.isRender = true
          }
        "
      >
        <view class="pay-image">
          <image
            class="pay-icon"
            v-if="activeIndex == index"
            :src="'../../static/icon/Vectort-' + index + '.png'"
            mode="widthFix"
          ></image>
          <image
            class="pay-icon"
            v-else
            :src="'../../static/icon/Vector-' + index + '.png'"
            mode="widthFix"
          ></image>
        </view>
        <view :class="activeIndex == index ? 'active' : ''">
          {{ item.title }}
        </view>
      </view>
      <!-- 游标 -->
    </view>
    <!-- 滑动容器 -->
    <view class="title">收款信息</view>
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
  background-color: #f3f3f3;
}

.viewport {
  height: 100%;
  display: flex;
  flex-direction: column;
}

// tabs
.tabs {
  display: flex;
  flex-wrap: wrap;
  line-height: 60rpx;
  margin: 20rpx 10rpx;
  box-shadow: 0 4rpx 6rpx rgba(240, 240, 240, 0.6);
  position: relative;
  z-index: 9;

  .item {
    text-align: center;
    margin-bottom: 20rpx;
    margin-right: 22rpx;
    padding: 5rpx 0rpx;
    font-size: 28rpx;
    color: #777;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 2rpx solid #ccc;
    border-radius: 20rpx;
    width: 220rpx;
    background-color: #fff;
    .pay-image {
      height: 60rpx;
      .pay-icon {
        width: 50rpx;
      }
    }
    .active {
      color: #333;
    }
  }
  .item + .active {
    border: 2rpx solid #aaa;
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
.title {
  font-size: 28rpx;
  padding-left: 35rpx;
  font-weight: 700;
}
// swiper
.swiper {
  background-color: #fff;
  margin: 30rpx;
  border-radius: 20rpx;
}
</style>
