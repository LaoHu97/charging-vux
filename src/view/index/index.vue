<template>
  <div>
    <x-header :left-options="{showBack: false}">支付</x-header>
    <div class="grid-container">
      <checker v-model="cashierAmount" default-item-class="default_checker" selected-item-class="selected_checker" class="row">
        <checker-item :value="item.value" v-for="(item, index) in cashierAmountList" :key="index" class="col-1">
          <p>￥{{item.value}}</p>
          <p style="font-size:12px;">充电桩</p>
        </checker-item>
      </checker>
    </div>
    <div class="pay_text">
      <p>支付完成，请点击“完成”按钮，获取验证码</p>
      <p>通过设备按键输入，点击“确定”键，启动设备</p>
    </div>
    <div class="submilt_button">
      <x-button type="primary" @click.native="submit">确定</x-button>
    </div>
    <divider>我是有底线的</divider>
    <md-cashier
      ref="cashier"
      v-model="isCashierhow"
      :channels="cashierChannels"
      :payment-amount="cashierAmount"
      payment-describe="当前支付金额"
      @pay="onCashierPay"
    ></md-cashier>
  </div>
</template>
<script>
  import Cashier from 'mand-mobile/lib/cashier'
  import { getPayOpenId, getPrepayInfo } from '../../api/index.js'
  import { Checker, CheckerItem, Flexbox, FlexboxItem, XButton, Divider, querystring } from 'vux'
  export default {
    components: {
      Checker,
      CheckerItem,
      Flexbox,
      FlexboxItem,
      XButton,
      Divider,
      [Cashier.name]: Cashier
    },
    data () {
      return {
        isCashierhow: false,
        cashierAmount: '1.00',
        cashierResult: 'success',
        data: {},
        cashierAmountList: [{
          value: '1.00'
        }, {
          value: '2.00'
        }, {
          value: '3.00'
        }, {
          value: '4.00'
        }],
        cashierResults: [
          {
            text: '支付成功',
            value: 'success'
          },
          {
            text: '支付失败',
            value: 'fail'
          }
        ],
        cashierChannels: [
          {
            icon: 'cashier-icon-2 ',
            text: '微信支付',
            value: '1'
          },
          {
            icon: 'cashier-icon-1',
            text: '支付宝支付',
            value: '2'
          }
        ]
      }
    },
    created () {
      window.addEventListener('popstate', function (e) {
        this.location.reload()
      }, false)
    },
    computed: {
      cashier () {
        return this.$refs.cashier
      }
    },
    methods: {
      submit () {
        if (!this.cashierAmount) {
          return this.$vux.toast.text('请选择金额')
        }
        this.isCashierhow = true
      },
      doPay (val) {
        this.createPay(val).then((res) => {
          let tradeNo = res.data.out_trade_no
          if (val.value === '2') {
            this.$router.push({
              path: '/bootpage',
              query: { out_trade_no: tradeNo }
            })
          } else {
            this.WeixinJSBridge(res).then(res => {
              this.cashier.next('loading', {
                text: '正在查询支付结果...'
              })
              this.timer = setTimeout(() => {
                this.$router.push({
                  path: '/success',
                  query: { out_trade_no: tradeNo }
                })
              }, 1000)
            }).catch(err => {
              console.log(err)
              this.cashierResult = 'fail'
              this.cashier.next(this.cashierResult, {
                text: '支付失败',
                buttonText: '好的'
              })
            })
          }
        }).catch(err => {
          console.log(err)
          this.cashierResult = 'fail'
          this.cashier.next(this.cashierResult, {
            text: err.message,
            buttonText: '好的'
          })
        })
      },
      WeixinJSBridge (val) {
          /* eslint-disable */
          return new Promise((resolve, reject) => {
            WeixinJSBridge.invoke('getBrandWCPayRequest', {
              "appId": val.data.appId,//公众号名称，由商户传入
              "timeStamp": val.data.timeStamp,//时间戳，自1970年以来的秒数
              "nonceStr": val.data.nonceStr,//随机串
              "package": val.data.packages,
              "signType": val.data.signType,//微信签名方式：
              "paySign": val.data.paySign//微信签名
            },function(res){
              if (res.err_msg == 'get_brand_wcpay_request:ok') {
                resolve(res)
              } else {
                reject(res)
              }
            })
          })
      },
      createPay (val) {
        this.cashier.next('loading', {
          text: '正在发起支付...'
        })
        return new Promise((resolve, reject) => {
          this.timer = setTimeout(() => {
            let para = {
              mid: this.data.mid,
              sid: this.data.storeId,
              eid: this.data.eId,
              oid: this.data.payOpenId,
              amount: this.cashierAmount,
              desc: '',
              type: val.value,
              scene: 'W',
              cardCode: '',
              cardOpenId: this.data.cardOpenId,
              cardId: '',
              discount: '',
              attach: '',
              channelOrderId: ''
            }
            getPrepayInfo(para).then(res => {
              if (res.status === 200) {
                resolve(res) 
              } else {
                reject(res)
              }
            })
          }, 2000)
        })
      },
      onCashierPay (item) {
        this.doPay(item)
      },
      getOpenid () {
        let para = querystring.parse()
        let payOpenId = sessionStorage.getItem('payOpenId')
        para.isInitCode = (!payOpenId || payOpenId === '') ? null : '1'
        para.openCode = para.code
        if (para.model === 'FT') {
          para.payOpenId = para.openid
        } else {
          para.payOpenId = payOpenId
        }
        getPayOpenId(para).then(res => {
          if (res.status === 200) {
            window.document.title = res.data.malias
            this.data = res.data
            sessionStorage.setItem('payOpenId', res.data.payOpenId)
          }
        })
      }
    },
    mounted () {
      this.getOpenid()
    }
  }
</script>
<style scoped>
.grid-container *{
  width : 100%;
  box-sizing: border-box; 
}
/*-- 清除浮动 -- */ 
.row:before,.row:after {
  content:"";
  display: table ;
  clear:both;
}
[class*='col-'] {
  float: left;
  min-height: 1px; 
  width: 36%;
  margin: 5px 6.66%;
}

.default_checker {
  text-align: center;
  border-radius: 3px;
  border: 1px solid #ccc;
  background-color: #fff;
}
.selected_checker {
  background: #FB8548;
  border-color: #fff;
  color: #fff;
}
.submilt_button{
  padding: 10px;
}
.md-example-child-cashier .md-field{
  margin-bottom: 15px
}
.pay_input{
  border-radius: 3px;
  border: 1px solid #ccc;
  background-color: #fff;
  color: #333;
}
.pay_text{
  font-size: 12px;
  color: red;
  padding-left: 10px;
  margin: 15px 0
}
</style>
<style lang="less">
  @import '../../lib/mand-mobile-class/mand-mobile.less';
  .pay_input span{
    text-align: center
  }
  .md-cashier .md-cashier-container .md-cashier-block.md-cashier-choose .choose-channel.active .choose-channel-list .choose-channel-item:nth-child(2){
    display: none!important;
  }
</style>
