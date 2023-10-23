<script setup lang="ts">
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
</script>

<template>
  <view class="navbar" >
    
    <view class="icon-scan">
		<text></text>
		<view>扫一扫</view>
	</view>
    <view class="search">
      <text class="icon-search">搜索商品</text>
    </view>
    <view class="icon-msg">
		<text></text>
		<view>消息</view>
	</view>
  </view>
</template>

<style lang="scss">
/* 自定义导航条 */
.navbar {
  background-color: #fff;
  background-size: cover;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px 35rpx 20rpx;
  .logo {
    display: flex;
    align-items: center;
    height: 64rpx;
    padding-left: 30rpx;
    .logo-image {
      width: 166rpx;
      height: 39rpx;
    }
    .logo-text {
      flex: 1;
      line-height: 28rpx;
      color: #fff;
      margin: 2rpx 0 0 20rpx;
      padding-left: 20rpx;
      border-left: 1rpx solid #fff;
      font-size: 26rpx;
    }
  }
  .search {
    display: flex;
    align-items: center;
	width: 73%;
    justify-content: space-between;
    padding: 0 10rpx 0 26rpx;
    height: 64rpx;
    margin: 16rpx 20rpx;
    color: #ccc;
    font-size: 22rpx;
    border-radius: 32rpx;
    background-color: #fafafa;
  }
  .icon-search {
    &::before {
      margin-right: 10rpx;
    }
  }
  .icon-msg {
	  width: 42rpx;
	  background-image: url(../static/images/msg_1.png);
	background-size: 100%;
	background-repeat: no-repeat;
	text-align: center;
	padding-top: 40rpx;
		view{
			font-size: 16rpx;
		}
  }
  .icon-scan {
    font-size: 35rpx;
    padding: 15rpx;
	display: flex;
	align-items: center;	
	flex-direction: column;
	view {
		font-size: 16rpx;
	}
  }
}
</style>
