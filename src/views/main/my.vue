<template>
  <div class="my">
    <!-- 背景图区域 -->
    <div>
      <!-- 登录 -->
      <div v-if="isLogin" class="pic">
        <div class="userBg">
          <img class="auto-img" v-lazy="userInfo.userBg" alt />
        </div>
        <div class="content">
          <div class="changeBg">
            <span>更换背景</span>
            <van-uploader class="uploader" :after-read="updateBg" />
          </div>
          <div class="name-area">
            <div class="head-img">
              <img class="auto-img" v-lazy="userInfo.userImg" alt />
              <van-uploader class="change-head-img" :after-read="updateHeadPic" />
            </div>
            <div class="name">{{userInfo.nickName}}</div>
          </div>
          <div class="desc">{{userInfo.desc?userInfo.desc:'TA还没有留下什么'}}</div>
        </div>
      </div>
      <!-- 未登录 -->
      <div v-else class="pic">
        <div class="userBg">
          <img
            class="auto-img"
            src="http://a4.att.hudong.com/22/59/19300001325156131228593878903.jpg"
            alt
          />
        </div>
        <div class="toLogin" @click="$router.push({name:'Login'})">去登录</div>
      </div>
    </div>
    <div class="sel">
      <van-cell
        is-link
        v-for="(item,index) in data"
        :key="index"
        :title="item.title"
        @click="isLogin?myCollect(index):$toast('请先登录')"
      />
    </div>
  </div>
</template>

<script>
import "../../assets/css/my.less";
export default {
  data() {
    return {
      // 判断是否登陆
      isLogin: false,
      data: [
        { title: "账号管理", router: "userInfoManage" },
        { title: "地址管理", router: "MyAddress" },
        { title: "我的收藏", router: "Collect" },
        { title: "我的订单", router: "Order" },
        { title: "安全中心", router: "Safe" }
      ],
      userInfo: [],
      updateInfo: [
        {
          path: "updateAvatar",
          code: "H001",
          type: "userImg"
        },
        {
          path: "updateUserBg",
          code: "I001",
          type: "userBg"
        }
      ]
    };
  },
  created() {
    if (localStorage.getItem("__Tkmm")) {
      this.isLogin = true;
    }
    this.getUserInfo();
  },
  methods: {
    // 上传用户头像
    updateHeadPic(datas) {
      this.update(this.updateInfo[0], datas);
    },

    // 上传用户背景
    updateBg(datas) {
      this.update(this.updateInfo[1], datas);
    },

    // 上传图片方法
    update(updateDatas, datas) {
      // base64
      let myBase64 = datas.content.split("base64,")[1];
      let myImgType = datas.content.split(";base64,")[0].split("/")[1];

      let tokenString = localStorage.getItem("__Tkmm");

      this.$toast.loading({
        message: "上传中...",
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "POST",
        url: "http://www.kangliuyong.com:10002/" + updateDatas.path,
        data: {
          appkey: this.appkey,
          tokenString,
          imgType: myImgType,
          serverBase64Img: myBase64
        }
      })
        .then(result => {
          this.$toast.clear();

          if (result.data.code == updateDatas.code) {
            this.$toast(result.data.msg);
            // 更改头像图片显示
            //
            let myTypes = updateDatas.type;
            this.userInfo[myTypes] = result.data[myTypes];
          }
        })
        .catch(err => {
          this.$toast.clear();
          // this.$toast(err.data.msg);
        });
    },

    //获取用户信息
    getUserInfo() {
      let tokenString = localStorage.getItem("__Tkmm");
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "http://www.kangliuyong.com:10002/findMy",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();

          if (result.data.code == "A001") {
            this.userInfo = result.data.result[0];
          }
        })
        .catch(err => {
          this.$toast.clear();
        });
    },
    myCollect(index) {
      // 跳转到对应页面
      this.$router.push({ name: this.data[index].router });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>