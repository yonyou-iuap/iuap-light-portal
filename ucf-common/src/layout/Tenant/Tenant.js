/**
 * Created by zhangjlt .
 */
import React,{Component} from 'react';
import {Navbar,Menu,Button,Con,Col,Tile,Icon} from 'tinper-bee';
import mirror, { connect,actions } from 'mirrorx';
import * as api from "ucf-apps/index/src/service";

const SubMenu = Menu.SubMenu;
// 接口返回数据公共处理方法，根据具体需要
import { processData } from "utils";
import cookie from "react-cookie";

class Tenant extends Component {
    constructor(props) {
        super(props);
        var self = this;
        this.state = {
            tenant:[]
        };
    }

    async componentDidMount(){

        //调用 loadUserMenuList 请求数据
        let res = processData(await api.getAllTenant());
        this.setState({
            tenant: res.data
        });
    }

    async handleSelect(e){
        let selectId = e.target.id;
        let res  =processData(await api.setTenant({tenantId:selectId}))
        if(res){
            window.location.reload();
        }

    }
    render() {

        var self = this;
        let  tenants  = this.state.tenant;

        return (
            tenants.length > 0? <div mode="horizontal"  className="header-right-tenant-info" style={{ width: '100%' }}>
                    <a role="button" id="tenantname"  aria-expanded="false" href="javascript:void (0);" data-toggle="dropdown">
                        <span className="tenant-name" title={tenants.filter(item => item.tenantId=== cookie.load("tenantid"))[0].tenantName}> {tenants.filter(item => item.tenantId=== cookie.load("tenantid"))[0].tenantName}<i className="iconfont icon-arrowdown"></i> </span>
                        {/*<span className="iconfont icon-arrowdown"></span>*/}
                    </a>
                    <ul className="header-right-tenant-info-li">
                    {
                        tenants.map(function (item) {
                            return (
                                <li title={ item.tenantName} className="tenant-item" style={{paddingLeft:16}}>
                                    <a  name ={item.tenantName} id ={item.tenantId} onClick={(e) => self.handleSelect(e)} >
                                        {item.tenantName}
                                    </a>
                                </li>
                            )
                        })
                    }
                  </ul>
            </div>:""
        )
    }
}

export default Tenant;
