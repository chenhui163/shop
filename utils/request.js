// 使用函数表达式的方式声明request函数
const request = (config)=>{

    // 判断config是否是对象类型
    if(!config || typeof config !== "object" || Array.isArray(config)){
        console.error("请求参数应为对象");
        return;
    }

    // 判断url是否非空
    if(!config.url){
        console.error("url不能为空");
        return;
    }

    // 使用正则表达式判断是否需要添加基准路径
    if (!(/^http/.test(config.url))){
        config.url = request.defaults.baseURL + config.url;
    }

    // 返回Promise对象
    return new Promise((resolve, reject)=>{
        // 发送request请求
        wx.request({
            ...config,
            success(res){
                // 请求成功执行resolve
                resolve(res);
            },
            fail(res){
                // 请求失败执行reject
                reject(res);
            },
            complete(res){
                // 每次请求结束都执行
                // 需要判断request.onError方法是否被调用，被调用时才执行
                if(typeof request.errors === "function"){
                    // 执行外部传进来的回调函数
                    request.errors(res);
                }
            }
        })
    })
}

// 默认基准路径
request.defaults = {
    baseURL: ""
}

// 错误信息的集合
request.errors = null;

// 使用函数表达式方式定义错误信息拦截函数
request.onError = (callback)=>{
    request.errors = callback;
}

// 向外暴露request方法
export default request;