/**
 * Created by zhangjlt .
 */
import React,{Component} from 'react';
import {Navbar,Menu,Button,Con,Col,Tile,Icon,Select} from 'tinper-bee';
const Option = Select.Option;
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
          showTenant: false,
            tenant:[],
            tenantNameVal:'',
            selectTenantVal:''
        };
        this.tenantChange = this.tenantChange.bind(this);
    }

    async componentDidMount(){
      let _this = this;
      this.clickOut(_this);
        // 调用 loadUserMenuList 请求数据
        let res = processData(await api.getAllTenant());
        if(!res) {
          return;
        }
        this.setState({
            tenant: res.data || []
        });
    }

    async handleSelect(e){
        let selectId = e.target.id;
        let res  =processData(await api.setTenant({tenantId:selectId}))
        if(res){
            window.location.reload();
        }

    }
    tenantClick = () => {
      let {showTenant} = this.state;
      this.setState({
        showTenant: !showTenant
      })
    }
    clickOut = (self) => {
        document.body.addEventListener('click', function(e){
            //针对不同浏览器的解决方案
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
            if(matchesSelector(e.target,'.header-right *')){               
                return;
            }
            self.setState({
                showTenant:false
            })
        }, false);
    }
  async tenantChange (val) {
    // alert(val);
    let _this = this;
    _this.setState({
      selectTenantVal: val
    })
    let res  = processData(await api.setTenant({tenantId:val}))
    if(res){
        window.location.reload();
    }
  }
    render() {

        var self = this;
        let  tenants  = this.state.tenant;
        let {showTenant} = this.state;
        let tenantNameVal = this.state.tenantNameVal;
        let selectTenantVal = this.state.selectTenantVal;
        let option = tenants.map((item,index)=>{
          return <Option value={item.tenantId} key={item.tenantId} title={item.tenantName} className="tenant-item">{item.tenantName}</Option>;
        })
        if(tenants.length>0 ) {
          selectTenantVal = tenants.filter(item => item.tenantId=== cookie.load("tenantid"))[0].tenantId
        }
        return (
          tenants.length > 0?
          <Select dropdownClassName="tenant-select"
            defaultValue={selectTenantVal}
            style={{ marginRight: 6 , width: 124}}
            onChange={self.tenantChange}
          >
          {
            option
          }
          {/*
          tenants.map((item,index)=>{
            return <Option value={item.tenantId} key={item.tenantId} title={item.tenantName} className="tenant-item">{item.tenantName}</Option>;
          })
          */}
          </Select>:''
            // tenants.length > 0? <div mode="horizontal"  className={showTenant?"header-right-tenant-info header-right-tenant-info-focus":"header-right-tenant-info"} style={{ width: '100px' }}>
            //         <a role="button" id="tenantname"  aria-expanded="false" href="javascript:void (0);" data-toggle="dropdown" onClick={this.tenantClick}>
            //             {<span className="tenant-name" title={tenants.filter(item => item.tenantId=== cookie.load("tenantid"))[0].tenantName}> {tenants.filter(item => item.tenantId=== cookie.load("tenantid"))[0].tenantName}</span>}
            //             {showTenant?<i className=" uf uf-gridcaretarrowup"></i>:<i className=" uf uf-treearrow-down"></i>}
            //             {/*<span className="iconfont icon-arrowdown"></span>*/}
            //         </a>
            //         <ul className={showTenant?"header-right-tenant-info-li header-right-tenant-info-li-show":"header-right-tenant-info-li header-right-tenant-info-li-hide"} >
            //         {
            //             tenants.map(function (item) {
            //                 return (
            //                     <li title={ item.tenantName} className="tenant-item" style={{paddingLeft:16}}>
            //                         <a  name ={item.tenantName} id ={item.tenantId} onClick={(e) => self.handleSelect(e)} >
            //                             {item.tenantName}
            //                         </a>
            //                     </li>
            //                 )
            //             })
            //         }
            //       </ul>
            // </div>:""
        )
    }
}

export default Tenant;
