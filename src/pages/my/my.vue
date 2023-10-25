<script setup lang="ts">
import { useGuessList } from '@/composables'
import { useMemberStore } from '@/stores'
import { postLogoutAPI } from '@/services/login'
import { ref, computed } from 'vue'
import type { MyOrderResult } from '@/types/home'
import { getMyOrderResultAPI } from '@/services/home'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getCouponByTypeAPI } from '@/services/coupon'
import type { CouponResult, CouponListParams } from '@/types/coupon'
import type { CommissionResult } from '@/types/commission'
import { queryMyCommission } from '@/services/commission'
import { phoneNumShow } from '@/utils/timechange'

// 计算属性截取字符串
// const phoneFomat = computed({
// 	get: () => {
// 		return memberStore.profile.mobile.slice(0, 3) + "****" + memberStore.profile.mobile.slice(7, 11);
// 	},
// 	set: (value) => {
// 		console.log(value)
// 	}
// })
const commissionRes = ref<CommissionResult>()
const getHomeBannerData = async () => {
  const res = await queryMyCommission()
  commissionRes.value = res.data
}
const queryParams: Required<CouponListParams> = {
  page: 1,
  pageSize: 10,
  status: 0,
}

const myzkjResutl = ref<CouponList>()
const getHomeGoodsGuessLikeData = async () => {
  // 退出分页判断
  const res = await getCouponByTypeAPI(queryParams)
  // guessList.value = res.result.items
  // 数组追加
  // 分页条件
  myzkjResutl.value = res.data
}
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
// 订单选项
// 待支付  已支付  代发货  寄售中  待收货
const orderTypes = [
  { type: '1', text: '待支付', icon: 'icon-currency' },
  { type: '4', text: '已支付', icon: 'icon-comment' },
  { type: '5', text: '待发货', icon: 'icon-gift' },
  { type: '6', text: '待收货', icon: 'icon-check' },
]

const buyTypes = [
  { type: '1', text: '我的仓库', icon: 'icon-cangku' },
  { type: '2', text: '确认付款', icon: 'icon-pay' },
  { type: '3', text: '确认收货', icon: 'icon-shou' },
  { type: '4', text: '已完成', icon: 'icon-success' },
]

const sellTypes = [
  { type: '0', text: '全部', icon: 'icon-success' },
  { type: '1', text: '待支付', icon: 'icon-cangku' },
  { type: '3', text: '待确认', icon: 'icon-pay' },
  { type: '5', text: '待发货', icon: 'icon-shou' },
  // { type: '7', text: '已完成', icon: 'icon-success' },
]

// 获取会员信息
const memberStore = useMemberStore()
/**
 * 订单统计
 */
const myOrderResutl = ref<MyOrderResult>()
const getMyOrderResult = async () => {
  const res = await getMyOrderResultAPI()
  myOrderResutl.value = res.data
}
// 退出登录
const onLogout = () => {
  // 模态弹窗
  uni.showModal({
    content: '是否退出登录？',
    success: (res) => {
      if (res.confirm) {
        postLogoutAPI()
        // 清理用户信息
        memberStore.clearProfile()
        // 返回上一页
        uni.navigateBack()
      }
    },
  })
}
onShow(() => {
  getMyOrderResult()
})
onLoad(async () => {
  await getHomeGoodsGuessLikeData()
  await getHomeBannerData()
})
const { guessRef, onScrolltolower } = useGuessList()
</script>

<template>
  <scroll-view enable-back-to-top @scrolltolower="onScrolltolower" class="viewport" scroll-y>
    <!-- 个人资料 -->
    <view class="profile" :style="{ paddingTop: safeAreaInsets!.top + 'px' }">
      <!-- 情况1：已登录 -->
      <view class="overview" v-if="memberStore.profile">
        <navigator url="/pagesMember/profile/profile" hover-class="none">
          <image class="avatar" :src="memberStore.profile.avatar" mode="aspectFill"></image>
        </navigator>
        <view class="meta">
          <view class="nickname">
            {{ memberStore.profile.nickname || memberStore.profile.mobile }}
          </view>
          <text class="update">{{ phoneNumShow(memberStore.profile.mobile) }}</text>
        </view>
      </view>
      <!-- 情况2：未登录 -->
      <view class="overview" v-else>
        <navigator url="/pages/login/login" hover-class="none">
          <image
            class="avatar gray"
            mode="aspectFill"
            src="http://yjy-xiaotuxian-dev.oss-cn-beijing.aliyuncs.com/picture/2021-04-06/db628d42-88a7-46e7-abb8-659448c33081.png"
          >
          </image>
        </navigator>
        <view class="meta">
          <navigator url="/pages/login/login" hover-class="none" class="nickname">
            未登录
          </navigator>
          <view class="extra">
            <text class="tips">点击登录账号</text>
          </view>
        </view>
      </view>
      <!-- <navigator class="settings" url="/pagesMember/settings/settings" hover-class="none">
        设置
      </navigator> -->

      <navigator class="extra" url="/pagesMember/profile/profile" hover-class="none">
        <view class="settings" v-if="memberStore.profile">
          <!-- <view @tap="onLogout" class="button">退出登录</view> -->
          <image class="memberSetIcon" src="../../static/icon/set_icon.png" mode="widthFix"></image>
        </view>
      </navigator>
    </view>
    <view class="infos">
      <view class="infos-list">
        <navigator url="/pages/commission/commission" hover-class="none">
          <view class="info-number">
            {{ commissionRes?.score }}
          </view>
          <view class="text">积分</view>
        </navigator>
      </view>
      <view class="infos-list">
        <navigator url="/pages/earnings/earnings" hover-class="none">
          <view class="info-number">
            {{ commissionRes?.total_money }}
          </view>
          <view class="text">收益</view>
        </navigator>
      </view>
      <view class="infos-list">
        <navigator url="/pages/commission/commission" hover-class="none">
          <view class="info-number">
            {{ commissionRes?.money }}
          </view>
          <view class="text">佣金</view>
        </navigator>
      </view>
      <view class="infos-list">
        <navigator url="/pages/coupon/coupon?type=0" hover-class="none" class="item arrow">
          <view class="info-number">
            {{ myzkjResutl ? myzkjResutl.counts : 0 }}
          </view>
          <view class="text">抵扣券</view>
        </navigator>
      </view>
    </view>

    <!-- 我的订单 -->
    <view class="orders">
      <view class="title">
        我的订单
        <navigator class="navigator" url="/pagesOrder/list/list?type=0" hover-class="none">
          查看全部订单<text class="icon-right"></text>
        </navigator>
      </view>
      <view class="section">
        <navigator
          :key="orderTypes[0].type"
          url="/pagesOrder/list/list?type=0"
          class="navigator"
          hover-class="none"
        >
          <uni-badge class="uni-badge-left-margin" text="" absolute="rightTop" size="small">
            <image
              class="order-icon"
              src="../../../src/static/icon/all_order.png"
              mode="widthFix"
            ></image>
            全部
          </uni-badge>
        </navigator>
        <navigator
          :key="orderTypes[0].type"
          :url="`/pagesOrder/list/list?type=${orderTypes[0].type}`"
          class="navigator"
          hover-class="none"
        >
          <uni-badge
            class="uni-badge-left-margin"
            :text="myOrderResutl?.buyer.wait_count"
            absolute="rightTop"
            size="small"
          >
            <image
              class="order-icon"
              src="../../../src/static/icon/not_order.png"
              mode="widthFix"
            ></image>

            {{ orderTypes[0].text }}
          </uni-badge>
        </navigator>
        <navigator
          :key="orderTypes[1].type"
          :url="`/pagesOrder/list/list?type=${orderTypes[1].type}`"
          class="navigator"
          hover-class="none"
        >
          <uni-badge
            class="uni-badge-left-margin"
            :text="myOrderResutl?.buyer.success_count"
            absolute="rightTop"
            size="small"
          >
            <image
              class="order-icon"
              src="../../../src/static/icon/suc_order.png"
              mode="widthFix"
            ></image>

            {{ orderTypes[1].text }}
          </uni-badge>
        </navigator>
        <navigator
          :key="orderTypes[2].type"
          :url="`/pagesOrder/list/list?type=${orderTypes[2].type}`"
          class="navigator"
          hover-class="none"
        >
          <uni-badge
            class="uni-badge-left-margin"
            :text="myOrderResutl?.buyer.delivery_count"
            absolute="rightTop"
            size="small"
          >
            <image
              class="order-icon"
              src="../../../src/static/icon/not_material_order.png"
              mode="widthFix"
            >
            </image>

            {{ orderTypes[2].text }}
          </uni-badge>
        </navigator>
        <navigator
          :key="orderTypes[3].type"
          :url="`/pagesOrder/list/list?type=${orderTypes[3].type}`"
          class="navigator"
          hover-class="none"
        >
          <uni-badge
            class="uni-badge-left-margin"
            :text="myOrderResutl?.buyer.received_count"
            absolute="rightTop"
            size="small"
          >
            <image
              class="order-icon"
              src="../../../src/static/icon/material_order.png"
              mode="widthFix"
            ></image>

            {{ orderTypes[3].text }}
          </uni-badge>
        </navigator>
        <!-- 客服 -->

        <!-- <button class="contact icon-handset" open-type="contact">售后</button> -->
      </view>
    </view>

    <!-- 买方 -->
    <!-- <view class="orders">
      <view class="title">
        买方
        <navigator class="navigator" url="/pagesOrder/list/list?type=0" hover-class="none">
          查看全部<text class="icon-right"></text>
        </navigator>
      </view>
      <view class="section">
        <navigator
          v-for="item in buyTypes"
          :key="item.type"
          :class="item.icon"
          :url="`/pagesOrder/list/list?type=${item.type}`"
          class="navigator"
          hover-class="none"
        >
          {{ item.text }}
        </navigator>
      </view>
    </view> -->

    <!-- 卖方 -->
    <view class="orders">
      <view class="title">
        寄售订单
        <!-- <navigator class="navigator" url="/pagesOrder/list/list?type=0" hover-class="none">
          查看全部<text class="icon-right"></text>
        </navigator> -->
      </view>
      <view class="section">
        <!-- 订单 -->
        <!-- <navigator
          v-for="item in sellTypes"
          :key="item.type"
          :class="item.icon"
          :url="`/pagesOrder/list/sellerlist?type=${item.type}`"
          class="navigator"
          hover-class="none"
        >
          <uni-badge class="uni-badge-left-margin" :text="'0'" absolute="rightTop" size="small">
            {{ item.text }}
          </uni-badge>
        </navigator> -->
        <navigator
          :key="sellTypes[0].type"
          :url="`/pagesOrder/list/sellerlist?type=${sellTypes[0].type}`"
          class="navigator"
          hover-class="none"
        >
          <uni-badge class="uni-badge-left-margin" text="" absolute="rightTop" size="small">
            <image
              class="order-icon"
              src="../../../src/static/icon/all_order.png"
              mode="widthFix"
            ></image>

            {{ sellTypes[0].text }}
          </uni-badge>
        </navigator>
        <navigator
          :key="sellTypes[1].type"
          :url="`/pagesOrder/list/sellerlist?type=${sellTypes[1].type}`"
          class="navigator"
          hover-class="none"
        >
          <uni-badge
            class="uni-badge-left-margin"
            :text="myOrderResutl?.seller.wait_count"
            absolute="rightTop"
            size="small"
          >
            <image
              class="order-icon"
              src="../../../src/static/icon/not_order.png"
              mode="widthFix"
            ></image>

            {{ sellTypes[1].text }}
          </uni-badge>
        </navigator>
        <navigator
          :key="sellTypes[2].type"
          :url="`/pagesOrder/list/sellerlist?type=${sellTypes[2].type}`"
          class="navigator"
          hover-class="none"
        >
          <uni-badge
            class="uni-badge-left-margin"
            :text="myOrderResutl?.seller.confirm_count"
            absolute="rightTop"
            size="small"
          >
            <image
              class="order-icon"
              src="../../../src/static/icon/suc_order.png"
              mode="widthFix"
            ></image>

            {{ sellTypes[2].text }}
          </uni-badge>
        </navigator>
        <navigator
          :key="sellTypes[3].type"
          :url="`/pagesOrder/list/sellerlist?type=${sellTypes[3].type}`"
          class="navigator"
          hover-class="none"
        >
          <uni-badge
            class="uni-badge-left-margin"
            :text="myOrderResutl?.seller.delivery_count"
            absolute="rightTop"
            size="small"
          >
            <image
              class="order-icon"
              src="../../../src/static/icon/material_order.png"
              mode="widthFix"
            ></image>

            {{ sellTypes[3].text }}
          </uni-badge>
        </navigator>
        <navigator
          :key="sellTypes[0].type"
          :url="`/pagesOrder/list/sellerlist?type=${sellTypes[0].type}`"
          class="navigator"
          hover-class="none"
        >
          <uni-badge class="uni-badge-left-margin" text="" absolute="rightTop" size="small">
            <image
              class="order-icon"
              src="../../../src/static/icon/js_suc_order.png"
              mode="widthFix"
            ></image>

            已完成
          </uni-badge>
        </navigator>
      </view>
    </view>

    <view class="fenge"></view>

    <view class="main-list">
      <view class="list">
        <image src="../../static/icon/addr_icon.png" class="list-icon" mode="widthFix"></image>
        <navigator url="/pagesMember/address/address" hover-class="none" class="item arrow">
          我的地址
        </navigator>
      </view>

      <view class="list">
        <image src="../../static/icon/team_icon.png" class="list-icon" mode="widthFix"></image>
        <navigator url="/pages/myteam/myteam" hover-class="none" class="item arrow">
          我的团队
        </navigator>
      </view>
      <view class="list">
        <image src="../../static/icon/invite_icon.png" class="list-icon" mode="widthFix"></image>
        <navigator url="/pages/inviteCode/inviteCode" hover-class="none" class="item arrow">
          邀请好友
        </navigator>
      </view>
      <view class="list">
        <image src="../../static/icon/way_icon.png" class="list-icon" mode="widthFix"></image>
        <navigator
          url="/pagesMember/payAddress/payAddress?type=1"
          hover-class="none"
          class="item arrow"
        >
          收款方式
        </navigator>
      </view>
      <view class="list">
        <image src="../../static/icon/us_icon.png" class="list-icon" mode="widthFix"></image>
        <navigator url="/pages/about/about" hover-class="none" class="item arrow">
          关于我们
        </navigator>
      </view>
      <!-- <view class="list">
				<image src="../../static/icon/password_icon.png" class="list-icon" mode="widthFix"></image>
				<navigator url="/pages/setPwd/setPwd" hover-class="none" class="item arrow">
					二级密码
				</navigator>
			</view> -->
    </view>
    <!-- <view class="fenge"></view>
		<view class="main-list">
			<view class="list">
				<navigator url="/pages/commission/commission" hover-class="none" class="item arrow">
					我的佣金
				</navigator>
			</view>
			<view class="list">
				<navigator url="/pagesMember/payAddress/payAddress?type=1" hover-class="none" class="item arrow">
					收款方式
				</navigator>
			</view>
			<view class="list">
				<navigator url="/pages/earnings/earnings" hover-class="none" class="item arrow">
					我的收益
				</navigator>
			</view>

			<view class="fenge"></view>
			<view class="list">
				<navigator url="/pages/myteam/myteam" hover-class="none" class="item arrow">
					我的团队
				</navigator>
			</view>
			<view class="list">
				<navigator url="/pages/setPwd/setPwd" hover-class="none" class="item arrow">
					二级密码
				</navigator>
			</view>
			<view class="list">
				<navigator url="/pages/about/about" hover-class="none" class="item arrow">
					关于我们
				</navigator>
			</view>
			<view class="list">
				<navigator url="/pages/coupon/coupon?type=0" hover-class="none" class="item arrow">
					我的抵扣券
				</navigator>
			</view>
		</view> -->
    <!-- <view class="list" v-if="memberStore.profile?.group_id == 3">
      <navigator url="/pages/change/change" hover-class="none" class="item arrow">
        交易管理
      </navigator>
    </view> -->
    <!--    <view class="list1" v-if="memberStore.profile">
        <navigator url="/pagesMember/address/address" hover-class="none" class="icon-cangku">
          我的收货地址
        </navigator>
    </view> -->

    <!-- 猜你喜欢 -->
    <!-- <view class="guess">
      <XtxGuess ref="guessRef" />
    </view> -->
  </scroll-view>
</template>

<style lang="scss">
page {
  height: 100%;
  padding-top: 50rpx;
  overflow: hidden;
  background-image: linear-gradient(to right, #ffffff, #e9efeb, #d2e3d8);
}

.viewport {
  height: 100%;
  background-repeat: no-repeat;
  // background-image: url(../../static/images/center_bg.png);
  background-size: 100% auto;
}

/* 列表 */
.main-list {
  padding: 0 20rpx;
  background-color: #fff;
  margin: 0rpx 20rpx 0;
  border-radius: 10rpx;

  .list {
    display: flex;
    align-items: center;
    line-height: 100rpx;
    .list-icon {
      width: 36rpx;
      height: 36rpx;
      margin-left: 20rpx;
      margin-right: 10rpx;
    }

    .item {
      width: 600rpx;
      line-height: 90rpx;
      padding-left: 10rpx;
      font-size: 30rpx;
      color: #333;
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
}

.fenge {
  margin: 40rpx 0rpx 0;
}

.infos {
  display: flex;
  margin: 40rpx 0rpx 40rpx;
  justify-content: space-around;

  .infos-list {
    text-align: center;

    .text {
      margin-top: 10rpx;
      font-size: 24rpx;
    }
  }
}

/* 用户信息 */
.profile {
  margin-top: 20rpx;
  position: relative;

  .overview {
    display: flex;
    height: 120rpx;
    padding: 0 36rpx;
    color: #000;
  }

  .avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background-color: #eee;
  }

  .gray {
    filter: grayscale(100%);
  }

  .meta {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    line-height: 30rpx;
    padding: 16rpx 0;
    margin-left: 20rpx;
  }

  .nickname {
    max-width: 180rpx;
    margin-bottom: 16rpx;
    font-size: 30rpx;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .extra {
    display: flex;
    font-size: 24rpx;
  }

  .tips {
    font-size: 22rpx;
  }

  .update {
    padding: 3rpx 0rpx 1rpx;
    color: #000;
    border: 1rpx solid rgba(255, 255, 255, 0.8);
    margin-right: 10rpx;
    border-radius: 30rpx;
  }

  .settings {
    position: absolute;
    bottom: 50rpx;
    right: 60rpx;
    font-size: 30rpx;
    color: #000000;

    .memberSetIcon {
      width: 40rpx;
    }
  }
}

/* 我的订单 */
.orders {
  position: relative;
  z-index: 99;
  padding: 30rpx;
  margin: 20rpx 20rpx 0;
  background-color: #fff;
  border-radius: 10rpx;
  box-shadow: 0 10rpx 6rpx 16rpx rgba(240, 240, 240, 0.6);

  .title {
    height: 40rpx;
    line-height: 40rpx;
    font-size: 28rpx;
    color: #1e1e1e;

    .navigator {
      font-size: 24rpx;
      color: #939393;
      float: right;
    }
  }

  .section {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 40rpx 20rpx 10rpx;

    .navigator,
    .contact {
      text-align: center;
      font-size: 24rpx;
      color: #333;

      &::before {
        display: block;
        font-size: 60rpx;
        color: #ff9545;
      }

      &::after {
        border: none;
      }
    }

    .uni-badge-left-margin {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      height: 90rpx;
      .order-icon {
        width: 40rpx !important;
        padding-bottom: 15rpx;
      }
    }

    .contact {
      padding: 0;
      margin: 0;
      border: 0;
      background-color: transparent;
      line-height: inherit;
    }
  }
}

/* 猜你喜欢 */
.guess {
  background-color: #f7f7f8;
  margin-top: 20rpx;
}
</style>
