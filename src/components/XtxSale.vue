<script setup lang="ts">
import { getHomeSaleAPI } from '@/services/home'
import type { PageParams } from '@/types/global'
import type { SaleItem } from '@/types/home'
import { onMounted, ref } from 'vue'

// 分页参数
const pageParams: Required<PageParams> = {
  page: 1,
  pageSize: 10,
}
// 猜你喜欢的列表
const guessList = ref<SaleItem[]>([])
// 已结束标记
const finish = ref(false)
// 获取猜你喜欢数据
const getHomeSaleData = async () => {
  // 退出分页判断
  if (finish.value === true) {
    return uni.showToast({ icon: 'none', title: '没有更多数据~' })
  }
  const res = await getHomeSaleAPI(pageParams)
  // 数组追加
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
  pageParams.page = 1
  guessList.value = []
  finish.value = false
}
// 组件挂载完毕
onMounted(() => {
  getHomeSaleData()
})
// 暴露方法
defineExpose({
  resetData,
  getMore: getHomeSaleData,
})
</script>

<template>
  <!-- 猜你喜欢 -->
  <view class="caption">
    <text class="text">抢购专场</text>
  </view>
  <view class="guess">
    <navigator
      class="guess-item"
      v-for="item in guessList"
      :key="item.id"
      :url="`/pages/sale/saleGoods?name= ${item.name}`"
    >
      <!--:url="`/pages/goods/goods?id=${item.id}`" -->
      <view class="image">
        <view class="image1">
          <view class="name"> {{ item.name }} </view>
          <view class="price">
            <!-- <text class="small">¥</text> -->
            <text>开抢时间:{{ item.start_time }} - {{ item.end_time }}</text>
          </view>
        </view>
      </view>
      <!-- <swiper @change="onChange" circular>
       <swiper-item v-for="item in goods?.mainPictures" :key="item">
         <image class="image" @tap="onTapImage(item)" mode="aspectFill" :src="item" />
       </swiper-item>
     </swiper> -->
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
    padding: 0rpx 0rpx 0rpx;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
    overflow: hidden;
    background-color: #fff;
  }
  .image {
    width: 750rpx;
    height: 400rpx;
    background-image: url(@/static/images/sale.png);
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    .image1 {
      .name {
        height: 75rpx;
        margin-top: 100rpx;
        font-size: 42rpx;
        color: #ffffff;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-align: center;
      }
      .price {
        line-height: 1;
        padding-top: 4rpx;
        color: #ffffff;
        font-size: 26rpx;
        text-align: center;
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
