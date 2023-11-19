<script setup lang="ts">
import { useGuessList } from '@/composables'
import { OrderState } from '@/services/constants'
import { getCouponAPI, getMyCouponAPI, postAgencyAPI } from '@/services/home'
import { getMemberOrderByIdAPI, postMemberOrderPayAPI } from '@/services/order'
import type { AgentResult } from '@/types/home'
import type { OrderResult, PayImage } from '@/types/order'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import agency_one from './components/agency_one.vue'
// 获取页面参数
const query = defineProps<{
  type: String
}>()

const Pay_image = ref<PayImage>()

const agent = ref<AgentResult>()

const agentOrder = ref<{
  id: number
  user_id: number
  order_no: string
  receive_name: string
  receive_tel: string
  area_info: string
  address: string
  order_price: number
  pay_image: string
  order_status: number
  refuse_info: string
  verify_time: number
}>()

const AgentOrderRes = ['待审核', '审核通过', '审核拒绝']

// 获取我的代理订单
const getMemberOrderById = async () => {
  const res = await getMyCouponAPI()
  agentOrder.value = res.data
}

/** 获取抵扣券详情*/
const getMemberOrderByIdData = async () => {
  var data = {
    tag: 'agent_deduction',
  }
  const res = await getCouponAPI(data)
  agent.value = res.data
}

// tabs 数据
const couponTabs = ref([
  { payFlag: 1, title: '银行卡支付', isRender: false },
  { payFlag: 2, title: '支付宝支付', isRender: false },
  { payFlag: 3, title: '微信支付', isRender: false },
  { payFlag: 4, title: 'BSC-USDT', isRender: false },
  { payFlag: 5, title: 'TRC-USDT', isRender: false },
])
const activeIndex = ref(couponTabs.value.findIndex((v) => v.payFlag === Number(query.type)))
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
  console.log(activeIndex.value)
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
  var data = {
    payment_type: payment_type,
    pay_image: Pay_image.value.url,
  }
  const res = await postAgencyAPI(data)

  uni.showToast({ icon: 'success', title: '支付成功' })
  getMemberOrderByIdData()
  getMemberOrderById()
}

//跳转我的盲盒
const findMyOrder = () => {
  uni.navigateTo({
    url: '/pages/box/box',
  })
}

onLoad(() => {
  console.log(query.type)
  couponTabs.value[activeIndex.value].isRender = true
  getMemberOrderByIdData()
  getMemberOrderById()
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
      <!-- <view class="top">
        <image class="image" src="@/static/images/agency.png" style="width: 100%; height: 950" />
      </view> -->
      <view class="overview-top">
        <view class="top-left">
          <view class="fuli">
            <view class="fuli_yu"> 抢购福利玉佩</view>
            <view class="fuli_yu"> 即可成为平台代理会员 </view>
            <view class="fuli_yu fuli_money">
              <text class="tips">代理金额:{{ agent?.money }}</text>
            </view>
            <view class="fuli_yu fuli_money">
              <text class="tips">usdt:{{ agent?.pay_usdt }}</text>
            </view>
          </view>
          <view class="fuli_yu" @tap="findMyOrder()"> 物流信息</view>
        </view>
        <view class="top-right">
          <image class="top-right-image" src="../../static/icon/zkj.png" mode="widthFix"></image>
          <view> (每人限购一次) </view>
        </view>
      </view>
      <view class="main">
        <view v-if="agentOrder" class="agent">
          代理状态：{{ AgentOrderRes[agentOrder?.order_status] }}
        </view>
        <view v-else>
          <!-- <view class="agent"> 金额：{{ agent?.money }} </view> -->
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
              <agency_one v-if="item.isRender" :payFlag="item.payFlag" />
            </swiper-item>
          </swiper>
          <!--上传支付成功截图-->
          <view class="pay-title"> 上传凭证 </view>
          <view class="payment">
            <view class="upload" @tap="uploadSuccessImage">
              <image class="image" :src="Pay_image.full_url" v-if="Pay_image?.url" />
              <view class="add_img"> + </view>
            </view>
          </view>
          <text class="allMsg">点击上传支付成功截图</text>
          <view class="buttons">
            <button class="button" @tap="PaySuccess">确认支付</button>
          </view>
        </view>
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
  background-color: #fff !important;
}

.viewport {
  background-color: #f3f4f6;
}

.fuli {
  width: 100%;
  min-height: 100rpx;
  font-size: 32rpx;
  color: #fff;
  margin: 50rpx 0rpx 10rpx;

  .fuli_yu {
    margin: 30rpx 0rpx 30rpx;

    .tips {
      font-size: 24rpx;
    }
  }

  .fuli_money {
    font-size: 40rpx;
  }
}

.top {
  width: 100%;
  height: 800rpx;
  display: flex;
  justify-content: center;
  align-items: center;

  .image {
    width: 100%;
    height: 100%;
  }
}

.agent1 {
  width: 100%;
  height: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28rpx;
  color: #799372;
  margin: 20rpx 0rpx 0rpx 0rpx;
  text-align: center;

  .button {
    width: 80%;
    height: 50rpx;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;

    .text {
      width: 100%;
    }
  }
}

.agent {
  width: 100%;
  height: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28rpx;
  color: #799372;
  margin: 50rpx 0rpx 0rpx;
}

.overview {
  line-height: 1;
  padding: 0rpx 0;
  color: #799372;
  background-color: #efeeee;

  .main {
    width: 100%;
    position: relative;
    top: -20rpx;
    background-color: #fff;
    border-radius: 50rpx 50rpx 0rpx 0rpx;
    overflow: hidden;
  }

  .overview-top {
    margin: 20rpx 35rpx 0rpx;
    background-image: linear-gradient(to right, #575759, #212123);
    border-radius: 20rpx;
    overflow: hidden;
    padding: 25rpx 25rpx 45rpx;
    display: flex;

    .top-left {
      width: 60%;
      font-size: 42rpx;
    }

    .top-right {
      width: 36%;
      padding-top: 20rpx;
      color: #ddd;
      font-size: 26rpx;
      text-align: center;

      .top-right-image {
        width: 100%;
        margin-bottom: 20rpx;
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
    line-height: 60rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 60rpx;
  }

  .button {
    text-align: center;
    margin: 0 10rpx;
    color: #799372;

    background-image: linear-gradient(to right, #575759, #212123);

    &:first-child {
      width: 600rpx;
      border-radius: 64rpx;
      height: 120rpx;
      font-size: 36rpx;
      color: #fff;

      line-height: 120rpx;
      border: 1rpx solid #799372;
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

// tabs

// swiper
.swiper {
  height: 450rpx;
  background-color: #fff;
}
</style>
