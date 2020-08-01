<template>
  <div class="details">
    <!-- 导航栏 -->
    <van-nav-bar title="商品详情" left-text="返回" left-arrow @click-left="goPrev" />
    <div class="content" v-if="flag">
      <div class="c-details">
        <!-- 轮播组件 -->
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
          <van-swipe-item v-for="(item,index) in bannerImgs" :key="index">
            <img class="auto-img" v-lazy="item" alt />
          </van-swipe-item>
        </van-swipe>
        <!-- 详情内容 -->
        <div class="cont">
          <!-- 价格 收藏 -->
          <div class="collect clearfix">
            <span class="fl">
              ￥
              <span class="price">{{details.price}}</span>
            </span>
            <span class="likes fr" @click="collect">
              <van-icon :name="coll?'like':'like-o'" />
            </span>
          </div>
          <div class="title">
            <!-- 商品标题 -->
            <div class="shoptitle">{{details.goods_short_name}}</div>
            <!-- 导购信息 -->
            <div class="shopdesc">{{details.goods_desc}}</div>
          </div>
          <!-- 店铺名 -->
          <div class="shopname">{{details.shopname}}</div>
          <!-- 选项 -->

          <!-- 内容详情 -->
          <div class="con-dtl">
            <p>商品描述</p>
            <p>{{details.goods_desc}}</p>
          </div>
          <!-- 步进器 -->
          <div class="clearfix step">
            <div class="desc fl">
              ￥
              <span>{{(details.price*value).toFixed(2)?total=(details.price*value).toFixed(2):0}}</span>
            </div>
            <van-stepper class="fr" integer v-model="value" theme="round" button-size="22" />
          </div>
        </div>
      </div>

      <!-- 商品购买导航 -->
      <van-goods-action>
        <van-goods-action-icon
          @click="goToShopCart"
          icon="cart-o"
          text="购物车"
          :badge="shopCount?shopCount==0?'':shopCount:''"
        />
        <van-goods-action-button type="warning" text="加入购物车" @click="addShop" />
        <van-goods-action-button type="danger" @click="buy" text="立即购买" />
      </van-goods-action>
    </div>
  </div>
</template>

<script>
import "../assets/css/details.less";
import { createNamespacedHelpers } from "vuex";
import loginVue from "./login.vue";
const { mapState, mapMutations } = createNamespacedHelpers("menuModule");
export default {
  computed: {
    ...mapState(["products", "clickId", "shopCount"])
  },
  data() {
    return {
      value: 0,
      // // 购物车商品种类数量
      // shopCount: 0,
      details: {},
      bannerImgs: [],
      // 请求标识
      flag: false,
      coll: false,
      data: [],
      total: 0,
      show: false,
      tokenString: "",
      radio: ""
    };
  },
  created() {
    this.tokenString = localStorage.getItem("__Tkmm");
    this.getShopDatas();
    // 读取收藏状态
    if (localStorage.getItem("myCollList")) {
      let arr = JSON.parse(localStorage.getItem("myCollList"));

      arr.some(v => {
        // 缓存中id存在
        if (v.id === this.clickId) {
          // id存在时 读取收藏状态
          this.coll = v.isCollect;
          return true;
        }
      });
      // return;
    }
    // 刷新购物车数字
    this.shopCountMethods();
  },
  methods: {
    ...mapMutations(["shopCountFun"]),
    // 根据id获取对应商品数据
    getShopDatas() {
      //

      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration: 0
      });

      //   根据商品id请求数据
      this.axios({
        method: "GET",
        url: "/api/index.php/v1/api/jd/goodsdetail",
        params: {
          apikey: "dd14c882d2f449e9",
          //   goods_id: this.clickId
          goods_id: this.clickId
        }
      })
        .then(result => {
          this.$toast.clear();

          //   保存商品数据
          this.details = result.data.data;
          //
          //
          //   获取多图
          this.bannerImgs = this.details.picurls.split(",");

          //  显示页面
          this.flag = true;
        })
        .catch(err => {
          this.$toast.clear();
          // 不显示页面
          this.flag = false;
          this.$toast("请求商品失败");
        });
    },

    // 收藏/取消收藏
    collect() {
      if (!this.tokenString) {
        this.$toast("请先登陆");
        setTimeout(() => {
          this.$router.push({ name: "Login" });
        }, 2000);
        return;
      }

      this.coll = !this.coll;
      this.data = [
        {
          id: this.clickId,
          isCollect: this.coll
          //   inShopCart:this.value
        }
      ];

      // 内存有数据
      if (localStorage.getItem("myCollList")) {
        let arr = JSON.parse(localStorage.getItem("myCollList"));

        let isSave = false;
        let index = 0;
        for (let i = 0; i < arr.length; i++) {
          //   查看是否存在当前商品id
          if (arr[i].id === this.clickId) {
            index = i;
            isSave = true;
            break;
          }
          // return;
        }
        if (isSave) {
          // id存在时 更改收藏操作
          arr[index].isCollect = this.coll;
          this.data = arr;
        } else {
          // id不存在 添加数据

          arr.push({
            id: this.clickId,
            isCollect: this.coll
          });
          this.data = arr;
        }
      }
      if (this.coll) {
        this.$toast("收藏成功");
      } else {
        this.$toast("取消收藏成功");
      }
      localStorage.setItem("myCollList", JSON.stringify(this.data));
    },
    // 加入购物车
    addShop() {
      //   let data = {};
      //   // 添加当前商品数量
      //   data["inShopCartNum"] = this.value;
      //

      //
      if (!this.tokenString) {
        this.$toast("请先登陆");
        setTimeout(() => {
          this.$router.push({ name: "Login" });
        }, 2000);
        return;
      }

      // 缓存有数据
      if (localStorage.getItem("myCollList")) {
        let arr = JSON.parse(localStorage.getItem("myCollList"));

        let isSave = false;
        let index = 0;
        for (let i = 0; i < arr.length; i++) {
          //   查看是否存在当前商品id
          if (arr[i].id === this.clickId) {
            index = i;
            isSave = true;
            break;
          }
          // return;
        }
        if (isSave) {
          // id存在时
          // 如果有加购属性 直接加数量
          if (arr[index].inShopCartNum) {
            arr[index].inShopCartNum += this.value;
            // 默认勾选购物车
            arr[index].isClick = true;
            arr[index].orderState = "shopcart";
            arr[index].myOrder = "";
            this.data = arr;
          } else {
            //   没有加购属性 添加加购属性
            arr[index]["inShopCartNum"] = this.value;
            // 默认勾选购物车
            arr[index]["isClick"] = true;
            arr[index]["orderState"] = "shopcart";
            arr[index].myOrder = "";
            this.data = arr;
          }
        } else {
          // id不存在 添加数据

          arr.push({
            id: this.clickId,
            isCollect: this.coll,
            inShopCartNum: this.value,
            isClick: true,
            orderState: "shopcart",
            myOrder: ""
          });
          this.data = arr;
        }
      } else {
        // 没有缓存时 id不存在 添加数据

        let arr = [];
        arr.push({
          id: this.clickId,
          isCollect: this.coll,
          inShopCartNum: this.value,
          isClick: true,
          orderState: "shopcart",
          myOrder: ""
        });
        this.data = arr;
      }
      localStorage.setItem("myCollList", JSON.stringify(this.data));
      this.$toast("添加购物车成功");
      //   完成后调用函数 刷新购物车显示数字
      this.shopCountMethods();
    },
    // 回到上一页
    goPrev() {
      this.$router.go(-1);
    },
    // 购物车商品种类数
    shopCountMethods() {
      if (localStorage.getItem("myCollList") && this.tokenString) {
        let arr = JSON.parse(localStorage.getItem("myCollList"));

        let count = 0;
        // 遍历 寻找含有inShopCount数据的数量
        arr.forEach(v => {
          // inShopCartNum存在并且不为0时 才计算
          if (v.inShopCartNum && v.orderState == "shopcart") {
            count++;
          }
        });
        // this.shopCount = count;
        // 保存购物车上的数字到vuex缓存
        this.shopCountFun(count);
      }
    },
    // 跳转购物车
    goToShopCart() {
      this.$router.push({ name: "ShopCart" });
    },
    // 立即购买
    buy() {
      if (!this.tokenString) {
        this.$toast("请先登陆");
        setTimeout(() => {
          this.$router.push({ name: "Login" });
        }, 2000);
        return;
      }

      // 加购
      this.addShop();

      let ids = this.clickId;
      ids = ids.toString();
      this.$router.push({
        name: "SubmitOrder",
        query: { ids: ids }
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>