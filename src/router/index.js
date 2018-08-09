import Vue from 'vue'
import Router from 'vue-router'
import index from '@/view/index/index'
import success from '@/view/index/success'
import weixin from '@/view/index/weixin'
import bootpage from '@/view/index/bootpage'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'index',
    component: index
  }, {
    path: '/success',
    name: 'success',
    component: success
  }, {
    path: '/weixin',
    name: '正在登录',
    component: weixin
  }, {
    path: '/bootpage',
    name: '支付宝引导页',
    component: bootpage
  }]
})
