const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
var config = {
  devServer: {
    contentBase: path.resolve(__dirname, 'demo'),
    compress: true
  },
  entry:{index:'./src/index.js'},
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: '[name].js',
    library: 'libraryName',//此处更新为实际component名称
    publicPath: '/',
    libraryTarget: 'umd'
  },
  devtool: false,
  module:{
    rules: [
      {
        test:/\.css$/,
        use: ExtractTextPlugin.extract({
          use:['css-loader', {
            loader:"postcss-loader",
            options: {
                plugins: (loader) => [
                    autoprefixer(), 
                ]
            }
          }, 'sass-loader'],
          fallback:'style-loader'
        })
      },
      {
        test:/\.js$/,
        exclude:/(node_modules|bower_components)/,
        use:[{
          loader: 'babel-loader'
        },
        {
          loader: 'eslint-loader',
          options: { // 这里的配置项参数将会被传递到 eslint 的 CLIEngine 
            include: [path.resolve(__dirname, 'src')], // 指定检查的目录
            enforce: 'pre',
            formatter: require('./.eslintrc.js') // 指定错误报告的格式规范
          }
        }]
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        use: ['vue-loader',{
          loader: 'eslint-loader',
          options: { // 这里的配置项参数将会被传递到 eslint 的 CLIEngine 
            include: [path.resolve(__dirname, 'src')], // 指定检查的目录
            enforce: 'pre',
            formatter: require('./.eslintrc.js') // 指定错误报告的格式规范
          }
        }]
      },
    ]
  },
  externals: {
    vue: 'vue'
  },
  resolve: {
    extensions: [ '.js','.vue'],
  },

  plugins:[
     
     new VueLoaderPlugin(),
     new ExtractTextPlugin("[name].css"),
     new webpack.SourceMapDevToolPlugin(),
   ]
};

function getConfig(env,dev){

  if(dev==true){
    config.entry='./demo/index.js'
    config.output={
      path: path.resolve(__dirname, 'demo'),
      filename: '[name].bundle.js',
      
      publicPath: '/',

    }
    config.plugins.push(
      new HtmlWebpackPlugin({
       template: path.resolve(__dirname, 'demo/index.html')
      })//自动生成html文件
    )

    config.resolve= {
      extensions: [ '.js','.vue'],
      alias: {
        '@hy/components': path.resolve(__dirname, 'src'),
      }
    }
    config.module = {
    rules: [
      {
        test:/\.css$/,
        use: ExtractTextPlugin.extract({
          use:['css-loader', {
            loader:"postcss-loader",
            options: {
                plugins: (loader) => [
                    autoprefixer(), 
                ]
            }
          }, 'sass-loader'],
          fallback:'style-loader'
        })
      },
      {
        test:/\.js$/,
        exclude:/(node_modules|bower_components)/,
        loader: 'babel-loader'        
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'vue-loader'
      },
    ]
  }
    config.externals={}
  }else{

    config.plugins.push(
      new CleanWebpackPlugin()
    )
  }
  return config
}

module.exports=(env,argv)=>{
  
  return getConfig(env,argv.dev)
}