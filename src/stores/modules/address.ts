import type { AddressItem } from '@/types/address'
import type { Coupon, CouponResult } from '@/types/coupon'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAddressStore = defineStore('address', () => {
  const selectedAddress = ref<AddressItem>()

  const changeSelectedAddress = (val: AddressItem) => {
    selectedAddress.value = val
  }

  return {
    selectedAddress,
    changeSelectedAddress,
  }
})

export const useCouponStore = defineStore('coupon', () => {
  const selectedCoupon = ref<CouponResult>()

  const changeSelectedCoupon = (val: CouponResult) => {
    selectedCoupon.value = val
  }

  return {
    selectedCoupon,
    changeSelectedCoupon,
  }
})
