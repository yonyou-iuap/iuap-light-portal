import request from "utils/request";
//TODO 去掉axios

//定义接口地址
const URL = {
    "GET_LOCALE": `${GROBAL_HTTP_CTX}/i18n/classification/serial`,
    "GET_LANGLIST": `${GROBAL_HTTP_CTX}/i18n/classification/list`,
    "GET_MENU":  `${GROBAL_HTTP_CTX}/appmenumgr/newSidebarList?r=`+Math.random(),
    "GET_MENU_PORTAL":  `${GROBAL_HTTP_CTX}/appmenumgr/listSidebarByApportalCode?r=`+Math.random(),
    "GET_USER_MENU":  `${GROBAL_HTTP_CTX}/moreMenu/list?r=`+Math.random(),
    "GET_UNREADMSG":`/iuap-saas-message-center/message/getUnReadMsg?r=`+Math.random(),
    "GET_WEBPUSHINFO":`${GROBAL_HTTP_CTX}/webpush/getInfo?r=`+Math.random(),
    "wbMenuCollection":`${GROBAL_HTTP_CTX}/wbMenuCollection/create?r=`+Math.random(),
    "wbMenuUncollection":`${GROBAL_HTTP_CTX}/wbMenuCollection/delete?r=`+Math.random(),
    "GET_ALLTENANT":`${GROBAL_HTTP_CTX}/platform/cas/getAllTenant?r=`+Math.random(),
    "GET_SWITCHTENANT":`${GROBAL_HTTP_CTX}/platform/cas/switchTenant?r=`+Math.random(),
    "GET_GETBYID":`${GROBAL_HTTP_CTX}/userMGT/getById`,
};

/**
 * 获取菜单信息
 * @param {*} params
 */
export const getList = (params) => {
    let portalId = `${GROBAL_PORTAL_ID}`;
    let url;
    if(portalId === 'wbalone'){
        url =URL.GET_MENU+'&1=1';
    }else{
        url =URL.GET_MENU_PORTAL+'&apportalCode=' + portalId;
    }
    return request(url, {
        method: "get"
    });
};

/**
 * 获取用户菜单数据
 * @param {*} params
 */
export const loadUserMenuList = (params) => {
    return request(URL.GET_USER_MENU, {
        method: "get"
    });
}

/**
 * 获取租户数据
 * @param {*} params
 */
export const getAllTenant = (params) => {
    return request(URL.GET_ALLTENANT, {
        method: "get"
    });
}
/**
 * 设置租户数据
 * @param {*} params
 */
export const setTenant = (params) => {
    return request(URL.GET_SWITCHTENANT, {
        method: "get",
        param:params
    });
}
/**
 * 获取未读消息数
 * @param {*} params
 */
export const loadUnReadMsg = (params) => {
    return request(URL.GET_UNREADMSG, {
        method: "get"
    });
}
/**
 * 获取消息推送配置
 * @param {*} params
 */
export const getWebPushInfo = (params) => {
    return request(URL.GET_WEBPUSHINFO, {
        method: "get"
    });
}
/**
 * 菜单收藏功能
 * @param {*} params
 */
export const wbMenuCollection = (params) => {
    return request(URL.wbMenuCollection, {
        method: "post",
        data:params
    });
}
/**
 * 取消收藏功能
 * @param {*} params
 */
export const wbMenuUncollection = (params) => {
    return request(URL.wbMenuUncollection, {
        method: "get",
        param:params
    });
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


/**
 * 获取人员信息
 * @param {*} params
 */
export const getUserById = (id) => {
    let url = URL.GET_GETBYID + '/' + id + '?r='+Math.random();
    return request(url, {
        method: "get"
    });
};