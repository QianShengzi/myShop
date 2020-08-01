<template>
  <div class="my-shop-cart">
    <!-- 顶部栏 -->
    <div class="bar">
      <van-nav-bar title="购物车" :right-text="isManage?'完成':'管理'" @click-right="myManage" />
    </div>
    <div v-if="flag" class="eachShops">
      <van-list
        v-if="shopCount"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="getStorage"
      >
        <!-- <van-cell v-for="item in list" :key="item" :title="item" /> -->

        <!-- 各商品 -->
        <van-swipe-cell :data-id="item.data.goods_id" v-for="(item,index) in details" :key="index">
          <div class="shop">
            <van-radio-group>
              <van-checkbox
                @click="changeShopState(item.data.goods_id,'singleControl')"
                class="img-box"
                v-model="item.shopCartList.isClick"
              >
                <div>
                  <div @click.stop="isManage?'':getShops(item.data.goods_id)" class="img fl">
                    <img class="auto-img" v-lazy="item.data.picurl" alt />
                  </div>
                  <div @click.stop="isManage?'':getShops(item.data.goods_id)" class="content fl">
                    <div class="title">{{item.data.goods_short_name}}</div>
                    <div class="shopname">{{item.data.shopname}}</div>
                    <div class="price">￥{{item.data.price}}</div>
                  </div>
                </div>
              </van-checkbox>
            </van-radio-group>
            <van-stepper
              class="stepper"
              v-model="item.shopCartList.num"
              disable-input
              theme="round"
              button-size="22"
              @plus="changeShopNumAdd(item.data.goods_id)"
              @minus="changeShopNumSub(item.data.goods_id)"
            />
          </div>
          <template #right>
            <van-button
              @click="beforeClose(item.data.goods_id)"
              class="del"
              square
              type="danger"
              text="删除"
            />
          </template>
        </van-swipe-cell>
      </van-list>
    </div>
    <!-- 空状态 -->
    <div v-if="!flag||!shopCount">
      <van-empty description="购物车还没有宝贝哦，先逛逛吧" />
    </div>
    <!-- 提交订单栏 -->
    <van-submit-bar
      v-else
      :price="totalPrice"
      :disabled="isNotHaveCheck"
      @submit="mySubmit"
      button-text="提交订单"
    >
      <van-checkbox @click="allSelectControl" v-model="allSelect">全选</van-checkbox>
    </van-submit-bar>

    <!-- 删除栏 -->
    <van-submit-bar
      class="delShop"
      :disabled="isNotHaveCheck"
      v-if="isManage"
      @submit="deleteAll"
      button-text="删除选择"
    >
      <van-checkbox @click="allSelectControl" v-model="allSelect">全选</van-checkbox>
    </van-submit-bar>
  </div>
</template>

<script>
import "../../assets/css/shopcart.less";
import { createNamespacedHelpers } from "vuex";
import loginVue from "../login.vue";
const { mapState, mapMutations } = createNamespacedHelpers("menuModule");
export default {
  computed: {
    ...mapState(["products", "shopCount", "clickId"])
  },
  data() {
    return {
      // shopCartList: [],
      // 商品数据
      details: [
        // {
        // data:[],
        // shopCartList:[]
        // }
      ],
      flag: false,
      // 保存缓存
      data: [],
      // 购物车勾选状态
      isClick: false,
      // num: 0
      // 总价格
      totalPrice: 0,
      // 控制全选
      allSelect: true,
      loading: true,
      finished: false,
      isManage: false,
      // 购物车是否有选择
      isNotHaveCheck: true
    };
  },
  created() {
    //
    this.getStorage();
    this.isNotHaveCheckMethods();
  },
  methods: {
    ...mapMutations(["shopCountFun", "shopId"]),
    // 计价
    price() {
      let t = 0;
      if (localStorage.getItem("myCollList")) {
        let arr = JSON.parse(localStorage.getItem("myCollList"));
        arr.forEach(v => {
          //
          // 勾选 且在购物车中
          if (v.isClick && v.orderState == "shopcart") {
            //
            t += v.inShopCartNum * v.price;
          }
        });
        // 调用函数 更改按钮禁用状态
        this.isNotHaveCheckMethods();
      }
      // t.toFixed(2);
      // 添加商品 再进入购物车 闪现 NaN.underfined
      // 原因：刚添加的商品在缓存中没有带价格  需要从服务器获取再写入
      if ((t * 100).toString().indexOf("NaN") == -1) {
        this.totalPrice = t * 100;
        //
      }
    },
    // 读取缓存
    getStorage() {
      let tokenString = localStorage.getItem("__Tkmm");
      if (!tokenString) {
        this.$toast("请先登陆再进行操作！");
        setTimeout(() => {
          this.$router.push({ name: "Login" });
        }, 2000);
      }
      // 缓存有数据
      if (localStorage.getItem("myCollList") && tokenString) {
        let arr = JSON.parse(localStorage.getItem("myCollList"));

        for (let i = 0; i < arr.length; i++) {
          if (arr[i].isClick == false && arr[i].orderState == "shopcart") {
            this.allSelect = false;
          }
          // 对应商品购物车数据存在时
          if (arr[i].inShopCartNum && arr[i].orderState == "shopcart") {
            //
            //
            // 保存购物车各商品id和对应的数量
            let obj = {
              id: arr[i].id,
              // 对应商品数量
              num: arr[i].inShopCartNum,
              // 是否在购物车中勾选
              isClick: arr[i].isClick
            };
            //
            // this.shopCartList.push(obj);

            // 向服务器请求获取数据
            this.getShopDatas(arr[i].id, obj, arr);

            // arr[i]['price']=this.details[i].data
          }
        }
      }
    },
    // 根据id获取对应商品数据
    getShopDatas(id, obj, arr) {
      //
      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration: 0
      });
      this.loading = true;
      this.finished = false;

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
          //
          //   保存商品数据
          this.details.push({
            data: result.data.data,
            shopCartList: obj
          });
          //
          //

          // 向缓存加入对应商品单价
          for (let i = 0; i < arr.length; i++) {
            //
            if (arr[i].id == id) {
              // 商品价格写入缓存
              arr[i]["price"] = result.data.data.price;
              //
              //
              this.data = arr;
              break;
            }
          }
          //  将带有单价的数据 写入缓存保存/更新
          localStorage.setItem("myCollList", JSON.stringify(this.data));
          this.price();

          //
          //  显示页面
          this.flag = true;
          this.loading = false;
          this.finished = true;
        })
        .catch(err => {
          this.$toast.clear();
          // 不显示页面
          this.flag = false;
          this.$toast("请求商品失败");

          this.loading = true;
          this.finished = false;
        });
    },
    // 更改购物车勾选状态
    changeShopState(id, allContorl) {
      // 缓存有数据
      if (localStorage.getItem("myCollList")) {
        let arr = JSON.parse(localStorage.getItem("myCollList"));

        let isSave = false;
        let index = 0;
        for (let i = 0; i < arr.length; i++) {
          //   查看是否存在当前商品id
          if (arr[i].id === id) {
            index = i;
            isSave = true;
            break;
          }
          // return;
        }

        if (isSave) {
          // // id存在时
          // 首先获取到当前购物车选择状态 再进行状态变更
          this.isClick = arr[index]["isClick"];
          // 更改购物车选中状态
          this.isClick = !this.isClick;

          // 全选 全不选
          // //循环的时候 点击全选按钮 全选选中 勾选所有
          // if (allContorl == "allContorl") {
          //   this.isClick = this.allSelect;
          //
          // }

          arr[index]["isClick"] = this.isClick;
          this.data = arr;
        }

        // 单选条件 只有点击单条商品时 才进入语句触发
        if (allContorl == "singleControl") {
          // 有一个没选中 全选按钮不选中 否则选中
          arr.some(v => {
            if (v.isClick == false && v.orderState == "shopcart") {
              this.allSelect = false;
              return true;
            } else if (v.isClick && v.orderState == "shopcart") {
              this.allSelect = true;
            }
          });
        }
      }
      localStorage.setItem("myCollList", JSON.stringify(this.data));
      this.price();
    },
    // 更改购物车对应商品件数
    // 减
    changeShopNumSub(id) {
      this.changeShopNum(id, "sub");
    },
    // 加
    changeShopNumAdd(id) {
      this.changeShopNum(id, "add");
    },
    changeShopNum(id, str) {
      // 缓存有数据
      if (localStorage.getItem("myCollList")) {
        let arr = JSON.parse(localStorage.getItem("myCollList"));

        let num = 0;
        for (let i = 0; i < arr.length; i++) {
          //   查看是否存在当前商品id
          if (arr[i].id === id) {
            // 存在id 更改该id的购物车数据

            // 记录购物车各个商品数量 自增
            num = arr[i]["inShopCartNum"];
            if (str == "add") {
              num++;
            } else {
              num--;
            }

            // 赋值
            arr[i]["inShopCartNum"] = num;

            // 保存数据
            this.data = arr;
            // 修改完成 跳出循环
            break;
          }
        }
        localStorage.setItem("myCollList", JSON.stringify(this.data));
      }
      this.price();
    },
    // 全选按钮
    allSelectControl() {
      if (localStorage.getItem("myCollList")) {
        let arr = JSON.parse(localStorage.getItem("myCollList"));

        arr.forEach((v, i) => {
          // 购物车存在时 改变所有存在的购物车勾选状态
          // if (v.inShopCartNum) {

          // 显示在购物车的商品 改变它的isClick
          if (v.inShopCartNum) {
            // 改变所有购物车点击状态 保存到缓存
            v.isClick = this.allSelect;
            // 按钮禁用状态跟随全选按钮点击时改变
            this.isNotHaveCheck = !this.allSelect;
          }

          this.changeShopState(v.id, "allControl");
          //

          // 改变所有购物车点击状态 实时更新页面效果
          if (this.details[i]) {
            this.details[i].shopCartList.isClick = this.allSelect;
          }
          // }
        });
        //
        this.data = arr;
        //
        localStorage.setItem("myCollList", JSON.stringify(this.data));
        // 重新计算总价
        this.price();
        this.isNotHaveCheckMethods();
      }
    },
    // 切换 管理/完成
    myManage() {
      this.isManage = !this.isManage;
      if (this.isManage) {
      }
    },
    // 检查是否有选中项 控制提交订单/删除选项按钮禁用状态
    isNotHaveCheckMethods() {
      if (localStorage.getItem("myCollList")) {
        let arr = JSON.parse(localStorage.getItem("myCollList"));

        // 默认true 禁用按钮
        this.isNotHaveCheck = true;

        arr.some(v => {
          if (v.isClick && v.orderState == "shopcart") {
            // 找到有勾选的项 启用按钮
            this.isNotHaveCheck = false;

            return;
          }
        });
      }
    },
    // 单个商品删除(更改inShopCartNum)
    beforeClose(id) {
      //
      // 删除按钮触发

      if (localStorage.getItem("myCollList")) {
        let arr = JSON.parse(localStorage.getItem("myCollList"));
        //

        arr.some((v, i) => {
          if (v.id === id) {
            // 改变orderState 使数据不在购物车显示
            arr[i].orderState = "notInShopcart";
            // arr[i].isClick = true;
            return true;
          }
        });

        this.data = arr;
        //
        // 删除列表对应数据 更新列表显示
        this.details.some((v, i) => {
          if (v.data.goods_id == id) {
            //
            this.details.splice(i, 1);
            return;
          }
        });
        //

        this.$toast("删除成功");
        // 更新缓存
        localStorage.setItem("myCollList", JSON.stringify(this.data));
        // 重新计算计算购物车商品种类数
        this.shopCountMethods();
        // 重新检查全选
        arr.some(v => {
          if (v.isClick == false && v.orderState == "shopcart") {
            this.allSelect = false;
            return true;
          } else if (v.isClick && v.orderState == "shopcart") {
            this.allSelect = true;
          }
        });
        // 重新计算价格
        this.price();
      }
    },
    // 删除多选
    deleteAll() {
      if (localStorage.getItem("myCollList")) {
        let arr = JSON.parse(localStorage.getItem("myCollList"));

        for (let i = arr.length - 1; i >= 0; i--) {
          if (arr[i].isClick) {
            arr[i].orderState = "notInShopcart";
          }
        }

        this.data = arr;
        //
        // 删除列表对应数据 更新列表显示
        for (let i = this.details.length - 1; i >= 0; i--) {
          if (this.details[i].shopCartList.isClick) {
            this.details.splice(i, 1);
          }
        }

        this.$toast("删除成功");
        // 更新缓存
        localStorage.setItem("myCollList", JSON.stringify(this.data));

        // 重新计算计算购物车商品种类数
        this.shopCountMethods();
        // 重新计算价格
        this.price();
      }
    },
    // 计算购物车商品种类数
    shopCountMethods() {
      if (localStorage.getItem("myCollList")) {
        let arr = JSON.parse(localStorage.getItem("myCollList"));

        let count = 0;
        // 遍历 寻找含有inShopCount数据的数量
        arr.forEach(v => {
          // inShopCartNum存在并且不为0并且为购物车状态 才计算
          if (v.inShopCartNum && v.orderState == "shopcart") {
            count++;
          }
        });
        // this.shopCount = count;
        // 保存购物车上的数字到vuex缓存
        this.shopCountFun(count);
      }
    },
    // 点击购物车商品进入详情
    getShops(id) {
      // 获取当前点击商品id
      // 缓存点击商品时的id
      this.shopId(id);
      // 跳转到商品详情页 详情页根据id请求数据
      this.$router.push({ name: "Details" });
    },
    // 提交订单
    mySubmit() {
      if (localStorage.getItem("myCollList")) {
        let arr = JSON.parse(localStorage.getItem("myCollList"));
        let ids = [];
        arr.forEach(v => {
          //
          // 选取购物车选中的商品
          if (v.isClick && v.orderState == "shopcart") {
            ids.push(v.id);
          }
        });
        ids = ids.join("-");

        this.$router.push({ name: "SubmitOrder", query: { ids: ids } });
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>