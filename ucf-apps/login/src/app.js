import '@babel/polyfill';
import React, { Component } from "react";
// import logger from "redux-logger";
import mirror, { render,Router } from "mirrorx";
import MainLayout from "layout";
import Routes from './routes'
import 'static/trd/tinper-bee/assets/tinper-bee.css'
import { setCookie,getCookie } from 'utils/index';
setCookie('portalid',GROBAL_PORTAL_ID)
import Intl from 'components/Intl/index.js'
import {getContextId} from 'utils';
const contextId = getContextId();

let runFun = () =>{
    const MiddlewareConfig = [];

    // if(__MODE__ == "development") MiddlewareConfig.push(logger);
    
    mirror.defaults({
        historyMode: "hash",
        middlewares: MiddlewareConfig
    });
    
    
    if(contextId === 'mdm'){
        document.getElementById("login_div").classList.add("bgmdm")
    }
    document.getElementById("login_div").classList.add("displayBlock")
    
    
    render(<Intl loginLocal={getCookie('u_locale')}>
        <Router>
            <MainLayout Routes={Routes} />
        </Router>
    </Intl>, document.querySelector("#login_div"));
}

let nowlocale = getCookie('u_locale');
import axios from "axios";
if(!nowlocale){
    axios({
        method: "get",
        url: `${GROBAL_HTTP_CTX}/i18n/classification/list`
    }).then(function (res) {
        res = res.data;
        let locale = ''
        if (res && res.status == 1) {
            let  arr = res.data;
            for (var i = 0; i < arr.length; i++) {
                if(arr[i].i18nDefault){
                    locale = arr[i].prelocale
                }
            }
        }
        setCookie('u_locale',locale)
        setTimeout(()=>{
            runFun()
        },200)
    });
}else{
    runFun()
}