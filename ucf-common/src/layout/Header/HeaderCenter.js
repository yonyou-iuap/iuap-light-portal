import React,{Component} from "react";
import cookie from "react-cookie";
// import {FormattedMessage, FormattedDate, FormattedNumber} from 'react-intl';
import {getContextId} from 'utils';
const contextId = getContextId();
class HeaderCenter extends Component {
    constructor(props) {
        super(props);
    }
    render() {
      let {themeObj} = this.props;
      let bgImg = `url(${themeObj.headerCenterImg})`
      let className = 'portal-logo';
      if(contextId === 'mdm'){
        bgImg = `url("images/index/logo_mdm.svg")`
        className = 'portal-logo portal-logomdm';
      }
        return (
            <div className="header-center">
              <a href="javascript:;">
                <div className={className} style={{backgroundImage:bgImg ,backgroundSize:'100% 100%',backgroundRepeat:'no-repeat'}}></div>
                {/* <img src={a } className="portal-logo" /> */}
              </a>
            </div>
        );
    }
}
export default HeaderCenter;
