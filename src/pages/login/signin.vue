<script setup lang="ts">
import { postLoginWxMinAPI, postSigninAPI } from '@/services/login'
import { useMemberStore } from '@/stores'
import type { LoginResult } from '@/types/member'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import type { SigninParams } from '@/services/login'

// 获取页面参数
const query = defineProps<{
  invite_code: string
}>()

onLoad(() => {
  if (query.invite_code) {
    profile_re.value!.invite_code = query.invite_code
  }
})

var profile_re = ref({} as SigninParams)
const onAvatarChange = () => {
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
              profile_re.value!.image = JSON.parse(res.data).data.file.full_url
              profile_re.value!.avatar = JSON.parse(res.data).data.file.url
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

const register = async () => {
  var data = {
    mobile: profile_re.value.mobile,
    password: profile_re.value.password,
    nickname: profile_re.value.nickname,
    invite_code: profile_re.value.invite_code,
    keep: true,
    captchaId: 0,
    avatar: profile_re.value.avatar,
  }
  const res = await postSigninAPI(data)
  loginSuccess(res.data)
}

const loginSuccess = (profile: LoginResult) => {
  // 保存会员信息
  const memberStore = useMemberStore()
  memberStore.setProfile(profile)
  // 成功提示
  console.log(memberStore)
  uni.showToast({ icon: 'success', title: '登录成功' })
  setTimeout(() => {
    //页面跳转
    uni.switchTab({ url: '/pages/my/my' })
    //uni.navigateBack()
  }, 500)
}
</script>

<template>
  <!-- 注册-->
  <view class="viewport">
    <!-- 头像 -->
		<view class="main">
			<view class="title">
				<view>您好，</view>
				<view>欢迎来到玉珊阁</view>
			</view>
			<view class="login-text">
				<view class="login-title">
					注册
				</view>
				<view class="text-border"></view>
			</view>
		</view>
    <view class="avatar" v-if="profile_re.image">
      <view @tap="onAvatarChange" class="avatar-content">
        <image class="image" :src="profile_re?.image" mode="aspectFill" />
        <text class="text">点击上传头像</text>
      </view>
    </view>
    <view class="avatar" v-else>
      <view @tap="onAvatarChange" class="avatar-content">
        <image class="image" src="@/static/images/moren.jpg" mode="aspectFill" />
        <text class="text">点击上传头像</text>
      </view>
    </view>
    <view class="login">
      <!-- 网页端注册 -->
			<view class="login-tips">手机号</view>
      <input
        class="input"
        type="text"
        placeholder="请输入用户名/手机号码"
        v-model="profile_re.mobile"
      />
			<view class="login-tips">登录密码</view>
      <input
        class="input"
        type="password"
        password
        placeholder="请输入密码"
        v-model="profile_re.password"
      />
			<view class="login-tips">用户昵称</view>
      <input class="input" type="text" placeholder="请输入呢称" v-model="profile_re.nickname" />
      <!-- <input
        class="input"
        type="text"
        placeholder="请输入邀请码码"
        v-model="profile_re.invite_code"
      /> -->
      <button :class="(profile_re.mobile && profile_re.image && profile_re.password && profile_re.nickname)?'button phone':'button wechat'" class="button phone" @tap="register">注册</button>
    </view>
    <view class="tips">登录/注册即视为你同意《服务条款》</view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
  
}
.viewport {
  width: 100%;
  height: 100%;
	margin: 100rpx 30rpx 0rpx;
	.main {
		margin: 0rpx 30rpx 40rpx;
		font-size: 36rpx;
		font-weight: 700;
		color: #555;
		line-height: 60rpx;
		.login-text {
			margin-top: 60rpx;
			padding-left: 10rpx;
			position: relative;
			.login-title {
				position: relative;
				z-index: 9;
			}
			.text-border {
				width: 100rpx;
				height: 15rpx;
				background-color: #11e0b6;
				position: absolute;
				bottom: 5rpx;
				left: 0rpx;
				z-index: 3;
			}
		}
	}
  .avatar {
    text-align: center;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .image {
      width: 100rpx;
      height: 100rpx;
	  border-radius: 10rpx;
      background-color: #eee;
    }

    .text {
      display: block;
      padding-top: 20rpx;
      line-height: 1;
      font-size: 26rpx;
      color: #799372;
    }
  }
  .login {
    width: 90%;
    display: flex;
    flex-direction: column;
    height: 50vh;
    padding: 10rpx 20rpx 20rpx;
		.login-tips {
			font-size: 26rpx;
			margin-top: 20rpx;
			color: #555;
			font-weight: 700;
		}
  .input {
    width: 100%;
    height: 80rpx;
    font-size: 28rpx;
    border-bottom: 1px solid #eeee;
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
    color: #fff;
	margin-top: 100rpx;
	transition: all ease 0.5s;
    .icon {
      font-size: 40rpx;
      margin-right: 6rpx;
    }
  }

  .phone {
    background-color: #11e0b6;
  }

  .wechat {
    background-color: #ccc;
  }

  }
  .tips {
    width: 100%;
    height: 100rpx;
    margin-top: 20rpx;
    font-size: 30rpx;
    color: #999999;
    text-align: center;
  }
}
</style>
