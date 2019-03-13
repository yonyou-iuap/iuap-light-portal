import React,{Component} from "react";
import cookie from "react-cookie";
// import {FormattedMessage, FormattedDate, FormattedNumber} from 'react-intl';

class HeaderCenter extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="header-center">
              <a href="javascript:;">
                <div className={"portal-logo " + cookie.load('u_locale')||'zh_CN'}></div>
                {/* <img src={a } className="portal-logo" /> */}
              </a>
            </div>
        );
    }
}
export default HeaderCenter;
