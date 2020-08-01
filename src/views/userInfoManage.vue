<template>
  <div class="userInfo">
    <div class="nav-top">
      <van-nav-bar class="top nav" title="账号管理" left-text="返回" left-arrow @click-left="goPrev" />
    </div>
    <div class="content">
      <van-cell title="头像" @click="show = true">
        <div class="user-img fr">
          <img class="auto-img" :src="userInfo.userImg" alt />
          <van-uploader class="uploader" :after-read="updateHd" />
        </div>
      </van-cell>
      <van-cell title="用户id" @click="show = true">
        <div class="cont">{{userInfo.userId}}</div>
      </van-cell>
      <van-cell title="手机号" @click="show = true">
        <div class="cont">{{userInfo.phone}}</div>
      </van-cell>
      <van-cell title="昵称" @click="show = true">
        <div class="cont">
          <input @change="updateNickName" class="nick-name" type="text" v-model="userInfo.nickName" />
        </div>
      </van-cell>
      <van-cell @click="show = true">
        <div class="desc clearfix">
          <div class="desc-title fl">简介</div>
          <textarea class="textarea fr" v-model="userInfo.desc" @change="changeDesc"></textarea>
        </div>
      </van-cell>
    </div>
  </div>
</template>

<script>
import "../assets/css/nav-top.less";
import "../assets/css/userinfomanage.less";
export default {
  created() {
    this.getUserInfo();
  },
  data() {
    return {
      datas: [],
      userInfo: []
    };
  },
  methods: {
    goPrev() {
      this.$router.go(-1);
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
        url: "http://www.kangliuyong.com:10002/findAccountInfo",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();

          if (result.data.code == "B001") {
            this.userInfo = result.data.result[0];
          }
        })
        .catch(err => {
          this.$toast.clear();
        });
    },
    // 更改头像
    updateHd(file) {
      // base64
      let myBase64 = file.content.split("base64,")[1];
      let myImgType = file.content.split(";base64,")[0].split("/")[1];

      let tokenString = localStorage.getItem("__Tkmm");
      this.changeUserInfo(
        { path: "updateAvatar", code: "H001", type: "userImg" },
        {
          appkey: this.appkey,
          tokenString,
          imgType: myImgType,
          serverBase64Img: myBase64
        }
      );
    },
    // 更改昵称
    updateNickName() {
      let tokenString = localStorage.getItem("__Tkmm");
      this.changeUserInfo(
        { path: "updateNickName", code: "C001", type: "nickName" },
        {
          appkey: this.appkey,
          tokenString,
          nickName: this.userInfo.nickName
        }
      );
    },
    // 更改简介
    changeDesc() {
      let tokenString = localStorage.getItem("__Tkmm");
      this.changeUserInfo(
        { path: "updateDesc", code: "D001", type: "desc" },
        {
          appkey: this.appkey,
          tokenString,
          desc: this.userInfo.desc
        }
      );
    },
    // 上传修改用户信息
    changeUserInfo(updateDatas, data) {
      this.$toast.loading({
        message: "上传中...",
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "POST",
        url: "http://www.kangliuyong.com:10002/" + updateDatas.path,
        data
      })
        .then(result => {
          this.$toast.clear();

          if (result.data.code == updateDatas.code) {
            this.$toast(result.data.msg);
            // 更改头像图片显示
            //
            let myTypes = updateDatas.type;
            this.userInfo[myTypes] = result.data[myTypes];
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch(err => {
          this.$toast.clear();
          // this.$toast(err.data.msg);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>