<template>
  <div class="order nav-top">
    <van-nav-bar class="top" title="我的订单" left-text="返回" left-arrow @click-left="goPrev" />
    <van-tabs @change="changeTabs" v-model="activeName" color="#1989FA" line-height="2">
      <!-- 全部 -->
      <van-tab title="全部" name="all">
        <div v-if="isHave" class="order-content">
          <div class="order-items">
            <!-- 订单 start-->
            <div
              class="order-item"
              v-show="item.isRecieve!=-1"
              v-for="(item,index) in orders"
              :key="index"
            >
              <div class="order-item-title">
                <div class="fl order-no">{{item.number}}</div>
                <div class="fr" v-if="item.isRecieve">
                  <span class="confirm">已收货</span>
                  <span class="delete">
                    <van-icon class="delete-icon" name="delete" @click="deleteOrder(item)" />
                  </span>
                </div>
                <div class="fr" v-else>
                  <span class="confirm" @click="confirmReceipt(item)">确认收货</span>
                </div>
              </div>

              <!-- 订单下的每种商品 -->
              <div class="items" v-for="(goods,index) in item.data.details" :key="index">
                <div class="clearfix">
                  <div class="fl pro-img">
                    <img class="auto-img" :src="goods.picurl" alt />
                  </div>
                  <div class="fl pro-info">
                    <div class="fl">
                      <div class="names">
                        <div class="zh-name">{{goods.goods_short_name}}</div>
                        <div class="en-name">{{goods.shopname}}</div>
                      </div>
                    </div>
                    <div class="fr">
                      <div class="price">
                        ￥
                        <span>{{parseFloat(goods.price).toFixed(2)}}</span>
                      </div>
                      <div class="count">×{{shopCartNum(goods.goods_id,item.data.local)}}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="times">{{orders[index].data.local[0].date|myDate('yyyy-MM-dd hh:mm:ss')}}</div>
              <div class="order-total clearfix">
                <div class="fr clearfix">
                  <span class="fl total-count">共计 {{item.num}} 件商品 合计：</span>
                  <span class="fl total-price">￥{{parseFloat(item.price).toFixed(2)}}</span>
                </div>
              </div>
            </div>
            <!-- 订单 end-->
          </div>
        </div>
        <!-- 空状态 -->
        <div v-else>
          <van-empty description="这里什么也没有，先逛逛吧" />
        </div>
      </van-tab>
      <!-- 待收货 -->
      <van-tab title="待收货" name="wait">
        <div v-if="isHave" class="order-content">
          <div class="order-items">
            <!-- 订单 start-->
            <div
              class="order-item"
              v-for="(item,index) in orders"
              v-show="!item.isRecieve"
              :key="index"
            >
              <div class="order-item-title">
                <div class="fl order-no">{{item.number}}</div>
                <div class="fr" v-if="item.isRecieve">
                  <span class="confirm">已收货</span>
                  <span class="delete">
                    <van-icon class="delete-icon" name="delete" />
                  </span>
                </div>
                <div class="fr" v-else>
                  <span class="confirm" @click="confirmReceipt(item)">确认收货</span>
                </div>
              </div>

              <!-- 订单下的每种商品 -->
              <div class="items" v-for="(goods,index) in item.data.details" :key="index">
                <div class="clearfix">
                  <div class="fl pro-img">
                    <img class="auto-img" :src="goods.picurl" alt />
                  </div>
                  <div class="fl pro-info">
                    <div class="fl">
                      <div class="names">
                        <div class="zh-name">{{goods.goods_short_name}}</div>
                        <div class="en-name">{{goods.shopname}}</div>
                      </div>
                    </div>
                    <div class="fr">
                      <div class="price">
                        ￥
                        <span>{{parseFloat(goods.price).toFixed(2)}}</span>
                      </div>
                      <div class="count">×{{shopCartNum(goods.goods_id,item.data.local)}}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="times">{{orders[index].data.local[0].date|myDate('yyyy-MM-dd hh:mm:ss')}}</div>
              <div class="order-total clearfix">
                <div class="fr clearfix">
                  <span class="fl total-count">共计 {{item.num}} 件商品 合计：</span>
                  <span class="fl total-price">￥{{parseFloat(item.price).toFixed(2)}}</span>
                </div>
              </div>
            </div>
            <!-- 订单 end-->
          </div>
        </div>
        <!-- 空状态 -->
        <div v-else>
          <van-empty description="这里什么也没有，先逛逛吧" />
        </div>
      </van-tab>
      <!-- 已收货 -->
      <van-tab title="已收货" name="isRec">
        <div v-if="isHave" class="order-content">
          <div class="order-items">
            <!-- 订单 start-->
            <div
              class="order-item"
              v-for="(item,index) in orders"
              v-show="item.isRecieve==1"
              :key="index"
            >
              <div class="order-item-title">
                <div class="fl order-no">{{item.number}}</div>
                <div class="fr" v-if="item.isRecieve">
                  <span class="confirm">已收货</span>
                  <span class="delete">
                    <van-icon class="delete-icon" name="delete" @click="deleteOrder(item)" />
                  </span>
                </div>
                <div class="fr" v-else>
                  <span class="confirm" @click="confirmReceipt(item)">确认收货</span>
                </div>
              </div>

              <!-- 订单下的每种商品 -->
              <div class="items" v-for="(goods,index) in item.data.details" :key="index">
                <div class="clearfix">
                  <div class="fl pro-img">
                    <img class="auto-img" :src="goods.picurl" alt />
                  </div>
                  <div class="fl pro-info">
                    <div class="fl">
                      <div class="names">
                        <div class="zh-name">{{goods.goods_short_name}}</div>
                        <div class="en-name">{{goods.shopname}}</div>
                      </div>
                    </div>
                    <div class="fr">
                      <div class="price">
                        ￥
                        <span>{{parseFloat(goods.price).toFixed(2)}}</span>
                      </div>
                      <div class="count">×{{shopCartNum(goods.goods_id,item.data.local)}}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="times">{{orders[index].data.local[0].date|myDate('yyyy-MM-dd hh:mm:ss')}}</div>
              <div class="order-total clearfix">
                <div class="fr clearfix">
                  <span class="fl total-count">共计 {{item.num}} 件商品 合计：</span>
                  <span class="fl total-price">￥{{parseFloat(item.price).toFixed(2)}}</span>
                </div>
              </div>
            </div>
            <!-- 订单 end-->
          </div>
        </div>
        <!-- 空状态 -->
        <div v-else>
          <van-empty description="这里什么也没有，先逛逛吧" />
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>
 
<script>
import "../../assets/css/order.less";
import "../../assets/css/nav-top.less";
import loginVue from "../login.vue";
export default {
  data() {
    return {
      activeName: "all",
      // 各订单商品件数
      totalNum: 0,
      // 各订单商品总价
      totalPrice: 0,
      // isRecieve: false,
      localDatas: [],
      orderNumber: [],
      // 保存订单号对应的商品id
      orders: [
        // {
        //   number: "",
        //   data: [
        //     {
        //       local: [],
        //       details: []
        //     }
        //   ]
        // }
      ],
      details: [],
      // 全部
      isHave: false
    };
  },
  created() {
    this.getlocalDatas();
  },
  methods: {
    // 切换状态栏
    changeTabs(item) {
      // //
      // if (this.orders.length == 0) {
      //   this.isHave = false;
      // }
      if (item == "all") {
        //  判断是否有订单显示
        this.isOrderHaveAll();
      }
      if (item == "wait") {
        this.isOrderHaveWait();
      }
      if (item == "isRec") {
        this.isOrderHaveIsRec();
      }
    },
    // 获取缓存
    getlocalDatas() {
      this.localDatas = JSON.parse(localStorage.getItem("myCollList"));

      // 缓存有数据时
      if (this.localDatas) {
        this.getOrderNumber();
        // 判断是否有订单显示
        this.isOrderHaveAll();
      } else {
        this.isHave = false;
      }
    },
    // 购物车各商品的数量
    shopCartNum(id, data) {
      let num = 0;
      data.some(v => {
        if (id == v.id) {
          num = v.inShopCartNum;
          return true;
        }
      });
      return num;
    },
    getOrderNumber() {
      this.localDatas.forEach(v => {
        //
        // 获取订单号
        if (v.orderNumber) {
          this.orderNumber.push(v.orderNumber);
        }
      });

      // 数组去重
      let newArr = [...new Set(this.orderNumber)]; // 这个方法最简便
      // reverse()倒序 使最近订单显示在前
      this.orderNumber = newArr.reverse();

      // 根据订单号获取商品id
      this.orderNumber.forEach(v => {
        let arr = [];
        let obj = {
          // 订单号
          number: v,
          // 是否已收货 0 未收货 1 已收货 -1 删除
          isRecieve: 0,
          num: 0,
          price: 0,
          data: {
            local: [],
            details: []
          }
        };
        // 遍历localStorage
        if (this.localDatas) {
          this.localDatas.forEach(item => {
            // 找到对应订单号
            if (item.orderNumber == v) {
              //

              // 计算各订单商品件数
              obj.num += item.inShopCartNum;
              if (item.myOrder == "submit") {
                obj.isRecieve = 0;
              } else if (item.myOrder == "isRecieve") {
                obj.isRecieve = 1;
              } else if (item.myOrder == "null") {
                obj.isRecieve = -1;
              }
              // 添加本地缓存对应的信息
              obj.data.local.push(item);

              // 根据id发送请求获取数据 再把数据保存至details中
              this.getShopDatas(item, obj);
            }
          });
        }

        this.orders.push(obj);
      });
    },
    // 根据id获取对应商品数据
    getShopDatas(item, obj) {
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
          goods_id: item.id
        }
      })
        .then(result => {
          this.$toast.clear();

          //   保存商品数据
          // this.details.push(result.data.data);

          // 计算订单总价

          obj.price += item.inShopCartNum * result.data.data.price;

          // 保存请求得到的数据
          obj.data.details.push(result.data.data);
          //
          //
        })
        .catch(err => {
          this.$toast.clear();
          this.$toast("请求商品失败");
        });
    },
    // 全部 判断是否有显示订单
    isOrderHaveAll() {
      this.orders.some(v => {
        this.isHave = false;
        // 找出没被删除的订单 只要找到一个 就可以把isHave设为true
        if (v.isRecieve != -1) {
          this.isHave = true;
          return true;
        }
      });
    },
    //待收货 判断是否有显示订单
    isOrderHaveWait() {
      // 判断是否有待收货订单显示
      this.orders.some(v => {
        //
        this.isHave = false;
        // 找出一个待收货订单 只要找到一个 就可以把isHave设为true
        if (v.isRecieve == 0) {
          this.isHave = true;
          return true;
        }
      });
    },
    //已收货 判断是否有显示订单
    isOrderHaveIsRec() {
      // 判断是否有已收货订单显示
      this.orders.some(v => {
        //
        this.isHave = false;
        // 找出一个已收货订单 只要找到一个 就可以把isHave设为true
        if (v.isRecieve == 1) {
          this.isHave = true;
          return true;
        }
      });
    },
    // 确认收货
    confirmReceipt(item) {
      this.localDatas.forEach(v => {
        // 根据订单查找缓存中的商品
        if (v.orderNumber == item.number) {
          v.myOrder = "isRecieve";
          v.orderState = "isRecieve";
          item.isRecieve = 1;
          this.$toast("收货成功");
        }
      });

      // 判断待收货是否有订单显示
      this.isOrderHaveWait();

      let details = JSON.stringify(this.localDatas);
      localStorage.setItem("myCollList", details);
      //
    },
    // 删除订单
    deleteOrder(item) {
      this.localDatas.forEach(v => {
        // 根据订单查找缓存中的商品
        if (v.orderNumber == item.number) {
          // 清空数据
          v.myOrder = "null";
          v.orderState = "null";
          v.orderNumber = "";
          item.isRecieve = -1;
          this.$toast("删除成功");
        }
      });

      // 判断是否有订单显示
      this.isOrderHaveAll();

      let details = JSON.stringify(this.localDatas);
      localStorage.setItem("myCollList", details);
    },
    goPrev() {
      this.$router.go(-1);
    }
  }
};
</script>