// pages/cart/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 收货人信息
        consignee: {},
        // 是否显示添加地址，默认是true显示新增
        isShowAddAddress: true,

        // 购物车列表
        cart: [],
        // 是否显示购物车为空，默认是true，显示为空
        isCartEmpty: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 从本地获取地址信息
        let consignee = wx.getStorageSync('consignee') || {};
        // 判断本地的收货人信息对象consignee是否为空
        let result = (JSON.stringify(consignee) === "{}");
        // 如果不为空
        if(!result){
            // 将信息保存到data中
            this.setData({
                consignee,
                isShowAddAddress: false
            })
        }

        // 从本地获取购物车列表
        let arr = wx.getStorageSync('cart') || [];
        // 判断购物车列表是否为空
        let result2 = (JSON.stringify(arr) === "[]");
        // 如果不为空
        if (!result2) {
            // 对价格保留两位小数
            let cart = arr.map(v=>{
                v.goods_price = Number(v.goods_price).toFixed(2);
                return v;
            })
            // 将购物车列表保存到data中
            this.setData({
                cart,
                isCartEmpty: false
            })
        }

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    // 获取收货人地址
    chooseAddress(){
        // 调用小程序原生API接口请求授权获取收货地址
        wx.chooseAddress({
            success:(res) => {
                // 将地址拼接完整
                res.completeAddress = res.provinceName + res.cityName + res.countyName + res.detailInfo;
                // 将信息保存到data中
                this.setData({
                    consignee: res,
                    isShowAddAddress: false
                })
                // 从本地获取地址信息
                let consignee = wx.getStorageSync('consignee') || {};
                // 将信息保存到本地
                wx.setStorageSync('consignee', this.data.consignee);
            }
        })
    }

})