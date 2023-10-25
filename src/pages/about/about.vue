<script setup lang="ts">
import { getArticleByTypeAPI } from '@/services/home'
import type { ArticleItem } from '@/types/home'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

//获取说明文档
const artList = ref<ArticleItem[]>([])
const getCommissionData = async () => {
  var tag = 'about'

  const res = await getArticleByTypeAPI(tag)
  artList.value = res.data
}
onLoad(async () => {
  await getCommissionData()
})
</script>

<template>
  <view class="viewport">
    <view class="logo-main">
      <image class="logo-image" src="../../static/images/logo_icon.png" mode="widthFix"></image>
    </view>
    <view class="logo">
      <rich-text :nodes="artList[0]?.art_content"></rich-text>
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
.tips {
  text-align: center;
  color: #999;
  font-size: 24rpx;
  margin-top: 20rpx;
}
</style>
