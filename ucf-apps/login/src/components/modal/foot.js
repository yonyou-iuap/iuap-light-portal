import React, { Component } from 'react';
import ReactDOM from 'react-dom';
class MadalFoot extends Component{
    render(){
        const {className,children} = this.props;
        const classNameCon = className? "modal-foot "+className:"modal-foot";
        return <div className={classNameCon}>{children}</div>
    }
}
export default MadalFoot;
