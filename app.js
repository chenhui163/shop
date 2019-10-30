//app.js
import request from "./utils/request.js";

App({

    // 小程序加载时执行，整个生命周期只会执行一次
    onLaunch(){
        //初始化基准路径
        request.defaults.baseURL = "https://api.zbztb.cn";

        // 对错误请求进行监听拦截
        request.onError(res=>{
            // 判断404错误
            if (res.data.meta.status === 404) {
                wx.showToast({
                    title: '接口未找到',
                    icon: 'error'
                })
            }
        })
    }

})