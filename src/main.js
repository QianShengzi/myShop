import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'

//导入font-awesome字体图标库
import 'font-awesome/css/font-awesome.min.css'

//导入vant框架
import {
  NavBar,
  Form,
  Field,
  Button,
  Toast,
  Tabbar,
  TabbarItem,
  Search,
  Swipe,
  SwipeItem,
  Tab,
  Tabs,
  Lazyload,
  goodsAction,
  goodsActionIcon,
  goodsActionButton,
  Icon,
  SubmitBar,
  Checkbox,
  Stepper,
  SwipeCell,
  Cell,
  RadioGroup,
  Radio,
  Empty,
  List,
  AddressEdit,
  Popup,
  AddressList,
  Card,
  ActionSheet,
  Uploader
} from 'vant'

//导入用于设置 rem 基准值模块
import 'lib-flexible'

//注册vant框架的组件
Vue
  .use(NavBar)
  .use(Form)
  .use(Field)
  .use(Button)
  .use(Toast)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Search)
  .use(Swipe)
  .use(SwipeItem)
  .use(Tab)
  .use(Tabs)
  .use(Lazyload)
  .use(goodsAction)
  .use(goodsActionIcon)
  .use(goodsActionButton)
  .use(Icon)
  .use(SubmitBar)
  .use(Checkbox)
  .use(Stepper)
  .use(SwipeCell)
  .use(Cell)
  .use(RadioGroup)
  .use(Radio)
  .use(Empty)
  .use(List)
  .use(AddressEdit)
  .use(Popup)
  .use(AddressList)
  .use(Card)
  .use(ActionSheet)
  .use(Uploader)

//注册axios
Vue.use(VueAxios, axios)

//配置请求基础路径
// axios.defaults.baseURL = 'http://www.kangliuyong.com:10002'

//配置post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

//发起请求之前处理
axios.interceptors.request.use(config => {
  // 

  if (config.method == 'post') {
    let paramsString = '';
    //post请求参数序列化，转成一个字符串
    for (let key in config.data) {
      paramsString += key + '=' + config.data[key] + '&'
    }

    // 

    config.data = paramsString.slice(0, -1);

    // 
  }

  return config;
})
//添加appkey属性保存appkey
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=';

Vue.config.productionTip = false
Vue.filter('myDate', (date, format) => {
  if (typeof date === "string") {
    var mts = date.match(/(\/Date\((\d+)\)\/)/);
    if (mts && mts.length >= 3) {
      date = parseInt(mts[2]);
    }
  }
  date = new Date(date);
  if (!date || date.toUTCString() == "Invalid Date") {
    return "";
  }
  var map = {
    "M": date.getMonth() + 1, //月份 
    "d": date.getDate(), //日 
    "h": date.getHours(), //小时 
    "m": date.getMinutes(), //分 
    "s": date.getSeconds(), //秒 
    "q": Math.floor((date.getMonth() + 3) / 3), //季度 
    "S": date.getMilliseconds() //毫秒 
  };

  format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
    var v = map[t];
    if (v !== undefined) {
      if (all.length > 1) {
        v = '0' + v;
        v = v.substr(v.length - 2);
      }
      return v;
    } else if (t === 'y') {
      return (date.getFullYear() + '').substr(4 - all.length);
    }
    return all;
  });
  return format;
}),

  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')




// const config = {
//   timeout: 60000,
//   withCredentials: true        // 访问线上api时axios发送跨域请求时需要设置这个参数
// }

// // // 生产环境
// config.baseURL = "http://api-gw.haojingke.com";   //这里是线上api请求地址

// const server = axios.create(config);