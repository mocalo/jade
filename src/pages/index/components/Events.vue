<script setup lang="ts">
//点击跳转页面
const jumpPage = (name)=>{
	uni.navigateTo({
		url:name
	})
}
</script>

<template>
  <view class="category">
    <view class="category-item" v-on:click="jumpPage('/pages/agency/agency')">
      <image class="icon" src="../../../static/images/banner_zkj.png"></image>
    </view>
    <view class="category-item" v-on:click="jumpPage('/pages/coupon/couponbuy')">
      <image class="icon" src="../../../static/images/banner_zk.png"></image>
	</view>
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
    width: 48%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    .icon {
      width: 100%;
      height: 130rpx;
    }
  }
}
</style>
