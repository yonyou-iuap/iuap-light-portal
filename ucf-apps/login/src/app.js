import '@babel/polyfill';
import React, { Component } from "react";
// import logger from "redux-logger";
import mirror, { render,Router } from "mirrorx";
import MainLayout from "layout";
import Routes from './routes'
import 'static/trd/tinper-bee/assets/tinper-bee.css'
import { setCookie } from 'utils/index';
setCookie('portalid',GROBAL_PORTAL_ID)
import Intl from 'components/Intl/index.js'
import {getContextId} from 'utils';
const contextId = getContextId();

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


render(<Intl>
    <Router>
        <MainLayout Routes={Routes} />
    </Router>
</Intl>, document.querySelector("#login_div"));