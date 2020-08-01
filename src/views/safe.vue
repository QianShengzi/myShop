<template>
  <div class="safe">
    <div class="nav-top">
      <van-nav-bar
        class="top nav"
        title="安全中心"
        left-text="返回"
        right-text="退出登陆"
        left-arrow
        @click-left="goPrev"
        @click-right="goOut"
      />
    </div>
    <div class="btns">
      <!-- 修改密码按钮 -->
      <van-button class="btn" @click="editPwdShow=true" type="default">修改密码</van-button>
      <!-- 注销账号按钮 -->
      <van-button class="btn" type="default" @click="destroy">注销账号</van-button>

      <!-- 弹出层 -->
      <van-popup class="editPwd" v-model="editPwdShow">
        <div class="text">修改密码</div>
        <div>
          <!-- 修改密码表单 -->
          <van-form @submit="editPwd">
            <van-field v-model="oldPwd" label="旧密码" placeholder="请输入旧密码" />
            <van-field v-model="newPwd" label="新密码" placeholder="请输入至少包含数字字母的新密码(6-20)" />
            <div style="margin: 16px;">
              <van-button round block type="info" native-type="submit">提交</van-button>
            </div>
          </van-form>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import "../assets/css/safe.less";
import "../assets/css/nav-top.less";
import loginVue from "./login.vue";
export default {
  data() {
    return {
      oldPwd: "",
      newPwd: "",
      editPwdShow: false
    };
  },
  methods: {
    goPrev() {
      this.$router.go(-1);
    },

    // 密码修改
    editPwd() {
      let tokenString = localStorage.getItem("__Tkmm");
      // 密码正则
      let pwdRep = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,20}$/;
      //   密码框为空
      if (!this.oldPwd || !this.newPwd) {
        this.$toast("请填写密码");
        return;
      }
      if (!pwdRep.test(this.oldPwd)) {
        this.$toast("旧密码格式不正确");
        return;
      }
      if (!pwdRep.test(this.newPwd)) {
        this.$toast("新密码格式不正确");
        return;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      // 请求修改密码
      this.axios({
        method: "POST",
        url: "http://www.kangliuyong.com:10002/updatePassword",
        data: {
          appkey: this.appkey,
          tokenString,
          password: this.newPwd,
          oldPassword: this.oldPwd
        }
      })
        .then(result => {
          this.$toast.clear();

          if (result.data.code == "E001") {
            this.$toast(result.data.msg);
            // 关闭弹窗
            this.editPwdShow = false;
            // 清除tkmm
            localStorage.removeItem("__Tkmm");
            this.$router.push({ name: "Login" });
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch(err => {
          this.$toast.clear();
          // this.$toast(err.data.msg);
        });
    },
    // 退出登录
    goOut() {
      // 清除缓存
      localStorage.removeItem("__Tkmm");
      this.$toast("退出登录成功");
      this.$router.push({ name: "Login" });
    },
    // 注销账号
    destroy() {
      this.$dialog
        .confirm({
          title: "注销账号",
          message: "一旦注销，数据无法恢复"
        })
        .then(() => {
          let tokenString = localStorage.getItem("__Tkmm");

          this.$toast.loading({
            message: "加载中...",
            forbidClick: true,
            duration: 0
          });

          this.axios({
            method: "POST",
            url: "http://www.kangliuyong.com:10002/destroyAccount",
            data: {
              appkey: this.appkey,
              tokenString
            }
          })
            .then(result => {
              this.$toast.clear();
              if (result.data.code == "G001") {
                //清除token
                localStorage.removeItem("__Tkmm");
                this.$router.push({ name: "Login" });
              } else {
                this.$toast(result.data.msg);
              }
            })
            .catch(err => {
              this.$toast.clear();
            });
        })
        .catch(err => {});
    }
  }
};
</script>

<style lang="scss" scoped>
</style>