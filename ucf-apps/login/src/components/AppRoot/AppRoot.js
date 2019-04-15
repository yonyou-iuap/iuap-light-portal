import React, { Component } from 'react';
import { actions } from 'mirrorx';
import {FormattedMessage, defineMessages, injectIntl, intlShape} from 'react-intl';
import {Select,Button,Step,Checkbox,Modal} from 'tinper-bee';
const Steps = Step.Steps
const Option = Select.Option;
import {LoginModal} from "../modal";
import {  getCookie } from "utils";
import {
	RSAUtils
} from 'utils/rsautils';
import {getContextId} from 'utils';
const contextId = getContextId();

import 'static/css/login.css';

import './psw.less';


class App extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
        };
        let intl  = props.intl;
        document.title = intl.formatMessage({id: 'ht.pag.log1.0001',defaultMessage:"登录"})
        actions.app.getLanguageList();
        actions.app.setEncryptParam(this.props.langCode);

        window.setInterval(function () {
            let cookieLogints = getCookie('u_logints');
            if (!(cookieLogints == null || cookieLogints == '""' || cookieLogints == undefined || cookieLogints == '')) {
                var canOpen = window.localStorage.getItem("canOpen");
                if(canOpen === "true" || canOpen === null) {
                    window.localStorage.setItem("canOpen",false);
                    window.open(`/${GROBAL_PORTAL_ID}/index.html`, "_self");
                }
            }
        }, 1000);
        //本地缓存有最后一次登录用户名，则使用
        var lastLoginName = localStorage.getItem("lastLoginName");
        if (lastLoginName != undefined) {
            actions.app.updateState({
                username: lastLoginName,
            })
        }
        // 本地缓存有最后一次登录密码，则使用本地缓存标识字符串作为密码（用作标识功能，最终提交到后台的是缓存的密码密文）
        var lastLoginPassword = localStorage.getItem("lastLoginPassword");
        if (lastLoginPassword != undefined) {
            actions.app.updateState({
                password: 'USE_LOCALPASS_FLAG',
            })
        }
        // 使用缓存的记住密码勾选状态
        var lastLoginIsRemember = localStorage.getItem("lastLoginIsRemember")
        if (lastLoginIsRemember != undefined) {
            var booleanValue = lastLoginIsRemember === "true" ? true : false;
            actions.app.updateState({
                checked: booleanValue,
                lastLoginIsRemember: booleanValue
            })
        }
    }
    /**
     * 切换语种
     */
    onSelect = (value) =>{
        actions.app.setLocaleParam(value);
    }

    /**
     * 语种切换下拉
     */
    initOption = (type,data) =>{
        let body=[];
        data.map((option,i) => (
            body.push(<Option className={"login-"+type+"-option"} value={option.code} key={option.code}>{option.name}</Option>)
        ));
        return body;
    }
    /**
     * 输入框focus
     */
    clearMsg = () =>{
        actions.app.updateState({
            errMsg: ''
        })
    }

    /**
     * 用户输入blur事件
     */
    userBlur = () =>{
        let username = this.refs.username.value;
        actions.app.getVertifyImg(username);
    }

    /**
     * 输入框keydown事件
     */
    onEnter = (e) =>{
        if(e.which==13){
            if(e.target.id=="username"){
                this.refs.password.focus();
            }
            if(e.target.id=="password"){
                if(this.props.codeVerfiy)
                    this.refs.verfiyInput.focus()
                else
                    this.onSubmit();
            }
            if(e.target.id=="verfiyInput"){
                this.refs.verfiyInput.blur();
                this.onSubmit();
            }
        }else if(e.target.id=="username"){
            let username = this.refs.username.value;
            if(username==""){
                this.refs.password.value="";
            }
        }
    }
    /**
     * 提交
     */
    onSubmit = () =>{
        let username = this.refs.username.value;
        let password = this.refs.password.value;
        let data = {
            username: username,
            password: password
        }
        if(!username){
            actions.app.updateState({
                errMsg: this.props.intl.formatMessage({id: 'ht.pag.log1.0004',defaultMessage:"请输入正确用户名"})
            })
            return;
        }
        if(!password){
            actions.app.updateState({
                errMsg: this.props.intl.formatMessage({id: 'ht.pag.log1.0007',defaultMessage:"请输入正确密码"})
            })
            return;
        }
        if(username && password){
            let DEdata = {};
            DEdata.text = password || '';
            DEdata.exponent = sessionStorage.getItem("exponent") || '';
            DEdata.modulus = sessionStorage.getItem("modulus") || '';

            var lastLoginPassword = localStorage.getItem("lastLoginPassword");
            if (lastLoginPassword && password === 'USE_LOCALPASS_FLAG') {
                password = lastLoginPassword;
            } else {
                password = RSAUtils.encryptedString(DEdata);
            }
            data.password = password;
 
            if(this.props.codeVerfiy){
                let verfiyCode = this.refs.verfiyInput.value;
                data.verifyCode = verfiyCode;
                if(!verfiyCode){
                    actions.app.updateState({
                        errMsg: this.props.intl.formatMessage({id: 'ht.pag.log1.0008',defaultMessage:"请输入验证码"})
                    })
                    return;
                }
            }
            actions.app.loginAjax(data)
        }
    }
    /**
     * 刷新验证码
     */
    randImg = () => {
        let username = this.refs.username.value;
        actions.app.updateState({
            verfiyImg: `${GROBAL_HTTP_CTX}/open/imgVerificationLoginCode/getCode?login_name=${username}&r=${Math.random()}`
        });
    }
    /**
     * 刷新验证码
     */
    forgetpswRandImg = () => {
        let timetemp = Date.parse(new Date());
        actions.app.updateState({
            forgetpswVerfiyImg: `${GROBAL_HTTP_CTX}/open/imgVerificationCode/getCode?ts=${timetemp}`
        });
    }
    /**
     * 选择记住用户名
     */
    changeCheck=()=> {
        let nowChecked = !this.props.checked
        actions.app.updateState({
            checked: nowChecked
        })
        console.log(nowChecked);
        if(nowChecked){
            localStorage.setItem('lastLoginIsRemember', true);
        }else{
            localStorage.removeItem("lastLoginName");
            localStorage.removeItem("lastLoginPassword");
            localStorage.setItem('lastLoginIsRemember', false);
        }
    }
    /**
     * 点击忘记密码
     */
    clickForgetPwdBtn = () => {
        this.forgetpswRandImg();
        actions.app.updateState({
            forgetpsw: true,
            forgetstep: 0,
            forgetpswErrMsg: ''
        })
    }
    /**
     * 关闭忘记密码
     */
    closeForgetPsw = () => {
        actions.app.updateState({
            forgetpsw: false,
            forgetstep:0,
            forgetpswErrMsg: ''
        });
    }
    /**
     * 关闭修改默认密码
     */
    closeRestPsw = () =>{
        this.refs.resetnewpsd.value = ''
        this.refs.resetconfirmnewpsd.value = ''
        actions.app.updateState({
            resetpsw: false,
            resetpswErrMsg: ''
        });
    }
    /**
     * 修改默认密码确认
     */
    resetpswConfirm = () =>{
        let loginAjaxParams = this.props.loginAjaxParams;
        let resetnewpsd = this.refs.resetnewpsd.value;
        let resetconfirmnewpsd = this.refs.resetconfirmnewpsd.value;
        if(resetnewpsd || resetconfirmnewpsd){
            if(resetnewpsd === resetconfirmnewpsd){
                let DEdata = {};
                DEdata.text = resetnewpsd || '';
                DEdata.exponent = sessionStorage.getItem("exponent") || '';
                DEdata.modulus = sessionStorage.getItem("modulus") || '';

                let newPassword = RSAUtils.encryptedString(DEdata);
                let modifyData = {
                    newPassword: newPassword,
                    identification: loginAjaxParams.username,
                    verificationCode: loginAjaxParams.password,
                    msgtype: 'oldpwd'
                }
                actions.app.modifyPassword(modifyData);
            }else{
                actions.app.updateState({
                    resetpswErrMsg: this.props.intl.formatMessage({id: 'js.pag.log.0008',defaultMessage:"两次输入不一致"})
                });
            }
        }else{
            actions.app.updateState({
                resetpswErrMsg: this.props.intl.formatMessage({id: 'js.pag.log.0009',defaultMessage:"密码不能为空"})
            });
        }
    }



    /**
     * 修改默认密码提示信息确认
     */
    confirmOk = () =>{
        // debugger
        actions.app.updateState({
            resetpsw: true,
            resetpwdDisabled: false,
            confirmShow: false
        });
    }

    /**
     * 修改默认密码提示信息取消
     */
    confirmCancel = () =>{
        let loginAjaxParams = this.props.loginAjaxParams;
        loginAjaxParams.pwdExpiredCancle = true
        actions.app.updateState({
            confirmShow: false
        });
        actions.app.loginAjax(loginAjaxParams)
    }

    /**
     * 忘记密码下一步
     */
    toForgetPswNext = () => {
        let forgetstep = this.props.forgetstep;
        switch (forgetstep) {
            case 0:
                let psdUser = this.refs.psdUser.value;
                let psdVerfiy = this.refs.psdVerfiy.value;
                if (!psdUser) {
                    actions.app.updateState({
                        forgetpswErrMsg: this.props.intl.formatMessage({id: 'js.pag.for.0005',defaultMessage:"账户不能为空"})
                    })
                    return;
                }
                if(!psdVerfiy){
                    actions.app.updateState({
                        forgetpswErrMsg: this.props.intl.formatMessage({id: 'js.pag.for.0004',defaultMessage:"验证码不能为空"})
                    })
                    return;
                }
                let codeObj = {
                    psdUser: psdUser,
                    psdVerfiy: psdVerfiy
                }
                actions.app.CheckCode(codeObj);
                break;
            case 1:
                let step2PsdVerfiy = this.refs.step2PsdVerfiy.value;
                if (step2PsdVerfiy && /^\d{6}$/.test(step2PsdVerfiy)) {
                    actions.app.updateState({
                        step2PsdVerfiy: step2PsdVerfiy
                    })
                    actions.app.CheckPhone(step2PsdVerfiy);
                }else if(step2PsdVerfiy==null ||step2PsdVerfiy.trim().replace(/(^s*)|(s*$)/g, "").length ==0){
                    actions.app.updateState({
                        forgetpswErrMsg: this.props.intl.formatMessage({id: 'js.pag.for.0004',defaultMessage:"验证码不能为空"}) + "~"
                    })
                } else {
                    actions.app.updateState({
                        forgetpswErrMsg: this.props.intl.formatMessage({id: 'js.pag.for.0011',defaultMessage:"验证码不正确"}) + "~"
                    })
                }
                break;
            case 2:
                let newpsd = this.refs.newpsd.value;
                let confirmnewpsd = this.refs.confirmnewpsd.value;
                if (!newpsd.length || !confirmnewpsd.length) {
                    actions.app.updateState({
                        forgetpswErrMsg: this.props.intl.formatMessage({id: 'js.pag.for.0007',defaultMessage:"输入不能为空"}) + "~"
                    })
                    return;
                }
                if (newpsd != confirmnewpsd) {
                    actions.app.updateState({
                        forgetpswErrMsg: this.props.intl.formatMessage({id: 'js.pag.for.0008',defaultMessage:"两次输入不一致"}) + "~"
                    })
                    this.refs.confirmnewpsd.value = ''
                    return;
                }
                if (!sessionStorage.getItem('exponent')) {
                    actions.app.updateState({
                        forgetpswErrMsg: this.props.intl.formatMessage({id: 'js.pag.for.0009',defaultMessage:"出现异常，请重试"}) + "~"
                    })
                    return;
                }
                let DEdata = {};
                DEdata.text = confirmnewpsd || '';
                DEdata.exponent = sessionStorage.getItem("exponent") || '';
                DEdata.modulus = sessionStorage.getItem("modulus") || '';

                let newPassword = RSAUtils.encryptedString(DEdata);
                actions.app.saveNewPsd(newPassword);
                break;
            case 3:
                break;
            default:
                return;
        }
    }
    /**
     * 忘记密码上一步
     */
    toForgetPswPre = () => {
        let forgetstep = this.props.forgetstep;
        forgetstep--;
        if(forgetstep === 0){
            this.forgetpswRandImg();
        }
        actions.app.updateState({
            forgetstep: forgetstep,
            forgetpswErrMsg: ''
        })
    }
    /**
     * 忘记密码发送验证码
     */
    sendMsg = () => {
        let step2MsgType = this.props.step2MsgType;
        let phone = this.refs.pswPhone.value;
        if(phone){
            actions.app.sendMsg();
        }else{
            let errMsg = this.props.intl.formatMessage({id: 'js.pag.for.0013',defaultMessage:"邮箱输入错误"})
            if(step2MsgType === 'phone'){
                errMsg = this.props.intl.formatMessage({id: 'js.pag.for.0010',defaultMessage:"手机号码输入错误"})
                
            }
            actions.app.updateState({
                forgetpswErrMsg: errMsg
            })
        }
    }

    /**
     * 获取忘记密码title区域
     */
    forgetpswModelTitle = () => {
        return (
            <LoginModal.Title onClose={this.closeForgetPsw}>
                {this.props.intl.formatMessage({id: 'ht.pag.log1.0012',defaultMessage:"忘记密码"})}
            </LoginModal.Title>
        )
    }
    /**
     * 获取忘记密码steps区域
     */
    forgetpswSteps = () => {
        return (
            <Steps className="forget-step" current={forgetstep} size="small">
                <Step title={this.props.intl.formatMessage({id: 'ht.pag.for.0004',defaultMessage:"填写账户"})} />
                <Step title={this.props.intl.formatMessage({id: 'ht.pag.for.0005',defaultMessage:"验证"})} />
                <Step title={this.props.intl.formatMessage({id: 'ht.pag.for.0006',defaultMessage:"设置新密码"})} />
                <Step title={this.props.intl.formatMessage({id: 'ht.pag.for.0007',defaultMessage:"完成"})} />
            </Steps>
        )
    }
    
    render() {
        let {langCode,langList,verfiyImg,errMsg,codeVerfiy,checked,username,password,forgetpswErrMsg,forgetpswVerfiyImg,forgetstep,forgetpsw,step2MsgType,step2Phone,step1User,step2Wait,confirmShow,confirmMsg,resetpwdDisabled,resetpsw,reststep,resetpswErrMsg,resetpswTitle} = this.props; 

        let m_top = codeVerfiy?"45px":"55px";
        let m_bottom = codeVerfiy?"30px":"60px";
        let img2=codeVerfiy?<div className="randDiv"><input className="u-form-control text1" ref="verfiyInput" onKeyDown={this.onEnter} id="verfiyInput" placeholder={this.props.intl.formatMessage({id: 'ht.pag.log.0016',defaultMessage:"验证码"})}/><img onClick={this.randImg} id="randImg" src={verfiyImg}/></div>:"";
        let step2Button
        if(step2Wait > 0 && step2Wait < 60){
            step2Button = '(' + step2Wait + this.props.intl.formatMessage({id: 'js.pag.for.0003',defaultMessage:")秒后重新获取"})
        }else{
            step2Button= step2MsgType === 'phone'?this.props.intl.formatMessage({id: 'js.pag.for.0001',defaultMessage:"发送短信验证码"}):this.props.intl.formatMessage({id: 'js.pag.for.0012',defaultMessage:"发送邮箱验证码"})
        }

        if(resetpswErrMsg === 2 || resetpswErrMsg === 1){
            resetpswErrMsg =  this.props.intl.formatMessage({id: 'js.pag.log.0006',defaultMessage:"密码修改成功，"}) + resetpswErrMsg + this.props.intl.formatMessage({id: 'js.pag.log.0007',defaultMessage:"S后自动关闭"})
        }
        let logImg = GROBAL_PORTAL_ID === 'wbalone'? 'logo-img' : 'logo-img-light'
        let langDisplay = contextId === 'wbalone'? 'block' : 'none';
        return (
            <div className="login-main">
                <div className="login-top">
                    <div className="login-logo">
                        <div className={logImg}><img src=""/></div>                                          
                    </div>
                    <div className="login-lang" style={{
                        display: langDisplay
                    }}>
                        <Select id="busicenter" onSelect={this.onSelect} defaultValue={langCode} className="langcode">
                            {this.initOption("lang",langList)}
                        </Select>
                    </div>
                </div>
                <div className="login-content">
                    <div className="content-left"></div>
                    <div className="content-center">
                        {/* <img src={require(`static/images/login-center_${langCode}.png`)}/> */}
                    </div>    
                    <div className="content-right">
                        <div className="login-panel-out">
                            <div  className="login-panel" style={{paddingTop:m_top,paddingBottom:m_bottom}}>
                                <input style={{display:"none"}} type="text" name="fakeusernameremembered"/>
                                <input style={{display:"none"}} type="password" name="fakepasswordremembered"/>
                                <input name="fakeusernameremembered" defaultValue={username} field="username" onBlur={this.userBlur}  onFocus={this.clearMsg} ref="username" fieldname="用户名" id="username" onKeyDown={this.onEnter}    className="u-form-control text" type="text" placeholder={this.props.intl.formatMessage({id: 'ht.pag.log2.0002',defaultMessage:"用户名"})}/>
                                <input name="fakepasswordremembered" defaultValue={password} field="password" onFocus={this.clearMsg} ref="password" fieldname="密码" id="password" onKeyDown={this.onEnter}   className="u-form-control text" type="password" placeholder={this.props.intl.formatMessage({id: 'ht.pag.log2.0003',defaultMessage:"密码"})}/>
                                {img2}
                                <div className="login-error2-msg" id="login-error-msg">{errMsg}</div>
                                <div className="login-btn">
                                    <Button field="loginBtn" fieldname="登陆" id="loginBtn" onClick = {this.onSubmit} className="btn" colors="danger">{this.props.intl.formatMessage({id: 'ht.pag.log1.0001',defaultMessage:"登录"})}</Button>
                                </div>
                                <div className="panel-oper">
                                <Checkbox field="remember" fieldname="记住账号"  onChange={this.changeCheck} checked={checked} className="inbox">{this.props.intl.formatMessage({id: 'ht.pag.log1.0011',defaultMessage:"记住用户名"})}</Checkbox>
                                <a field="forget" fieldname="忘记密码" onClick={this.clickForgetPwdBtn} className="oper-ps" href="#">{this.props.intl.formatMessage({id: 'ht.pag.log1.0012',defaultMessage:"忘记密码"})}?</a>
                                </div>
                            </div>
                        </div>
                    </div>                
                </div>
                <div className="login-bottom">{this.props.intl.formatMessage({id: 'ht.pag.log1.0022',defaultMessage:"版权所有"})} &#169;2007-2019{this.props.intl.formatMessage({id: 'ht.pag.log1.0021',defaultMessage:"ht.pag.log1.0021"})}</div>
                <LoginModal visible={forgetpsw}  step={forgetstep} className={langCode === 'en_US'? 'modal-en': ''}>
                    <div className="login-tabs step1">
                        {this.forgetpswModelTitle()}
                        <LoginModal.Content className="reset-psw">
                            <Steps className="forget-step" current={forgetstep} size="small">
                                <Step title={this.props.intl.formatMessage({id: 'ht.pag.for.0004',defaultMessage:"填写账户"})} />
                                <Step title={this.props.intl.formatMessage({id: 'ht.pag.for.0005',defaultMessage:"验证"})} />
                                <Step title={this.props.intl.formatMessage({id: 'ht.pag.for.0006',defaultMessage:"设置新密码"})} />
                                <Step title={this.props.intl.formatMessage({id: 'ht.pag.for.0007',defaultMessage:"完成"})} />
                            </Steps>
                            <div className="psw-p">
                                <div className="psw-p-label">{this.props.intl.formatMessage({id: 'ht.pag.for.0008',defaultMessage:"账号"})}</div>
                                <div className="psw-p-input">
                                    <div>
                                        <input className="u-form-control text" id="psdUser" ref="psdUser" type="text" defaultValue={step1User} placeholder={this.props.intl.formatMessage({id: 'ht.pag.for.0009',defaultMessage:"用户名/邮箱/手机号"})}/>
                                    </div> 
                                </div>
                            </div>
                            <div className="psw-p">
                                <div className="psw-p-label">{this.props.intl.formatMessage({id: 'ht.pag.for.0010',defaultMessage:"图片验证码"})}</div>
                                <div className="psw-p-input">
                                    <div>
                                        <input className="u-form-control text" defaultValue='' id="psdVerfiy" ref="psdVerfiy" type="text" placeholder={this.props.intl.formatMessage({id: 'ht.pag.for.0011',defaultMessage:"输入右侧图片字母或数字"})}/>   
                                    </div>
                                </div>
                                <img onClick={this.forgetpswRandImg} id="randImg" src={forgetpswVerfiyImg}/>
                            </div>
                            <div className="psw-error-msg" id="psw-error-msg">{forgetpswErrMsg}</div>   
                        </LoginModal.Content>
                        <LoginModal.Foot>
                            <Button className="modalOK" onClick={this.toForgetPswNext}>{this.props.intl.formatMessage({id: 'ht.pag.for.0012',defaultMessage:"下一步"})}</Button>
                            <Button className="modalCencel" shape="border" onClick={this.closeForgetPsw}>{this.props.intl.formatMessage({id: 'ht.pag.log.0013',defaultMessage:"取消"})}</Button>
                        </LoginModal.Foot>
                    </div>
                    <div className="login-tabs step2">
                        {this.forgetpswModelTitle()}
                        <LoginModal.Content className="reset-psw">
                            <Steps className="forget-step" current={forgetstep} size="small">
                                <Step title={this.props.intl.formatMessage({id: 'ht.pag.for.0004',defaultMessage:"填写账户"})} />
                                <Step title={this.props.intl.formatMessage({id: 'ht.pag.for.0005',defaultMessage:"验证"})} />
                                <Step title={this.props.intl.formatMessage({id: 'ht.pag.for.0006',defaultMessage:"设置新密码"})} />
                                <Step title={this.props.intl.formatMessage({id: 'ht.pag.for.0007',defaultMessage:"完成"})} />
                            </Steps>
                            <div className="psw-p">
                                <div className="psw-p-label">{step2MsgType === 'phone'?this.props.intl.formatMessage({id: 'ht.pag.for.0013',defaultMessage:"手机号"}):this.props.intl.formatMessage({id: 'ht.pag.for.0029',defaultMessage:"邮箱号"})}</div>
                                <div className="psw-p-input">
                                    <input className="u-form-control text"  disabled value={step2Phone}  id="pswPhone" ref="pswPhone" type="text" placeholder={step2MsgType === 'phone'?this.props.intl.formatMessage({id: 'ht.pag.for.0014',defaultMessage:"输入11位手机号码"}):this.props.intl.formatMessage({id: 'ht.pag.for.0030',defaultMessage:"输入正确的邮箱号码"})}/>
                                </div>
                                <Button className="modalSendMsg" disabled={step2Wait > 0 && step2Wait < 60? true: false} onClick={this.sendMsg}>{step2Button}</Button>
                            </div>
                            <div className="psw-p">
                                <div className="psw-p-label">{step2MsgType === 'phone'?this.props.intl.formatMessage({id: 'ht.pag.for.0016',defaultMessage:"短信验证码"}):this.props.intl.formatMessage({id: 'ht.pag.for.0028',defaultMessage:"邮箱验证码"})}</div>
                                <div className="psw-p-input">
                                    <input className="u-form-control text"  id="step2PsdVerfiy" ref="step2PsdVerfiy" type="text" placeholder={this.props.intl.formatMessage({id: 'ht.pag.for.0017',defaultMessage:"输入6位验证码"})}/>
                                </div>
                            </div>
                            <div className="psw-error-msg" id="psw-error-msg">{forgetpswErrMsg}</div>   
                        </LoginModal.Content>
                        <LoginModal.Foot>
                            <Button className="modalOK" onClick={this.toForgetPswNext}>{this.props.intl.formatMessage({id: 'ht.pag.for.0012',defaultMessage:"下一步"})}</Button>
                            <Button className="modalCencel" onClick={this.closeForgetPsw}>{this.props.intl.formatMessage({id: 'ht.pag.log.0013',defaultMessage:"取消"})}</Button>
                            {/* <Button className="modalOK" onClick={this.toForgetPswPre}>{"上一步"}</Button> */}
                        </LoginModal.Foot>
                    </div>
                    <div className="login-tabs step3">
                        {this.forgetpswModelTitle()}
                        <LoginModal.Content className="reset-psw">
                            <Steps className="forget-step" current={forgetstep} size="small">
                                <Step title={this.props.intl.formatMessage({id: 'ht.pag.for.0004',defaultMessage:"填写账户"})} />
                                <Step title={this.props.intl.formatMessage({id: 'ht.pag.for.0005',defaultMessage:"验证"})} />
                                <Step title={this.props.intl.formatMessage({id: 'ht.pag.for.0006',defaultMessage:"设置新密码"})} />
                                <Step title={this.props.intl.formatMessage({id: 'ht.pag.for.0007',defaultMessage:"完成"})} />
                            </Steps>
                            <div className="psw-p">
                                <div className="psw-p-label">{this.props.intl.formatMessage({id: 'ht.pag.for.0019',defaultMessage:"新密码"})}</div>
                                <div className="psw-p-input">
                                    <div>
                                        <input className="u-form-control text"  id="newpsd" ref="newpsd" type="password" placeholder={this.props.intl.formatMessage({id: 'ht.pag.log1.0015',defaultMessage:"请输入新密码"})}/>
                                    </div>
                                </div>
                            </div>
                            <div className="psw-p">
                                <div className="psw-p-label">{this.props.intl.formatMessage({id: 'ht.pag.for.0021',defaultMessage:"确认密码"})}</div>
                                <div className="psw-p-input">
                                    <div>
                                        <input className="u-form-control text"  id="confirmnewpsd" ref="confirmnewpsd" type="password" placeholder={this.props.intl.formatMessage({id: 'ht.pag.log1.0017',defaultMessage:"请再确认新密码"})}/>
                                    </div>
                                </div>
                            </div>
                            <div className="psw-error-msg" id="psw-error-msg">{forgetpswErrMsg}</div>   
                        </LoginModal.Content>
                        <LoginModal.Foot>
                            <Button className="modalOK" onClick={this.toForgetPswNext}>{this.props.intl.formatMessage({id: 'ht.pag.for.0012',defaultMessage:"下一步"})}</Button>
                            <Button className="modalCencel" onClick={this.closeForgetPsw}>{this.props.intl.formatMessage({id: 'ht.pag.log.0013',defaultMessage:"取消"})}</Button>
                            {/* <Button className="modalOK" onClick={this.toForgetPswPre}>{"上一步"}</Button> */}
                        </LoginModal.Foot>
                    </div>
                    <div className="login-tabs step4">
                        {this.forgetpswModelTitle()}
                        <LoginModal.Content className="reset-psw">
                            <Steps className="forget-step" current={forgetstep} size="small">
                                <Step title={this.props.intl.formatMessage({id: 'ht.pag.for.0004',defaultMessage:"填写账户"})} />
                                <Step title={this.props.intl.formatMessage({id: 'ht.pag.for.0005',defaultMessage:"验证"})} />
                                <Step title={this.props.intl.formatMessage({id: 'ht.pag.for.0006',defaultMessage:"设置新密码"})} />
                                <Step title={this.props.intl.formatMessage({id: 'ht.pag.for.0007',defaultMessage:"完成"})} />
                            </Steps>
                            <div className="psw-forget1">{this.props.intl.formatMessage({id: 'ht.pag.for.0025',defaultMessage:"新密码设置成功"})}</div>
                            <div className="psw-forget2">{'3' + this.props.intl.formatMessage({id: 'ht.pag.for.0026',defaultMessage:"后自动关闭"})}</div>
                        </LoginModal.Content>
                    </div>
                    
                </LoginModal>
                <LoginModal visible={resetpsw}  step={reststep} className={langCode === 'en_US'? ' modal-en reset-modal': ' reset-modal'}>
                    <div className="login-tabs step5">
                        <LoginModal.Title onClose={this.closeRestPsw}>
                            {resetpswTitle}
                            {/* {this.props.intl.formatMessage({id: 'ht.pag.log1.0013',defaultMessage:"修改默认密码"})} */}
                        </LoginModal.Title>
                        <LoginModal.Content className="reset-psw">
                            <div className="psw-p">
                                <div className="psw-p-label">{this.props.intl.formatMessage({id: 'ht.pag.log1.0014',defaultMessage:"新密码"})}</div>
                                <div className="psw-p-input">
                                    <div>
                                    <input className="u-form-control text"  id="resetnewpsd" ref="resetnewpsd" type="password" placeholder={this.props.intl.formatMessage({id: 'ht.pag.log1.0015',defaultMessage:"请输入新密码"})}/>
                                    </div>
                                </div>
                            </div>
                            <div className="psw-p">
                                <div className="psw-p-label">{this.props.intl.formatMessage({id: 'ht.pag.log1.0016',defaultMessage:"确认密码"})}</div>
                                <div className="psw-p-input">
                                    <div>
                                    <input className="u-form-control text"  id="resetconfirmnewpsd" ref="resetconfirmnewpsd" type="password" placeholder={this.props.intl.formatMessage({id: 'ht.pag.log1.0017',defaultMessage:"请再确认新密码"})}/>
                                    </div>
                                </div>
                            </div>
                            <div className="psw-error-msg" id="psw-error-msg">{resetpswErrMsg}</div>   
                        </LoginModal.Content>
                        <LoginModal.Foot>
                            <Button disabled={resetpwdDisabled} className="modalOK" onClick={this.resetpswConfirm}>{this.props.intl.formatMessage({id: 'ht.pag.log1.0020',defaultMessage:"确定"})}</Button>
                            <Button disabled={resetpwdDisabled} className="modalCencel" onClick={this.closeRestPsw}>{this.props.intl.formatMessage({id: 'ht.pag.log1.0019',defaultMessage:"取消"})}</Button>
                        </LoginModal.Foot>
                    </div>
                </LoginModal>
                <Modal
                    show = { confirmShow }
                    onHide = { this.confirmCancel } >
                    <Modal.Header closeButton>
                        <Modal.Title><FormattedMessage id="js.pag.log.0005" defaultMessage="提示" /></Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {confirmMsg}
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={ ()=>{this.confirmCancel()}} shape="border" style={{marginRight: 30}}><FormattedMessage id="ht.pag.log1.0019" defaultMessage="取消" /></Button>
                        <Button onClick={()=>{this.confirmOk()}  } colors="primary"><FormattedMessage id="ht.app.use.0065" defaultMessage="确认" /></Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default App;
