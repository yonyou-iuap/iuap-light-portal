/**
 * 数据模型类
 */
import { actions } from "mirrorx";

export default {
    // 确定 Store 中的数据模型作用域
    name: "app",
    // 设置当前 Model 所需的初始化 state
    initialState: {
        allList: [],
        renderList: []
    },
    reducers: {
        /**
         * 纯函数，相当于 Redux 中的 Reducer，只负责对数据的更新。
         * @param {*} state
         * @param {*} data
         */
        updateState(state, data) {
            return {
                ...state,
                ...data
            };
        }
    },
    effects: {

        /**
         * 获取语种列表
         */
        async getApps() {
            let allList = [];
            let group = {}
            let maxLength = 20
            for(let i = 0; i < maxLength; i++){
                group = {
                    groupName: 'group' + i,
                    apps: []
                }
                for(let j = 0; j < maxLength; j++){
                    let app = {
                        appName: 'group' + i + 'app' + j
                    }
                    group.apps.push(app)
                }
                allList.push(group);
            }
            actions.app.updateState({
                allList: allList,
                // renderList: allList // 用于测试初始状态
            });
        },

        async getNowApps(params, getState){
            let allList = getState().app.allList;
            let renderList = getState().app.renderList;
            let renderListlength = renderList.length;
            let LastRenderGroup = {}
            if(renderListlength > 0){
                LastRenderGroup = renderList[renderListlength -1];
            } 
            let max = 45;
            let nowIndex = 0;
            for(let i  = 0; i < allList.length; ){
                let group = allList[i];
                let apps = [].concat(group.apps); 
                let renderGroup = {}
                // 如果之前的未处理完则继续处理，否则创建新的对象
                if(i === 0 && LastRenderGroup.groupName === group.groupName){
                    renderGroup = LastRenderGroup;
                }else{
                    renderGroup = Object.assign({},group); 
                    renderGroup.apps = [];
                    renderList.push(renderGroup);
                }   
                
                for(let j = 0; j < apps.length; j++){
                    nowIndex++;
                    group.apps.splice(0,1)
                    if(group.apps.length === 0){
                        allList.splice(0,1)
                    }
                    renderGroup.apps.push(apps[j])
                    if(nowIndex > max){
                        // console.log('getNowApps')
                        // console.log(allList)
                        // console.log(renderList)
                        actions.app.updateState({
                            allList: [].concat(allList),
                            renderList: [].concat(renderList)
                        });
                        return;
                    }
                }
            }
            actions.app.updateState({
                allList: [].concat(allList),
                renderList: [].concat(renderList)
            });

        }
    }
};
