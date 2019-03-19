/**
 * 前端路由说明：
 * 1、基于浏览器 History 的前端 Hash 路由
 * 2、按业务模块和具体页面功能划分了一级路由和二级路由
 */
import React, { Component } from "react";
import { Route } from "mirrorx";


// 导入子路由

import {
    ConnectedApp,
} from '../container'

console.log(ConnectedApp)
export default class App extends Component {
    render(){

        return (
            <div className="route-content">

                <div className="templates-route">
                    {/*配置根路由记载节点*/}
                    {<Route exact path={'/'} component={ConnectedApp} />}
                </div>
            </div>
        )
    }
}
//TODO 去掉child，冗余
