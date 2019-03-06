import React,{Component} from "react";
// import cookie from "react-cookie";
import {FormattedMessage, FormattedDate, FormattedNumber} from 'react-intl';
import {Navbar,Menu,Badge,Tile,Icon,Tooltip} from 'tinper-bee';
import UserMenus from 'components/UserMenu/UserMenu';

class HeaderRight extends Component {
    constructor(props) {
        super(props);
    }
    maxfunc(e) {
      // debugger;
      // console.log('syt',this.props);
      this.props.headerRightOper.maxfunc(e);
    }
    minifunc(e) {
      this.props.headerRightOper.minifunc(e);
    }
    handleDefault(e) {
      this.props.headerRightOper.handleDefault(e);
      this.props.handleClick(e);
    }
    render() {
      var self = this;
      let {intl, unreadMsg, UserMenuObj} = this.props;
      console.log('syt',unreadMsg);
        return (
            <div className="header-right">
                {!this.props.maxed ?
                  <a id="maxBox" onClick={(e)=>self.maxfunc(e)}   data-ref="taskcenter" name={intl.formatMessage({id: 'tabs.header.max'})} title={intl.formatMessage({id: 'tabs.header.max'})}  className="navbar-avatar" titlekey={intl.formatMessage({id: 'tabs.header.max'})} >
                    <Icon type="uf-maxmize" style={{"fontSize":"18px"}}></Icon>
                  </a>:
                  <a id="maxBox" onClick={(e)=>self.minifunc(e)} data-ref="taskcenter" name={intl.formatMessage({id: 'tabs.header.max'})} title={intl.formatMessage({id: 'tabs.header.max'})}  className="navbar-avatar" titlekey={intl.formatMessage({id: 'tabs.header.max'})} >
                    <Icon type="uf-minimize" style={{"fontSize":"18px"}}></Icon>
                  </a>
                }
                <a id="taskCenterBox" value="taskcenter" onClick={(e)=>self.handleDefault(e)} data-ref="taskcenter" name={intl.formatMessage({id: 'tabs.header.task'})} title={intl.formatMessage({id: 'tabs.header.task'})} href={`${GROBAL_HTTP_CTX}/index-view.html#/taskcenter`} className="navbar-avatar" titlekey={intl.formatMessage({id: 'tabs.header.task'})} >
                  <i className="pap pap-task"></i>
                </a>
                <a id="messageCount" value="msgCenter" onClick={(e)=>self.handleDefault(e)} data-ref="msgCenter" name={intl.formatMessage({id: 'tabs.header.message'})} title={intl.formatMessage({id: 'tabs.header.message'})} href={`${GROBAL_HTTP_CTX}/index-view.html#/msgCenter`} className="navbar-avatar" titlekey={intl.formatMessage({id: 'tabs.header.message'})}>
                  <i className="pap pap-massage u-badge" data-badge={unreadMsg} ></i>
                </a>
              <UserMenus {...UserMenuObj}/>
            </div>
        );
    }
}
export default HeaderRight;
