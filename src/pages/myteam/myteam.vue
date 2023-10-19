<script setup lang="ts">
import { getAchievementAll, queryMyReferrer, queryMyTeam } from '@/services/myteam'
import type { PageParams } from '@/types/global'
import { ref } from 'vue'
import { phoneNumShow } from '@/utils/timechange'
import { onLoad } from '@dcloudio/uni-app'
// 请求参数
const queryParams: Required<PageParams> = {
  page: 1,
  pageSize: 15,
}

const achievementResult = ref<string>()
//获取收益数据
const getEarningsData = async () => {
  const res = await getAchievementAll()
  achievementResult.value = res.data
}

const teamResult = ref<number>()
//获取收益数据
const getTeamData = async () => {
  const res = await queryMyReferrer()
  teamResult.value = res.data
}

// 猜你喜欢的列表
const guessList = ref<{ id: number; mobile: string; nickname: string }[]>([])
// 已结束标记
const finish = ref(false)
// 获取猜你喜欢数据
const getHomeGoodsGuessLikeData = async () => {
  // 退出分页判断
  if (finish.value === true) {
    return uni.showToast({ icon: 'none', title: '没有更多数据~' })
  }
  const res = await queryMyTeam(queryParams)
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
onLoad(async () => {
  await getEarningsData()
  await getTeamData()
  await getHomeGoodsGuessLikeData()
})
// 暴露方法
defineExpose({
  resetData,
  getMore: getHomeGoodsGuessLikeData,
})
</script>

<template>
  <view class="caption">
    <view class="caption_item">
      <view class="text1">{{ achievementResult }}</view>
      <view class="text">团队总业绩</view>
    </view>
    <view class="caption_item">
      <view class="text1">{{ teamResult }}</view>
      <view class="text">团队有效人数</view>
    </view>
  </view>
  <view class="fenge">
    <view class="text">会员列表</view>
  </view>
  <!-- 猜你喜欢 -->
  <view class="guess">
    <navigator
      class="guess-item"
      v-for="item in guessList"
      :key="item.id"
      :url="'/pages/myteam/allteams?user_id=' + item.id"
    >
      <view class="image">
        <view class="image3">
          <!-- <image class="image4" src="@/static/images/item.png" /> -->
        </view>
        <view class="image1">
          <!-- <view class="text1"> 平台交易 </view> -->
          <view class="text2"> {{ item.nickname }} </view>
        </view>
        <view class="image2">
          <view class="text3"> {{ phoneNumShow(item.mobile) }}</view>
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
  background-image: url(@/static/images/earnings.png);
  background-size: cover;
  .caption_item {
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .text {
      font-size: 20rpx;
      color: #799372;
      padding: 20rpx 0 0;
    }
    .text1 {
      font-size: 32rpx;
      color: #799372;
    }
  }
}
.fenge {
  display: flex;
  justify-content: center;
  line-height: 1;
  padding: 36rpx 0 40rpx;
  font-size: 32rpx;
  .text {
    font-size: 28rpx;
    color: #799372;
    padding: 20rpx 0 0;
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
    height: 80rpx;
    padding: 20rpx 0rpx 0rpx 0;
    background-color: #f3f3f3;
    //background-image: url(@/static/images/Earnings.png);
    background-size: cover;
    display: flex;
    align-items: center;
    //justify-content: center;
    .image2 {
      width: 100%;
      height: 100%;
      .text3 {
        width: 100%;
        text-align: center;
        font-size: 20rpx;
        color: #799372;
        padding-right: 50rpx;
      }
    }
    .image1 {
      width: 100%;
      height: 100%;
      .text2 {
        width: 100%;
        text-align: center;
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
