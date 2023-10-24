<script setup lang="ts">
import { getHomeGoodsGuessLikeAPI, getHomeSaleGoodsAPI } from '@/services/home'

import type { PageParams } from '@/types/global'
import type { SaleGoodsItem } from '@/types/home'

import { onMounted, ref } from 'vue'

// 分页参数
const pageParams: Required<PageParams> = {
  page: 1,
  pageSize: 10,
}
// 猜你喜欢的列表
const guessList = ref<SaleGoodsItem[]>([])

//const saleItem = ref<SaleItem>()

// 接收页面参数
const query = defineProps<{
  name: string
}>()

// 已结束标记
const finish = ref(false)
// 获取猜你喜欢数据
const getHomeSaleGoodsData = async () => {
  console.log(query.name)
  // 退出分页判断
  if (finish.value === true) {
    return uni.showToast({ icon: 'none', title: '没有更多数据~' })
  }
  var data = {
    page: pageParams.page,
    pageSize: pageParams.pageSize,
    goods_type: 0,
  }
  const res = await getHomeGoodsGuessLikeAPI(data)
  // guessList.value = res.result.items
  // 数组追加
  console.log(pageParams.page, res.data)
  guessList.value.push(...res.data.items)
  // 分页条件
  var pages = Math.ceil(Number(res.data.counts) / Number(pageParams.pageSize))
  console.log(pages)
  if (pageParams.page < pages) {
    // 页码累加
    pageParams.page++
  } else {
    finish.value = true
  }
}
// 重置数据
const resetData = () => {
  console.log('开始调用')
  pageParams.page = 1
  guessList.value = []
  finish.value = false
}
// 组件挂载完毕
onMounted(() => {
  // getHomeSaleById()
  getHomeSaleGoodsData()
})
// 暴露方法
defineExpose({
  resetData,
  getMore: getHomeSaleGoodsData,
})
</script>

<template>
  <!-- 猜你喜欢 -->
  <view class="caption">
    <text class="text">{{ query?.name ? query?.name : '抢购专场' }}</text>
  </view>
  <view class="guess">
    <navigator
      class="guess-item"
      v-for="item in guessList"
      :key="item.id"
      :url="`/pages/goods/goods?id=${item.id}&cart_type=1`"
    >
      <image class="image" mode="aspectFill" :src="item.goods_master_image"></image>
      <!-- <swiper @change="onChange" circular>
       <swiper-item v-for="item in goods?.mainPictures" :key="item">
         <image class="image" @tap="onTapImage(item)" mode="aspectFill" :src="item" />
       </swiper-item>
     </swiper> -->
      <view class="name"> {{ item.goods_name }} </view>
      <view class="price">
        <text class="small">¥</text>
        <text>{{ item.goods_price }}</text>
        <text class="small1" v-if="item.goods_stock == 0">已售罄</text>
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
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 35rpx;
  .guess-item {
    width: 335rpx;
    padding: 0rpx 0rpx 20rpx;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
    overflow: hidden;
    background-color: #fff;
  }
  .image {
    width: 335rpx;
    height: 304rpx;
  }
  .name {
    height: 45rpx;
    margin: 10rpx 0;
    padding-left: 20rpx;
    font-size: 26rpx;
    color: #262626;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .price {
    line-height: 1;
    padding-left: 20rpx;
    padding-top: 4rpx;
    color: #cf4444;
    font-size: 26rpx;
  }
  .small {
    font-size: 80%;
  }
  .small1 {
    font-size: 80%;
    margin: 0 0 0 80rpx;
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
