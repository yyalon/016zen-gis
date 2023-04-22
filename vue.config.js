/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * @description vue.config.js全局配置
 */

const {
  baseURL,
  title,
  devPort,
  assetsDir,
  outputDir,
  lintOnSave,
  publicPath,
  transpileDependencies,
} = require('./src/config')
const dayjs = require('dayjs')
const pkg = require('./package.json')

const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const { resolve, relative } = require('path')
const { defineConfig } = require('@vue/cli-service')
const {
  createVuePlugin,
  createChainWebpack,
} = require('./library/build/index.ts')

const info = {
  ...pkg,
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
}

process.env.VUE_APP_TITLE = title
process.env.VUE_APP_AUTHOR = pkg.author
process.env.VUE_APP_INFO = JSON.stringify(info)
process.env.VUE_APP_UPDATE_TIME = info.lastBuildTime
process.env.VUE_APP_GITHUB_USER_NAME = process.env.VUE_GITHUB_USER_NAME
process.env.VUE_APP_RANDOM = `${info.lastBuildTime}-${process.env.VUE_GITHUB_USER_NAME}`

module.exports = defineConfig({
  publicPath,
  assetsDir,
  outputDir,
  lintOnSave,
  transpileDependencies,
  devServer: {
    compress: true,
    client: {
      progress: false,
      overlay: {
        warnings: false,
        errors: true,
      },
    },
    hot: true,
    open: {
      target: [`http://localhost:${devPort}`],
    },
    port: devPort,
    // setupMiddlewares: require('./mock'),
    // 注释掉的地方是前端配置代理访问后端的示例，如无特别需求，不建议使用！！！
    // baseURL必须为/xxx，而不是后端服务器，请先了解代理逻辑，再设置前端代理
    // ！！！一定要注意！！！
    // 1、这里配置了跨域及代理只针对开发环境生效
    // 2、不建议你在前端配置跨域，建议你后端配置Allow-Origin,Method,Headers，放行token字段，一步到位
    // 3、后端配置了跨域，就不需要前端再配置，会发生Origin冲突
    // 4、webpack5版本前端配置代理无法与mock同时使用，如果一定要用前端代理，需注释setupMiddlewares: require('./mock')
    proxy: {
      [baseURL]: {
        target: `http://localhost:8848`,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          [`^${baseURL}`]: '',
        },
      },
    },
  },
  pwa: {
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
    },
    themeColor: '#ffffff',
    msTileColor: '#ffffff',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    manifestOptions: {
      name: 'Zen Gis',
      short_name: 'Zen',
      background_color: '#ffffff',
    },
  },
  configureWebpack(config) {
    const cesiumSourcePath = 'node_modules/mars3d-cesium/Build/Cesium/' // cesium库安装目录
    const cesiumRunPath = './lib/mars3d-cesium/' // cesium运行时路径

    const plugins = [
      ...createVuePlugin(),
      // 标识cesium资源所在的主目录，cesium内部资源加载、多线程等处理时需要用到
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify(
          path.join(config.output.publicPath, cesiumRunPath)
        ),
      }),
      // Cesium相关资源目录需要拷贝到系统目录下面（部分CopyWebpackPlugin版本的语法可能没有patterns）
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(cesiumSourcePath, 'Workers'),
            to: path.join(config.output.path, cesiumRunPath, 'Workers'),
          },
          {
            from: path.join(cesiumSourcePath, 'Assets'),
            to: path.join(config.output.path, cesiumRunPath, 'Assets'),
          },
          {
            from: path.join(cesiumSourcePath, 'ThirdParty'),
            to: path.join(config.output.path, cesiumRunPath, 'ThirdParty'),
          },
          {
            from: path.join(cesiumSourcePath, 'Widgets'),
            to: path.join(config.output.path, cesiumRunPath, 'Widgets'),
          },
          {
            from: path.join(cesiumSourcePath, 'Cesium.js'),
            to: path.join(config.output.path, cesiumRunPath, 'Cesium.js'),
          },
        ],
      }),
    ]
    return {
      externals: { 'mars3d-cesium': 'Cesium' }, // 排除使用 mars3d-cesium
      module: { unknownContextCritical: false }, // 配置加载的模块类型，cesium时必须配置
      resolve: {
        alias: {
          '~': resolve(__dirname, '.'),
          '@': resolve(__dirname, 'src'),
          '/#': resolve(__dirname, 'types'),
          '@vab': resolve(__dirname, 'library'),
          '@gp': resolve('library/plugins/vab'),
          'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
        },
        fallback: {
          fs: false,
          path: require.resolve('path-browserify'),
        },
      },
      plugins,
      performance: {
        hints: false,
      },
    }
  },
  chainWebpack(config) {
    //为了防止忘记配置而造成项目无法打包，请保留以下提示
    if (process.env.NODE_ENV === 'production') {
      if (
        process['env'].VUE_GITHUB_USER_NAME == 'test' &&
        process['env'].VUE_APP_SECRET_KEY == 'preview'
      )
        console.log(
          '检测到您的用户名和key未配置，key在购买时通过邮件邀请函发放，请仔细阅读文档并进行配置'
        )
    }
    createChainWebpack(process.env.NODE_ENV, config)
  },
  runtimeCompiler: false,
  productionSourceMap: false,
  css: {
    sourceMap: false,
    extract:
      process.env.NODE_ENV === 'production'
        ? {
            ignoreOrder: true,
          }
        : false,
    loaderOptions: {
      sass: {
        sassOptions: { outputStyle: 'expanded' },
        additionalData(content, { rootContext, resourcePath }) {
          const relativePath = relative(rootContext, resourcePath)
          if (
            relativePath.replace(/\\/g, '/') !==
            'library/styles/variables/variables.module.scss'
          )
            return `@use "~@vab/styles/variables/variables.module.scss" as *;${content}`
          return content
        },
      },
    },
  },
})
