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
import me from '@/views/me/me'
import order from '@/views/order/order'
import orderdetails from '@/views/orderdetails/orderdetails'
import map from '@/views/map/map'
import newaddress from '@/views/newAddress/newaddress'
import addaddress from '@/views/newAddress/addaddress'
import editaddress from '@/views/newAddress/editaddress'

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
        },
        // 我的
        {
            path: '/me',
            name: 'me',
            component: me
        },
        // 订单页
        {
            path: '/order',
            name: 'order',
            component: order
        },
        // 详细订单页
        {
            path: '/orderdetails',
            name: 'orderdetails',
            component: orderdetails
        },
        // 地图页
        {
            path: '/map',
            name: 'map',
            component: map
        },
        // 地址管理
        {
            path: '/newaddress',
            name: 'newaddress',
            component: newaddress
        },
        // 新建地址
        {
            path: '/addaddress',
            name: 'addaddress',
            component: addaddress
        },
        // 编辑地址
        {
            path: '/editaddress',
            name: 'editaddress',
            component: editaddress
        }
    ]
})
