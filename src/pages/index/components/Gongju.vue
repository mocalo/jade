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
const jumpPage = (name)=>{
	uni.navigateTo({
		url:name
	})
}
</script>

<template>
  <view class="category">
    <view class="category-item" v-on:click="jumpPage('/pages/integral/integral')">
      <image class="icon" src="../../../static/icon/home_jfsc.png"></image>
      <text class="text">积分商城</text>
    </view>
    <view class="category-item" v-on:click="changeInvite">
      <image class="icon" src="../../../static/icon/home_ptjs.png"></image>
      <text class="text">平台介绍</text>
    </view>
    <view class="category-item" v-on:click="jumpPage('/pages/myteam/myteam')">
      <image class="icon" src="../../../static/icon/home_wdtd.png"></image>
      <text class="text">我的团队</text>
    </view>
    <view class="category-item" v-on:click="jumpPage('/pages/commission/commission')">
      <image class="icon" src="../../../static/icon/home_yjsy.png"></image>
      <text class="text">佣金收益</text>
    </view>
	<!-- <view class="category-item" v-on:click="changeAgency">
	  <image class="icon" src="../../../static/icon/home_jfsc.png"></image>
	  <text class="text">抢盲盒</text>
	</view>
    <view class="category-item" v-on:click="changeInvite">
      <image class="icon" src="../../../static/images/invite.png"></image>
      <text class="text">玉珊阁</text>
    </view>
    <view class="category-item" v-on:click="buycoupon">
      <image class="icon" src="../../../static/images/quan.png"></image>
      <text class="text">抵扣券</text>
    </view> -->
  </view>
</template>

<style lang="scss">
.category {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  height: 160rpx;
  margin: 40rpx 35rpx 0rpx;
  //border-radius: 10rpx;
  background-color: #fff;
  .category-item {
    width: 150rpx;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;

    .icon {
      width: 90rpx;
      height: 90rpx;
    }
    .text {
      font-size: 26rpx;
      color: #666;
	  margin-top: 10rpx;
    }
  }
}
</style>
