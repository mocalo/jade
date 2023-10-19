<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { getPayAddressAPI, postPayAddressAPI, postPayUpdateAPI } from '@/services/payAddress'
import type { PayAddressRes } from '@/types/payAddress'

// 获取页面参数
const query = defineProps<{
  payFlag: number
}>()
const addflag = ref(false)
//根据当前收款type获取当前用户的收款方式
const payAddress = ref({} as PayAddressRes)
const password = ref('')
const getPayAddress = async () => {
  var payment_type = ''
  if (query.payFlag == 1) {
    payment_type = 'bank'
  } else if (query.payFlag == 2) {
    payment_type = 'alipay'
  } else if (query.payFlag == 3) {
    payment_type = 'wechat'
  }
  var data = {
    payment_type: payment_type,
  }
  const res = await getPayAddressAPI(data)
  if (res.data != null) {
    addflag.value = true
    payAddress.value = res.data
    if (payAddress.value.qrcode_url != null) {
      payAddress.value.qrcode_image = payAddress.value.qrcode_url
    }
  }
}
//保存银行卡
const addBank = async () => {
  var data = {
    payment_type: 'bank',
    name: payAddress.value.name,
    bank_name: payAddress.value.bank_name,
    bank_no: payAddress.value.bank_no,
    bank_address: payAddress.value.bank_address,
    qrcode_url: payAddress.value.qrcode_url,
    password: password.value,
  }
  if (addflag.value == false) {
    const res = await postPayAddressAPI(data)
    uni.showToast({
      title: '添加成功',
      icon: 'none',
    })
    addflag.value = true
  } else {
    const res = await postPayUpdateAPI(data)
    uni.showToast({
      title: '修改成功',
      icon: 'none',
    })
  }
}
//保存支付宝
const addAlipay = async () => {
  var data = {
    payment_type: 'alipay',
    name: payAddress.value.name,
    bank_name: payAddress.value.bank_name,
    bank_no: payAddress.value.bank_no,
    bank_address: payAddress.value.bank_address,
    qrcode_url: payAddress.value.qrcode_url,
    password: password.value,
  }

  if (addflag.value == false) {
    const res = await postPayAddressAPI(data)
    uni.showToast({
      title: '添加成功',
      icon: 'none',
    })
    addflag.value = true
  } else {
    const res = await postPayUpdateAPI(data)
    uni.showToast({
      title: '修改成功',
      icon: 'none',
    })
  }
}
//保存微信
const addWechat = async () => {
  var data = {
    payment_type: 'wechat',
    name: payAddress.value.name,
    bank_name: payAddress.value.bank_name,
    bank_no: payAddress.value.bank_no,
    bank_address: payAddress.value.bank_address,
    password: password.value,
    qrcode_url: payAddress.value.qrcode_url,
  }
  if (addflag.value == false) {
    const res = await postPayAddressAPI(data)
    uni.showToast({
      title: '添加成功',
      icon: 'none',
    })
    addflag.value = true
  } else {
    const res = await postPayUpdateAPI(data)
    uni.showToast({
      title: '修改成功',
      icon: 'none',
    })
  }
}

//上传图片
const uploadImage = async (e: any) => {
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
              payAddress.value!.qrcode_image = JSON.parse(res.data).data.file.full_url
              payAddress.value!.qrcode_url = JSON.parse(res.data).data.file.url
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

//挂件加载完成
onLoad(() => {
  getPayAddress()
})
</script>

<template>
  <view class="viewport">
    <view class="login" v-if="query.payFlag == 1">
      <!-- 网页端表单登录 -->
      <view class="all">
        <text class="title">姓名</text>
        <input class="input" type="text" placeholder="请输入姓名" v-model="payAddress.name" />
      </view>

      <view class="all">
        <text class="title">银行</text>
        <input class="input" type="text" placeholder="请输入银行" v-model="payAddress.bank_name" />
      </view>

      <view class="all">
        <text class="title">卡号</text>
        <input
          class="input"
          type="text"
          placeholder="请输入银行卡号"
          v-model="payAddress.bank_no"
        />
      </view>

      <view class="all">
        <text class="title">开户行</text>
        <input
          class="input"
          type="text"
          placeholder="请输入银行开户行"
          v-model="payAddress.bank_address"
        />
      </view>
      <view class="all1">
        <text class="title1">二级密码</text>
        <input class="input" type="password" placeholder="请输入二级密码" v-model="password" />
      </view>
      <button class="button phone" @tap="addBank">保存</button>
    </view>
    <view class="login" v-if="query.payFlag == 2">
      <!-- 网页端表单登录 -->
      <view class="alipay" @tap="uploadImage">
        <image :src="payAddress?.qrcode_image" class="image" />
        <!-- <image
          class="image"
          src="@/static/images/add.png"
          v-if="payAddress == null || payAddress.qrcode_url == null"
        /> -->
      </view>
      <view class="all1">
        <text class="title1">二级密码</text>
        <input class="input" type="password" placeholder="请输入二级密码" v-model="password" />
      </view>
      <button class="button phone" @tap="addAlipay">保存</button>
    </view>
    <view class="login" v-if="query.payFlag == 3">
      <!-- 网页端表单登录 -->
      <view class="weixin" @tap="uploadImage">
        <image :src="payAddress?.qrcode_image" class="image" />
        <!-- <image
          class="image"
          src="@/static/images/add.png"
          v-if="payAddress == null || payAddress.qrcode_url == null"
        /> -->
      </view>
      <view class="all1">
        <text class="title1">二级密码</text>
        <input class="input" type="password" placeholder="请输入二级密码" v-model="password" />
      </view>
      <button class="button phone" @tap="addWechat">保存</button>
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
  padding: 20rpx 40rpx;
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
.alipay {
  width: 300rpx;
  height: 300rpx;
  border: 1px dashed #dcdcdc;
  .image {
    width: 100%;
    height: 100%;
  }
}
.weixin {
  width: 300rpx;
  height: 300rpx;
  border: 1px dashed #dcdcdc;
  border-radius: 10rpx;
  .image {
    width: 100%;
    height: 100%;
  }
}
.login {
  display: flex;
  flex-direction: column;
  height: 60vh;
  padding: 40rpx 20rpx 20rpx;
  align-items: center;
  .all {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .all1 {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 20rpx;
  }
  .title1 {
    width: 20%;
    font-size: 28rpx;
    border-radius: 72rpx;
    padding: 0rpx 20rpx 0 20rpx;
    margin-bottom: 20rpx;
  }
  .input {
    width: 100%;
    height: 80rpx;
    font-size: 28rpx;
    border-radius: 72rpx;
    border: 1px solid #ddd;
    padding-left: 30rpx;
    margin-bottom: 20rpx;
  }
  .title {
    width: 20%;
    font-size: 28rpx;
    border-radius: 72rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
  }

  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80rpx;
    font-size: 28rpx;
    border-radius: 72rpx;
    margin-top: 20rpx;
    color: #fff;
    .icon {
      font-size: 40rpx;
      margin-right: 6rpx;
    }
  }

  .phone {
    background-color: #799372;
  }

  .wechat {
    background-color: #799372;
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
