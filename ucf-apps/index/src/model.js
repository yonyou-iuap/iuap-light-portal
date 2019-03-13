import {actions} from "mirrorx";
// 引入services，如不需要接口请求可不写
import * as api from "./service";
// 接口返回数据公共处理方法，根据具体需要
import { processData } from "utils";


export default {
    // 确定 Store 中的数据模型作用域
    name: "app",
    // 设置当前 Model 所需的初始化 state
    initialState: {
        current: '',//单选选中的key
        openKeys: [],//菜单打开的key
        currentRouter:'',//当前的路由地址
        menu: [],//侧边栏菜单
        expanded: false,//是否展开
        firstUrl: '',
        curentOpenKeys: [],//菜单当前打开的key
        submenuSelected: '',//子菜单选中的key
        isOpenTab: true,//是否是多页签打开
        menus:[],//显示的多页签
        tabNum:0,//多页签数量
        showNotice:0,//是否显示多页签限制的通知
        curNum:0,//当前页签的数量
        num:0,
        clientHeight:document.body.clientHeight,
        reload:0,
        sideBarShow: false,
        tabsMore: false,
        showHeader: true,
        maxed:false,
        sideShowPosition: ''
    },
    reducers: {
        /**
         * 纯函数，相当于 Redux 中的 Reducer，只负责对数据的更新。
         * @param {*} state
         * @param {*} data
         */
        updateState(state, data) { //更新state
            return {
                ...state,
                ...data
            };
        }

    },
    effects: {
        /**
         * 加载菜单数据
         * @param {*} param
         * @param {*} getState
         */
        async loadList(param, getState) {
            // 正在加载数据，显示加载 Loading 图标

            // 调用 getList 请求数据
            let res = processData(await api.getList());
            let data ;
            if(!res || !res.data){
                data = [{
                    "location" : "pages/default/index.js",
                    "name" : "首页",
                    "menustatus" : "Y",
                    "children" : null,
                    "icon" : "iconfont icon-C-home",
                    "openview" : "curnpage",
                    "menuId" : "M0000000000002",
                    "urltype" : "plugin",
                    "id" : "index",
                    "isDefault" : null,
                    "licenseControlFlag" : 0
                }]
            }else{
                data = res.data;
            }
            actions.app.updateState({
                menu: data,
                num:data?data.length:0
            });

            return data;
        },


        /**
         * 加载用户菜单数据
         * @param {*} param
         * @param {*} getState
         */
        async loadUserMenuList(param, getState) {
            // 正在加载数据，显示加载 Loading 图标

            // 调用 loadUserMenuList 请求数据
            let res = processData(await api.loadUserMenuList());

            actions.app.updateState({
                userMenus: res.data,
            });

            return res.data;
        },
        /**
         * 加载未读消息
         * @param {*} param
         * @param {*} getState
         */
        async loadUnReadMsg(param, getState) {
            // 正在加载数据，显示加载 Loading 图标

            // 调用 loadUserMenuList 请求数据
            let res = processData(await api.loadUnReadMsg());


            return res.data;
        },
        /**
         * 获取消息推送配置
         * @param {*} param
         * @param {*} getState
         */
        async getWebPushInfo(param, getState) {
            // 正在加载数据，显示加载 Loading 图标

            // 调用 loadUserMenuList 请求数据
            let res = processData(await api.getWebPushInfo());


            return res.data;
        }
    }
};
