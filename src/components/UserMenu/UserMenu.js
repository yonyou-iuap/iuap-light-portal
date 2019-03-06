/**
 * Created by yuzhao on 2017/6/7.
 */

import React,{Component} from 'react';
import {Navbar,Menu,Button,Con,Col,Tile,Icon} from 'tinper-bee';
import mirror, { connect,actions } from 'mirrorx';
import * as api from "../../pages/index/service";

const SubMenu = Menu.SubMenu;
// 接口返回数据公共处理方法，根据具体需要
import { processData } from "utils";
import cookie from "react-cookie";

class UserMenus extends Component {
    constructor(props) {
        super(props);
        var self = this;
        this.state = {
            userMenus:[]
        };
    }
    formmaterUrl(item) {
        var uri = " ";
        if (item.urlType === 'url') {
            var target=item.openview=="blank"?"_blank":"";
            if(target){
                uri = '#/ifrNoHead/' + encodeURIComponent(encodeURIComponent(item.url));
            }else{
                uri = '#/ifr/' + encodeURIComponent(encodeURIComponent(item.url));
            }
            return  uri;
        } else if (item.urlType === 'plugin') {
            uri = item.code ? ('#/' + item.code) : "#/index_plugin";
            //window.registerRouter(uri.replace("#", ""), item.location);

            uri = `${GROBAL_HTTP_CTX}/`+encodeURIComponent(encodeURIComponent('index-view.html'+uri));
            return  uri;
        } else if (item.urlType === 'view') {
            uri = item.code;

            uri= uri.replace("#", "/");

            return `${GROBAL_HTTP_CTX}/`+encodeURIComponent(encodeURIComponent('index-view.html#'+uri));

        }else if(item.urlType == undefined){
            item.code = '404';
            return  '#/ifr/' + encodeURIComponent(encodeURIComponent(item.code));
        }
        else {
            return item.code;
        }
    }
    async componentDidMount(){

        //调用 loadUserMenuList 请求数据
        let res = processData(await api.loadUserMenuList());
        this.setState({
            userMenus: res.data
        });
    }
    handleClick (e) {
        this.props.handleClick(e);
    }

    render() {

        var self = this;
        let {intl} = this.props;

        return (
            <Menu mode="horizontal" onClick={(e) => self.handleClick(e)} className="dropdown" style={{ width: '100%' }}>
                <SubMenu title={
                    <a role="button" id="username"  aria-expanded="false" href="javascript:void (0);" data-toggle="dropdown" className="navbar-avatar dropdown-toggle">

                        <span className="avatar-name"> {decodeURIComponent(decodeURIComponent(cookie.load('_A_P_userName')))} </span>
                        <span className="iconfont icon-arrowdown"></span>
                        <span className="avatar-icon">
                                            <img src={decodeURIComponent(decodeURIComponent(decodeURIComponent(cookie.load('_A_P_userAvator'))))} />
                                        </span>
                    </a>
                }>


                {
                    this.state.userMenus.map(function (item) {
                        return (
                            <li key={item.code} className="u-menu-item" style={{paddingLeft:16}}>
                                <a ref={item.code} value={item.code} onClick={ item.urlType==="url_blank"?"":(e) => self.props.handleDefault(e)}
                                   target={item.urlType==="url_blank"?"_blank":"_self"}
                                   name={item.name} title={item.name} href={item.urlType==="url_blank"?item.url: self.formmaterUrl(item)}>
                                    <i className={item.icon}></i>{item.name}
                                </a>
                            </li>
                        )
                    })
                }

                <li className="u-menu-item" style={{paddingLeft:16}}>
                    <a ref="setting3" title={intl.formatMessage({id: 'tabs.header.signout'})}  value="logout" href={`${GROBAL_HTTP_CTX}/user/beflogout`}><i aria-hidden="true" className="qy-iconfont icon-tubiao-zhuxiao"></i>{intl.formatMessage({id: 'tabs.header.signout'})} </a>
                </li>
                </SubMenu>
            </Menu>
        )
    }
}

export default UserMenus;
