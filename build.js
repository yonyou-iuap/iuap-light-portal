const fs = require('fs')
const rm = require('rimraf')
const cpr = require('cpr').cpr
const path = require('path')

rm(path.resolve(__dirname, './build'), err => {
  fs.mkdirSync(path.resolve(__dirname, './build'))
  fs.mkdirSync(path.resolve(__dirname, './build/light_frame_fe'))
  fs.mkdirSync(path.resolve(__dirname, './build/light_frame_fe/pages'))
  fs.mkdirSync(path.resolve(__dirname, './build/light_frame_fe/index'))
  fs.mkdirSync(path.resolve(__dirname, './build/light_frame_fe/pages/login'))
  cpr(path.resolve(__dirname, './ucf-publish/index/index.html'), path.resolve(__dirname, './build/light_frame_fe/index.html'), {}, err => {
    cpr(path.resolve(__dirname, './ucf-publish/index/index.css'), path.resolve(__dirname, './build/light_frame_fe/index/index.css'), {}, err => {
      cpr(path.resolve(__dirname, './ucf-publish/index/index.js'), path.resolve(__dirname, './build/light_frame_fe/index/index.js'), {}, err => {
        cpr(path.resolve(__dirname, './ucf-publish/login'), path.resolve(__dirname, './build/light_frame_fe/pages/login'), {}, err => {
          fs.rename('./build/light_frame_fe/pages/login/index.html', './build/light_frame_fe/pages/login/login.html', err => {
            let htmlPath = path.resolve(__dirname + '/build/light_frame_fe/index.html');
            let htmlStr = fs.readFileSync(htmlPath);
            htmlStr = htmlStr.toString().replace(/..\/index/g,'./index')
            fs.writeFileSync(htmlPath, htmlStr);
          })
        })
      })
    })
  })
});