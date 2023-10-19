<script setup lang="ts">
import { useGuessList } from '@/composables'
import { useMemberStore } from '@/stores'
import { ref } from 'vue'
import type { CommissionResult } from '@/types/commission'
import { queryMyCommission } from '@/services/commission'
import { onLoad } from '@dcloudio/uni-app'
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

const memberStore = useMemberStore()
// 获取轮播图数据
const commissionRes = ref<CommissionResult>()
const getHomeBannerData = async () => {
  const res = await queryMyCommission()
  commissionRes.value = res.data
}

onLoad(async () => {
  await getHomeBannerData()
})

const { guessRef, onScrolltolower } = useGuessList()
</script>

<template>
  <scroll-view enable-back-to-top @scrolltolower="onScrolltolower" class="viewport" scroll-y>
    <!-- 我的佣金 -->
    <view class="profile">
      <view class="components">
        <view class="toplist">
          <view class="topitem">
            <view class="topitem_1">
              <text> 我的佣金 </text>
            </view>
            <view class="topitem_2">
              <text> {{ commissionRes?.money }} </text>
            </view>
          </view>
          <view class="topitem">
            <view class="topitem_1">
              <text> 我的积分 </text>
            </view>
            <view class="topitem_2">
              <text>{{ commissionRes?.score }} </text>
            </view>
          </view>
        </view>
        <view class="bottomlist">
          <view class="bottomitem">
            <view class="bottomitem_1">
              <text>{{ commissionRes?.today_money }}</text>
            </view>
            <view class="bottomitem_2">
              <text> 今日获得佣金 </text>
            </view>
          </view>
          <view class="bottomitem">
            <view class="bottomitem_1">
              <text> {{ commissionRes?.total_money }} </text>
            </view>
            <view class="bottomitem_2">
              <text> 累计获得佣金 </text>
            </view>
          </view>
          <view class="bottomitem">
            <view class="bottomitem_1">
              <text> {{ commissionRes?.today_score }} </text>
            </view>
            <view class="bottomitem_2">
              <text> 今日获得积分 </text>
            </view>
          </view>
          <view class="bottomitem">
            <view class="bottomitem_1">
              <text> {{ commissionRes?.total_score }} </text>
            </view>
            <view class="bottomitem_2">
              <text> 累计获得积分 </text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="fenge"></view>
    <view class="list">
      <navigator url="/pages/commission/commissionList" hover-class="none" class="item arrow">
        佣金列表
      </navigator>
    </view>
    <view class="list">
      <navigator url="/pages/commission/commissionLogList" hover-class="none" class="item arrow">
        佣金明细
      </navigator>
    </view>
    <view class="list">
      <navigator url="/pages/commission/scoreLogList" hover-class="none" class="item arrow">
        积分明细
      </navigator>
    </view>
    <!-- <view class="list">
      <navigator url="/pages/commission/content" hover-class="none" class="item arrow">
        分销说明
      </navigator>
    </view> -->
  </scroll-view>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  background-color: #f7f7f8;
}

.viewport {
  height: 100%;
  background-repeat: no-repeat;
  //background-image: url(../../static/images/center_bg.png);
  background-size: 100% auto;
}
.fenge {
  margin: 40rpx 0rpx 0;
}
/* 用户信息 */
.profile {
  margin: 20rpx 0;
  position: relative;
  align-items: center;
  height: 400rpx;
  .components {
    width: 100%;
    height: 100%;
    .toplist {
      width: 100%;
      height: 60%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .topitem {
        width: 50%;
        height: 100%;
        background-color: #fff;
        margin: 20rpx 20rpx 0;
        .topitem_1 {
          width: 100%;
          height: 20%;
          align-items: center;
          font-size: 20rpx;
          color: #799372;
        }
        .topitem_2 {
          width: 100%;
          height: 80%;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          font-size: 60rpx;
          color: #799372;
        }
      }
    }
    .bottomlist {
      width: 100%;
      height: 40%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .bottomitem {
        width: 25%;
        height: 80%;
        background-color: #fff;
        margin: 5rpx 5rpx 0;
        .bottomitem_1 {
          width: 100%;
          height: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          font-size: 36rpx;
          color: #799372;
        }
        .bottomitem_2 {
          width: 100%;
          height: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          font-size: 18rpx;
          color: #799372;
        }
      }
    }
  }
}
/* 列表 */
.list {
  padding: 0 20rpx;
  background-color: #fff;
  margin: 0rpx 20rpx 0;
  border-radius: 10rpx;
  .item {
    line-height: 90rpx;
    padding-left: 10rpx;
    font-size: 30rpx;
    color: #799372;
    border-top: 1rpx solid #ddd;
    position: relative;
    text-align: left;
    border-radius: 0;
    background-color: #fff;
    &::after {
      width: auto;
      height: auto;
      left: auto;
      border: none;
    }
    &:first-child {
      border: none;
    }
    &::after {
      right: 5rpx;
    }
  }
  .arrow::after {
    content: '\e6c2';
    position: absolute;
    top: 50%;
    color: #ccc;
    font-family: 'erabbit' !important;
    font-size: 32rpx;
    transform: translateY(-50%);
  }
}
.fenge {
  margin: 40rpx 0rpx 0;
}
</style>
