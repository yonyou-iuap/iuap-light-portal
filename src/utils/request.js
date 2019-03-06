import axios from "axios";

export default (url, options) => {
    return axios({
        method: options.method,
        url: url,
        data: options.data,
        params: options.param,
        headers:{'X-Requested-With': 'XMLHttpRequest'}
    }).catch(function (err) {
        console.log(err);
        if(err.response&&err.response.status==401){
            console.log("RBAC鉴权失败!"+err.response.data.msg);
            return Promise.resolve(err.response);
        }else if(err.response&&err.response.status==306){
            window.location.href = '/wbalone/pages/login/login.html?r=L3BvcnRhbC8';

        }
    });
}
