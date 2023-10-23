<script setup lang="ts">
import { getArticleByTypeAPI } from '@/services/home'
import type { ArticleItem } from '@/types/home'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

//获取说明文档
const artList = ref<ArticleItem[]>([])
const getCommissionData = async () => {
  var tag = 'invite_welfare'

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
  height: 100%;
	.logo-main {
		width: 40%;
		margin: 40rpx auto;
		min-height: 200rpx;
		background-color: #fff;
		border-radius: 20rpx;
		box-shadow: 0rpx 10rpx 35rpx 10rpx #e6e6e6;
		align-items: center;
		font-weight: 700;
		font-size: 42rpx;
		color: #555;
		.logo-image {
			width: 100%;
		}	
	}
}

.logo {
  margin: 20rpx 0 0 0;
  padding: 40rpx;
	font-weight: 500;
	line-height: 50rpx;
  .image {
    width: 100%;
  }
}
.tips {
  text-align: center;
  color: #999;
  font-size: 24rpx;
  margin-top: 20rpx;
}
</style>
