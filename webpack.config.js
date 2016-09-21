var debug = process.env.NODE_ENV !== "production";
console.log("debug is "+debug);
var webpack = require('webpack');
module.exports = {
    entry: debug ? [
        'webpack/hot/only-dev-server',
        "./js/app.js"
    ] : [
        "./js/Voice.js"
    ],
    output: {
        path: './',
        filename: "json-to-web-audio.js"
    },
    module: {
        loaders: [
            { test: /\.js?$/, loaders: ['babel'], exclude: /node_modules/ },
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
            { test: /\.css$/, loader: "style!css" },
            {test: /\.less/,loader: 'style-loader!css-loader!less-loader'}
        ]
    },
    resolve:{
        extensions:['','.js','.json']
    },
    plugins: [
      new webpack.NoErrorsPlugin()
    ]
};
