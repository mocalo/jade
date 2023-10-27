<script setup lang="ts">
import { postMemberCartAPI } from '@/services/cart'
import { getGoodsByIdAPI } from '@/services/goods'
import type { GoodsResult } from '@/types/goods'
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import BuyPanel from './components/BuyPanel.vue'
import CartPanel from './components/CartPanel.vue'
import QiangPanel from './components/QiangPanel.vue'
import { phoneNumShow } from '@/utils/timechange'
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

// 接收页面参数
const query = defineProps<{
  id: number
  cart_type: number
}>()
// 商品信息
const localdata = ref({} as GoodsResult)
// 获取商品详情信息
const goods = ref<GoodsResult>()
const getGoodsByIdData = async () => {
  const res = await getGoodsByIdAPI(query.id)
  console.log(res.data)
  goods.value = res.data
  localdata.value = goods.value
}

// 页面加载
onLoad(() => {
  getGoodsByIdData()
})

// 轮播图变化时
const currentIndex = ref(0)
const onChange: UniHelper.SwiperOnChange = (ev) => {
  currentIndex.value = ev.detail.current
}

// 点击图片时
const onTapImage = (url: string) => {
  // 大图预览
  uni.previewImage({
    current: url,
    urls: goods.value!.goodsImages.map((item) => item.image_url),
  })
}

// uni-ui 弹出层组件 ref
const popup = ref<{
  open: (type?: UniHelper.UniPopupType) => void
  close: () => void
}>()

// 弹出层条件渲染
const popupName = ref<'address' | 'service' | 'cart' | 'buy' | 'qiang'>()
const openPopup = (name: typeof popupName.value) => {
  console.log(name)
  // 修改弹出层名称
  popupName.value = name
  popup.value?.open()
}
// 是否显示SKU组件
const isShowSku = ref(false)

// 按钮模式
enum SkuMode {
  Both = 1,
  Cart = 2,
  Buy = 3,
}
const mode = ref<SkuMode>(SkuMode.Cart)
// 打开SKU弹窗修改按钮模式
const openSkuPopup = (val: SkuMode) => {
  console.log(val)
  // 显示SKU弹窗
  isShowSku.value = true
  // 修改按钮模式
  mode.value = val
}
</script>

<template>
  <scroll-view enable-back-to-top scroll-y class="viewport">
    <!-- 基本信息 -->
    <view class="goods">
      <!-- 商品主图 -->
      <view class="preview">
        <swiper class="image-border" @change="onChange" circular>
          <swiper-item v-for="item in goods?.goodsImages" :key="item.image_url">
            <image
              class="image"
              @tap="onTapImage(item.image_url)"
              mode="scaleToFill"
              :src="item.image_url"
            />
          </swiper-item>
        </swiper>
        <view class="indicator">
          <text class="current">{{ currentIndex + 1 }}</text>
          <text class="split">/</text>
          <text class="total">{{ goods?.goodsImages.length }}</text>
        </view>
      </view>
    </view>
    <!-- 商品简介 -->
    <view class="meta">
      <view class="price">
        <text>价格</text>
        <view>
          <text class="number">¥{{ goods?.goods_price.split('.')[0] }}</text
          >.
          <text class="symbol">{{ goods?.goods_price.split('.')[1] }}</text>
        </view>
      </view>
      <view class="meta-infos">
        <view class="name ellipsis">{{ goods?.goods_name }}</view>
        <view class="desc" v-if="goods">
          <text>归属人</text>
          <text>{{ phoneNumShow(goods.belongs.mobile) }}({{ goods.belongs.nickname }})</text>
        </view>
      </view>
    </view>

    <!-- 商品详情 -->
    <view class="detail panel">
      <view class="title">
        <text>商品详情</text>
        <view class="title-bottom"></view>
      </view>
      <view class="content">
        {{ goods?.goods_content ? goods?.goods_content : '暂无详情' }}
      </view>
    </view>
  </scroll-view>

  <!-- 用户操作 -->
  <view class="toolbar" v-if="cart_type == 0">
    <view class="buttons1">
      <!-- <view @tap="openPopup('cart')" class="addcart"> 加入购物车 </view>
      <view @tap="openPopup('buy')" class="payment"> 立即购买 </view> -->
    </view>
  </view>

  <view class="toolbar" v-if="cart_type == 1">
    <view class="buttons" v-if="goods?.goods_stock > 0">
      <view @tap="openPopup('qiang')" class="payment1"> 立即抢购 </view>
    </view>
    <view class="buttons" v-if="goods?.goods_stock <= 0">
      <view class="payment1"> 已售罄 </view>
    </view>
  </view>

  <!-- uni-ui 弹出层 -->
  <uni-popup ref="popup" type="bottom" background-color="#fff">
    <!-- <AddressPanel v-if="popupName === 'address'" @close="popup?.close()" /> -->
    <!-- <ServicePanel v-if="popupName === 'service'" @close="popup?.close()" /> -->
    <BuyPanel v-if="popupName === 'buy'" @close="popup?.close()" :goods="localdata" />
    <CartPanel v-if="popupName === 'cart'" @close="popup?.close()" :goods="localdata" />
    <QiangPanel v-if="popupName === 'qiang'" @close="popup?.close()" :goods="localdata" />
  </uni-popup>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.viewport {
  height: 90%;
  background-color: #f4f4f4;
}

.popup {
  height: 40%;
}

.panel {
  margin-top: -20rpx;
  // background-color: #fff;

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 90rpx;
    line-height: 1;
    padding: 30rpx 60rpx 30rpx 26rpx;
    position: relative;

    text {
      padding-left: 10rpx;
      font-size: 32rpx;
      color: #333;
      font-weight: 700;
      position: relative;
      z-index: 9;
    }
    .title-bottom {
      width: 60rpx;
      height: 12rpx;
      background-color: #638ef4;
      position: absolute;
      left: 68rpx;
      top: 53rpx;
    }
    navigator {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.arrow {
  &::after {
    position: absolute;
    top: 50%;
    right: 30rpx;
    content: '\e6c2';
    color: #ccc;
    font-family: 'erabbit' !important;
    font-size: 32rpx;
    transform: translateY(-50%);
  }
}

/* 商品信息 */
.goods {
  background-image: url(../../static/images/shop_bg.png);
  background-size: 100% 100%;
  padding: 40rpx 40rpx 60rpx;

  .preview {
    height: 650rpx;
    position: relative;

    .image {
      width: 100%;
      height: 700rpx;
    }

    .image-border {
      border-radius: 30rpx;
      overflow: hidden;
      border: 5rpx solid #f8bf87;
    }

    .indicator {
      height: 40rpx;
      padding: 0 24rpx;
      line-height: 40rpx;
      border-radius: 30rpx;
      color: #fff;
      font-family: Arial, Helvetica, sans-serif;
      background-color: rgba(0, 0, 0, 0.3);
      position: absolute;
      bottom: 30rpx;
      right: 30rpx;

      .current {
        font-size: 26rpx;
      }

      .split {
        font-size: 24rpx;
        margin: 0 1rpx 0 2rpx;
      }

      .total {
        font-size: 24rpx;
      }
    }
  }
}

.meta {
  position: relative;
  border-bottom: 1rpx solid #eaeaea;
  margin: -40rpx 40rpx 0rpx;

  .price {
    height: 130rpx;
    padding: 25rpx 30rpx 0;
    color: #fff;
    font-size: 28rpx;
    box-sizing: border-box;
    background-color: #000000;
    border-radius: 30rpx 30rpx 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    padding-bottom: 40rpx;
    top: 40rpx;
  }

  .meta-infos {
    position: relative;
    z-index: 9;
    height: 200rpx;
    border-radius: 30rpx;
    padding: 20rpx 20rpx;
    background-image: url(../../static/images/good_bc.png);
    background-size: 100% 100%;
  }

  .number {
    font-size: 48rpx;
  }

  .brand {
    width: 160rpx;
    height: 80rpx;
    overflow: hidden;
    position: absolute;
    top: 26rpx;
    right: 30rpx;
  }

  .name {
    max-height: 88rpx;
    line-height: 1.4;
    margin: 20rpx;
    font-size: 32rpx;
    color: #333;
    font-weight: 700;
  }

  .desc {
    line-height: 1;
    padding: 10rpx 20rpx 30rpx;
    font-size: 24rpx;
    color: #777;
    display: flex;
    justify-content: space-between;
  }

  .action {
    padding-left: 20rpx;

    .item {
      height: 90rpx;
      padding-right: 60rpx;
      border-bottom: 1rpx solid #eaeaea;
      font-size: 26rpx;
      color: #333;
      position: relative;
      display: flex;
      align-items: center;

      &:last-child {
        border-bottom: 0 none;
      }
    }

    .label {
      width: 60rpx;
      color: #898b94;
      margin: 0 16rpx 0 10rpx;
    }

    .text {
      flex: 1;
      -webkit-line-clamp: 1;
    }
  }
}

/* 商品详情 */
.detail {
  margin: 10rpx 10rpx;

  .content {
    margin: 0rpx 30rpx;
    background-color: #fff;
    border-radius: 30rpx;
    font-size: 28rpx;
    min-height: 200rpx;
    padding: 20rpx 40rpx;
    .image {
      width: 100%;
    }
  }

  .properties {
    padding: 0 20rpx;
    margin-bottom: 30rpx;

    .item {
      display: flex;
      line-height: 2;
      padding: 10rpx;
      font-size: 26rpx;
      color: #333;
      border-bottom: 1rpx dashed #ccc;
    }

    .label {
      width: 200rpx;
    }

    .value {
      flex: 1;
    }
  }
}

/* 同类推荐 */
.similar {
  .content {
    padding: 0 20rpx 20rpx;
    background-color: #f4f4f4;
    display: flex;
    flex-wrap: wrap;

    .goods {
      width: 340rpx;
      padding: 24rpx 20rpx 20rpx;
      margin: 20rpx 7rpx;
      border-radius: 10rpx;
      background-color: #fff;
    }

    .image {
      width: 300rpx;
      height: 260rpx;
    }

    .name {
      height: 80rpx;
      margin: 10rpx 0;
      font-size: 26rpx;
      color: #262626;
    }

    .price {
      line-height: 1;
      font-size: 20rpx;
      color: #cf4444;
    }

    .number {
      font-size: 26rpx;
      margin-left: 2rpx;
    }
  }

  navigator {
    &:nth-child(even) {
      margin-right: 0;
    }
  }
}

/* 底部工具栏 */
.toolbar {
  width: 100%;
  background-color: #f3f3f3;
  height: 100rpx;
  padding: 0 20rpx;
  border-top: 1rpx solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: content-box;

  .buttons {
    display: flex;
    align-items: center;
    margin: 0 0rpx 0 30rpx;

    background-color: #333333;
    & > view {
      width: 320rpx;
      text-align: center;
      line-height: 72rpx;
      font-size: 26rpx;
      color: #fff;
      border-radius: 72rpx;
    }

    .addcart {
      background-color: #fff;
      border: 1rpx solid #333;
      color: #333;
    }

    .payment {
      background-color: #333;
      margin-left: 20rpx;
    }

    .payment1 {
      background-color: #333333;
      width: 650rpx;
    }
  }

  .buttons1 {
    display: flex;
    align-items: center;
    margin: 0 0rpx 0 30rpx;

    & > view {
      width: 320rpx;
      text-align: center;
      line-height: 72rpx;
      font-size: 26rpx;
      color: #fff;
      border-radius: 72rpx;
    }

    .addcart {
      background-color: #fff;
      border: 1rpx solid #333;
      color: #333;
    }

    .payment {
      background-color: #333;
      margin-left: 20rpx;
    }

    .payment1 {
      background-color: #333;
      width: 700rpx;
    }
  }

  .icons {
    padding-right: 10rpx;
    display: flex;
    align-items: center;
    flex: 1;

    .icons-button {
      flex: 1;
      text-align: center;
      line-height: 1.4;
      padding: 0;
      margin: 0;
      border-radius: 0;
      font-size: 20rpx;
      color: #333;
      background-color: #fff;

      &::after {
        border: none;
      }
    }

    text {
      display: block;
      font-size: 34rpx;
    }
  }
}
</style>
