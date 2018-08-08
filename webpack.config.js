const HtmlWebpackPlugin = require('html-webpack-plugin');//这个插件的作用是根据模板自动生成index文件
const webpack = require('webpack')
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin') //vue-loader的使用
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')//webpack错误提示工具
const ExtractTextPlugin =require('extract-text-webpack-plugin')
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
                loader: 'vue-loader',   
                
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                limit: 10000,
                name: path.posix.join("static",'img/[name].[hash:7].[ext]')
                }
            },
            
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                limit: 10000,
                name: path.posix.join("static",'fonts/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.scss$/,
                use: [
                  'vue-style-loader',
                  'css-loader',
                  'sass-loader'
                ]
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
   devtool: "cheap-module-eval-source-map",//主要用于更快的构建速度，详情见http://www.css88.com/doc/webpack2/configuration/devtool/
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