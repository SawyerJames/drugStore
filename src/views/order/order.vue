<template>
    <div class="order">
        <div style="width: 100%;overflow:scroll;-webkit-overflow-scrolling:touch;" class="all-msg">
            <tab bar-active-color="#49b68d" :line-width="1" style="border-bottom: 6px solid #eef2f5;" v-model="index">
                <tab-item @on-item-click="GetOrderList()" selected>全部</tab-item>
                <tab-item @on-item-click="selectD(5)">待付款</tab-item>
                <tab-item @on-item-click="selectD(3)">待收货</tab-item>
                <tab-item @on-item-click="selectD(6)">已完成</tab-item>
                <tab-item @on-item-click="selectD(7)">已取消</tab-item>
            </tab>
            <div v-if="nothingData">
                <div class="all_for" v-for="(item, key) in list_data">
                    <div class="yaodian">
                        <div class="left_yao">
                            <img :src="item.Img">
                            <p>{{ item.P_name}}</p>
                        </div>
                        <div class="right_yao">
                            <p class="text_x">{{item.Statuss}}</p>
                        </div>
                    </div>
                    <!--药品-->
                    <router-link tag="div" :to="{'name':'orderdetails',params:{'details': item.Number}}">
                        <div class="yaopin" v-for="two in list_data[key].Info">
                            <div class="left_y">
                                <img :src="two.Img">
                            </div>
                            <div class="txt">
                                <p class="drugName">{{two.Name}}</p>
                                <p class="how_many">{{two.Dose}}</p>
                                <!--片数-->
                                <p class="how_much"><span>￥{{two.Zero_bar_code}}</span><span style="padding-right:1rem;">x{{two.Num}}</span></p>
                                <!--数量、单价-->
                            </div>
                        </div>
                    </router-link>
                    <!--商品件数以及价格-->
                    <div class="jianshu">
                        <p class="shangpin">共计{{item.Sum}}件</p>
                        <div class="zongjia">
                            小计：
                            <p class="qian_color">￥{{item.Total_fee}}</p>
                        </div>
                    </div>
                    <div class="order">
                        <div class="order_d" v-if="item.Status !== 7 || item.Status !== 3">
                            <!-- <p class="order_y"></p> -->
                            <!-- 医保订单 -->
                            <!--暂时不用，后期可能用到-->
                            <p class="delete_d" @click="removeTodo(item.Number)" v-if="item.Status==6">删除订单</p>
                            <p class="delete_q" @click="cancellation(item.Number)" v-if="item.Status==5">取消订单</p>
                            <p class="delete_q" v-if="item.Status==5">去支付</p>
                        </div>
                        <div class="paidiyuan" v-if="item.Status==3">
                            <img src="../../assets/picture/paidiyuan.png">
                            <router-link tag="div" :to="{'name':'map',params:{'positionLocation':item.Pid,'Order_lat':item.Order_lat,'Order_lng':item.Order_lng}}">
                                <p class="pdwz">查看派递员位置</p>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <button @click="/orderdetails/orderid/ item.id">xiangqing</button>-->
            <!--/orderdetails路由名，/orderid自己起的传给后台的/item.id循环出来的相对数组里的数据-->
            <!--没数据时-->
            <div class="nodata" v-else>
                <img src="../../assets/order/nothing .png">
            </div>
            <!--没数据页结束-->
        </div>
    </div>
</template>
<!--script开始-->
<script type="text/javascript">
import {
    Tab,
    TabItem,
    Sticky,
    Divider,
    XButton,
    Swiper,
    SwiperItem,
    Loading
} from 'vux'
export default {
    name: 'order',
    components: {
        Tab,
        TabItem,
        Sticky,
        Divider,
        XButton,
        Swiper,
        SwiperItem,
        Loading
    },
    data() {
        return {
            current_index: 0,
            index: 1,
            zhuangtai: '',
            click_1: false,
            click_2: true,
            danjia: '￥18.00',
            nothingData: true, //有数据时显示循环列表
            userid: '',
            // 全部订单
            list_data: [],
            Number: ''
        }
    },
    mounted() {
        // Uid：全局加载
        this.userid = this.$store.state.Uid;
    },
    activated() {
        document.title = "订单列表";
        this.loaded();
        this.GetOrderList();
    },
    methods: {
        // 获取订单列表
        loaded(index) {
            var that = this;
            this.current_index = index; //vux里的loading
            this.$vux.loading.show({
                text: '奋力加载中...'
            });
            // 加载数据
            this.$tools.GetDataFromServer(
                this,
                this.$api.orderList,
                function success(res) {
                    //判断有无界面时是否出现无信息页
                    if (res.data) {
                        that.nothingData = true
                    } else {
                        that.nothingData = false
                    }
                    that.list_data = res.data
                    that.$vux.loading.hide() //单页vux，loading
                },
                function error(err) {
                    that.$vux.loading.show({
                        text: "网络错误"
                    });
                    return;
                }
            )
        },
        //加载全部列表
        GetOrderList(getlist) {
            var that = this;
            // 加载数据
            this.$tools.GetDataFromServer(
                this,
                this.$api.order + this.userid, //status后台字段，根据字段查询
                function success(res) {
                    var resData = res.data.DrugorderInfo.Itemlist;
                    for (var i = 0; i < resData.length; i++) {
                        switch (resData[i].Status) {
                            case 7:
                                resData[i].Statuss = '已取消'
                                break;
                            case 6:
                                resData[i].Statuss = '已完成'
                                break;
                            case 5:
                                resData[i].Statuss = '待付款'
                                break;
                            case 3:
                                resData[i].Statuss = '待收货'
                                break;
                            default:
                                resData[i].Statuss = ''
                                break;
                        }
                    }
                    that.list_data = resData;
                },
                function error(err) {
                    that.$vux.loading.show({
                        text: "网络错误"
                    });
                    return;
                }
            )
        },
        //获取选卡
        selectD(getlist) {
            var that = this;
            // 加载数据
            this.$tools.GetDataFromServer(
                this,
                this.$api.order + this.userid + '/Drugorderinfo_status/' + getlist, //status后台字段，根据字段查询
                function success(res) {
                    var resData = res.data.DrugorderInfo.Itemlist;
                    for (var i = 0; i < resData.length; i++) {
                        switch (resData[i].Status) {
                            case 7:
                                resData[i].Statuss = '已取消';
                                break;
                            case 6:
                                resData[i].Statuss = '已完成';
                                break;
                            case 5:
                                resData[i].Statuss = '待付款';
                                break;
                            case 3:
                                resData[i].Statuss = '待收货';
                                break;
                            default:
                                resData[i].Statuss = '';
                                break;
                        }
                    }
                    that.list_data = resData;
                },
                function error(err) {
                    that.$vux.loading.show({
                        text: "网络错误"
                    });
                    return;
                }
            )
        },
        //删除订单之后接收数据重新加载
        removeTodo(Number) {
            var that = this;
            this.Number = Number;
            this.$tools.GetDataFromServer(
                this,
                this.$api.deletelist + this.Number, //相当于form表单里的action。
                function success(res) {
                    var resData = res.data.DrugorderInfo.Itemlist;
                    that.list_data = resData;
                    that.GetOrderList();
                },
                function error(err) {
                    that.$vux.loading.show({
                        text: "网络错误"
                    });
                    return;
                }
            )
        },
        //取消订单抛出给后台
        cancellation(Number) {
            var that = this;
            this.Number = Number;
            this.$tools.GetDataFromServer(
                this,
                this.$api.cancellationOrder + '/ItemId/' + this.Number,
                function success(res) {
                    that.GetOrderList();
                },
                function error(err) {
                    return;
                }
            )
        }
    }
}
</script>
<style type="text/css" scoped>
.vux-tab .vux-tab-item.vux-tab-selected {
    color: #4cb48f !important;
}

.yaodian,
.left_yao,
.left_y,
.txt,
.many_s,
.jianshu,
.zongjia,
.order_d,
.paidiyuan,
.yaopin {
    display: -webkit-box;
    /* OLD - iOS 6-, Safari 3.1-6 */
    display: -moz-box;
    /* OLD - Firefox 19- */
    display: -ms-flexbox;
    /* TWEENER - IE 10 */
    display: -webkit-flex;
    /* NEW - Chrome */
    display: flex;
    /* NEW, Spec - Opera 12.1, Firefox 20+ */
}

.all_for {
    border-bottom: 4px solid rgb(238, 242, 245);
}

.yaodian {
    width: 100%;
    border-bottom: 1px solid #edf2f5;
    padding-bottom: 0.375rem;
    justify-content: space-between;
}

.left_yao {
    padding-top: 1rem;
}

.left_yao img {
    width: 2rem;
    height: 1.5rem;
    padding-left: 1rem;
    padding-right: 1rem;
}

.left_yao p {
    display: inline-flex;
    /* padding-top: 0.75rem;*/
    padding-left: 0.875rem;
    /*font-size: 1rem;*/
    font-size: 0.875rem;
    font-weight: 500;
}

.yaopin {
    color: #000;
    border-bottom: 1px solid #eef3f6;
    height: 6rem;
}

.text_x {
    font-size: 0.875rem;
    color: #c41414;
    display: inline-flex;
    padding: 1rem 1rem 0 0;
}

.left_y {
    width: 30%;
    margin-right: 1rem;
    padding-top: 0.5rem;
    display: inline-flex !important;
}

.left_y img {
    width: 5rem;
    height: 4rem;
    padding-left: 1rem;
}

.left_y p {
    display: inline-flex;
    padding-left: 0.875rem;
    font-size: 0.875rem;
}

.txt {
    width: 70%;
    padding-top: 0.875rem;
    bottom: 3.125rem;
    -webkit-flex-direction: column;
    -moz-flex-direction: column;
    -ms-flex-direction: column;
    -o-flex-direction: column;
    flex-direction: column;
    display: inline-flex;
}

.how_many {
    font-size: 0.75rem;
    color: #ccc;
}

.how_much {
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-flex-direction: row-reverse;
    -moz-flex-direction: row-reverse;
    -ms-flex-direction: row-reverse;
    -o-flex-direction: row-reverse;
    display: inline-flex;
    font-style: 0.75rem;
    color: #c61414;
}

.how_much span {
    font-size: 0.875rem;
}

.many_s {
    position: relative;
    right: -46px;
    bottom: 6px;
    font-size: 0.875rem;
    -webkit-flex-direction: row-reverse;
    -moz-flex-direction: row-reverse;
    -ms-flex-direction: row-reverse;
    -o-flex-direction: row-reverse;
    flex-direction: row-reverse;
    display: inline-flex;
}

.jianshu {
    font-size: 0.875rem;
    justify-content: flex-end;
    padding: 1rem 0rem 0.5rem 0rem;
    /*border-bottom:1px solid #eef3f6;*/
}

.shangpin {
    font-style: 0.875rem;
    padding-left: 6rem;
}

.zongjia {
    order: 2;
    padding: 0rem 2rem;
}

.qian_color {
    font-size: 0.875rem;
    color: #c61414;
}

.order_d {
    /*margin: 1rem 3rem;*/
    margin: 0.5rem 1rem;
    justify-content: flex-end;
}

.order_y {
    font-size: 0.875rem;
}

.delete_d,
.delete_q {
    font-size: 0.75rem;
    /*color:#c61414;*/
    /*border: 1px solid #c61414;*/
    color: #000;
    border: 1px solid #939191;
    border-radius: 0.8rem;
    padding: 0.02rem 0.3rem;
    margin-left: 0.25rem;
}

.paidiyuan {
    justify-content: flex-end;
}

.paidiyuan p {
    font-size: 0.875rem;
    padding-right: 1rem;
}

.paidiyuan img {
    width: 1rem;
    height: 0.875rem;
    padding: 0.375rem
}

.pdwz {
    order: 99;
}

.nodata {
    height: 100%;
    background-size: 100% 100%;
}

.nodata {
    background-size: 100% 100%;
}

.nodata img {
    width: 100%;
}

.drugName {
    font-size: 0.875rem;
}
</style>
<!--vux选卡单独样式-->
<style lang="less" scoped>
@import '~vux/src/styles/1px.less';
@import '~vux/src/styles/center.less';
.box {
    padding: 15px;
}

.active-6-1 {
    color: rgb(252, 55, 140) !important;
    border-color: rgb(252, 55, 140) !important;
}

.active-6-2 {
    color: #4cb48f !important;
    border-color: #4cb48f !important;
}

.active-6-3 {
    color: rgb(55, 174, 252) !important;
    border-color: rgb(55, 174, 252) !important;
}

.tab-swiper {
    background-color: #fff;
    height: 100px;
}
</style>
