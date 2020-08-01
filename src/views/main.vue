<template>
  <div>
    <div>
      <router-view></router-view>
    </div>
    <div>
      <van-tabbar v-model="tabBarName" @change="tabbarChange">
        <van-tabbar-item
          v-for="(item,index) in tabbar"
          :badge="index==2?shopCount==0?'':shopCount:''"
          :icon="item.icon"
          :key="index"
        >{{item.text}}</van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("menuModule");
export default {
  computed: {
    ...mapState(["shopCount"])
  },
  data() {
    return {
      tabBarName: 0,
      tabbar: [
        {
          text: "商品",
          icon: "shop-o",
          routeName: "MyShop",
          url: "/main/"
        },
        {
          text: "发现",
          icon: "browsing-history-o",
          routeName: "Found",
          url: "/main/found"
        },
        {
          text: "购物车",
          icon: "cart-o",
          routeName: "ShopCart",
          url: "/main/shopcart"
        },
        {
          text: "我的",
          icon: "contact",
          routeName: "My",
          url: "/main/my"
        }
      ]
    };
  },
  created() {
    //获取路径的hash
    let hash = location.hash.slice(1);

    //根据路径激活相应路由
    for (let i = 0; i < this.tabbar.length; i++) {
      if (this.tabbar[i].url == hash) {
        this.tabBarName = i;
        break;
      }
    }
    this.shopCountMethods();
  },
  methods: {
    ...mapMutations(["shopCountFun"]),
    tabbarChange(i) {
      //
      this.$router.push({ name: this.tabbar[i].routeName });
    },
    // 购物车商品种类数
    shopCountMethods() {
      let tokenString = localStorage.getItem("__Tkmm");
      if (localStorage.getItem("myCollList") && tokenString) {
        let arr = JSON.parse(localStorage.getItem("myCollList"));

        let count = 0;
        // 遍历 寻找含有inShopCount数据的数量
        arr.forEach(v => {
          // 计算购物车种类数量
          if (v.inShopCartNum && v.orderState == "shopcart") {
            count++;
          }
        });
        // this.shopCount = count;
        // 保存购物车上的数字到vuex缓存
        this.shopCountFun(count);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.van-tabbar-item--active {
  color: #e70012;
}
</style>