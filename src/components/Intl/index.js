import React, { Component } from 'react';
import { addLocaleData, IntlProvider,injectIntl } from 'react-intl';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import mirror, { connect,withRouter } from 'mirrorx';
import { setCookie, getCookie} from "utils";

import zhCN from './locales/zh';
import enUS from './locales/en';
import zhTW from './locales/zh_tw';


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
            return enUS;
            break;
    }
}
let language = (navigator.language || navigator.browserLanguage).toLowerCase();
let locale =  (getCookie('u_locale')||language.split('_')[0].replace(/-/,'_')||"en_US")
//TODO 封装到国际化组件中
//TODO 语言动态

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
        let {locale, localeData } = this.props;

        return (
            <IntlProvider key={locale} locale={locale.replace(/_.+/ig,'')} messages={localeData} >
                {this.props.children}
            </IntlProvider>
        )
    }
};

let Intl = connect(state => state.intl)(Inter);


export default Intl;

