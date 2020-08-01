<template>
  <div>
    <div>
      <button @click="sendGetByObj">点击测试</button>
      <div>{{text}}</div>
    </div>
  </div>
</template>

<script>
// import { monthSell } from "../assets/data/myData.js";
export default {
  data() {
    return {
      text: "11"
    };
  },
  methods: {
    sendGetByObj() {
      //

      //2.get通过params选项
      this.axios
        .get(`/api/index.php/v1/api/jd/getgoodshot`, {
          params: {
            apikey: "dd14c882d2f449e9",
            pageindex: 1,
            pagesize: 20
          },
          contentType: "application/x-www-form-urlencoded"
        })
        .then(function(response) {
          // this.text = response;
        })
        .catch(function(error) {});
    }
    //     sendGetByObj() {
    //       let data = Object.assign(
    //         {},
    //         {
    //           apikey: "dd14c882d2f449e9",
    //           pagesize: "20"
    //         }
    //       );
    //       this.axios.defaults.baseURL = "http://api-gw.haojingke.com/index.php";
    //       //请求密钥
    //       //   data.appkey = 'dd14c882d2f449e9';
    //       this.axios({
    //         method: "POST",
    //         url: "/v1/api/jd/goodslist",

    //         //post传递参数需要写在data
    //         data
    //       })
    //         .then(result => {
    //           //关闭加载提示
    //           this.$toast.clear();
    //
    //           // this.$toast(result.data.msg);
    //           // 登录成功 跳转主页面
    //           if (result.data.code === 200) {
    //             this.$router.push({ name: "Main" });
    //           } else {
    //             this.$toast(result.data.msg);
    //           }
    //         })
    //         .catch(err => {
    //           //关闭加载提示
    //           this.$toast.clear();
    //
    //         });
    //     }
  }
};
</script>

<style lang="scss" scoped>
</style>