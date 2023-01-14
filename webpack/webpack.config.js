"use strict";

const { merge } = require("webpack-merge");

const common = require("./webpack.common.js");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const config = (env, argv) =>
	merge(common, {
		devtool: "cheap-module-source-map",
		entry: {
			background: path.resolve(__dirname, "..", "src", "background.ts"),
			content: path.resolve(__dirname, "..", "src", "content.ts"),
		},
		output: {
			path: path.join(__dirname, "../build"),
			filename: "[name].js",
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					loader: "ts-loader",
					exclude: /node_modules/,
					options: {
						transpileOnly: true,
					},
				},
			],
		},
		plugins: [
			new CopyPlugin({
				patterns: [{ from: ".", to: ".", context: "public" }],
			}),
		],
	});

module.exports = config;
