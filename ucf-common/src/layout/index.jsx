import React, { Component } from "react";
import { Router,Switch,connect,withRouter,actions } from "mirrorx";

import "./index.less";
import "./animation.css";
import zhCN from "../components/Intl/locales/zh";
import enUS from "../components/Intl/locales/en";

class MainLayout extends Component {
    constructor(props) {
        super(props);
    }
    changeLocale(){
        const {locale} = this.props;

        let data = (locale!="zh_CN")?{
                locale: "zh_CN",
                localeData: zhCN
            }:{
            locale: "en_US",
            localeData: enUS
        };

        actions.intl.updateState(data)
    }
    render() {
        const {location,Routes} = this.props;

        const currentKey = location.pathname.split('/')[1] || '/'
        const timeout = { enter: 500, exit: 500 }
        return (

            <Switch location={location}>
                <Routes />
            </Switch>

        );
    }
}

export default  withRouter(connect(state => state.intl)(MainLayout))