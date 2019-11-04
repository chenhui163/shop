import request from "../../utils/request.js";

Page({

    data:{
        // 轮播图数据
        slider:[],

        // 导航栏数据
        nav:[],

        // 楼层数据
        floors:[],

        // 是否显示到底部提示
        isToFooter: false
    },

    onLoad(){

        // 请求轮播图数据
        request({
            url:"https://api.zbztb.cn/api/public/v1/home/swiperdata"
        }).then(res=>{
            const {message} = res.data;
            this.setData({
                slider: message
            })
        })

        // 请求导航栏数据
        request({
            url: "https://api.zbztb.cn/api/public/v1/home/catitems"
        }).then(res=>{
            const { message } = res.data;
            this.setData({
                nav: message
            })
        })

        // 请求楼层数据
        request({
            url: "https://api.zbztb.cn/api/public/v1/home/floordata"
        }).then(res => {
            const { message } = res.data;
            // 楼层数据请求完之后才显示到底部
            this.setData({
                floors: message,
                isToFooter: true
            })
        })

    }
})
