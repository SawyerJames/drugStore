<template>
    <div class="editadress">
        <!-- 验证提示 -->
        <h1 class="validate" v-if="validate">{{validate}}</h1>
        <div class="addaddress_gs">
            <div class="addadress_ys">
                <label>收货人</label>
                <input type="text" placeholder="真实姓名" v-model="realname" />
            </div>
            <div class="addadress_ys">
                <label>联系电话</label>
                <input type="tel" placeholder="手机号码" v-model="telephone" />
            </div>
            <div class="addadress_ys add-item flexRow borderBox">
                <label>省</label>
                <select name="province" class="info" v-model="province" @change='changePro(province)' disabled="disabled">
                    <option v-for="(item,index) in addProList" v-bind:value="item.Id">{{item.Name}}</option>
                </select>
            </div>
            <div class="addadress_ys add-item flexRow borderBox">
                <label>市</label>
                <select name="city" class="info" v-model="city" @change='changeCity(city)'>
                    <option v-for="(item,index) in addCityList" v-bind:value="item.Id">{{item.Name}}</option>
                </select>
            </div>
            <div class="addadress_ys add-item flexRow borderBox">
                <label>区</label>
                <select name="area" class="info" v-model="area" @change='changeArea()'>
                    <option v-for="(item,index) in addAreaList" v-bind:value="item.Id">{{item.Name}}</option>
                </select>
            </div>
        </div>
        <!-- <p class="shjtdz">收货具体地址</p> -->
        <div class="addaddress_gs">
            <div class="addadress_ys">
                <label>地址详情</label>
                <input type="text" placeholder="填写具体的收货地址" v-model="detail" />
            </div>
        </div>
        <div class="tjdz_btn">
            <button type="button" @click="postAdd">保存</button>
        </div>
    </div>
</template>
<script type="text/javascript">
export default {
    name: 'editadress',
    data() {
        return {

            item: [],
            Id: '',
            // loading: true,
            resData: '',
            // 地址三级联动信息
            addProList: {},
            addCityList: {},
            addAreaList: {},
            // 信息
            realname: '',
            telephone: '',
            city: '',
            detail: '',
            province: '',
            area: '',
            // 准备抛出的信息
            address: {
                Id: '',
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
        document.title = "地址修改";
        this.Id = this.$route.params.Id;
        // this.loading = true;
        // 认证制空
        this.addressSuccess.realnameSu = false;
        this.addressSuccess.telephoneSu = false;
        this.addressSuccess.citySu = false;
        this.addressSuccess.detailSu = false;
        this.addressSuccess.proSu = false;
        this.addressSuccess.countySu = false;
        // 访问二次加载接口
        this.activateGetAddress();
        //调用省接口
        this.getProList();
    },
    methods: {

        // 二次加载地址信息
        activateGetAddress() {
            var that = this;
            // 加载数据
            this.$tools.GetDataFromServer(
                this,
                this.$api.editAddress + '/Id/' + this.Id,
                function success(res) {
                    var resData = res.data.UseraddressInfo;
                    that.telephone = resData.Tel;
                    that.realname = resData.Name;
                    that.province = resData.Pid;
                    that.city = resData.Cid;
                    that.area = resData.Did;
                    that.detail = resData.Detailed;
                    //加载省市信息
                    that.changePro(resData.Pid);
                    that.changeCity(resData.Cid);
                },
                function error(err) {
                    return;
                }
            )
        },
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
            if (this.realname == '') {
                this.validate = '请填写真实姓名'
                return false;
            } else {
                this.address.Name = this.realname;
                this.addressSuccess.realnameSu = true;
            }
        },
        checkTele() {
            if (this.telephone == '') {
                this.validate = '请填写手机号码'
                return false;
            } else {
                this.address.Tel = this.telephone;
                this.addressSuccess.telephoneSu = true;
            }
        },
        checkPro() {
            if (this.province == '') {
                this.validate = '请选择正确省份'
                return false;
            } else {
                this.address.Pid = this.province;
                this.addressSuccess.proSu = true;
            }
        },
        checkCity() {
            if (this.city == '') {
                this.validate = '请选择正确市区'
                return false;
            } else {
                this.address.Cid = this.city;
                this.addressSuccess.citySu = true;
            }
        },
        checkCounty() {
            if (this.area == '') {
                this.validate = '请选择正确县区'
                return false;
            } else {
                this.address.Did = this.area;
                this.addressSuccess.countySu = true;
            }
        },
        checkDetails() {
            if (this.detail == '') {
                this.validate = '请填写详细地址'
                return false;
            } else {
                this.address.Detailed = this.detail;
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
                                    var that = this;
                                    this.address.Id = this.Id;
                                    // // 传输数据
                                    this.$tools.PostDataToServer(
                                        this,
                                        this.$api.submitAddress, //修改地址接口
                                        this.address,
                                        function success(res) {
                                            // 如果成功，跳转至地址列表页面
                                            var resData = res.data;
                                            if (resData.State.Code == 1) {
                                                that.$router.replace('/newaddress');
                                            }
                                        },
                                        // 如果失败，清空表单
                                        function error(err) {
                                            return;
                                        })
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
    color: #000;
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
    height: 3rem;
    line-height: 3rem;
    border: none;
    font-size: 0.875rem;
    outline: none;
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
    /*padding: 0 5%;*/
    /*border-bottom: 1px solid #eee;*/
    font-size: .875rem;
    justify-content: space-between;
    -ms-align-items: center;
    align-items: center;
    color: #000;
}

.add-item label {
    width: 3rem;
    font-size: 0.875rem;
}

.add-item select {
    height: 2rem;
    border-radius: .2rem;
    border: 1px solid #ddd;
    outline: none;
    color: #000;
    font-size: 0.875rem;
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
