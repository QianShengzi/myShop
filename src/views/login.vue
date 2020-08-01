<template>
  <div class="register">
    <van-nav-bar
      title="登录"
      left-text="返回"
      right-text="注册"
      @click-right="toReg"
      @click-left="toMain"
    />
    <div class="logo">
      <img class="auto-img" src="../assets/images/logo.png" alt />
    </div>

    <van-form :show-error="false" @submit="onSubmit">
      <van-field
        type="text"
        label="手机号"
        v-model="userInfo.username"
        @change="inputUserChange"
        placeholder="手机号"
        :rules="isUserEmpty?[]:[myUserRules]"
      >
        <!-- 自定义右边图标 -->
      </van-field>

      <van-field
        v-model="userInfo.pwd"
        :type="isEye?'text':'password'"
        label="密　码"
        placeholder="密　码"
        :right-icon="pwdEye"
        @change="inputPwdChange"
        @click-right-icon="eyes"
        :rules="isPwdEmpty?[]:[myPwdRules]"
      />
      <div class="forgot clearfix">
        <span class="fr" @click="forgot">忘记密码</span>
      </div>
      <div class="register-btn">
        <van-button round block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import "../assets/css/login.less";
export default {
  data() {
    return {
      userInfo: {
        username: "",
        nickName: "",
        pwd: ""
      },
      isEye: false,
      pwdEye: "closed-eye",
      isUserEmpty: true,
      isNickNameEmpty: true,
      isPwdEmpty: true,
      // 用户名验证
      myUserRules: {
        required: true,
        message: "手机号格式不正确，请重新输入",
        pattern: /^(13|14|15|17|18)[0-9]{9}$/
      },
      //   密码验证
      myPwdRules: {
        required: true,
        message: "密码包含数字,英文,字符中的两种以上，长度6-20位",
        pattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,20}$/
      }
    };
  },
  created() {
    let tokenString = localStorage.getItem("__Tkmm");
    if (tokenString) {
      this.$router.push({ name: "MyShop" });
    }
  },
  methods: {
    // 密码显示 隐藏 图标切换
    eyes() {
      this.isEye = !this.isEye;
      if (this.isEye) {
        this.pwdEye = "eye";
      } else {
        this.pwdEye = "closed-eye";
      }
    },
    // 输入框 判断内容是否为空 为空时不进行账号验证
    inputUserChange() {
      //
      if (this.userInfo.username) {
        this.isUserEmpty = false;
      } else {
        this.isUserEmpty = true;
      }
    },
    // 输入框 判断内容是否为空 为空时不进行昵称验证
    inputNickNameChange() {
      //
      if (this.userInfo.nickName) {
        this.isNickNameEmpty = false;
      } else {
        this.isNickNameEmpty = true;
      }
    },
    // 输入框 判断内容是否为空 为空时不进行密码验证
    inputPwdChange() {
      //
      if (this.userInfo.pwd) {
        this.isPwdEmpty = false;
      } else {
        this.isPwdEmpty = true;
      }
    },
    // 提交验证
    onSubmit() {
      // 表单为空时 阻止提交
      if (!this.userInfo.username || !this.userInfo.pwd) {
        this.$toast("请填写登录信息");
        return;
      }
      //

      //复制对象
      let data = Object.assign(
        {},
        {
          phone: this.userInfo.username,
          nickName: this.userInfo.nickName,
          password: this.userInfo.pwd
        }
      );

      //请求密钥
      data.appkey = this.appkey;

      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,

        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration: 0
      });

      //发起注册请求
      this.axios({
        method: "POST",
        url: "http://www.kangliuyong.com:10002/login",

        //post传递参数需要写在data
        data
      })
        .then(result => {
          //关闭加载提示
          this.$toast.clear();

          // this.$toast(result.data.msg);
          // 登录成功 跳转主页面
          if (result.data.code === 200) {
            localStorage.setItem("__Tkmm", result.data.token);
            this.$router.push({ name: "MyShop" });
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch(err => {
          //关闭加载提示
          this.$toast.clear();
        });
    },
    // 跳转注册页
    toReg() {
      this.$router.push({ name: "Register" });
    },
    // 返回主页
    toMain() {
      this.$router.push({ name: "MyShop" });
    },
    // 忘记密码
    forgot() {
      this.$router.push({ name: "Forgot" });
    }
  }
};
</script>

<style lang="less" scoped>
</style>