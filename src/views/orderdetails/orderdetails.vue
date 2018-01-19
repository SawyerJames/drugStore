<template>
    <div class="orderdetails">
        <!--头部、用户信息-->
        <div class="ddxq_top">
            <div class="xmdh">
                <img src="../../assets/orderdetails/ddlogo.png">
                <span>{{DrugorderInfo.Name}}</span>
                <span>{{DrugorderInfo.Tel}}</span>
            </div>
            <div class="mjtdz">
                <span>地址：</span>
                <span id="location">{{DrugorderInfo.Address}}</span>
            </div>
        </div>
        <div class="mgoods">
            <!--循环的列表、药品列表-->
            <div class="mgoods_pharmacy">
                <h3>{{DrugorderInfo.P_name}}</h3></div>
            <div class="mgoods_ypml">
                <ul class="mgoods_list">
                    <li class="mgoods_details" v-for="drugtype in store">
                        <div class="mgoods_ypxq">
                            <div class="mgoods_pic"><img :src="drugtype.img2"></div>
                            <div class="mgoods_right">
                                <p style="width:100%;">{{drugtype.Name}}</p>
                                <!--药品名-->
                                <p style="width:100%;">{{drugtype.Dose}}</p>
                                <!--计量-->
                                <!--   <p><span>类型：</span>{{drugtype.types}}</p> -->
                                <p class="manyNum"><span>￥{{drugtype.Zero_bar_code}}</span><span>x{{drugtype.Num}}</span></p>
                            </div>
                        </div>
                    </li>
                </ul>
                <!--购买的商品信息-->
                <div class="mggods_totle">
                    <!--   <p><span>本次积分：</span><span>{{gods6}}</span></p> -->
                    <p><span>医保金额：</span><span>￥{{DrugorderInfo.Medical_fee}}</span></p>
                    <p><span>自费金额：</span><span>￥{{DrugorderInfo.Self_fee}}</span></p>
                    <p><span>配送费：</span><span>{{gods9}}</span></p>
                    <!--配送费暂时没有先写死的-->
                    <p><span>商品总价：</span><span>￥{{DrugorderInfo.Total_fee}}</span></p>
                </div>
                <!--订单信息-->
                <div class="mgoods_time mgoods_bottom">
                    <p><span>订单编号：</span><span>{{this.Number}}</span></p>
                    <p><span>下单时间：</span><span>{{DrugorderInfo.Time}}</span></p>
                </div>
            </div>
            <!--配送人信息-->
            <div class="mgoods_time">
                <p><span>配送人姓名：</span><span>{{gods17}}</span></p>
                <!--暂时没有先写死的-->
                <p><span>联系方式：</span><span>{{gods18}}</span></p>
                <!--暂时没有先写死的-->
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
export default {
    name: 'orderdetails',
    data() {
        return {
            Name: '',
            Address: '',
            Name: '',
            gods6: '10',
            gods9: '￥0.00',
            gods15: '61753943707',
            gods17: '余文龙',
            gods18: '15604435563',
            det: 'd41f7248-863f-27de-6f66-40ad1c5107a3',
            store: [],
            DrugorderInfo: {},
            id: '',
            Number: ''
        }
    },
    mounted() {
        this.$nextTick(function() {
            // 加载上一页抛出的id
            this.Number = this.$route.params.details;
            var that = this;
            this.$vux.loading.show({
                text: '奋力加载中...'
            });
            // 加载数据
            this.$tools.GetDataFromServer(
                this,
                this.$api.orderdetails + this.Number,
                function success(res) {
                    that.$vux.loading.hide();
                    that.store = res.data.DrugorderInfo.store;
                    that.DrugorderInfo = res.data.DrugorderInfo;
                },
                function error(err) {
                    that.$vux.loading.show({
                        text: "网络错误"
                    });
                    return
                }
            );
        })
    },
    activated() {
        document.title = "订单详情";
    },
    methods: {}
}
</script>
<style type="text/css" scoped>
.ddxq,
.ddxq_top,
.ddxq_top .xmdh,
.mgoods,
.mgoods_ypml .mgoods_list,
.mgoods_ypml .mgoods_list .mgoods_details,
.mgoods_list .mgoods_details .mgoods_ypxq {
    /*定义父级弹性盒子*/
    display: box;
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

.ddxq {
    /*定义换行*/
    -webkit-flex-wrap: wrap;
    -moz-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    -o-flex-wrap: wrap;
    flex-wrap: wrap;
}

.ddxq_top {
    width: 100%;
    /*定义父级垂直方向起点在上沿*/
    -webkit-flex-direction: column;
    -moz-flex-direction: column;
    -ms-flex-direction: column;
    -o-flex-direction: column;
    flex-direction: column;
    padding: 1rem 0rem 1rem 0rem;
    border-bottom: 1rem solid #edf2f5;
}

.ddxq_top .xmdh img {
    width: 0.75rem;
    height: 1rem;
    padding-top: 0.3125rem;
    padding-left: 1rem;
}

.ddxq_top .xmdh span {
    padding-left: 0.3125rem;
}

.ddxq_top .mjtdz {
    color: #625f5f;
    font-size: 0.875rem;
    padding-left: 1rem;
    line-height: 1rem;
}

.mgoods {
    width: 100%;
    /*定义父级垂直方向起点在上沿*/
    -webkit-flex-direction: column;
    -moz-flex-direction: column;
    -ms-flex-direction: column;
    -o-flex-direction: column;
    flex-direction: column;
}

.mgoods {}

.mgoods .mgoods_pharmacy {
    width: 100%;
}

.mgoods .mgoods_pharmacy h3 {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
}

.mgoods_ypml {
    /*border-bottom: 1rem solid #edf2f5;*/
}

.mgoods_ypml .mgoods_list {
    width: 100%;
    /*定义换行*/
    -webkit-flex-wrap: wrap;
    -moz-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    -o-flex-wrap: wrap;
    flex-wrap: wrap;
    border-bottom: 1rem solid #edf2f5;
}

.mgoods_ypml .mgoods_list .mgoods_details {
    width: 100%;
    border-top: 1px solid #a3a5a6;
}

.mgoods_list .mgoods_details .mgoods_ypxq {
    width: 100%;
    /*定义父级弹性盒子*/
    display: box;
    padding: 0.5rem 1rem;
}

.mgoods_ypxq .mgoods_pic {
    width: 30%;
    margin-right: 1rem;
}

.mgoods_ypxq .mgoods_pic img {
    width: 6.25rem;
    height: 6.25rem;
}

.mgoods_right {
    width: 70%;
    flex-wrap: wrap;
    display: box;
    display: -webkit-box;
    /* OLD - iOS 6-, Safari 3.1-6 */
    display: -moz-box;
    /* OLD - Firefox 19- */
    display: -ms-flexbox;
    /* TWEENER - IE 10 */
    display: -webkit-flex;
    /* NEW - Chrome */
    display: flex;
}

.mgoods_ypxq .mgoods_right p:nth-child(1) {
    font-size: 0.875rem;
}

.mgoods_ypxq .mgoods_right p:nth-child(3) {
    color: #848484;
}

.mgoods_ypxq .mgoods_right p:nth-child(4) {
    color: #848484;
    display: box;
    display: -webkit-box;
    /* OLD - iOS 6-, Safari 3.1-6 */
    display: -moz-box;
    /* OLD - Firefox 19- */
    display: -ms-flexbox;
    /* TWEENER - IE 10 */
    display: -webkit-flex;
    /* NEW - Chrome */
    display: flex;
    justify-content: space-between;
}

.mgoods_ypxq .mgoods_right p:nth-child(4) span:nth-child(1) {
    color: #ff6600;
}

.mggods_totle {
    color: #848484;
    display: box;
    display: -webkit-box;
    /* OLD - iOS 6-, Safari 3.1-6 */
    display: -moz-box;
    /* OLD - Firefox 19- */
    display: -ms-flexbox;
    /* TWEENER - IE 10 */
    display: -webkit-flex;
    /* NEW - Chrome */
    display: flex;
    /*定义父级垂直方向起点在上沿*/
    -webkit-flex-direction: column;
    -moz-flex-direction: column;
    -ms-flex-direction: column;
    -o-flex-direction: column;
    flex-direction: column;
    padding: 1rem;
    border-bottom: 1rem solid #edf2f5;
}

.mggods_totle p {
    display: box;
    display: -webkit-box;
    /* OLD - iOS 6-, Safari 3.1-6 */
    display: -moz-box;
    /* OLD - Firefox 19- */
    display: -ms-flexbox;
    /* TWEENER - IE 10 */
    display: -webkit-flex;
    /* NEW - Chrome */
    display: flex;
    justify-content: space-between;
}

.mggods_totle p span:nth-child(2n) {
    color: #000;
}

.mgoods_time {
    color: #848484;
    display: box;
    display: -webkit-box;
    /* OLD - iOS 6-, Safari 3.1-6 */
    display: -moz-box;
    /* OLD - Firefox 19- */
    display: -ms-flexbox;
    /* TWEENER - IE 10 */
    display: -webkit-flex;
    /* NEW - Chrome */
    display: flex;
    /*定义父级垂直方向起点在上沿*/
    -webkit-flex-direction: column;
    -moz-flex-direction: column;
    -ms-flex-direction: column;
    -o-flex-direction: column;
    flex-direction: column;
    padding: 1rem;
}

.mgoods_bottom {
    border-bottom: 1rem solid #edf2f5;
}

.manyNum {
    width: 100%;
    -webkit-flex-direction: column;
    -moz-flex-direction: column;
    -ms-flex-direction: column;
    -o-flex-direction: column;
    justify-content: space-between;
    display: inline-flex;
}

span {
    font-size: 0.875rem;
}
</style>
