<script setup lang="ts">
import { ref } from 'vue'
import { useMemberStore } from '@/stores'
import { getMemberInviteAPI } from '@/services/profile'
import { onLoad } from '@dcloudio/uni-app'
// 获取会员信息
const memberStore = useMemberStore()
//判断是否登录，没有登录则跳转到登录页面
if (!memberStore.profile) {
  uni.navigateTo({
    url: '/pages/login/login',
  })
}

//获取我的邀请链接
const inviteUrl = ref<{ link: string; qrcode: string }>()
const getInviteUrl = async () => {
  const res = await getMemberInviteAPI()
  inviteUrl.value = res.data
}

const copyCode = () => {
  uni.setClipboardData({
    data: inviteUrl.value!.link,
    success: function () {
      uni.showToast({
        title: '复制成功',
        icon: 'none',
        duration: 2000,
      })
    },
  })
}

const copyQrcode = () => {
  console.log(inviteUrl.value!.qrcode)
  uni.downloadFile({
    url: inviteUrl.value!.qrcode,
    success: (res) => {
      if (res.statusCode === 200) {
        uni.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function () {
            uni.showToast({
              title: '保存成功',
              icon: 'none',
              duration: 2000,
            })
          },
          fail: (fail) => {
            uni.showToast({
              title: '保存失败',
              icon: 'none',
              duration: 2000,
            })
          },
        })
      }
    },
    fail: (fail) => {
      uni.showToast({
        title: '下载到本地失败',
        icon: 'none',
        duration: 2000,
      })
    },
  })
}

onLoad(() => {
  getInviteUrl()
})
</script>

<template>
  <view class="invite">
    <view>
      <view class="qrcode">
        <image :src="inviteUrl?.qrcode" mode="widthFix"></image>
      </view>
      <view class="title">
        <text>{{ inviteUrl?.link }} </text>
      </view>
      <view class="btn">
        <!-- <view @tap="copyQrcode" class="button">保存二维码</view> -->
        <view @tap="copyCode" class="button">复制邀请码</view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
  //overflow: hidden;
  background-color: #f3f2f2;
}

.qrcode {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  text-align: center;
  margin: 100rpx 0 0 0;
  img {
    width: 80%;
    height: 80%;
  }
}
.invite {
  //宽高100%
  width: 100%;
  height: 100%;
}
.title {
  width: 100%;
  line-height: 100rpx;
  text-align: center;
  font-size: 16rpx;
  font-weight: bold;
  color: #799372;
}
.btn {
  display: flex;
  justify-content: space-around;
  align-items: center;
  .button {
    width: 200rpx;
    height: 60rpx;
    line-height: 60rpx;
    text-align: center;
    border-radius: 30rpx;
    font-size: 16rpx;
    color: #fff;
    background-color: #799372;
  }
}
</style>
