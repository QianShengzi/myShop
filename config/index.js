// module.exports = {
//     dev: {

//         // Paths
//         assetsSubDirectory: 'static',
//         assetsPublicPath: '/',
//         proxyTable: {
//             dev: {
//                 env: require('./dev.env'),
//                 port: 8080,
//                 autoOpenBrowser: true,
//                 assetsSubDirectory: 'static',
//                 assetsPublicPath: '/',
//                 proxyTable: {
//                     '/apis': {
//                         target: 'http://api-gw.haojingke.com',  //目标接口域名
//                         changeOrigin: true,  //是否跨域
//                         pathRewrite: {
//                             '^/api': ''   //重写接口
//                         }
//                     },
//                     cssSourceMap: false
//                 }
//             },

//             // Various Dev Server settings
//             host: 'localhost', // can be overwritten by process.env.HOST
//             port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
//             autoOpenBrowser: false,
//             errorOverlay: true,
//             notifyOnErrors: true,
//             poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


//             /**
//              * Source Maps
//              */

//             // https://webpack.js.org/configuration/devtool/#development
//             devtool: 'cheap-module-eval-source-map',

//             // If you have problems debugging vue-files in devtools,
//             // set this to false - it *may* help
//             // https://vue-loader.vuejs.org/en/options.html#cachebusting
//             cacheBusting: true,

//             cssSourceMap: true
//         }
//     }
// }