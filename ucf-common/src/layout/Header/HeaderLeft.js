import React,{Component} from "react";
import mirror, { connect,actions } from 'mirrorx';
import {FormattedMessage, FormattedDate, FormattedNumber} from 'react-intl';
import {Select} from 'tinper-bee';
import {flattenJsonId,getCookie} from 'utils';
const Option = Select.Option;
class HeaderLeft extends Component {
    constructor(props,context) {
        super(props,context);
        this.state = {
          sideSearchList: [],
          sideSearchVal:'',
          sideSearchShow: false
        }
      this.searchInput = this.searchInput.bind(this);
      this.searchSideClick = this.searchSideClick.bind(this);
      this.searchTabClick = this.searchTabClick.bind(this);
      this.inputDown = this.inputDown.bind(this);
      // this.searchHtml = this.searchHtml.bind(this);
    }
    componentDidMount() {
      let self = this;
      this.clickOut(self);
    }
    svgClick() {
      const {sideBarShow} = this.props;
      actions.app.updateState({
        sideBarShow: !sideBarShow
      })
      // $('.left-side-bar ').an
    }
    searchInput = (val) => {
      this.setState({
        sideSearchVal: val.target.value
      })
    }
    searchSideClick = () => {

      let {sideSearchShow} = this.state;
      this.setState({
        sideSearchShow: !sideSearchShow
      },()=> {

        let {sideSearchShow} = this.state;
        if(sideSearchShow) {
          let locale_serial = getCookie("locale_serial");
          if(locale_serial == 1) {
              locale_serial = "";
          }
          let {menu} = this.props;
          let {sideSearchVal} = this.state;
          let arr = [];
          let searchMenu = [];
          flattenJsonId(menu,arr);
          for (var i = 0; i < arr.length; i++) {
            if(arr[i]['name'+locale_serial].indexOf(sideSearchVal) > -1){
              searchMenu.push(arr[i]);
            }
          }
          this.setState({
            sideSearchList:searchMenu,
          })
        } else {
          this.setState({
            sideSearchVal:''
          })
        }
      })

    }
    themeChange = (val) => {
      this.props.headerRightOper.themeChange(val);
    }
    searchTabClick = (item) => {
      let options = {
        id: item.id,
        router:item.location,
        title: item.name,
        title2: item.name2,
        title3: item.name3,
        title4: item.name4,
        title5: item.name5,
        title6: item.name6
      }
      window.createTab(options);
      this.setState({
        sideSearchShow: false,
        sideSearchVal: ''
      })
    }
    inputDown = (event) => {
      if(event.keyCode !==13 ){
        return;
      }
      this.searchSideClick();
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
            if(matchesSelector(e.target,'.header-search *')){               
                return;
            }
            self.setState({
                sideSearchShow:false,
                sideSearchVal: ''
            })
        }, false);
    }
    render() {
      let self = this;
      let {sideBarShow,leftExpanded,themeObj} = this.props;
      let {sideSearchVal,sideSearchList,sideSearchShow} = this.state;
      // let selectVal = localStorage.getItem('themeVal');
      // if(!selectVal) {
      //   selectVal = '2'
      // }
      let locale_serial = getCookie("locale_serial");
      if(locale_serial == 1) {
          locale_serial = "";
      }
      let obj = {
        width:"18px",
        height:"18px"
      }
      let obj1 = {
        width:"24px",
        height:"24px"
      }
        return (
            <div className="header-left">
              <div className={[sideBarShow?"header-svg header-svg-red":"header-svg",themeObj.sideShowPosition?"header-svg-show":""].join(" ")} onClick={self.svgClick.bind(this)}>
                {sideBarShow || themeObj.headerTheme==="dark"?
                <img id="headerSvg1"src={require(`static/images/icon_menu_white.svg`)} />
                :<img id="headerSvg2" src={require(`static/images/icon_menu.svg`)}  />
                }
                { /*<svg className="icon" style={sideBarShow?obj1:obj}>
               <use xlinkHref={sideBarShow?'#icon-logo1':'#icon-logo'}></use>
                </svg>*/}
              </div>
              <div className="header-search">
                <input type="text" placeholder={this.props.placeholder} value={sideSearchVal} onChange={(e)=>{self.searchInput(e)}} onKeyUp={(event) => {self.inputDown(event)}}/>
                <i className = "uf uf-search" onClick={self.searchSideClick} />
                {/*this.searchHtmlFun()*/}
                {
                  sideSearchShow?
                  sideSearchList.length>0?<ul className="search-info">
                  {
                    sideSearchList.map((item)=>{
                      return <li><a href="javascript:void(0)" onClick={()=> this.searchTabClick(item)} title={item['name'+locale_serial]}>{item['name'+locale_serial]}</a></li>
                    })
                  }
                  </ul>:<ul className="search-info search-info-no-data"><li><FormattedMessage id="header.search.noData" defaultMessage="无数据"/></li></ul>
                  :''
                }
                {/*
                  (sideSearchShow && sideSearchList.length>0)?
                  <ul className="search-info">
                  {
                    sideSearchList.map((item)=>{
                      return <li><a href="javascript:void(0)" onClick={()=> this.searchTabClick(item)} title={item.name}>{item.name}</a></li>
                    })
                  }
                  </ul>:(!sideSearchShow && sideSearchList.length!==0)?<ul className="search-info"><li><FormattedMessage id="header.search.noData" defaultMessage="无数据"/></li></ul>:''
              */}
              </div>

              {/*
                <Select
                  defaultValue='0'
                  value={selectVal}
                  style={{ marginRight: 6 , width: 100}}
                  onChange={this.themeChange}
                  showSearch={true}
                >
                  <Option value="2">浅色主题</Option>
                  <Option value="1">深色主题</Option>
                  <Option value="0">中兴</Option>
                </Select>
              */}
            </div>
        );
    }
}
export default HeaderLeft;
