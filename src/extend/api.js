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
    // 订单
    orderList : url + '/cms/Order/List',
    // 获取列表页全部列表
    order: url + '/mobile/Order/OrderListItem/Uid/',
    // 获取个人信息
    me: url + '/mobile/User/GetUserInfo/ItemId/',
    // 删除订单
    deletelist: url + '/mobile/Order/SoftRemoveItem/ItemId/',
    // 订单详细列表页
    orderdetails: url + '/mobile/Order/OrderItem/ItemId/',
    // 药店接口
    Pharmacy: url + '/cms/Position/OrderGet/Pid/',
    // 快递员
    poster: url + '/cms/Position/expressGet/OpenId/',
    // 收货地址管理
    Addressmanagement: url + '/mobile/UserAddress/GetAddressList',
    // 删除收货地址
    delAddress: url + '/mobile/UserAddress/SoftRemove',
    // 设置默认收货地址
    defAddress: url + '/mobile/UserAddress/ModifyDefaultAddress',
    // 编辑收货地址详细信息接口
    editAddress: url + '/mobile/UserAddress/GetAddressInfo',
    // 修改收货地址的提交接口
    submitAddress: url + '/mobile/UserAddress/ModifyAddressInfo',
    // 选择省
    proSelect: url + '/mobile/Area/Pic_ListItem',
    // 选择市
    citySelect: url + '/mobile/Area/Cic_ListItem',
    // 选择区
    areaSelect: url + '/mobile/Area/Dic_ListItem',
    // 新增收货地址
    addAddress: url + '/mobile/UserAddress/PostAddress',
    // 取消订单
    cancellationOrder: url + '/mobile/Order/CancelRemoveItem'
};
export default API;
