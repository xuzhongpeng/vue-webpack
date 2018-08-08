

> node -v  
> 10.4.0  
> npm -v  
> 6.1.0

# 必备工具

电脑全局已安装node、npm、webpack，详细安装过程自行百度。

# step one

新建项目目录
进入cmd,cmd目录指定到项目目录
```
mkdir myVueTest
cd myVueTest
```
创建npm项目
```
npm init
```
# step two

下载vue、webpack必备依赖以及es6解析工具babel及webpack解析loader
```json
"devDependencies": {
    "babel-core": "^6.26.3",//babel核心api
    "babel-loader": "^7.1.5",//babel基于webpack主要用于解析的loader
    "babel-plugin-transform-runtime": "^6.23.0",//避免重复打包代码
    "babel-preset-env": "^1.7.0",//babel-preset-*表示一系列转码插件
    "babel-preset-es2015": "^6.24.1",
    "babel-runtime": "^5.8.38", //babel-plugin-transform-runtime基于此依赖
    "css-loader": "^1.0.0",
    "friendly-errors-webpack-plugin": "^1.7.0",//webpack错误提示工具
    "html-webpack-plugin": "^3.2.0",//定义项目依赖的模板工具
    "vue-hot-reload-api": "^2.3.0",//vue热加载api
    "vue-loader": "^15.2.4",
    "vue-router": "^3.0.1",//vue的路由插件
    "vue-style-loader": "^4.1.0",//vue的样式打包loader
    "vue-template-compiler": "^2.5.16",//vue的模板预编译工具
    "node-notifier": "^5.2.1",//node提示工具，主要用于webpack报错提示
    "webpack": "^4.15.1",
    "webpack-cli": "^3.0.8",
    "webpack-dev-server": "^3.1.4"
  },
  "dependencies": {
    "vue": "^2.5.16"
  }
```
> package.json不可加注释，如要直接引用需去掉注释

新建文件夹dist、src等如下
```
|_myVueTest
|__dist //存放打包后的文件
|__src  //项目编写目录
|___App.vue  //第一个vue模板文件，编写内容是否成功
|___main.js  //入口文件
|__index.html //vue的模板文件（为空的html5）
|__package.json  //npm安装依赖文件
|__webpack.congfig.js  //webpack配置
```
在App.vue中添加：

```
<template>
    <div>
        hello, my vue
    </div>
</template>

<script>

export default {

}
</script>

<style>

</style>
```

在main.js中添加

```javascript
import Vue from 'vue' //引入vue
import App from './App.vue' 
Vue.config.productionTip = false //阻止vue在启动时生成的生产提示

new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})

```

# step three

配置webpack

在webpack.config.js中配置
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');//这个插件的作用是根据模板自动生成index文件
const webpack = require('webpack')
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin') //vue-loader的使用
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
module.exports = {
    mode:'development',
    // 入口文件，path.resolve()方法，可以结合我们给定的两个参数最后生成绝对路径，最终指向的就是我们的index.js文件
    context: path.resolve(__dirname, './'),
    entry:  './src/main.js',
    // 输出配置
    output: {
        // 输出路径是 myProject/output/dist
        path: path.resolve(__dirname, './dist'),
        publicPath: '',
        filename: './static/[name].js',
        chunkFilename: '[id].[chunkhash].js'
    },
    resolve: {
        extensions: [ '.js', '.vue'],  //同时打包.vue文件
        alias:{
            'vue$':'vue/dist/vue.min.js'    //非常重要！！！，主要是改变import vue时的vue指向，默认是指向vue.runtime.js，但vue.runtime.js并不适用于此vue运行的项目
        }
    },
    module: {
        
        rules: [
            // 使用vue-loader 加载 .vue 结尾的文件
            {
                test: /\.vue$/, 
                loader: 'vue-loader'   
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
              }
        ]
    },
    plugins:[//需要用到的插件
       new HtmlWebpackPlugin({//模板编译
           template:'template.html',//根据哪个模板
           filename:'index.html'//要生成的文件
       }),
       new VueLoaderPlugin(),
       new webpack.HotModuleReplacementPlugin(),//热更新
       new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [`Your application is running here: http://localhost:8080`],
          },
          onErrors: (severity, errors) => {
              if (severity !== 'error') return
          
              const error = errors[0]
              const filename = error.file && error.file.split('!').pop()
          
              notifier.notify({
                title: packageConfig.name,
                message: severity + ': ' + error.name,
                subtitle: filename || '',
                icon: path.join(__dirname, 'logo.png')
              })
            
          }
        })
   ],
   devtool: "cheap-module-eval-source-map",//主要用于更快的构建速度，详情见http://www.css88.com/doc/webpack2/configuration
   devServer:{//webpack-dev-server相关配置
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join("static", 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: "localhost",
    port: 8080,
    open: false,
    overlay:  {warnings: false, errors: true },
    publicPath: "/",
    proxy: {},
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: false,
    }
  },
}

```
# step four

ok大功告成了，现在来启动webpack-dev-server
```shell
webpack-dev-server --inline --progress
```

当然你也可以在package.json中配置

```json
"scripts": {
    "start": "webpack-dev-server --inline --progress",
    ……
  },
```
然后
```shell
npm start
```
打开浏览器输入 
```
http://localhost:8080
```
显示
![image](http://www.xuzhongpeng.top/images/webpack构建vue项目/result.png)