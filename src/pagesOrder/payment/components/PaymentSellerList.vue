<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref, useSSRContext } from 'vue'
import { getPayAgencyAPI } from '@/services/payAddress'
import type { PayAddressRes } from '@/types/payAddress'
import type { OrderResult } from '@/types/order'
import { getMemberOrderByIdAPI } from '@/services/order'

// 获取页面参数
const query = defineProps<{
  payFlag: number
  orderId: number
}>()

//根据orderId获取order
const order = ref({} as OrderResult)
const getOrder = async () => {
  const res = await getMemberOrderByIdAPI(query.orderId)
  console.log(res.data)
  order.value = res.data
}

//根据当前收款type获取当前用户的收款方式
const payAddress = ref({} as PayAddressRes)
const getPayAddress = async () => {
  var payment_type = ''
  if (query.payFlag == 1) {
    payment_type = 'bank'
  } else if (query.payFlag == 2) {
    payment_type = 'alipay'
  } else if (query.payFlag == 3) {
    payment_type = 'wechat'
  } else if (query.payFlag == 4) {
    payment_type = 'bnbusdt'
  } else if (query.payFlag == 5) {
    payment_type = 'trcusdt'
  }
  console.log(query.orderId)
  console.log(order.value)
  var data = {
    payment_type: payment_type,
  }
  const res = await getPayAgencyAPI(data)
  // eslint-disable-next-line no-empty
  if (res.data == null) {
  } else {
    payAddress.value = res.data
  }
}
//复制
const copyname = (name: string) => {
  uni.setClipboardData({
    data: name,
    success: function () {
      uni.showToast({
        title: '复制成功',
        icon: 'none',
        duration: 2000,
      })
    },
  })
}

// 点击图片时
const onTapImage = (url: string) => {
  // 大图预览
  uni.previewImage({
    current: url,
    urls: [url],
  })
}

//挂件加载完成
onLoad(async () => {
  await getOrder()
  await getPayAddress()
})
</script>

<template>
  <view class="viewport">
    <view class="login" v-if="query.payFlag == 1">
      <!-- 网页端表单登录 -->
      <view class="all">
        <text class="all_text">姓名</text>
        <text class="input">{{ payAddress.name }}</text>
        <view class="btn" @click="copyname(payAddress?.name)">复制</view>
      </view>

      <view class="all">
        <text class="all_text">银行</text>
        <text class="input">{{ payAddress.bank_name }}</text>
        <view class="btn" @click="copyname(payAddress?.bank_name)">复制</view>
      </view>

      <view class="all">
        <text class="all_text">卡号</text>
        <text class="input">{{ payAddress.bank_no }}</text>
        <view class="btn" @click="copyname(payAddress?.bank_no)">复制</view>
      </view>

      <view class="all">
        <text class="all_text">开户行</text>
        <text class="input">{{ payAddress.bank_address }}</text>
        <view class="btn" @click="copyname(payAddress?.bank_address)">复制</view>
      </view>
    </view>
    <view class="login" v-if="query.payFlag == 2">
      <!-- 网页端表单登录 -->
      <view class="alipay">
        <image
          :src="payAddress.qrcode_url"
          class="image"
          @tap="onTapImage(payAddress.qrcode_url)"
        />
      </view>
    </view>
    <view class="login" v-if="query.payFlag == 3">
      <!-- 网页端表单登录 -->
      <view class="weixin">
        <image
          :src="payAddress.qrcode_url"
          class="image"
          @tap="onTapImage(payAddress.qrcode_url)"
        />
      </view>
    </view>

    <view class="login" v-if="query.payFlag == 4">
      <!-- 数字货币通道1 -->
      <view class="weixin">
        <image
          :src="payAddress?.qrcode_url"
          class="image"
          @tap="onTapImage(payAddress?.qrcode_url)"
        />
      </view>
      <view class="all">
        <text class="input1">{{ payAddress?.address }}</text>
        <view class="btn" @click="copyname(payAddress?.address)">复制</view>
      </view>
    </view>
    <view class="login" v-if="query.payFlag == 5">
      <!-- 数字货币通道2 -->
      <view class="weixin">
        <image
          :src="payAddress?.qrcode_url"
          class="image"
          @tap="onTapImage(payAddress?.qrcode_url)"
        />
      </view>
      <view class="all">
        <text class="input1">{{ payAddress?.address }}</text>
        <view class="btn" @click="copyname(payAddress?.address)">复制</view>
      </view>
      <!-- <view class="weixin" v-else">
	  <image src="payAddress?.qrcode_url" class="image" />
	</view> -->
    </view>
  </view>
</template>
<style lang="scss">
page {
  height: 100%;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  // padding: 20rpx 40rpx;
}

.logo {
  flex: 1;
  text-align: center;

  image {
    width: 520rpx;
    height: 220rpx;
    margin-top: 15vh;
  }
}

.login {
  display: flex;
  flex-direction: column;
  height: 50vh;
  background-color: #fff;

  .all {
    margin: 0rpx 35rpx;
    display: flex;
    justify-content: center;
    .all_text {
      width: 160rpx;
      font-size: 28rpx;
      height: 40rpx;
      line-height: 40rpx;
      position: relative;
      top: 12rpx;
    }
  }

  .input {
    width: 70%;
    overflow: hidden;
    font-size: 28rpx;
    padding: 20rpx 0rpx 0rpx 0rpx;
    margin-bottom: 20rpx;
    text-align: left;
    color: #333;
    word-wrap: break-word;
    //border: 1px solid #799372;
  }

  .input1 {
    width: 100%;
    overflow: hidden;
    font-size: 28rpx;
    padding: 20rpx 0rpx 0rpx 0rpx;
    margin-bottom: 20rpx;
    text-align: left;
    color: #333;
    word-wrap: break-word;
    //border: 1px solid #799372;
  }

  .btn {
    width: 30%;
    height: 60rpx;
    font-size: 28rpx;
    border-radius: 72rpx;
    padding: 20rpx 0rpx 0rpx 0rpx;
    //实线框
    background-color: #fff;
    text-align: center;
    color: #333;
  }

  .title {
    width: 34%;
    font-size: 28rpx;
    border-radius: 72rpx;
    padding: 20rpx 30rpx 0rpx 0rpx;
    margin-bottom: 20rpx;
    color: #333;
  }

  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80rpx;
    font-size: 28rpx;
    border-radius: 72rpx;
    color: #fff;

    .icon {
      font-size: 40rpx;
      margin-right: 6rpx;
    }
  }

  .alipay {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .weixin {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .phone {
    background-color: #333;
  }

  .wechat {
    background-color: #333;
  }

  .image {
    width: 300rpx;
    height: 300rpx;
  }

  .extra {
    flex: 1;
    padding: 70rpx 70rpx 0;

    .caption {
      width: 440rpx;
      line-height: 1;
      border-top: 1rpx solid #ddd;
      font-size: 26rpx;
      color: #999;
      position: relative;

      text {
        transform: translate(-40%);
        background-color: #fff;
        position: absolute;
        top: -12rpx;
        left: 50%;
      }
    }

    .options {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 70rpx;

      button {
        padding: 0;
        background-color: transparent;

        &::after {
          border: none;
        }
      }
    }

    .icon {
      font-size: 24rpx;
      color: #444;
      display: flex;
      flex-direction: column;
      align-items: center;

      &::before {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80rpx;
        height: 80rpx;
        margin-bottom: 6rpx;
        font-size: 40rpx;
        border: 1rpx solid #444;
        border-radius: 50%;
      }
    }

    .icon-weixin::before {
      border-color: #06c05f;
      color: #06c05f;
    }
  }
}

.tips {
  position: absolute;
  bottom: 80rpx;
  left: 20rpx;
  right: 20rpx;
  font-size: 22rpx;
  color: #999;
  text-align: center;
}
</style>
