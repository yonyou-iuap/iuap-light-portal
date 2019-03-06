import React,{Component} from 'react';
import {Navbar,Menu,Badge,Tile,Icon,Tooltip} from 'tinper-bee';
import 'static/css/index.css';

/* 引入字体文件 */
require('static/fonts/iuap_qy/iconfont.css');
require('static/fonts/pap/iconfont.css');
require('static/fonts/moren/iconfont.css');


import cookie from 'react-cookie';
import Tab from '../Tabs/Tabs';
require('../Tabs/Tabs.css');
import UserMenus from '../UserMenu/UserMenu';

import {Router} from 'director/build/director';

window.router = new Router();

// require('es6-promise').polyfill();


require('../viewutil/viewutil');


//require('../trd/bootstrap/js/bootstrap.min');

//require('../components/interactor.js');




// var Tabs = require('../js/ext/tabs');
// var tabs = new Tabs();


import axios from 'axios';




const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.MenuItemGroup;
const MenuToggle = Menu.MenuToggle;
const SideContainer = Menu.SideContainer;



const Header = Navbar.Header;
const NavItem = Navbar.NavItem;
const Brand = Navbar.Brand;
const Collapse = Navbar.Collapse;
const Toggle = Navbar.Toggle;
const Nav = Navbar.Nav;




class App extends Component {

    constructor(props, context) {
        super(props, context);

        var menus = this.getTabs();

        var self = this;

        this.state = {
            current: '',
            openKeys: [],
            currentRouter:'',
            menu: [],
            expanded: false,
            firstUrl: '',
            curentOpenKeys: [],
            submenuSelected: '',
            isOpenTab: window.isOpenTab,
            menus:menus,
            tabNum:menus.length,
            showNotice:0,
            curNum:0,
            num:0,
            clientHeight:document.body.clientHeight,
            reload:0
        };

        this.delTrigger();

        this.showMenu = this.showMenu.bind(this);
        this.setCurrent = this.setCurrent.bind(this);
        this.del = this.del.bind(this);
        this.handleClick = this.handleClick.bind(this);
        window.handleClick = this.handleClick;
    }


    delTrigger(){
        var self = this;
        $('body').on('del',function(e,data){

            sessionStorage['tabs'] = JSON.stringify(data.menus);

            sessionStorage['current'] = JSON.stringify({
                current:data.current
            });

            self.setState(data);

        });
        window.confirmDel = function (data) {
            $('body').trigger('del',[data]);
        }
    }

    onToggle(value) {
        //this.setState({expanded: value});

        var v = this.state.expanded;

        if (v) {
            var keys = this.state.openKeys;
            this.setState({ expanded: !v, openKeys: [], curentOpenKeys: keys });
        } else {
            var _keys = this.state.curentOpenKeys;
            this.setState({ expanded: !v, openKeys: _keys, curentOpenKeys: _keys });
        }
        // if (value) {
        //     var keys = this.state.openKeys;
        //     this.setState({ expanded: value, openKeys: [], curentOpenKeys: keys });
        // } else {
        //     var _keys = this.state.curentOpenKeys;
        //     this.setState({ expanded: value, openKeys: _keys, curentOpenKeys: _keys });
        // }
    }
    handleDefault(e,isDefault) {
        isDefault = (isDefault=="_blank")?false:true;
        if(window.isOpenTab&&isDefault){
            //dom.href = 'javascript:;'
            e.preventDefault();

        }
    }

    handleClick(e,reload) {
        //判断是否点击子菜单,1:当前子菜单，2:2级别子菜单。。。


        var self = this;

        // var data  = (e.keyPath.length==1)?{
        //     current: e.key,
        //     openKeys: [],
        //     submenuSelected:'',
        //     curentOpenKeys:[],
        //     userMenu:false
        // }:{
        //     current: e.key
        // };


        var tar = e.target||e.domEvent.target;

        var target = $(tar).closest('a');



        if(!target.is('a')){
            return false;
        }
        var value = target.attr('value');


        var data = {
            current: value,
            showNotice:0,
            reload:0
        };

        if(typeof value == 'undefined'){
            return false;
        }

        if(value=='logout'){
            return false;
        }


        var dom = target;
        var title = dom.attr('name');
        var router =  dom.attr('href');



        var options = {
            title:title,
            router:router,
            id:value
        };


        var menu = this.state.menus;




        //点击已经选中的节点时
        if(value==this.state.current){
            var url = location.hash;
            //window.router.dispatch('on', url.replace('#',''));
        }
        else {
            if(typeof dom!="undefined"&&dom.attr('target')=='_blank'){
                return false;
            }
            else {
                var menuObj = JSON.parse(JSON.stringify(menu));


                if(menuObj.length==11&&JSON.stringify(menu).indexOf('"id":"'+options.id+'"')==-1&&menu.length!=0) {
                    self.setState({
                        showNotice:1
                    });
                    return false;
                }
                else if(JSON.stringify(menu).indexOf('"id":"'+options.id+'"')!=-1){
                    data = {
                        current: value,
                        showNotice:0,
                        reload:reload?1:0,
                        currentRouter:reload?decodeURIComponent(decodeURIComponent(router.replace('#\/ifr\/',''))):''
                    };
                }
                this.setState(data);
            }
        }

        this.createTab(options);

    }

    createTab (options,value) {


        var self = this;

        if(!window.sessionStorage){
            alert('This browser does NOT support sessionStorage');
            return false;
        }



        var menu = this.state.menus;




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

        this.setState({
            menus:menuObj,
            current:options.id
        });


    }
    getTabs () {

        if(!window.sessionStorage){
            alert('This browser does NOT support sessionStorage');
            return false;
        }

        // var tabs = [];
        // for (var i =0;i<sessionStorage['tabs'].length;i++){
        //     var key = sessionStorage.key(i);
        //     var obj = JSON.parse(sessionStorage[key]);
        //     tabs.push(obj);
        // }

        var userId = sessionStorage['userId'];

        if(userId!=undefined&&userId!=cookie.load('_A_P_userId')){
            //sessionStorage.clear();
        }

        sessionStorage['userId'] = cookie.load('_A_P_userId');


        var menus = sessionStorage['tabs']!=undefined?JSON.parse(sessionStorage['tabs']):[];

        return menus;
    }

    setCurrent(value) {
        var self = this;

        this.setState({
            current: value,
            showNotice:0,
            reload:0
        });

        sessionStorage['current'] = JSON.stringify({
            current:value
        });

    }

    del (data) {

        sessionStorage['tabs'] = JSON.stringify(data.menus);

        sessionStorage['current'] = JSON.stringify({
            current:data.current
        });


        this.setState(data);

    }


    showMenu(e) {
        var state = this.state.userMenu;
        this.setState({"userMenu":!state})
    }
    onOpenChange(openKeys) {

        const state = this.state;

        const latestOpenKey = this.myfilter(openKeys,state.openKeys);
        const latestCloseKey = this.myfilter(state.openKeys,openKeys);

        /*   const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
         const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));*/

        let nextOpenKeys = [];

        if (latestOpenKey) {
            nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
        }
        if (latestCloseKey) {
            nextOpenKeys = this.getAncestorKeys(latestCloseKey);
        }


        this.setState({current:openKeys,submenuSelected:openKeys,openKeys: openKeys,expanded:false});
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
            return  uri;
        } else if (item.urltype === 'plugin') {
            uri = item.id ? ('#/' + item.id) : "#/index_plugin";

            uri = `${GROBAL_HTTP_CTX}/`+encodeURIComponent(encodeURIComponent('index-view.html'+uri));
            return  uri;
        } else if (item.urltype === 'view') {
            uri = item.location;
            uri= uri.replace("#", "/");

            if(uri[0]=='/'){
                uri = "/sidebar"+uri;
            }else{
                uri = "/sidebar/"+uri;
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


        var autodiv = $('#'+self.state.current);
        var reload = self.state.reload;


        //iframe刷新
        if(reload){
            var ifr = document.getElementById(self.state.current);
            //ifr.contentWindow.location.href = self.state.currentRouter?self.state.currentRouter:ifr.contentWindow.location.href;
            autodiv.attr('src',self.state.currentRouter?self.state.currentRouter:ifr.contentWindow.location.href);
        }


        function autoH() {
            var addh = document.body.clientHeight - 82 ;
            autodiv.height(addh);
            autodiv.css({overflow: "auto"});
        }
        autoH();
        if (autodiv) {
            autodiv.css({overflow: "auto"});
            $(window).resize(function () {
                autoH();
            })
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

    componentWillMount() {
        var self = this;


        axios.get(`${GROBAL_HTTP_CTX}/appmenumgr/sidebarList?r=`+Math.random())
            .then(function (response) {

                var data = response.data.data || [];

                if(response.data.status==0){
                    console.log(response.data.msg);
                }

                else {

                }


                self.setMenu(response);
                self.setState({
                    menu: data,
                    num:data?data.length:0
                });
                window.menus = data;
                window.getBreadcrumb = function (id) {
                    var menus = window.menus;
                    var n1,n2,n3;

                    $.each(menus,function (i,item) {
                        if(id==item.id){
                            n1 = item;
                            return false;
                        }
                        if(item.children&&item.children.length>0){
                            $.each(item.children,function (t,items) {
                                if(id==items.id){
                                    n2 = items;
                                    n1 = item;
                                    return false;
                                }

                                if(items.children&&items.children.length>0){
                                    $.each(items.children,function (tt,itemss) {
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
                        var data = []
                        $.each([n1,n2,n3],function(i,item){
                            if(item){
                                data.push(item.name)
                            }
                        })

                        return data;
                    })();
                };




                self.initRouter();

                //var data = response;
                //window.router.every.after = function(){
                //    self.setMenu(data);
                //}
            }).catch(function (err) {
                console.log(err);
            });

    }

    initRouter() {
        var self = this;

        var router = window.router;
        router.init();
        //获取第一个节点数据


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

        var item = self.state.menu[0]?self.state.menu[0]:{
            "location" : "pages/default/index.js",
            "name" : "首页",
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
            // if(oUrl.indexOf('ifrNoHead')>=0) {
            //     var open = window.open;
            //     open(oUrl);
            //     return false;
            // }

            if(window.isOpenTab){
                if(self.state.menus.length==0){
                    //true设定加载第一个tab
                    var options = {
                        title:item.name,
                        router:self.formmaterUrl(item),
                        id:item.id
                    };
                    self.createTab(options);
                }
            }
            else {
                router.dispatch('on', url);
            }
        }
        else {
            router.dispatch('on', window.location.hash.replace('#',''));
        }
    }
    onTitleMouseEnter(e,domEvent){
        var dom = ($(e.domEvent.target).closest('li'));
        var h = document.body.clientHeight;

        this.setState({
            clientHeight:h
        });

        setTimeout(function () {

            var menu = dom.find('.u-menu');
            var arrow = dom.find('.arrow-menu');
            if(parseInt(dom.offset().top)+parseInt(menu.height())>h){

                if(parseInt(menu.height())>parseInt(dom.offset().top)){
                    menu.css({'bottom':-(h-parseInt(dom.offset().top)-50-20),'top':'inherit'});
                    arrow.css({'bottom':(h-parseInt(dom.offset().top)-50)+15-20,'top':'inherit'});
                }
                else {
                    menu.css({'bottom':"0",'top':'inherit'});
                    arrow.css({'bottom':"14px",'top':'inherit'})
                }
            }
            else {
                menu.css({'bottom':"inherit",'top':'0'});
                arrow.css({'bottom':"inherit",'top':'14px'})
            }
        },0)
    }
    menubar() {
        var cH = document.body.scrollHeight-60;
        var sH = $('.u-menu-max1').height();
        //var menu = this.container.find('.menubar').parent();

        if(sH>cH){
            $('.more-bar').show();
        }
    }
    scrollMenu(value,e){

        var h  = document.body.clientHeight-60;
        var showNum = parseInt(h/50);

        var curNum =  this.state.curNum+value;
        var num = this.state.num;


        if(curNum<0){
            curNum = 0;
            $('.arrow-up').addClass('lock');
            return false;
        }
        //fix: add 1 fake element
        else if(curNum>num-showNum) {
            curNum=num-showNum;
            $('.arrow-down').addClass('lock');
            return false;
        }
        else {
            $('.arrow-down,.arrow-up').removeClass('lock');
        }



        this.setState({
            curNum:curNum
        })
    }
    enter(e){
        console.log(e);
    }
    leave(e){
        console.log(e);
    }
    confirm(){
        if(getBrowserVersion()=='IE9'){
            return false;
        }
        window.onbeforeunload = function() {
            var tabs = JSON.parse(sessionStorage['tabs'])
            if(tabs.length>1) {
                return '关闭后您打开的页签数据会自动清空'
            }
        };
        window.onunload = function (event) {

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

    render() {
        var self = this;

        var expanded = this.state.expanded?"expanded":"";
        var isSeleted = this.state.submenuSelected;
        var isOpenTab =  this.state.isOpenTab;
        var TabBox = '';

        var togCon = (
            <span className="uf uf-navmenu-light"></span>
        )

        var props = {
            current:self.state.current,
            menus:self.state.menus,
            tabNum:self.state.menus.length,
            setCurrent:self.setCurrent,
            del:self.del,
            showNotice:self.state.showNotice
        };



        var UserMenuObj = {
            formmaterUrl:self.formmaterUrl,
            handleClick:self.handleClick,
            handleDefault:self.handleDefault
        };

        if (isOpenTab) {
            TabBox = <Tab {...props} />;
        } else {
            TabBox = "";
        }

        return (
            <div id="portal" className={"portal-expand "+expanded}>

                <SideContainer onToggle={this.onToggle.bind(this)} expanded={this.state.expanded}>

                    <Header>
                        <div className="toggle-wrap" >
                            <button type="button" onClick={this.onToggle.bind(this)} className="u-navbar-toggle show collapsed"><span className="uf uf-navmenu-light"></span></button>
                            <span className="toggle-text"></span>
                        </div>
                    </Header>
                    <div className="sidebar-content">
                            <Menu  onClick={this.handleClick.bind(this)}  className="u-menu-max1"  style={{marginTop:'-'+this.state.curNum*50}}  mode="vertical" >


                                {
                                    this.state.menu.map(function (item) {

                                        let blank = item.openview=="newpage"?"_blank":"";
                                        var noSecond = '';
                                        var curHeight = 0;

                                        if(Array.isArray(item.children)&&item.children.length>0){
                                            let list = [];
                                            var menulist = [[],[],[],[],[],[],[],[],[]];
                                            var pages = 0;

                                            let title = (<a href="javascript:;" key={item.menuId} className="first-child" name={item.name}><i className={'icon '+item.icon}></i><span><label className="uf uf-triangle-left"></label>{item.name}</span></a>);


                                            item.children.map(function(it){
                                                let blank =it.openview=="newpage"&&it.urltype=='url'?"_blank":"";


                                                if(Array.isArray(it.children)&&it.children.length>0){
                                                    let list2 = [];
                                                    let title = (<a href="javascript:;" key={it.id} className="child-title"><i className={'icon-child'}></i><span>{it.name}</span></a>);
                                                    noSecond = 'no-second-menu';

                                                    it.children.map(function(itit){
                                                        let blank =itit.openview=="newpage"&&itit.urltype=='url'?"_blank":"";

                                                        list2.push(<li><a target={blank} value={itit.id} onClick={(e)=>self.handleDefault(e,blank)} ref={itit.id} name={itit.name}  href={self.formmaterUrl(itit)}>{itit.name}</a></li>)
                                                    });

                                                    curHeight = Math.ceil(it.children.length/3)*25+52 + curHeight;


                                                    if(curHeight > self.state.clientHeight-60){
                                                        pages = pages +1;
                                                        curHeight = 0;
                                                        menulist[pages].push(
                                                            <div className={'menu-popup'}>
                                                                {title}
                                                                <div className="third-menu-content">
                                                                    <ul className="third-menu-list">
                                                                        {list2}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                    else {
                                                        menulist[pages].push (
                                                            <div className={'menu-popup'}>
                                                                {title}
                                                                <div className="third-menu-content">
                                                                    <ul className="third-menu-list">
                                                                        {list2}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        )
                                                    }

                                                }
                                                else {

                                                    curHeight = 46+ curHeight;

                                                    let title = (<a target={blank} value={it.id} onClick={(e)=>self.handleDefault(e,blank)} href={self.formmaterUrl(it)}><i className={'icon '+it.icon}></i><span>{it.name}</span></a>);


                                                    if(curHeight > document.body.clientHeight-60){
                                                        pages = pages+1;
                                                        curHeight = 0;
                                                        menulist[pages].push(
                                                            <div className={'menu-popup'}>
                                                                <a target={blank} value={it.id} onClick={(e)=>self.handleDefault(e,blank)} ref={it.id} name={it.name} href={self.formmaterUrl(it)}>{it.name}</a>
                                                            </div>
                                                        )
                                                    }
                                                    else {
                                                        menulist[pages].push(
                                                            <div className={'menu-popup'}>
                                                                <a target={blank} value={it.id} onClick={(e)=>self.handleDefault(e,blank)} ref={it.id} name={it.name} href={self.formmaterUrl(it)}>{it.name}</a>
                                                            </div>
                                                        )
                                                    }

                                                }

                                            });


                                            var selected = item.id == isSeleted?"u-menu-submenus-selected":"";


                                            return (
                                                <SubMenu onTitleMouseEnter={self.onTitleMouseEnter.bind(self)} key={item.menuId} className={'second-menu '+selected+ ' '+ noSecond +' menu-cloum-'+pages} children={item.children} title={title}>
                                                    <li className="arrow-menu"></li>
                                                    {/*{menulist}*/}
                                                    {
                                                        menulist.map(function(ite,i){
                                                            ite = ite.length!=0?<li key={'ite'+i} className="u-menu-list">{ite}</li>:ite;
                                                            return (
                                                                ite
                                                            )
                                                        })
                                                    }
                                                </SubMenu>
                                            )
                                        }
                                        else {
                                            let blank =item.openview=="newpage"?"_blank":"";

                                            if(item.id == 'index'){
                                                return false;
                                            }

                                            let title = (
                                                <a target={blank} key={item.id} value={item.id} className="first-child" onClick={(e)=>self.handleDefault(e,blank)} ref={item.id} href={self.formmaterUrl(item)} name={item.name}><i className={'icon '+item.icon}></i><span ><label className="uf uf-triangle-left"></label>{item.name}</span></a>
                                            );
                                            return (
                                                <Menu.Item key={item.id} >{title}</Menu.Item>
                                            )
                                        }
                                    })
                                }
                            </Menu>
                    </div>
                    <div className="more-bar" style={{display:'none'}}>
                        <div className="arrow-up lock" title="通过滚动鼠标来移动菜单" onClick={this.scrollMenu.bind(this,-1)}>
                            <i className="uf uf-2arrow-up" />
                        </div>
                        <div className="arrow-down" title="通过滚动鼠标来移动菜单" onClick={this.scrollMenu.bind(this,1)}>
                            <i className="uf uf-2arrow-down" />
                        </div>
                    </div>
                </SideContainer>

                <div id="content" >
                    <Navbar fluid={true} className={"portal-navbar "+expanded} expanded={this.state.expanded} onToggle={this.onToggle.bind(this)}>

                        <Brand>
                            <a href="javascript:;">
                                <img src={require('static/images/logo_zh_CN.svg')} className="portal-logo" />
                            </a>
                        </Brand>
                        <Nav pullRight className="portal-nav" onClick={self.showMenu.bind(self)}>


                            <div id="bs-example-navbar-collapse-9" className="collapse navbar-collapse navbar-right">

                                <Menu className="nav navbar-nav" onClick={self.handleClick.bind(this)}>
                                    <li style={{marginRight:8,display:'none'}}>
                                        <a id="operation" ref="operation" title="运维消息" href="javascript:void (0);" className="navbar-avatar" >
                                            <div className="u-badge" data-badge="0">
                                                <i className="qy-iconfont icon-xiaoxi"></i>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a id="taskCenterBox" value="taskcenter"  onClick={(e)=>self.handleDefault(e)} ref="taskcenter" name="任务中心" title="任务中心" href={`${GROBAL_HTTP_CTX}/index-view.html#/taskcenter`} className="navbar-avatar" titlekey="任务中心" >
                                            <div className="u-badge">
                                                <i className="pap pap-task"></i>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a id="messageCount" value="msgCenter" onClick={(e)=>self.handleDefault(e)} ref="msgCenter" name="消息中心" title="消息中心" href={`${GROBAL_HTTP_CTX}/index-view.html#/msgCenter`} className="navbar-avatar" >
                                            <div className="u-badge" data-badge="0">
                                                <i className="pap pap-massage"></i>
                                            </div>
                                        </a>
                                    </li>
                                </Menu>
                                <ul className="nav navbar-nav">
                                    <li className="dropdown" >
                                        <a role="button" id="username"  aria-expanded="false" href="javascript:void (0);" data-toggle="dropdown" className="navbar-avatar dropdown-toggle">

                                            <span className="avatar-name"> {decodeURIComponent(decodeURIComponent(cookie.load('_A_P_userName')))} </span>
                                            <span className="iconfont icon-arrowdown"></span>
                                            <span className="avatar-icon">
                                            <img src={`${GROBAL_HTTP_CTX}`+decodeURIComponent(decodeURIComponent(cookie.load('_A_P_userAvator'))).replace(/\.\/images/,'\/images')} />
                                        </span>
                                        </a>

                                        <div role="menu" className={'dropdown-menu user-menu'}>
                                            <UserMenus {...UserMenuObj}  />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </Nav>
                    </Navbar>
                    {TabBox}
                    <div className="content">
                    {
                        this.state.menus.map(function (item,index) {
                            var match = /.*(#\/ifr\/)/ig;
                            var selected = self.state.current==item.id?"ifr-selected":"";

                            item.router = decodeURIComponent(decodeURIComponent(item.router.replace(match,'')));

                            return (
                                <iframe key={item.id} className={'ifr-tabs '+selected} id={item.id}  src={item.router} style={{width:'100%',border:'0'}}></iframe>
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
