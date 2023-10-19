<script setup lang="ts">
import { computed, ref } from 'vue'
import type { GoodsResult } from '@/types/goods'
import { postMemberCartAPI } from '@/services/cart'
// 子调父
const emit = defineEmits<{
  (event: 'close'): void
}>()
// 接收页面参数
const query = defineProps<{
  goods: GoodsResult
}>()

//加入购物车
const addCarts = () => {
  uni.navigateTo({ url: `/pagesOrder/create/create?goods_id=${query.goods.id}&&qiang_type=1` })
  emit('close')
}
</script>

<template>
  <view class="service-panel">
    <!-- 关闭按钮 -->
    <text class="close icon-close" @tap="emit('close')"></text>
    <!-- 标题 -->
    <view class="title">立即抢购</view>
    <!-- 内容 -->
    <view class="content">
      <view class="left">
        <image :src="query.goods.goods_master_image" mode="aspectFill" />
      </view>
      <view class="right">
        <view class="name">{{ query.goods.goods_name }}</view>
        <view class="price">￥{{ query.goods.goods_price }}</view>
        <view class="stock">库存：{{ query.goods.goods_stock }}</view>
        <view class="num">
          <text>购买数量:1</text>
        </view>
      </view>
    </view>
    <view class="buttons" v-if="goods?.goods_stock > 0">
      <view @tap="addCarts" class="payment1"> 立即抢购 </view>
    </view>
  </view>
</template>

<style lang="scss">
.service-panel {
  padding: 0 30rpx;
  border-radius: 10rpx 10rpx 0 0;
  position: relative;
  background-color: #fff;
}

.title {
  line-height: 1;
  padding: 20rpx 0;
  text-align: center;
  font-size: 26rpx;
  color: #799372;
  font-weight: normal;
}

.close {
  position: absolute;
  right: 24rpx;
  top: 24rpx;
}

.content {
  display: flex;
  padding: 30rpx 0;
  .left {
    width: 300rpx;
    height: 300rpx;
    margin-right: 20rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .name {
      font-size: 28rpx;
      color: #444;
    }
    .price {
      font-size: 32rpx;
      color: #ff4d4f;
    }
    .stock {
      font-size: 24rpx;
      color: #999;
    }
    .num {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 200rpx;
      height: 60rpx;
      border-radius: 30rpx;
      text-align: center;
      font-size: 28rpx;
      color: #444;
      .iconfont {
        font-size: 28rpx;
      }
    }
  }
}
.buttons {
  padding: 30rpx 0;
  display: flex;
  & > view {
    width: 220rpx;
    text-align: center;
    line-height: 72rpx;
    font-size: 26rpx;
    color: #fff;
    border-radius: 72rpx;
  }
  .addcart {
    background-color: #ffa868;
  }
  .payment {
    background-color: #799372;
    margin-left: 20rpx;
  }
  .payment1 {
    background-color: #799372;
    width: 700rpx;
  }
}
</style>
