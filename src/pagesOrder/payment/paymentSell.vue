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
}

//获取当前所需要支付的金额
const money = ref(0)
const getMoney = async () => {
  const res = await orderPaySellMoney({ id: query.id })
  money.value = Number(res.data)
}

// tabs 数据
const couponTabs = ref([
  { payFlag: 1, title: '银行卡', isRender: false },
  { payFlag: 2, title: '支付宝', isRender: false },
  { payFlag: 3, title: '微信', isRender: false },
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
      <!-- <view class="status icon-checked">支付</view> -->
      <view class="overpay">
        <view class="pay">
          <!--显示订单-->
          <view class="text">
            <text class="text1">应付金额</text>
          </view>
          <view class="money">
            <text class="money1">{{
              money - Number(profile.money) > 0 ? money - Number(profile.money) : 0
            }}</text>
          </view>
        </view>
      </view>
      <view class="pay_score">
        <view>我的佣金：{{ profile.money }}</view>
        <view>总金额：{{ money }}</view>
      </view>
      <view class="tabs">
        <text
          class="item"
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
        <view class="cursor" :style="{ left: activeIndex * 35 + '%' }"></view>
      </view>
      <!-- 滑动容器 -->
      <swiper class="swiper" :current="activeIndex" @change="activeIndex = $event.detail.current">
        <!-- 滑动项 -->
        <swiper-item v-for="item in couponTabs" :key="item.title">
          <!-- 抵扣券列表 -->
          <!-- <CouponList v-if="item.isRender" :payFlag="item.payFlag" /> -->
          <PaymentList v-if="item.isRender" :payFlag="item.payFlag" :orderId="query.id" />
        </swiper-item>
      </swiper>

      <!--上传支付成功截图-->
      <view v-if="money > Number(profile.money)">
        <view class="payment">
          <view class="upload" @tap="uploadSuccessImage">
            <image class="image" :src="Pay_image.full_url" v-if="Pay_image?.url" />
            <image class="image" src="@/static/images/add.png" v-else />
          </view>
        </view>
        <text class="allMsg">点击上传支付成功截图</text>
      </view>
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
  width: 100%;
  height: 100rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #799372;
}
.overview {
  line-height: 1;
  padding: 50rpx 0;
  color: #799372;
  background-color: #efeeee;
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
  .payment {
    width: 100%;
    height: 300rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0rpx 0;
    .upload {
      width: 300rpx;
      height: 300rpx;
      border: 1px dashed #dcdcdc;
      border-radius: 10rpx;
      .image {
        width: 300rpx;
        height: 300rpx;
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
    color: #799372;

    &:first-child {
      width: 200rpx;
      border-radius: 64rpx;
      border: 1rpx solid #799372;
    }
  }
}
// tabs
.tabs {
  display: flex;
  justify-content: space-around;
  line-height: 60rpx;
  margin: 50rpx 0rpx 10rpx;
  background-color: #fff;
  box-shadow: 0 4rpx 6rpx rgba(240, 240, 240, 0.6);
  position: relative;
  z-index: 9;

  .item {
    flex: 1;
    text-align: center;
    padding: 20rpx;
    font-size: 28rpx;
    color: #262626;
  }

  .cursor {
    position: absolute;
    left: 10%;
    bottom: 0;
    width: 30%;
    height: 6rpx;
    padding: 0 50rpx;
    background-color: #799372;
    /* 过渡效果 */
    transition: all 0.4s;
  }
}

// swiper
.swiper {
  height: 500rpx;
}
</style>
