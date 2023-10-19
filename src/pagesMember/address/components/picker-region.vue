<template>
  <view>
    <!-- 省市区3级联动组件 -->
    <picker
      mode="multiSelector"
      :value="multiIndex"
      :range="multiArray"
      @change="handleValueChange"
      @columnchange="handleColumnChange"
    >
      <slot></slot>
    </picker>
  </view>
</template>

<script setup lang="ts">
// 省市区数据
import { getRegionAPI } from '@/services/address'
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

//获取区域数据
const getRegionData = async () => {
  const res = await getRegionAPI()
  regionData.value = res.data
}

// 页面加载
onLoad(() => {
  getRegionData()
})
// const regionData = uni.getStorageSync('regionData');

export default {
  data() {
    return {
      cityArr: regionData[0].child,
      districtArr: regionData[0].child[0].child,
      multiIndex: [0, 0, 0],
      isInitMultiArray: true,
    }
  },
  methods: {
    // 某一列的值改变时触发 columnchange 事件
    handleColumnChange(e) {
      // console.log(e);
      let _this = this
      _this.isInitMultiArray = false
      let col = e.detail.column
      let row = e.detail.value
      _this.multiIndex[col] = row
      try {
        switch (col) {
          case 0:
            if (regionData[_this.multiIndex[0]].child.length == 0) {
              _this.cityArr = _this.districtArr = [regionData[_this.multiIndex[0]]]
              break
            }
            _this.cityArr = regionData[_this.multiIndex[0]].child
            _this.districtArr = regionData[_this.multiIndex[0]].child[_this.multiIndex[1]].child
            break
          case 1:
            _this.districtArr = regionData[_this.multiIndex[0]].child[_this.multiIndex[1]].child
            break
          case 2:
            break
        }
      } catch (e) {
        // console.log(e);
        _this.districtArr = regionData[_this.multiIndex[0]].child[0].child
      }
    },

    // value 改变时触发 change 事件
    handleValueChange(e) {
      // console.log(e);
      // 结构赋值
      let _this = this
      let [index0, index1, index2] = e.detail.value
      let [arr0, arr1, arr2] = _this.pickedArr
      let address = [arr0[index0], arr1[index1], arr2[index2]]
      // console.log(address);
      _this.$emit('getRegion', address)
    },
  },
  computed: {
    multiArray() {
      return this.pickedArr.map((arr) => arr.map((item) => item.name))
    },
    pickedArr() {
      // 进行初始化
      if (this.isInitMultiArray) {
        return [regionData, regionData[0].child, regionData[0].child[0].child]
      }
      return [regionData, this.cityArr, this.districtArr]
    },
  },
}
</script>
