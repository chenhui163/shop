// pages/category/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 商品分类数据
        categories: [],

        // 当前活动下标
        current: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
    * 改变当前current值
    */
    changeCurrent(e){
        this.setData({
            current: e.target.dataset.index
        })
    }

})