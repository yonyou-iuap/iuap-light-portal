import React, { Component } from 'react';
import ReactDOM from 'react-dom';
class MadalContent extends Component{   
    render(){
        const {className,children} = this.props;
        
        const classNameCon = className? "modal-content "+className:"modal-content";
        return <div className={classNameCon}>{children}</div>
    }
}
export default MadalContent;
