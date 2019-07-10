/* 导出一个对象，优先级比webpack.config.js高 */
module.exports = {
  // 保存代码的时候，启用eslint校验格式
  devServer: {
    // 自动打开浏览器
    open: true,
    // 端口
    port: 3000
  }
}
