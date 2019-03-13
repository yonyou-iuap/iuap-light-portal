import React from 'react';
import mirror, { connect } from 'mirrorx';
import {intlShape, injectIntl, defineMessages} from 'react-intl';

// 组件引入
import App from './components/AppRoot/AppRoot';
import Header from 'layout/Header/Header';
import Sidebar from 'layout/Sidebar/Sidebar';
import TabBox from 'layout/TabBox/TabBox';
import HeaderLeft from 'layout/Header/HeaderLeft';
import HeaderRight from 'layout/Header/HeaderRight';

// // 数据模型引入
import model from './model'

mirror.model(model);

// 数据和组件UI关联、绑定
export const ConnectedApp = connect( state => state.app, null )(injectIntl(App));
// 组件引入
export const ConnectedHeader = connect( state => state.app, null )(injectIntl(Header));
export const ConnectedSidebar = connect( state => state.app, null )(injectIntl(Sidebar));
export const ConnectedTabBox = connect( state => state.app, null )(injectIntl(TabBox));
export const ConnectedHeaderLeft = connect( state => state.app, null)(injectIntl(HeaderLeft));
export const ConnectedHeaderRight = connect( state => state.app, null)(injectIntl(HeaderRight));
