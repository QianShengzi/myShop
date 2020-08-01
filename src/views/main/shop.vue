<template>
  <div class="my-shop">
    <div>
      <!-- 搜索栏 -->
      <form action="/">
        <van-search
          v-model="search"
          background="#ff4d5a"
          show-action
          placeholder="请输入搜索关键词"
          @search="onSearch"
        >
          <template #action>
            <div @click="onSearch">搜索</div>
          </template>
        </van-search>
      </form>
    </div>
    <!-- 默认商品页 -->
    <div v-show="shopFlag" class="shop-page">
      <!-- 内容 -->
      <div class="main-box">
        <!-- banner 轮播图-->
        <div class="banner">
          <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
            <van-swipe-item v-for="(item,index) in myPic" :key="index">
              <img class="auto-img" v-lazy="item.src" alt />
            </van-swipe-item>
          </van-swipe>
        </div>
        <van-tabs animated>
          <van-tab v-for="(item,index) in datas" :title="item.title" :key="index">
            <!-- <div v-for="(item,index) in item.data" :key="index"> -->
            <!-- <div v-html="item.details"></div> -->
            <!-- </div> -->
            <!-- 商品内容 -->
            <div v-if="flag" class="content-box clearfix">
              <div
                v-for="(item,index) in item.details"
                :key="index"
                class="shops"
                @click="clickIdEvent(item.goods_id)"
              >
                <div class="images">
                  <img class="auto-img" v-lazy="item.picurl" alt />
                </div>
                <div class="det">
                  <p class="g_name">{{item.goods_name}}</p>
                  <p class="g-desc">{{item.goods_desc}}</p>
                  <p class="g-shopname">
                    <span class="sym">￥</span>
                    <span class="price">{{item.price}}</span>
                    <span>{{item.shopname}}</span>
                  </p>
                </div>
                <!-- <input type="hidden" v-model="clickId" /> -->
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </div>

    <!-- 搜索商品页 -->
    <div v-show="!shopFlag" class="shop-page">
      <!-- 内容 -->
      <div class="main-box">
        <div v-for="(item,index) in searchShopData" :title="item.title" :key="index">
          <!-- <div v-for="(item,index) in item.data" :key="index"> -->
          <!-- <div v-html="item.details"></div> -->
          <!-- </div> -->
          <!-- 商品内容 -->
          <div v-if="flag" class="content-box clearfix">
            <div
              v-for="(item,index) in item.details"
              :key="index"
              class="shops"
              @click="clickIdEvent(item.goods_id)"
            >
              <div class="images">
                <img class="auto-img" v-lazy="item.picurl" alt />
              </div>
              <div class="det">
                <p class="g_name">{{item.goods_name}}</p>
                <p class="g-desc">{{item.goods_desc}}</p>
                <p class="g-shopname">
                  <span class="sym">￥</span>
                  <span class="price">{{item.price}}</span>
                  <span>{{item.shopname}}</span>
                </p>
              </div>
              <!-- <input type="hidden" v-model="clickId" /> -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 返回按钮 -->
    <div v-show="!shopFlag" class="return" @click="backShop">返回</div>
  </div>
</template>

<script>
import "../../assets/css/shop.less";
// 引入数据
// import { myDatas } from "../../assets/data/myData.js";
// banner数据
import { bannerDatas } from "../../assets/data/banner.js";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("menuModule");

export default {
  data() {
    return {
      myPic: [],
      // 商品数据
      datas: [],
      // ajax请求标识，请求数据完成后显示商品列表
      flag: false,
      // 显示内容标志
      shopFlag: true,
      // 搜索内容
      search: "",
      // 搜索商品得到的数据
      searchShopData: []
      // 点击时商品的id
      // clickId: ""
    };
  },
  computed: {
    ...mapState([
      "bannerDataCache",
      "typeDataCache",
      "products",
      "height",
      "clickId",
      "searchProducts"
    ])
  },
  created() {
    this.myPic = bannerDatas();

    if (this.products[0].details.length > 0) {
      this.datas = [];
      // 直接从缓存取出数据
      this.datas = this.products;
      //
      // 更改标识 显示列表
      this.flag = !this.flag;
      //

      return;
    }
    // this.datas = myDatas();
    for (let i = 0; i < this.products.length; i++) {
      this.getTypeData(
        this.products[i].name,
        i,
        this.changeProducts,
        this.products[i].params
      );
    }
  },
  methods: {
    ...mapMutations([
      "changeData",
      "changeProducts",
      "shopId",
      "saveShopProductsKeyword",
      "saveSearchShopData"
    ]),
    myData() {},
    // 搜索事件
    onSearch() {
      if (this.search) {
        // 显示搜索页面
        this.shopFlag = false;
        // 关键词写入缓存
        this.saveShopProductsKeyword(this.search);
        this.getTypeData(
          this.searchProducts[0].name,
          0,
          this.saveSearchShopData,
          this.searchProducts[0].params
        );
      }
    },
    // 返回主页面
    backShop() {
      this.shopFlag = !this.shopFlag;
    },
    //获取商品类型数据
    getTypeData(name, index, obj, params) {
      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/api/index.php/v1/api/jd/" + name,
        params
      })
        .then(result => {
          // this.datas[index].details.push(result.data);
          let newData = result.data;

          if (newData.status_code == 200) {
            //缓存商品数据
            obj({ index: index, data: newData });

            //
            //
          }

          // 根据不同的请求 赋值
          if (obj == this.changeProducts) {
            // 全部加载完毕 显示列表
            if (newData.status_code == 200) {
              //
              this.datas = [];
              // 读取缓存 显示
              this.datas = this.products;
              this.$toast.clear();
              this.flag = true;
              //
              //
            }
          } else if (obj == this.saveSearchShopData) {
            // 全部加载完毕 显示列表
            if (newData.status_code == 200) {
              //
              this.searchShopData = [];
              // 读取缓存 显示
              this.searchShopData = this.searchProducts;
              this.$toast.clear();
              this.flag = true;
              //
              //
            }
          }
        })
        .catch(err => {
          this.$toast.clear();
        });
    },
    // 获取当前点击商品id
    clickIdEvent(id) {
      // 缓存点击商品时的id
      this.shopId(id);
      // 跳转到商品详情页
      this.$router.push({ name: "Details" });
    }
  }
};
</script>

<style lang="less" scoped>
</style>