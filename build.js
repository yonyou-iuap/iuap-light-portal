const fs = require('fs')
const rm = require('rimraf')
const cpr = require('cpr').cpr
const path = require('path')
const packageName = require('./ucf.config.js')().global_env.GROBAL_PACKAGE_NAME.replace(/"/g,'');
rm(path.resolve(__dirname, './build'), err => {
  fs.mkdirSync(path.resolve(__dirname, './build'))
  fs.mkdirSync(path.resolve(__dirname, './build/' + packageName))
  fs.mkdirSync(path.resolve(__dirname, './build/' + packageName + '/pages'))
  fs.mkdirSync(path.resolve(__dirname, './build/' + packageName + '/index'))
  fs.mkdirSync(path.resolve(__dirname, './build/' + packageName + '/pages/login'))
  cpr(path.resolve(__dirname, './ucf-publish/iuap-lightportal-fe/index/index.html'), path.resolve(__dirname, './build/' + packageName + '/index.html'), {}, err => {
    cpr(path.resolve(__dirname, './ucf-publish/iuap-lightportal-fe/index/index.css'), path.resolve(__dirname, './build/' + packageName + '/index/index.css'), {}, err => {
      cpr(path.resolve(__dirname, './ucf-publish/iuap-lightportal-fe/index/index.js'), path.resolve(__dirname, './build/' + packageName + '/index/index.js'), {}, err => {
        cpr(path.resolve(__dirname, './ucf-publish/iuap-lightportal-fe/login'), path.resolve(__dirname, './build/' + packageName + '/pages/login'), {}, err => {
          fs.rename('./build/' + packageName + '/pages/login/index.html', './build/' + packageName + '/pages/login/login.html', err => {
            // let htmlPath = path.resolve(__dirname + '/build/' + packageName + '/pages/login/login.html');
            // let htmlStr = fs.readFileSync(htmlPath);
            // htmlStr = htmlStr.toString().replace(/..\/iuap-lightportal-fe\//g,'')
            // fs.writeFileSync(htmlPath, htmlStr);

            let htmlPath = path.resolve(__dirname + '/build/' + packageName + '/index.html');
            let htmlStr = fs.readFileSync(htmlPath);
            htmlStr = htmlStr.toString().replace(/..\/index/g,'./index')
            fs.writeFileSync(htmlPath, htmlStr);

            var d = new Date();
            var dateStr = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
            var addStr = '//  date:  ' + dateStr + '\r\n';
            var addDateStr = function(fsPath){
              var str1 = fs.readFileSync(path.resolve(__dirname, fsPath)).toString();
              str1 = addStr + str1;
              fs.writeFileSync(path.resolve(__dirname, fsPath), str1);
            }

            addDateStr('./build/' + packageName + '/index/index.js')
            addDateStr('./build/' + packageName + '/pages/login/index.js')
          })

          
        })
      })
    })
  })
});