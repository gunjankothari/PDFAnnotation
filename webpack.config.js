var HtmlWebpackPlugin = require( 'html-webpack-plugin' ),
    ExtractTextPlugin = require( 'extract-text-webpack-plugin' ),
    webpack = require( 'webpack' ),
    path = require( 'path' ),
    publicPath = '/dist',
    isProd = process.env.NODE_ENV === 'production';

var cssDev = ['style-loader', 'css-loader'];
var cssProd = ExtractTextPlugin.extract( {
    fallback   : 'style-loader',
    loader     : ['style-loader', 'css-loader']
} );

var prodPlugins = [
    new HtmlWebpackPlugin( {
        title         : 'HireValley',
        minify        : {
            collapseWhitespace : true
        },
        hash          : true,
        excludeChunks : [],
        template      : './src/index.ejs'
    } ),
    new ExtractTextPlugin( {
        filename  : 'app.css',
        disable   : false,
        allChunks : true
    } ),
    new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        sourceMap: true,
        mangle: {
            screw_ie8: true,
            keep_fnames: true
        },
        compress: {
            screw_ie8: true
        },
        comments: false
    })
];

var devPlugins = [
    new HtmlWebpackPlugin( {
        title         : 'HireValley',
        minify        : {
            collapseWhitespace : true
        },
        hash          : true,
        excludeChunks : [],
        template      : './src/index.ejs'
    } ),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),

];

var cssConfig = isProd ? cssProd : cssDev;

// define the entry based on environment
// don't include hot module stuff for the production environment
var entry = isProd
    ? {
        app : "./src/index.js"
    }
    : {
        app : ['react-hot-loader/patch', "./src/index.js",
            'webpack/hot/only-dev-server',
            'webpack-dev-server/client?http://localhost:8888']
    };

module.exports = {
    entry     : entry,
    output    : {
        path       : path.join( __dirname, '/dist' ),
        filename   : "[name].bundle.js",
        publicPath : ''
        // sourceMapFilename: '[name].map'
    },
    // devtool: 'inline-source-map',
    devtool   : 'source-map',
    module    : {
        rules : [
            {
                test : /\.css$/,
                use  : cssConfig
            },
            {
                test : /\.(jpg|png|gif|ico)$/,
                use  : 'file-loader'
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-0'],
                    plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties'],
                }
            },
            {
                test : /\.(woff|woff2|eot|ttf|svg)$/,
                use  : {
                    loader  : 'url-loader'

                }
            }
        ]
    },
    devServer : {
        contentBase : path.join( __dirname, '' ),
        compress    : true,
        port        : 8888,
        hot         : true,
        stats       : 'errors-only',
        publicPath  : ''
        // open: true
    },
    plugins   : isProd ? prodPlugins : devPlugins
};
