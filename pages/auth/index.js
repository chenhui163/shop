// pages/auth/index.js
import request from "../../utils/request.js";

Page({

    // 获取用户信息
    onGotUserInfo(e){
        // 准备请求token需要的参数
        const { encryptedData, rawData, iv, signature } = e.detail;

        // 调用接口获取登录凭证（code）
        wx.login({
            success(res) {
                // 准备请求token需要的参数
                const code = res.code;

                // 请求token
                request({
                    url: "/api/public/v1/users/wxlogin",
                    method: "POST",
                    data: {
                        encryptedData,
                        rawData,
                        iv,
                        signature,
                        code
                    }
                }).then(res=>{
                    // 获取token
                    const { token } = res.data.message;
                    // 保存到本地
                    wx.setStorageSync("token", token);
                })
            }
        })
    }

})