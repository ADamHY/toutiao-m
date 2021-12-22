/*
  PostCSS 文件
*/

module.exports = {
  // 配置要使用的 PostCSS插件
  plugins: {
    // 配置使用 autoprefixer 插件
    // 作用：生成浏览器 CSS 样式规则前缀
    // VueCLI 内部已经配置了 autoprefixer 插件
    // 所以又配置了一次 所以产生冲突了
    // 'autoprefixer': { // autoprefixer 插件的配置
    // 配置要兼容到的环境信息
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    // 配置使用 postcss-pxtorem 插件
    'postcss-pxtorem': {
      // lib-flexible 的 REM 适配方案 吧一行分为10份 没分就是十分之一
      // 所以 rootValue 应该设置为你的设计稿宽度的十分之一
      // 我们的设计稿是 750 所以应该设置为 750 / 10 = 75
      // 但是 Vant 建议设置为 37.5 为什么？ 因为Vant 是基于 375 写的
      // 所以必须设置为37.5 唯一的缺点就是使用我们设计稿的尺寸都必须除以二
      // 有没有更好的办法？
      // 如果是Vant的 样式 就按照37.5 来转换
      //  如果是我们自己的样式就按照 75 来转换
      // 通过查阅文档 我们发现 rootValue 支持两种类型
      //  数字 固定的值
      //  函数：可以动态处理返回
      //          PostCSS 处理每个 CSS 文件的时候都会来调用这个函数
      //          他会把被处理的 CSS 文件相关的信息通过参数传递给该函数
      // rootValue: 37.5,
      rootValue({
        file
      }) {
        // console.log('处理的CSS文件',file)
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      // 配置要转换的 css 属性 * 表示所有
      propList: ['*'],

      // 配置不要转换的样式资源 exclude 代表要排除转换的文件 可以是字符串/正则/函数，如果是字符串 注意不带后缀名
      exclude: 'github-markdown'
    }
  }
}
