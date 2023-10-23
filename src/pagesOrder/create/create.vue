<script setup lang="ts">
import { postMemberOrderAPI } from '@/services/order'
import { useAddressStore, useCouponStore } from '@/stores/modules/address'
import { getGoodsByIdAPI } from '@/services/goods'
import type { GoodsResult } from '@/types/goods'
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import type { SaleItem } from '@/types/home'
import { getHomeSaleAPI } from '@/services/home'
import { phoneNumShow } from '@/utils/timechange'
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
// 页面参数
const query = defineProps<{
  goods_id?: number
  qiang_type?: number
}>()

// 获取商品信息
const orderPre = ref<GoodsResult>()

const getMemberOrderPreData = async () => {
  if (query.goods_id) {
    const res = await getGoodsByIdAPI(query.goods_id)
    orderPre.value = res.data
  } else {
    uni.showToast({ icon: 'none', title: '参数错误' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1000)
  }
}

// //获取抵扣券信息
// const getCoupon = async () => {
//   const res = await getGoodsByIdAPI(query.goods_id)
//   orderPre.value = res.data
// }

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
  const res = await getHomeSaleAPI({
    page: 1,
    pageSize: 1,
  })
  // 数组追加
  guessList.value.push(...res.data.items)
}

onLoad(() => {
  getMemberOrderPreData()
  getHomeSaleData()
})

const addressStore = useAddressStore()
// 收货地址
const selecteAddress = computed(() => {
  return addressStore.selectedAddress
})

const couponStore = useCouponStore()
//抵扣券
const selecteCoupon = computed(() => {
  return couponStore.selectedCoupon
})

// 提交订单
const onOrderSubmit = async () => {
  // 没有收货地址提醒
  if (!selecteAddress.value?.id) {
    return uni.showToast({ icon: 'none', title: '请选择收货地址' })
  }

  // 发送请求
  if (query.qiang_type == 1) {
    if (!selecteCoupon.value?.id) {
      return uni.showToast({ icon: 'none', title: '请选择抵扣券' })
    }
    //获取当前场次
    const res = await postMemberOrderAPI(
      query.goods_id!,
      guessList.value[0].id,
      selecteCoupon.value.id,
    )
    // 关闭当前页面，跳转到订单详情，传递订单id
    uni.redirectTo({ url: `/pagesOrder/detail/detail?id=${res.data.id}` })
  } else {
    const res = await postMemberOrderAPI(query.goods_id!, 0, 0)
    // 关闭当前页面，跳转到订单详情，传递订单id
    uni.redirectTo({ url: `/pagesOrder/detail/detail?id=${res.data.id}` })
  }
}
</script>

<template>
  <scroll-view enable-back-to-top scroll-y class="viewport">
    <!-- 收货地址 -->
    <navigator
      v-if="selecteAddress"
      class="shipment"
      hover-class="none"
      url="/pagesMember/address/address?from=order"
    >
      <view class="user"> {{ selecteAddress.receive_name }} {{ selecteAddress.receive_tel }} </view>
      <view class="address"> {{ selecteAddress.area_info }} {{ selecteAddress.address }} </view>
      <text class="icon icon-right"></text>
    </navigator>
    <navigator
      v-else
      class="shipment"
      hover-class="none"
      url="/pagesMember/address/address?from=order"
    >
      <view class="address"> 请选择收货地址 </view>
      <text class="icon icon-right"></text>
    </navigator>
		
    <!--抵扣券-->
    <view v-if="query.qiang_type == 1">
      <navigator
        v-if="selecteCoupon"
        class="shipment1"
        hover-class="none"
        url="/pages/coupon/coupon?type=0"
      >
        <view class="user"> 立减{{ selecteCoupon.coupon.dec_price }} </view>
        <text class="icon icon-right"></text>
      </navigator>
      <navigator v-else class="shipment1" hover-class="none" url="/pages/coupon/coupon?type=0">
        <view class="address"> 请选择抵扣券 </view>
        <text class="icon icon-right"></text>
      </navigator>
    </view>
		<view class="main">
			<navigator class="guess-item" :url="`/pages/goods/goods?id=${query.goods_id}&cart_type=0`">
			<view class="shop main-list">
				<view class="shop-left">
					<image class="shop-image" :src="orderPre?.goods_master_image" mode="scaleToFill"></image>
				</view>
		
				<view class="shop-right">
					<view class="title">{{ orderPre?.goods_name }} </view>
					<view class="shop-seller"  v-if="orderPre">
						商品归属人:{{ phoneNumShow(orderPre.belongs.mobile) }}</view>
					<view class="shop-price">￥ <text>{{ orderPre?.goods_price }}</text> </view>
				</view>
			</view>
      </navigator>
		</view>
    <!-- 商品信息 -->
    <!-- <view class="guess">
      <navigator class="guess-item" :url="`/pages/goods/goods?id=${query.goods_id}&cart_type=0`">
        <image class="image" mode="aspectFill" :src="orderPre?.goods_master_image"></image>
        
        <view class="name"> {{ orderPre?.goods_name }} </view>
        <view class="name" v-if="orderPre">
          商品归属人:{{ phoneNumShow(orderPre.belongs.mobile) }}
        </view>
        <view class="price">
          <text class="small">¥</text>
          <text>{{ orderPre?.goods_price }}</text>
        </view>
      </navigator>
    </view> -->
  </scroll-view>

  <!-- 吸底工具栏 -->
  <view class="toolbar" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
    <view class="total-pay symbol">
      <text class="number">{{ orderPre?.goods_price }}</text>
    </view>
    <view class="button" :class="{ disabled: !selecteAddress?.id }" @tap="onOrderSubmit">
      提交订单
    </view>
  </view>
</template>

<style lang="scss">
page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background-color: #f4f4f4;
}

.symbol::before {
  content: '¥';
  font-size: 80%;
  margin-right: 5rpx;
}

.shipment {
  margin: 30rpx;
  padding: 30rpx 30rpx 30rpx 84rpx;
  font-size: 26rpx;
  border-radius: 20rpx;
  background: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/locate.png)
    20rpx center / 50rpx no-repeat #fff;
  position: relative;

			box-shadow: 0rpx 10rpx 35rpx 10rpx #f3f3f3;
  .icon {
    font-size: 36rpx;
    color: #333;
    transform: translateY(-50%);
    position: absolute;
    top: 50%;
    right: 20rpx;
  }

  .user {
    color: #333;
    margin-bottom: 5rpx;
  }

  .address {
    color: #666;
	padding-right: 30rpx;
  }
}

.shipment1 {
  margin: 30rpx;
  padding: 30rpx 30rpx 30rpx 84rpx;
  font-size: 26rpx;
  border-radius: 20rpx;
  background: url(@/static/images/quan_my.png) 20rpx center / 50rpx no-repeat #fff;
  position: relative;

			box-shadow: 0rpx 10rpx 15rpx 10rpx #f3f3f3;
  .icon {
    font-size: 36rpx;
    color: #333;
    transform: translateY(-50%);
    position: absolute;
    top: 50%;
    right: 20rpx;
  }

  .user {
    color: #333;
    margin-bottom: 5rpx;
  }

  .address {
    color: #666;
  }
}

/* 结算清单 */
.settlement {
  margin: 20rpx;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80rpx;
    font-size: 26rpx;
    color: #333;
  }

  .danger {
    color: #cf4444;
  }
}
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
    height: 750rpx;
  }
  .name {
    height: 75rpx;
    margin: 10rpx 0;
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
    padding-top: 4rpx;
    color: #cf4444;
    font-size: 26rpx;
  }
  .small {
    font-size: 80%;
  }
}
/* 吸底工具栏 */
.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(var(--window-bottom));
  z-index: 1;

  background-color: #fff;
  height: 100rpx;
  padding: 0 20rpx;
  border-top: 1rpx solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: content-box;

  .total-pay {
    font-size: 40rpx;
    color: #cf4444;

    .decimal {
      font-size: 75%;
    }
  }

  .button {
    width: 220rpx;
    text-align: center;
    line-height: 72rpx;
    font-size: 26rpx;
    color: #fff;
    border-radius: 72rpx;
    background-color: #27ba9b;
  }

  .disabled {
    opacity: 0.6;
  }
}
.main {
		margin: 30rpx;
		.main-list {
			border-radius: 20rpx;

			box-shadow: 0rpx 10rpx 35rpx 10rpx #e6e6e6;
			margin-bottom: 30rpx;
		}

		.title {
			padding: 20rpx;
		}
		.order {
			min-height: 60rpx;
			background-color: #fff;
			padding: 30rpx;
			font-size: 28rpx;
			.list {
				display: flex;
				justify-content: space-between;
				padding: 10rpx 0rpx;
			}
		}
		.shop {
			width: 100%;
			min-height: 60rpx;
			background-color: #fff;
			padding: 20rpx;
			display: flex;

			.shop-left {
				margin-right: 20rpx;

				.shop-image {
					width: 180rpx;
					height: 180rpx;
					border-radius: 20rpx;
				}
			}

			.shop-right {
				display: flex;
				flex-direction: column;
				justify-content: space-around;

				.title {
					font-size: 32rpx;
					color: #333333;
				}

				.shop-seller {
					font-size: 22rpx;
					color: #777;
					margin-bottom: 10rpx;
				}

				.shop-price {
					color: #ff552c;
					font-size: 22rpx;

					text {
						font-size: 32rpx;
					}
				}
			}
		}

		.agent {
			width: 100%;
			min-height: 80rpx;
			background-color: #fff;
			padding: 20rpx;
			display: flex;
			justify-content: space-between;
			color: #777;
			font-size: 28rpx;

		}
}
</style>
