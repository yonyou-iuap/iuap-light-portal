import React, { Component } from 'react';
import ReactDOM from 'react-dom';
class MadalTitle extends Component{
    render(){
        const {className,onClose,children} = this.props;
        const classNameCon = className? "modal-title "+className:"modal-title";
        
        return (<div className={classNameCon}>{children}
                <div className="self-close" onClick={onClose}><i onClick={this.hideVersionCheck} class="uf uf-close-bold"></i></div>
        </div>)
    }
}
export default MadalTitle;
