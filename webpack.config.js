const path = require('path');
const glob = require('glob');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
// const filePath = path.join(__dirname, 'src')
// fs.readdir(filePath,function(err,data){
//   console.log(data)
// })

function getEntries (root) {
  let globPath = path.join(__dirname,root,'/**/*.js');
  
  var files = glob.sync(globPath);
  
  var _entries = {}, entry, dirname, basename;

  for (var i = 0; i < files.length; i++) {
      entry = files[i];
      
      const relative = path.relative(root,entry)
      dirname = path.dirname(relative);
      basename = path.basename(relative, '.js');
      _entries[path.join(dirname, basename)] = entry;
  }
  console.log(_entries)
  return _entries;
  }

function getHtml(entry){
  Object.keys(entry).forEach(pathname => {
    
    let conf = {
      filename: pathname+'.html',
      template: path.join(__dirname, 'src/index.html'),
      // template: path.join(__dirname, 'src', pathname, 'html', 'index.html')
    }
    
    config.plugins.push(new HtmlWebpackPlugin(conf))
  })
}
const entry = getEntries('src');




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