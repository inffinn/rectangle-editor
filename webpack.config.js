const webpack = require("webpack")
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const path = require("path")
//const sourcePath = path.join(__dirname, '../src');

process.noDeprecation = true

module.exports = {
    entry: "./src/components/App.tsx",
    output: {
        path: path.join(__dirname, 'dist', 'assets'),
        filename: "bundle.js",
        sourceMapFilename: 'bundle.map'
    }, watch: true, mode: "production",
    devtool: 'source-map',
            optimization: {
        minimize: true,
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'main',
                    test: /\.scss$/,
                    chunks: 'all',
                    enforce: true
                }
            }
        },
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    sourceMap: true,
                    test: /\.js($|\?)/i,
                    //include: /\/includes/,
                    exclude: /\/excludes/,
                    parallel: true,
                    compress: true
                }})]
    },


    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader'
                    },
                    {
                        loader: 'awesome-typescript-loader'
                    }
                ]
            },
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre"
            },
        //     {
        //     test: /\.scss$/,
        //         use: [ process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
        //              {
        //                 loader: "css-loader", options: {
        //                     sourceMap: true
        //                 }
        //             }, {
        //                 loader: "sass-loader", options: {
        //                     sourceMap: true
        //                 }}]
        // }
            {test: /\.scss$/,
                use: [ process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader", options: {
                            sourceMap: true
                        }
                    }, {
                        loader: "sass-loader", options: {
                            sourceMap: true
                        }}]},
             /*{ 
             test: /\.scss$/,
             use: [
             {
             loader: MiniCssExtractPlugin.loader, 
             options: {
             // you can specify a publicPath here
             // by default it use publicPath in webpackOptions.output
             publicPath: '../'
             }
             },   "css-loader","sass-loader"
             ]
             }*/
        ]


    },resolve: {
        extensions: ['.ts', '.tsx', '.js']
 },
    plugins: [
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
            DEBUG: false
        }),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("development")
            }
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
                  new webpack.DefinePlugin({
                 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
                 }),
    ],

}
