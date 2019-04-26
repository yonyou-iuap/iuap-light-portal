
import ReactDOM from 'react-dom';
import { Message } from 'tinper-bee';


export const success = (msg) => {
    Message.create({ content: msg, color : 'success'  });
}

export const Error = (msg) => {
    Message.create({ content: msg, color : 'danger'  });
}

export const Warning = (msg) => {
    Message.create({ content: msg, color : 'warning' });
}
/**
 * 数据返回统一处理函数
 * @param {*} response
 * @param {*} successMsg 成功提示
 */
export const processData = (response,successMsg) => {
    let url = response && response.config && response.config.url;
    let errorMsg = '';
    if(typeof response != 'object') {
        Error('数据返回出错：1、请确保服务运行正常；2、请确保您的前端工程代理服务正常；3、请确认您已在本地登录过应用平台');
        return;
    }
    if(response.status=='401'){
        errorMsg = response.data.msg ||  url + ' 请求错误';
        console.log(errorMsg)
        // Error(`错误:${(response.data.msg)}`);
        Error(`错误:${(errorMsg)}`);
        return;
    }
    if(response.status=='200'){

        let data=response.data;
        let repMsg = data.status;
        if(repMsg=='1'){
            if(successMsg){
                success(successMsg);
            }
            return data;
        }else if(repMsg=='fail_field'){
            errorMsg = (data && convert(data.msg)) || url + ' 数据返回出错';
            // Error(`错误:${(data && convert(data.msg)) || '数据返回出错'}`);
            console.log(errorMsg)
            Error(`错误:${(errorMsg)}`);
            return
        }else {
            errorMsg = convert(data.msg ||data.message) || url + ' 请求错误';
            // Error(`错误:${convert(data.msg ||data.message)}`);
            console.log(errorMsg)
            Error(`错误:${(errorMsg)}`);
            return;
        }
    }else{
        errorMsg = url + '请求错误';
        // Error('请求错误');
        console.log(errorMsg)
        Error(`错误:${(errorMsg)}`);
        return;
    }
}

/**
 * param拼接到url地址上
 * @param {*} url
 * @param {*} params
 * @param {*} prefix
 */
export const paramToUrl = (url,params,prefix) =>{
    if(!prefix)prefix='';
    if(url.indexOf('?')==-1){
        url += '?r='+Math.random();
    }
    for(let attr in params){
        if((attr=='pageIndex')||(attr=='pageSize')){
            url+='&'+attr+'='+params[attr];
        }else{
            url+='&'+prefix+attr+'='+params[attr];
        }
    }
    return url;
}

// 后台乱码转换
export const convert = (text) => {
    let element = document.createElement("p");
    element.innerHTML = text;
    let output = element.innerText || element.textContent;
    console.log("output",output);
    element = null;
    return output;
}

export const setCookie = (name, value, options) => {

    options = options || {};
    if (value === null) {
        value = '';
        options.expires = -1;
    }
    var expires = '';
    if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
        var date;
        if (typeof options.expires == 'number') {
            date = new Date();
            date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
        } else {
            date = options.expires;
        }
        expires = '; expires=' + date.toUTCString();
    }
    var path = options.path ? '; path=' + options.path : '';
    var domain = options.domain ? '; domain=' + options.domain : '';
    var s = [ cookie, expires, path, domain, secure ].join('');
    var secure = options.secure ? '; secure' : '';
    var c = [ name, '=', encodeURIComponent(value) ].join('');
    var cookie = [ c, expires, path, domain, secure ].join('')
    document.cookie = cookie;

}

export const getCookie = (name) => {

    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }

    // 按照总设部规范，调整为下划线
    // if(cookieValue != null && typeof cookieValue != 'undefined'){
    //     cookieValue = cookieValue.replace(/-/,"_");
    // }
    return cookieValue;
}
export const flattenJsonId = (data,arr) => {
  data.map(e => {
       if (e.hasOwnProperty('children') && Array.isArray(e.children) && e.children.length > 0) {
         flattenJsonId(e.children,arr);
       }else {
         arr.push(e);
       }
   });
}

export function getConfig(){
    return window.iuapConfig || window.parent.iuapConfig || window.top.iuapConfig || {};
}

export function getContextId(){
    let config = window.iuapConfig || window.parent.iuapConfig || window.top.iuapConfig || {}
    // return config.context || 'mdm';
    // return 'mdm'
    return config.context || 'wbalone';
}