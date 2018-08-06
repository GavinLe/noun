<template>
  <div class="reset-password-wrapper">
    <div>
      <div class="login"></div>
      <div class="btn">
        <el-button size="mini" @click="logout">退出</el-button>
      </div>
    </div>
    <el-form :model="resetFrom" label-width="100px" :rules="resetFromRules" ref="resetFrom" class="login-container">
      <el-form-item ref="hiddenPassword" v-show="false">
        <el-input type="password" style="position: absolute;z-index: -1;" disabled auto-complete="no"></el-input>
      </el-form-item>
      <div class="title">为了账户安全，请修改密码！</div>
      <el-form-item ref="oldPassword" label="旧密码" prop="oldPassword" v-if="resetPass !== 'resetPass' ">
        <el-input v-model="resetFrom.oldPassword" auto-complete="no" type="password" placeholder="请输入密码" size="mini" @keyup.native.enter="setFocus('password', true, true)"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input ref="password" v-model="resetFrom.password" auto-complete="no" maxlength="16" type="password" placeholder="请输入新密码" @keyup.native.enter="setFocus('checkPassword', true, true)" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="checkPassword">
        <el-input ref="checkPassword" v-model="resetFrom.checkPassword" auto-complete="no" maxlength="16" type="password" placeholder="请再次输入密码" @keyup.native.enter="submit()" size="mini"></el-input>
      </el-form-item>
      <el-form-item >
        <el-button type="primary" size="mini" @click="submit()">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import userApi from 'src/api/user';
  import { mapGetters, mapActions } from 'vuex';
  export default {
    components: {},
    computed: {
      ...mapGetters({
        userInfo: 'getUserInfo'
      })
    },
    data () {
      let validateOldPass = (rule, value, callback) => {
        if (this.resetPass === 'new' && value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.resetFrom.password !== '') {
            this.$refs.resetFrom.validateField('password');
          }
          callback();
        }
      };
      let validatePass = (rule, value, callback) => {
        let regex = /^((?=.*[a-z])|(?=.*[A-Z]))(?=.*\d)[^]{8,16}$/; // 密码必须同时含有数字和字母，且长度要在8-16位之间。
        if (value === '') {
          callback(new Error('请输入新密码'));
        } else if (!regex.test(value)) {
          callback(new Error('密码必须同时含有数字和字母，且长度要在8-16位之间。'));
        } else {
          if (this.resetFrom.checkPassword !== '') {
            this.$refs.resetFrom.validateField('checkPassword');
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.resetFrom.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        resetPass: 'new',
        resetFrom: {
          oldPassword: '',
          password: '',
          checkPassword: ''
        },
        resetFromRules: {
          oldPassword: [
            { validator: validateOldPass, trigger: 'blur' }
          ],
          password: [
            { validator: validatePass, trigger: 'change' }
          ],
          checkPassword: [
            { validator: validatePass2, trigger: 'change' }
          ]
        }
      };
    },
    methods: {
      ...mapActions(['signOut']),
      setFocus: function (refStr, isSelect, input) {
        let ref = this.$refs[refStr];
        setTimeout(() => {
          ref && ref.focus();
          if (input) {
            isSelect && ref.$refs['input'].select();
          } else {
            isSelect && ref.select();
          }
        }, 100);
      },
      cancel: function () {
        this.$refs.resetFrom.resetFields();
        this.$emit('submitDone', {status: 0, message: '取消'});
      },
      submit: function () {
        let _self = this;
        this.$refs['resetFrom'].validate((valid) => {
          if (valid) {
            let params = {
              userId: _self.userInfo.id,
              account: _self.userInfo.account,
              password: _self.resetFrom.password,
              checkPassword: _self.resetFrom.checkPassword
            };
            if (_self.resetPass === 'new') {
              params['oldPassword'] = _self.resetFrom.oldPassword;
              if (_self.resetFrom.oldPassword === _self.resetFrom.password) {
                _self.$message.error('新密码和旧密码不能相同');
                return;
              }
            }
            userApi.resetPwd(params).then((res) => {
              this.$refs.resetFrom.resetFields();
              _self.$message.success('新密码设置成功，请重新登录！');
              _self.signOut().then(() => {
                _self.$router.push({path: '/login'});
              });
            }).catch((e) => {
              _self.$message.error(e.message);
            });
          } else {
            return false;
          }
        });
      },
      logout: function () {
        var _this = this;
        this.$confirm('确认退出吗?', '提示', {
          // type: 'warning'
        }).then(() => {
          this.signOut().then(() => {
            _this.$router.push({path: '/login'});
          });
        }).catch(() => {

        });
      }
    },
    mounted() {
    }
  };
</script>

<style lang="scss" scoped>
  .reset-password-wrapper {
    .login {
      display: inline-block;
      width: 300px;
      height: 160px;
      background: url("../../assets/logo.png") no-repeat fixed 50px 30px;
    }
    .btn {
      display: inline-block;
      float: right;
      margin-top: 40px;
      margin-right: 10px;
    }
    .login-container {
      /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
      -webkit-border-radius: 5px;
      border-radius: 5px;
      -moz-border-radius: 5px;
      background-clip: padding-box;
      margin: 50px auto;
      width: 480px;
      padding: 35px 35px 15px 35px;
      background: #fff;
      border: 1px solid #eaeaea;
      // box-shadow: 0 0 25px #cac6c6;
      .title {
        margin: 0 auto 20px auto;
        text-align: center;
        color: #505458;
        font-weight: bold;
      }
      .item-bottom {
        margin-bottom: 0;
      }
      .item-bottom-15 {
        margin-bottom: 15px;
      }
    }
  }

</style>
