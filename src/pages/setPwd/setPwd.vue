<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { getIsSetPwdAPI, postSetPwdAPI } from '@/services/setPwd'

// 获取页面参数
const query = defineProps<{
  payFlag: number
}>()
const addflag = ref(false)

export type PostParams = {
  password: string
  old_password: string
  password_query: string
}

const payAddress = ref({} as PostParams)

const getPayAddress = async () => {
  var res = await getIsSetPwdAPI()
  addflag.value = res.data
}

const setMypwd = async () => {
  if (addflag.value) {
    if (payAddress.value.password == null || payAddress.value.password == '') {
      uni.showToast({
        title: '请输入二级密码',
        icon: 'none',
      })
      return
    }
    if (payAddress.value.password_query == null || payAddress.value.password_query == '') {
      uni.showToast({
        title: '请再次输入二级密码',
        icon: 'none',
      })
      return
    }
    if (payAddress.value.password != payAddress.value.password_query) {
      uni.showToast({
        title: '两次输入的密码不一致',
        icon: 'none',
      })
      return
    }
    var data = {
      old_password: payAddress.value.old_password,
      password: payAddress.value.password,
    }
    const res = await postSetPwdAPI(data)
    uni.showToast({
      title: '设置成功',
      icon: 'none',
    })
    uni.navigateBack({
      delta: 1,
    })
  } else {
    if (payAddress.value.password == null || payAddress.value.password == '') {
      uni.showToast({
        title: '请输入二级密码',
        icon: 'none',
      })
      return
    }
    var data_new = {
      old_password: payAddress.value.old_password,
      password: payAddress.value.password,
    }
    const res = await postSetPwdAPI(data_new)
    uni.showToast({
      title: '设置成功',
      icon: 'none',
    })
    //放回上一页
    uni.navigateBack({
      delta: 1,
    })
  }
}

//挂件加载完成
onLoad(() => {
  getPayAddress()
})
</script>

<template>
  <view class="viewport">
    <view class="login" v-if="addflag">
      <!-- 网页端表单登录 -->
      <view class="all">
        <text class="title">原密码</text>
        <input
          class="input"
          type="password"
          placeholder="请输入原二级密码"
          v-model="payAddress.old_password"
        />
      </view>
      <view class="all">
        <text class="title">新密码</text>
        <input
          class="input"
          type="password"
          placeholder="请输入新二级密码"
          v-model="payAddress.password"
        />
      </view>
      <view class="all">
        <text class="title">确认密码</text>
        <input
          class="input"
          type="password"
          placeholder="请再次输入二级密码"
          v-model="payAddress.password_query"
        />
      </view>
      <button class="button phone" @tap="setMypwd">保存</button>
    </view>
    <view class="login" v-else>
      <view class="all">
        <text class="title">新密码</text>
        <input
          class="input"
          type="password"
          placeholder="请输入二级密码"
          v-model="payAddress.password"
        />
      </view>

      <button class="button phone" @tap="setMypwd">保存</button>
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
  border-radius: 10rpx;
}
.weixin {
  width: 300rpx;
  height: 300rpx;
  border: 1px dashed #dcdcdc;
  border-radius: 10rpx;
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
    width: 30%;
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
  .image {
    width: 500rpx;
    height: 500rpx;
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
