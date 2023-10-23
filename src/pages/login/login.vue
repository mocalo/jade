<script setup lang="ts">
import { ref } from 'vue'
import { postLoginAPI, postLoginWxMinSimpleAPI } from '@/services/login'
import { useMemberStore } from '@/stores'
import type { LoginResult } from '@/types/member'
import { onLoad } from '@dcloudio/uni-app'
import type { LoginParams } from '@/services/login'

const profile_login = ref({} as LoginParams)

const phonelogin = async () => {
  var data = {
    mobile: profile_login.value.mobile,
    password: profile_login.value.password,
    keep: true,
  }

  const res = await postLoginAPI(data)
  console.log(res.data)
  loginSuccess(res.data)
}

const changePwd = () => {
  uni.navigateTo({ url: '/pages/login/changePwd' })
}

const register = () => {
  uni.navigateTo({ url: '/pages/login/signin' })
}

const loginSuccess = (profile: LoginResult) => {
  // 保存会员信息
  const memberStore = useMemberStore()
  memberStore.setProfile(profile)
  // 成功提示
  console.log(memberStore)
  uni.showToast({ icon: 'success', title: '登录成功' })
  setTimeout(() => {
    // 页面跳转
    uni.switchTab({ url: '/pages/my/my' })
  }, 500)
}

//跳转服务条款
const changeService = () => {
  uni.navigateTo({ url: '/pages/login/service' })
}
</script>

<template>
  <view class="viewport">
  <!--  <view class="logo">
      <image src="@/static/images/logo.png"></image>
    </view> -->
		<view class="main">
			<view class="title">
				<view>您好，</view>
				<view>欢迎来到玉珊阁</view>
			</view>
			<view class="login-text">
				<view class="login-title">
					登录
				</view>
				<view class="text-border"></view>
			</view>
		</view>
    <view class="login">
      <!-- 网页端表单登录 -->
      <input
        class="input"
        type="text"
        placeholder="请输入用户名/手机号码"
        v-model="profile_login.mobile"
      />
      <input
        class="input"
        type="text"
        password
        placeholder="请输入密码"
        v-model="profile_login.password"
      />
      <button :class="(profile_login.mobile && profile_login.password)?'button phone':'button wechat'" @tap="phonelogin">登录</button>
      <view class="all">
        <!--忘记密码-->
        <!-- <view class="extra" @tap="changePwd">
          <view class="caption">
            <text>忘记密码</text>
          </view>
        </view> -->
        <!--立即注册-->
        <!-- <view class="extra" @tap="register">
          <view class="caption">
            <text>立即注册</text>
          </view>
        </view> -->
      </view>

      <view class="tips"
        >登录/注册即视为你同意<text class="tips_text" @tap="changeService">《服务条款》</text></view
      >
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
.main {
	margin: 150rpx 30rpx 40rpx;
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
  height: 60vh;
  padding: 0rpx 20rpx 20rpx;

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

  .all {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20rpx;
  }

  .extra {
    flex: 1;
    padding: 10rpx 10rpx 0;
    .caption {
      width: 240rpx;
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
  .tips_text {
    color: #11e0b6;
  }
}
</style>
