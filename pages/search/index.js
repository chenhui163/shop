// pages/search/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 是否显示按钮，默认false不显示
        isShowBtn: false,

        // 输入框的值
        value: ""

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    // input输入时触发
    bindInput(e){
        // 获取输入框的值
        const value = e.detail.value.trim();

        // 设置开关决定是否修改isShowBtn
        let flag;
        // input输入框有值，则显示按钮，否则不显示
        flag = value ? true : false;

        // 修改data中的isShowBtn和value
        this.setData({
            value,
            isShowBtn: flag
        })
    }

})