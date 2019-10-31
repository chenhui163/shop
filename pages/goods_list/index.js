// pages/goods_list/index.js
import request from "../../utils/request.js";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 筛选框当前下标
        current: 0,

        // 页面参数
        query: "",
        // 页码
        pagenum: 1,
        // 获取数据条数
        pagesize: 10,

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

        // 请求商品数据
        this.getGoodsList();
    },

    // 获取商品列表数据的方法
    getGoodsList(){
        request({
            url: "/api/public/v1/goods/search",
            data:{
                query: this.data.query,
                pagenum: this.data.pagenum,
                pagesize: this.data.pagesize
            }
        }).then(res=>{
            // 保存商品数据
            const { goods } = res.data.message;

            // 商品价格保留两位小数
            const newGoods = goods.map(v=>{
                v.goods_price = Number(v.goods_price).toFixed(2);
                return v;
            })

            this.setData({
                goods: [...this.data.goods, ...newGoods ]
            })
            console.log(this.data.goods)

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