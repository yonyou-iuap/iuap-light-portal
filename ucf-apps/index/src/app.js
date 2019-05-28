import '@babel/polyfill';
import React, { Component } from "react";
import mirror, { render,Router } from "mirrorx";
import MainLayout from "layout";
import Routes from './routes'
import 'static/trd/tinper-bee/assets/tinper-bee.css'
import { setCookie } from 'utils/index';
setCookie('portalid',GROBAL_PORTAL_ID, {
    path: '/'
})

import Intl from 'components/Intl/index.js'

const MiddlewareConfig = [];

if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || 
                            Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
Element.prototype.closest = function(s) {
    var el = this;

    do {
    if (el.matches(s)) return el;
    el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
};
}

// if(__MODE__ == "development") MiddlewareConfig.push(logger);

mirror.defaults({
    historyMode: "hash",
    middlewares: MiddlewareConfig
});



render(<Intl>
    <Router>
        <MainLayout Routes={Routes} />
    </Router>
</Intl>, document.querySelector("#app"));