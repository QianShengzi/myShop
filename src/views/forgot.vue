<template>
  <div class="forgot">
    <!-- 导航栏 -->
    <div class="nav-top">
      <van-nav-bar class="top nav" title="忘记密码" left-text="返回" left-arrow @click-left="goPrev" />
    </div>
    <div class="Email" v-if="isShow">
      <!-- 验证邮箱表单 -->
      <van-form @submit="editEmail">
        <div class="text">邮箱验证</div>
        <van-field v-model="Email" label="邮　箱" placeholder="请输入邮箱" />
        <van-field v-model="sms" center clearable label="验证码" placeholder="请输入验证码">
          <template #button>
            <van-button
              size="small"
              type="primary"
              :disabled="isDisabled"
              @click="sendToEmail"
              v-if="isShow"
            >{{btnText}}</van-button>
          </template>
        </van-field>
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">提交</van-button>
        </div>
      </van-form>
    </div>

    <div class="foundPwd" v-else>
      <!-- 密码找回 -->
      <van-form @submit="editPwd">
        <div class="text">密码找回</div>
        <van-field v-model="phone" label="手机号" placeholder="请输入要找回的手机号" />
        <van-field
          v-model="pwd"
          center
          clearable
          label="新密码"
          :type="isEye?'text':'password'"
          :right-icon="pwdEye"
          @click-right-icon="eyes"
          placeholder="请输入新密码,至少包含字母数字(6-20)"
        ></van-field>
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">提交</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import "../assets/css/nav-top.less";
import "../assets/css/forgot.less";
export default {
  data() {
    return {
      //   保存第一次发送验证码的邮箱
      first: {
        Email: ""
      },
      pwdEye: "closed-eye",
      isEye: false,
      sms: "",
      Email: "",
      btnText: "发送验证码",
      phone: "",
      pwd: "",
      isDisabled: false,
      isShow: true,
      //   是否发送过邮件
      isSend: false
    };
  },
  methods: {
    goPrev() {
      this.$router.go(-1);
    },
    // 提交按钮 邮箱验证
    editEmail() {
      // 邮箱正则
      let EmailRep = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+\w{2,14}$/;
      let codeRep = /^\d{6}$/;
      //   邮箱未输入
      if (!this.Email) {
        this.$toast("请输入邮箱");
        return;
      }
      if (!EmailRep.test(this.Email)) {
        this.$toast("邮箱格式不正确");
        return;
      }
      if (!codeRep.test(this.sms)) {
        this.$toast("验证码为6位数字");
        return;
      }

      if (!this.isSend) {
        this.$toast("请先点击发送验证码");
        return;
      }
      //   与第一次输入的邮箱相同 进行验证请求
      if (this.Email == this.first.Email && this.isSend) {
        this.$toast.loading({
          message: "验证中...",
          forbidClick: true,
          duration: 0
        });
        // 请求验证邮箱验证码
        this.axios({
          method: "POST",
          url: "http://www.kangliuyong.com:10002/checkValidCode",
          data: {
            appkey: this.appkey,
            validCode: this.sms
          }
        })
          .then(result => {
            this.$toast.clear();

            if (result.data.code == "K001") {
              this.$toast(result.data.msg);
              // 显示密码找回界面
              this.isShow = false;
            } else {
              this.$toast(result.data.msg);
            }
          })
          .catch(err => {
            this.$toast.clear();
            // this.$toast(err.data.msg);
          });
      } else {
        this.$toast("输入的邮箱与第一次输入的不正确");
      }
    },
    // 发送邮件验证码
    sendToEmail() {
      // 邮箱正则
      let EmailRep = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+\w{2,14}$/;
      //   邮箱未输入
      if (!this.Email) {
        this.$toast("请输入邮箱");
        return;
      }
      if (!EmailRep.test(this.Email)) {
        this.$toast("邮箱格式不正确");
        return;
      } else {
        // 发送邮件时 保存第一次输入的邮箱
        if (this.first.Email == "") {
          this.first.Email = this.Email;
          this.isSend = true;
        }
        // 控制发送验证码按钮状态
        // 禁用
        this.isDisabled = true;
        this.btnText = "60s后重新发送";
        let sec = 60;
        let timer = setInterval(() => {
          sec--;

          this.btnText = sec + "s后重新发送";
          if (sec == 0) {
            //   启用
            this.isDisabled = false;
            this.btnText = "发送验证码";
            clearInterval(timer);
          }
        }, 1000);

        this.$toast.loading({
          message: "正在发送验证码...",
          forbidClick: true,
          duration: 0
        });
        // 请求发送邮箱验证码
        this.axios({
          method: "POST",
          url: "http://www.kangliuyong.com:10002/emailValidCode",
          data: {
            appkey: this.appkey,
            email: this.Email
          }
        })
          .then(result => {
            this.$toast.clear();

            if (result.data.code == "J001") {
              this.$toast(result.data.msg);
            } else {
              this.$toast(result.data.msg);
            }
          })
          .catch(err => {
            this.$toast.clear();
            // this.$toast(err.data.msg);
          });
      }
    },
    // 找回密码
    editPwd() {
      // 密码正则
      let pwdRep = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,20}$/;
      let phoneRep = /^(13|14|15|17|18)[0-9]{9}$/;
      //   不能为空
      if (!this.phone) {
        this.$toast("手机号不能为空");
        return;
      }
      if (!phoneRep.test(this.phone)) {
        this.$toast("手机号格式不正确");
        return;
      }
      if (!this.pwd) {
        this.$toast("新密码不能为空");
        return;
      }
      if (!pwdRep.test(this.pwd)) {
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
        url: "http://www.kangliuyong.com:10002/retrievePassword",
        data: {
          appkey: this.appkey,
          phone: this.phone,
          password: this.pwd
        }
      })
        .then(result => {
          this.$toast.clear();

          if (result.data.code == "L001") {
            this.$toast(result.data.msg);
            //   跳转登陆页面
            setTimeout(() => {
              this.$router.push({ name: "Login" });
            }, 500);
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch(err => {
          this.$toast.clear();
          // this.$toast(err.data.msg);
        });
    },
    // 密码显示 隐藏 图标切换
    eyes() {
      this.isEye = !this.isEye;
      if (this.isEye) {
        this.pwdEye = "eye";
      } else {
        this.pwdEye = "closed-eye";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>