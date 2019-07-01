import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import mirror, { connect,actions } from 'mirrorx';
import {Navbar,Menu,Badge,Tile,Icon,Tooltip} from 'tinper-bee';
import {getCookie} from "utils";
class LeftSideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dddd: 1,
      leftSubShow: false
    }
  }
  handleClick(e) {
    this.props.sideBarOper.handleClick(e);
  }
  changeAhref(item) {
    this.props.sideBarOper.changeAhref(item);
  }
  openTab(e,reload,item) {
    this.props.sideBarOper.openTab(e,reload,item);
  }
  formmaterUrl(item) {
    return window.formmaterUrl(item);
  }
  leftMouseEnter(e,item,menulist,index1) {
    this.setState({
      dddd: index1,
      leftSubShow:true
    })
  }
  leftMouseLeave(e,item,menulist,index1) {
    this.setState({
      leftSubShow:false
    })
  }
  barLeftClick() {
    let {leftExpanded} = this.props;
    actions.app.updateState({
      leftExpanded: !leftExpanded
    })
  }
  handleDefault(e,isDefault) {
    this.props.sideBarOper.handleDefault(e,isDefault)
  }
  collectefunc(e,itit,index1,index2,index3) {
    this.props.sideBarOper.collectefunc(e,itit,index1,index2,index3);
  }
  render() {
    let {leftExpanded,themeObj,menu} = this.props;
    let {dddd,leftSubShow} = this.state;
    let self = this;
    let locale_serial = getCookie("locale_serial");
    if(locale_serial == 1) {
        locale_serial = "";
    }
    return (
      <div>
      <div className="left-side-bar sidebar-left">
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
                  if(Array.isArray(item.children)&&item.children.length>0){
                      let list = [];
                      var menulist = [[],[]];

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
                                                    onClick={(e) => {self.handleDefault(e, blank);self.openTab(e,'',itit)}}
                                                    ref={itit.id} name={itit['name'+locale_serial]}
                                                    href={self.formmaterUrl(itit)}>{itit['name'+locale_serial]}</a><i className={ itit.collected?"shoucanged iconfont icon-star":"shoucang iconfont icon-star1" }
                                                                                                     onClick={(e) =>{e.preventDefault();self.collectefunc(e,itit,index1,index2,index3)} }
                                                                                                     data-menuId={itit.menuId} title={'收藏'}></i></li>
                                  list2.push(html)
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

                                  menulist[0].push (html)

                              }

                          } else {
                              let  html = <div className={'menu-popup menu-popup-one'}>
                                  <a target={blank} value={it.id} data-areaId ={it.areaId}
                                     data-ahref ={self.changeAhref(it)} data-licenseControlFlag={it.licenseControlFlag}
                                     onClick={(e)=>{self.handleDefault(e,blank);self.openTab(e,'',it)}} ref={it.id} name={it['name'+locale_serial]}
                                     href={self.formmaterUrl(it)}>{it.name}
                                     <i className={ it.collected?"shoucanged iconfont icon-star":"shoucang iconfont icon-star1" }
                                        onClick={(e) =>{e.preventDefault();self.collectefunc(e,it,index1,index2)} }
                                        data-menuId={it.menuId} title={'收藏'}></i></a>
                              </div>
                              menulist[0].push(html)
                          }

                      });
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
                          <a target={blank} key={item.id} value={item.id} className="first-child" data-areaId={item.areaId} data-ahref={self.changeAhref(item)} data-licenseControlFlag ={item.licenseControlFlag} onClick={(e)=>{self.handleDefault(e,blank);self.openTab(e,'',item)}} ref={item.id} href={self.formmaterUrl(item)} name={item['name'+locale_serial]}><i className={'icon '+item.icon}></i><span className={item.menuId===item.menuId?'left-sidebar-active':''}><label className="uf uf-triangle-left"></label>{item['name'+locale_serial]}</span></a>
                      );
                      return (
                          <div onClick={(e)=>self.openTab(e,'',item)} className="side-bar-first">
                              {title}
                          </div>
                      )
                  }
              })
          }

      </div>


      </div>
      </div>
    )
  }
}
export default LeftSideBar;
