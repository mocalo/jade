<script setup lang="ts">
import {
  getMemberAddressByIdAPI,
  postMemberAddressAPI,
  putMemberAddressByIdAPI,
  getRegionAPI,
} from '@/services/address'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import type { RegionItem } from '@/types/address'
// 表单数据
const form = ref({
  receive_name: '', // 收货人
  receive_tel: '', // 联系方式
  area_info: '', // 省市区(前端展示)
  province_id: '', // 省份编码(后端参数)
  city_id: '', // 城市编码(后端参数)
  region_id: '', // 区/县编码(后端参数)
  address: '', // 详细地址
  isDefault: 0, // 默认地址，1为是，0为否
})

const regionData = ref<RegionItem[]>([])

const isInitMultiArray = ref(true)

const multiArray = ref<RegionItem[][]>([])

const cityArray = ref<RegionItem[]>([])

const districtArr = ref<RegionItem[]>([])

const multiIndex = ref<string[]>([])

const multiArray_name = ref<string[][]>([])

const multiIndex_name = ref<number[]>([])

// 获取页面参数
const query = defineProps<{
  id?: number
}>()

//获取区域数据
const getRegionData = async () => {
  const res = await getRegionAPI()
  regionData.value = res.data
  if (query.id) {
    isInitMultiArray.value = false
    multiIndex.value = [form.value.province_id, form.value.city_id, form.value.region_id]
  }
  if (isInitMultiArray.value) {
    cityArray.value = regionData.value[0].children
    districtArr.value = regionData.value[0].children[0].children
    multiArray.value = [regionData.value, cityArray.value, districtArr.value]
    multiIndex_name.value = [0, 0, 0]
  } else {
    //cityArray.value = regionData.value[multiIndex.value[0]].children
    //districtArr.value = regionData.value[multiIndex.value[0]].children[multiIndex.value[1]].children
    //查询市
    cityArray.value =
      regionData.value.find((item) => item.id.toString() == multiIndex.value[0])?.children || []

    //查询区
    districtArr.value =
      regionData.value
        .find((item) => item.id.toString() == multiIndex.value[0])
        ?.children.find((item) => item.id.toString() == multiIndex.value[1])?.children || []
    multiArray.value = [regionData.value, cityArray.value, districtArr.value]

    //查询当前省市区
    multiIndex_name.value = [
      regionData.value.findIndex((item) => item.id.toString() == multiIndex.value[0]),
      cityArray.value.findIndex((item) => item.id.toString() == multiIndex.value[1]),
      districtArr.value.findIndex((item) => item.id.toString() == multiIndex.value[2]),
    ]
  }
  multiArray_name.value = multiArray.value.map((item) => item.map((item) => item.name))
  console.log(multiArray.value)
}

// 获取收货地址详情数据
const getMemberAddressByIdData = async () => {
  if (query.id) {
    // 发送请求
    const res = await getMemberAddressByIdAPI()
    // 把数据合并到表单中
    // Object.assign(form.value, res.data)
    form.value = res.data
  }
}

// 页面加载
onLoad(() => {
  multiIndex.value = ['1', '2', '3']

  getRegionData()
  getMemberAddressByIdData()
})

// 动态设置标题
uni.setNavigationBarTitle({ title: query.id ? '修改地址' : '新建地址' })

// 收集所在地区
const onRegionChange: UniHelper.MultiSelectorPickerOnChange = (ev) => {
  // // 省市区(前端展示)
  // form.value.area_info = ev.detail.value.join(' ')
  // // 省市区(后端参数)
  // const [province_id, city_id, region_id] = ev.detail.code!
  // // form.value.provinceCode = provinceCode
  // Object.assign(form.value, { province_id, city_id, region_id })
  console.log(ev)
  const { value } = ev.detail
  // 省市区(前端展示)
  form.value.area_info =
    regionData.value[value[0]].name +
    ' ' +
    cityArray.value[value[1]].name +
    ' ' +
    districtArr.value[value[2]].name
  // 省市区(后端参数)
  form.value.province_id = regionData.value[value[0]].id.toString()
  form.value.city_id = cityArray.value[value[1]].id.toString()
  form.value.region_id = districtArr.value[value[2]].id.toString()
}

// 某一列的值改变时触发 columnchange 事件
const handleColumnChange: UniHelper.MultiSelectorPickerOnColumnchange = (ev) => {
  const { column, value } = ev.detail
  isInitMultiArray.value = false
  console.log('开始改变', column, value)
  switch (column) {
    case 0:
      //查询市
      multiIndex.value[column] = regionData.value[value].id.toString()
      cityArray.value =
        regionData.value.find((item) => item.id.toString() == multiIndex.value[0])?.children || []
      multiIndex.value[1] = cityArray.value[0].id.toString()
      //查询区
      districtArr.value =
        regionData.value
          .find((item) => item.id.toString() == multiIndex.value[0])
          ?.children.find((item) => item.id.toString() == multiIndex.value[1])?.children || []
      multiArray.value = [regionData.value, cityArray.value, districtArr.value]
      multiIndex.value[2] = districtArr.value[0].id.toString()
      //查询当前省市区
      multiIndex_name.value = [
        regionData.value.findIndex((item) => item.id.toString() == multiIndex.value[0]),
        cityArray.value.findIndex((item) => item.id.toString() == multiIndex.value[1]),
        districtArr.value.findIndex((item) => item.id.toString() == multiIndex.value[2]),
      ]
      multiArray_name.value = multiArray.value.map((item) => item.map((item) => item.name))
      break
    case 1:
      var index = regionData.value.findIndex((item) => item.id.toString() == multiIndex.value[0])
      multiIndex.value[column] = cityArray.value[value].id.toString()
      console.log(column, multiIndex.value[1], index)
      //查询区
      districtArr.value =
        regionData.value
          .find((item) => item.id.toString() == multiIndex.value[0])
          ?.children.find((item) => item.id.toString() == multiIndex.value[1])?.children || []
      console.log(districtArr.value)
      multiArray.value = [regionData.value, cityArray.value, districtArr.value]
      multiIndex.value[2] = districtArr.value[0].id.toString()
      //查询当前省市区
      multiIndex_name.value = [
        regionData.value.findIndex((item) => item.id.toString() == multiIndex.value[0]),
        cityArray.value.findIndex((item) => item.id.toString() == multiIndex.value[1]),
        districtArr.value.findIndex((item) => item.id.toString() == multiIndex.value[2]),
      ]
      multiArray_name.value = multiArray.value.map((item) => item.map((item) => item.name))
      break
    case 2:
      multiIndex.value[column] = districtArr.value[value].id.toString()
      break
  }
}

// 收集是否默认收货地址
const onSwitchChange: UniHelper.SwitchOnChange = (ev) => {
  form.value.isDefault = ev.detail.value ? 1 : 0
}

// 定义校验规则
const rules: UniHelper.UniFormsRules = {
  receive_name: {
    rules: [{ required: true, errorMessage: '请输入收货人姓名' }],
  },
  receive_tel: {
    rules: [
      { required: true, errorMessage: '请输入联系方式' },
      { pattern: /^1[3-9]\d{9}$/, errorMessage: '手机号格式不正确' },
    ],
  },
  area_info: {
    rules: [{ required: true, errorMessage: '请选择所在地区' }],
  },
  address: {
    rules: [{ required: true, errorMessage: '请选择详细地址' }],
  },
}

// 表单组件实例
const formRef = ref<UniHelper.UniFormsInstance>()

// 提交表单
const onSubmit = async () => {
  try {
    // 表单校验
    await formRef.value?.validate?.()
    // 校验通过后再发送请求
    if (query.id) {
      // 修改地址请求
      var data = {
        id: query.id,
        ...form.value,
      }
      await putMemberAddressByIdAPI(data)
    } else {
      // 新建地址请求
      await postMemberAddressAPI(form.value)
    }
    // 成功提示
    uni.showToast({ icon: 'success', title: query.id ? '修改成功' : '添加成功' })
    // 返回上一页
    setTimeout(() => {
      uni.navigateBack()
    }, 400)
  } catch (error) {
    uni.showToast({ icon: 'error', title: '请填写完整信息' })
  }
}
</script>

<template>
  <view class="content">
    <uni-forms :rules="rules" :model="form" ref="formRef">
      <!-- 表单内容 -->
      <uni-forms-item name="receive_name" class="form-item">
        <text class="label">收货人</text>
        <input class="input" placeholder="请填写收货人姓名" v-model="form.receive_name" />
      </uni-forms-item>
      <uni-forms-item name="receive_tel" class="form-item">
        <text class="label">手机号码</text>
        <input
          class="input"
          placeholder="请填写收货人手机号码"
          :maxlength="11"
          v-model="form.receive_tel"
        />
      </uni-forms-item>
      <uni-forms-item name="area_info" class="form-item">
        <text class="label">所在地区</text>
        <picker
          @change="onRegionChange"
          class="picker"
          mode="multiSelector"
          :value="multiIndex_name"
          :range="multiArray_name"
          @columnchange="handleColumnChange"
        >
          <view v-if="form.area_info">{{ form.area_info }}</view>
          <view v-else class="placeholder">请选择省/市/区(县)</view>
        </picker>
      </uni-forms-item>
      <uni-forms-item name="address" class="form-item">
        <text class="label">详细地址</text>
        <input class="input" placeholder="街道、楼牌号等信息" v-model="form.address" />
      </uni-forms-item>
      <view class="form-item">
        <label class="label">设为默认地址</label>
        <switch
          @change="onSwitchChange"
          class="switch"
          color="#27ba9b"
          :checked="form.isDefault === 1"
        />
      </view>
    </uni-forms>
  </view>
  <!-- 提交按钮 -->
  <button @tap="onSubmit" class="button">保存并使用</button>
</template>

<style lang="scss">
page {
  background-color: #f4f4f4;
}

.content {
  margin: 20rpx 20rpx 0;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .form-item,
  .uni-forms-item {
    display: flex;
    align-items: center;
    min-height: 96rpx;
    padding: 25rpx 10rpx;
    background-color: #fff;
    font-size: 28rpx;
    border-bottom: 1rpx solid #ddd;
    position: relative;
    margin-bottom: 0;

    // 调整 uni-forms 样式
    .uni-forms-item__content {
      display: flex;
    }

    .uni-forms-item__error {
      margin-left: 200rpx;
    }

    &:last-child {
      border: none;
    }

    .label {
      width: 200rpx;
      color: #333;
    }

    .input {
      flex: 1;
      display: block;
      height: 46rpx;
    }

    .switch {
      position: absolute;
      right: -20rpx;
      transform: scale(0.8);
    }

    .picker {
      flex: 1;
    }

    .placeholder {
      color: #808080;
    }
  }
}

.button {
  height: 80rpx;
  margin: 30rpx 20rpx;
  color: #fff;
  border-radius: 80rpx;
  font-size: 30rpx;
  background-color: #27ba9b;
}
</style>
