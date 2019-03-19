import React from 'react';
import mirror, { connect } from 'mirrorx';
import {intlShape, injectIntl, defineMessages} from 'react-intl';

// 组件引入
import App from './components/AppRoot/AppRoot';

// // 数据模型引入
import model from './model'

mirror.model(model);

// 数据和组件UI关联、绑定
export const ConnectedApp = connect( state => state.app, null )(injectIntl(App));
// 组件引入
