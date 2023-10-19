<script setup lang="ts">
import { OrderState, saleStateList } from '@/services/constants'
import { orderStateList } from '@/services/constants'
import {
  putMemberOrderReceiptByIdAPI,
  getMemberOrderDeliverByIdAPI,
  getAgentOrderListAPI,
  postAgentOrderReceiptByIdAPI,
} from '@/services/order'
import { deleteMemberOrderAPI } from '@/services/order'
import { getMemberOrderAPI } from '@/services/order'
import { orderPayConfirm, orderPayNow, orderPaySell } from '@/services/pay'
import { useMemberStore } from '@/stores'
import type { PageParams } from '@/types/global'
import type { BlindBoxOrderItem, OrderItem } from '@/types/order'
import type { OrderListParams } from '@/types/order'
import { timechange } from '@/utils/timechange'
import { onShow } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

const orderState = ref(['待发货', '待收货', '已完成'])
// 复制内容
const onCopy = (id: string) => {
  // 设置系统剪贴板的内容
  uni.setClipboardData({ data: id })
}
// 获取会员信息
const memberStore = useMemberStore()

// 请求参数
const queryParams: Required<PageParams> = {
  page: 1,
  pageSize: 10,
}

// 获取订单列表
const orderList = ref<BlindBoxOrderItem[]>([])
// 是否加载中标记，用于防止滚动触底触发多次请求
const isLoading = ref(false)
// 是否分页结束
const isFinish = ref(false)
// 是否触发下拉刷新
const isTriggered = ref(false)
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
  const res = await getAgentOrderListAPI(queryParams)
  // 发送请求后，重置标记
  isLoading.value = false
  // 数组追加
  orderList.value.push(...res.data.items)
  console.log(res.data)
  // 分页条件
  var pages = Math.ceil(Number(res.data.counts) / Number(queryParams.pageSize))
  //console.log(pages)
  if (queryParams.page < pages) {
    // 页码累加
    queryParams.page++
  } else {
    // 分页已结束
    isFinish.value = true
  }
}

//跳转物流详情
const changeLog = (id: number) => {
  uni.navigateTo({
    url: `/pages/logistics/logistics?id=${id}&type=agent`,
  })
}

//确认收货
const reciveGoods = async (id: number) => {
  uni.showModal({
    content: '为保障您的权益，请收到货并确认无误后，再确认收货',
    success: async (success) => {
      if (success.confirm) {
        const res = await postAgentOrderReceiptByIdAPI(id)
        // 更新订单状态
        onRefresherrefresh()
      }
    },
  })
}

// onMounted(() => {
//   getMemberOrderData()
// })

onShow(async () => {
  queryParams.page = 1
  orderList.value = []
  try {
    if (isFinish.value != undefined && isFinish.value != null) {
      isFinish.value = false
    }
  } catch (error) {
    console.log('isFinish.value is null')
  }
  // 加载数据
  await getMemberOrderData()
})

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
    scroll-y
    class="orders"
    refresher-enabled
    :refresher-triggered="isTriggered"
    @refresherrefresh="onRefresherrefresh"
    @scrolltolower="getMemberOrderData"
  >
    <view class="card" v-for="order in orderList" :key="order.id">
      <!-- 订单信息 -->
      <view class="detail">
        <view class="title">订单信息</view>
        <view class="row">
          <view class="item">
            订单编号: {{ order.order_no }}
            <text class="copy" @tap="onCopy(order.order_no)">复制</text>
          </view>
          <view class="item">时间: {{ timechange(order.verify_time) }}</view>
          <view class="item">收货地址: {{ order.area_info }}</view>
          <view class="item">详细地址: {{ order.address }}</view>
          <view class="item" v-if="order.verify_status == 1"
            >订单状态: {{ orderState[order.order_status] }}</view
          >
        </view>
        <view class="item" v-if="order.verify_status == 0">订单状态: 待审核 </view>
        <view class="item">
          <view class="button" @tap="changeLog(order.id)"> 物流详情 </view>
          <view
            class="button"
            v-if="order.verify_status == 1 && order.order_status == 1"
            @tap="reciveGoods(order.id)"
            >确认收货</view
          >
        </view>
      </view>
    </view>
    <!-- 底部提示文字 -->
    <view class="loading-text" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
      {{ isFinish ? '没有更多数据~' : '正在加载...' }}
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
    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      .button {
        margin: 0 30rpx 0 0rpx;
        width: 240rpx;
        height: 60rpx;
        background-color: #799732;
        color: #fff;
        text-align: center;
        line-height: 60rpx;
        border-radius: 10rpx;
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
