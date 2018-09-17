<template>
  <div>
    <div>
      <span class="login"></span>
    </div>
    <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <h3 class="title">登录</h3>
      <el-form-item prop="account">
        <el-input type="text" v-model="loginForm.account" auto-complete="new-password" placeholder="账号" @keyup.native.enter="enterPassword"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass" class="item-bottom-15">
        <!--auto-complete="new-password"-->
        <el-input type="password" ref="password" v-model="loginForm.checkPass" placeholder="密码" @keyup.native.enter="doLogin"></el-input>
      </el-form-item>
      <!-- <el-form-item class="item-bottom">
        <el-checkbox v-model="checked" checked>记住密码</el-checkbox>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" style="width:100%;" ref="btSubmit" :loading="logining"  @click="doLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
  import { mapActions } from 'vuex';
  export default {
    data() {
      return {
        logining: false,
        loginForm: {
          account: '',
          checkPass: ''
        },
        loginRules: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' }
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        },
        checked: true
      };
    },
    methods: {
      ...mapActions(['signIn']),
      async doLogin(ev) {
        let isPass = await this.$refs.loginForm.validate();
        if (!isPass) {
          return false;
        }
        try {
          this.logining = true;
          let loginInfo = {username: this.loginForm.account, password: this.loginForm.checkPass};
          let u = await this.signIn(loginInfo);
          this.logining = false;
          if (this.$route.query && this.$route.query.next) {
            this.$router.push(this.$route.query.next);
          } else {
            this.$router.push(this.$route.query.redirect || '/home');
          }
        } catch (e) {
          this.logining = false;
          this.$message.error(e.message);
        }
      }
    },
    mounted () {
    }
  };

</script>

<style rel="stylesheet/scss" lang="scss" scoped>

  .login {
    display: inline-block;
    width: 300px;
    height: 160px;
    /*background: url("../../assets/logo.png") no-repeat fixed 50px 30px;*/
  }
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 50px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0 auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .item-bottom {
      margin-bottom: 0;
    }
    .item-bottom-15 {
      margin-bottom: 15px;
    }
  }
</style>
