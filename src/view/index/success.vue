<template>
  <div>
    <x-header>支付完成</x-header>
    <box class="success_sty">
      <div class="success_ico">
        <icon type="success" is-msg></icon>
      </div>
      <p>支付成功</p>
    </box>
    <form-preview header-label="验证码" :header-value="otpCode" :body-items="list"></form-preview>
    <box gap="10px 10px">
      <x-button type="primary" @click.native="success">完成</x-button>
    </box>
  </div>
</template>
<script>
  import { queryOtpCode } from '../../api/index.js'
  import {
    FormPreview,
    Icon,
    Box,
    XButton
  } from 'vux'

  export default {
    components: {
      FormPreview,
      Icon,
      Box,
      XButton
    },
    data () {
      return {
        list: [],
        otpCode: ''
      }
    },
    methods: {
      success () {
        this.$wechat.closeWindow()
      },
      getSuccessList () {
        let para = {
          orderId: this.$route.query.out_trade_no
        }
        queryOtpCode(para).then(res => {
          this.otpCode = res.data.otpCode
          this.list.push({
            label: '交易金额',
            value: `${res.data.amount}元`
          }, {
            label: '支付方式',
            value: res.data.pay_type === 'WX' ? '微信' : '其他'
          }, {
            label: '订单号',
            value: this.$route.query.out_trade_no
          })
        })
      }
    },
    mounted () {
      this.getSuccessList()
    }
  }
</script>
<style scoped>
.success_sty{
  padding: 25px;
  background: #fff;
}
.success_sty p{
  text-align: center
}
.success_ico{
  text-align: center
}
</style>
