const path = require('path');
const glob = require('glob');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const srcPath = path.resolve(__dirname, './src');
// const filePath = path.join(__dirname, 'src')
// fs.readdir(filePath,function(err,data){
//   console.log(data)
// })

function getEntries (cwd) {
  
  
  var files = glob.sync('**/*.js',{cwd});
  
  var _entries = {}, entry, dirname, basename;

  for (var i = 0; i < files.length; i++) {
      entry = files[i];
      
      
      dirname = path.dirname(entry);
      basename = path.basename(entry, '.js');
      _entries[path.join(dirname, basename)] = cwd+'/'+entry;
  }
  console.log(_entries)
  return _entries;
  }

function getHtml(entry){
  Object.keys(entry).forEach(pathname => {
    
    let conf = {
      filename: pathname+'.html',
      template: path.join(__dirname, 'src/index.html'),
      chunks: ['vendor','commons',pathname],//只注入当前页面的静态资源
      hash: true
      // template: path.join(__dirname, 'src', pathname, 'html', 'index.html')
    }
    
    config.plugins.push(new HtmlWebpackPlugin(conf))
  })
}
const entry = getEntries(srcPath);




//了解splitChunk
var config = {
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  },
  entry,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  devtool: false,
  module:{
    rules: [
      {
        test:/\.css$/,
        use: ExtractTextPlugin.extract({
          use:'css-loader',
          fallback:'style-loader'
        })
      },
      {
        test:/\.js$/,
        exclude:/(node_modules|bower_components)/,
        use:{
          loader: 'babel-loader'
        }
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'vue-loader'
      },
    ]
  },
  resolve: {
    extensions: [ '.js','.vue'],
    alias: {
      // lib: path.join(__dirname, 'src/lib'),
      utils: path.join(__dirname, 'src/utils')
    }
  },
optimization: {

    splitChunks: {
        cacheGroups: {
            // commons: {
            //     chunks: 'initial',
            //     minChunks: 2,
            //     maxInitialRequests: 5,
            //     minSize: 0
            // },
            vendor: { // 将第三方模块提取出来
                test: /[\\/]node_modules[\\/]/,
                chunks: 'initial',
                name: 'vendor',
                priority: 10, // 优先
                enforce: true
            }
        }
    }
},
  plugins:[
   // new HtmlWebpackPlugin({
   //    template: path.join(__dirname, 'src/index.html')
   //  }),//自动生成html文件
     new CleanWebpackPlugin(),
     new VueLoaderPlugin(),
     new ExtractTextPlugin("[name].css"),
     new webpack.SourceMapDevToolPlugin(),
   ]
};
getHtml(entry);
module.exports=(env,argv)=>{
  // console.log(env,argv)
  return config
}