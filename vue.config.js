// module.exports ={
//     devServer:host:"localhost"，port：8081，//端口号
//     https：false，//https:（type:Boolean）
//     open：true，//配置自动启动浏览器
//     //proxy：'http://localhost：4000'//配置跨域处理，只有一个代理
//     //配置多个代理
//     proxy:{
//     "/api"：（
//     target："http://XXXX/YYYY"//要访问的接口域名changeOrigin：true，//开启代理：在本地会创建一个虚拟服务端
//     //然后发送请求的数据，并同时接收请求的数据。
//     //这样服务端和服务端进行数据的交互就不会有跨域问题pathRewrite：
//     '^/api':''//这里理解成用/api代替target里面的地址，

module.exports = {
    publicPath: './',
    // outputDir: 'dist',   //build输出目录
    // assetsDir: 'assets', //静态资源目录（js, css, img）
    // lintOnSave: false, //是否开启eslint
    devServer: {
        host: 'localhost',
        port: '8080',
        https: false,
        open: true,
        proxy: {
            '/api': {
                target: 'http://api-gw.haojingke.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}