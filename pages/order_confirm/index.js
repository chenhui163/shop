// pages/order_confirm/index.js
import request from "../../utils/request.js";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 收货人信息
        consignee: "",

        // 已选择的商品
        select: [],
        // 实付款
        totalPrice: 0

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

        // 获取本地的收货人信息
        const consignee = wx.getStorageSync("consignee");

        // 从本地获取购物车数据
        const goods = wx.getStorageSync("cart");

        // 计算商品总价格
        let totalPrice = 0;

        // 选择状态为true的商品数据
        let select = goods.filter(v=>{
            if (v.isChoose === true){
                totalPrice = (v.goods_price * v.goods_number) + totalPrice;
            }
            return v.isChoose === true;
        })
        
        // 将已选择的商品添加到data中
        this.setData({
            consignee,
            select,
            totalPrice: Number(totalPrice).toFixed(2)
        })
    },

    // 提交订单
    submitOrder(){
        // 获取本地的token
        const token = wx.getStorageSync("token");

        // 准备请求需要的参数
        const order_price = this.data.totalPrice;   // 订单总价格
        const consignee_addr = this.data.consignee.completeAddress; // 收货地址
        let goods = this.data.select.map(v=>{   // 订单数组
            // 删除其他不需要传的属性
            delete v.goods_logo;
            delete v.goods_name;
            delete v.isChoose;
            return v;
        });

        // 创建订单
        request({
            url: "/api/public/v1/my/orders/create",
            method: "POST",
            header: {
                Authorization: token
            },
            data: {
                order_price,
                consignee_addr,
                goods
            }
        }).then(res=>{
            // 获取订单号
            const { order_number } = res.data.message;

            // 获取支付参数
            request({
                url: "/api/public/v1/my/orders/req_unifiedorder",
                method: "POST",
                header: {
                    Authorization: token
                },
                data: {
                    order_number
                }
            }).then(res=>{
                // 准备支付参数
                const { pay } = res.data.message;

                /**
                 *  "timeStamp": "时间戳，从1970年1月1日00:00:00至今的秒数，即当前的时间",
                    "nonceStr": "随机字符串，长度为32个字符以下",
                    "package": "统一下单接口返回的 prepay_id 参数值",
                    "signType": "签名算法",
                    "paySign": "签名"
                 */
                // 调用微信支付接口
                wx.requestPayment({
                    ...pay,
                    success:(res) => {
                        // 从本地获取购物车数据
                        const goods = wx.getStorageSync("cart");
                        // 选择状态为false的商品数据
                        let select = goods.filter(v => {
                            return v.isChoose === false;
                        })
                        // 把选择状态改为true
                        select = select.map(v => {
                            v.isChoose = true;
                            return v;
                        })
                        // 把购物车列表存回本地
                        wx.setStorageSync("cart", select);
                    }
                })
            })
        })
    }
})