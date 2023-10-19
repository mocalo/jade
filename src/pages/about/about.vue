<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'

</script>

<template>
  <view class="viewport">
    <view class="logo">
      <image
        src="@/static/images/logo.png"
      ></image>
    </view>
    <view class="tips">
      <text >2023版权归玉珊阁所有</text>
    </view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20rpx 40rpx;
}

.logo {
  flex: 1;
  text-align: center;
  image {
    width: 520rpx;
    height: 220rpx;
    margin-top: 15vh;
  }
}
.tips{
  text-align: center;
  color: #999;
  font-size: 24rpx;
  margin-top: 20rpx;
}

</style>
