<script setup lang="ts">
import { OrderState, saleStateList } from '@/services/constants'
import { orderStateList } from '@/services/constants'
import { getMemberOrderListAPI } from '@/services/order'
import { useMemberStore } from '@/stores'
import type { OrderItem } from '@/types/order'
import type { OrderListParams } from '@/types/order'
import { timechange } from '@/utils/timechange'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { phoneNumShow } from '@/utils/timechange'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

// 定义 porps
const props = defineProps<{
  user_id: number
}>()

// 获取会员信息
const memberStore = useMemberStore()

// 请求参数
const queryParams: Required<{
  page: number
  pageSize: number
  user_id: number
}> = {
  page: 1,
  pageSize: 5,
  user_id: props.user_id,
}

// 获取订单列表
const orderList = ref<OrderItem[]>([])
// 是否加载中标记，用于防止滚动触底触发多次请求
const isLoading = ref(false)
const getMemberOrderData = async () => {
  // 如果数据出于加载中，退出函数
  if (isLoading.value) return
  // 退出分页判断
  if (isFinish.value === true) {
    return uni.showToast({ icon: 'none', title: '没有更多数据~' })
  }
  // 发送请求前，标记为加载中
  isLoading.value = true
  // 发送请求
  const res = await getMemberOrderListAPI(queryParams)
  // 发送请求后，重置标记
  isLoading.value = false
  // 数组追加
  orderList.value.push(...res.data.items)
  console.log(orderList.value)
  // 分页条件
  var pages = Math.ceil(Number(res.data.counts) / Number(queryParams.pageSize))
  console.log(pages)
  if (queryParams.page < pages) {
    // 页码累加
    queryParams.page++
  } else {
    // 分页已结束
    isFinish.value = true
  }
}

onLoad(() => {
  getMemberOrderData()
})

// 是否分页结束
const isFinish = ref(false)
// 是否触发下拉刷新
const isTriggered = ref(false)
// 自定义下拉刷新被触发
const onRefresherrefresh = async () => {
  // 开始动画
  isTriggered.value = true
  // 重置数据
  queryParams.page = 1
  orderList.value = []
  isFinish.value = false
  // 加载数据
  await getMemberOrderData()
  // 关闭动画
  isTriggered.value = false
}
</script>

<template>
  <scroll-view
    enable-back-to-top
    scroll-y
    class="orders"
    refresher-enabled
    :refresher-triggered="isTriggered"
    @refresherrefresh="onRefresherrefresh"
    @scrolltolower="getMemberOrderData"
  >
    <view class="card" v-for="order in orderList" :key="order.id">
      <!-- 订单信息 -->
      <view class="status">
        <text class="date">{{ timechange(order.create_time) }}</text>
        <!-- 订单状态文字 -->
        <text v-if="order.order_status != OrderState.ZhiFuChengGong">{{
          orderStateList[order.order_status].text
        }}</text>
        <text v-if="order.order_status == OrderState.ZhiFuChengGong"
          >{{ orderStateList[order.order_status].text }}
          {{ saleStateList[order.sale_status].text }}</text
        >
      </view>
      <!-- 商品信息，点击商品跳转到订单详情，不是商品详情 -->
      <navigator class="goods" hover-class="none">
        <view class="cover">
          <image class="image" mode="aspectFit" :src="order.goods.goods_master_image"></image>
        </view>
        <view class="meta">
          <view class="name ellipsis">{{ order.goods.goods_name }}</view>
          <view class="type">卖家：{{ phoneNumShow(order.seller.mobile) }}</view>
          <view class="type">买家：{{ phoneNumShow(order.buyer.mobile) }}</view>
          <view class="type">{{ order.goods.goods_price }}</view>
        </view>
      </navigator>
      <!-- 支付信息 -->
      <view class="payment">
        <text class="quantity">共1件商品</text>
        <text>实付</text>
        <text class="amount"> <text class="symbol">¥</text>{{ order.pay_cash }}</text>
      </view>
    </view>
    <!-- 底部提示文字 -->
    <view class="loading-text" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
      {{ isFinish ? '没有更多数据~' : '正在加载...' }}
    </view>
  </scroll-view>
</template>

<style lang="scss">
:host {
  display: block;
}
// 订单列表
.orders {
  .card {
    min-height: 100rpx;
    padding: 20rpx;
    margin: 20rpx 20rpx 0;
    border-radius: 10rpx;
    background-color: #fff;

    &:last-child {
      padding-bottom: 40rpx;
    }
  }

  .status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 28rpx;
    color: #999;
    margin-bottom: 15rpx;

    .date {
      color: #666;
      flex: 1;
    }

    .primary {
      color: #ff9240;
    }

    .icon-delete {
      line-height: 1;
      margin-left: 10rpx;
      padding-left: 10rpx;
      border-left: 1rpx solid #e3e3e3;
    }
  }

  .goods {
    display: flex;
    margin-bottom: 20rpx;

    .cover {
      width: 170rpx;
      height: 170rpx;
      margin-right: 20rpx;
      border-radius: 10rpx;
      overflow: hidden;
      position: relative;
      .image {
        width: 170rpx;
        height: 170rpx;
      }
    }

    .quantity {
      position: absolute;
      bottom: 0;
      right: 0;
      line-height: 1;
      padding: 6rpx 4rpx 6rpx 8rpx;
      font-size: 24rpx;
      color: #fff;
      border-radius: 10rpx 0 0 0;
      background-color: rgba(0, 0, 0, 0.6);
    }

    .meta {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .name {
      height: 80rpx;
      font-size: 26rpx;
      color: #444;
    }

    .type {
      line-height: 1.8;
      padding: 0 15rpx;
      margin-top: 10rpx;
      font-size: 24rpx;
      align-self: flex-start;
      border-radius: 4rpx;
      color: #888;
      background-color: #f7f7f8;
    }

    .more {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22rpx;
      color: #333;
    }
  }

  .payment {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    line-height: 1;
    padding: 20rpx 0;
    text-align: right;
    color: #999;
    font-size: 28rpx;
    border-bottom: 1rpx solid #eee;

    .quantity {
      font-size: 24rpx;
      margin-right: 16rpx;
    }

    .amount {
      color: #444;
      margin-left: 6rpx;
    }

    .symbol {
      font-size: 20rpx;
    }
  }

  .action {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-top: 20rpx;

    .button {
      width: 180rpx;
      height: 60rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 20rpx;
      border-radius: 60rpx;
      border: 1rpx solid #ccc;
      font-size: 26rpx;
      color: #444;
    }
    .button1 {
      width: 180rpx;
      height: 60rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0rpx 300rpx 0 0;
      border-radius: 60rpx;
      border: 1rpx solid #ccc;
      font-size: 26rpx;
      color: #444;
    }

    .secondary {
      color: #27ba9b;
      border-color: #27ba9b;
    }

    .primary {
      color: #fff;
      background-color: #799372;
      border-color: #799372;
    }
  }

  .loading-text {
    text-align: center;
    font-size: 28rpx;
    color: #666;
    padding: 20rpx 0;
  }
}
</style>
