import React, { Component } from 'react';
import ReactDOM from 'react-dom';
class LoginModal extends Component {
    constructor(props){
        super(props);
        this.isFixed = false;
    }

    componentWillMount(){
        /*
         * 初始状态为false的情况下，默认不可见;
         * 为防止fadeOut触发，做以下操作。
         * */
        if( this.props.visible ){
            this.isFixed = true;
            this.render    = this.renderCurrent;
        }
    }

    componentWillReceiveProps(np){
       
        if( this.props.visible !== np.visible ){
            if( !this.isFixed ){
                this.render    = this.renderCurrent;
                this.isFixed = true;
            }else{
                this.render    = this.renderNull;
                this.isFixed = false;
            }
        }
        
    }
    compute = (step,length) =>{
        if(typeof(step)=="undefined"){
            return 0;
        }else{
            return step<length-1?length-1:step;
        }
    }
    renderCurrent(){
        const { className,children,step} = this.props;
        const classNameCon =className? "modal"+className:"modal";
        const sstep = this.compute(step,children.length);
        console.log(sstep);
        return <div className={classNameCon}>
            <div className="content">
                {children.length===undefined?children:children[step]}
            </div>
        </div>
    }
    renderNull(){
        return null;
    }
    render(){
        return <div/>
    }
}
export default LoginModal;