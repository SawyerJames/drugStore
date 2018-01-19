<template>
    <div class="add_adress">
        <!-- 验证提示 -->
        <h1 class="validate" v-if="validate">{{validate}}</h1>
        <div class="addaddress_gs">
            <div class="addadress_ys">
                <label>收货人</label>
                <input type="text" placeholder="请填写真实姓名" v-model="address.Name" />
            </div>
            <div class="addadress_ys">
                <label>联系电话</label>
                <input type="tel" placeholder="请填入手机号码" v-model="address.Tel" />
            </div>
            <div class="addadress_ys add-item flexRow borderBox">
                <label>省</label>
                <select name="province" class="info" v-model="address.Pid" @change='changePro(address.Pid)' disabled="disabled">
                    <option disabled value="">请选择</option>
                    <option v-for="(item,index) in addProList" v-bind:value="item.Id">{{item.Name}}</option>
                </select>
            </div>
            <div class="addadress_ys add-item flexRow borderBox">
                <label>市</label>
                <select name="city" class="info" v-model="address.Cid" @change='changeCity(address.Cid)'>
                    <option disabled value="">请选择</option>
                    <option v-for="(item,index) in addCityList" v-bind:value="item.Id">{{item.Name}}</option>
                </select>
            </div>
            <div class="addadress_ys add-item flexRow borderBox">
                <label>区</label>
                <select name="area" class="info" v-model="address.Did" @change='changeArea()'>
                    <option disabled value="">请选择</option>
                    <option v-for="(item,index) in addAreaList" v-bind:value="item.Id">{{item.Name}}</option>
                </select>
            </div>
        </div>
        <!-- <p class="shjtdz">收货具体地址</p> -->
        <div class="addaddress_gs">
            <div class="addadress_ys">
                <label>地址详情</label>
                <input type="text" placeholder="填写具体的收货地址" v-model="address.Detailed" />
            </div>
        </div>
        <div class="tjdz_btn">
            <button @click="postAdd">保存</button>
        </div>
    </div>
</template>
<script type="text/javascript">
export default {
    name: 'addaddress',
    data() {
        return {
            item: [],
            Id: '',
            resData: '',
            // 地址三级联动信息
            addProList: {},
            addCityList: {},
            addAreaList: {},
            // 准备抛出的信息
            address: {
                UserId: '',
                Name: '',
                Tel: '',
                Cid: '',
                Detailed: '',
                Pid: '',
                Did: '',
            },
            // 表单验证
            validate: '',
            // 验证
            addressSuccess: {
                realnameSu: false,
                telephoneSu: false,
                citySu: false,
                detailSu: false,
                proSu: false,
                countySu: false,
            },
            // 报错弹窗
            errShow: false,
            errTxt: '',
            parentid: 100000,
        }
    },
    // 每次退出组件初始化组件
    activated() {
        document.title = "新增地址";
        this.UserId = this.$route.params.UserId;
        // 认证制空
        this.addressSuccess.realnameSu = false;
        this.addressSuccess.telephoneSu = false;
        this.addressSuccess.citySu = false;
        this.addressSuccess.detailSu = false;
        this.addressSuccess.proSu = false;
        this.addressSuccess.countySu = false;
        //清空抛出信息
        this.address.Name = '';
        this.address.Tel = '';
        this.address.Pid = '220000';
        this.address.Cid = '';
        this.address.Did = '';
        this.address.Detailed = '';
        //调用省接口
        this.getProList();
        this.changePro('220000');
    },
    methods: {
        // 触发省->市联动：清空其他信息
        changePro(id) {
            this.parentid = id;
            this.addAreaList = {};
            this.details = '';
            this.getCityList();
        },
        // 触发市->区联动：清空其他信息
        changeCity(id) {
            this.parentid = id;
            this.details = '';
            this.getAreaList();
        },
        changeArea() {
            this.details = '';
        },
        // 三级联动获取：省
        getProList() {
            var that = this;
            // 加载数据
            this.$tools.GetDataFromServer(
                this,
                this.$api.proSelect,
                function success(res) {
                    var resData = res.data;
                    that.addProList = resData.AreaInfo.Itemlist;
                },
                function error(err) {
                  return;
                }
            )
        },
        // 三级联动获取：市
        getCityList() {
            var that = this;
            // 加载数据
            this.$tools.GetDataFromServer(
                this,
                this.$api.citySelect + '/ItemId/' + this.parentid,
                function success(res) {
                    var resData = res.data;
                    that.addCityList = resData.AreaInfo.Itemlist;
                },
                function error(err) {
                    return;
                }
            )
        },
        // 三级联动获取：区
        getAreaList() {
            var that = this;
            // 加载数据
            this.$tools.GetDataFromServer(
                this,
                this.$api.areaSelect + '/ItemId/' + this.parentid,
                function success(res) {
                    var resData = res.data;
                    that.addAreaList = resData.AreaInfo.Itemlist;
                },
                function error(err) {
                  return;
                }
            )
        },
        // 检测三级联动
        checkNam() {
            if (this.address.Name == '') {
                this.validate = '请填写真实姓名'
                return false;
            } else {
                this.address.Name = this.address.Name;
                this.addressSuccess.realnameSu = true;
            }
        },
        checkTele() {
            if (this.address.Tel == '') {
                this.validate = '请填写手机号码'
                return false;
            } else {
                this.address.Tel = this.address.Tel;
                this.addressSuccess.telephoneSu = true;
            }
        },
        checkPro() {
            if (this.address.Pid == '') {
                this.validate = '请选择正确省份'
                return false;
            } else {
                this.address.Pid = this.address.Pid;
                this.addressSuccess.proSu = true;
            }
        },
        checkCity() {
            if (this.address.Cid == '') {
                this.validate = '请选择正确市区'
                return false;
            } else {
                this.address.Cid = this.address.Cid;
                this.addressSuccess.citySu = true;
            }
        },
        checkCounty() {
            if (this.address.Did == '') {
                this.validate = '请选择正确县区'
                return false;
            } else {
                this.address.Did = this.address.Did;
                this.addressSuccess.countySu = true;
            }
        },
        checkDetails() {
            if (this.address.Detailed == '') {
                this.validate = '请填写详细地址'
                return false;
            } else {
                this.address.address = this.address.Detailed;
                this.addressSuccess.detailSu = true;
            }
        },
        // 验证&数据传输
        postAdd() {
            var that = this
            this.checkNam()
                // 校验
            if (that.addressSuccess.realnameSu) {
                this.checkTele()
                if (this.addressSuccess.telephoneSu) {
                    this.checkPro()
                    if (this.addressSuccess.proSu) {
                        this.checkCity()
                        if (this.addressSuccess.citySu) {
                            this.checkCounty()
                            if (this.addressSuccess.countySu) {
                                this.checkDetails()
                                if (this.addressSuccess.detailSu) {
                                    this.validate = '';
                                    // 传输数据
                                    this.address.Uid = this.UserId;
                                    this.$tools.PostDataToServer(
                                        this,
                                        this.$api.addAddress, //新增地址接口
                                        this.address,
                                        function success(res) {
                                            var resData = res.data;
                                            // 如果成功，跳转至地址列表页面
                                            if (resData.State.Code == 1) {
                                                that.$router.replace('/newaddress');
                                            }
                                        },
                                        // 如果失败，清空表单
                                        function error(err) {
                                            return;
                                        }
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</script>
<style type="text/css" scoped>
body {
    background-color: #edf2f5;
}

.addaddress_gs {
    width: 100%;
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
    /*定义父级垂直方向起点在上沿*/
    -webkit-flex-direction: column;
    -moz-flex-direction: column;
    -ms-flex-direction: column;
    -o-flex-direction: column;
    flex-direction: column;
    background-color: #fff;
}

.addaddress_gs .addadress_ys {
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
    margin-left: 1rem;
    margin-right: 1rem;
    border-bottom: 1px solid #bfbfbf;
    height: 3rem;
    line-height: 3rem;
    font-size: 0.875rem;
}

.shjtdz {
    color: #817e7e;
    padding-left: 1rem;
    padding-right: 1rem;
    margin-top: 1rem;
}

.addaddress_gs .addadress_ys label {
    width: 6rem;
}

.addaddress_gs .addadress_ys input {
    width: 100%;
    height: 3rem;
    line-height: 3rem;
    border: none;
    font-size: 0.875rem;
    outline: none;
    flex: 1;
}

.tjdz_btn {
    margin: 2rem 1rem;
}

.tjdz_btn button {
    width: 100%;
    background-color: #02ae66;
    color: #fff;
    border: none;
    border-radius: 0.5rem;
    font-size: 1.3rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    outline: none;
}

.add-item {
    /*width: 100%;*/
    height: 3rem;
    line-height: 3rem;
    font-size: 0.875rem;
    /*padding: 0 5%;*/
    /*border-bottom: 1px solid #eee;*/
    justify-content: space-between;
    -ms-align-items: center;
    align-items: center;
    color: #000;
}

.add-item label {
    width: 3rem;
    font-size: 0.875rem;
    color: #000;
}

.add-item select {
    height: 2rem;
    border-radius: .2rem;
    border: 1px solid #ddd;
    outline: none;
    color: #000;
    -webkit-flex: 1;
    -moz-flex: 1;
    -ms-flex: 1;
    -o-flex: 1;
    flex: 1;
}

.validate {
    margin-top: 0;
    height: 2rem;
    line-height: 2rem;
    color: #ff0000;
    font-weight: normal;
}
</style>
