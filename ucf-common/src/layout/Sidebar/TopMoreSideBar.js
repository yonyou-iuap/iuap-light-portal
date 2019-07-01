import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import mirror, { connect,actions } from 'mirrorx';
import Drawer from 'ac-drawer';
import "ac-drawer/dist/ac-drawer.css";
import {getCookie,flattenJsonId} from "utils";
import {Badge,Tile,Icon,Tooltip} from 'tinper-bee';
import Menu from 'bee-menus';
import 'bee-menus/build/Menu.css';
import './topMoreSideBar.css'
const SubMenu = Menu.SubMenu;
const { Item } = Menu;
class TopMoreSideBar extends Component {
  	constructor(props) {
    	super(props);
		this.state = {
			itemList:[], // 右侧面板显示内容
			itemFlag: false,
			openKey: [], // 第一级当前打开
			current: '' // 第二级的当前选中色
		};
	}

	formmaterUrl(item) {
		return window.formmaterUrl(item);
	}
	onOpenChange = (openKeys) => {
		let openKey = [openKeys[openKeys.length -1]]
		let {menu} = this.props;
		let itemList = [],current = '';
		menu.forEach((item,index) => {
			if(item.menuId === openKey[0]){
				current = item.children[0].menuId
				if(item.children[0].children) {
					itemList = item.children[0].children;
				}
			}
		});
		this.setState({
			itemList: itemList,
			openKey: openKey,
			current: current
		})
  	}
	handleEnter = (item) => {
		let arr = [];
		if(item.children) {
			arr = item.children;
		} else {
			arr = [];
		}
		this.setState({
			itemList: arr,
			itemFlag: true,
			current: item.menuId
		})
	}
	handleClick(e) {
		this.props.sideBarOper.handleClick(e);
	}
	changeAhref(item) {
		this.props.sideBarOper.changeAhref(item);
	}
	openTab(e,reload,item) {
		let tar = e.target || e.domEvent.target;
		if(tar.classList.contains('iconfont')) {
			return ;
		}
		this.props.sideBarOper.openTab(e,reload,item);
	}

	collectefunc(e,item) {
		this.props.sideBarOper.collectefunc(e,item);
	}
	handleDefault(e,isDefault) {
		this.props.sideBarOper.handleDefault(e,isDefault)
	}




  	// 一级菜单
	makeMenus = () => {
		let {menu} = this.props;
		const result = [];
		let self = this;
		let locale_serial = getCookie("locale_serial");
		if(locale_serial == 1) {
			locale_serial = "";
		}
		menu.forEach((item,index) => {
			// 过滤掉首页
			if(index === 0) {
				return;
			}
			let blank = item.openview == "newpage"&&item.urltype=='url'?"_blank":"";
			let title = '';
			if(item.children && item.children.length>0) {
				title = (<li><a href="javascript:;" data-ahref={self.changeAhref(item)}  key={item.id} className='first-child' name={item['name'+locale_serial]} data-licenseControlFlag ={item.licenseControlFlag} data-areaId ={item.areaId}><i className={'icon '+item.icon}></i><span>{item['name'+locale_serial]}</span></a><i className="uf uf-anglearrowpointingtoright u-menu-right-icon"></i></li>);
			} else {
				title = (<li><a href={self.formmaterUrl(item)} value={item.id} target={blank} onClick={(e) => {self.handleDefault(e, blank);self.openTab(e,'',item)}} data-ahref={self.changeAhref(item)}  key={item.id} className='first-child first-menu-item' name={item['name'+locale_serial]} data-licenseControlFlag ={item.licenseControlFlag} data-areaId ={item.areaId}><i className={'icon '+item.icon}></i><span>{item['name'+locale_serial]}</span></a></li>);
			}
			result.push(
				<SubMenu
				key={item.menuId}
				title={
					title
				}>
					{item.children && item.children.length>0? this.makeSubMenus(item.children):''}
				</SubMenu>
			)
		});
		return result;
	}

	// 二级菜单
	makeSubMenus = (menus) => {
		const result = [];
		let locale_serial = getCookie("locale_serial");
		if(locale_serial == 1) {
			locale_serial = "";
		}
		menus.forEach((item,index) => {
			let self = this;
			let {current} = this.state;
			let blank = item.openview=="newpage" && item.urltype=='url'? "_blank":"";
			result.push(
				<Item
					key={item.id}
					style={{ fontSize: '14px' }}
					onMouseEnter={()=>this.handleEnter(item)}
					className={current === item.menuId?"second-menu-selected":""}
				>
				{
					!item.children?
						<div className="second-menu-no-menu" onClick={(e) => {self.handleDefault(e, blank);self.openTab(e,'',item)}}>
							<a href={self.formmaterUrl(item)} target={blank} value={item.id} data-ahref={self.changeAhref(item)} key={item.id} className="child-title"
							data-areaId={item.areaId} data-licenseControlFlag={item.licenseControlFlag}
							onClick={(e) => {self.handleDefault(e, blank)}}
							>
								<span title={item['name'+locale_serial]}>{item['name'+locale_serial]}</span>
								<i className={ item.collected?"shoucanged iconfont icon-star":"shoucang iconfont icon-star1" }
								onClick={(e) =>{self.collectefunc(e,item)} }
								data-menuId={item.menuId} title={'收藏'}></i>
							</a>
							{/* <span className="sub-menu-no-second">.</span> */}
						</div>
					:
						<div className="second-menu-has-menu">
							<a value={item.id}
							data-areaId={item.areaId}
							title={item['name'+locale_serial]}
							data-ahref={self.changeAhref(item)}
							data-licenseControlFlag={item.licenseControlFlag}
							ref={item.id} name={item['name'+locale_serial]}
							href="javascript:;">{item['name'+locale_serial]}
							</a>
							<Icon className="sub-menu-icon" type="uf-anglearrowpointingtoright"/>
						</div>
				}
				</Item>
			)
		});
		return result;
	}

	// 三四级菜单
	renderList = () => {
		let {itemList} = this.state;
		let self = this;
		let locale_serial = getCookie("locale_serial");
		if(locale_serial == 1) {
			locale_serial = "";
		}
		const result = [];
		const resultArr = [];
		itemList.forEach((item,index) => {
			let blank =item.openview=="newpage"&&item.urltype=='url'?"_blank":"";
			if(item.children) {
				result.push(
					<div className="third-menu-has-menu">
						<p title={item['name'+locale_serial]}>{item['name'+locale_serial]}</p>
						<ul className="fourth-menu-list">
							{
								item.children.forEach((item1,index1) => {
									resultArr.push(<li className="fourth-menu-list-item">
										<a href={self.formmaterUrl(item1)} value={item1.id} data-ahref={self.changeAhref(item1)} key={item1.id} className="child-title"
											data-areaId={item1.areaId} data-licenseControlFlag={item1.licenseControlFlag}
											onClick={(e) => {self.handleDefault(e, blank);self.openTab(e,'',item1)}}
										>
											<span title={item1['name'+locale_serial]}>{item1['name'+locale_serial]}</span>
											<i className={ item1.collected?"shoucanged iconfont icon-star":"shoucang iconfont icon-star1" }
												onClick={(e) =>{e.preventDefault();self.collectefunc(e,item1)} }
												data-menuId={item1.menuId} title={'收藏'}></i>
										</a>
									</li>)
								})
							}
							{resultArr}
						</ul>
					</div>
				)
			}else {
				result.push(
					<div className='third-menu-list'>
						<a href={self.formmaterUrl(item)} value={item.id} data-ahref={self.changeAhref(item)} key={item.id} className="child-title"
						data-areaId={item.areaId} data-licenseControlFlag={item.licenseControlFlag}
						onClick={(e) => {self.handleDefault(e, blank);self.openTab(e,'',item)}}
						>
							<span title={item['name'+locale_serial]}>{item['name'+locale_serial]}</span>
							<i className={ item.collected?"shoucanged iconfont icon-star":"shoucang iconfont icon-star1" }
								onClick={(e) =>{e.preventDefault();self.collectefunc(e,item)} }
								data-menuId={item.menuId} title={'收藏'}></i>
						</a>
					</div>
				)
			}
		})
		return result;
   	}

	componentWillReceiveProps(nextProps){
		let {menu} = nextProps;
		let {itemList,current,openKey} = this.state;
		if(this.state.itemList.length < 1){
			if(Array.isArray(menu) && menu.length > 0) {
				if(menu[1] && menu[1].children) {
					if(menu[1].children[0]){
						current = menu[1].children[0].menuId;
						if(menu[1].children[0].children) {
							itemList = menu[1].children[0].children;
						}
					}
				}
			}
		}
		if(this.state.openKey.length < 1){
			if(Array.isArray(menu) && menu.length > 1) {
				openKey.push(menu[1].menuId)
			}
		}
		this.setState({
			itemList: itemList,
			current: current,
			openKey: openKey
		})

	}

	render() {
		let {sideBarShow} = this.props;
		let {openKey} = this.state;

		return (
			<Drawer className={'demo2 top-more-sidebar-drawer'} hasHeader={false} show={sideBarShow} placement="left">
				<Menu
					mode="inline"
					openKeys={openKey}
					style={{ width: 240 }}
					className="top-more-side-bar"
					onOpenChange={this.onOpenChange}
					>
					{this.makeMenus()}
				</Menu>
				<div className='third-menu'>
					{this.renderList()}
				</div>
			</Drawer>
		)
  	}
}
export default TopMoreSideBar;
