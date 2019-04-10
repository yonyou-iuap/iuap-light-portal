import React,{Component} from "react";
import cookie from "react-cookie";
import {Navbar,Menu,Icon,Tooltip} from 'tinper-bee';
import {FormattedMessage, FormattedDate, FormattedNumber} from 'react-intl';
import mirror, { connect,actions } from 'mirrorx';
import UserMenus from 'components/UserMenu/UserMenu';
import Tenant from 'layout/Tenant/Tenant';
import * as api from "ucf-apps/index/src/service";
import { subscribe } from  'components/EventBus/Eventbus';
import { Warning } from '../../utils/index';
import HeaderLeft from './HeaderLeft';
import HeaderCenter from './HeaderCenter';
import HeaderRight from './HeaderRight';
import { processData } from "utils";
import {ConnectedHeaderLeft} from 'ucf-apps/index/src/container';
import {ConnectedHeaderRight,ConnectedHeaderCenter} from 'ucf-apps/index/src/container';

// import headerImg from 'static/images/bg_topbar.jpeg';
// const Header = Navbar.Header;
// const SubMenu = Menu.SubMenu;
// const MenuItemGroup = Menu.ItemGroup;
// const NavItem = Navbar.NavItem;
// const Brand = Navbar.Brand;
// const Collapse = Navbar.Collapse;
// const Toggle = Navbar.Toggle;
const Nav = Navbar.Nav;



class App extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            expanded:false,
            openKeys:[],
            curentOpenKeys: [],
            // maxed:false,
            unreadMsg:0,
            svgWidth: 22,
            svgHeight: 26

        };
        this.handleClick = this.handleClick.bind(this);
        window.createTab = this.createTab.bind(this);
        // createTab参数
        // options = {
        //     id: "sysmgr",
        //     router: "/wbalone/index-view.html%2523sysmgr",
        //     title: "管理中心"
        // }
    }
    componentWillMount(){
        this.addFullScreenChangeEvent();
        // let {themeObj} = this.props;
        // this.themeFun(themeObj);
        // actions.app.themeRequest();
    }

    async componentDidMount(){

        // 调用 loadUserMenuList 请求数据
        let res = processData(await api.loadUnReadMsg());
        this.setState({
            unreadMsg:res.unReadNum>99?'99+':res.unReadNum
        })

        let info  = processData(await api.getWebPushInfo());

        let {webpuship,webpushport} =info.webpush;
        var userId = cookie.load('userId');
        var userkey = cookie.load('tenantid')  === ""? "null" : cookie.load('tenantid')
        subscribe(webpuship,webpushport,{
                    "identity": "server1001",
                    "appid": "",
                    "userkey": userkey.concat("_", userId)
                },(err, jsonMsg)=>{

                    var Tcount = 0;
                    if (jsonMsg.message && JSON.parse(jsonMsg.message)[userkey.concat("_", userId)]!=undefined) {
                        Tcount = JSON.parse(jsonMsg.message)[userkey.concat("_", userId)];
                        this.setState({
                            unreadMsg:Tcount>99?'99+':Tcount
                        })
                    }

                })


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
    showMenu(e) {
        let {userMenu} = this.props;
        actions.app.updateState()
    }
    handleClick(e,reload,item) {
        //判断是否点击子菜单,1:当前子菜单，2:2级别子菜单。。。
        let {menus,current,intl} = this.props;

        let self = this;

        // var data  = (e.keyPath.length==1)?{
        //     current: e.key,
        //     openKeys: [],
        //     submenuSelected:'',
        //     curentOpenKeys:[],
        //     userMenu:false
        // }:{
        //     current: e.key
        // };

        function getDOm() {
            let tar = e.target || e.domEvent.target;
            if (!tar.tagName || tar.tagName !== 'A') {
                tar = tar.closest('a');
            }
            if(tar.getAttribute('value')){
                return tar;
            }
            else if(tar.parentElement.getAttribute('value')){
                tar.parentElement
            }
            else {
                return tar.parentElement.parentElement
            }
        }

        let tar = getDOm();


        if(!tar){
            return false;
        }

        let value = tar.getAttribute('value');


        let data = {
            current: value,
            showNotice:0,
            reload:0
        };

        if(typeof value == 'undefined'||value==null){
            return false;
        }

        if(value=='logout'){
            return false;
        }


        let dom = tar;
        // let title = dom.getAttribute('name');
        let router =  dom.getAttribute('href');
        // let title = dom.getAttribute('item');

        let options = {
            title:item.name,
            title2:item.name2,
            title3:item.name3,
            title4:item.name4,
            title5:item.name5,
            title6:item.name6,
            router:router,
            id:value
        };


        let menu = menus;


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
                    });
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
                }
                actions.app.updateState(data);
            }
        }
        this.createTab(options);
    }
    createTab (options,value) {
        var self = this;
        var {menus} = this.props;

        if(!window.sessionStorage){
            alert('This browser does NOT support sessionStorage');
            return false;
        }


        var menu = menus;


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
            current:options.id
        });


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

    handleDefault(e,isDefault) {
        isDefault = (isDefault=="_blank")?false:true;
        if(window.isOpenTab&&isDefault){
            //dom.href = 'javascript:;'
            e.preventDefault();
        }
    }
    addFullScreenChangeEvent =()=>{
        let de  = document.documentElement;
        if (de.requestFullscreen) {
            document.addEventListener('fullscreenchange', ()=>this.fulllscreenChange());
        } else if (de.mozRequestFullScreen) {
            document.addEventListener('mozfullscreenchange', ()=>this.fulllscreenChange());
        } else if (de.webkitRequestFullScreen) {
            document.addEventListener('webkitfullscreenchange', ()=>this.fulllscreenChange());
        }else if(de.msRequestFullscreen){
            document.addEventListener('MSFullscreenChange', ()=>this.fulllscreenChange());
        }
    }
    fulllscreenChange = ()=>{
      let {maxed} = this.props;
      actions.app.updateState({
        maxed:!maxed
      })
        // var  mexed = this.state.maxed;
        // this.setState({
        //     maxed:!mexed
        // })
    }
    maxfunc(e){
      // debugger;
        let de  = document.documentElement;
        if (de.requestFullscreen) {
            de.requestFullscreen();
        } else if (de.mozRequestFullScreen) {
                de.mozRequestFullScreen();
        } else if (de.webkitRequestFullScreen) {
            de.webkitRequestFullScreen();
        }else if(de.msRequestFullscreen){
            de.msRequestFullscreen()
        }
    }
    minifunc(e){
      // debugger;
        let de = document;
        if (de.exitFullscreen) {
            de.exitFullscreen();
        } else if (de.mozCancelFullScreen) {
            de.mozCancelFullScreen();
        } else if (de.webkitCancelFullScreen) {
            de.webkitCancelFullScreen();
        }else if(de.msExitFullscreen){
            de.msExitFullscreen()
        }

    }
    svgClick() {
      actions.app.updateState({
        sideBarShow: !sideBarShow
      })
      // this.props.svgClick();
    }
    themeChange = (val) => {
      let {themeObj} = this.props;
      localStorage.setItem('themeVal', val);
      window.location.reload(true)
    }

    render (){
        let self = this;

        let {unreadMsg} = self.state;
        let {expanded,menus,intl,maxed,showHeader,leftExpanded,themeObj} = this.props;
        let svgClick = self.svgClick;
        // let sideBarShow = self.props.sideBarShow;
        let headerRightOper = {
          maxfunc: self.maxfunc,
          minifunc: self.minifunc,
          handleDefault: self.handleDefault,
          handleClick: self.handleClick,
          themeChange: self.themeChange
        }
        var UserMenuObj = {
            formmaterUrl:self.formmaterUrl,
            handleClick:self.handleClick,
            handleDefault:self.handleDefault,
            intl:intl
        };
        // console.log(UserMenuObj);
        return (
          <nav className={[!showHeader?"header header-hide":"header header-show", themeObj.sideShowPosition==='left'?"header-show-left":'',leftExpanded?"header-show-left-expand":'',themeObj.headerTheme==="dark"?"header-show-white":"header-show-dark"].join(" ")} style={{backgroundColor:themeObj.headerBgColor,backgroundImage: `url(${themeObj.headerBgImg})`}}>
            <ConnectedHeaderLeft placeholder={intl.formatMessage({id: 'header.search.placeholder'})} headerRightOper={headerRightOper}/>
            <ConnectedHeaderCenter />
            <ConnectedHeaderRight  headerRightOper={headerRightOper} handleClick={self.handleClick.bind(this)} intl={intl} unreadMsg= {this.state.unreadMsg} UserMenuObj={UserMenuObj}/>
          </nav>
        )
    }
}
export default  App;
