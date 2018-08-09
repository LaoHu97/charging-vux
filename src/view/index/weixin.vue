<style scoped>
.qrcode_main {
  text-align: center;
  height: 100%;
  position: relative;
}
.qrcode_main p {
  line-height: 35px;
  margin: 20px 0;
  font-size: 16px;
}
.qrcode_main img {
  position: absolute;
  left: 0;
  bottom: 0;
}
</style>

<template lang="html">
  <div class="qrcode_main" v-show="qrcode">    
    <P>您还没有关注微信公众号<br>长按下方识别二维码进行关注</p>
    <img src="../../assets/ercode.png" width="100%">
  </div>
</template>
<script>
import { querystring, Qrcode, Divider, Alert } from 'vux'
import { getCardOpenid } from '../../api/index.js'
export default {
  components: {
    Qrcode,
    Divider,
    Alert
  },
  data () {
    return {
      qrcode: false
    }
  },
  methods: {

  },
  created () {
    let para = querystring.parse()
    let cardOpenId = sessionStorage.getItem('cardOpenId')
    para.isInitCode = (!cardOpenId || cardOpenId === '') ? null : '1'
    para.openid = (!cardOpenId || cardOpenId === '') ? '' : cardOpenId
    getCardOpenid(para).then(res => {
      sessionStorage.setItem('cardOpenId', res.data.cardOpenId)
      if (res.status === 200) {
        if (res.data.subscribeMp === 'Y') {
          window.location.href = res.data.getCodeUrl
        } else {
          this.qrcode = true
        }
      } else {
        this.$vux.toast.text(res.message)
      }
    })
  },
  mounted () {

  }
}
</script>
