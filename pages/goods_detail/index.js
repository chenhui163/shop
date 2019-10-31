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
        })
    }

})