import Vue from 'vue'
import Router from 'vue-router'

// pages
import index from '@/views/index'
import storeDetail from '@/views/storeDetail'
import medDetail from '@/views/medDetail'
import medOrder from '@/views/medOrder'
import doorOrder from '@/views/doorOrder'
import shopCar from '@/views/shopCar'
import pay from '@/views/pay'

Vue.use(Router)

export default new Router({
  // base: '/wap',  //基目录
  routes: [
    // 首页
    {
      path: '/',
      name: 'index',
      component: index
    },
    // 具体药店页
    {
      path: '/storeDetail',
      name: 'storeDetail',
      component: storeDetail
    },
    // 药品页
    {
      path: '/medDetail',
      name: 'medDetail',
      component: medDetail
    },
    // 药店自提
    {
      path: '/medOrder',
      name: 'medOrder',
      component: medOrder
    },
    // 送货上门
    {
      path: '/doorOrder',
      name: 'doorOrder',
      component: doorOrder
    },
    // 购物车
    {
      path: '/shopCar',
      name: 'shopCar',
      component: shopCar
    },
    // 支付
    {
      path: '/pay',
      name: 'pay',
      component: pay
    }
  ]
})
