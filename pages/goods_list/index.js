// pages/goods_list/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 筛选框当前下标
        current: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    // 切换筛选条件的方法
    changeCrurent(e){
        this.setData({
            current: +e.target.dataset.index
        })
        console.log(e)
    }

})