<script setup lang="ts">
	import { useGuessList } from '@/composables'
	import { OrderState } from '@/services/constants'
	import { getMemberOrderByIdAPI, postMemberOrderPayAPI } from '@/services/order'
	import { getMemberProfileAPI } from '@/services/profile'
	import { useMemberStore } from '@/stores'
	import type { ProfileDetail } from '@/types/member'
	import type { OrderResult, PayImage } from '@/types/order'
	import { onLoad } from '@dcloudio/uni-app'
	import { ref } from 'vue'
	import PaymentList from './components/PaymentList.vue'
	import { phoneNumShow, timechange } from '@/utils/timechange'
	import agency_one from '../../pages/agency/components/agency_one.vue'
	// 获取页面参数
	const query = defineProps<{
		id : number
	}>()

	var type = 1
	//获取用户信息
	const memberStore = useMemberStore()
	//获取用户当前可用积分

	// 获取个人信息，修改个人信息需提供初始值
	const profile = ref({} as ProfileDetail)
	const getMemberProfileData = async () => {
		const res = await getMemberProfileAPI()
		profile.value = res.data
	}
	const Pay_image = ref<PayImage>()

	// 获取订单详情
	const order = ref<OrderResult>()
	const getMemberOrderByIdData = async () => {
		const res = await getMemberOrderByIdAPI(query.id)
		order.value = res.data
	}
	// tabs 数据
	const couponTabs = ref([
		{ payFlag: 1, title: '银行卡支付', isRender: false },
		{ payFlag: 2, title: '支付宝支付', isRender: false },
		{ payFlag: 3, title: '微信支付', isRender: false },
		{ payFlag: 4, title: 'BNB-USDT', isRender: false },
		{ payFlag: 5, title: 'TRC-USDT', isRender: false },
	])
	const activeIndex = ref(couponTabs.value.findIndex((v) => v.payFlag === type))
	// 默认渲染容器

	//上传支付成功截图
	const uploadSuccessImage = () => {
		uni.chooseImage({
			count: 1,
			success: (data) => {
				const tempFilePath = data.tempFiles[0]
				console.log(tempFilePath)
				//文件上传
				uni.uploadFile({
					url: '/api/ajax/upload',
					name: 'file',
					file: tempFilePath,
					success: (res) => {
						if (res.statusCode === 200) {
							//const avatar = JSON.parse(res.data).result.avatar
							// 个人信息页数据更新
							//profile_re.value!.avatar = avatar
							if (JSON.parse(res.data).code == 1) {
								Pay_image.value.url = JSON.parse(res.data).data.file.url
								Pay_image.value.full_url = JSON.parse(res.data).data.file.full_url
								console.log(Pay_image.value)
							} else {
								console.log(res.data)
								uni.showToast({ icon: 'error', title: '出现错误' })
							}
						} else {
							uni.showToast({ icon: 'error', title: '出现错误' })
						}
					},
				})
			},
		})
	}

	//提交成功支付
	const PaySuccess = async () => {
		var payment_type = ''
		if (order.value?.order_type == 3) {
			if (Number(order.value?.pay_cash) - Number(memberStore.profile?.score) == 0) {
				if (couponTabs.value[activeIndex.value].payFlag == 1) {
					payment_type = 'union'
				} else if (couponTabs.value[activeIndex.value].payFlag == 2) {
					payment_type = 'alipay'
				} else if (couponTabs.value[activeIndex.value].payFlag == 3) {
					payment_type = 'wechat'
				}
				else if (couponTabs.value[activeIndex.value].payFlag == 4) {
					payment_type = 'bnbusdt'
				}
				else if (couponTabs.value[activeIndex.value].payFlag == 5) {
					payment_type = 'trcusdt'
				}
				const res = await postMemberOrderPayAPI({
					id: query.id,
					payment_type: '',
					pay_image: '',
				})
			} else {
				if (couponTabs.value[activeIndex.value].payFlag == 1) {
					payment_type = 'union'
				} else if (couponTabs.value[activeIndex.value].payFlag == 2) {
					payment_type = 'alipay'
				} else if (couponTabs.value[activeIndex.value].payFlag == 3) {
					payment_type = 'wechat'
				}
				const res = await postMemberOrderPayAPI({
					id: query.id,
					payment_type: payment_type,
					pay_image: Pay_image.value.url,
				})
			}
		} else {
			if (Number(order.value?.pay_cash) == 0) {
				if (couponTabs.value[activeIndex.value].payFlag == 1) {
					payment_type = 'union'
				} else if (couponTabs.value[activeIndex.value].payFlag == 2) {
					payment_type = 'alipay'
				} else if (couponTabs.value[activeIndex.value].payFlag == 3) {
					payment_type = 'wechat'
				}
				const res = await postMemberOrderPayAPI({
					id: query.id,
					payment_type: '',
					pay_image: '',
				})
			} else {
				if (couponTabs.value[activeIndex.value].payFlag == 1) {
					payment_type = 'union'
				} else if (couponTabs.value[activeIndex.value].payFlag == 2) {
					payment_type = 'alipay'
				} else if (couponTabs.value[activeIndex.value].payFlag == 3) {
					payment_type = 'wechat'
				} else if (couponTabs.value[activeIndex.value].payFlag == 4) {
					payment_type = 'bnbusdt'
				} else if (couponTabs.value[activeIndex.value].payFlag == 5) {
					payment_type = 'trcusdt'
				}
				const res = await postMemberOrderPayAPI({
					id: query.id,
					payment_type: payment_type,
					pay_image: Pay_image.value.url,
				})
			}
		}

		uni.showToast({ icon: 'success', title: '支付成功' })
		uni.navigateBack()
	}

	onLoad(() => {
		getMemberOrderByIdData()
		getMemberProfileData()
		couponTabs.value[activeIndex.value].isRender = true
		Pay_image.value = {
			url: '',
			full_url: '',
		}
	})
</script>

<template>
	<scroll-view enable-back-to-top class="viewport" scroll-y>
		<!-- 订单状态 -->

		<view class="main">
			<view class="shop main-list">
				<view class="shop-left">
					<image class="shop-image" :src="order?.goods.goods_master_image" mode="scaleToFill"></image>
				</view>

				<view class="shop-right">
					<view class="title">{{order?.goods.goods_name}}</view>
					<view class="shop-seller">
						商品归属者：{{ order?.seller.mobile?phoneNumShow(order?.seller.mobile):"未填写手机号" }}</view>
					<view class="shop-price">￥ <text>{{ order?.order_price }}</text> </view>
				</view>
			</view>
			<view class="order main-list">
				<view class="list">
					<text>订单编号</text>
					<text>{{order?.order_no}}</text>
				</view>
				<view class="list">
					<text>下单时间</text>
					<text>{{ timechange(order?.create_time) }}</text>
				</view>
				<view class="list">
					<text>商品总额</text>
					<text>￥{{order?.order_price}}</text>
				</view>
				<view class="list">
					<text>抵扣劵</text>
					<text>￥{{order?.discount}}</text>
				</view>
			</view>
			<view class="agent main-list" v-if="order?.order_type == 2">
				<!--显示用户可用积分-->
				<text class="text1">可用积分</text>
				<text>{{ profile?.score }}</text>
			</view>
			<view class="title">请选择支付方式</view>
			<view class="payway main-list">
				<view class="tabs-content">
					<view :style="activeIndex<3?('left:-'+activeIndex*160+'rpx'):('left:-'+activeIndex*140+'rpx')"
						class="tabs">
						<text :class="activeIndex == index?' active item':'item'" v-for="(item, index) in couponTabs"
							:key="item.title" @tap="
				  () => {
				    activeIndex = index
				    item.isRender = true
				  }
				">
							{{ item.title }}
						</text>
						<!-- 游标 -->
						<view class="cursor" :style="{ left: (activeIndex * 20)+5 + '%' }"></view>
					</view>

				</view>
				<!-- 滑动容器 -->
				<swiper class="swiper" :current="activeIndex" @change="activeIndex = $event.detail.current">
					<!-- 滑动项 -->
					<swiper-item v-for="item in couponTabs" :key="item.title">
						<!-- 抵扣券列表 -->
						<!-- <CouponList v-if="item.isRender" :payFlag="item.payFlag" /> -->
						<agency_one v-if="item.isRender" :payFlag="item.payFlag" />
					</swiper-item>
				</swiper>
				<!--上传支付成功截图-->
				<view class="pay-title">
					上传凭证
				</view>
				<view class="payment">
					<view class="upload" @tap="uploadSuccessImage">
						<image class="image" :src="Pay_image.full_url" v-if="Pay_image?.url" />
						<view class="add_img">
							+
						</view>
					</view>
				</view>
				<text class="allMsg">点击上传支付成功截图</text>

			</view>
		</view>
		<view class="btm-info">
			<view class="pay-money">
				需付： ￥{{ order?.pay_cash}}
			</view>
			<view class="buttons">
				<button class="button" @tap="PaySuccess">确定支付</button>
			</view>
		</view>
		<view class="overview">

			<view class="buttons">
				<navigator hover-class="none" class="button navigator" url="/pages/index/index" open-type="switchTab">
					返回首页
				</navigator>
				<navigator hover-class="none" class="button navigator" :url="`/pagesOrder/detail/detail?id=${query.id}`"
					open-type="redirect">
					查看订单
				</navigator>
			</view>
		</view>

		<!-- 猜你喜欢
    <XtxGuess ref="guessRef" /> -->
	</scroll-view>
</template>

<style lang="scss">
	page {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
		background-color: #efeeee;
	}

	.viewport {
		background-color: #efeeee;
	}

	.radio {
		width: 100%;
		height: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;

	}

	.overview {
		line-height: 1;
		padding: 20rpx 0 160rpx;
		color: #799372;
		background-color: #efeeee;

		.buttons {
			height: 80rpx;
			line-height: 80rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 0rpx;
		}

		.button {
			text-align: center;
			margin: 0 10rpx;
			font-size: 28rpx;
			color: #333;
			background-color: #fff;

			&:first-child {
				width: 200rpx;
				border-radius: 64rpx;
				border: 1rpx solid #ccc;
			}
		}
	}

	.agent {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: right;
		margin: 0rpx 50rpx 0rpx 0rpx;
		width: 750rpx;
		height: 50rpx;

		.text {
			font-size: 28rpx;
			font-weight: 500;
			color: #799372;
			width: 100%;
		}
	}

	.swiper {
		height: 500rpx;
	}



	// 20231021修改
	.btm-info {
		position: fixed;
		height: 120rpx;
		width: 100%;
		background-color: #fff;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: space-around;
		border-top: 3rpx solid #eee;

		.pay-money {
			color: #ff552c;
		}

		.button {
			background-image: linear-gradient(to right, #575759, #212123);
			border-radius: 40rpx;
			height: 80rpx;
			color: #fff;
			width: 220rpx;
			line-height: 80rpx;
			font-size: 32rpx;
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

		.payway {
			width: 100%;
			min-height: 80rpx;
			background-color: #fff;
			padding: 20rpx;
			color: #777;
			font-size: 28rpx;

			.tabs-content::-webkit-scrollbar {
				width: 0px;
			}

			/* 滚动槽 */
			.tabs-content::-webkit-scrollbar-track {
				-webkit-box-shadow: insetee6pxrgba(0, 0, 0, 0.0);
				border-radius: 0px;
			}

			/* 滚动条滑块 */
			.tabs-content::-webkit-scrollbar-thumb {
				border-radius: 0px;
				background: rgba(0, 0, 0, 0.0);
				-webkit-box-shadow: insetee6pxrgba(0, 0, 0, 0);
			}

			.tabs-content::-webkit-scrollbar-thumb:window-inactive {
				background: rgba(255, 0, 0, 0);
			}

			.tabs-content {
				width: 100%;
				overflow-y: hidden;

				.tabs {
					display: flex;
					justify-content: space-around;
					line-height: 60rpx;

					background-color: #fff;
					box-shadow: 0 4rpx 6rpx rgba(240, 240, 240, 0.6);
					position: relative;
					z-index: 9;
					padding: 20rpx 0rpx 0rpx;
					width: max-content;
					transition: all 0.5s ease;
					position: relative;
					left: 0rpx;

					.active {
						color: #262626 !important;
					}

					.item {
						text-align: center;
						padding: 20rpx 40rpx;
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