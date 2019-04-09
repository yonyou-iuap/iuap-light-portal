import React,{Component} from "react";
import cookie from "react-cookie";
// import {FormattedMessage, FormattedDate, FormattedNumber} from 'react-intl';

class HeaderCenter extends Component {
    constructor(props) {
        super(props);
    }
    render() {
      let {themeObj} = this.props;
        return (
            <div className="header-center">
              <a href="javascript:;">
                <div className="portal-logo" style={{backgroundImage:`url(${themeObj.headerCenterImg})`,backgroundSize:'100% 100%',backgroundRepeat:'no-repeat'}}></div>
                {/* <img src={a } className="portal-logo" /> */}
              </a>
            </div>
        );
    }
}
export default HeaderCenter;
