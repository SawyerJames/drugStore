'use strict'
const path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),
    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    // 发布版本基路径
    assetsPublicPath: '/',
    productionSourceMap: true,
    devtool: '#source-map',
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    // Paths
    assetsSubDirectory: 'static',
    // 测试版本基路径
    assetsPublicPath: '/',
    // Various Dev Server settings
    host: 'localhost',
    port: 8080,
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false,
    useEslint: true,
    showEslintErrorsInOverlay: false,
    devtool: 'eval-source-map',
    cacheBusting: true,
    cssSourceMap: false,
    proxyTable: {
      '/api': {
        target: 'http://yb.043u.cn',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    },
  }
}
