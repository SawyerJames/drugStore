<template>
    <div class="doorOrder">
        <div v-if="validate" class="validate">{{validate}}</div>
        <!-- 上方模块：默认地址，点击跳转选择默认地址页 -->
        <router-link tag="div" to="/newaddress">
            <div v-if="address.C_name != null" class="medTop boxBorder flexCol">
                <div class="flexRow">
                    <p>收货人：{{address.Name}}</p>
                    <p>联系电话：{{address.Tel}}</p>
                </div>
                <p>收货地址：{{address.C_name}}{{address.D_name}}{{address.Detailed}}</p>
            </div>
            <div v-else class="medTop boxBorder flexCol">
                <p class="noAddress flexRow"><img src="../assets/pay/address.png">点击此处：选择您的地址</p>
            </div>
        </router-link>
        <!-- 药品信息 -->
        <div v-for="item in medMsg.Itemlist" class="medMsgContent flexRow boxBorder">
            <div class="medMsg_header flexRow">
                <img :src="item.cartinfo_drug_pic">
            </div>
            <div class="medMsg_msg flexCol">
                <h3>{{item.cartinfo_drug_name}}</h3>
                <p class="spec">{{item.cartinfo_drug_specifications}}</p>
                <div class="med_sum flexRow">
                    <p class="price">{{item.cartinfo_drug_price}}</p>
                    <p class="sum">*{{item.cartinfo_drug_num}}</p>
                </div>
            </div>
        </div>
        <!-- 付款方式 -->
        <div class="medModel boxBorder flexRow">
            <p>付款方式</p>
            <p>线上付款</p>
        </div>
        <!-- 配送方式 -->
        <div class="medModel boxBorder flexRow">
            <p>配送方式</p>
            <p>送药上门</p>
        </div>
        <!-- 配送时间 -->
        <div class="medModel boxBorder flexRow">
            <p>配送时间</p>
            <group class="businesshoursHack">
                <datetime class="dateTimeHack" v-model="businesshoursStart" format="HH:mm" :minute-list="['00']" :compute-hours-function="startTime"></datetime>
            </group>
            <p>至</p>
            <group class="businesshoursHack">
                <datetime class="dateTimeHack" v-model="businesshoursEnd" format="HH:mm" :minute-list="['00']" :compute-hours-function="endTime"></datetime>
            </group>
        </div>
        <!-- 备注 -->
        <textarea placeholder="备注：30字内" maxlength="30" class="medModelTextarea boxBorder" v-model="postMsg.Remark"></textarea>
        <!-- 总计 -->
        <div class="medAddSum boxBorder flexRow">
            <p>共 {{medMsg.TotalCount}} 件商品</p>
            <p>小计：<span class="price">￥{{medMsg.Count}}元</span></p>
        </div>
        <!-- 提交 -->
        <div class="subContentHack"></div>
        <div class="subContent boxBorder flexRow">
            <p>合计：￥{{medMsg.Count}}</p>
            <button type="button" @click="postOrder()">提交</button>
        </div>
    </div>
</template>
<script type="text/javascript">
import {
    Datetime,
    Group
} from 'vux'
export default {
    name: 'doorOrder',
    data() {
        return {
            // 需要抛出的信息
            postMsg: {
                Remark: '',
                Uid: '13213125151',
                Pid: '',
                Total: '',
                Pick: 1,
                Name: '',
                Time: '',
                Tel: '',
                Address: '',
                Info: [],
                CarId: ''
            },
            // 验证
            validate: '',
            // 配送时间
            businesshoursStart: '',
            businesshoursEnd: '',
            // 购物车药品信息
            medMsg: {},
            // 默认地址信息
            address: {},
        }
    },
    activated() {
        document.title = '定点药店-送药上门服务';
        this.validate = '';
        // 进入组件后拉取信息
        this.getAddress();
        // 药店传来的信息
        if (this.$route.params.msg) {
            this.medMsg = this.$route.params.msg;
        }
    },
    methods: {
        // 配送时间取值
        startTime(date, isToday, generateRange) {
            return generateRange(new Date().getHours(), 23)
        },
        endTime(date, isToday, generateRange) {
            return generateRange(new Date().getHours() + 1, 23)
        },
        // 提交发送
        postOrder() {
            var that = this;
            // 验证通过则发起提交
            if (this.businesshoursStart == '' || this.businesshoursEnd == '') {
                this.validate = "为正确选择配送时间";
                var validate = setTimeout(function() {
                    this.validate = "";
                }, 1000);
            } else {
                // 时间取值前两位，转为数值类型进行比较
                var startTime = parseInt(this.businesshoursStart.slice(0, 2));
                var endTime = parseInt(this.businesshoursEnd.slice(0, 2));
                if (startTime > endTime || startTime == endTime) {
                    this.validate = "起始时间大于最终时间";
                    var validate = setTimeout(function() {
                        this.validate = "";
                    }, 1000);
                } else {
                    this.validate = "";
                    // 清空购物车id字符串Hack
                    this.postMsg.CarId = '';
                    // 拼接抛出数据
                    this.postMsg.Pid = this.$route.params.msg.Pid;
                    this.postMsg.Total = this.$route.params.msg.Count;
                    this.postMsg.Name = this.address.Name;
                    this.postMsg.Tel = this.address.Tel;
                    this.postMsg.Address = this.address.C_name + this.address.D_name + this.address.Detailed;
                    this.postMsg.Remark = this.postMsg.Remark;
                    this.postMsg.Info = this.$route.params.msg.Itemlist;
                    this.postMsg.Time = this.businesshoursStart + '-' + this.businesshoursEnd;
                    for (var i = 0; i < this.postMsg.Info.length; i++) {
                        this.postMsg.CarId += (this.postMsg.Info[i].id + ',');
                    }
                    // 抛出数据
                    this.$tools.PostDataToServer(
                        this,
                        this.$api.postOrder,
                        this.postMsg,
                        function success(res) {
                            that.$router.replace('/pay');
                        },
                        function error(err) {
                            that.$vux.loading.show({
                                text: "网络错误"
                            });
                            return
                        }
                    )
                }
            }
        },
        // 获取用户默认地址
        getAddress() {
            var that = this;
            this.$vux.loading.show({
                text: "奋力加载中..."
            });
            // 加载数据
            this.$tools.GetDataFromServer(
                this,
                this.$api.getAddress + '13213125151',
                function success(res) {
                    that.$vux.loading.hide();
                    var resData = res.data.UseraddressInfo;
                    that.address = resData;
                },
                function error(err) {
                    that.$vux.loading.show({
                        text: "网络错误"
                    });
                    return
                }
            )
        }
    },
    components: {
        Datetime,
        Group
    },
}
</script>
<style type="text/css" scoped>
/*上部提示*/

.medTop {
    width: 100%;
    min-height: 6rem;
    padding: 2% 5% 0;
    border-bottom: 1px dashed #459FEB;
    font-size: .75rem;
    justify-content: center;
}

.medTop>div {
    margin-bottom: .5rem;
    justify-content: space-between;
}

.medTop>div p {
    font-size: .875rem;
}

.noAddress{
  align-self: center;
  font-size: .875rem;
  background: #459FEB;
  border-radius: .25rem;
  padding: .5rem 1.5rem;
  color: #fff;
  -ms-align-items: center;
  align-items: center;
}
.noAddress img{
  width: 1.2rem;
  margin-right: .5rem;
}
/*药品信息*/


/*药品logo*/

.medMsgContent {
    width: 100%;
    height: 5rem;
    padding: 2% 5%;
    background: #fff;
    border-bottom: 1px solid #eee;
    justify-content: space-between;
}

.medMsg_header {
    width: 5rem;
    height: 100%;
    justify-content: center;
    -ms-align-items: center;
    align-items: center;
}

.medMsg_header img {
    width: 3rem;
}


/*药品其他信息*/

.medMsg_msg {
    margin-left: 1rem;
    font-size: .875rem;
    justify-content: space-around;
    -webkit-flex: 1;
    -moz-flex: 1;
    -ms-flex: 1;
    -o-flex: 1;
    flex: 1;
}

.medMsg_msg .spec {
    font-size: .75rem;
    color: #666;
}

.med_sum {
    justify-content: space-between;
}

.price {
    color: #DE1515;
}


/*付款方式等模板*/

.medModel {
    width: 100%;
    height: 3rem;
    padding: 2% 5%;
    font-size: .875rem;
    justify-content: space-between;
    -ms-align-items: center;
    align-items: center;
    border-bottom: 1px solid #eee;
}

.medModel p:last-child {
    color: #666;
}


/*备注*/

.medModelTextarea {
    width: 95%;
    height: 3rem;
    padding: .2rem .5rem;
    margin: 1rem 2.5% 0;
    border: 1px solid #eee;
    border-radius: 4px;
    font-size: .75rem;
}


/*总计*/

.medAddSum {
    width: 100%;
    padding: 2% 5%;
    font-size: .875rem;
    color: #666;
    justify-content: flex-end;
}

.medAddSum p:first-child {
    margin-right: 1rem;
}


/*提交*/

.subContentHack {
    width: 100%;
    height: 3rem;
    background: none;
}

.subContent {
    width: 100%;
    height: 3rem;
    color: #fff;
    justify-content: flex-end;
    -ms-align-items: center;
    align-items: center;
    position: fixed;
    bottom: 0;
    background: #474546;
}

.subContent button {
    width: 5rem;
    height: 3rem;
    margin-left: 1rem;
    border: none;
    background: #2EA472;
    color: #fff;
}


/*配送时间hack*/

.businesshoursHack {
    margin-top: 0 !important;
    height: 3rem;
    font-size: .875rem;
}

.vux-no-group-title {
    background: red;
}
</style>
