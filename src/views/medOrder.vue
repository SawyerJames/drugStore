<template>
    <div class="medOrder">
        <div v-if="validate" class="validate">{{validate}}</div>
        <!-- 上方模块：默认地址，点击跳转选择默认地址页 -->
        <div class="medTop boxBorder flexCol">
            <div class="flexRow">
                <p class="flexRow">取药人：
                    <input type="text" class="nameInput" v-model="postMsg.Name">
                </p>
                <p class="flexRow">联系电话：
                    <input type="tel" maxlength="11" class="telInput" v-model="postMsg.Tel">
                </p>
            </div>
            <p class="flexRow">取药店铺：
                <select :change="compareId()" class="addressSelect" v-model="postMsg.Pid">
                    <option v-for="item in addressList" :value="item.Id">{{item.Name}}</option>
                </select>
            </p>
            <div class="flexRow">
                <p class="flexRow">药店地址：</p><span>{{postMsg.Address}}</span>
            </div>
        </div>
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
            <p>到店自提</p>
        </div>
        <!-- 营业时间 -->
        <div class="medModel boxBorder flexRow">
            <p>营业时间</p>
            <p>{{medMsg.Businesshours}}</p>
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
export default {
    name: 'medOrder',
    data() {
        return {
            medMsg: [],
            // 取药地址
            addressList: [],
            Pid: '',
            // 需要抛出的信息
            postMsg: {
                Remark: '',
                Uid: '13213125151',
                Pid: '',
                Total: '',
                Pick: 0,
                Name: '',
                Time: '',
                Tel: '',
                Address: '',
                Info: [],
                CarId: ''
            },
            // 验证
            validate: ''
        }
    },
    activated() {
        document.title = '定点药店-到店自取服务';
        this.validate = '';
        // 药店传来的信息
        if (this.$route.params.msg) {
            this.medMsg = this.$route.params.msg;
            this.Pid = this.$route.params.msg.Pid;
        }
        // 获取药店地址
        this.getMedAddress();
    },
    methods: {
        // 当select改变时，比较其药店id，拿取当前id对应的地址
        compareId() {
            // 如果地址长度不为零
            if (this.addressList.length != 0) {
                // 循环地址，比较id
                for (var i = 0; i < this.addressList.length; i++) {
                    if (this.addressList[i].Id == this.postMsg.Pid) {
                        this.postMsg.Address = this.addressList[i].Address;
                    }
                }
            }
        },
        // 提交发送
        postOrder() {
            var that = this;
            var phoneRe = /^[1][3,4,5,7,8,9][0-9]{9}$/;
            // 验证通过则发起提交
            if (this.postMsg.Name == '') {
                this.validate = "您还未填写取药人";
                var validate = setTimeout(function() {
                    that.validate = "";
                }, 1000);
            } else {
                if (this.postMsg.Tel == '') {
                    this.validate = "您还未填写联系方式";
                    var validate = setTimeout(function() {
                        this.validate = "";
                    }, 1000);
                } else {
                    if (!phoneRe.test(this.postMsg.Tel)) {
                        this.validate = "联系方式格式不正确";
                        var validate = setTimeout(function() {
                            this.validate = "";
                        }, 1000);
                    } else {
                        if (this.postMsg.Address == '') {
                            this.validate = "您还未选择取药地址";
                            var validate = setTimeout(function() {
                                this.validate = "";
                            }, 1000);
                        } else {
                            this.validate = "";
                            // 清空购物车id字符串Hack
                            this.postMsg.CarId = '';
                            // 拼接抛出数据
                            this.postMsg.Total = this.$route.params.msg.Count;
                            this.postMsg.Remark = this.postMsg.Remark;
                            this.postMsg.Info = this.$route.params.msg.Itemlist;
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
                }
            }
        },
        // 获取取药地址
        getMedAddress() {
            var that = this;
            this.$vux.loading.show({
                text: "奋力加载中..."
            });
            console.log(this.Pid);
            // 抛出数据
            this.$tools.GetDataFromServer(
                this,
                this.$api.getMedAddress + this.Pid,
                function success(res) {
                    that.$vux.loading.hide();
                    var resData = res.data.Info;
                    that.addressList = resData;
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
    -ms-align-items: center;
    align-items: center;
}


/*药店地址*/

.medTop>div:last-child p {
    font-size: .75rem;
    margin-right: 10px;
}


/* 上部表单 */

.addressSelect {
    border: none;
    border-bottom: 1px solid #ddd;
    margin-bottom: .5rem;
    -webkit-flex: 1;
    -moz-flex: 1;
    -ms-flex: 1;
    -o-flex: 1;
    flex: 1;
}

.nameInput,
.telInput {
    width: 4rem;
    border: none;
    border-bottom: 1px solid #ddd;
    text-align: center;
}

.telInput {
    width: 7rem;
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
</style>
