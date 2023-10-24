<script setup lang="ts">
import { useGuessList } from '@/composables'
import { OrderState } from '@/services/constants'
import { getMemberOrderByIdAPI, postMemberOrderPayAPI } from '@/services/order'
import { orderPaySell, orderPaySellMoney } from '@/services/pay'
import { getMemberProfileAPI } from '@/services/profile'
import { useMemberStore } from '@/stores'
import type { ProfileDetail } from '@/types/member'
import type { OrderResult, PayImage } from '@/types/order'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import PaymentList from './components/PaymentSellerList.vue'
import { phoneNumShow, timechange } from '@/utils/timechange'
import type { paymentSell } from '@/types/home'

// 获取页面参数
const query = defineProps<{
  id: number
}>()

var type = 1
//获取用户信息
const memberStore = useMemberStore()
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
  console.log(order.value, 'sssssss')
}

//获取当前所需要支付的金额
const money_all = ref<paymentSell>()
const getMoney = async () => {
  const res = await orderPaySellMoney({ id: query.id })
  money_all.value = res.data
}

// tabs 数据
const couponTabs = ref([
  { payFlag: 1, title: '银行卡支付', isRender: false },
  { payFlag: 2, title: '支付宝支付', isRender: false },
  { payFlag: 3, title: '微信支付', isRender: false },
  { payFlag: 4, title: 'BSC-USDT', isRender: false },
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

  if (couponTabs.value[activeIndex.value].payFlag == 1) {
    payment_type = 'bank'
  } else if (couponTabs.value[activeIndex.value].payFlag == 2) {
    payment_type = 'alipay'
  } else if (couponTabs.value[activeIndex.value].payFlag == 3) {
    payment_type = 'wechat'
  } else if (couponTabs.value[activeIndex.value].payFlag == 4) {
    payment_type = 'bnbusdt'
  } else if (couponTabs.value[activeIndex.value].payFlag == 5) {
    payment_type = 'trcusdt'
  }
  const res = await orderPaySell({
    id: query.id,
    payment_type: payment_type,
    pay_image: Pay_image.value.url,
  })

  uni.showToast({ icon: 'success', title: '支付成功' })
  uni.navigateBack()
}

onLoad(() => {
  getMoney()
  getMemberProfileData()
  getMemberOrderByIdData()
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

    <view class="overview">
      <view class="shipment">
        <!-- 物流信息 -->

        <!-- 用户收货地址 -->
        <view class="locate">
          <view class="user"> {{ order?.buyer.nickname }} {{ order?.buyer.mobile }} </view>
          <view class="address"> {{ order?.receive_area }} {{ order?.receive_address }} </view>
        </view>
      </view>
      <view class="main">
        <view class="shop main-list">
          <view class="shop-left">
            <image
              class="shop-image"
              :src="order?.goods.goods_master_image"
              mode="scaleToFill"
            ></image>
          </view>

          <view class="shop-right">
            <view class="title">{{ order?.goods.goods_name }}</view>
            <view class="shop-seller"> 商品归属者：{{ order?.seller.mobile }}</view>
            <view class="shop-price"
              >￥ <text>{{ order?.goods.goods_price }}</text>
            </view>
          </view>
        </view>
        <view class="order main-list">
          <view class="list">
            <text>订单编号</text>
            <text>{{ order?.order_no }}</text>
          </view>
          <view class="list">
            <text>下单时间</text>
            <text>{{ timechange(order?.create_time) }}</text>
          </view>
          <view class="list">
            <text>商品总额</text>
            <text>￥{{ order?.order_price }}</text>
          </view>
          <view class="list">
            <text>抵扣劵</text>
            <text>￥{{ order?.discount }}</text>
          </view>
          <view class="list">
            <text>对方已付金额</text>
            <text>￥{{ order?.pay_cash }}</text>
          </view>
          <view class="list list-money">
            <text>应付金额</text>
            <text class="symbol">￥{{ money_all?.pay_rmb }}</text>
          </view>
          <view class="list list-money" v-if="activeIndex == 3 || activeIndex == 4">
            <text>应付USDT</text>
            <text class="symbol">{{ money_all?.pay_usdt }}</text>
          </view>
        </view>
      </view>

      <view class="pay_score">
        <view>我的佣金：{{ profile.money }}</view>
        <view>总金额：{{ money_all?.total_price }}</view>
      </view>

      <view class="main">
        <view class="payway main-list">
          <view class="tabs-content">
            <view class="tabs">
              <text
                :class="activeIndex == index ? ' active item' : 'item'"
                v-for="(item, index) in couponTabs"
                :key="item.title"
                @tap="
                  () => {
                    activeIndex = index
                    item.isRender = true
                  }
                "
              >
                {{ item.title }}
              </text>
              <!-- 游标 -->
              <view class="cursor" :style="{ left: activeIndex * 20 + 5 + '%' }"></view>
            </view>
          </view>
          <!-- 滑动容器 -->
          <swiper
            class="swiper"
            :current="activeIndex"
            @change="activeIndex = $event.detail.current"
          >
            <!-- 滑动项 -->
            <swiper-item v-for="item in couponTabs" :key="item.title">
              <!-- 抵扣券列表 -->
              <!-- <CouponList v-if="item.isRender" :payFlag="item.payFlag" /> -->
              <PaymentList v-if="item.isRender" :payFlag="item.payFlag" :orderId="query.id" />
            </swiper-item>
          </swiper>
          <!--上传支付成功截图-->
          <view class="pay-title"> 上传凭证 </view>
          <view v-if="money_all?.total_price > Number(profile.money)">
            <view class="payment">
              <view class="upload" @tap="uploadSuccessImage">
                <image class="image" :src="Pay_image.full_url" v-if="Pay_image?.url" />
                <view class="add_img"> + </view>
              </view>
            </view>
            <text class="allMsg">点击上传支付成功截图</text>
          </view>
        </view>
      </view>

      <!--上传支付成功截图-->

      <view class="buttons">
        <button class="button" @tap="PaySuccess">寄售</button>
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
  .radio-group {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .radio1 {
      width: 30rpx;
      height: 30rpx;
    }
    .text2 {
      font-size: 28rpx;
      font-weight: 500;
      color: #333333;
    }
  }
}
.pay_score {
  margin: 20rpx 30rpx;
  height: 100rpx;
  display: flex;
  background-color: #fff;
  border-radius: 20rpx;
  justify-content: space-between;
  align-items: center;
  padding: 0 30rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #555;
}
.overview {
  line-height: 1;
  padding: 20rpx 0;
  color: #555;
  background-color: #efeeee;

  .main {
    margin: 30rpx;
    .main-list {
      border-radius: 20rpx;
      overflow: hidden;
      background-color: #fff;
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
      .list-money {
        padding-top: 20rpx !important;
        margin-top: 20rpx;
        border-top: 2rpx dashed #ccc;
      }
      .list {
        display: flex;
        justify-content: space-between;
        padding: 10rpx 0rpx;

        .symbol {
          color: #ff552c;
          font-size: 36rpx;
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
  }
  .shipment {
    line-height: 1.4;
    padding: 0 20rpx;
    margin: 0rpx 30rpx 0;
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
  }
  .overpay {
    width: 100%;
    display: flex;
    //居中
    justify-content: center;
    align-items: center;
    .pay {
      width: 80%;
      height: 400rpx;
      background-color: #ffffff;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      .text {
        width: 100%;
        height: 200rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        .text1 {
          width: 100%;
          font-size: 28rpx;
          font-weight: 500;
          text-align: center;
        }
      }
      .money {
        width: 100%;
        height: 100rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        .money1 {
          width: 100%;
          font-size: 42rpx;
          font-weight: 500;
          text-align: center;
        }
      }
    }
  }
  .pay-title {
    //height: 500rpx;
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

  .status {
    font-size: 36rpx;
    font-weight: 500;
    text-align: center;
  }

  .status::before {
    display: block;
    font-size: 110rpx;
    margin-bottom: 20rpx;
  }

  .buttons {
    height: 60rpx;
    line-height: 60rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 60rpx;
  }

  .button {
    text-align: center;
    margin: 0 10rpx;
    font-size: 28rpx;
    color: #555;

    &:first-child {
      width: 200rpx;
      border-radius: 64rpx;
      border: 1rpx solid #555;
    }
  }
}
.tabs-content::-webkit-scrollbar {
  width: 0px;
}

/* 滚动槽 */
.tabs-content::-webkit-scrollbar-track {
  -webkit-box-shadow: insetee6pxrgba(0, 0, 0, 0);
  border-radius: 0px;
}

/* 滚动条滑块 */
.tabs-content::-webkit-scrollbar-thumb {
  border-radius: 0px;
  background: rgba(0, 0, 0, 0);
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
    transition: transform 0.5s ease;

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

// swiper
.swiper {
  height: 440rpx;
  background-color: #fff;
}
</style>
