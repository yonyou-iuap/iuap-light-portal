const fs = require('fs')
const rm = require('rimraf')
const cpr = require('cpr').cpr
const path = require('path')

rm(path.resolve(__dirname, './build'), err => {
  fs.mkdirSync(path.resolve(__dirname, './build'))
  fs.mkdirSync(path.resolve(__dirname, './build/iuap-light-portal'))
  fs.mkdirSync(path.resolve(__dirname, './build/iuap-light-portal/pages'))
  fs.mkdirSync(path.resolve(__dirname, './build/iuap-light-portal/index'))
  fs.mkdirSync(path.resolve(__dirname, './build/iuap-light-portal/pages/login'))
  cpr(path.resolve(__dirname, './ucf-publish/index/index.html'), path.resolve(__dirname, './build/iuap-light-portal/index.html'), {}, err => {
    cpr(path.resolve(__dirname, './ucf-publish/index/index.css'), path.resolve(__dirname, './build/iuap-light-portal/index/index.css'), {}, err => {
      cpr(path.resolve(__dirname, './ucf-publish/index/index.js'), path.resolve(__dirname, './build/iuap-light-portal/index/index.js'), {}, err => {
        cpr(path.resolve(__dirname, './ucf-publish/login'), path.resolve(__dirname, './build/iuap-light-portal/pages/login'), {}, err => {
          fs.rename('./build/iuap-light-portal/pages/login/index.html', './build/iuap-light-portal/pages/login/login.html', err => {
            let htmlPath = path.resolve(__dirname + '/build/iuap-light-portal/index.html');
            let htmlStr = fs.readFileSync(htmlPath);
            htmlStr = htmlStr.toString().replace(/..\/index/g,'./index')
            fs.writeFileSync(htmlPath, htmlStr);
          })
        })
      })
    })
  })
});