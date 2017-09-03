const WebpackMd5Hash = require ( 'webpack-md5-hash' );
const webpack = require('webpack');
const Express         = require ( 'express' )
const DashboardPlugin = require ( 'webpack-dashboard/plugin' )

const webpackConfig = {
  entry:Object.assign({},{
    a:['webpack-hot-middleware/client?path=/__webpack_hmr&reload=true','./a.js'],
    b:['webpack-hot-middleware/client?path=/__webpack_hmr&reload=true','./b.js'],
  }),
  resolve:{
    extensions:['.js']
  },
    
  output:{
    path:"/",
    filename:"[name].js",
  },

  devtool:'inline-source-map',
  plugins:[
    new WebpackMd5Hash(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    /* Removing CommonsChunkPlugin resolves the issue */
    new webpack.optimize.CommonsChunkPlugin({
      names:['manifest'],
      filename:"[name].js",
      minChunks:Infinity,
    }),
  ]
}

const webpackCompiler = webpack(webpackConfig);
webpackCompiler.apply(new DashboardPlugin());

const serverOptions = {
  contentBase:"http://localhost:8080",
  quiet:false,
  noInfo:false,
  hot:true,
  inline:true,
  watchOptions:{
    aggregateTime:300,
    poll:false,
    ignored:/node_modules/
  },
  lazy:false,
  stats:{colors:true}
}

const app = new Express();
app.use(require('webpack-dev-middleware')(webpackCompiler,serverOptions));
app.use(require('webpack-hot-middleware')(webpackCompiler))

app.listen(8080,function listenining(err){
  if(err){
    console.error(err);
  }else{
    console.info('webpack read');
  }
})
