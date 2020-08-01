<template>
  <div class="collect">
    <!-- 导航栏 -->
    <van-nav-bar class="nav" title="我的收藏" left-text="返回" left-arrow @click-left="goPrev" />
    <div class="myCollected clearfix">
      <div
        v-for="(item,index) in dataList"
        :key="index"
        :data-id="item.goods_id"
        @click="getShops(item.goods_id)"
        class="eachCollected fl"
      >
        <div class="img-box">
          <img class="auto-img" v-lazy="item.picurl" alt />
        </div>
        <div class="name">{{item.goods_short_name}}</div>
        <div class="price">
          <span>￥</span>
          <span>{{twoNumber(item.price)}}</span>
        </div>
        <van-icon @click.stop="myDel(item,index)" class="del" name="delete" />
      </div>
    </div>
    <!-- 空状态 -->
    <!-- <div>
      <van-empty description="收藏夹什么也没有，先逛逛吧" />
    </div>-->
  </div>
</template>

<script>
import "../assets/css/collect.less";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("menuModule");

export default {
  data() {
    return {
      dataList: [],
      // 收藏夹数据是否存在
      isDataHave: true
    };
  },
  created() {
    this.getDatas();
  },
  computed: {
    ...mapState(["clickId"])
  },
  methods: {
    ...mapMutations(["shopId"]),
    //   转换2位小数
    twoNumber(num) {
      return parseFloat(num).toFixed(2);
    },
    //  localStorage获取收藏数据
    getDatas() {
      let datas = JSON.parse(localStorage.getItem("myCollList"));

      // 有数据时再执行
      if (datas) {
        datas.forEach(v => {
          //
          // 拿到收藏的商品id
          if (v.isCollect) {
            this.isDataHave = true;
            // 发送请求获取数据
            this.getDatasFromWeb(v.id);
          } else {
            // 没有数据
            this.isDataHave = false;
          }
        });
      } else {
        // 没有数据
        this.isDataHave = false;
      }
    },
    // 根据id获取数据
    //   根据商品id请求数据 获取收藏列表
    getDatasFromWeb(id) {
      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/api/index.php/v1/api/jd/goodsdetail",
        params: {
          apikey: "dd14c882d2f449e9",
          //   goods_id: this.clickId
          goods_id: id
        }
      })
        .then(result => {
          this.$toast.clear();

          //   保存商品数据
          let data = result.data.data;
          //   保存数据
          this.dataList.push(data);
        })
        .catch(err => {
          this.$toast.clear();
          this.$toast("请求商品失败");
        });
    },

    // 点击收藏商品进入详情
    getShops(id) {
      // 获取当前点击商品id
      // 缓存点击商品时的id
      this.shopId(id);
      // 跳转到商品详情页 详情页根据id请求数据
      this.$router.push({ name: "Details" });
    },
    myDel(item, index) {
      let localDatas = JSON.parse(localStorage.getItem("myCollList"));

      localDatas.forEach(v => {
        // 查找对应id 修改收藏数据
        if (v.id == item.goods_id) {
          v["isCollect"] = false;
        }
      });

      localDatas = JSON.stringify(localDatas);
      // 修改数据后 重新写入缓存
      localStorage.setItem("myCollList", localDatas);

      // 删除页面对应商品

      this.dataList.splice(index, 1);
      this.$toast("取消收藏成功");
      // 没有收藏的商品
      if (this.dataList.length == 0) {
        this.isDataHave = false;
      }
    },
    // 跳转上一页面
    goPrev() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>