import React, { Component } from 'react';
import { addLocaleData, IntlProvider,injectIntl } from 'react-intl';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import mirror, { connect,withRouter,actions } from 'mirrorx';
import { setCookie, getCookie} from "utils";

import zhCN from './locales/zh';
import enUS from './locales/en';
import zhTW from './locales/zh_tw';
import {getContextId} from 'utils';
const contextId = getContextId();


addLocaleData([...en, ...zh]);


function chooseLocale(locale){

    switch(locale){
        case 'en_US':
            return enUS;
            break;
        case 'zh_CN':
            return zhCN;
            break;
        case 'zh_TW':
            return zhTW;
            break;
        default:
            return zhCN;
            break;
    }
}
let language = (navigator.language || navigator.browserLanguage);
let locale =  (getCookie('u_locale')||language.split('_')[0].replace(/-/,'_')||"en_US")
//TODO 封装到国际化组件中
//TODO 语言动态
if(contextId === 'mdm'){
    locale = 'zh_CN'
}
let intlModel = {
    name: "intl",
    initialState: {
        locale: locale,
        localeData:chooseLocale(locale)
    },
    reducers: {
        updateState(state, data) {
            return {
                ...state,
                ...data
            };
        }
    }
}

mirror.model(intlModel);




class Inter extends Component {
    render() {
        let {locale,loginLocal, localeData } = this.props;
        if(loginLocal && loginLocal!=locale){
            locale = loginLocal
            actions.intl.updateState({
                locale: locale,
                localeData:chooseLocale(locale)
            })
        }
            
        return (
            <IntlProvider key={locale} locale={locale.replace(/_.+/ig,'')} messages={localeData} >
                {this.props.children}
            </IntlProvider>
        )
    }
};

let Intl = connect(state => state.intl)(Inter);


export default Intl;

