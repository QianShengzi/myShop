<template>
  <div class="found" :class="{isEnd:isEnd}">
    <div
      v-show="isEnd"
      v-for="(item,index) in foundData"
      :key="index"
      class="item clearfix"
      @click="clickIdEvent(item.goods_id)"
    >
      <div class="img-box fl">
        <img class="auto-img" :src="item.picurl" alt />
      </div>
      <div class="cont fl">
        <span class="cname">{{item.pf_cname1}}</span>
        <div class="shortname">{{item.goods_short_name}}</div>
        <span class="shopname">{{item.shopname}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/css/found.less";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("menuModule");
export default {
  data() {
    return {
      isEnd: false,
      foundData: []
    };
  },
  computed: {
    ...mapState(["clickId", "foundList"])
  },
  created() {
    // 缓存有数据
    if (this.foundList.length) {
      this.foundData = this.foundList;
      this.isEnd = true;
      return;
    }
    this.getFoundDatas();
  },
  methods: {
    ...mapMutations(["shopId", "saveFoundList"]),
    getFoundDatas() {
      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/api/index.php/v1/api/jd/getjingfen",
        params: {
          apikey: "b47c7f3bc4db0136",
          eliteId: 2
        }
      })
        .then(result => {
          let res = result.data.data.data;
          // 写入数据到vuex缓存
          this.saveFoundList(res);
          // 从缓存中读取数据
          this.foundData = this.foundList;
          this.isEnd = !this.isEnd;
          //
          this.$toast.clear();
        })
        .catch(err => {
          this.$toast.clear();

          this.$toast.clear();
        });
    }, // 获取当前点击商品id
    clickIdEvent(id) {
      // 缓存点击商品时的id
      this.shopId(id);
      // 跳转到商品详情页
      this.$router.push({ name: "Details" });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>