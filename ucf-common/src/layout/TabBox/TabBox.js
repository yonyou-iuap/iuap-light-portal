/**
 * Created by yuzhao on 2017/5/31.
 */

import React,{Component} from 'react';
import ReactDom from 'react-dom';
import {Button,Con,Col,Tile,Icon,Tooltip} from 'tinper-bee';
import {FormattedMessage, FormattedDate, FormattedNumber} from 'react-intl';
import mirror, { connect,actions } from 'mirrorx';
require('./Tabs.css');
import {getCookie} from "utils";

class Tab extends Component {
    constructor(props) {
        super(props);

        var self = this;

        var value = typeof sessionStorage['tabNotice']=='undefined'?true:sessionStorage['tabNotice'];

        this.state = {
            tabNotice:JSON.parse(value),
            moreMenuList:[]
        };

        this.setCurrent = this.setCurrent.bind(this);

        this.del = this.del.bind(this);
        window.closeWin = this.del;
    }

    setCurrent (id) {
        // let morelist = this.state.moreMenuList;
        let menuProp = this.props.menus;
        let {themeObj,current} = this.props;
        let list = [];
        let obj={};
        let moreFlag = false;
        // debugger;
        if(menuProp.length > themeObj.tabNum) {
          for (var i = themeObj.tabNum; i < menuProp.length; i++) {
            if(menuProp[i].id === id){
              moreFlag = true;
              obj = menuProp[i];
              break;
            } else {
              moreFlag = false;
            }
          }
          if(moreFlag) {
            for (var i = 0; i < menuProp.length; i++) {
                  if(menuProp[i].id === id) {
                    menuProp.splice(i,1);
                  }
                }
                menuProp.splice(1,0,obj);
          }
        }
        actions.app.updateState({
            current: id,
            showNotice:0,
            reload:0,
            // menus: menuProp
        })
        // sessionStorage['tabs'] = JSON.stringify(menuProp);
        sessionStorage['current'] = JSON.stringify({
            current:id
        });
    }

    del (id) {

        const {menus,current} = this.props;

        var menuCloned = JSON.parse(JSON.stringify(menus));

        var num = 0;
        for(var i=0;i<menuCloned.length;i++){
            if(id==menuCloned[i].id){
                menuCloned.splice(i,1);
                num = i-1;
            }
        }


        var data = {
            menus:menuCloned
        }


        //删除选中的tab时
        if(current==id){
            data.current=menuCloned[num].id;
            data.router=menuCloned[num].router;
        }

        var match = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;


        var ifr = document.getElementById(id);
        //TODO 跨域try catch
        if(ifr.src.match(match)!=null){
            if(ifr.src.match(location.host)!=null){
                try {
                    if(ifr.contentWindow.confirmClose&&typeof ifr.contentWindow.confirmClose=='function'){
                        ifr.contentWindow.confirmClose(id,data);
                        return false;
                    }
                }
                catch(err) {

                }
            }
        }
        else {
            try{
                var frameWin = ifr.contentWindow;
                ifr.src = 'about:blank';
                frameWin.document.write('');
                frameWin.document.clear();
                CollectGarbage();
            }catch(e){};
        }

        data.tabNum = menuCloned.length;

        sessionStorage['tabs'] = JSON.stringify(data.menus);
        sessionStorage['current'] = JSON.stringify({
            current:data.current
        });

        actions.app.updateState(data)

        return menuCloned;
    }

    notice() {
        const {tabNotice} = this.props;
        var value = tabNotice

        sessionStorage['tabNotice'] = !value;

        actions.app.updateState({
            tabNotice:!value
        })
    }
    componentDidUpdate(){
        // this.tabNotice();
    }
    tabNotice (){
        const {menus} = this.props;
        if(menus.length>=3) {
            var dom = ReactDOM.findDOMNode(this.refs['tabNotice']);
            if(dom){
                dom.style.display = '';
            }
            setTimeout(function () {
                if(dom){
                    dom.style.display = 'none';
                }
            },2000)
        }
    }
    // 页签更多的点击事件
    tabsMoreClick() {

      const {tabsMore} = this.props;
      actions.app.updateState({
          tabsMore: !tabsMore
      })
    }
    //控制头部是否显示
    showHeaderClick() {
      const {showHeader} = this.props;
      actions.app.updateState({
          showHeader: !showHeader
      })
    }
    render() {
      let locale_serial = getCookie("locale_serial");
      if(locale_serial == 1) {
          locale_serial = "";
      }
        var self = this;
        const {current,menus,tabNum,showNotice,tabNotice,tabsMore,showHeader,intl,sideShowPosition,leftExpanded,themeObj} = this.props;
        // let {tabsMore} = this.props;
        const moremenu=[];
        // this.state.moreMenuList = [];
        //   let moreMenu = []
        //   let menusss = []

        // console.log(menus);
        // debugger;
        return (

            <div id="portalTabs" className={["tabs ui-tabs-num-"+tabNum ,themeObj.sideShowPosition==="left"?"tabs-show-left":'',leftExpanded?"tabs-show-left-expand":''].join(" ")}>
                <div className="tabs-list-box">
                    {/*<span className="tabs-list-home">*/}
                    {/*<i className="qy-iconfont icon-tubiao-shouye"></i>*/}
                    {/*</span>*/}

                    <ul className="tabs-list">
                        {
                            menus.map(function (item,index) {
                                var delIcon = index==0?'':(<i onClick={self.del.bind(this,item.id)} className="qy-iconfont icon-tubiao-guanbi x-close" key={item.router}></i>)

                                var homeIcon = index==0?<i className="qy-iconfont icon-tubiao-shouye"></i>:item['title'+locale_serial];

                                var selected = current==item.id?'selected':'';
                                var liDom;
                                if(index > (themeObj.tabNum-1)) {
                                  moremenu.push(item);
                                  // self.state.moreMenuList = moremenu;

                                } else {
                                  liDom = <li key={item.id} className={selected}>
                                      <a onClick={self.setCurrent.bind(this,item.id)} href="javascript:;" title={item['title'+locale_serial]}>
                                          {homeIcon}
                                      </a>
                                      {delIcon}
                                  </li>
                                }

                                return liDom

                            })
                        }
                        {
                          menus.length>themeObj.tabNum? <li className="tabs-more" onClick={self.tabsMoreClick.bind(this)}><a href="javascript:;">{intl.formatMessage({id: 'tabs.show.more'})}</a>{!tabsMore?<i className="uf uf-gridcaretarrowup tabs-up"></i>:<i className="uf uf-treearrow-down tabs-up"></i>}<ul className={tabsMore?'tabs-more-list tabs-more-list-show':'tabs-more-list tabs-more-list-hide'}>
                          {
                            moremenu.map(function(item1,index1){
                              return (
                                <li key={item1.id}><a onClick={self.setCurrent.bind(this,item1.id)} href="javascript:;" title={item1.title}>
                                    {item1['title'+locale_serial]}
                                </a></li>
                              )
                            })
                          }
                          </ul></li>:''
                        }
                    </ul>
                    {
                      <div className="tabs-header-show" onClick={self.showHeaderClick.bind(this)}>{!showHeader?<i className="uf uf-gridcaretarrowup"></i>:<i className="uf uf-treearrow-down"></i>}</div>

                    }


                </div>

            </div>

        )
    }
}

export default Tab;
