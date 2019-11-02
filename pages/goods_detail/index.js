// pages/goods_detail/index.js
import request from "../../utils/request.js";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 商品详情数据
        info: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 获取商品id
        const goods_id = +options.goods_id;

        // 请求商品详情数据
        request({
            url: "/api/public/v1/goods/detail",
            data:{
                goods_id
            }
        }).then(res=>{
            const { message} = res.data;
            this.setData({
                info: message
            })
            console.log(this.data.info)
        })
    },

    // 加入购物车
    addCart(){
        
        // 获取当前详情的商品的数据
        let currentGood = {
            goods_id: this.data.info.goods_id,
            goods_number: 1,
            goods_price: this.data.info.goods_price,
            goods_name: this.data.info.goods_name,
            goods_logo: this.data.info.goods_small_logo,
            isChoose: true
        }

        // 从本地获取购物车列表数据
        let cart = wx.getStorageSync('cart') || [];

        // 判断购物车中是否已有此商品，去重
        // 声明开关值，判断列表中商品是否已存在，默认是false
        let isRepetitive = false;

        // 遍历购物车列表
        let arr = cart.map(v=>{
            if (v.goods_id === currentGood.goods_id){
                // 如果商品已存在，列表中商品数量+1
                v.goods_number++;
                // 如果列表中商品已存在，isRepetitive变为true
                isRepetitive = true;
            }
            return v;
        })

        // 当购物车列表中不存在当前详情页的商品时，才将该商品追加进购物车
        if (!isRepetitive){
            // 追加进数组
            arr.push(currentGood);
        }

        // 将购物车数组存到本地
        wx.setStorageSync('cart', arr);
        // 提示添加成功
        wx.showToast({
            title: '已添加到购物车',
            icon: 'success',
            duration: 2000
        })
    }

})