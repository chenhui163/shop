// pages/search/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 是否显示按钮，默认false不显示
        isShowBtn: false,

        // 输入框的值
        value: "",

        // 历史记录数组
        history: []

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
        // 获取本地的历史记录，如果有则获取，没有则默认空数组
        const history = wx.getStorageSync('search') || [];
        // 赋值给data中的history
        this.setData({
            history
        })
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
    },

    // 点击完成按钮（或敲回车键）时触发
    bindConfirm(e){
        // 获取输入框的值
        const value = e.detail.value.trim();
        // 如果为空，不执行以下代码
        if(!value) return;
        
        // 获取本地的历史记录，如果有则获取，没有则默认空数组
        const history = wx.getStorageSync('search') || [];

        // 去重方法1：遍历数组，判断关键字是否重复，若重复就去重
        // const arr = history.filter(v=>{
        //     return v !== value;
        // })
        // arr.unshift(value);

        // 去重方法2，使用new Set()方法去重
        const arr = [value, ...new Set(history)];

        // 将历史记录数组存到本地
        wx.setStorageSync('search', arr);

        // 跳到商品列表页
        wx.navigateTo({
            url: "/pages/goods_list/index?query=" + value
        })
    }

})