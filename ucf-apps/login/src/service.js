/**
 * 服务请求类
 */
import request from "utils/request";
import {
    actions
} from 'mirrorx';
//定义接口地址
const URL = {
    "GET_LOCALE": `${GROBAL_HTTP_CTX}/i18n/classification/serial`,
    "GET_LANGLIST": `${GROBAL_HTTP_CTX}/i18n/classification/list`,
    "GET_VERTIFY": `${GROBAL_HTTP_CTX}/open/imgVerificationStatus`,
    "POST_LOGIN": `${GROBAL_HTTP_CTX}/account/login`,
    "GET_ENCRYPT": `${GROBAL_HTTP_CTX}/open/getEncryptParam`,
    "GET_CHECKCODE": `${GROBAL_HTTP_CTX}/open/imgVerificationCode/checkCode`,
    "GET_SENDMSG": `${GROBAL_HTTP_CTX}/open/verify/sendSMS/`,
    "GET_CHECKPHONE": `${GROBAL_HTTP_CTX}/open/verify/checkSMS/`,
    "POST_SAVENEWPSW": `${GROBAL_HTTP_CTX}/open/modifyPassword`,
    "POST_MODIFY": `${GROBAL_HTTP_CTX}/open/modifyPassword`
}
export const setLocaleParam = (newLocaleValue) => {
    let url = URL.GET_LOCALE + '?locale=' + newLocaleValue + '&r=' + Math.random();
    return request(url, {
        method: "get"
    });
}

export const getLanguageList = () => {
    let url = URL.GET_LANGLIST;
    return request(url, {
        method: "get"
    });
}

export const getVertifyImg = (username) => {
    let url = URL.GET_VERTIFY + '?login_name=' + username + '&r=' + Math.random();;
    return request(url, {
        method: "get"
    });
}

export const loginAjax = (loginData) => {
    let url = URL.POST_LOGIN;
    let par = GROBAL_PORTAL_CTX !== '/wbalone'? '?service=' + GROBAL_PORTAL_CTX: '';
    url = url + par;
    return request(url, {
        method: "post",
        data: JSON.stringify(loginData),
        headers:{'Content-Type':'application/json'}
    });
}

export const setEncryptParam = (langCode) => {
    let url = URL.GET_ENCRYPT + '?locale=' + langCode;
    return request(url, {
        method: "get"
    });
}

export const CheckCode = (params) => {
    let url = URL.GET_CHECKCODE + '?verificationCode=' + params.psdVerfiy + '&identification=' + params.psdUser;
    return request(url, {
        method: "get"
    });
}

export const sendMsg = (params) => {
    let url = URL.GET_SENDMSG +  params.userId + '?msgtype=' + params.msgtype;
    return request(url, {
        method: "get"
    });
}

export const CheckPhone = (params) => {
    let url = URL.GET_CHECKPHONE +  params.userId + '/' + params.valiCode + '?msgtype=' + params.msgtype;
    return request(url, {
        method: "get"
    });
}

export const saveNewPsd = (savedata) => {
    let url = URL.POST_SAVENEWPSW;
    return request(url, {
        method: "post",
        data: savedata,
        headers:{'Content-Type':'application/json'}
    });
}

export const modifyPassword = (modifyData) => {
    let url = URL.POST_MODIFY;
    return request(url, {
        method: "post",
        data: JSON.stringify(modifyData),
        headers:{'Content-Type':'application/json'}
    });
}