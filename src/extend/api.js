// API基路径
//此API为示例，请改为项目接口路径
const url = 'http://yb.043u.cn';

// API子路径
const API = {
    // 登录接口子路径：
    getUid: url + '/mobile/User/GetUidInfo/OpenId/',
    // 首页
    index: url + '/mobile/Pharmacy/GetRecommendList/Pid/',
    // 药店搜索
    indexSearch: url + '/mobile/Pharmacy/GetRecommendList/P_name/',
    // 药店数据
    storeMsg: url + '/mobile/Pharmacy/GetCateList/Id/',
    // 药品数据
    medDetail: url + '/mobile/Pharmacy/PharDrugList',
    // 药品详细数据
    medMsg: url + '/mobile/Pharmacy/PharDrugInfo/',
    // 购物车计算
    shopComputed: url + '/mobile/Cart/AddCartData',
    // 购物车弹窗加减数量
    smallShopCar: url + '/mobile/Cart/UpdateData',
    // 购物车
    shopCar: url + '/mobile/Cart/GetCartAllData/Uid/13213125151',
    // 购物车弹窗
    shopCarWin: url + '/mobile/Cart/Single_GetCartAllData',
    // 清空购物车
    shopCarDel: url + '/mobile/Cart/FlushData/',
    // 药品模糊搜索
    search: url + '/mobile/Pharmacy/PharDrugList/',
    // 获取默认地址
    getAddress: url + '/mobile/UserAddress/Default_GetAddressList/Uid/',
    // 提交订单
    postOrder: url + '/mobile/Order/OrderAdd',
    // 取药地址
    getMedAddress: url + '/mobile/Pharmacy/PickUpDrugInfo/Pid/',
    // 微信支付
    wxPay: url + '/mobile/Pharmacy/PickUpDrugInfo/Pid/',
};
export default API;
