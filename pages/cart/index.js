// pages/cart/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 收货人信息
        consignee: {},
        // 是否显示添加地址，默认是true显示新增
        isShowAddAddress: true,

        // 购物车列表
        cart: [],
        // 是否显示购物车为空，默认是true，显示为空
        isCartEmpty: null,

        // 商品总价格
        totalPrice: 0,
        // 商品总个数
        totalCount: 0,

        // 是否全选，默认是true
        isChooseAll: true
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
        // 从本地获取地址信息
        let consignee = wx.getStorageSync('consignee') || {};
        // 判断本地的收货人信息对象consignee是否为空
        let result = (JSON.stringify(consignee) === "{}");
        // 如果不为空
        if (!result) {
            // 将信息保存到data中
            this.setData({
                consignee,
                isShowAddAddress: false
            })
        }

        // 从本地获取购物车列表
        let arr = wx.getStorageSync('cart') || [];
        // 判断购物车列表是否为空
        let result2 = (JSON.stringify(arr) === "[]");
        // 如果不为空
        if (!result2) {
            // 对价格保留两位小数
            let cart = arr.map(v => {
                v.goods_price = Number(v.goods_price).toFixed(2);
                return v;
            })
            // 将购物车列表保存到data中
            this.setData({
                cart,
                isCartEmpty: false
            })
        }else{
            // 设置购物车是空的
            this.setData({
                isCartEmpty: true
            })
        }

        // 遍历购物车列表
        let newChoose = this.data.cart.filter(v => {
            // 返回选中状态为true的商品
            return v.isChoose === true;
        })
        // 声明变量存放判断结果
        let isChooseAll;
        // 判断选中的商品数组的是否和商品列表长度一致
        newChoose.length === this.data.cart.length ? isChooseAll = true : isChooseAll = false;

        // 将判断结果赋给data中的isChooseAll
        this.setData({
            isChooseAll,
        })

        // 调用方法计算商品总价格，总个数
        this.computedTotalPrice();
    },

    // 获取收货人地址
    chooseAddress(){
        // 调用小程序原生API接口请求授权获取收货地址
        wx.chooseAddress({
            success:(res) => {
                // 将地址拼接完整
                res.completeAddress = res.provinceName + res.cityName + res.countyName + res.detailInfo;
                // 将信息保存到data中
                this.setData({
                    consignee: res,
                    isShowAddAddress: false
                })
                // 从本地获取地址信息
                let consignee = wx.getStorageSync('consignee') || {};
                // 将信息保存到本地
                wx.setStorageSync('consignee', this.data.consignee);
            }
        })
    },

    // 减少商品数量
    reduceNumber(e){
        // 获取当前点击的商品id
        const { goods_id } = e.target.dataset;

        // 遍历购物车列表
        let newCart =  this.data.cart.map((v,i)=>{
            // 找到该商品对象
            if (v.goods_id === goods_id){
                
                // 如果该商品的数量是1，询问是否要删除
                if(v.goods_number===1){
                    wx.showModal({
                        title: '提示',
                        content: '询问是否要删除该商品？',
                        success:(res)=> {
                            if (res.confirm) {
                                // 删除商品
                                newCart.splice(i, 1);
                                // 重新赋值购物车列表、计算商品总价格和总个数
                                this.cartStorageTotal(newCart);
                            } else if (res.cancel) {
                                v.goods_number = 1;
                                console.log(v.goods_number)
                            }
                        }
                    })
                }
                if (v.goods_number>1){
                    // 商品数量-1
                    v.goods_number--;
                }
            }
            return v;
        })
        
        // 重新赋值购物车列表、计算商品总价格和总个数
        this.cartStorageTotal(newCart);
    },

    // 增加商品数量
    addNumber(e){
        // 获取当前点击的商品id
        const { goods_id } = e.target.dataset;
        
        // 遍历购物车列表
        let newCart = this.data.cart.map((v, i) => {
            // 找到该商品对象
            if (v.goods_id === goods_id) {
                // 商品数量-1
                v.goods_number++;
            }
            return v;
        })
        
        // 重新赋值购物车列表、计算商品总价格和总个数
        this.cartStorageTotal(newCart);
    },

    // 监听输入框的变化
    changeInput(e){
        // 获取商品id，input输入框的值
        const {goods_id} = e.target.dataset;
        const value = +e.detail.value;

        // 判断是否只包含数字
        // 如果是数字，向下取整并返回；如果不是，返回NaN
        let res = Math.floor(value.toString());
        
        // 如果res是0或者NaN，那么res的值变为1，否则是本身
        // （该行代码会产生输入0失败问题，因此弃用）
        let goods_number = res ? res : 0 ;

        // 遍历购物车列表
        let newCart = this.data.cart.map(v => {
            // 找到该商品对象
            if (v.goods_id === goods_id) {
                // 修改商品的数量
                v.goods_number = res;
            }
            return v;
        })
        // 把商品列表赋值给data中的cart
        this.setData({
            cart: newCart
        })
    },

    // 输入框失去焦点时触发
    blurInput(e){
        const { goods_id } = e.target.dataset;
        const value = +e.detail.value;
        
        // 判断是否只包含数字
        // 如果是数字，向下取整并返回；如果不是，返回NaN
        let res = Math.floor(value.toString());

        // 如果res是0或者NaN，那么res的值变为1，否则是本身
        let goods_number = res ? res : 1 ;

        // 遍历购物车列表
        let newCart = this.data.cart.map(v => {
            // 找到该商品对象
            if (v.goods_id === goods_id) {
                // 修改商品的数量
                v.goods_number = goods_number;
            }
            return v;
        })

        // 重新赋值购物车列表、计算商品总价格和总个数
        this.cartStorageTotal(newCart);
    },

    // 改变选中状态
    changeChoose(e){
        // 获取当前点击的商品id
        const {goods_id} = e.target.dataset;

        // 遍历购物车列表
        let newCart = this.data.cart.map(v => {
            // 找到该商品对象
            if (v.goods_id === goods_id) {
                // 将选中状态取反
                v.isChoose = !v.isChoose;
            }
            return v;
        })

        // 重新赋值购物车列表、计算商品总价格和总个数
        this.cartStorageTotal(newCart);

        // 遍历购物车列表
        let newChoose = this.data.cart.filter(v => {
            // 返回选中状态为true的商品
            return v.isChoose === true;
        })
        // 声明变量存放判断结果
        let isChooseAll;
        // 判断选中的商品数组的是否和商品列表长度一致
        newChoose.length === this.data.cart.length ? isChooseAll = true : isChooseAll=false;

        // 将判断结果赋给data中的isChooseAll
        this.setData({
            isChooseAll,
        })
    },

    // 改变全选状态
    changeChooseAll(){
        // 改变data中isChooseAll的值
        let status = !this.data.isChooseAll;
        // 把全选状态赋值给data中的isChooseAll

        let newCart = [];
        // 如果isChooseAll为true，购物车列表全部商品是选中状态为true
        if (status === true){
            newCart = this.data.cart.map(v => {
                // 将购物车中所有商品的选中状态为true
                v.isChoose = true;
                return v;
            })
        }
        // 如果isChooseAll为false，购物车列表全部商品是选中状态为false
        if (status === false){
            newCart = this.data.cart.map(v => {
                // 将购物车中所有商品的选中状态为false
                v.isChoose = false;
                return v;
            })
        }

        // 把全选状态赋值给data中的isChooseAll
        this.setData({
            isChooseAll: status,
        })

        // 重新赋值购物车列表、计算商品总价格和总个数
        this.cartStorageTotal(newCart);
    },

    // 计算选中商品的总价格
    computedTotalPrice(){
        // 遍历购物车列表
        let newCart = this.data.cart.filter(v => {
            // 返回选中状态为true的商品
            return v.isChoose === true;
        })

        // 初始选中商品的总价格，总个数为0
        let totalPrice = 0;
        let totalCount = 0;
        // 遍历选中状态的数组
        newCart.forEach(v=>{
            // 计算选中商品的总价格，总个数
            totalPrice += v.goods_price * v.goods_number;
            totalCount += v.goods_number;
        })

        // 将商品总价格，商品总个数的计算结果赋给data中的totalPrice和totalCount
        this.setData({
            totalPrice: Number(totalPrice).toFixed(2),
            totalCount
        })
    },

    /**
     * 封装函数：重新赋值购物车列表、把购物车列表存回本地、计算商品总价格和总个数
     */
    cartStorageTotal(newCart){
        // 把商品列表赋值给data中的cart
        this.setData({
            cart: newCart
        })

        // 把购物车列表重新存回本地
        wx.setStorageSync('cart', this.data.cart);

        // 调用方法计算商品总价格，总个数
        this.computedTotalPrice();
    }

})