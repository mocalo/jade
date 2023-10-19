<script setup lang="ts">
import { getArticleByTypeAPI } from '@/services/home'
import type { ArticleItem } from '@/types/home'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

//获取说明文档
const artList = ref<ArticleItem[]>([])
const getCommissionData = async () => {
  var tag = 'term_service'

  const res = await getArticleByTypeAPI(tag)
  artList.value = res.data
}

onLoad(async () => {
  await getCommissionData()
})
</script>

<template>
  <view class="viewport">
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
}

.logo {
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
