<script setup lang="ts">
//点击跳转页面
const changeAgency = () => {
  uni.navigateTo({
    url: '/pages/agency/agency?type=1',
  })
}
const changeInvite = () => {
  uni.navigateTo({
    url: '/pages/invite/invite',
  })
}
const buycoupon = () => {
  uni.navigateTo({
    url: '/pages/coupon/couponbuy?type=1',
  })
}
</script>

<template>
  <view class="category">
    <view class="category-item" v-on:click="changeAgency">
      <image class="icon" src="../../../static/images/dai.png"></image>
      <text class="text">抢盲盒</text>
    </view>
    <view class="category-item" v-on:click="changeInvite">
      <image class="icon" src="../../../static/images/invite.png"></image>
      <text class="text">玉珊阁</text>
    </view>
    <view class="category-item" v-on:click="buycoupon">
      <image class="icon" src="../../../static/images/quan.png"></image>
      <text class="text">抵扣券</text>
    </view>
  </view>
</template>

<style lang="scss">
.category {
  display: flex;
  flex-wrap: wrap;
  min-height: 200rpx;
  margin: 40rpx 0rpx 0rpx;
  //border-radius: 10rpx;
  background-color: #fff;
  .category-item {
    width: 250rpx;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;

    .icon {
      width: 100rpx;
      height: 100rpx;
    }
    .text {
      font-size: 26rpx;
      color: #666;
    }
  }
}
</style>
