<script setup lang="ts">
import { getCouponByTypeAPI } from '@/services/coupon'
import type { PageParams } from '@/types/global'
import type { CouponResult, CouponListParams } from '@/types/coupon'
import { onMounted, ref } from 'vue'
import { useCouponStore } from '@/stores/modules/address'
import { timechange } from '@/utils/timechange'

// 定义 porps
const props = defineProps<{
  couponState: number
}>()

// 请求参数
const queryParams: Required<CouponListParams> = {
  page: 1,
  pageSize: 10,
  status: props.couponState,
}
// 猜你喜欢的列表
const guessList = ref<CouponResult[]>([])
// 已结束标记
const finish = ref(false)
// 获取猜你喜欢数据
const getHomeGoodsGuessLikeData = async () => {
  // 退出分页判断
  if (finish.value === true) {
    return uni.showToast({ icon: 'none', title: '没有更多数据~' })
  }
  const res = await getCouponByTypeAPI(queryParams)
  // guessList.value = res.result.items
  // 数组追加
  guessList.value.push(...res.data.items)
  // 分页条件
  var pages = Math.ceil(Number(res.data.counts) / Number(queryParams.pageSize))
  console.log(pages)
  if (queryParams.page < pages) {
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
// 修改收货地址
const onChangeAddress = (item: CouponResult) => {
  if (item.status === 2) {
    uni.showToast({ icon: 'none', title: '该抵扣券已过期' })
  } else if (item.status === 1) {
    uni.showToast({ icon: 'none', title: '该抵扣券已使用' })
  } else {
    // 修改地址
    const addressStore = useCouponStore()
    addressStore.changeSelectedCoupon(item)
    // 返回上一页
    uni.navigateBack()
  }
}
</script>

<template>
  <!-- 猜你喜欢 -->
  <view class="guess">
    <navigator class="guess-item" v-for="item in guessList" :key="item.id">
      <view class="image" @tap="onChangeAddress(item)">
        <view class="image1">
          <!-- 文字竖排 -->
          <view class="name0"> ¥{{ item.coupon.dec_price }}</view>
          <view class="name">
            <view class="name1"> 满{{ item.coupon.dec_price }}减{{ item.coupon.dec_price }}</view>
            <view class="name2">
              {{ timechange(item.create_time) }} - {{ timechange(item.expire_time) }}</view
            >
          </view>
        </view>
        <view class="price"> 立减{{ item.coupon.dec_price }}</view>
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
      background-image: url(@/static/images/bubble.png);
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
    padding: 24rpx 0rpx 20rpx;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
    overflow: hidden;
    background-color: #fff;
  }
  .image {
    width: 750rpx;
    height: 200rpx;
    background-image: url(@/static/images/coupon.png);
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    .image1 {
      width: 70%;
      display: flex;
      .name0 {
        width: 50%;
        font-size: 40rpx;
        color: #fff;
        margin-right: 20rpx;
        text-align: center;
      }
      .name {
        display: flex;
        flex-direction: column;
        //writing-mode: vertical-rl;
        text-align: center;
        .name1 {
          font-size: 20rpx;
          color: #fff;
        }
        .name2 {
          font-size: 20rpx;
          color: #fff;
        }
      }
    }
    .price {
      width: 30%;
      font-size: 20rpx;
      //文字竖排
      writing-mode: vertical-rl;
      text-align: center;

      color: #fff;
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
