export const state = {

  //缓存菜单数据

  //banner数据
  bannerDataCache: [],

  //侧边菜单数据
  typeDataCache: [],

  //商品数据
  products: [{
    title: "热推榜",
    name: "getgoodshot",
    details: [],
    params: {
      apikey: "dd14c882d2f449e9",
      pageindex: 1,
      pagesize: 20
    }
  },
  {
    title: "热销榜",
    name: "getgoodsbd",
    details: [],
    params: {
      apikey: "dd14c882d2f449e9",
      pageindex: 1,
      pagesize: 20,
      activityid: 10000
    }
  },
  {
    title: "热搜榜",
    name: "getgoodsbd",
    details: [],
    params: {
      apikey: "dd14c882d2f449e9",
      pageindex: 1,
      pagesize: 20,
      activityid: 10000
    }
  },
  {
    title: "领券榜",
    name: "goodslist",
    details: [],
    params: {
      apikey: "dd14c882d2f449e9",
      pageindex: 1,
      pagesize: 20
    }
  },
  {
    title: "月销榜",
    name: "goodslist",
    details: [],
    params: {
      apikey: "dd14c882d2f449e9",
      pageindex: 1,
      pagesize: 20
    }
  }],

  // 搜索商品数据
  searchProducts: [
    {
      name: "goodslist",
      details: [],
      params: {
        apikey: "dd14c882d2f449e9",
        pageindex: 1,
        pagesize: 20,
        keyword: ''
      }
    }
  ],
  // 发现页面商品数据
  foundList: [],
  // 点击时商品的id
  clickId: '',

  //侧边栏菜单的标签高度
  height: 0,

  // 购物车商品种类数量
  shopCount: 0

}