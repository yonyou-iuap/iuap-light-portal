import React, {Component} from 'react';
import {Navbar, Menu, Badge, Tile, Icon, Tooltip} from 'tinper-bee';
import mirror, { connect,actions } from 'mirrorx';

import 'static/css/index.css';
import 'layout/Header/header.css';
import "static/iconfont/iconfont.js";
import 'layout/Sidebar/sideBar.css';
import { setCookie, getCookie} from "utils";
/* 引入字体文件 */
require('static/fonts/iuap_qy/iconfont.css');
require('static/fonts/pap/iconfont.css');
require('static/fonts/moren/iconfont.css');

import {ConnectedHeader} from '../../container'
import {ConnectedSidebar} from '../../container'
import {ConnectedTabBox} from '../../container'

class App extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
          // sideBarShow : false
        };
        let intl  = props.intl;
        document.title = intl.formatMessage({id: 'tabs.main.title',defaultMessage:"iuap应用开发平台"});

        // this.clickShow = this.clickShow.bind(this);
    }
    componentWillMount() {
      let uLogints = getCookie('u_logints');
      if(window.sessionStorage['u_logints'] !== uLogints){
        window.sessionStorage.removeItem('tabs');
        window.sessionStorage.removeItem('current');
        window.sessionStorage.removeItem('userId');
        // window.sessionStorage.clear();
        window.sessionStorage['u_logints'] = uLogints;
        // debugger;

      }
      actions.app.themeRequest();
    }
    componentDidMount(){
      var self = this;
      this.clickShow();

    }
    clickShow() {
      document.body.addEventListener('click', function(e){
        function matchesSelector(element, selector){
                if(element.matches){
                    return element.matches(selector);
                } else if(element.matchesSelector){
                    return element.matchesSelector(selector);
                } else if(element.webkitMatchesSelector){
                    return element.webkitMatchesSelector(selector);
                } else if(element.msMatchesSelector){
                    return element.msMatchesSelector(selector);
                } else if(element.mozMatchesSelector){
                    return element.mozMatchesSelector(selector);
                } else if(element.oMatchesSelector){
                    return element.oMatchesSelector(selector);
                }
            }
            //匹配当前组件内的所有元素
            if(matchesSelector(e.target,'.header-svg')|| matchesSelector(e.target,'.left-side-bar *') ){               
                return;
            }
        actions.app.updateState({
          sideBarShow: false
        })
      })
    }
    render() {
      let self = this;
        const {expanded,menus,current,showHeader,leftExpanded,themeObj} = this.props;
        // let sideBarShow = this.state.sideBarShow;
        // let svgClick = self.svgClick;
        // className={sideBarShow?'sider-bar-show':'side-bar-hide'}
        return (
            <div id="portal" className={"portal-expand " + (expanded ? "expanded" : "")}>

                {/*加载侧边栏*/}
                <div id="content">
                    <ConnectedSidebar/>
                    <ConnectedHeader/>
                    {/*加载Tab标签*/}
                    <ConnectedTabBox/>

                    <div className={[themeObj.sideShowPosition==='left'?"content left-content":"content",leftExpanded?"left-content-expand":""].join(" ")}>
                        {

                            menus.map(function (item, index) {

                                if(!item.id) return false;
                                var match = /.*(#\/ifr\/)/ig;
                                var selected = current == item.id ? "ifr-selected" : "";

                                item.router = decodeURIComponent(decodeURIComponent(item.router.replace(match, '')));

                                return (
                                  !item.notCreateIframe || selected?<iframe key={item.id} ref={item.id} className={'ifr-tabs '+selected} id={item.id}
                                            src={item.router} style={{border: '0'}}></iframe>:''

                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default App;
