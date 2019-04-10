import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {Navbar,Menu,Badge,Tile,Icon,Tooltip} from 'tinper-bee';
import mirror, { connect,actions } from 'mirrorx';
import cookie from 'react-cookie';
import {Router} from 'director/build/director';
import classNames from 'classnames';
import { Warning } from '../../utils/index';
import Drawer from 'ac-drawer';
import "ac-drawer/dist/ac-drawer.css";
import {getCookie} from "utils";

import * as api from "ucf-apps/index/src/service";
window.router = new Router();
require('components/viewutil/viewutil');


const Header = Navbar.Header;


class App extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            isOpenTab: true,
            clientHeight:document.body.clientHeight,
            arrowUp:true,
            arrowDown:false,
            menuSearch:[],
            sss: [],
            dddd: 1,
            sideSlected: '',
            leftSubShow: false


        };
        this.delTrigger();
        this.showMenu = this.showMenu.bind(this);
        this.handleClick = this.handleClick.bind(this);
        window.handleClick = this.handleClick;
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

    onToggle(value) {
        //this.setState({expanded: value});
        let {expanded,openKeys,curentOpenKeys} = this.props;

        var v = expanded;

        if (v) {
            var keys = openKeys;
            actions.app.updateState({ expanded: !v, openKeys: [], curentOpenKeys: keys });
        } else {
            var _keys = curentOpenKeys;
            actions.app.updateState({ expanded: !v, openKeys: _keys, curentOpenKeys: _keys });
        }

    }
    handleDefault(e,isDefault) {
        isDefault = (isDefault=="_blank")?false:true;
        if(this.state.isOpenTab&&isDefault){
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


                if(menuObj.length==11&&JSON.stringify(menu).indexOf('"id":"'+options.id+'"')==-1&&menu.length!=0) {
                    actions.app.updateState({
                        showNotice:1
                    })
                    Warning(  intl.formatMessage({id: 'tabs.sidebar.maxnums',defaultMessage:"抱歉，最多展示10个页签！"}));
                    return false;
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
        this.createTab(options);
    }

    openTab(e,item){
        // 新增方法后续需要重构
        let tar = e.target || e.domEvent.target;
        if (!tar.tagName || tar.tagName !== 'A') {
            tar = tar.closest('a');
        }

        if (!tar.tagName || tar.tagName !== 'A') {
            return false;
        }
        var value = tar.getAttribute('value');
        var dom = tar;
        // var title = dom.getAttribute('name');
        var router =  dom.getAttribute('href');
        var options = {
            title:item.name,
            title2:item.name2,
            title3:item.name3,
            title4:item.name4,
            title5:item.name5,
            title6:item.name6,
            router:router,
            id:value
        };
        this.createTab(options);
        let {sideBarShow} = this.props;
        actions.app.updateState({
          sideBarShow: !sideBarShow
        })

    }


    createTab (options,value) {

        var self = this;
        var {menus} = this.props;

        if(!window.sessionStorage){
            alert('This browser does NOT support sessionStorage');
            return false;
        }
        var menu = menus;

        //当存在相同id菜单的时候，不创建
        if(JSON.stringify(menu).indexOf('"id":"'+options.id+'"')!=-1&&menu.length!=0){
            return false;
        }

        var menuObj = JSON.parse(JSON.stringify(menu));

        if(menuObj.length==11) {
            return false;
        }

        menuObj[menuObj.length] = options;

        sessionStorage['tabs'] = JSON.stringify(menuObj);

        sessionStorage['current'] = JSON.stringify({
            current:options.id
        });

        actions.app.updateState({
            menus:menuObj,
            tabNum:menuObj.length,
            current:options.id
        });

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

        actions.app.updateState(
            {
                menus:menus,
                tabNum:menus.length,
                current:current.current
            }
        )

        return menus;
    }



    showMenu(e) {

        var state = this.state.userMenu;
        this.setState({"userMenu":!state})
    }

    //IE下 array.find（）方法不可用
    myfilter(arr1,arr2) {
        if(arr2.length == 0 || !arr2) {
            return arr1[0];
        }

        for(var i=0;i<arr1.length;i++)
        {
            if(arr2.indexOf(arr1[i].toString())==-1)
            {
                return arr1[i];
            }
        }
        return false;
    }
    getAncestorKeys(key) {
        const map = {
            sub3: ['sub2']
        };
        return map[key] || [];
    }
    sessionStorage(openKeys){
        if(sessionStorage&&openKeys){
            sessionStorage['openKeys'] = openKeys;
        }
        else {
            return sessionStorage['openKeys'];
        }
    }
    formmaterUrl(item) {
        var uri = " ";
        if (item.urltype === 'url') {
            var target=item.openview=="newpage"?"_blank":"";
            if(target){
                // uri = '#/ifrNoHead/' + encodeURIComponent(encodeURIComponent(item.location));
                uri = item.location;
            }else{
                uri = '#/ifr/' + encodeURIComponent(encodeURIComponent(item.location));
            }
            if(uri.indexOf('?')!=-1){
                uri+="&modulefrom=sidebar";
            }else{
                uri+="?modulefrom=sidebar"
            }
            return  uri;
        } else if (item.urltype === 'plugin') {
            uri = item.id ? ('#/' + item.id) : "#/index_plugin";

            uri = `${GROBAL_HTTP_CTX}/`+encodeURIComponent(encodeURIComponent('index-view.html'+uri));
            if(uri.indexOf('?')!=-1){
                uri+="&modulefrom=sidebar";
            }else{
                uri+="?modulefrom=sidebar"
            }
            return  uri;
        } else if (item.urltype === 'view') {
            uri = item.location;
            uri= uri.replace("#", "/");

            if(uri[0]=='/'){
                uri = "/sidebar"+uri;
            }else{
                uri = "/sidebar/"+uri;
            }
            if(uri.indexOf('?')!=-1){
                uri+="&modulefrom=sidebar";
            }else{
                uri+="?modulefrom=sidebar"
            }
            // window.addRouter(uri);
            // return  "#"+uri;

            return `${GROBAL_HTTP_CTX}/`+'index-view.html#'+uri;
        }else if(item.urltype == undefined){
            item.location = '404';
            return  '#/ifr/' + encodeURIComponent(encodeURIComponent(item.location));
        }
        else {
            return item.location;
        }
    }
    setMenu(response){
        var self = this;

        var url = decodeURIComponent(decodeURIComponent(location.hash));

        var obj = sessionStorage['current']!=undefined?JSON.parse(sessionStorage['current']):'';

        if(obj){
            this.state.current = obj.current;

            return false;
        }

        var data = response.data.data||[];

        data.map(function (item,index) {

            if(Array.isArray(item.children)&&item.children.length>0){

                item.children.map(function(it,index){
                    let selected = url.indexOf(it.location||'null')>=0?it.id:"";
                    if(selected){
                        self.setState({
                            current:selected
                        })
                    }
                    if(it==0){
                        self.setState({
                            firstUrl:item.location
                        })
                    }
                    // it.children.map(function(itit,index2){
                    //     let selected = url.indexOf(itit.location||'null')>=0?itit.id:"";
                    //     if(selected){
                    //         self.setState({
                    //             current:selected
                    //         })
                    //     }
                    //     if(itit==0){
                    //         self.setState({
                    //             firstUrl:it.location
                    //         })
                    //     }
                    // });
                });
            }
            else {

                let selected = url.indexOf(item.location||'null')>=0?item.id:"";
                if(selected){
                    self.setState({
                        current:selected
                    });

                    if(index==0){
                        self.setState({
                            firstUrl:item.location
                        })
                    }
                }
                else {
                    if(index==0){
                        self.setState({
                            firstUrl:item.location,
                            current:item.id
                        })
                    }

                }
            }
        });
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
        self.menubar();
    }

    componentDidMount(){
        var self = this;
        self.resizeIfr();
        self.menubar();
        self.confirm();
    }

    async componentWillMount() {
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

    initRouter() {
        var self = this;
        let {menu,menus} = this.props;
        var router = window.router;
        router.init();
        //获取第一个节点数据
        let locale_serial = getCookie("locale_serial");
        if(locale_serial == 1) {
            locale_serial = "";
        }
        //if(this.state.menu.length==0) return false;

        // this.state.menu[0].children = this.state.menu[0].children==null?[]:this.state.menu[0].children;

        // var item = this.state.menu[0].children!=null&&this.state.menu[0].children.length==0?this.state.menu[0]:this.state.menu[0].children[0];
        // var blank = item.openview=="newpage"?"_blank":"";
        // var oUrl = '',uri = encodeURIComponent(encodeURIComponent(item.location));
        // if(blank){
        //     oUrl = '#/ifrNoHead/' + uri;
        // }else{
        //     oUrl = '#/ifr/' + uri;
        // }
        // var url = oUrl.replace('#','');

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
            "licenseControlFlag" : 0
        };


        if (window.location.hash == ''|| window.location.hash == '#/') {

            if(this.state.isOpenTab){
                if(menus.length==0){
                    //true设定加载第一个tab
                    var options = {
                        title:item.name,
                        title2: item.name2,
                        title3: item.name3,
                        title4: item.name4,
                        title5: item.name5,
                        title6: item.name6,
                        router:self.formmaterUrl(item),
                        id:item.id
                    };
                    self.createTab(options);
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
    onTitleMouseEnter(e,domEvent){

        //var dom = ($(e.domEvent.target).closest('li'));

        var myOffest=function (obj){
            var top=0,left=0;
            if(obj){
                while(obj.offsetParent){
                    top += obj.offsetTop;
                    left += obj.offsetLeft;
                    obj = obj.offsetParent;
                }
            }

            return{
                top : top,
                left : left
            }
        }
        var dom = e.domEvent.target.parentElement;

        var h = document.body.clientHeight;

        this.setState({
            clientHeight:h
        });

        setTimeout(function () {

            // var menu = dom.find('.u-menu');
            // var arrow = dom.find('.arrow-menu');
            var menu = dom.children[0];
            var menu2 = dom.children[1].children[2];
            var arrow = dom.children[1].children[0];


            if(parseInt(myOffest(dom).top)+parseInt(menu.clientHeight)>h){

                if(parseInt(menu.clientHeight)>parseInt(myOffest(dom).top)){

                    menu.style.bottom = -(h-parseInt(myOffest(dom).top)-50-20)+'px';
                    menu.style.top = 'inherit';
                    menu2  &&(menu2.style.maxHeight = (h - parseInt(myOffest(dom).top)) *0.9 +'px');
                    arrow.style.bottom = (h-parseInt(myOffest(dom).top)-50)+15-20 + 'px';
                    arrow.style.top = 'inherit';
                }
                else {
                    menu.style.bottom = 0;
                    menu.style.top = 'inherit';
                    menu2  &&(menu2.style.maxHeight = (h - parseInt(myOffest(dom).top)) *0.9 +'px');
                    arrow.style.bottom = '14px';
                    arrow.style.top = 'inherit';
                }
            }
            else {
                menu.style.bottom = 0;
                menu.style.top = 'inherit';
                menu2  &&(menu2.style.maxHeight = (h - parseInt(myOffest(dom).top)) *0.9 +'px');
                arrow.style.bottom = 'inherit';
                arrow.style.top = '14px';
            }

            // if(parseInt(dom.offset().top)+parseInt(menu.height())>h){
            //
            //     if(parseInt(menu.height())>parseInt(dom.offset().top)){
            //         menu.css({'bottom':-(h-parseInt(dom.offset().top)-50-20),'top':'inherit'});
            //         arrow.css({'bottom':(h-parseInt(dom.offset().top)-50)+15-20,'top':'inherit'});
            //     }
            //     else {
            //         menu.css({'bottom':"0",'top':'inherit'});
            //         arrow.css({'bottom':"14px",'top':'inherit'})
            //     }
            // }
            // else {
            //     menu.css({'bottom':"inherit",'top':'0'});
            //     arrow.css({'bottom':"inherit",'top':'14px'})
            // }
        },0)
    }
    menubar() {
        // var cH = document.body.scrollHeight-60;
        // var sH = this.refs.uMenu.clientHeight;
        // if(sH>cH){
        //     this.refs.moreBar.style.display = 'block'
        // }
    }
    scrollMenu(value,e){

        let {curNum,num} = this.props;

        var h  = document.body.clientHeight-60;
        var showNum = parseInt(h/50);

        curNum =  curNum+value;

        if(curNum<0){
            curNum = 0;
            this.setState({
               arrowUp:true
            })
            return false;
        }
        //fix: add 1 fake element
        else if(curNum>num-showNum) {
            curNum=num-showNum;
            this.setState({
                arrowDown:true
            })
            return false;
        }
        else {
            this.setState({
                arrowDown:false,
                arrowUp:false
            })
        }

        actions.app.updateState({
            curNum:curNum
        })
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
                debugger;
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
    clickFun(e, item,list, index){
        this.setState({
            sss: list,
            dddd: index,
            sideSlected: item.menuId,

        })
    }
    leftMouseEnter(e,item,list, index) {
    //   debugger;
        this.setState({
            sss: list,
            dddd: index,
            leftSubShow: true
        })
    }
    leftMouseLeave(e,item,list, index) {
        this.setState({
            leftSubShow: false
        })
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
    searchChange=(e,index)=>{
        let menuSearch = this.state.menuSearch;
        menuSearch[index] =e.target.value;
        this.setState({
            menuSearch:menuSearch
        })
    }
    collectefunc =(e,itit,index1,index2,index3)=>{
        e.stopPropagation();
        if(!itit.collected){ //已收藏 取消
            api.wbMenuCollection({"menuId":itit.menuId})

        }else{  //未收藏 收藏
            api.wbMenuUncollection ({"id":itit.menuId})

        }
        let  menu = this.props.menu;
        if(!index3 && index3!=0){
            menu[index1].children[index2].collected =!itit.collected;


        }else{
            menu[index1].children[index2].children[index3].collected =!itit.collected;
        }
        this.setState({
            menu:menu
        })


    }
    barLeftClick = () => {
      let {leftExpanded} = this.props;
      actions.app.updateState({
        leftExpanded: !leftExpanded
      })
    }
    // sideTheme = () => {
    //   let {themeObj} = this.props;
    //   let defaultBgImg = '';
    //   if(!themeObj.leftSideBgImg && !themeObj.leftSideBgColor) {
    //     defaultBgImg = 'images/index/dark_bg_img.jpg';
    //   }
    //   if(themeObj.leftSideTheme === 'dark') {
    //     let obj = {
    //       leftSideTheme: themeObj.leftSideTheme? themeObj.leftSideTheme :'dark',
    //       leftSideBgImg: themeObj.leftSideBgImg? themeObj.leftSideBgImg : defaultBgImg,
    //       leftSideBgColor: themeObj.leftSideBgColor? themeObj.leftSideBgColor : 'red',
    //     }
    //     actions.app.updateState({
    //       themeObj:Object.assign(themeObj,obj)
    //     })
    //   }
    //   if(themeObj.leftSideTheme === 'light') {
    //     let obj = {
    //       leftSideTheme: themeObj.leftSideTheme? themeObj.leftSideTheme :'light',
    //       leftSideBgImg: themeObj.leftSideBgImg? themeObj.leftSideBgImg : defaultBgImg,
    //       leftSideBgColor: themeObj.leftSideBgColor? themeObj.leftSideBgColor : 'red',
    //     }
    //     actions.app.updateState({
    //       themeObj:Object.assign(themeObj,obj)
    //     })
    //   }
    //
    // }
    render() {
        var self = this;
        const {expanded,menu,submenuSelected,curNum,current,intl,sideBarShow,themeObj,leftExpanded} = this.props;
        var isSeleted = submenuSelected;
        var menuSearch  = this.state.menuSearch;
        const sss = self.state.sss;
        const dddd = self.state.dddd;
        const sideSlected = self.state.sideSlected;
        const leftSubShow = self.state.leftSubShow;
        let locale_serial = getCookie("locale_serial");
        if(locale_serial == 1) {
            locale_serial = "";
        }
        return (
          <div>
          {
            themeObj.sideShowPosition !=='left'?
            <Drawer className={'demo2'} hasHeader={false} show={sideBarShow} placement="left">
                <div className="left-side-bar">
                <div className="left-side-bar-menu">
                    {
                        menu.map(function (item,index1) {
                            let blank = item.openview=="newpage"&&item.urltype=='url'?"_blank":"";
                            var noSecond = 'only-second-menu';
                            var curHeight = 0;
                            var curHeight2 =0;
                            var sercurHeight = 0;
                            var sercurHeight2 =0;
                            if(Array.isArray(item.children)&&item.children.length>0){
                                let list = [];
                                var menulist = [[],[]];
                                var searchmenuList = [[],[]];
                                var pages = 0;

                                let title = (<a href="javascript:;" data-ahref={self.changeAhref(item)}  key={item.id} className={index1===dddd?'sidebar-select-active first-child':'first-child'} name={item['name'+locale_serial]} data-licenseControlFlag ={item.licenseControlFlag} data-areaId ={item.areaId}><i className={'icon '+item.icon}></i><span className={index1===dddd?'sidebar-active':''}><label className="uf uf-triangle-left"></label>{item['name'+locale_serial]}</span></a>);
                                item.children.map(function(it,index2){

                                    let blank =it.openview=="newpage"&&it.urltype=='url'?"_blank":"";
                                    if(Array.isArray(it.children)&&it.children.length>0){
                                        let list2 = [];
                                        let searchlist =[];
                                        let title = (<a href="javascript:;" data-ahref={self.changeAhref(it)} key={it.id} className="child-title" data-areaId={it.areaId} data-licenseControlFlag={it.licenseControlFlag}><i className={'icon-child'}></i><span title={it['name'+locale_serial]}>{it['name'+locale_serial]}</span></a>);
                                        noSecond = 'no-second-menu';
                                        it.children.map(function(itit,index3){
                                            let blank =itit.openview=="newpage"&&itit.urltype=='url'?"_blank":"";

                                            let html = <li key={itit.menuId+"m"}><a target={blank} value={itit.id}
                                                              data-areaId={itit.areaId}
                                                              title={itit['name'+locale_serial]}
                                                              data-ahref={self.changeAhref(itit)}
                                                              data-licenseControlFlag={itit.licenseControlFlag}
                                                              onClick={(e) => {self.handleDefault(e, blank);self.openTab(e)}}
                                                              ref={itit.id} name={itit['name'+locale_serial]}
                                                              href={self.formmaterUrl(itit)}>{itit['name'+locale_serial]}</a><i className={ itit.collected?"shoucanged iconfont icon-star":"shoucang iconfont icon-star1" }
                                                                                                               onClick={(e) =>{e.preventDefault();self.collectefunc(e,itit,index1,index2,index3)} }
                                                                                                               data-menuId={itit.menuId} title={'收藏'}></i></li>
                                            list2.push(html)
                                            if( itit.name.indexOf(menuSearch[index1])>=0) {

                                                let html = <li key={itit.menuId+"s"} ><a target={blank} value={itit.id}
                                                                  data-areaId={itit.areaId}
                                                                  title={itit['name'+locale_serial]}
                                                                  data-ahref={self.changeAhref(itit)}
                                                                  data-licenseControlFlag={itit.licenseControlFlag}
                                                                  onClick={(e) => {self.handleDefault(e, blank);self.openTab(e)}}
                                                                  ref={itit.id} name={itit['name'+locale_serial]}
                                                                  href={self.formmaterUrl(itit)}>{itit['name'+locale_serial]}</a><i className={ itit.collected?"shoucanged iconfont icon-star":"shoucang iconfont icon-star1" }
                                                                                                                   onClick={(e) =>{e.preventDefault();self.collectefunc(e,itit,index1,index2,index3)} }
                                                                                                                   data-menuId={itit.menuId} title={'收藏'}></i></li>

                                                searchlist.push(html)
                                            }


                                        });
                                        if( list2.length>0) {
                                            var  cellH = Math.ceil(it.children.length/3)*25+52;
                                            var html = <div className={'menu-popup'}>
                                                {title}
                                                <div className="third-menu-content">
                                                    <ul className="third-menu-list">
                                                        {list2}
                                                    </ul>
                                                </div>
                                            </div>;
                                            if(curHeight <= curHeight2){
                                                curHeight += cellH;
                                                menulist[0].push (html)
                                            }else{
                                                curHeight2 += cellH;
                                                menulist[1].push (html)
                                            }
                                        }
                                        if( searchlist.length>0) {
                                            var  cellH = Math.ceil(searchlist.length/3)*25+52;
                                            var html = <div className={'menu-popup'}>
                                                {title}
                                                <div className="third-menu-content">
                                                    <ul className="third-menu-list">
                                                        {searchlist}
                                                    </ul>
                                                </div>
                                            </div>;
                                            if(sercurHeight <= sercurHeight2){
                                                sercurHeight += cellH;
                                                searchmenuList[0].push (html)
                                            }else{
                                                sercurHeight2 += cellH;
                                                searchmenuList[1].push (html)
                                            }
                                        }

                                        // }
                                    } else {
                                        // curHeight = 46+ curHeight;
                                        let title = (<a target={blank} value={it.id} data-areaId={it.areaId} data-ahref={self.changeAhref(it)} data-licenseControlFlag={it.licenseControlFlag} onClick={(e)=>self.handleDefault(e,blank)} href={self.formmaterUrl(it)}><i className={'icon '+it.icon}></i><span>{it['name'+locale_serial]}</span></a>);


                                        var  cellH = 46;
                                        let  html = <div className={'menu-popup'}>
                                            <a target={blank} value={it.id} data-areaId ={it.areaId} data-ahref ={self.changeAhref(it)} data-licenseControlFlag={it.licenseControlFlag} onClick={(e)=>{self.handleDefault(e,blank);self.openTab(e)}} ref={it.id} name={it['name'+locale_serial]} href={self.formmaterUrl(it)}>{it['name'+locale_serial]}<i className={ it.collected?"shoucanged iconfont icon-star":"shoucang iconfont icon-star1" }
                                                                                                                                                                                                                                                                                                       onClick={(e) =>{e.preventDefault();self.collectefunc(e,it,index1,index2)} }
                                                                                                                                                                                                                                                                                                       data-menuId={it.menuId} title={'收藏'}></i></a>
                                        </div>
                                        if(curHeight <= curHeight2){
                                            curHeight += cellH;
                                            menulist[0].push(html)
                                        }else{
                                            curHeight2 += cellH;
                                            menulist[1].push(html)
                                        }
                                        if( it.name.indexOf(menuSearch[index1])>=0) {
                                            if(sercurHeight <= sercurHeight2){
                                                sercurHeight += cellH;
                                                searchmenuList[0].push (html)
                                            }else{
                                                sercurHeight2 += cellH;
                                                searchmenuList[1].push (html)
                                            }
                                        }


                                    }

                                });


                                var selected = item.id == isSeleted?"u-menu-submenus-selected":"";
                                var showsearch = curHeight > document.body.clientHeight*0.8 || curHeight2 > document.body.clientHeight*0.8;

                                return (
                                    /* 此处要考虑原有的submenu的逻辑 */
                                    <div onClick={(e)=>self.clickFun(e,item,menulist,index1)} className="side-bar-first">
                                        {title}
                                    </div>
                                )
                            }
                            else {
                                let blank =item.openview=="newpage"&&item.urltype=='url' ?"_blank":"";

                                if(item.id == 'index'){
                                    return false;
                                }

                                let title = (
                                    <a target={blank} key={item.id} value={item.id} className="first-child" data-areaId={item.areaId} data-ahref={self.changeAhref(item)} data-licenseControlFlag ={item.licenseControlFlag} onClick={(e)=>{self.handleDefault(e,blank);self.openTab(e)}} ref={item.id} href={self.formmaterUrl(item)} name={item['name'+locale_serial]}><i className={'icon '+item.icon}></i><span ><label className="uf uf-triangle-left"></label>{item['name'+locale_serial]}</span></a>
                                );
                                return (
                                    <div onClick={(e)=>self.openTab(e)} className="side-bar-first">
                                        {title}
                                    </div>
                                )
                            }
                        })
                    }
                </div>
                <div className="sidebar-content-sub">
                        {
                            menu.map(function (item,index1) {
                                if(index1 === dddd){
                                    let blank = item.openview=="newpage"&&item.urltype=='url'?"_blank":"";
                                var noSecond = 'only-second-menu';
                                var curHeight = 0;
                                var curHeight2 =0;
                                var sercurHeight = 0;
                                var sercurHeight2 =0;
                                if(Array.isArray(item.children)&&item.children.length>0){
                                    let list = [];
                                    var menulist = [[],[]];
                                    var searchmenuList = [[],[]];
                                    var pages = 0;

                                    let title = (<a href="javascript:;" data-ahref={self.changeAhref(item)}  key={item.id} className="first-child" name={item['name'+locale_serial]} data-licenseControlFlag ={item.licenseControlFlag} data-areaId ={item.areaId}><i className={'icon '+item.icon}></i><span className={item.menuId===item.menuId?'sidebar-active':''}><label className="uf uf-triangle-left"></label>{item['name'+locale_serial]}</span></a>);
                                    item.children.map(function(it,index2){

                                        let blank =it.openview=="newpage"&&it.urltype=='url'?"_blank":"";
                                        if(Array.isArray(it.children)&&it.children.length>0){
                                            let list2 = [];
                                            let searchlist =[];
                                            let title = (<a href="javascript:;" data-ahref={self.changeAhref(it)} key={it.id} className="child-title" data-areaId={it.areaId} data-licenseControlFlag={it.licenseControlFlag}><i className={'icon-child'}></i><span title={it['name'+locale_serial]}>{it['name'+locale_serial]}</span></a>);
                                            noSecond = 'no-second-menu';
                                            it.children.map(function(itit,index3){
                                                let blank =itit.openview=="newpage"&&itit.urltype=='url'?"_blank":"";

                                                let html = <li key={itit.menuId+"m"}><a target={blank} value={itit.id}
                                                                  data-areaId={itit.areaId}
                                                                  title={itit['name'+locale_serial]}
                                                                  data-ahref={self.changeAhref(itit)}
                                                                  data-licenseControlFlag={itit.licenseControlFlag}
                                                                  onClick={(e) => {self.handleDefault(e, blank);self.openTab(e,itit)}}
                                                                  ref={itit.id} name={itit['name'+locale_serial]}
                                                                  href={self.formmaterUrl(itit)}>{itit['name'+locale_serial]}</a><i className={ itit.collected?"shoucanged iconfont icon-star":"shoucang iconfont icon-star1" }
                                                                                                                   onClick={(e) =>{e.preventDefault();self.collectefunc(e,itit,index1,index2,index3)} }
                                                                                                                   data-menuId={itit.menuId} title={'收藏'}></i></li>
                                                list2.push(html)
                                                if( itit.name.indexOf(menuSearch[index1])>=0) {

                                                    let html = <li key={itit.menuId+"s"} ><a target={blank} value={itit.id}
                                                                      data-areaId={itit.areaId}
                                                                      title={itit['name'+locale_serial]}
                                                                      data-ahref={self.changeAhref(itit)}
                                                                      data-licenseControlFlag={itit.licenseControlFlag}
                                                                      onClick={(e) => {self.handleDefault(e, blank);self.openTab(e,itit)}}
                                                                      ref={itit.id} name={itit['name'+locale_serial]}
                                                                      href={self.formmaterUrl(itit)}>{itit.name}</a><i className={ itit.collected?"shoucanged iconfont icon-star":"shoucang iconfont icon-star1" }
                                                                                                                       onClick={(e) =>{e.preventDefault();self.collectefunc(e,itit,index1,index2,index3)} }
                                                                                                                       data-menuId={itit.menuId} title={'收藏'}></i></li>

                                                    searchlist.push(html)
                                                }


                                            });
                                            if( list2.length>0) {
                                                var  cellH = Math.ceil(it.children.length/3)*25+52;
                                                var html = <div className={'menu-popup'}>
                                                    {title}
                                                    <div className="third-menu-content">
                                                        <ul className="third-menu-list">
                                                            {list2}
                                                        </ul>
                                                    </div>
                                                </div>;
                                                if(curHeight <= curHeight2){
                                                    curHeight += cellH;
                                                    menulist[0].push (html)
                                                }else{
                                                    curHeight2 += cellH;
                                                    menulist[1].push (html)
                                                }
                                            }
                                            if( searchlist.length>0) {
                                                var  cellH = Math.ceil(searchlist.length/3)*25+52;
                                                var html = <div className={'menu-popup'}>
                                                    {title}
                                                    <div className="third-menu-content">
                                                        <ul className="third-menu-list">
                                                            {searchlist}
                                                        </ul>
                                                    </div>
                                                </div>;
                                                if(sercurHeight <= sercurHeight2){
                                                    sercurHeight += cellH;
                                                    searchmenuList[0].push (html)
                                                }else{
                                                    sercurHeight2 += cellH;
                                                    searchmenuList[1].push (html)
                                                }
                                            }

                                            // }
                                        } else {
                                            // curHeight = 46+ curHeight;
                                            let title = (<a target={blank} value={it.id} data-areaId={it.areaId} data-ahref={self.changeAhref(it)} data-licenseControlFlag={it.licenseControlFlag} onClick={(e)=>self.handleDefault(e,blank)} href={self.formmaterUrl(it)}><i className={'icon '+it.icon}></i><span>{it['name'+locale_serial]}</span></a>);


                                            var  cellH = 46;
                                            let  html = <div className={'menu-popup'}>
                                                <a target={blank} value={it.id} data-areaId ={it.areaId} data-ahref ={self.changeAhref(it)} data-licenseControlFlag={it.licenseControlFlag} onClick={(e)=>{self.handleDefault(e,blank);self.openTab(e,it)}} ref={it.id} name={it['name'+locale_serial]} href={self.formmaterUrl(it)}>{it['name'+locale_serial]}<i className={ it.collected?"shoucanged iconfont icon-star":"shoucang iconfont icon-star1" }
                                                                                                                                                                                                                                                                                                           onClick={(e) =>{e.preventDefault();self.collectefunc(e,it,index1,index2)} }
                                                                                                                                                                                                                                                                                                           data-menuId={it.menuId} title={'收藏'}></i></a>
                                            </div>
                                            if(curHeight <= curHeight2){
                                                curHeight += cellH;
                                                menulist[0].push(html)
                                            }else{
                                                curHeight2 += cellH;
                                                menulist[1].push(html)
                                            }
                                            if( it.name.indexOf(menuSearch[index1])>=0) {
                                                if(sercurHeight <= sercurHeight2){
                                                    sercurHeight += cellH;
                                                    searchmenuList[0].push (html)
                                                }else{
                                                    sercurHeight2 += cellH;
                                                    searchmenuList[1].push (html)
                                                }
                                            }


                                        }

                                    });


                                    var selected = item.id == isSeleted?"u-menu-submenus-selected":"";
                                    var showsearch = curHeight > document.body.clientHeight*0.8 || curHeight2 > document.body.clientHeight*0.8;

                                   return  menulist.map(function(ite,i){
                                        ite = ite.length!=0?<div className="sidebar-content-sub-menu-list" >{ite}</div>:ite;
                                        return (
                                            ite
                                        )
                                    })

                                }
                                }


                            })
                        }
                </div>
                </div>
                </Drawer>
            :<div className="left-side-bar sidebar-left">
            <div className={leftExpanded?"left-side-bar-header left-side-bar-header-expanded ":"left-side-bar-header"} onClick={()=> this.barLeftClick()} style={{backgroundColor:themeObj.leftSideBgColor,backgroundImage: `url(${themeObj.leftSideBgImg})`}}>
            { themeObj.leftSideTheme === 'light'?
              <img src={require(`static/images/hanbao-dark.svg`)}/>
              : <img src={require(`static/images/hanbao-light.svg`)}/>
            }
            </div>
            <div className={!leftExpanded?"left-side-bar-menu":"left-side-bar-menu left-side-bar-menu-expand"}>
                {
                    menu.map(function (item,index1) {
                        let blank = item.openview=="newpage"&&item.urltype=='url'?"_blank":"";
                        var noSecond = 'only-second-menu';
                        var curHeight = 0;
                        var curHeight2 =0;
                        var sercurHeight = 0;
                        var sercurHeight2 =0;
                        if(Array.isArray(item.children)&&item.children.length>0){
                            let list = [];
                            var menulist = [[],[]];
                            var searchmenuList = [[],[]];
                            var pages = 0;

                            let title = (<a href="javascript:;" data-ahref={self.changeAhref(item)}  key={item.id} className="first-child" name={item['name'+locale_serial]} data-licenseControlFlag ={item.licenseControlFlag} data-areaId ={item.areaId}><i className={'icon '+item.icon}></i><span className={index1===dddd?'left-sidebar-active':''}><label className="uf uf-triangle-left"></label>{item['name'+locale_serial]}</span></a>);
                            item.children.map(function(it,index2){

                                let blank =it.openview=="newpage"&&it.urltype=='url'?"_blank":"";
                                if(Array.isArray(it.children)&&it.children.length>0){
                                    let list2 = [];
                                    let searchlist =[];
                                    let title = (<a href="javascript:;" data-ahref={self.changeAhref(it)} key={it.id} className="child-title" data-areaId={it.areaId} data-licenseControlFlag={it.licenseControlFlag}><i className={'icon-child'}></i><span title={it['name'+locale_serial]}>{it['name'+locale_serial]}</span></a>);
                                    noSecond = 'no-second-menu';
                                    it.children.map(function(itit,index3){
                                        let blank =itit.openview=="newpage"&&itit.urltype=='url'?"_blank":"";

                                        let html = <li key={itit.menuId+"m"}><a target={blank} value={itit.id}
                                                          data-areaId={itit.areaId}
                                                          title={itit['name'+locale_serial]}
                                                          data-ahref={self.changeAhref(itit)}
                                                          data-licenseControlFlag={itit.licenseControlFlag}
                                                          onClick={(e) => {self.handleDefault(e, blank);self.openTab(e,itit)}}
                                                          ref={itit.id} name={itit['name'+locale_serial]}
                                                          href={self.formmaterUrl(itit)}>{itit['name'+locale_serial]}</a><i className={ itit.collected?"shoucanged iconfont icon-star":"shoucang iconfont icon-star1" }
                                                                                                           onClick={(e) =>{e.preventDefault();self.collectefunc(e,itit,index1,index2,index3)} }
                                                                                                           data-menuId={itit.menuId} title={'收藏'}></i></li>
                                        list2.push(html)
                                        if( itit.name.indexOf(menuSearch[index1])>=0) {

                                            let html = <li key={itit.menuId+"s"} ><a target={blank} value={itit.id}
                                                              data-areaId={itit.areaId}
                                                              title={itit['name'+locale_serial]}
                                                              data-ahref={self.changeAhref(itit)}
                                                              data-licenseControlFlag={itit.licenseControlFlag}
                                                              onClick={(e) => {self.handleDefault(e, blank);self.openTab(e,itit)}}
                                                              ref={itit.id} name={itit['name'+locale_serial]}
                                                              href={self.formmaterUrl(itit)}>{itit.name}</a><i className={ itit.collected?"shoucanged iconfont icon-star":"shoucang iconfont icon-star1" }
                                                                                                               onClick={(e) =>{e.preventDefault();self.collectefunc(e,itit,index1,index2,index3)} }
                                                                                                               data-menuId={itit.menuId} title={'收藏'}></i></li>

                                            searchlist.push(html)
                                        }


                                    });
                                    if( list2.length>0) {
                                        var  cellH = Math.ceil(it.children.length/3)*25+52;
                                        var html = <div className={'menu-popup'}>
                                            {title}
                                            <div className="third-menu-content">
                                                <ul className="third-menu-list">
                                                    {list2}
                                                </ul>
                                            </div>
                                        </div>;
                                        if(curHeight <= curHeight2){
                                            curHeight += cellH;
                                            menulist[0].push (html)
                                        }else{
                                            curHeight2 += cellH;
                                            menulist[1].push (html)
                                        }
                                    }
                                    if( searchlist.length>0) {
                                        var  cellH = Math.ceil(searchlist.length/3)*25+52;
                                        var html = <div className={'menu-popup'}>
                                            {title}
                                            <div className="third-menu-content">
                                                <ul className="third-menu-list">
                                                    {searchlist}
                                                </ul>
                                            </div>
                                        </div>;
                                        if(sercurHeight <= sercurHeight2){
                                            sercurHeight += cellH;
                                            searchmenuList[0].push (html)
                                        }else{
                                            sercurHeight2 += cellH;
                                            searchmenuList[1].push (html)
                                        }
                                    }

                                    // }
                                } else {
                                    // curHeight = 46+ curHeight;
                                    let title = (<a target={blank} value={it.id} data-areaId={it.areaId} data-ahref={self.changeAhref(it)} data-licenseControlFlag={it.licenseControlFlag} onClick={(e)=>self.handleDefault(e,blank)} href={self.formmaterUrl(it)}><i className={'icon '+it.icon}></i><span>{it['name'+locale_serial]}</span></a>);


                                    var  cellH = 46;
                                    let  html = <div className={'menu-popup'}>
                                        <a target={blank} value={it.id} data-areaId ={it.areaId} data-ahref ={self.changeAhref(it)} data-licenseControlFlag={it.licenseControlFlag} onClick={(e)=>{self.handleDefault(e,blank);self.openTab(e,it)}} ref={it.id} name={it['name'+locale_serial]} href={self.formmaterUrl(it)}>{it.name}<i className={ it.collected?"shoucanged iconfont icon-star":"shoucang iconfont icon-star1" }
                                                                                                                                                                                                                                                                                                   onClick={(e) =>{e.preventDefault();self.collectefunc(e,it,index1,index2)} }
                                                                                                                                                                                                                                                                                                   data-menuId={it.menuId} title={'收藏'}></i></a>
                                    </div>
                                    if(curHeight <= curHeight2){
                                        curHeight += cellH;
                                        menulist[0].push(html)
                                    }else{
                                        curHeight2 += cellH;
                                        menulist[1].push(html)
                                    }
                                    if( it.name.indexOf(menuSearch[index1])>=0) {
                                        if(sercurHeight <= sercurHeight2){
                                            sercurHeight += cellH;
                                            searchmenuList[0].push (html)
                                        }else{
                                            sercurHeight2 += cellH;
                                            searchmenuList[1].push (html)
                                        }
                                    }


                                }

                            });


                            var selected = item.id == isSeleted?"u-menu-submenus-selected":"";
                            var showsearch = curHeight > document.body.clientHeight*0.8 || curHeight2 > document.body.clientHeight*0.8;

                            return (
                                /* 此处要考虑原有的submenu的逻辑 */
                                <div onMouseEnter={(e)=>self.leftMouseEnter(e,item,menulist,index1)} onMouseLeave={(e)=>{self.leftMouseLeave(e,item,menulist,index1)}} className="side-bar-first">
                                    {title}
                                    <div className={leftSubShow && index1===dddd?"sidebar-content-sub sidebar-content-sub-show ":'sidebar-content-sub sidebar-content-sub-hide'}>
                                            {menulist.map(function(ite,i){
                                                   ite = ite.length!=0?<div className="sidebar-content-sub-menu-list" >{ite}</div>:ite;
                                                   return (
                                                       ite
                                                   )
                                               })}
                                    </div>
                                </div>
                            )
                        }
                        else {
                            let blank =item.openview=="newpage"&&item.urltype=='url' ?"_blank":"";

                            if(item.id == 'index'){
                                return false;
                            }

                            let title = (
                                <a target={blank} key={item.id} value={item.id} className="first-child" data-areaId={item.areaId} data-ahref={self.changeAhref(item)} data-licenseControlFlag ={item.licenseControlFlag} onClick={(e)=>{self.handleDefault(e,blank);self.openTab(e,item)}} ref={item.id} href={self.formmaterUrl(item)} name={item['name'+locale_serial]}><i className={'icon '+item.icon}></i><span className={item.menuId===item.menuId?'left-sidebar-active':''}><label className="uf uf-triangle-left"></label>{item['name'+locale_serial]}</span></a>
                            );
                            return (
                                <div onClick={(e)=>self.openTab(e,item)} className="side-bar-first">
                                    {title}
                                </div>
                            )
                        }
                    })
                }

            </div>


            </div>
          }
          </div>
            // <div className={ sideBarShow? 'side-bar-show left-side-bar':'side-bar-hide left-side-bar'}>

            // </div>
        )
    }
}

export default App;
