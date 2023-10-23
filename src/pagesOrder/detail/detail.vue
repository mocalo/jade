<script setup lang="ts">
	import { useGuessList } from '@/composables'
	import { OrderState, orderStateList } from '@/services/constants'
	import {
		deleteMemberOrderAPI,
		getMemberOrderByIdAPI,
		getMemberOrderCancelByIdAPI,
		getMemberOrderDeliverByIdAPI,
		putMemberOrderReceiptByIdAPI,
		getMemberOrderExpressByIdAPI,
	} from '@/services/order'
	import type { OrderExpress, OrderResult } from '@/types/order'
	import { onLoad, onReady, onShow } from '@dcloudio/uni-app'
	import { ref } from 'vue'
	import PageSkeleton from './components/PageSkeleton.vue'
	import { getMemberAddressByIdAPI } from '@/services/address'
	import type { AddressItem } from '@/types/address'
	import { useMemberStore } from '@/stores'
	import { orderPayConfirm, orderPayNow } from '@/services/pay'
	import { phoneNumShow, timechange } from '@/utils/timechange'

	// 获取屏幕边界到安全区域距离
	const { safeAreaInsets } = uni.getSystemInfoSync()
	// 猜你喜欢
	const { guessRef, onScrolltolower } = useGuessList()
	// 弹出层组件
	const popup = ref<UniHelper.UniPopupInstance>()
	const popupLogistics = ref<UniHelper.UniPopupInstance>()
	// 取消原因列表
	const reasonList = ref([
		'商品无货',
		'不想要了',
		'商品信息填错了',
		'地址信息填写错误',
		'商品降价',
		'其它',
	])
	//物流订单状态
	const expressStateList = ref([
		'在途中',
		'已揽件',
		'疑难',
		'已签收',
		'退签',
		'同城派送中',
		'退回',
		'转单',
		'清关',
		'',
		'',
		'',
		'',
		'',
		'拒收',
	])
	const isShow = ref(false)
	// 订单取消原因
	const reason = ref()
	// 复制内容
	const onCopy = (id : string) => {
		// 设置系统剪贴板的内容
		uni.setClipboardData({ data: id })
	}
	// 获取页面参数
	const query = defineProps<{
		id : number
	}>()

	//获取会员信息
	const memberStore = useMemberStore()

	// 获取页面栈
	const pages = getCurrentPages()
	// #ifdef MP-WEIXIN
	// 获取当前页面实例，数组最后一项
	const pageInstance = pages.at(-1) as any

	// 页面渲染完毕，绑定动画效果
	onReady(() => {
		// 动画效果,导航栏背景色
		pageInstance.animate(
			'.navbar',
			[{ backgroundColor: 'transparent' }, { backgroundColor: '#f8f8f8' }],
			1000,
			{
				scrollSource: '#scroller',
				timeRange: 1000,
				startScrollOffset: 0,
				endScrollOffset: 50,
			},
		)
		// 动画效果,导航栏标题
		pageInstance.animate('.navbar .title', [{ color: 'transparent' }, { color: '#000' }], 1000, {
			scrollSource: '#scroller',
			timeRange: 1000,
			startScrollOffset: 0,
			endScrollOffset: 50,
		})
		// 动画效果,导航栏返回按钮
		pageInstance.animate('.navbar .back', [{ color: '#fff' }, { color: '#000' }], 1000, {
			scrollSource: '#scroller',
			timeRange: 1000,
			startScrollOffset: 0,
			endScrollOffset: 50,
		})
	})
	// #endif

	// 获取订单详情
	const order = ref<OrderResult>()
	const getMemberOrderByIdData = async () => {
		const res = await getMemberOrderByIdAPI(query.id)
		order.value = res.data
		if (
			[OrderState.DaiShouHuo, OrderState.DaiPingJia, OrderState.YiWanCheng].includes(
				order.value.order_status,
			)
		) {
			console.log('开始获取物流信息')
			await getMemberOrderLogisticsByIdData()
		}
	}
	// 点击图片时
	const onTapImage = (url : string) => {
		// 大图预览
		uni.previewImage({
			current: url,
			urls: [url],
		})
	}
	//获取物流信息
	const logisticList = ref<OrderExpress>()
	const getMemberOrderLogisticsByIdData = async () => {
		const res = await getMemberOrderExpressByIdAPI(query.id)
		//获取物流信息
		logisticList.value = res.data
		console.log('物流信息', logisticList.value)
	}

	// 获取收货地址详情数据
	const address_all = ref<AddressItem>()
	const getMemberAddressByIdData = async () => {
		if (query.id) {
			// 发送请求
			const res = await getMemberAddressByIdAPI()
			// 把数据合并到表单中
			// Object.assign(form.value, res.data)
			address_all.value = res.data
		}
	}

	//跳转物流详情
	const changeLog = (id : number) => {
		uni.navigateTo({
			url: `/pages/logistics/logistics?id=${id}`,
		})
	}

	onLoad(() => {
		getMemberOrderByIdData()
		getMemberAddressByIdData()
	})
	onShow(() => {
		getMemberOrderByIdData()
		getMemberAddressByIdData()
	})
	// 倒计时结束事件
	const onTimeup = () => {
		// 修改订单状态为已取消
		order.value!.order_status = OrderState.YiQuXiao
	}

	// 订单支付
	const onOrderPay = async () => {
		// if (import.meta.env.DEV) {
		//   // 开发环境模拟支付
		//   await getPayMockAPI({ orderId: query.id })
		// } else {
		//   // #ifdef MP-WEIXIN
		//   // 正式环境微信支付
		//   const res = await getPayWxPayMiniPayAPI({ orderId: query.id })
		//   await wx.requestPayment(res.result)
		//   // #endif
		// }
		// 关闭当前页，再跳转支付结果页
		uni.redirectTo({ url: `/pagesOrder/payment/payment?id=${query.id}` })
	}

	// 是否为开发环境
	const isDev = import.meta.env.DEV
	// 模拟发货
	const onOrderSend = async () => {
		// 发送请求
		// 更新订单信息
	}

	//确认发货
	const onOrderDeliver = async () => {
		var id = order.value!.id
		await getMemberOrderDeliverByIdAPI(id)
		uni.showToast({ icon: 'success', title: '确认发货成功' })
		// 确认成功，更新为待收货
		getMemberOrderByIdData()
	}

	// 确认收货
	const onOrderConfirm = () => {
		// 二次确认弹窗
		uni.showModal({
			content: '为保障您的权益，请收到货并确认无误后，再确认收货',
			success: async (success) => {
				if (success.confirm) {
					const res = await putMemberOrderReceiptByIdAPI(query.id)
					// 更新订单状态
					getMemberOrderByIdData()
				}
			},
		})
	}
	// 删除订单
	const onOrderDelete = () => {
		// 二次确认
		uni.showModal({
			content: '是否删除订单',
			success: async (success) => {
				if (success.confirm) {
					await deleteMemberOrderAPI({ ids: [query.id] })
					uni.redirectTo({ url: '/pagesOrder/list/list' })
				}
			},
		})
	}

	// 取消订单
	const onOrderCancel = async () => {
		// 发送请求
		const res = await getMemberOrderCancelByIdAPI(query.id, { cancelReason: reason.value })
		// 更新订单信息
		order.value = res.data
		// 关闭弹窗
		popup.value?.close!()
		// 轻提示
		uni.showToast({ icon: 'none', title: '订单取消成功' })
	}

	//确认收款订单
	const onOrderPayConfirm = async () => {
		var id = order.value!.id
		uni.showModal({
			content: '为保障您的权益，是否确认收到款了',
			success: async (success) => {
				if (success.confirm) {
					//关闭弹窗，并且打开新的弹窗
					var res = await orderPayConfirm({ id: id })
					uni.showToast({ icon: 'success', title: '确认收款成功' })
					// 确认成功，更新为支付成功
					getMemberOrderByIdData()
				}
			},
			fail: (fail) => {
				//关闭弹窗
				uni.hideLoading()
			},
		})
	}

	//确认发货
	const onOrderPayNow = async () => {
		uni.showModal({
			content: '为保障您的权益，是否确认发货',
			success: async (success) => {
				if (success.confirm) {
					var id = order.value!.id
					var res = await orderPayNow({ id: id })
					uni.showToast({ icon: 'success', title: '请等待商家发货' })
					// 确认成功，更新为支付成功
					getMemberOrderByIdData()
				}
			},
		})
	}

	//确认寄售
	const onOrderPaySell = async () => {
		var id = order.value!.id
		uni.navigateTo({
			url: '/pagesOrder/payment/paymentSell?id=' + id,
		})
	}
</script>

<template>
	<!-- 自定义导航栏: 默认透明不可见, scroll-view 滚动到 50 时展示 -->
	<view class="navbar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
		<view class="wrap">
			<navigator v-if="pages.length > 1" open-type="navigateBack" class="back icon-left"></navigator>
			<navigator v-else url="/pages/index/index" open-type="switchTab" class="back icon-home">
			</navigator>
			<view class="title">订单详情</view>
		</view>
	</view>
	<scroll-view enable-back-to-top scroll-y class="viewport" id="scroller" @scrolltolower="onScrolltolower">
		<template v-if="order">
			<!-- 订单状态 -->
			<view class="overview" :style="{ paddingTop: safeAreaInsets!.top + 20 + 'px' }">
				<!-- 待付款状态:展示倒计时 -->
				<template v-if="
            order.order_status === OrderState.DaiFuKuan && order.buyer_id == memberStore.profile?.id
          ">
					<view class="status icon-clock">等待付款</view>
					<view class="tips">
						<text class="money">应付金额: ¥ {{ order.order_price }}</text>
						<!-- <text class="time">支付剩余</text>
            <uni-countdown
              :second="order.countdown"
              color="#fff"
              splitor-color="#fff"
              :show-day="false"
              :show-colon="false"
              @timeup="onTimeup"
            /> -->
					</view>
					<view class="button" @tap="onOrderPay">去支付</view>
				</template>
				<!-- 其他订单状态:展示再次购买按钮 -->
				<template v-else>
					<!-- 订单状态文字 -->
					<view class="status"> {{ orderStateList[order.order_status].text }} </view>
					<view class="button-group">
						<!-- 待收货状态: 展示确认收货按钮 -->
						<view v-if="
                order.order_status === OrderState.DaiShouHuo &&
                order.buyer_id == memberStore.profile?.id
              " @tap="onOrderConfirm" class="button">
							确认收货
						</view>
						<!--待付款状态  付款-->
						<view v-if="
                order.order_status === OrderState.DaiFuKuan &&
                order.buyer_id == memberStore.profile?.id
              " @tap="onOrderPay" class="button">
							去付款
						</view>
						<view v-if="
                order.order_status === OrderState.ZhiFuChengGong &&
                order.sale_status == 0 &&
                order.buyer_id == memberStore.profile?.id
              " @tap="onOrderPayNow" class="button">
							发货
						</view>
						<view v-if="
                order.order_status === OrderState.ZhiFuChengGong &&
                order.sale_status == 0 &&
                order.buyer_id == memberStore.profile?.id
              " @tap="onOrderPaySell" class="button">
							寄售
						</view>
						<view v-if="
                order.order_status === OrderState.DaiQueRen &&
                order.seller_id == memberStore.profile?.id
              " @tap="onOrderPayConfirm" class="button">
							确认收款
						</view>
						<view v-if="
                order.order_status === OrderState.DaiFaHuo &&
                order.seller_id == memberStore.profile?.id
              " @tap="onOrderDeliver" class="button">
							确认发货
						</view>
					</view>
				</template>
			</view>
			<!-- 配送状态 -->
			<!-- <view class="title-addr">用户地址</view> -->
			<view class="shipment">
				<!-- 物流信息 -->

				<!-- 用户收货地址 -->
				<view class="locate">
					<view class="user"> {{ address_all?.receive_name }} {{ address_all?.receive_tel }} </view>
					<view class="address"> {{ address_all?.area_info }} {{ address_all?.address }} </view>
				</view>
			</view>
			<view class="shipment" v-if="
          order.order_status == OrderState.DaiShouHuo || order.order_status == OrderState.YiWanCheng
        ">
				<view class="address_wrap" v-if="logisticList">
					<view class="all_address">
						<view class="user"> 物流状态：{{ expressStateList[logisticList?.state] }} </view>
						<view class="address">
							物流编号：{{ logisticList?.nu }}
							<text class="copy" @tap="onCopy(logisticList?.nu)">复制</text>
						</view>
					</view>
					<view class="button_address">
						<view class="button" @tap="changeLog(order.id)">物流详情 </view>
					</view>
				</view>
			</view>

			<view class="main">
				<view class="title">商品信息</view>
				<view class="shop main-list">
					<view class="shop-left">
						<image class="shop-image" :src="order.goods.goods_master_image" mode="scaleToFill"></image>
					</view>

					<view class="shop-right">
						<view class="title">{{order.goods.goods_name}}</view>
						<view class="shop-seller">
							商品归属者：{{ order.seller.mobile?phoneNumShow(order.seller.mobile):"未填写手机号" }}</view>
						<view class="shop-price">￥ <text>{{ order.order_price }}</text> </view>
					</view>
				</view>
				<view class="title">订单信息</view>
				<view class="order main-list">
					<view class="list">
						<text>订单编号</text>
						<text>{{order.order_no}}</text>
					</view>
					<view class="list">
						<text>下单时间</text>
						<text>{{ timechange(order?.create_time) }}</text>
					</view>
					<view class="list">
						<text>商品总额</text>
						<text>￥{{order.order_price}}</text>
					</view>
					<view class="list">
						<text>抵扣劵</text>
						<text>￥{{order.discount}}</text>
					</view>
					<view class="list">
						<text>应付金额</text>
						<text class="symbol">￥{{order.pay_cash}}</text>
					</view>
				</view>
			</view>
			<!-- 商品信息 -->
			<view class="detail">
				<view class="title">付款信息</view>
				<view class="row">
					<view class="item"> 付款人: {{ order.buyer.nickname }} </view>
					<view class="item"> 付款人: {{ phoneNumShow(order.buyer.mobile) }} </view>
					<view class="item" v-if="
              order.order_status == OrderState.DaiQueRen ||
              order.order_status == OrderState.ZhiFuChengGong
            ">付款截图</view>
					<view v-if="
              order.order_status == OrderState.DaiQueRen ||
              order.order_status == OrderState.ZhiFuChengGong
            ">
						<image class="image" :src="order.pay_image" @tap="onTapImage(order.pay_image)" />
					</view>
				</view>
			</view>

			<!-- 底部操作栏 -->
			<view class="toolbar-height" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }"></view>
			<view class="toolbar" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
				<!-- 待付款状态:展示支付按钮 -->
				<template v-if="
            order.order_status === OrderState.DaiFuKuan && order.buyer_id == memberStore.profile?.id
          ">
					<view class="button primary" @tap="onOrderPay"> 去支付 </view>
					<!-- <view class="button" @tap="popup?.open?.()"> 取消订单 </view> -->
				</template>
				<!-- 其他订单状态:按需展示按钮 -->
				<template v-else>
					<!-- <navigator
            class="button secondary"
            :url="`/pagesOrder/create/create?orderId=${query.id}`"
            hover-class="none"
          >
            再次购买
          </navigator> -->
					<!-- 待收货状态: 展示确认收货 -->
					<view class="button primary" v-if="
              order.order_status === OrderState.DaiShouHuo &&
              order.buyer_id == memberStore.profile?.id
            " @tap="onOrderConfirm">
						确认收货
					</view>
					<view class="button primary" v-if="
              order.order_status === OrderState.ZhiFuChengGong &&
              order.buyer_id == memberStore.profile?.id &&
              order.sale_status == 0
            " @tap="onOrderPayNow">
						发货
					</view>
					<view class="button primary" v-if="
              order.order_status === OrderState.ZhiFuChengGong &&
              order.buyer_id == memberStore.profile?.id &&
              order.sale_status == 0
            " @tap="onOrderPaySell">
						寄售
					</view>
					<view class="button primary" v-if="
              order.order_status === OrderState.DaiQueRen &&
              order.seller_id == memberStore.profile?.id
            " @tap="onOrderPayConfirm">
						确认收款
					</view>
					<view class="button primary" v-if="
              order.order_status === OrderState.DaiFaHuo &&
              order.seller_id == memberStore.profile?.id
            " @tap="onOrderConfirm">
						确认发货
					</view>
					<!-- 待评价状态: 展示去评价 -->
					<!-- <view class="button" v-if="order.order_status === OrderState.DaiPingJia"> 去评价 </view> -->
					<!-- 待评价/已完成/已取消 状态: 展示删除订单 -->
					<!-- <view
            class="button delete"
            v-if="order.order_status >= OrderState.DaiPingJia"
            @tap="onOrderDelete"
          >
            删除订单
          </view> -->
				</template>
			</view>
		</template>
		<template v-else>
			<!-- 骨架屏组件 -->
			<PageSkeleton />
		</template>
	</scroll-view>
	<!-- 取消订单弹窗 -->
	<uni-popup ref="popup" type="bottom" background-color="#fff">
		<view class="popup-root">
			<view class="title">订单取消</view>
			<view class="description">
				<view class="tips">请选择取消订单的原因：</view>
				<view class="cell" v-for="item in reasonList" :key="item" @tap="reason = item">
					<text class="text">{{ item }}</text>
					<text class="icon" :class="{ checked: item === reason }"></text>
				</view>
			</view>
			<view class="footer">
				<view class="button" @tap="popup?.close?.()">取消</view>
				<view class="button primary" @tap="onOrderCancel">确认</view>
			</view>
		</view>
	</uni-popup>
</template>

<style lang="scss">
	page {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
	}

	.navbar {
		width: 750rpx;
		color: #000;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9;
		/* background-color: #f8f8f8; */
		background-color: transparent;

		.wrap {
			position: relative;

			.title {
				height: 44px;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 32rpx;
				/* color: #000; */
				color: transparent;
			}

			.back {
				position: absolute;
				left: 0;
				height: 44px;
				width: 44px;
				font-size: 44rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				/* color: #000; */
				color: #fff;
			}
		}
	}

	.viewport {
		background-color: #f7f7f8;
	}

	.overview {
		display: flex;
		flex-direction: column;
		align-items: center;

		line-height: 1;
		padding-bottom: 30rpx;
		color: #fff;
		background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/order_bg.png);

		background-size: cover;

		.status {
			font-size: 36rpx;
		}

		.status::before {
			margin-right: 6rpx;
			font-weight: 500;
		}

		.tips {
			margin: 30rpx 0;
			display: flex;
			font-size: 14px;
			align-items: center;

			.money {
				margin-right: 30rpx;
			}
		}

		.button-group {
			margin-top: 30rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.button {
			width: 260rpx;
			height: 64rpx;
			margin: 0 10rpx;
			text-align: center;
			line-height: 64rpx;
			font-size: 28rpx;
			color: #27ba9b;
			border-radius: 68rpx;
			background-color: #fff;
		}
	}

	.title-addr {
		font-size: 30rpx;
		color: #444;
		margin: 30rpx;
		padding-left: 20rpx;
	}

	.shipment {
		line-height: 1.4;
		padding: 0 20rpx;
		margin: 30rpx 30rpx 0;
		border-radius: 10rpx;
		background-color: #fff;
		border-radius: 20rpx;

		box-shadow: 0rpx 10rpx 35rpx 10rpx #e6e6e6;


		.locate,
		.item {
			min-height: 120rpx;
			padding: 30rpx 30rpx 25rpx 75rpx;
			background-size: 50rpx;
			background-repeat: no-repeat;
			background-position: 6rpx center;

		}

		.locate {
			background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/locate.png);

			.user {
				font-size: 26rpx;
				color: #444;
			}

			.address {
				font-size: 24rpx;
				color: #666;
			}
		}

		.address_wrap {
			min-height: 120rpx;
			padding: 30rpx 30rpx 25rpx 75rpx;
			background-size: 50rpx;
			background-repeat: no-repeat;
			background-position: 6rpx center;
			background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/locate.png);

			.all_address {
				width: 100%;
				height: 100%;
			}

			.copy {
				border-radius: 20rpx;
				font-size: 20rpx;
				border: 1px solid #ccc;
				padding: 5rpx 10rpx;
				margin-left: 10rpx;
			}

			.button_address {
				width: 100%;

				.button {
					float: right;
					width: 20%;
					height: 44rpx;
					margin: 0 2rpx;
					text-align: center;
					line-height: 44rpx;
					font-size: 22rpx;
					color: #ffffff;
					border-radius: 68rpx;
					background-color: #27ba9b;
					border-color: #27ba9b;
					position: relative;
					right: -30rpx;
					bottom: 40rpx;
				}
			}

			.user {
				font-size: 26rpx;
				color: #444;
			}

			.address {
				font-size: 24rpx;
				color: #666;
			}
		}

		.item {
			background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/car.png);
			background-repeat: no-repeat;
			background-position: 6rpx center;

			.message {
				font-size: 26rpx;
				color: #444;
			}

			.date {
				font-size: 24rpx;
				color: #666;
			}
		}
	}

	.goods {
		margin: 20rpx 20rpx 0;
		padding: 0 20rpx;
		border-radius: 10rpx;
		background-color: #fff;

		.item {
			padding: 30rpx 0;
			border-bottom: 1rpx solid #eee;

			.navigator {
				display: flex;
				margin: 20rpx 0;
			}

			.cover {
				width: 170rpx;
				height: 170rpx;
				border-radius: 10rpx;
				margin-right: 20rpx;
			}

			.meta {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				position: relative;
			}

			.name {
				height: 80rpx;
				font-size: 26rpx;
				color: #444;
			}

			.type {
				line-height: 1.8;
				padding: 0 15rpx;
				margin-top: 6rpx;
				font-size: 24rpx;
				align-self: flex-start;
				border-radius: 4rpx;
				color: #888;
				background-color: #f7f7f8;
			}

			.price {
				display: flex;
				margin-top: 6rpx;
				font-size: 24rpx;
			}

			.symbol {
				font-size: 20rpx;
			}

			.original {
				color: #999;
				text-decoration: line-through;
			}

			.actual {
				margin-left: 10rpx;
				color: #444;
			}

			.text {
				font-size: 22rpx;
			}

			.quantity {
				position: absolute;
				bottom: 0;
				right: 0;
				font-size: 24rpx;
				color: #444;
			}

			.action {
				display: flex;
				flex-direction: row-reverse;
				justify-content: flex-start;
				padding: 30rpx 0 0;

				.button {
					width: 200rpx;
					height: 60rpx;
					text-align: center;
					justify-content: center;
					line-height: 60rpx;
					margin-left: 20rpx;
					border-radius: 60rpx;
					border: 1rpx solid #ccc;
					font-size: 26rpx;
					color: #444;
				}

				.primary {
					color: #27ba9b;
					border-color: #27ba9b;
				}
			}
		}

		.total {
			line-height: 1;
			font-size: 26rpx;
			padding: 20rpx 0;
			color: #666;

			.row {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 10rpx 0;
			}

			.symbol::before {
				content: '¥';
				font-size: 80%;
				margin-right: 3rpx;
			}

			.primary {
				color: #cf4444;
				font-size: 36rpx;
			}
		}
	}

	.detail {
		line-height: 1;
		padding: 30rpx 30rpx 0;
		margin: 30rpx;
		font-size: 26rpx;
		color: #666;
		background-color: #fff;
		border-radius: 20rpx;

		box-shadow: 0rpx 10rpx 35rpx 10rpx #e6e6e6;

		.title {
			font-size: 30rpx;
			color: #444;
		}

		.row {
			padding: 20rpx 0;

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
				font-size: 20rpx;
				border: 1px solid #ccc;
				padding: 5rpx 10rpx;
				margin-left: 10rpx;
			}
		}
	}

	.toolbar-height {
		height: 100rpx;
		box-sizing: content-box;
	}

	.toolbar {
		position: fixed;
		left: 0;
		right: 0;
		bottom: calc(var(--window-bottom));
		z-index: 1;

		height: 100rpx;
		padding: 0 20rpx;
		display: flex;
		align-items: center;
		flex-direction: row-reverse;
		border-top: 1rpx solid #ededed;
		border-bottom: 1rpx solid #ededed;
		background-color: #fff;
		box-sizing: content-box;

		.button {
			display: flex;
			justify-content: center;
			align-items: center;

			width: 200rpx;
			height: 72rpx;
			margin-left: 15rpx;
			font-size: 26rpx;
			border-radius: 72rpx;
			border: 1rpx solid #ccc;
			color: #444;
		}

		.delete {
			order: 4;
			color: #cf4444;
		}

		.button {
			order: 3;
		}

		.secondary {
			order: 2;
			color: #27ba9b;
			border-color: #27ba9b;
		}

		.primary {
			order: 1;
			color: #fff;
			background-image: linear-gradient(to right, #575759, #212123);

		}
	}

	.popup-root {
		padding: 30rpx 30rpx 0;
		border-radius: 10rpx 10rpx 0 0;
		overflow: hidden;

		.title {
			font-size: 30rpx;
			text-align: center;
			margin-bottom: 30rpx;
		}

		.item {
			padding: 20rpx 0 0 0;

			.message {
				font-size: 26rpx;
				color: rgb(180, 180, 180);
			}

			.date {
				font-size: 24rpx;
				color: rgb(180, 180, 180);
			}
		}

		.description {
			font-size: 28rpx;
			padding: 0 20rpx;

			.tips {
				color: #444;
				margin-bottom: 12rpx;
			}

			.cell {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 15rpx 0;
				color: #666;
			}

			.icon::before {
				content: '\e6cd';
				font-family: 'erabbit' !important;
				font-size: 38rpx;
				color: #999;
			}

			.icon.checked::before {
				content: '\e6cc';
				font-size: 38rpx;
				color: #27ba9b;
			}
		}

		.footer {
			display: flex;
			justify-content: space-between;
			padding: 30rpx 0 40rpx;
			font-size: 28rpx;
			color: #444;

			.button {
				flex: 1;
				height: 72rpx;
				text-align: center;
				line-height: 72rpx;
				margin: 0 20rpx;
				color: #444;
				border-radius: 72rpx;
				border: 1rpx solid #ccc;
			}

			.primary {
				color: #fff;
				background-color: #27ba9b;
				border: none;
			}
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

				.symbol {
					color: #ff552c;
				}
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

		.payway {
			width: 100%;
			min-height: 80rpx;
			background-color: #fff;
			padding: 20rpx;
			color: #777;
			font-size: 28rpx;

			.tabs {
				display: flex;
				justify-content: space-around;
				line-height: 60rpx;

				background-color: #fff;
				box-shadow: 0 4rpx 6rpx rgba(240, 240, 240, 0.6);
				position: relative;
				z-index: 9;
				padding: 20rpx 0rpx 0rpx;

				.active {
					color: #262626 !important;
				}

				.item {
					flex: 1;
					text-align: center;
					padding: 20rpx;
					font-size: 32rpx;
					color: #aaa;
					position: relative;
					z-index: 9;
				}

				.cursor {
					position: absolute;
					left: 10%;
					bottom: 30rpx;
					width: 10%;
					height: 15rpx;
					padding: 0 50rpx;
					background-color: #11e0b6;
					/* 过渡效果 */
					transition: all 0.4s;
					z-index: 2;
				}
			}

			.pay-title {
				font-size: 32rpx !important;
				color: #333;
				padding-left: 55rpx;
			}

			.payment {
				width: 100%;
				height: 300rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				margin: 0rpx 0;

				.upload {
					width: 240rpx;
					height: 240rpx;
					//虚线
					border: 3rpx dashed #dcdcdc;
					border-radius: 30rpx;

					.image {
						width: 240rpx;
						height: 240rpx;
					}

					.add_img {
						width: 100%;
						height: 100%;
						font-size: 100rpx;
						color: #dcdcdc;
						display: flex;
						align-items: center;
						justify-content: center;
					}
				}
			}

			.allMsg {
				width: 100%;
				height: 100rpx;
				display: flex;
				justify-content: center;

				align-items: center;
				font-size: 28rpx;
				font-weight: 500;
				text-align: center;
			}
		}
	}
</style>