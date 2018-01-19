<template>
    <!--地址管理-->
    <div class="newaddress">
        <!-- 提示弹窗 -->
        <div class="addresstip">
            <h1 class="delpopup" v-if="delpopup">{{delpopup}}</h1>
        </div>
        <!-- 遮罩层 -->
        <div v-if="winDel" class="mask"></div>
        <!-- 删除弹窗 -->
        <!--地址管理详细信息-->
        <div class="has-address">
            <div class="address-details" v-for="item in Items">
                <div class="information">
                    <div class="people_i">
                        <p class="p_name">{{item.Name}}</p>
                        <span class="numb">联系电话：{{item.Tel}}</span>
                    </div>
                    <div class="adress">{{item.Detailed}}</div>
                </div>
                <!--地址管理具体操作-->
                <div class="edit">
                    <div class="edit_lift">
                        <!--勾选默认地址-->
                        <div class="on_check" @click="defaultAddress(item.Id)" :checked="item.Flag == 1">
                            <input type="radio" :checked="item.Flag == 1" />
                            <label v-if="item.Flag == 1">默认地址</label>
                            <label v-else>设为默认</label>
                        </div>
                    </div>
                    <div class="edit_right">
                        <!--删除地址-->
                        <div class="delete-address" @click="delAddress(item.Id)">
                            <p>删除</p>
                        </div>
                        <!--编辑地址-->
                        <router-link tag="div" class="deit-address" :to="{name:'editaddress',params:{Id:item.Id}}">
                            <p>编辑</p>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
        <router-link tag="div" :to="{name:'addaddress',params:{UserId: userid}}" class="creataddress">
            <p>新建地址</p>
        </router-link>
        <div class="no-address" v-if="ok">
            <p>没有搜索到您的收货地址</p>
        </div>
    </div>
</template>
<script type="text/javascript">
import {
    Confirm,
    XButton,
    TransferDomDirective as TransferDom
} from 'vux'
export default {
    name: 'newaddress',
    data() {
        return {
            addresslists: [],
            Items: [],
            Id: '',
            delpopup: '',
            ok: false,
            selectaddress: '',
            radioVal: '',
            userid: '',
            // 删除弹窗相关
            winDel: false
        }
    },
    created(){
        this.userid = this.$store.state.Uid;
    },
    activated() {
        document.title = "地址管理";
        this.activateGetAddress();
        this.delpopup = "";
    },
    methods: {
        // for循环加载地址信息
        activateGetAddress() {
            var that = this;
            this.$vux.loading.show({text:"奋力加载中..."});
            // 加载数据
            this.$tools.GetDataFromServer(
                this,
                this.$api.Addressmanagement + '/Uid/13213125151',
                function success(res) {
                    that.$vux.loading.hide();
                    that.Items = res.data.UseraddressInfo.Itemlist;
                    if (that.Items.length === 0) {
                        that.ok = true;
                    }
                },
                function error(err) {
                    return;
                }
            )
        },
        // 点击删除地址
        delAddress(Id) {
            var that = this;
            // 加载数据
            var x = confirm("确认要删除该地址吗？")
            if (x == true) {
                this.$tools.GetDataFromServer(
                    this,
                    this.$api.delAddress + '/ItemId/' + Id,
                    function success(res) {
                        if (res.data.State.Code === 1) {
                            that.delpopup = "删除成功";
                            //定时器，1秒后提示消失
                            setTimeout(function() {
                                that.delpopup = "";
                            }, 1000);
                            //调取数据刷新
                            that.activateGetAddress();
                        } else {
                            that.delpopup = "删除失败，请刷新重试";
                            setTimeout(function() {
                                that.delpopup = "";
                            }, 1500);
                        }
                    },
                    function error(err) {
                        return;
                    }
                )
            }
            // this.id=Id;
        },
        //设置默认地址
        defaultAddress(Id) {
            var that = this;
            // 加载数据
            this.$tools.GetDataFromServer(
                this,
                this.$api.defAddress + '/ItemId/' + Id,
                function success(res) {
                    if (res.data.State.Code === 1) {
                        that.delpopup = "设置默认地址成功";
                        //定时器1秒后提示消失
                        setTimeout(function() {
                            that.delpopup = "";
                        }, 1000);
                        //调取数据刷新
                        that.activateGetAddress();
                    } else {
                        that.delpopup = "设置失败，请刷新重试"
                    }
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
/*地址管理详细信息*/

.has-address {
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
    -webkit-flex-direction: column;
    -moz-flex-direction: column;
    -ms-flex-direction: column;
    -o-flex-direction: column;
    flex-direction: column;
    padding-bottom: 1.5rem;
}

.address-details {
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
    -webkit-flex-direction: column;
    -moz-flex-direction: column;
    -ms-flex-direction: column;
    -o-flex-direction: column;
    flex-direction: column;
}

.information {
    border-bottom: 1px solid #eef3f6;
    padding: 1rem 0rem 0.875rem 0rem;
    -webkit-flex-direction: column;
    -moz-flex-direction: column;
    -ms-flex-direction: column;
    -o-flex-direction: column;
    flex-direction: column;
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


/*地址样式*/

.adress {
    font-size: 0.875rem;
    padding: 0rem 1rem;
}


/*姓名*/

.p_name {
    color: #000;
    font-size: 1rem;
}


/*电话*/

.people_i {
    padding: 0rem 1rem 0.5rem 1rem;
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

.numb {
    font-size: 1rem;
    padding-left: 2rem;
    color: #000;
}


/*地址管理具体操作*/

.edit {
    width: 100%;
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
    padding-top: 0.625rem;
    padding-bottom: 0.625rem;
    border-bottom: 1rem solid #edf2f5;
}

.edit_lift {
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


/*勾选默认地址*/

.on_check {
    display: -webkit-box;
    /* OLD - iOS 6-, Safari 3.1-6 */
    display: -moz-box;
    /* OLD - Firefox 19- */
    display: -ms-flexbox;
    /* TWEENER - IE 10 */
    display: -webkit-flex;
    /* NEW - Chrome */
    display: flex;
    padding-left: 1rem;
    align-items: center;
}

.on_check label {
    font-size: 0.875rem;
    margin-left: 0.25rem;
    /*color: #ababab;*/
}


/*.on_check input{
  align-self: center;
}*/

.default-address {
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


/*input[type="checkbox"] + label::before {*/


/*content: "\a0";*/


/*不换行空格*/


/*display: inline-block;
    vertical-align: .2em;
    width: 1em;
    height: 1em;
    margin-right: .2em;
    border-radius: .2em;
    background-color:#1296db;
    text-indent: .15em;
    line-height: .65;  */


/*行高不加单位，子元素将继承数字乘以自身字体尺寸而非父元素行高*/


/*}
input[type="checkbox"]:checked + label::before {
    content: "\2713";
    background-color: #1296db;
}
input {
    position: absolute;
    clip: rect(0, 0, 0, 0);
}*/


/*input[type="checkbox"]:focus + label::before {
    box-shadow: 0 0 .1em .1em #58a;
}*/


/*input[type="checkbox"]:disabled + label::before {
    background-color: gray;
    box-shadow: none;
    color: #555;
}*/


/*编辑地址右侧*/

.edit_right {
    width: 70%;
    display: -webkit-box;
    /* OLD - iOS 6-, Safari 3.1-6 */
    display: -moz-box;
    /* OLD - Firefox 19- */
    display: -ms-flexbox;
    /* TWEENER - IE 10 */
    display: -webkit-flex;
    /* NEW - Chrome */
    display: flex;
    justify-content: flex-end;
    font-size: 0.875rem;
}


/*地址删除*/

.delete-address {
    -webkit-box-pack: end;
    -moz-box-pack: end;
    -ms-box-pack: end;
    box-pack: end;
}

.delete-address p {
    line-height: 1.3rem;
    color: #aaa;
    border: 0.0625rem solid #aaa;
    border-radius: 0.5rem;
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    font-size: 0.875rem;
}


/*地址编辑*/

.deit-address {
    margin-left: 1rem;
}

.deit-address p {
    line-height: 1.3rem;
    font-size: 0.875rem;
    color: #44ac87;
    border: 0.0625rem solid #44ac87;
    border-radius: 0.5rem;
    padding-left: 0.25rem;
    padding-right: 0.25rem;
}


/*新建地址按钮*/

.creataddress {
    width: 100%;
    position: fixed;
    bottom: 0;
    background-color: #fff;
}

.creataddress p {
    line-height: 2.5rem;
    background-color: #02ae66;
    color: #fff;
    font-size: 1.25rem;
    text-align: center;
    /*border-radius: 0.5rem;
  margin-left: 1rem;
  margin-right: 1rem;*/
}


/*没有收货地址添加收货地址*/

.no-address {
    width: 100%;
    height: 100%;
    display: -webkit-box;
    /* OLD - iOS 6-, Safari 3.1-6 */
    display: -moz-box;
    /* OLD - Firefox 19- */
    display: -ms-flexbox;
    /* TWEENER - IE 10 */
    display: -webkit-flex;
    /* NEW - Chrome */
    display: flex;
    -webkit-flex-direction: column;
    -moz-flex-direction: column;
    -ms-flex-direction: column;
    -o-flex-direction: column;
    flex-direction: column;
    padding-top: 10rem;
    justify-content: center;
    align-items: center;
}

.no-address .addbtn p {
    background-color: #02ae66;
    color: #fff;
    font-size: 1.125rem;
    text-align: center;
    border-radius: 0.2rem;
    padding-left: 0.2rem;
    padding-right: 0.2rem;
}


/*提示弹窗样式*/

.addresstip {
    width: 100%;
    display: -webkit-box;
    /* OLD - iOS 6-, Safari 3.1-6 */
    display: -moz-box;
    /* OLD - Firefox 19- */
    display: -ms-flexbox;
    /* TWEENER - IE 10 */
    display: -webkit-flex;
    /* NEW - Chrome */
    display: flex;
    justify-content: space-around;
    position: fixed;
    bottom: 3.5rem;
}

.delpopup {
    color: #000;
    font-weight: normal;
    background-color: #eee;
    padding: 0.5rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
}
</style>
