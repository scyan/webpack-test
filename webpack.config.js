const path = require('path');
var fs = require('fs');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require('webpack');
var filePath = path.join(__dirname, 'src')
fs.readdir(filePath,function(){})

//了解splitChunk
var config = {
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  },
  entry: {
    index:'./src/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
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
      }
    ]
  },
  plugins:[
  new HtmlWebpackPlugin(),
   new ExtractTextPlugin("[name].css"),
   new webpack.SourceMapDevToolPlugin(),
   ]
};

module.exports=(env,argv)=>{
  // console.log(env,argv)
  return config
}