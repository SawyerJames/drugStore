<template>
    <div class="medDetail">
        <!-- 轮播图 -->
        <div class="swiper">
            <img :src="medDetail.Img" style="width:90%; margin:0 auto;" height="10rem">
        </div>
        <!-- 药品信息 -->
        <div class="medMsg boxBorder">
            <!-- 药名 -->
            <div class="medMsg_header flexRow">
                <h2>{{medDetail.Name}}</h2>
                <span>{{medDetail.Specifications}}</span>
            </div>
            <!-- 药品介绍 -->
            <p class="medMsg_msg">{{medDetail.Message}}</p>
            <!-- 药品标志及购买 -->
            <div class="medMsg_sign flexRow">
                <div class="sign flexRow">
                    <p v-if="medDetail.Otc == 1">OTC</p>
                    <p v-if="medDetail.Medicalinsurance == 1">医保</p>
                </div>
                <div class="medMsg_compute flexRow">
                    <!-- 购物按钮 -->
                    <div v-if="medDetail.Activity_price" class="msg_right_computed flexRow">
                        <img v-if="medDetail.Num > 0" @click="subGood()" src="../assets/storeDetail/sub.png">
                        <input type="text" v-if="medDetail.Num > 0" readonly v-model.number="medDetail.Num" />
                        <img @click="addGood()" src="../assets/storeDetail/add.png">
                    </div>
                    <div v-else class="msg_right_computed flexRow">
                        <img v-if="medDetail.Num > 0" @click="subGood()" src="../assets/storeDetail/sub.png">
                        <input type="text" v-if="medDetail.Num > 0" readonly v-model.number="medDetail.Num" />
                        <img @click="addGood()" src="../assets/storeDetail/add.png">
                    </div>
                </div>
            </div>
            <!-- 销量库存 -->
            <div class="medMsg_inventory flexRow">
                <p v-if="medDetail.Activity_price" class="price">￥{{medDetail.Activity_price}}元</p>
                <p v-else class="price">￥{{medDetail.Retail_price}}元</p>
                <p>销量：{{medDetail.count}}</p>
                <p>库存：{{medDetail.K_num}}</p>
            </div>
        </div>
        <!-- 产品说明书 -->
        <div class="medProduct boxBorder">
            <h3>产品说明书</h3>
            <div class="flexRow">
                <p>药品名称</p>
                <span>{{medDetail.Name}}</span>
            </div>
            <div class="flexRow">
                <p>药品规格</p>
                <span v-if="medDetail.Compound == 1">复方</span>
                <span v-else>非复方</span>
            </div>
            <div class="flexRow">
                <p>包装规格</p>
                <span>{{medDetail.Specifications}}</span>
            </div>
            <div class="flexRow">
                <p>批准文号</p>
                <span>{{medDetail.Approval}}</span>
            </div>
            <div class="flexRow">
                <p>药品剂量</p>
                <span>{{medDetail.Dose}}</span>
            </div>
        </div>
        <!-- 产品说明书hack -->
        <div class="proHack"></div>
        <!-- 购物车功能 -->
        <div class="shopCar_content flexRow">
            <div class="shopCar flexRow">
                <!-- 购物车图标：可点击 -->
                <img @click='getShopCar()' src="../assets/storeDetail/shopCar.png">
                <!-- 购物车金额 -->
                <div class="flexRow">
                    <p v-if="shop_price != 0" class="shop_price">￥{{shop_price}}</p>
                    <p v-else>免费配送</p>
                </div>
            </div>
            <!-- 结算按钮 -->
            <button type="button" :disabled='disabled' :class="['shopPayDisBtn',{shopPayBtn: shop_price != 0}]" @click="shopPay">去结算</button>
        </div>
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
        <!-- 购物车弹窗 -->
        <div v-if="winCar" class="mask" @click="closeWinCar()"></div>
        <div v-if="winCar" class="winCar">
            <div class="winCar_header flexRow">
                <p>已选商品</p>
                <span @click="delAllCar()" class="flexRow"><img src="../assets/shopCar/del_black.png">清空</span>
            </div>
            <!-- 购物弹窗主体 -->
            <div class="winCar_content boxBorder">
                <div v-for="(item,index) in winCarList.Itemlist" class="winCar_good flexRow">
                    <p>{{item.cartinfo_drug_name}}</p>
                    <div class="winCar_price flexRow">
                        <p class="price">￥{{item.coun_num}}</p>
                        <!-- 购物按钮 -->
                        <div class="winCar_price_computed flexRow">
                            <img v-if="item.cartinfo_drug_num > 0" @click="subGoodWin(index)" src="../assets/storeDetail/sub.png">
                            <input type="text" v-if="item.cartinfo_drug_num > 0" readonly v-model.number="item.cartinfo_drug_num" />
                            <img @click="addGoodWin(index)" src="../assets/storeDetail/add.png">
                        </div>
                    </div>
                </div>
            </div>
            <!-- 购物弹窗尾部 -->
            <div class="winCar_foot">
                <p>所购药品一经购买，不得退换</p>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
import {
    Swiper
} from 'vux'
export default {
    name: 'medDetail',
    data() {
        return {
            // 药品详细
            medDetail: {},
            // 药店单品传来的id,msg
            id: '',
            msg: {},
            // 药品详细信息拉取
            itemPost: {
                ItemId: '',
                Uid: ''
            },
            // 物品加减
            price_sum: 0,
            //购物车金额
            shop_price: 0,
            //提交禁用
            disabled: true,
            // 取货方式相关
            winMed: false,
            goodsMethods: 0,
            // 购物车弹窗
            winCar: false,
            winCarList: [],
            // 购物车拼接数据
            postShopCar: {
                Uid: '',
                Pid: '',
                Did: '',
                Drug_name: '',
                Drug_pic: '',
                Drug_price: '',
                Drug_num: '',
                Drug_specifications: ''
            },
            // Uid和Pid
            UPid: {
                Uid: "",
                Pid: ''
            },
            // 小购物车加减
            smallShopCar: {
                Id: '',
                Drug_num: ''
            }
        }
    },
    mounted() {
        this.UPid.Pid = this.$route.params.Pid;
        // Uid读取
        this.UPid.Uid = this.$store.state.Uid;
        this.itemPost.Uid = this.$store.state.Uid;
        this.postShopCar.Uid = this.$store.state.Uid;
    },
    activated() {
        document.title = '定点药店-药品详情';
        // 药品id传值
        if (this.$route.params.Id) {
            this.itemPost.ItemId = this.$route.params.Id;
        }
        // 初始化所有数据
        this.winMed = false;
        this.disabled = true;
        // 拉取购物车信息
        this.getShopCarMsg();
        // 获取药品详细信息
        this.getMedMsg();
    },
    methods: {
        // 获取购物车信息
        getShopCarMsg() {
            var that = this;
            // 发出数据
            this.$tools.PostDataToServer(
                this,
                this.$api.shopCarWin,
                this.UPid,
                function success(res) {
                    var resData = res.data.CartInfo;
                    that.winCarList = resData;
                    that.shop_price = resData.Count;
                    if (that.shop_price != '') {
                        // 购物金额小数位处理
                        that.shop_price = that.shop_price.toFixed(2);
                        that.disabled = false;
                    } else {
                        that.disabled = true;
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
        // 获取药品详细信息：
        getMedMsg() {
            var that = this;
            this.$vux.loading.show({
                text: "奋力加载中..."
            });
            // 加载数据
            this.$tools.PostDataToServer(
                this,
                this.$api.medMsg,
                this.itemPost,
                function success(res) {
                    that.$vux.loading.hide();
                    var resData = res.data.DrugwInfo;
                    that.medDetail = resData;
                },
                function error(err) {
                    that.$vux.loading.show({
                        text: "网络错误"
                    });
                    return
                }
            )
        },
        // 去结算：弹出弹框
        shopPay() {
            this.winMed = true;
        },
        // 取货方式弹窗
        goRouter() {
            // 0 送货上门
            if (this.goodsMethods == 0) {
                this.$router.push({
                    name: 'doorOrder',
                    params: {
                        msg: this.winCarList
                    }
                });
            }
            // 1 到店自提
            if (this.goodsMethods == 1) {
                this.$router.push({
                    name: 'medOrder',
                    params: {
                        msg: this.winCarList
                    }
                });
            }
        },
        cancelWin() {
            this.winMed = false;
        },
        // 物品增减：点击向后端请求购物车结算：抛出当前药品id，商店id
        subGood() {
            var that = this;
            // 减少
            this.medDetail.Num--;
            // 购物车数据拼接
            this.postShopCar.Pid = this.UPid.Pid;
            this.postShopCar.Did = this.medDetail.Detailed_id;
            this.postShopCar.Drug_name = this.medDetail.Name;
            this.postShopCar.Drug_pic = this.medDetail.Img;
            this.postShopCar.Drug_price = this.medDetail.Activity_price;
            this.postShopCar.Drug_num = -1;
            this.postShopCar.Drug_specifications = this.medDetail.Specifications;
            // 发出数据
            this.$tools.PostDataToServer(
                this,
                this.$api.shopComputed,
                this.postShopCar,
                function success(res) {
                    that.getShopCarMsg();
                },
                function error(err) {
                    that.$vux.loading.show({
                        text: "网络错误"
                    });
                    return
                }
            )
        },
        addGood() {
            // 打开去结算按钮
            this.disabled = false;
            var that = this;
            // 增加
            this.medDetail.Num++;
            // 购物车数据拼接
            this.postShopCar.Pid = this.UPid.Pid;
            this.postShopCar.Did = this.medDetail.Detailed_id;
            this.postShopCar.Drug_name = this.medDetail.Name;
            this.postShopCar.Drug_pic = this.medDetail.Img;
            this.postShopCar.Drug_price = this.medDetail.Activity_price;
            this.postShopCar.Drug_num = 1;
            this.postShopCar.Drug_specifications = this.medDetail.Specifications;
            // 发出数据
            this.$tools.PostDataToServer(
                this,
                this.$api.shopComputed,
                this.postShopCar,
                function success(res) {
                    that.getShopCarMsg();
                },
                function error(err) {
                    that.$vux.loading.show({
                        text: "网络错误"
                    });
                    return
                }
            )
        },
        // 购物车弹窗的减法
        subGoodWin(index) {
            var that = this;
            // 减少
            this.winCarList.Itemlist[index].cartinfo_drug_num--;
            // 如果购物车金额归零，不可点击“去结算”
            if (this.shop_price <= 0) {
                this.disabled = true;
            }
            // 购物车数据拼接
            this.smallShopCar.Id = this.winCarList.Itemlist[index].id;
            this.smallShopCar.Drug_num = -1;
            // 发出数据
            this.$tools.PostDataToServer(
                this,
                this.$api.smallShopCar,
                this.smallShopCar,
                function success(res) {
                    that.getShopCarMsg();
                    that.getMedMsg();
                },
                function error(err) {
                    that.$vux.loading.show({
                        text: "网络错误"
                    });
                    return
                }
            )
        },
        // 购物车弹窗的加法
        addGoodWin(index) {
            var that = this;
            // 增加
            this.winCarList.Itemlist[index].cartinfo_drug_num++;
            // 购物车数据拼接
            this.smallShopCar.Id = this.winCarList.Itemlist[index].id;
            this.smallShopCar.Drug_num = 1;
            // 发出数据
            this.$tools.PostDataToServer(
                this,
                this.$api.smallShopCar,
                this.smallShopCar,
                function success(res) {
                    that.getShopCarMsg();
                    that.getMedMsg();
                },
                function error(err) {
                    that.$vux.loading.show({
                        text: "网络错误"
                    });
                    return
                }
            )
        },
        // 点击购物车获取购物车信息
        getShopCar() {
            this.winCar = !this.winCar;
            var that = this;
            // 发出数据
            this.$tools.PostDataToServer(
                this,
                this.$api.shopCarWin,
                this.UPid,
                function success(res) {
                    var resData = res.data.CartInfo;
                    that.winCarList = resData;
                    that.shop_price = resData.Count;
                },
                function error(err) {
                    that.$vux.loading.show({
                        text: "网络错误"
                    });
                    return
                }
            )
        },
        // 清空购物车
        delAllCar() {
            this.$vux.loading.show({
                text: "正在清空..."
            });
            var that = this;
            // 抛出数据组装
            this.$tools.PostDataToServer(
                this,
                this.$api.shopCarDel,
                this.UPid,
                function success(res) {
                    that.$vux.loading.hide();
                    that.getShopCar();
                    that.getMedMsg();
                },
                function error(err) {
                    that.$vux.loading.show({
                        text: "网络错误"
                    });
                    return
                }
            )
        },
        // 关闭购物车弹窗
        closeWinCar() {
            this.winCar = false;
        }
    },
    components: {
        Swiper
    }
}
</script>
<style type="text/css" scoped>
/*轮播图*/

.swiper {
    width: 100%;
    height: 11rem;
    padding-top: 1rem;
    border-bottom: 1px solid #ECECEC;
}


/*药品信息*/

.medMsg {
    width: 100%;
    padding: 0 5%;
    font-size: .875rem;
}


/*药品头部*/

.medMsg_header {
    height: 2.5rem;
    line-height: 2.5rem;
    margin-top: .5rem;
    -ms-align-items: center;
    align-items: center;
}

.medMsg_header h2 {
    font-size: 1rem;
    margin-right: .5rem;
}

.medMsg_header span {
    color: #666;
}


/*药品说明*/

.medMsg_msg {
    font-size: .75rem;
    color: #666;
}


/*药品标志*/

.medMsg_sign {
    width: 100%;
    height: 2.5rem;
    justify-content: space-between;
    -ms-align-items: center;
    align-items: center;
}

.medMsg_sign .sign {
    width: auto;
}

.sign p {
    width: auto;
    border: 1px solid #519EBF;
    color: #005785;
    border-radius: 4px;
    padding: 0 .1rem;
    margin: 0 .5rem 0 0;
    font-size: .75rem;
}


/*药品库存销量价格*/

.medMsg_inventory {
    width: 100%;
    font-size: .75rem;
    color: #666;
    justify-content: space-between;
    -ms-align-items: center;
    align-items: center;
    margin-bottom: 1rem;
}

.medMsg_inventory .price {
    font-size: .875rem;
    font-weight: bold;
    color: #DE1515;
}


/*产品说明书*/

.medProduct {
    width: 100%;
    font-size: .875rem;
}

.medProduct h3 {
    width: 100%;
    height: 3rem;
    line-height: 3rem;
    color: #005785;
    text-align: center;
    border-top: 8px solid #F3F7FA;
    border-bottom: 1px solid #ddd;
}

.medProduct>div {
    padding: 0 5%;
    height: 3rem;
    -ms-align-items: center;
    align-items: center;
}

.medProduct>div:nth-child(odd) {
    background: #F3F7FA;
}

.medProduct>div p {
    width: 4rem;
    margin-right: 1rem;
}

.medProduct>div span {
    color: #666
}

.proHack {
    height: 3rem;
    width: 100%;
    background: none;
}


/*购物车计算*/

.medMsg_compute {
    justify-content: space-between;
    -ms-align-items: center;
    align-items: center;
}

.medMsg_compute .price {
    color: #DE1515;
    font-weight: bold;
    font-size: .875rem;
    margin-right: .5rem;
}

.medMsg_compute>div {
    -ms-align-items: center;
    align-items: center;
}

.medMsg_compute>div input {
    border: none;
    background: none;
    width: 1rem;
    text-align: center;
}

.medMsg_compute>div p {
    font-size: .875rem;
}

.medMsg_compute>div img {
    width: 1.2rem;
    height: 1.2rem;
    margin: 0 .5rem;
}


/*购物车*/

.shopCar_content {
    width: 100%;
    height: 3rem;
    background: #474546;
    position: fixed;
    bottom: 0;
    left: 0;
    justify-content: space-between;
    z-index: 222;
}


/*提交按钮*/

.shopPayDisBtn {
    width: 6rem;
    height: 100%;
    border: none;
    background: #898989;
    color: #fff;
}

.shopPayBtn {
    background: #35B17F;
}


/*购物计算*/

.shopCar {
    color: #fff;
    position: relative;
    -ms-align-items: center;
    align-items: center;
    -webkit-flex: 1;
    -moz-flex: 1;
    -ms-flex: 1;
    -o-flex: 1;
    flex: 1;
}

.shopCar img {
    width: 3rem;
    height: 3rem;
    position: absolute;
    top: -1rem;
    left: .5rem;
}

.shopCar>div {
    font-size: .875rem;
    margin-left: 4rem;
    -ms-align-items: flex-end;
    align-items: flex-end;
}

.shopCar>div .shop_price {
    font-size: 1rem;
    margin-right: 1rem;
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
    z-index: 333;
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


/*购物车弹窗*/

.winCar {
    z-index: 111;
    width: 100%;
    height: auto;
    position: fixed;
    bottom: 3rem;
    background: #fff;
}


/*弹窗头部*/

.winCar_header {
    padding: 0 .5rem;
    background: #eee;
    height: 2rem;
    font-size: .875rem;
    font-weight: bold;
    justify-content: space-between;
    -ms-align-items: center;
    align-items: center;
}

.winCar_header img {
    width: 1rem;
    margin-right: 2px;
}

.winCar_header span {
    font-weight: normal;
    -ms-align-items: center;
    align-items: center;
}


/*弹窗主体*/

.winCar_content {
    width: 100%;
    padding: 0 .5rem;
    height: auto;
}

.winCar_good {
    width: 100%;
    height: 2rem;
    font-size: .875rem;
    justify-content: space-between;
    -ms-align-items: center;
    align-items: center;
}

.winCar_price {
    justify-content: space-between;
    -ms-align-items: center;
    align-items: center;
}

.winCar_price .price {
    font-size: .75rem;
    font-weight: bold;
    color: #DE1515;
}


/*购物弹窗计算*/

.winCar_price_computed {
    margin-left: 1rem;
    justify-content: space-between;
    -ms-align-items: center;
    align-items: center;
}

.winCar_price_computed input {
    border: none;
    background: none;
    width: 1rem;
    text-align: center;
}

.winCar_price_computed img {
    width: 1.3rem;
    height: 1.3rem;
    margin: 0 .2rem;
}


/*弹窗尾部*/

.winCar_foot {
    background: #eee;
    height: 1.5rem;
    font-size: .75rem;
    line-height: 1.5rem;
    text-align: center;
}
</style>
