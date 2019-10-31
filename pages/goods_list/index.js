// pages/goods_list/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 筛选框当前下标
        current: 0,

        // 页面参数
        query: "",

        // 商品列表数据
        goods: []
    },

    /**
     * 生命周期函数--监听页面加载
     * options：页面传递过来的参数
     */
    onLoad: function (options) {

        // 获取页面参数
        const {query} = options;
        this.setData({
            query
        })




    },

    // 切换筛选条件的方法
    changeCrurent(e){
        this.setData({
            current: +e.target.dataset.index
        })
        console.log(e)
    }

})