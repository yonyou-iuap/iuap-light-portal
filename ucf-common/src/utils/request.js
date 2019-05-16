import axios from "axios";

export default (url, options) => {
    let headers = {
        'X-Requested-With': 'XMLHttpRequest'
    }
    let portalId = GROBAL_PORTAL_ID;
    if(options.headers)
        headers = options.headers
    return axios({
        method: options.method,
        url: url,
        data: options.data,
        params: options.param,
        headers: headers
    }).catch(function (err) {
        console.log(err);
        if(err.response&&err.response.status==401){
            console.log("RBAC鉴权失败!"+err.response.data.msg);
            return Promise.resolve(err.response);
        }else if(err.response&&err.response.status==306){
            let h = GROBAL_PORTAL_CTX === '/wbalone'?`${GROBAL_PORTAL_CTX}/user/beflogout`:`${GROBAL_PORTAL_CTX}`;
            window.location.href = h ;

        }
    });
}
