const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	mode: 'development',
	entry: [
		'./src/css/layout.scss',
		'./src/js/index.js'
	],
	output: {
		path: path.resolve(__dirname, './build'),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: '/node_modules/',
				loader: 'babel-loader'
			},
			{
				 test: /\.(sa|sc|c)ss$/,
				 use: [ {
					loader: MiniCssExtractPlugin.loader
				},
					 "css-loader",
					 "sass-loader"
				 ],
			},
			{
				test: /\.(html)$/,
				use: {
					loader: 'html-loader',
					options: {
						attrs: [':data-src'],
						root: './'
					}
				}
			},
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new MiniCssExtractPlugin({
			filename: "build.css"
	}),
		new HtmlWebpackPlugin({ template: './src/index.html' })
	],
	devServer: {
		contentBase: "./build",
		publicPath: "/",
		compress: false,
		port: 9009,
		//inline: false,
		open: 'Google Chrome'
	}
};