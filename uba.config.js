const path = require('path');
const hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';
const webpack = require('webpack');
const glob = require("glob");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const OpenBrowserPlugin = require('open-browser-webpack-plugin')
const pathUrl = ''; //http://127.0.0.1:8080 设置host，可选
const context = '/lightportal';//工程节点名称
const contentBase = './build'+context;//打包目录


let entries = {};
let chunks = [];
let prodEntries = {};
let prodChunks = [];
let htmlEntrys = [];

const svrConfig = {
    historyApiFallback: false
};

// 远程代理访问，可以配置多个代理服务：https://github.com/chimurai/http-proxy-middleware
const proxyConfig = [
  {
    enable: true,
    headers: {
      // 这是之前网页的地址，从中可以看到当前请求页面的链接。
      "Referer": "http://172.20.52.123"
      //   "Referer": "http://172.20.17.90:8080"
    },
    // context，如果不配置，默认就是代理全部。
    router: [
      '/wbalone','//wbalone'
    ],
    url: 'http://172.20.52.123'
    //   url:'http://172.20.17.90:8080'
  },
  // 后台开发服务
  {
    enable: true,
    headers: {
      // 这是之前网页的地址，从中可以看到当前请求页面的链接。
      "Referer": 'http://172.20.52.123'
      //   "Referer": "http://172.20.17.90:8080"
    },
    // context，如果不配置，默认就是代理全部。
    router: [
        '/iuap-pap-demo-be','/iuap-pap-demo-fe','/react_example_fe','/iuap-saas-billcode-service','/newref','/pap_basedoc', '/react_example','/example', '/iuap-saas-filesystem-service', '/uitemplate_web', '/eiap-plus', '/iuap-saas-message-center','/reactfe','/iuap-saas-busilog-service','/iuap-eiap-bpm-service','/iuap-saas-dispatch-service','/iuaprmodel','/uui'
    ],
    url: 'http://172.20.52.123'
    //   url:'http://172.20.17.90:8080'
  }
];

const globalEnvConfig = new webpack.DefinePlugin({
  __MODE__: JSON.stringify(process.env.NODE_ENV),
 'process.env.NODE_ENV': JSON.stringify('production'),
  GROBAL_HTTP_CTX: JSON.stringify("/wbalone"),
  GSP_CONTRACT: JSON.stringify("/gsp-contract"),
  GSP_ORDERS: JSON.stringify("/gsp-orders"),
  GSP_SUPPLIER: JSON.stringify("/gsp-supplier")
})

const MINIMIZE_FLAG = (process.env.NODE_ENV == "production") ? true : false;

//提取package里的包
function getVendors() {
  let pkg = require("./package.json");
  let _vendors = [];
  for (const key in pkg.dependencies) {
    _vendors.push(key);
  }
  return _vendors;
}
//优化配置，对于使用CDN作为包资源的引用从外到内的配置
const externals = {
  // 'axios': 'axios',
  // 'react': 'React',
  // 'react-dom': 'ReactDOM',
  //'tinper-bee': 'TinperBee'
}
//默认加载扩展名、相对JS路径模块的配置
const resolve = {
  extensions: [
    '.jsx', '.js', '.less', '.css', '.json'
  ],
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
    modules: path.resolve(__dirname, 'src/pages/'),
    routes: path.resolve(__dirname, 'src/routes/'),
    layout: path.resolve(__dirname, 'src/layout/'),
    utils: path.resolve(__dirname, 'src/utils/'),
    static: path.resolve(__dirname, 'src/static/'),
    src:path.resolve(__dirname, 'src/')
  }
}
//开发需要的loader
const rules = [{
  test: /\.js[x]?$/,
  exclude: /(node_modules)/,
  include: path.resolve('src'),
  use: [{
    loader: 'babel-loader'
  }]
},{
  test: /\.less$/,
  exclude: /(node_modules)/,
  use: ExtractTextPlugin.extract({
    use: ['css-loader', 'postcss-loader', 'less-loader'],
    fallback: 'style-loader'
  })
},{
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
        use: [{
            loader: 'css-loader',
        }, 'postcss-loader'],
        fallback: 'style-loader'
    })
}, {
  test: /\.(png|jpg|jpeg|gif)(\?.+)?$/,
  //exclude: /favicon\.png$/,
  use: [{
    loader: 'url-loader',
    options: {
      limit: 8196,
      name: 'images/[name].[hash:8].[ext]',
      publicPath:pathUrl+context
    }
  }]
}, {
  test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
  use: [{
    loader: 'file-loader',
    options: {
      name: '[name].[hash:8].[ext]',
      outputPath: 'fonts',
      publicPath: pathUrl+context+'/fonts/'
    }
  }]
}]
//生产需要的loader
const prorules = [{
    test: /\.js[x]?$/,
    exclude: /(node_modules)/,
    include: path.resolve('src'),
    use: [{
        loader: 'babel-loader'
    }]
},{
    test: /\.less$/,
    exclude: /(node_modules)/,
    use: ExtractTextPlugin.extract({
        use: ['css-loader', 'postcss-loader', 'less-loader'],
        fallback: 'style-loader'
    })
},{
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
        use: [{
            loader: 'css-loader',
        }, 'postcss-loader'],
        fallback: 'style-loader'
    })
}, {
    test: /\.(png|jpg|jpeg|gif)(\?.+)?$/,
    //exclude: /favicon\.png$/,
    use: [{
        loader: 'url-loader',
        options: {
            limit: 8196,
            name: 'images/[name].[hash:8].[ext]',
            publicPath:pathUrl+context
        }
    }]
}, {
    test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
    use: [{
        loader: 'file-loader',
        options: {
            name: '[name].[hash:8].[ext]',
            outputPath: 'fonts',
            publicPath: pathUrl+'/wbalone/fonts/'
        }
    }]
}]

entries.vendors = prodEntries.vendors = ['babel-polyfill','static/trd/tinper-bee/assets/tinper-bee.css'].concat(getVendors());


glob.sync("./src/pages/**/app.jsx").forEach(path => {
    const chunk = path.split("./src/pages/")[1].split(".jsx")[0];
    entries[chunk] = [path, hotMiddlewareScript];
    chunks.push(chunk);
});



//开发环境的webpack配置
const devConfig = {
  devtool: 'cheap-module-eval-source-map',
  entry: entries,
  output: {
    path: path.resolve(__dirname, contentBase),
    filename:  "[name].js",
    chunkFilename: 'js/[name].[hash:8].bundle.js',
    publicPath: context
  },
  externals: externals,
  module: {
    rules: rules
  },
  plugins: [
      new CommonsChunkPlugin({
          name: "vendors",
          filename:"vendors/[name].js"
      }),
        new ExtractTextPlugin({
          filename: 'vendors/[name].css',
          allChunks: false
        }),
    globalEnvConfig,
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: resolve
}

glob.sync("./src/pages/**/index.html","./src/pages/index.html").forEach(path => {
    const chunk = path.split("./src/pages/")[1].split("/index.html")[0]

    const filename = chunk + "/index.html"
    const key = chunk + "/index";

    const htmlConf = {
        filename: filename,
        template: path,
        inject: false,
        hash: true,
        key: key,
        chunks:['vendors',chunk+'/app'],
        favicon: './src/static/images/favicon.ico'
    };
    htmlEntrys.push(filename);
    devConfig.plugins.push(new HtmlWebpackPlugin(htmlConf));
});



glob.sync("./src/pages/**/app.jsx").forEach(path => {
    const chunk = path.split("./src/pages/")[1].split(".jsx")[0];

    prodEntries[chunk] = [path];
    prodChunks.push(chunk);
});

//生产环境的webpack配置
const prodConfig = {
  devtool: 'source-map',
  entry: prodEntries,
  output: {
    publicPath: pathUrl,
    path: path.resolve(__dirname, contentBase),
    chunkFilename: 'js/[name].[hash:8].bundle.js',
  },
  externals: externals,
  module: {
    rules: prorules
  },
  plugins: [
      new CommonsChunkPlugin({
          name: "vendors",
          filename:"vendors/[name].js"
      }),
    new ExtractTextPlugin({
        filename: 'vendors/[name].css',
        allChunks: true
    }),
    globalEnvConfig,
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false,
        drop_debugger: true,
        drop_console: true
      }
    }),
    new CleanWebpackPlugin(['build']),

    new BundleAnalyzerPlugin({
      analyzerMode: 'static'
    })
  ],
  resolve: resolve
}

glob.sync("./src/pages/**/index.html").forEach(path => {
    const chunk = path.split("./src/pages/")[1].split("/index.html")[0];

    const filename = "index.html";
    const key = chunk + "/index";
    const realPath = prodConfig.output.publicPath + key + '.js';
    const realCssPath = prodConfig.output.publicPath + key + '.css';

    const htmlConf = {
        filename: filename,
        template: path,
        inject: false,
        hash: true,
        key: key,
        chunks:['vendors',chunk+'/app'],
        favicon: './src/static/images/favicon.ico',
        realPath: realPath,
        realCssPath: realCssPath,
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true
        }
    };

    prodConfig.plugins.push(new HtmlWebpackPlugin(htmlConf));
});


//最终向uba导出配置文件
module.exports = {
  devConfig,
  prodConfig,
  svrConfig,
  proxyConfig
};
