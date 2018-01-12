<template>
    <div class="storeDetail flexCol">
        <!-- fixedHack -->
        <div class="fixedHack"></div>
        <!-- 药店头部各种信息 -->
        <div class="detail_header_content">
            <!-- 药品搜寻 -->
            <div class="searchContainer flexRow">
                <input type="text" class="searchMed" @change="search()" v-model.lazy="searchMed" placeholder="药品搜索：请搜索药品关键字"></input>
                <img class="searchIcon" src="../assets/index/selectlogo.png" />
            </div>
            <div class="detail_header boxBorder flexRow">
                <!-- 头部左侧logo -->
                <div class="detail_header_left flexRow">
                    <img :src="storeMsg.Store_pic">
                </div>
                <!-- 头部右侧信息 -->
                <div class="detail_header_right flexCol">
                    <div class="header_title flexRow">
                        <h3>{{storeMsg.Name}}</h3>
                        <span v-if="storeMsg.Status == 1">营业中</span>
                        <span v-else>休息中</span>
                    </div>
                    <div class="header_sign flexRow">
                        <div v-if="storeMsg.Isdoor == 1" class="flexRow">
                            <img src="../assets/index/yibaodingdian.png">
                            <p>医保定点</p>
                        </div>
                        <div v-if="storeMsg.Ismed == 1" class="flexRow">
                            <img src="../assets/index/zaixianselect.png">
                            <p>在线选药</p>
                        </div>
                        <div v-if="storeMsg.Isonline == 1" class="flexRow">
                            <img src="../assets/index/songyao.png">
                            <p>送药上门</p>
                        </div>
                    </div>
                    <div class="header_time flexRow">
                        <p>营业时间：{{storeMsg.Businesshours}}</p>
                        <!-- <span>药店信息</span> -->
                    </div>
                </div>
            </div>
            <!-- 活动通知：轮播 -->
            <div v-if="storeMsg.activityList" class="med_activity flexRow boxBorder">
                <img src="../assets/storeDetail/activity.png">
                <swiper class="swiper" :show-dots='false' auto height="1.2rem">
                    <swiper-item class="swiperItem" v-for="item in storeMsg.activityList">
                        <p class="fadeInUp animated">{{item}}</p>
                    </swiper-item>
                </swiper>
            </div>
            <div v-else class="med_activity flexRow boxBorder">
                <img src="../assets/storeDetail/activity.png">
                <p class="med_activity_none">暂无最新公告</p>
            </div>
        </div>
        <!-- 药店商品 -->
        <div class="detail_content boxBorder">
            <!-- 药品分类 -->
            <ul class="msg_left">
                <li :class="{choose: isIndex == null}" @click="getAllMed()">全部药品</li>
                <li v-for="(item,index) in storeMsg.type" :class="{choose: isIndex == index}" @click="chooseMedList(index)">{{item.Name}}</li>
            </ul>
            <!-- 每一个分类下的药品 -->
            <div class="content_msg">
                <ul class="msg_right boxBorder">
                    <!-- 分类标题名:isIndex数组判定 -->
                    <h2 v-if="isIndex == null">全部药品</h2>
                    <h2 v-else>{{storeMsg.type[isIndex].Name}}</h2>
                    <!-- 每个分类下的药品列表 -->
                    <li v-for="(item,index) in medList">
                        <div class="msg_right_msg flexRow">
                            <!-- 药品logo：跳转至详情页的部分 -->
                            <router-link tag="div" :to="{name: 'medDetail',params: {UPid: UPid,Id: item.Id,Pid: storeId}}" class="content_msg_logo flexRow">
                                <img :src="item.Img">
                            </router-link>
                            <!-- 药品详细信息 -->
                            <div class="content_msg_msg flexCol">
                                <!-- 药品具体信息：跳转至详情页的部分 -->
                                <router-link tag="div" :to="{name: 'medDetail',params: {UPid: UPid,Id: item.Id,Pid: storeId}}">
                                    <h3>{{item.Name}}</h3>
                                    <div class="specContent flexRow">
                                        <p class="spec">{{item.Specifications}}</p>
                                        <div class="sign flexRow">
                                            <p v-if="item.Otc == 1">OTC</p>
                                            <p v-if="item.Medicalinsurance == 1">医保</p>
                                        </div>
                                    </div>
                                    <p class="address">{{item.Vender}}</p>
                                </router-link>
                                <!-- 药品现价原价 -->
                                <div class="msg_right_price flexRow">
                                    <p :class="['price',{oldPrice: item.Activity_price}]">￥{{item.Retail_price}}元</p>
                                    <p class="price" v-if="item.Activity_price">￥{{item.Activity_price}}元</p>
                                    <!-- 如果只有一个价格，购物按钮与价格在一行显示 -->
                                    <div class="flexRow" v-else>
                                        <img v-if="item.Num > 0" @click="subGood(index)" src="../assets/storeDetail/sub.png">
                                        <input type="text" v-if="item.Num > 0" readonly v-model.number="item.Num" />
                                        <img @click="addGood(index)" src="../assets/storeDetail/add.png">
                                    </div>
                                </div>
                                <!-- 购物按钮 -->
                                <div v-if="item.Activity_price" class="msg_right_computed flexRow">
                                    <img v-if="item.Num > 0" @click="subGood(index)" src="../assets/storeDetail/sub.png">
                                    <input type="text" v-if="item.Num > 0" readonly v-model.number="item.Num" />
                                    <img @click="addGood(index)" src="../assets/storeDetail/add.png">
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
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
        <div v-if="winMed" class="mask_high" @click="cancelWin()"></div>
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
    Swiper,
    SwiperItem
} from 'vux'
export default {
    name: 'storeDetail',
    data() {
        return {
            // 药店信息
            storeMsg: {},
            // 药店id
            storeId: '',
            isIndex: null,
            // 药店单品
            medList: [],
            //购物车金额
            shop_price: 0,
            //提交禁用
            disabled: true,
            // 取货方式相关
            winMed: false,
            goodsMethods: 0,
            // 获取药店详细列表相关
            medDetail: {
                Detailedinfo_type: '',
                Pid: '',
                Uid: ''
            },
            // 购物车弹窗
            winCar: false,
            winCarList: [],
            // 模糊搜索
            searchMed: '',
            searchStore: {
                Pid: '',
                Search_key: ''
            },
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
                Uid: '',
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
        this.$nextTick(function() {
            // Uid读取
            this.medDetail.Uid = this.$store.state.Uid;
            this.UPid.Uid = this.$store.state.Uid;
            this.postShopCar.Uid = this.$store.state.Uid;
        });
    },
    activated() {
        document.title = '定点药店-药店';
        // 初始化所有数据
        this.winMed = false;
        this.disabled = true;
        // 获取id
        if (this.$route.params.id) {
            this.storeId = this.$route.params.id;
        }
        this.UPid.Pid = this.storeId;
        // 拉取购物车信息
        this.getShopCarMsg();
        // 获取药店，药品信息
        this.getStoreMsg();
        this.getAllMed();
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
        // 获取药店信息
        getStoreMsg() {
            var that = this;
            this.$vux.loading.show({
                text: "奋力加载中..."
            });
            // 加载数据
            this.$tools.GetDataFromServer(
                this,
                this.$api.storeMsg + this.storeId,
                function success(res) {
                    that.$vux.loading.hide();
                    var resData = res.data.PharmacyInfo;
                    that.storeMsg = resData;
                },
                function error(err) {
                    that.$vux.loading.show({
                        text: "网络错误"
                    });
                    return
                }
            )
        },
        // 默认左侧全部分类时
        getAllMed() {
            var that = this;
            this.isIndex = null;
            // 封装抛出信息
            this.medDetail.Pid = this.storeId;
            this.medDetail.Detailedinfo_type = '';
            // 发出数据
            this.$tools.PostDataToServer(
                this,
                this.$api.medDetail,
                this.medDetail,
                function success(res) {
                    var resData = res.data.DrugwInfo.Itemlist;
                    that.medList = resData;
                },
                function error(err) {
                    that.$vux.loading.show({
                        text: "网络错误"
                    });
                    return
                }
            )
        },
        // 点击左侧分类：带着药店ID和分类ID，请求数据
        chooseMedList(index) {
            var that = this;
            this.isIndex = index;
            // 封装抛出信息
            var typeId = this.storeMsg.type[index].Id;
            this.medDetail.Detailedinfo_type = typeId;
            this.medDetail.Pid = this.storeId;
            // 发出数据
            this.$tools.PostDataToServer(
                this,
                this.$api.medDetail,
                this.medDetail,
                function success(res) {
                    var resData = res.data.DrugwInfo.Itemlist;
                    that.medList = resData;
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
        // 模糊搜索
        search() {
            var that = this;
            this.searchStore.Pid = this.storeId;
            this.searchStore.Search_key = this.searchMed;
            this.$vux.loading.show({
                text: "正在搜索..."
            });
            // 发出数据
            this.$tools.PostDataToServer(
                this,
                this.$api.search,
                this.searchStore,
                function success(res) {
                    that.$vux.loading.hide();
                    var resData = res.data.DrugwInfo.Itemlist;
                    that.medList = resData;
                },
                function error(err) {
                    that.$vux.loading.show({
                        text: "网络错误"
                    });
                    return
                }
            )
        },
        // 物品增减：点击向后端请求购物车结算：抛出当前药品id，商店id
        subGood(index) {
            var that = this;
            // 减少
            this.medList[index].Num--;
            // 购物车数据拼接
            this.postShopCar.Pid = this.storeId;
            this.postShopCar.Did = this.medList[index].Detailed_id;
            this.postShopCar.Drug_name = this.medList[index].Name;
            this.postShopCar.Drug_pic = this.medList[index].Img;
            this.postShopCar.Drug_price = this.medList[index].Activity_price;
            this.postShopCar.Drug_num = -1;
            this.postShopCar.Drug_specifications = this.medList[index].Specifications;
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
        addGood(index) {
            var that = this;
            // 增加
            this.medList[index].Num += 1;
            // 购物车数据拼接
            this.postShopCar.Pid = this.storeId;
            this.postShopCar.Did = this.medList[index].Detailed_id;
            this.postShopCar.Drug_name = this.medList[index].Name;
            this.postShopCar.Drug_pic = this.medList[index].Img;
            this.postShopCar.Drug_price = this.medList[index].Activity_price;
            this.postShopCar.Drug_num = 1;
            this.postShopCar.Drug_specifications = this.medList[index].Specifications;
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
                    that.getAllMed();
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
                    that.getAllMed();
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
            var that = this;
            this.$vux.loading.show({
                text: "正在清空..."
            });
            // 抛出数据组装
            this.$tools.PostDataToServer(
                this,
                this.$api.shopCarDel,
                this.UPid,
                function success(res) {
                    that.$vux.loading.hide();
                    that.getShopCar();
                    that.getAllMed();
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
        Swiper,
        SwiperItem
    }
}
</script>
<style type="text/css" scoped>
.fixedHack {
    width: 100%;
    height: 30%;
}


/*主体*/

.storeDetail {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
}


/*头部*/

.detail_header_content {
    width: 100%;
    height: 30%;
    background: #fff;
    position: fixed;
    top: 0;
    border-bottom: 1px solid #eee;
}

.detail_header {
    width: 100%;
    height: 70%;
    padding: 0 1rem;
}


/*头部左侧logo*/

.detail_header_left {
    width: 5rem;
    height: 100%;
    margin-right: 1rem;
    justify-content: center;
    -ms-align-items: center;
    align-items: center;
}

.detail_header_left img {
    width: 4rem;
}


/*头部右侧信息*/

.detail_header_right {
    height: 100%;
    justify-content: center;
    -webkit-flex: 1;
    -moz-flex: 1;
    -ms-flex: 1;
    -o-flex: 1;
    flex: 1;
}

.header_title,
.header_sign,
.header_time {
    width: 100%;
    font-size: .75rem;
    margin-bottom: .5rem;
    justify-content: space-between;
    -ms-align-items: center;
    align-items: center;
}


/*药店名*/

.header_title h3 {
    font-size: 1.1rem;
}

.header_title span {
    border: 1px solid #35B17F;
    padding: .1rem .5rem;
    color: #35B17F;
    border-radius: .5rem;
}


/*药店支持服务*/

.header_sign {
    justify-content: flex-start;
}

.header_sign>div {
    margin-right: .2rem;
    -ms-align-items: center;
    align-items: center;
}

.header_sign>div img {
    width: 1rem;
    height: 1rem;
    margin-right: .2rem;
}


/*药店营业时间*/

.header_time {
    margin-bottom: 0;
}

.header_time span {
    border: 1px solid #3571B1;
    padding: 0 .5rem;
    color: #3571B1;
    border-radius: .5rem;
}


/*搜索*/

.searchContainer {
    width: 94%;
    height: auto;
    padding: 0 3%;
    background: #474546;
    -ms-align-items: center;
    align-items: center;
}

.searchMed {
    width: 100%;
    height: 2rem;
    line-height: 2rem;
    font-size: .875rem;
    border: none;
    text-align: right;
    color: #fff;
    background: #474546;
}

.searchMed::-webkit-input-placeholder {
    color: #fff;
}

.searchMed::-webkit-input-placeholder {
    color: #fff;
}

.searchContainer .searchIcon {
    width: 1rem;
    height: 1rem;
    margin-left: 1rem;
}


/*药店活动*/

.med_activity {
    width: 100%;
    height: 1.2rem;
    background: #459FEB;
    position: absolute;
    bottom: 0;
    justify-content: space-between;
    -ms-align-items: center;
    align-items: center;
    padding: 0 .5rem;
}

.med_activity>img {
    height: .875rem;
}

.swiper {
    line-height: 1.2rem;
    -webkit-flex: 1;
    -moz-flex: 1;
    -ms-flex: 1;
    -o-flex: 1;
    flex: 1;
}

.swiperItem p {
    text-align: right;
    color: #fff;
    font-size: .75rem;
}

.med_activity_none {
    text-align: right;
    color: #fff;
    font-size: .75rem;
}


/*药店列表开始*/

.detail_content {
    width: 100%;
    height: 70%;
}


/*药店分类*/

.msg_left {
    width: 25%;
    height: 100%;
    float: left;
    overflow-x: hidden;
    overflow-y: auto;
}


/*移动端隐藏滚动条Hack*/

.msg_left::-webkit-scrollbar {
    display: none;
}

.msg_left li {
    width: 100%;
    height: 2.5rem;
    line-height: 2.5rem;
    text-align: center;
    background: #fff;
    border-bottom: 1px dashed #A6DAF0;
    font-size: .875rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.msg_left li.choose {
    background: #eee;
}

.msg_left li:last-child {
    margin-bottom: 3rem;
}


/*药品单品*/

.content_msg {
    width: 75%;
    height: 100%;
    float: right;
    overflow-x: hidden;
    overflow-y: auto;
}


/*移动端隐藏滚动条Hack*/

.content_msg::-webkit-scrollbar {
    display: none;
}

.msg_right {
    width: 100%;
    background: #fff;
}

.msg_right h2 {
    font-size: .875rem;
    height: 1rem;
    line-height: 1rem;
    padding: 5px 0 5px 10px;
    margin-bottom: .5rem;
    border-bottom: 1px dashed #ddd;
    border-left: 4px solid #A6DAF0;
    color: #5E5E5E;
}


/*每个药品单品*/

.msg_right li {
    width: 100%;
    padding: .5rem 0;
    border-bottom: 1px solid #ddd;
}

.msg_right li:last-child {
    margin-bottom: 3rem;
}

.msg_right_msg {
    justify-content: space-between;
}


/*左侧logo*/

.content_msg_logo {
    width: 5rem;
    background: #fff;
    margin: 0 .5rem;
    justify-content: center;
    -ms-align-items: flex-start;
    align-items: flex-start;
}

.content_msg_logo img {
    width: 4rem;
    padding: .5rem;
    border: 1px solid #eee;
}


/*右侧信息*/

.content_msg_msg {
    font-size: .75rem;
    justify-content: space-around;
    -webkit-flex: 1;
    -moz-flex: 1;
    -ms-flex: 1;
    -o-flex: 1;
    flex: 1;
}

.content_msg_msg h3 {
    font-size: .875rem;
}


/*价格规格*/

.specContent {
    width: 100%;
    margin-top: .2rem;
    justify-content: space-between;
    -ms-align-items: center;
    align-items: center;
}

.specContent .spec {
    color: #005785;
}


/*地址*/

.address {
    color: #7D7D7D;
    margin-top: .2rem;
}


/*标签*/

.sign p {
    border: 1px solid #519EBF;
    color: #005785;
    border-radius: 4px;
    padding: 0 .2rem;
    margin: .2rem .5rem 0 0;
}


/*药品原价，促销价*/

.msg_right_price {
    width: 100%;
    margin-top: .5rem;
    font-size: .75rem;
    font-weight: bold;
    color: #DE1515;
    justify-content: space-between;
    -ms-align-items: center;
    align-items: center;
}

.msg_right_price .price {
    margin-right: .5rem;
}

.msg_right_price .oldPrice {
    text-decoration-line: line-through;
}

.msg_right_price>div {
    font-size: .875rem;
    color: #333;
    font-weight: normal;
    justify-content: flex-end;
    -ms-align-items: center;
    align-items: center;
}

.msg_right_price>div input {
    border: none;
    background: none;
    width: 1rem;
    text-align: center;
}

.msg_right_price>div img {
    width: 1.3rem;
    height: 1.3rem;
    margin: 0 .5rem;
}


/*购物车计算*/

.msg_right_computed {
    width: 100%;
    margin-top: .2rem;
    font-size: .875rem;
    justify-content: flex-end;
    -ms-align-items: center;
    align-items: center;
}

.msg_right_computed input {
    border: none;
    background: none;
    width: 1rem;
    text-align: center;
}

.msg_right_computed img {
    width: 1.3rem;
    height: 1.3rem;
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
