require('@babel/polyfill');
const path = require('path');
/**
 * UCF配置文件 更多说明文档请看 https://github.com/iuap-design/ucf-web/blob/master/packages/ucf-scripts/README.md
 */
module.exports = (env, argv) => {
    return {
        // 启动所有模块，默认这个配置，速度慢的时候使用另外的配置
        // bootList: true,
        // 启动这两个模块，启动调试、构建
        bootList: [
            "index",
            "login",
        ],
        // 代理的配置
        proxy: [{
            "enable": true,
            "headers": {
                "Referer": "http://172.20.52.123"
            },
            "router": ["/wbalone", "//wbalone"],
            "url": "http://172.20.52.123"
        }, {
            "enable": true,
            "headers": {
                "Referer": "http://172.20.52.123"
            },
            "router": ["/iuap-pap-demo-be", "/iuap-pap-demo-fe", "/react_example_fe", "/iuap-saas-billcode-service", "/newref", "/pap_basedoc", "/react_example", "/example", "/iuap-saas-filesystem-service", "/uitemplate_web", "/eiap-plus", "/iuap-saas-message-center", "/reactfe", "/iuap-saas-busilog-service", "/iuap-eiap-bpm-service", "/iuap-saas-dispatch-service", "/iuaprmodel", "/uui"],
            "url": "http://172.20.52.123"
        }],
        // 构建资源的时候产出sourceMap，调试服务不会生效
        open_source_map: false,
        // CSS loader 控制选项
        css: {
            modules: false
        },
        // 全局环境变量
        global_env: {
            'process.env.NODE_ENV': JSON.stringify("production"),
            GROBAL_HTTP_CTX: JSON.stringify("/wbalone"),
            GROBAL_PORTAL_ID: JSON.stringify("iuap-lightportal-fe"),
            GROBAL_PACKAGE_NAME: JSON.stringify("iuap-lightportal-fe"),
            GSP_CONTRACT: JSON.stringify("/gsp-contract"),
            GSP_ORDERS: JSON.stringify("/gsp-orders"),
            GSP_SUPPLIER: JSON.stringify("/gsp-supplier"),
        },
        // 静态资源路径
        static: 'ucf-common/src/static', // 别名配置
        //'ucf-apps': path.resolve(__dirname, 'ucf-apps/')
        alias: {
            components: path.resolve(__dirname, "ucf-common/src/components"),
            modules: path.resolve(__dirname, "ucf-common/src/pages"),
            routes: path.resolve(__dirname, "ucf-common/src/routes"),
            layout: path.resolve(__dirname, "ucf-common/src/layout"),
            utils: path.resolve(__dirname, "ucf-common/src/utils"),
            static: path.resolve(__dirname, "ucf-common/src/static"),
            src: path.resolve(__dirname, "ucf-common/src"),
            "ucf-common": path.resolve(__dirname, "ucf-common/"),
            "ucf-apps": path.resolve(__dirname, "ucf-apps/")
        },
        // 构建排除指定包
        externals: {},
        // 加载器Loader
        loader: [],
        // 调试服务需要运行的插件
        devPlugins: [],
        // 构建服务需要运行的插件
        buildPlugins: []
    }
}