<template>
    <div class="pay flexCol">
        <!-- 社保卡支付 -->
        <div class="paySign">选择医保卡支付贼便宜，便宜两块钱！</div>
        <div :class="['payModel',{isChoose: payMod == 1}]">
            <div class="payMdel_img flexRow">
                <img src="../assets/pay/social.png">
                <p>医保卡支付</p>
            </div>
            <input type="radio" v-model="payMod" value="1"></input>
        </div>
        <!-- 微信支付 -->
        <div :class="['payModel',{isChoose: payMod == 0}]">
            <div class="payMdel_img flexRow">
                <img src="../assets/pay/wx.png">
                <p>微信支付</p>
            </div>
            <input type="radio" v-model="payMod" value="0"></input>
        </div>
        <!-- 支付按钮 -->
        <button type="button" class="payBtn" @click="pay()">立即付款</button>
    </div>
</template>
<script type="text/javascript">
export default {
    name: 'pay',
    data() {
        return {
            payMod: 1
        }
    },
    mounted() {
        this.$nextTick(function() {
            // 如果有cookie，清除，拉取支付
            if (this.$tools.CheckCookie("cardCookie")) {
                this.$tools.ClearCookie("cardCookie");
                alert("医保卡支付成功");
                // 社保卡支付：有待商榷
                // 跳转至首页？还是其他页
                this.$router.replace("/");
            }
        });
    },
    activated() {
        document.title = '定点药店-正在支付';
    },
    methods: {
        // 发起支付请求: 0为微信支付，1为社保卡支付
        pay() {
            var that = this;
            // 微信支付
            if (this.payMod == 0) {
                // 抛出数据
                this.$tools.PostDataToServer(
                    this,
                    this.$api.wxPay,
                    // 抛出数据：有待商榷
                    this.payMod,
                    function success(res) {
                        // 成功则传给微信获取的数据，拉取微信支付
                        var resData = res.data;
                        that.weixinPay(resData);
                        alert("调取了支付接口了，但是数据没有正确匹配而已");
                    },
                    function error(err) {
                        that.$vux.loading.show({
                            text: "网络错误"
                        });
                        return
                    }
                )
            }
            // 社保卡支付：需检查是否有cookie存在
            else {
                // 如果没有cookie，设置cookie后跳离当前页
                if (!this.$tools.CheckCookie("cardCookie")) {
                    this.$tools.SetCookie("cardCookie", 1, 24);
                    // 跳转的URL
                    location.href = "http://oa.jltengfang.com/intelligent/Creator/eee/url/localhost:8081";
                }
            }
        },
        /**
         * @method :微信支付方法
         * @param data
         */
        weixinPay(data) {
            var that = this;
            if (typeof WeixinJSBridge == "undefined") { //微信浏览器内置对象。参考微信官方文档
                if (document.addEventListener) {
                    document.addEventListener('WeixinJSBridgeReady', that.onBridgeReady(data), false);
                } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady', that.onBridgeReady(data));
                    document.attachEvent('onWeixinJSBridgeReady', that.onBridgeReady(data));
                }
            } else {
                that.onBridgeReady(data);
            }
        },
        /**
         * @method 支付费用方法
         * @param data:后台返回的支付对象,(详情微信公众号支付API中H5提交支付);
         */
        onBridgeReady(data) {
            var that = this;
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', {
                    "appId": data.appId, //公众号名称，由商户传入
                    "timeStamp": data.timeStamp, //时间戳，自1970年以来的秒数
                    "nonceStr": data.nonceStr, //随机串
                    "package": data.package,
                    "signType": data.signType, //微信签名方式：
                    "paySign": data.paySign //微信签名
                },
                function(res) {
                    that.loading = true;
                    // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        that.getPayMsg();
                    } else {
                        that.loading = false;
                        that.alert = true;
                        that.title = "支付失败";
                        that.text = "此次支付不成功";
                    }
                }
            );
        }
    }
}
</script>
<style type="text/css" scoped>
.paySign {
    margin-bottom: 20px;
    font-size: .875rem;
}


/*最外层样式*/

.pay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    justify-content: center;
    -ms-align-items: center;
    align-items: center;
}


/*支付选项样式*/

.payModel {
    width: 8rem;
    height: 2rem;
    margin: 0 0 20px 0;
    position: relative;
    z-index: 1;
}


/*支付的隐藏radio*/

.payModel input {
    width: 8rem;
    height: 2rem;
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    opacity: 0;
}


/*支付表面样式*/

.payMdel_img {
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #fff;
    width: 100%;
    height: 100%;
    font-size: .875rem;
    -ms-align-items: center;
    align-items: center;
}

.payMdel_img img {
    width: 1.5rem;
    margin: 0 .5rem;
}


/*点击时样式*/

.payModel.isChoose .payMdel_img {
    background: red;
}


/*支付按钮*/

.payBtn {
    width: 8rem;
    height: 2rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #fff;
    font-size: .875rem;
}
</style>
