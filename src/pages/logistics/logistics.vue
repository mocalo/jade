<script setup lang="ts">
import { orderStateList } from '@/services/constants'
import {
  putMemberOrderReceiptByIdAPI,
  getMemberOrderDeliverByIdAPI,
  getAgentOrderListAPI,
  getMemberOrderExpressByIdAPI,
  getAgentOrderExpressByIdAPI,
} from '@/services/order'
import { deleteMemberOrderAPI } from '@/services/order'
import { getMemberOrderAPI } from '@/services/order'
import { useMemberStore } from '@/stores'
import type { PageParams } from '@/types/global'
import type { BlindBoxOrderItem, ExpressData, OrderExpress, OrderItem } from '@/types/order'
import type { OrderListParams } from '@/types/order'
import { timechange } from '@/utils/timechange'
import { onShow } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
// 获取页面参数
const query = defineProps<{
  id: number
  type: string
}>()
// 复制内容
const onCopy = (id: string) => {
  // 设置系统剪贴板的内容
  uni.setClipboardData({ data: id })
}
//获取物流信息
// 获取物流列表
const orderList = ref<ExpressData[]>([])
const logisticList = ref<OrderExpress>()
const getMemberOrderLogisticsByIdData = async () => {
  if (query.type == 'agent') {
    const res = await getAgentOrderExpressByIdAPI(query.id)
    //获取物流信息
    logisticList.value = res.data
    console.log('物流信息', logisticList.value)
    orderList.value = logisticList.value.data
  } else {
    const res = await getMemberOrderExpressByIdAPI(query.id)
    //获取物流信息
    logisticList.value = res.data
    console.log('物流信息', logisticList.value)
    orderList.value = logisticList.value.data
  }
}

// onMounted(() => {
//   getMemberOrderData()
// })

onShow(async () => {
  orderList.value = []
  // 加载数据
  await getMemberOrderLogisticsByIdData()
})
</script>

<template>
  <scroll-view enable-back-to-top scroll-y class="orders" @scrolltolower="getMemberOrderData">
    <view class="card" v-for="order in orderList" :key="order.id">
      <!-- 订单信息 -->
      <view class="detail">
        <view class="row">
          <view class="item"> 物流状态: {{ order.status }} </view>
          <view class="item">{{ order.context }}</view>
          <view class="item">{{ order.time }}</view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<style lang="scss">
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

  .detail {
    line-height: 1;
    margin: 20rpx 20rpx 0;
    font-size: 16rpx;
    color: #666;
    border-radius: 10rpx;
    background-color: rgb(247, 246, 246);

    .title {
      font-size: 24rpx;
      color: #444;
      text-align: center;
    }
    .button {
      width: 100%;
      height: 100%;
      background-color: #799732;
      color: #fff;
      text-align: center;
      line-height: 40rpx;
      border-radius: 10rpx;
    }
    .row {
      padding: 10rpx 0;

      .item {
        padding: 10rpx 0;
        display: flex;
        align-items: center;
        line-height: 40rpx;
      }

      .image {
        width: 100%;
        height: 900rpx;
      }

      .copy {
        border-radius: 20rpx;
        font-size: 12rpx;
        border: 1px solid #ccc;
        padding: 5rpx 10rpx;
        margin-left: 10rpx;
      }
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
