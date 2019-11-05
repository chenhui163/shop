// pages/order_confirm/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 已选择的商品
        select: [],
        // 实付款
        totalPrice: 0

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

        // 从本地获取购物车数据
        const goods = wx.getStorageSync("cart");

        // 计算商品总价格
        let totalPrice = 0;

        // 选择状态为true的商品数据
        let select = goods.filter(v=>{
            totalPrice = (v.goods_price * v.goods_number) + totalPrice;
            return v.isChoose === true;
        })
        
        // 将已选择的商品添加到data中
        this.setData({
            select,
            totalPrice: Number(totalPrice).toFixed(2)
        })

    }
})