/**
 * 数据模型类
 */
import { actions } from "mirrorx";
import * as api from "./service";
import { processData, getCookie } from "utils";
import {loginInitI18n} from 'utils/i18n.iuap';

export default {
    // 确定 Store 中的数据模型作用域
    name: "app",
    // 设置当前 Model 所需的初始化 state
    initialState: {
        langCode: getCookie('u_locale') || 'zh_CN', // 当前语种
        langList: [],// 多语列表
        username: '', // 用户名
        password: '', //密码
        errMsg: '', // 错误信息
        codeVerfiy: false,  // 是否显示验证码
        verifyCode: '', //验证码
        verfiyImg: '', // 验证码地址
        checked: false, // 是否勾选记住用户名
        lastLoginIsRemember: false, // 上次是否记住名用户,
        forgetpswErrMsg: '', // 忘记密码错误信息
        forgetstep: 0, // 忘记密码当前步数
        forgetpsw: false, // 是否显示忘记密码,
        step1User: '', // 忘记密码记录账户
        step2MsgType: 'phone', // 忘记密码验证类型
        step2Phone: '', // 忘记密码输入框默认值
        step2UserId: '', // 忘记密码userid,
        step2PsdVerfiy: '', // 忘记密码验证码
        step2Wait: 0, // 验证码间隔时间
        resetpsw: false, // 是否显示重置密码
        reststep: 0, // 重置密码当前步数
        resetpswErrMsg: '', // 重置密码错误信息
        resetpwdDisabled: false, // 重置密码按钮是否可用
        confirmShow: '', // 重置密码确认框
        confirmTitle: '', // 重置密码确认框提示信息
        loginAjaxParams: {}, // 登录时需要重置密码因此保存请求的参数
    },
    reducers: {
        /**
         * 纯函数，相当于 Redux 中的 Reducer，只负责对数据的更新。
         * @param {*} state
         * @param {*} data
         */
        updateState(state, data) {
            return {
                ...state,
                ...data
            };
        }
    },
    effects: {

        /**
         * 获取语种列表
         */
        async getLanguageList() {
            let res = processData(await api.getLanguageList());
            let langList = [];
            let language_source = []
            if (res && res.status == 1) {
                let  arr = res.data;
                for (var i = 0; i < arr.length; i++) {
                    var obj = {
                        code: arr[i].prelocale == null ? "zh_CN" : arr[i].prelocale.replace(/-/,'_'),
                        name: arr[i].pageshow
                    }
                    var languageObj = {
                        value: arr[i].prelocale == null ? "zh_CN" : arr[i].prelocale.replace(/-/,'_'),
                        name: arr[i].pageshow,
                        serial: arr[i].serialid,
                        isDefault:(arr[i].i18nDefault != null && arr[i].i18nDefault == "1") ? true : false
                    }
                    langList.push(obj);
                    language_source.push(languageObj);
                }
            }
            loginInitI18n(language_source)
            actions.app.updateState({
                langList: langList,
            });
        },


        /**
         * 切换语种
         * @param {*} newLocaleValue
         */
        async setLocaleParam(newLocaleValue) {
            if (newLocaleValue && newLocaleValue.length > 0) {
                let res = processData(await api.setLocaleParam(newLocaleValue));
                if(res){
                    window.location.reload(true);
                }
            }
        },

        /**
         * 设置加密参数
         */
        async setEncryptParam(langCode) {
            let res = processData(await api.setEncryptParam(langCode));
            if (res.status === 1) {
                let exponent = res.data.exponent || '';
                let modulus = res.data.modulus || '';
                sessionStorage.setItem("exponent", exponent); //moded by yany 修改为sessionStorage存取
                sessionStorage.setItem("modulus", modulus);
            } else {
                alert(res.msg.replace('<br/>',''))
            }
        },
        
        /**
         * 获取验证码
         */
        async getVertifyImg(username) {
            let res = processData(await api.getVertifyImg(username));
            if (res && res.data) {
                if (res.data == "true") {
                    actions.app.updateState({
                        codeVerfiy: true,
                        verfiyImg: `${GROBAL_HTTP_CTX}/open/imgVerificationLoginCode/getCode?login_name=${username}&r=${Math.random()}`
                    });
                } else {
                    actions.app.updateState({
                        codeVerfiy: false,
                    });
                }
            }
        },


        /**
         * 执行登陆逻辑
         */
        async loginAjax(loginData,getState) {
            let checked = getState().app.checked;
            let username = loginData.username;
            let password = loginData.password;
            let res = await api.loginAjax(loginData);
            res = res.data;
            if (res.status === "0") {
                let message;
                try {
                    message = JSON.parse(res.message);
                } catch (e) {
                    alert('后台返回数据有误')
                    return false;
                }

                if (message.status == "50001" || message.status == "50002" || message.status == "50008" || message.status == "50009" || message.status == "50010" || message.status == "50011" || message.status == "50013" || message.status == "50014" || message.status == "50015" || message.status == "50016") {
                    actions.app.getVertifyImg(username);
                }
                if (message.status == "50012") {
                    //密码即将过期，修改密码，如果为true则跳出修改密码，并且提示信息为message.msg，如果为false则重新提交并且设置pwdExpiredCancle为true
                    actions.app.updateState({
                        confirmShow: true,
                        confirmMsg: message.msg,
                        resetpswTitle: message.msg,
                        loginAjaxParams: loginData
                    })
                    return;
                }
                if (message.status == "50006" || message.status == "50007") {
                    //密码即将过期，修改密码，message.msg为提示信息
                    actions.app.updateState({
                        resetpsw: true,
                        resetpwdDisabled: false,
                        loginAjaxParams: loginData,
                        resetpswTitle: message.msg
                    });
                    return;
                }
                if(message.status == "50009" ||message.status == "50010"||message.status == "50011"){
                    if(message.isforce =='true'){
                        //不符合密码策略 强制修改 message.msg为提示信息
                        actions.app.updateState({
                            resetpsw: true,
                            resetpwdDisabled: false,
                            loginAjaxParams: loginData,
                            errMsg: message.msg
                        });
                    }else{
                        //不符合密码策略  修改密码 弹出提示，为true则跳出修改密码，并且提示信息为message.msg，如果为false则重新提交并且设置pwdExpiredCancle为true
                        actions.app.updateState({
                            confirmShow: true,
                            confirmTitle: message.msg,
                            loginAjaxParams: loginData
                        })
                    }
                    return;
                }

               if (message.status == "50015" || message.status == "50016") {
                    // 验证码区显示提示信息
                    actions.app.updateState({
                        errMsg: message.msg
                    })

                } else if (message.status != "50010") {
                    actions.app.updateState({
                        errMsg: message.msg
                    })
                }
                return false;
            }
            if (res.status == "1") {
                //本地缓存用户最后一次登录成功用户名
                var lastLoginName = localStorage.getItem("lastLoginName");
                if (lastLoginName == undefined || lastLoginName !== username) {
                    localStorage.setItem("lastLoginName", username);
                    localStorage.setItem("lastLoginPassword", password);
                }
                //缓存记住密码勾选状态，选中记住密码则本地缓存密码密文，未选则清除缓存的密码密文
                localStorage.setItem("lastLoginIsRemember", checked);
                if (checked) {
                    localStorage.setItem("lastLoginName", username);
                    localStorage.setItem("lastLoginPassword", password);
                } else {
                    localStorage.removeItem("lastLoginName");
                    localStorage.removeItem("lastLoginPassword");
                }

                //成功登陆
                window.localStorage.setItem("canOpen","true");
                window.open(`${GROBAL_HTTP_CTX}/index.html`, "_self");
            }
        },
        /**
         * 忘记密码 -填写账户 点击下一步
         */
        async CheckCode(codeObj) {
            let psdUser = codeObj.psdUser;
            let psdVerfiy = codeObj.psdVerfiy;
            if (!psdUser) {
                actions.app.updateState({
                    forgetpswErrMsg: codeObj.psdUserErr
                })
                return;
            }
            if(!psdVerfiy){
                actions.app.updateState({
                    forgetpswErrMsg: codeObj.psdVerfiyErr
                })
                return;
            }
            let res = await api.CheckCode({
                psdUser: psdUser,
                psdVerfiy: psdVerfiy
            });
            res = res.data;
            if (res.status === 1) {
                actions.app.updateState({
                    step1User: psdUser,
                    step2MsgType: res.data.msgtype,
                    step2Phone: res.data.msgtype === 'phone'? res.data.phone: res.data.email,
                    step2UserId: res.data.userId,
                    forgetstep: 1,
                    forgetpswErrMsg: ''
                })
            } else {
                actions.app.updateState({
                    forgetpswErrMsg: res.msg.replace('<br/>','')
                })
            }
        },
        /**
         * 忘记密码 -忘记密码发送验证码
         */
        async sendMsg(params,getState) {
            let res = await api.sendMsg({
                userId: getState().app.step2UserId,
                msgtype: getState().app.step2MsgType
            });
            res = res.data;
            if (res.status === 1) {
                
                var wait = 60;
                actions.app.updateState({
                    step2Wait: wait
                })
                var get_code_time = function() {
                    if (wait == 0) {
                        actions.app.updateState({
                            step2Wait: wait
                        })
                    } else {
                        wait--;
                        actions.app.updateState({
                            step2Wait: wait
                        })
                        setTimeout(function() {
                            get_code_time()
                        }, 1000)
                    }
                };
                get_code_time();
            } else {
                actions.app.updateState({
                    forgetpswErrMsg: res.msg.replace('<br/>','')
                })
            }
            
        },
        /**
         * 忘记密码 -校验验证码
         */
        async CheckPhone(step2PsdVerfiy,getState) {
            let res = await api.CheckPhone({
                msgtype: getState().app.step2MsgType,
                userId: getState().app.step2UserId,
                valiCode: step2PsdVerfiy
            });
            res = res.data;
            if (res.status === 1) {
                actions.app.updateState({
                    forgetstep: 2,
                    forgetpswErrMsg: ''
                })
            } else {
                actions.app.updateState({
                    forgetpswErrMsg: res.msg.replace('<br/>','')
                })
            }
        },
        /**
         * 忘记密码 -保存密码
         */
        async saveNewPsd(newPassword,getState) {
            let data = JSON.stringify({ 
                newPassword: newPassword, 
                identification: getState().app.step2UserId, 
                verificationCode: getState().app.step2PsdVerfiy, 
                msgtype: getState().app.step2MsgType 
            })
            let res = await api.saveNewPsd(data);
            res = res.data;
            if (res.status === 1) {
                actions.app.updateState({
                    forgetstep: 3,
                    forgetpswErrMsg: ''
                })
                setTimeout(function() {
                    actions.app.updateState({
                        forgetpsw: false
                    })
                }, 3000);
            } else {
                actions.app.updateState({
                    forgetpswErrMsg: res.msg.replace('<br/>','')
                })
            }
            
        },
        /**
         * 重置密码
         */
        async modifyPassword(modifyData,getState) {
            let res = await api.modifyPassword(modifyData);
            res = res.data;
            if (res.status === 1) {
                var parm = {
                    username: modifyData.identification,
                    password: modifyData.newPassword
                };
                var wait = 2;
                var get_code_time = function() {
                    if (wait == 0) {
                        actions.app.loginAjax(parm)
                        actions.app.updateState({
                            resetpsw: false
                        });
                    } else {
                        actions.app.updateState({
                            resetpswErrMsg: wait 
                        });

                        wait--;
                        setTimeout(function() {
                            get_code_time()
                        }, 1000)
                    }
                };
                get_code_time();
                actions.app.updateState({
                    resetpwdDisabled: true,
                    resetpswErrMsg: wait
                });
            } else {
                actions.app.updateState({
                    resetpswErrMsg: res.msg
                });
            }

        }
    }
};
