import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import mirror, { connect,actions } from 'mirrorx';
import {getCookie} from "utils";
import {Icon} from 'tinper-bee';
import Menu from 'bee-menus';
import 'bee-menus/build/Menu.css';
import './menus.css';
const SubMenu = Menu.SubMenu;
const { Item } = Menu;
class Menus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuSelected:'',
      openKey:[]
    }
    // this.onOpenChange = this.onOpenChange.bind(this);
  }
  barLeftClick = () => {
    let {leftExpanded} = this.props;
    this.setState({
      openKey:[]
    })
    actions.app.updateState({
      leftExpanded: !leftExpanded
    })
  }
 onOpenChange = (openKeys) =>{
   let self = this;
   if(openKeys.length>0) {
     let openKey = [openKeys[openKeys.length -1]];
     if(openKey&& openKey.length>0){
       let str = openKey[0].substr(0,1);
       if(str == '1') {
         self.setState({
           openKey:openKey,
         })
       } else {
         self.setState({
           openKey:openKeys,
         })
       }
     }
   } else {
     self.setState({
       openKey:openKeys,
     })
   }

 }
 handleDefault(e,isDefault) {
   this.props.sideBarOper.handleDefault(e,isDefault)
 }
 formmaterUrl(item) {
   return window.formmaterUrl(item);
 }
 changeAhref(item) {
   this.props.sideBarOper.changeAhref(item);
 }
 collectefunc(e,item) {
   this.props.sideBarOper.collectefunc(e,item);
 }
 openTab(e,reload,item) {
   // this.setState({
   //   menuSelected: item.id
   // })
   let tar = e.target || e.domEvent.target;
   if(tar.classList.contains('iconfont')) {
     return ;
   }
   this.props.sideBarOper.openTab(e,reload,item);
 }
 expandedMenu = (e,item,reload) => {
   if(item.children && item.children.length > 0) {
     let {leftExpanded} = this.props;
     actions.app.updateState({
       leftExpanded: !leftExpanded
     })
   } else {
     this.props.sideBarOper.openTab(e,reload,item);
   }
 }

 //生成各级菜单
 makeMenu(menu, i) {
      let self = this;
      let {current,leftExpanded} = this.props;
      let locale_serial = getCookie("locale_serial");
  		if(locale_serial == 1) {
  			locale_serial = "";
  		}

      if(menu.length >0) {
        i++;
        return (
          menu.map((item) => {
            let blank = item.openview == "newpage"&&item.urltype=='url'?"_blank":"";
            if(Array.isArray(item.children) && item.children.length >0) {
              let title = '';
              if(!leftExpanded) {
                title = (<a href="javascript:;"  data-ahref={self.changeAhref(item)} name={item['name'+locale_serial]} title={item['name'+locale_serial]} data-licenseControlFlag ={item.licenseControlFlag} data-areaId ={item.areaId}><i className={'icon ' + item.icon}></i><span>{item['name'+locale_serial]}</span></a>);
              } else {
                title = (<a onClick={(e) => {self.handleDefault(e, blank); self.expandedMenu(e,item,'')}}
                 name={item['name'+locale_serial]} title={item['name'+locale_serial]}>
                 <i className={'icon ' + item.icon}></i>
                 </a>);
              }
              // let title = (<a href="javascript:;" style={{paddingLeft:'2px'}} data-ahref={self.changeAhref(item)} name={item['name'+locale_serial]} title={item['name'+locale_serial]} data-licenseControlFlag ={item.licenseControlFlag} data-areaId ={item.areaId}><i className={'icon ' + item.icon}></i><span>{item['name'+locale_serial]}</span></a>);
              return (
                <SubMenu key={i+'_'+item.menuId} className={[leftExpanded?'tree-expand-menu-item':'','tree-second-item-'+i+' tree-second-item'].join(" ")}  children={item.children} title={title}>
                  {self.makeMenu(item.children,i)}
                </SubMenu>
              )
            } else {
              if (item.id == 'index') {
                    return false;
                }
                let title = '';
                if(!leftExpanded) {
                  title = (<div><a target={blank} onClick={(e) => {self.handleDefault(e, blank); self.openTab(e,'',item)}}
                  value={item.id} name={item['name'+locale_serial]} title={item['name'+locale_serial]}
                   href={self.formmaterUrl(item)}>
                   <i className={'icon ' + item.icon}></i>
                   <span>{item['name'+locale_serial]}</span>
                   <i className={ item.collected?"shoucanged iconfont icon-star":"shoucang iconfont icon-star1" }
   								onClick={(e) =>{self.collectefunc(e,item)} }
   								data-menuId={item.menuId} title={'收藏'}></i>
                   </a></div>);
                } else {
                  title = (<div><a target={blank} value={item.id} href={self.formmaterUrl(item)} onClick={(e) => {self.handleDefault(e, blank); self.expandedMenu(e,item,'')}}
                   name={item['name'+locale_serial]} title={item['name'+locale_serial]}>
                   <i className={'icon ' + item.icon}></i>
                   </a></div>);
                }
                let selected = item.id == this.state.menuSelected ? "tree-menu-submenus-selected tree-leaf-item" : "tree-leaf-item";
                return (
                    <Menu.Item key={item.menuId} className={[leftExpanded?'tree-expand-leaf-item':'','tree-leaf-item-'+i+' tree-leaf-item'].join(" ")}>{title}</Menu.Item>
                )
            }
          })
        )
      }
  }
  render() {
    let {menu,leftExpanded,themeObj} = this.props;
    let self = this;
    let openKey = this.state.openKey;
    return (
      <div className="tree-sidebar left-side-bar sidebar-left">
        <div className={leftExpanded?"left-side-bar-header left-side-bar-header-expanded ":"left-side-bar-header"} onClick={()=> this.barLeftClick()} style={{backgroundColor:themeObj.leftSideBgColor,backgroundImage: `url(${themeObj.leftSideBgImg})`}}>
        {/* themeObj.leftSideTheme === 'light'?
          <img src={require(`static/images/hanbao-dark.svg`)}/>
          : <img src={require(`static/images/hanbao-light.svg`)}/>
        */}
        { !leftExpanded?
          <img src={require(`static/images/hanbao-light.svg`)}/>
          : <Icon type="uf uf-treeadd" className={"tree-left-icon"}/>
        }
        </div>
        <Menu
          mode="inline"
          className={!leftExpanded?"tree-sidebar-info tree-sidebar-info-show":"tree-sidebar-info tree-sidebar-info-hide"}
          onOpenChange={this.onOpenChange}
          openKeys={openKey}
          >
          {self.makeMenu(menu,0)}
        </Menu>
      </div>
    )

  }
}
export default Menus;
