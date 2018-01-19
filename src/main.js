import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import Vuex from 'vuex'
import tools from './extend/tools'
import api from '@/extend/api'
import somap from '../static/soMap/somap.js'

import {
    TransferDom,
    Alert,
    Popup,
    Group,
    Cell,
    XButton,
    XSwitch,
    Scroller,
    Swiper,
    Toast,
    XAddress,
    ChinaAddressData,
    Actionsheet,
    DatetimePlugin,
    LocalePlugin,
    DevicePlugin,
    ToastPlugin,
    AlertPlugin,
    ConfirmPlugin,
    LoadingPlugin,
    WechatPlugin,
    AppPlugin
} from 'vux'

// 使用Vuex全局数据
Vue.use(Vuex)

// 使用Vux框架
Vue.use(DevicePlugin)
Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.use(LocalePlugin)
Vue.use(DatetimePlugin)
Vue.use(ConfirmPlugin)
    // Vux 页面切换显示loading
Vue.use(LoadingPlugin)
    // Vux 微信jssdk
Vue.use(WechatPlugin)

// 接口地址
Vue.prototype.$api = api
// http方法
Vue.prototype.$http = axios
Vue.prototype.$tools = tools
// vuex全局存储
Vue.prototype.$store = new Vuex.Store({
    state: {
        // 存储全局变量
        Uid: '',
        Pid: '',
        mapsTime: ''
    }
})

// Vux 页面切换显示loading 配置项
const store = new Vuex.Store({})
store.registerModule('vux', { // 名字自己定义
    state: {
        isLoading: false
    },
    mutations: {
        updateLoadingStatus(state, payload) {
            state.isLoading = payload.isLoading
        }
    }
})
router.beforeEach(function (to, from, next) {
  store.commit('updateLoadingStatus', {isLoading: true})
  next()
})
router.afterEach(function (to) {
  store.commit('updateLoadingStatus', {isLoading: false})
})

// 添加Fastclick移除移动端点击延迟
const FastClick = require('fastclick')
FastClick.attach(document.body)

//路由初始化/刷新程序返回路由
router.onReady(function() {
    router.push('/');
})

Vue.config.productionTip = false

// 实例化Vue
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})
