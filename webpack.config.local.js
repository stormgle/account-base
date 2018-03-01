const path = require("path");
const nodeExternals = require('webpack-node-externals');

module.exports = {
    target: 'node',
    externals: [nodeExternals()],
    mode: 'development',
    entry: {
        "signup.local": "./src/signup.local.js"
    },   
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, ".build/local/"),
        filename: "[name].bundle.js"
    }
};
