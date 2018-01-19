<template>
    <div class="index">
        <!-- 头部fixed Banner -->
        <div class="top-banner">
            <img class="top-img" src="../assets/index/banner_index.png">
            <div class="searchStore flexRow boxBorder">
                <div class="flexRow">
                    <img class="dingwei" src="../assets/index/dingwei.png">
                    <p class="weizhi">{{weizhi}}</p>
                </div>
                <div class="flexRow" id="example-1">
                    <img @click="show = !show" class="selectlogo" src="../assets/index/selectlogo.png">
                    <transition name="slide-fade">
                        <input v-model.lazy="searchMsg" type="text" class="searchStoreInput" @change="searchStore" v-if="show" placeholder="搜索药店"></input>
                    </transition>
                </div>
            </div>
        </div>
        <!-- 选择药店：提示 -->
        <div class="signTxt">
            <h3>
              <span>————&nbsp;&nbsp;</span>选择药店<span>&nbsp;&nbsp;————</span>
            </h3>
        </div>
        <!-- 药店列表信息 -->
        <ul class="list_detail">
            <router-link tag="li" :to="{'name':'storeDetail',params:{'id': item.id}}" class="detail flexRow boxBorder" v-for="item in drugstores">
                <!-- 左侧药店logo -->
                <div class="detail_logo flexRow">
                    <img :src="item.store_pic">
                </div>
                <!-- 右侧药店信息 -->
                <div class="detail_msg flexCol">
                    <div class="dragStore_name">
                        <h2>{{item.name}}</h2>
                    </div>
                    <div class="dragStore_msg flexRow">
                        <div class="flexRow" v-if="item.isdoor == 1">
                            <img src="../assets/index/yibaodingdian.png">
                            <p>医保定点</p>
                        </div>
                        <div class="flexRow" v-if="item.ismed == 1">
                            <img src="../assets/index/zaixianselect.png">
                            <p>在线选药</p>
                        </div>
                        <div class="flexRow" v-if="item.isonline == 1">
                            <img src="../assets/index/songyao.png">
                            <p>送药上门</p>
                        </div>
                    </div>
                </div>
            </router-link>
        </ul>
        <!-- 底部导航栏切换组件 -->
        <btclick :isIndex="isIndex"></btclick>
    </div>
</template>
<script type="text/javascript">
import btclick from '@/components/btclick'
export default {
    name: 'index',
    data() {
        return {
            // 搜索相关
            searchMsg: '',
            show: false,
            // 底部栏切换组件
            isIndex: 0,
            // 定位
            weizhi: '吉林省长春市朝阳区',
            // 药店列表
            drugstores: []
        }
    },
    mounted() {
        // 获取药店信息
        this.$nextTick(function() {
            var that = this;
            this.$vux.loading.show({text:"奋力加载中..."});
            // 加载数据 : get传递全局PID，如果PID不为空，则属于分店进入;
            this.$tools.GetDataFromServer(
                this,
                this.$api.index + this.$store.state.Pid,
                function success(res) {
                    that.$vux.loading.hide();
                    var resData = res.data;
                    if (resData.State.Code == 1) {
                        that.drugstores = resData.PharmacyInfo.Itemlist;
                    }
                },
                function error(err) {
                    that.$vux.loading.show({text:"网络错误"});
                }
            )
        })
    },
    activated() {
        // 头部hack
        document.title = '定点药店';
    },
    methods: {
        // 搜索药店
        searchStore() {
            var that = this;
            this.$vux.loading.show({text:"正在搜索..."});
            // 加载数据
            this.$tools.GetDataFromServer(
                this,
                this.$api.indexSearch + this.searchMsg,
                function success(res) {
                    that.$vux.loading.hide();
                    var resData = res.data.PharmacyInfo.Itemlist;
                    that.drugstores = resData;
                },
                function error(err) {
                    that.$vux.loading.show({text:"网络错误"});
                    return;
                }
            )
        }
    },
    components: {
        btclick
    }
}
</script>
<style type="text/css" scoped>
/* 头部banner */

.top-banner {
    width: 100%;
    min-height: 2.9375rem;
}

.top-img {
    width: 100%;
    height: 100%;
}


/*搜索药店*/

.searchStore {
    width: 100%;
    height: 2.5rem;
    padding: 0 .5rem;
    background: #459FEB;
    -webkit-box-shadow: 1px 1px 2px #ddd;
    box-shadow: 1px 1px 2px #ddd;
    position: fixed;
    top: 0;
    justify-content: space-between;
}

.searchStore>div {
    -ms-align-items: center;
    align-items: center;
}

.searchStore>div .dingwei {
    width: .75rem;
    margin-right: .5rem;
}

.searchStore>div .weizhi {
    font-size: 0.75rem;
    color: #fff;
}


/*搜索药店右侧动画*/

.searchStore>div .selectlogo {
    width: 1rem;
    height: 1rem;
}

.searchStoreInput {
    width: 8rem;
    height: 1.2rem;
    border: none;
    border-radius: 10px;
    position: absolute;
    right: 2rem;
    outline: none;
    padding: 0 .75rem;
    font-size: .75rem;
}


/* 搜索表单特效 */

.slide-fade-enter-active {
    transition: all .3s ease;
}

.slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter,
.slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
}


/*选择药店：提示*/

.signTxt {
    width: 100%;
    height: auto;
    text-align: center;
    margin: .5rem 0 0;
    padding-bottom: .75rem;
    border-bottom: 1px solid #eef3f6;
}

.signTxt h3 {
    color: #6B6B6B;
    font-weight: normal;
}

.signTxt span {
    color: #459FEB;
    font-weight: bold;
}


/*药店列表信息*/

.list_detail {
    width: 100%;
    margin-bottom: 90px;
}

.list_detail .detail {
    width: 100%;
    padding: 10px;
    border-bottom: 1px solid #eef3f6;
}


/*药店左侧logo*/

.detail_logo {
    width: 5rem;
    height: 5rem;
    border-radius: 2px;
    border: 1px solid #ddd;
    justify-content: center;
    -ms-align-items: center;
    align-items: center;
}

.detail_logo img {
    height: 4.5rem;
}


/* 药店右侧信息 */

.detail_msg {
    margin-left: 1rem;
    -webkit-flex: 1;
    -moz-flex: 1;
    -ms-flex: 1;
    -o-flex: 1;
    flex: 1;
    justify-content: space-around;
}

.dragStore_msg>div {
    margin-right: 5px;
    -ms-align-items: center;
    align-items: center;
}

.dragStore_msg>div p {
    font-size: .75rem;
}

.dragStore_msg>div img {
    width: 1rem;
    height: 1rem;
    margin-right: 4px;
}
</style>
