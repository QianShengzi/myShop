export const mutations = {

  changeData(state, data) {
    //data: 载荷
    //data.key: 修改数据的名称
    //data.value: 修改的数据

    state[data.key] = data.value;
  },

  // //修改商品数据
  // changeProducts(state, data) {
  //   //data: 载荷
  //   //data.type: 类型
  //   //data.value: 商品数据
  //   state.products[data.type] = data.value;
  // }

  //修改商品数据
  changeProducts(state, data) {
    let arr = data.data.data.data
    //data: 载荷
    state.products[data.index].details = arr;
    
  },

  // 记录点击商品列表点击时对应商品id
  shopId(state, data) {
    state.clickId = data;
    
    // 

  },

  // 保存购物车不同类型的商品数目
  shopCountFun(state, data) {
    state.shopCount = data;
  },

  // 搜索关键词
  saveShopProductsKeyword(state, data) {
    state.searchProducts[0].params.keyword = data;
  },

  // 保存搜索商品数据
  saveSearchShopData(state, data) {
    let arr = data.data.data.data
    //data: 载荷
    state.searchProducts[data.index].details = arr;
    
  },

  saveFoundList(state, data) {
    
    state.foundList = data;
  }
}