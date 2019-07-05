import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {Navbar,Menu,Badge,Tile,Icon,Tooltip} from 'tinper-bee';
import mirror, { connect,actions } from 'mirrorx';
import cookie from 'react-cookie';
import {Router} from 'director/build/director';
import classNames from 'classnames';
import { Warning } from '../../utils/index';

import {getCookie} from "utils";
import {ConnectedTopSideBar,ConnectedLeftSideBar,ConnectedTopMoreSideBar,ConnectedMenus} from 'ucf-apps/index/src/container';

import * as api from "ucf-apps/index/src/service";
window.router = new Router();
require('components/viewutil/viewutil');


const Header = Navbar.Header;


class App extends Component {

    constructor(props, context) {
        super(props, context);


        this.delTrigger();
        this.handleClick = this.handleClick.bind(this);
        this.handleDefault = this.handleDefault.bind(this);
        this.sideBarLoadList = this.sideBarLoadList.bind(this);
        this.openTab = this.openTab.bind(this);
        this.changeAhref = this.changeAhref.bind(this);
        window.handleClick = this.handleClick;
        window.sideBarLoadList = this.sideBarLoadList;
    }


    delTrigger(){
        var self = this;
        window.confirmDel = function (data) {
            sessionStorage['tabs'] = JSON.stringify(data.menus);
            sessionStorage['current'] = JSON.stringify({
                current:data.current
            });
            self.setState(data);
        }
    }


    handleDefault(e,isDefault) {
        let {isOpenTab} = this.props;
        isDefault = (isDefault=="_blank")?false:true;
        if(isOpenTab&&isDefault){
            //dom.href = 'javascript:;'
            e.preventDefault();
        }
    }

    handleClick(e,reload) {
        //判断是否点击子菜单,1:当前子菜单，2:2级别子菜单。。。
        let {menus,current,showNotice,intl} = this.props;

        let tar = e.target || e.domEvent.target;
        if (!tar.tagName || tar.tagName !== 'A') {
            tar = tar.closest('a');
        }

        if (!tar.tagName || tar.tagName !== 'A') {
            return false;
        }

        var value = tar.getAttribute('value');


        var data = {
            current: value,
            showNotice:0,
            reload:0
        };

        if(typeof value == 'undefined'||value == null){
            return false;
        }

        if(value=='logout'){
            return false;
        }


        var dom = tar;
        var title = dom.getAttribute('name');
        var router =  dom.getAttribute('href');



        var options = {
            title:title,
            router:router,
            id:value
        };


        var menu = menus;


        //点击已经选中的节点时
        if(value==current){
            var url = location.hash;
            //window.router.dispatch('on', url.replace('#',''));
        }
        else {
            if(typeof dom!="undefined"&&dom.getAttribute('target')=='_blank'){
                return false;
            }
            else {
                var menuObj = JSON.parse(JSON.stringify(menu));


                if(JSON.stringify(menu).indexOf('"id":"'+options.id+'"')==-1&&menu.length!=0) {
                    actions.app.updateState({
                        showNotice:1
                    })
                    // Warning(  intl.formatMessage({id: 'tabs.sidebar.maxnums',defaultMessage:"抱歉，最多展示10个页签！"}));
                    // return false;
                }
                else if(JSON.stringify(menu).indexOf('"id":"'+options.id+'"')!=-1){
                    data = {
                        current: value,
                        showNotice:0,
                        reload:reload?1:0,
                        currentRouter:reload?decodeURIComponent(decodeURIComponent(router.replace('#\/ifr\/',''))):''
                    };
                    actions.app.updateState(data);
                }

            }
        }
        window.createTab(options);
    }

    openTab(e,reload,item){
      let {current,menus} = this.props;
        // 新增方法后续需要重构
        let tar = e.target || e.domEvent.target;
        if (!tar.tagName || tar.tagName !== 'A') {
            tar = tar.closest('a');
        }
        let data = {
            current: value,
            showNotice:0,
            reload:0
        };
        if (!tar.tagName || tar.tagName !== 'A') {
            return false;
        }
        var value = tar.getAttribute('value');
        var dom = tar;
        // var title = dom.getAttribute('name');
        // var router =  dom.getAttribute('href');

        var options = {
            title:item.name,
            title2:item.name2,
            title3:item.name3,
            title4:item.name4,
            title5:item.name5,
            title6:item.name6,
            router:window.formmaterUrl(item),
            id:value
        };
        if(item.urltype=='url'&& item.openview =='newpage') {
        } else {
          window.createTab(options);
        }
        let {sideBarShow} = this.props;
        actions.app.updateState({
          sideBarShow: !sideBarShow
        })

    }



    getTabs () {
        if(!window.sessionStorage){
            alert('This browser does NOT support sessionStorage');
            return false;
        }


        var userId = sessionStorage['userId'];

        if(userId!=undefined&&userId!=cookie.load('_A_P_userId')){
            //sessionStorage.clear();
        }

        sessionStorage['userId'] = cookie.load('_A_P_userId');


        var menus = sessionStorage['tabs']!=undefined?JSON.parse(sessionStorage['tabs']):[];
        var current = sessionStorage['current']!=undefined?JSON.parse(sessionStorage['current']):'';
        if(menus.length ===1) {
          // menus[0].notCreateIframe = false;
        }
        if(menus.length > 1) {
          for (var i = 0; i < menus.length; i++) {
            if(menus[i].id === current.current ) {
                // menus[i].createIframe = true;
            } else{
              menus[i].notCreateIframe = true;
            }
          }
        }
        actions.app.updateState(
            {
                menus:menus,
                tabNum:menus.length,
                current:current.current
            }
        )

        return menus;
    }


    resizeIfr (){
        var self = this;

        let {reload,current,currentRouter} = this.props;


        var ifr = document.getElementById(current);

        //iframe刷新
        if(reload){

            //ifr.contentWindow.location.href = self.state.currentRouter?self.state.currentRouter:ifr.contentWindow.location.href;
            //autodiv.attr('src',currentRouter?currentRouter:ifr.contentWindow.location.href);
            ifr.src = currentRouter?currentRouter:ifr.contentWindow.location.href
        }

        function autoH() {
            var addh = document.body.clientHeight - 82 ;
            ifr.height = addh;
            ifr.style.overflow = "auto"
        }
        if(current){
            autoH();

            window.onresize =function(){
                autoH();
            }
        }
    }

    componentDidUpdate (){
        var self = this;
        self.resizeIfr();
    }

    componentDidMount(){
        var self = this;
        self.resizeIfr();
        self.confirm();
    }

    async sideBarLoadList(){
        var self = this;
        //获取加载的菜单信息
        var menus = await actions.app.loadList();
        // self.setMenu(menus);
        self.getTabs();

        window.menus = menus;
        window.getBreadcrumb = function (id) {
            var n1,n2,n3;

            menus.map(function(item,i) {
                if(id==item.id){
                    n1 = item;
                    return false;
                }
                if(item.children&&item.children.length>0){
                    item.children.map(function (items,t) {
                        if(id==items.id){
                            n2 = items;
                            n1 = item;
                            return false;
                        }

                        if(items.children&&items.children.length>0){
                            items.children.map(function (itemss,tt) {
                                if(id==itemss.id){
                                    n3 = itemss;
                                    n2 = items;
                                    n1 = item;
                                    return false;
                                }
                            })
                        }
                    })
                }
            });

            return (function () {
                var data = [];
                    [n1,n2,n3].map(function(item,i){
                    if(item){
                        data.push(item.name)
                    }
                })

                return data;
            })();
        };
        self.initRouter();
        // this.sideTheme();
        // console.log('123eeee',this.props);
    }

    componentWillMount() {
        this.sideBarLoadList();
    }

    initRouter() {
        var self = this;
        let {menu,menus} = this.props;
        var router = window.router;
        router.init();
        //获取第一个节点数据

        var item = menu[0]?menu[0]:{
            "location" : "pages/default/index.js",
            "name" : "首页",
            "name2" : "Home",
            "name3" : "首頁",
            "name4" : "Home",
            "name5" : "Home",
            "name6" : "Home",
            "menustatus" : "Y",
            "children" : null,
            "icon" : "iconfont icon-C-home",
            "openview" : "curnpage",
            "menuId" : "M0000000000002",
            "urltype" : "plugin",
            "id" : "index",
            "isDefault" : null,
            "licenseControlFlag" : 0,
        };
        if (window.location.hash == ''|| window.location.hash == '#/') {
            let {isOpenTab} = this.props;
            if(isOpenTab){
                if(menus.length==0){
                    //true设定加载第一个tab
                    var options = {
                        title:item.name,
                        title2: item.name2,
                        title3: item.name3,
                        title4: item.name4,
                        title5: item.name5,
                        title6: item.name6,
                        router:window.formmaterUrl(item),
                        id:item.id,
                    };
                    window.createTab(options);
                }
            }
            else {
                //router.dispatch('on', url);
            }
        }
        else {
            router.dispatch('on', window.location.hash.replace('#',''));
        }
    }

    confirm(){
        if(getBrowserVersion().indexOf("IE") !="-1"){
            return false;
        }
        window.unloadNum = 0;
        window.onbeforeunload = function() {
            var tabs = JSON.parse(sessionStorage['tabs'])
            if(tabs.length>1 && unloadNum < 1) {
                window.unloadNum = window.unloadNum + 1;
                setTimeout(()=>{
                    window.unloadNum = 0
                }, 5000)
                console.log('临时log用于解决离开时多次提示的问题----onbeforeunload')
                return '关闭后您打开的页签数据会自动清空'
            }
        };
        window.onunload = function (event) {
            console.log('临时log用于解决离开时多次提示的问题----unload')
            if(event.clientX<=0 && event.clientY<0) {
                sessionStorage.clear();
            }
            else {
                if(location.href.match(/login\/login.html/ig)!=null){
                    sessionStorage.clear();
                }
            }

        }
    }

    changeAhref(target){
        var uri=target.location;
        if(target.urltype === 'url'){
            if(uri&&uri.indexOf('?')!=-1){
                uri+="&modulefrom=sidebar";
            }else{
                uri+="?modulefrom=sidebar"
            }
        }
        return uri;
    }
    collectefunc =(e,itit)=>{
        // e.stopPropagation();
        if(!itit.collected){ //已收藏 取消
            api.wbMenuCollection({"menuId":itit.menuId})

        }else{  //未收藏 收藏
            api.wbMenuUncollection ({"id":itit.menuId})
        }
        let  menu = this.props.menu;
        itit.collected =!itit.collected;
        // if(!index3 && index3!=0){
        //     menu[index1].children[index2].collected =!itit.collected;
        //
        //
        // }else{
        //     menu[index1].children[index2].children[index3].collected =!itit.collected;
        // }
        this.setState({
            menu:menu
        })


    }
    render() {
        let self = this;
        let isLightPortal = GROBAL_PORTAL_ID;
        const {themeObj} = this.props;
        let sideBarOper = {
          changeAhref: self.changeAhref,
          openTab: self.openTab,
          handleDefault: self.handleDefault,
          handleClick: self.handleClick,
          collectefunc: self.collectefunc
        }
        return (
          <div>
          {
            themeObj.sideShowPosition !=='left'?
            // <ConnectedTopSideBar sideBarOper={sideBarOper}/> // 3级菜单顶部浮动导航
            <ConnectedTopMoreSideBar sideBarOper={sideBarOper}/> // 4级菜单顶部浮动导航
            :<ConnectedLeftSideBar sideBarOper={sideBarOper}/> // 3级菜单左侧固定导航
            // :<ConnectedMenus sideBarOper={sideBarOper}/> // 3级菜单左侧抽屉固定导航
          }
          </div>

        )
    }
}

export default App;
