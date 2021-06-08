const path = require('path')

function resolve(dir) {
  return path.join(__dirname, './', dir)
}

console.log(path.resolve(__dirname, './src/icons'))
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ?
    './' : '/',
  devServer: {
    overlay: {
      warnings: false,
      errors: false
    },
    disableHostCheck: true,
	hot:true
  },
  lintOnSave: false,
  chainWebpack: config => {
    config.module
      .rule('element-ui')
      .test(/element-ui.src.*?js$/)
      .use('babel')
      .loader('babel-loader')
      .end()

    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()

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
  }
}
