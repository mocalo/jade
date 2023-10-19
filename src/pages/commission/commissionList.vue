<script setup lang="ts">
import { queryCommissionLog } from '@/services/commission'
import { getCouponByTypeAPI } from '@/services/coupon'
import type { CommissionLogItem, CommissionResult } from '@/types/commission'
import type { PageParams } from '@/types/global'
import { onMounted, ref } from 'vue'

import { timechange } from '@/utils/timechange'
// 请求参数
const queryParams: Required<PageParams> = {
  page: 1,
  pageSize: 10,
}
// 猜你喜欢的列表
const guessList = ref<CommissionLogItem[]>([])
// 已结束标记
const finish = ref(false)
// 获取猜你喜欢数据
const getHomeGoodsGuessLikeData = async () => {
  // 退出分页判断
  if (finish.value === true) {
    return uni.showToast({ icon: 'none', title: '没有更多数据~' })
  }
  const res = await queryCommissionLog(queryParams)
  // guessList.value = res.result.items
  // 数组追加
  guessList.value.push(...res.data.items)
  // 分页条件
  if (queryParams.page < res.data.page) {
    // 页码累加
    queryParams.page++
  } else {
    finish.value = true
  }
}
// 重置数据
const resetData = () => {
  queryParams.page = 1
  guessList.value = []
  finish.value = false
}
// 组件挂载完毕
onMounted(() => {
  getHomeGoodsGuessLikeData()
})
// 暴露方法
defineExpose({
  resetData,
  getMore: getHomeGoodsGuessLikeData,
})
</script>

<template>
  <!-- 猜你喜欢 -->
  <view class="guess">
    <navigator class="guess-item" v-for="item in guessList" :key="item.id">
      <view class="image">
        <view class="image3">
          <image class="image4" src="@/static/images/item.png" />
        </view>
        <view class="image1">
          <view class="text1"> 平台交易 </view>
          <view class="text2">
            {{ timechange(item.create_time) }}
          </view>
        </view>
        <view class="image2">
          <view class="text3"> <text class="price">总金额</text>{{ item.commission }} </view>
          <view class="text4"> <text class="price">佣金</text>{{ item.money }} </view>
          <view class="text4"><text class="price">积分</text>{{ item.score }}</view>
        </view>
      </view>
    </navigator>
  </view>
  <view class="loading-text">
    {{ finish ? '没有更多数据~' : '正在加载...' }}
  </view>
</template>

<style lang="scss">
:host {
  display: block;
}
/* 分类标题 */
.caption {
  display: flex;
  justify-content: center;
  line-height: 1;
  padding: 36rpx 0 40rpx;
  font-size: 32rpx;
  color: #262626;
  .text {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 28rpx 0 30rpx;

    &::before,
    &::after {
      content: '';
      width: 20rpx;
      height: 20rpx;

      background-size: contain;
      margin: 0 10rpx;
    }
  }
}

/* 猜你喜欢 */
.guess {
  //display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx;
  .guess-item {
    width: 100%;
    padding: 5rpx 0rpx 5rpx;
    border-radius: 10rpx;
    overflow: hidden;
    background-color: #fff;
  }
  .image {
    width: 750rpx;
    height: 100rpx;
    background-color: #f3f3f3;
    //background-image: url(@/static/images/commission.png);
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    .image3 {
      width: 20%;
      height: 100%;
      //background-color: #262626;
      .image4 {
        width: 100rpx;
        height: 100rpx;
      }
    }
    .image2 {
      width: 40%;
      height: 100%;
      .text3 {
        width: 100%;
        text-align: right;
        font-size: 28rpx;
        color: #799372;
        padding-right: 50rpx;
        .price {
          text-align: right;
          font-size: 20rpx;
          color: #799372;
        }
      }
      .text4 {
        width: 100%;
        text-align: right;
        font-size: 20rpx;
        color: #799372;
        padding-right: 50rpx;
        .price {
          text-align: right;
          font-size: 16rpx;
          color: #799372;
        }
      }
    }
    .image1 {
      width: 40%;
      height: 100%;
      .text1 {
        width: 100%;
        text-align: left;
        font-size: 36rpx;
        color: #799372;
      }
      .text2 {
        width: 100%;
        text-align: left;
        font-size: 20rpx;
        color: #799372;
      }
    }
  }
}
// 加载提示文字
.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0;
}
</style>
