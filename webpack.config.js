const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: './app/src/app.js',
    devtool: 'source-map',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new CopyWebpackPlugin([
            {from: './app/index.html', to: 'index.html'},
            {from: './app/assets', to: 'assets'}
        ]),
        new BundleAnalyzerPlugin({
            analyzerMode: "static"
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: '/node_modules/',
                loader: "babel-loader"
            }
        ]
    }
};
