<template>
  <div class="my-submit">
    <van-nav-bar class="nav" title="提交订单" left-text="返回" left-arrow @click-left="goPrev" />
    <p class="address" @click="checkedAddress">{{address?address:'请选择收货地址'}}</p>
    <div class="order">
      <div class="content" v-for="(item,index) in details" :key="index">
        <!-- 商品 -->
        <van-card
          class="van-card"
          :num="shopsNum[index]"
          :desc="item.data.goods_desc"
          :title="item.data.goods_short_name"
          :thumb="item.data.picurl"
        />
        <!-- 各商品单价 -->
        <div class="price">
          <span>￥</span>
          <span>{{parseFloat(item.data.price).toFixed(2)}}</span>
        </div>
      </div>
      <!-- 总价 -->
      <div class="price-box">
        <span>
          共计{{totalNum}}件商品 合计：
          <span class="price">￥</span>
          <span class="price">{{totalPrice.toFixed(2)}}</span>
        </span>
      </div>
      <!-- 结算按钮 -->
      <van-submit-bar @submit="mySubmit" button-text="立即结算" />
      <!-- 弹出层 -->
      <van-popup round class="popup" v-model="show" position="bottom">
        <div class="my-address">
          <van-address-list
            v-model="aid"
            @select="changeAddress"
            :list="addressList"
            @add="goAddress"
            default-tag-text="默认"
          />
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import "../assets/css/submitOrder.less";
export default {
  created() {
    // 获取地址数据
    this.getAddressData();
    this.localDatas = JSON.parse(localStorage.getItem("myCollList"));
    //
    // 订单商品id数据
    this.ids = this.$route.query.ids.split("-");

    this.forEachId(this.ids);
  },
  data() {
    return {
      show: false,
      localDatas: [],
      aid: "1",
      // 需要付款的商品id
      ids: [],
      // 地址对象
      addressList: [],
      // 当前地址
      address: "",
      // 获得的商品数据
      details: [],
      // 商品数量
      shopsNum: [],
      totalNum: 0,
      totalPrice: 0
    };
  },
  methods: {
    // 选择收货地址
    checkedAddress() {
      this.show = !this.show;
    },
    // 计算数量
    count() {
      let num = 0;
      let price = 0;
      this.shopsNum.forEach((v, i) => {
        num += v;
      });
      return num;
    },
    // 根据id查找商品
    foundShops() {
      //
      this.ids.forEach(v => {});
    },
    //获取地址数据
    getAddressData() {
      let tokenString = localStorage.getItem("__Tkmm");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "http://www.kangliuyong.com:10002/findAddress",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();

          if (result.data.code == 20000) {
            result.data.result.forEach(v => {
              let currentAddress = {
                id: v.aid,
                tel: v.tel,
                name: v.name,
                address: v.province + v.city + v.county + v.addressDetail,
                isDefault: Boolean(v.isDefault)
              };

              //默认选择默认地址
              if (v.isDefault) {
                this.aid = v.aid;
                this.address = v.province + v.city + v.county + v.addressDetail;
              }

              this.addressList.push(currentAddress);
            });
          }
        })
        .catch(err => {
          this.$toast.clear();
        });
    },
    // 新增，编辑地址, 新增地址不要携带aid, 编辑地址需要携带aid, aid： 地址id
    goAddress(address) {
      let o = {
        name: "Address"
      };

      if (address) {
        o.params = {
          aid: address.id
        };
      }
      this.$router.push(o);
    },
    // 切换地址
    changeAddress(item) {
      this.address = item.address;
      this.show = false;
    },
    // 遍历id
    forEachId(id) {
      id.forEach(v => {
        //
        // 根据id请求数据
        this.searchDatasById(v);
      });
    },
    // 查找商品数据
    searchDatasById(id) {
      //   根据商品id请求数据
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
          this.details.push(result.data);

          //
          if (this.localDatas) {
            // 查找数量
            this.localDatas.some(item => {
              //
              //
              // 对应id查找商品数量
              if (item.id == id) {
                if (item.isClick && item.inShopCartNum) {
                  // 计算总价
                  this.totalPrice +=
                    item.inShopCartNum * result.data.data.price;
                  // 计算商品总件数
                  this.totalNum += item.inShopCartNum;
                  // 添加对应的商品数量
                  this.shopsNum.push(item.inShopCartNum);
                  // 打断循环
                  return true;
                }
              }
            });
          }
        })
        .catch(err => {
          this.$toast.clear();
          this.$toast("请求商品失败");
        });
    },
    goPrev() {
      this.$router.push({ name: "ShopCart" });
    },
    // 提交 结算
    mySubmit() {
      let date = new Date();
      let orderNumber = "jx" + +date;
      this.localDatas.forEach(v => {
        //
        // 对购物车勾选项进行订单提交
        if (v.isClick && v.orderState == "shopcart" && v.myOrder != "submit") {
          // 订单已提交 不在购物车显示
          v["orderState"] = "submit";
          // 提交订单标识
          v["myOrder"] = "submit";
          // 创建订单号
          v["orderNumber"] = orderNumber;
          // 记录创建时间
          v["date"] = date;
        }
      });

      let str = "";
      str = JSON.stringify(this.localDatas);

      localStorage.setItem("myCollList", str);
      this.$toast("结算成功");
      setTimeout(() => {
        this.$router.push({ name: "Order" });
      }, 500);
    }
  }
};
</script>

<style lang="less" scoped>
.my-address {
  /deep/ .van-nav-bar .van-icon,
  /deep/ .van-nav-bar__text {
    color: #ff1527;
  }
  /deep/ .van-address-item .van-radio__icon--checked .van-icon {
    background-color: #ff1527;
    border-color: #ff1527;
  }
  .van-address-item__edit {
    display: none;
  }
}
</style>