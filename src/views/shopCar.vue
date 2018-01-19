<template>
    <div class="shopCar">
        <!-- 购物车主体，循环 -->
        <router-link tag="div" :to="{'name':'storeDetail',params:{'id': item.Pid}}" v-if="shopCar" v-for="(item,index) in shopCar" class="shopCarContent">
            <!-- 每个店铺头部 -->
            <div class="car_header boxBorder flexRow">
                <span>{{item.P_name}}</span>
                <img @click="delThis(item.Pid)" src="../assets/shopCar/del.png">
            </div>
            <!-- 每个店铺购物车内容 -->
            <div v-for="med in item.Itemlist" class="car_content flexRow">
                <div class="car_content_left flexRow">
                    <img :src="med.cartinfo_drug_pic">
                    <div class="flexCol">
                        <h3>{{med.cartinfo_drug_name}}</h3>
                        <span>*{{med.cartinfo_drug_num}}</span>
                    </div>
                </div>
                <div class="car_content_right flexRow">
                    <span class="price">￥{{med.cartinfo_drug_price*med.cartinfo_drug_num}}</span>
                </div>
            </div>
            <!-- 合计 -->
            <div class="car_sum flexRow">
                <span>合计￥</span>
                <span class="price">{{item.Count}}</span>
                <button type="button" class="car_sumPay" @click="pay(index)">去付款</button>
            </div>
        </router-link>
        <!-- 取货方式 -->
        <div v-if="winMed" class="mask"></div>
        <div v-if="winMed" class="goods_methods flexCol">
            <div class="goods_methods_header flexRow">
                <h3>请选择取药方式</h3>
                <img @click="cancelWin()" src="../assets/shopCar/cancel.png">
            </div>
            <div class="goods_methods_content flexCol">
                <div class="flexRow">
                    <input type="radio" value="0" v-model="goodsMethods">送药上门</input>
                </div>
                <div class="flexRow">
                    <input type="radio" value="1" v-model="goodsMethods">到店自提</input>
                </div>
                <button type='button' @click="goRouter()">确认</button>
            </div>
        </div>
        <!-- 购物车为空时 -->
        <div v-if="carEmpty" class="flexCol carEmpty">
            <img src="../assets/shopCar/carEmpty.png">
            <p>您还没有添加任何药品哦</p>
        </div>
    </div>
</template>
<script type="text/javascript">
export default {
    name: 'shopCar',
    data() {
        return {
            // 购物车数据结构
            shopCar: [],
            carEmpty: false,
            // 取货方式相关
            goodsMethods: 0,
            winMed: false,
            // 清除购物车抛出的id组
            ids: {
                Uid: '',
                Pid: ''
            },
            // 当前索引
            index: ''
        }
    },
    mounted() {
        this.$nextTick(function() {
            this.ids.Uid = this.$store.state.Uid;
        });
    },
    activated() {
        // 初始化所有数据
        this.winMed = false;
        document.title = '购物车';
        this.getShopCar();
        this.carEmpty = false;
    },
    methods: {
        // 清空购物车
        delThis(pid) {
            var that = this;
            this.$vux.loading.show({
                text: "正在清空..."
            });
            // 抛出数据组装
            this.ids.Pid = pid;
            this.$tools.PostDataToServer(
                this,
                this.$api.shopCarDel,
                this.ids,
                function success(res) {
                    that.$vux.loading.hide();
                    that.getShopCar();
                },
                function error(err) {
                    that.$vux.loading.show({
                        text: "网络错误"
                    });
                    return
                }
            )
        },
        // 获取购物车信息
        getShopCar() {
            var that = this;
            this.$vux.loading.show({
                text: "奋力加载中..."
            });
            // 加载数据
            this.$tools.GetDataFromServer(
                this,
                this.$api.shopCar,
                function success(res) {
                    that.$vux.loading.hide();
                    var resData = res.data.key;
                    that.shopCar = resData;
                    // 判断购物车是否为空
                    if (resData == '') {
                        that.carEmpty = true;
                    }
                },
                function error(err) {
                    that.$vux.loading.show({
                        text: "网络错误"
                    });
                    return
                }
            )
        },
        //支付
        pay(index) {
            this.winMed = true;
            this.index = index;
        },
        // 取货方式弹窗
        goRouter() {
            // 0 送货上门
            if (this.goodsMethods == 0) {
                this.$router.push({
                    name: 'doorOrder',
                    params: {
                        msg: this.shopCar[this.index]
                    }
                });
            }
            // 1 到店自提
            if (this.goodsMethods == 1) {
                this.$router.push({
                    name: 'medOrder',
                    params: {
                        msg: this.shopCar[this.index]
                    }
                });
            }
        },
        cancelWin() {
            this.winMed = false;
        }
    }
}
</script>
<style type="text/css" scoped>
.shopCar {
    width: 100%;
    height: auto;
}


/*购物车主体*/

.shopCarContent {
    width: 100%;
    height: auto;
    background: #fff;
    border-bottom: 10px solid #eee;
}

.price {
    color: #DE1515;
    font-weight: bold;
    font-size: .875rem;
}


/*每个店铺头部*/

.car_header {
    width: 100%;
    height: 2rem;
    font-size: .875rem;
    background: #459FEB;
    color: #fff;
    padding: 0 2%;
    border-bottom: 1px solid #ddd;
    justify-content: space-between;
    -ms-align-items: center;
    align-items: center;
}

.car_header img {
    height: 1rem;
}


/*购物车内容*/

.car_content {
    width: 100%;
    height: 3rem;
    border-bottom: 1px solid #ddd;
    padding: .5rem 0;
    justify-content: space-between;
}


/*购物车左侧*/

.car_content_left {
    width: auto;
    height: 100%;
    padding-left: 2%;
    font-size: .875rem;
    -ms-align-items: center;
    align-items: center;
}

.car_content_left img {
    width: 2.5rem;
    height: 2.5rem;
    margin-right: .5rem;
    padding: .25rem;
    border: 1px solid #ddd;
    border-radius: 2px;
}

.car_content_left div {
    height: 100%;
    justify-content: space-between;
}

.car_content_left span {
    font-size: .75rem;
}


/*购物车右侧*/

.car_content_right {
    height: 100%;
    padding-right: 2%;
    -ms-align-items: flex-end;
    align-items: flex-end;
}


/*合计*/

.car_sum {
    width: 96%;
    height: 2rem;
    padding: .5rem 2%;
    font-size: .875rem;
    justify-content: flex-end;
    -ms-align-items: center;
    align-items: center;
}

.car_sum button {
    width: 4rem;
    height: 100%;
    border: none;
    border-radius: 2px;
    color: #fff;
    background: #35B17F;
    margin-left: .5rem;
}


/*取货方式弹窗*/

.goods_methods {
    position: fixed;
    top: 30%;
    left: 50%;
    width: 60%;
    height: 10rem;
    background: #fff;
    border-radius: 4px;
    z-index: 111;
    margin-left: -30%;
    font-size: .875rem;
}


/*弹窗头部*/

.goods_methods_header {
    height: 2rem;
    color: #fff;
    border-radius: 4px 4px 0 0;
    padding: 0 .5rem;
    justify-content: space-between;
    background: #459FEB;
    -ms-align-items: center;
    align-items: center;
}

.goods_methods_header img {
    width: 1rem;
}


/*弹窗主体*/

.goods_methods_content {
    justify-content: space-around;
    -ms-align-items: center;
    align-items: center;
    -webkit-flex: 1;
    -moz-flex: 1;
    -ms-flex: 1;
    -o-flex: 1;
    flex: 1;
}

.goods_methods_content div {
    width: 100%;
    justify-content: center;
    -ms-align-items: center;
    align-items: center;
}

.goods_methods_content div input {
    width: 1rem;
    height: 1rem;
    margin-right: 5px;
}

.goods_methods_content button {
    width: 60%;
    height: 2rem;
    border: none;
    background: #1F72BD;
    border-radius: 2px;
    color: #fff;
}


/*购物车为空时*/

.carEmpty {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    -ms-align-items: center;
    align-items: center;
    justify-content: center;
    color: #666;
    font-size: .875rem;
    font-weight: bold;
}

.carEmpty img {
    width: 5rem;
    height: 5rem;
    border-radius: 5rem;
    background: #459FEB;
    margin: -5rem 0 1rem;
}
</style>
