<template>
  <div id="app">
    <router-view></router-view>
    <div v-transfer-dom>
      <loading :show="show" text="请稍后"></loading>
      <alert v-model="alertShow" title="提示">{{alertText}}</alert>
    </div>
  </div>
</template>

<script>
  import Bus from './api/bus.js'
  import {
    Loading,
    Alert,
    TransferDomDirective as TransferDom
  } from 'vux'
  export default {
    name: 'app',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Alert
    },
    data () {
      return {
        show: false,
        alertShow: false,
        alertText: ''
      }
    },
    created () {
      Bus.$on('loadingState', boolean => {
        this.show = boolean
      })
      Bus.$on('alertState', alertStateMap => {
        console.log(alertStateMap)
        this.alertShow = alertStateMap.boolean
        this.alertText = alertStateMap.message
      })
    }
  }
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';

html{
  height: 100%;
}
body {
  background-color: #fbf9fe;
  height: 100%;
}
#app{
  height: 100%;
}
</style>
