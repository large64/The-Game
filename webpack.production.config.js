const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './app/src/app.js',
    output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new CopyWebpackPlugin([
            {from: './app/index.html', to: 'index.html'},
            {from: './app/assets', to: 'assets'}
        ])
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
