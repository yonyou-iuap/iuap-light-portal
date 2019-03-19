import React, { Component } from 'react';
import { actions } from 'mirrorx';

import './app.less';



class App extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            d: (new Date()).getTime()
        };

    }

    componentWillMount(){
        actions.app.getApps(); // 获取所有的app
        actions.app.getNowApps(); // 获取前n条数据
        setInterval(() => {
            actions.app.getNowApps(); // 获取前n条数据
        },500)
        
    }
    componentDidMount(){
        let d = this.state.d;
        let n = (new Date()).getTime();
        // console.log('did mount Time' + (n - d));
    }
    
    componentWillUpdate(){
        let d = this.state.d;
        let n = (new Date()).getTime();
        // console.log('will update Time' + (n - d));
    }
    componentDidUpdate(){
        let d = this.state.d;
        let n = (new Date()).getTime();
        // setTimeout(() => {
        //     actions.app.getNowApps(); // 获取前n条数据
        // },300)
        // console.log('did update Time' + (n - d));
    }
    
    render() {
        let {renderList,allList} = this.props; 
        // console.log('render')
        // console.log(allList.length)
        return (
            <div class="contentDiv">
                {
                    renderList.map(function(group){
                        return (
                            <div class="groupDiv">
                                <div class="groupTitle">{group.groupName}</div>
                                <div class="groupContent">
                                    {
                                        group.apps.map(function(app){
                                            return (
                                                <div class="app">{app.appName}</div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        )
                    })
                }
                {
                    allList && allList.length > 0? <div class="loading"> 还在加载中</div>: ''
                }
                
            </div>
        )
    }
}

export default App;
