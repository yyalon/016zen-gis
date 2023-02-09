/* eslint-disable space-before-function-paren */
'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'GMS' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 4000 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  publicPath: '/zen-gis/',
  outputDir: 'dist',
  assetsDir: 'static',
  // Paths
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/dev': {
        target: 'http://localhost:8040',
        changeOrigin: true,
        pathRewrite: {
          '^/dev': ''
        }
      }
    }
  },
  configureWebpack: config => {
    let plugins = []
    const cesiumSourcePath = 'node_modules/mars3d-cesium/Build/Cesium/' // cesium库安装目录
    const cesiumRunPath = './lib/mars3d-cesium/' // cesium运行时路径

    plugins = [
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify(
          path.join(config.output.publicPath, cesiumRunPath)
        )
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(cesiumSourcePath, 'Workers'),
            to: path.join(config.output.path, cesiumRunPath, 'Workers')
          },
          {
            from: path.join(cesiumSourcePath, 'Assets'),
            to: path.join(config.output.path, cesiumRunPath, 'Assets')
          },
          {
            from: path.join(cesiumSourcePath, 'ThirdParty'),
            to: path.join(config.output.path, cesiumRunPath, 'ThirdParty')
          },
          {
            from: path.join(cesiumSourcePath, 'Widgets'),
            to: path.join(config.output.path, cesiumRunPath, 'Widgets')
          },
          {
            from: path.join(cesiumSourcePath, 'Cesium.js'),
            to: path.join(config.output.path, cesiumRunPath, 'Cesium.js')
          }
        ]
      }),
      new NodePolyfillPlugin()
    ]

    return {
      externals: { 'mars3d-cesium': 'Cesium' },
      module: { unknownContextCritical: false }, // 配置加载的模块类型，cesium时必须配置
      plugins: plugins
    }
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module.rule('svg').exclude.add(resolve('src/icons')).end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config.when(process.env.NODE_ENV !== 'development', config => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk('single')
    })
  }
}
