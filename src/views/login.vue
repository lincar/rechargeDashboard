<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="login-con">
      <Card :bordered="false">
        <p slot="title">
          <Icon type="log-in"></Icon>
          <span>欢迎登录</span>
        </p>
        <div class="form-con">
          <Form ref="loginForm" :model="admin" :rules="rules">
            <FormItem prop="account">
              <Input v-model="admin.username" placeholder="请输入用户名">
              <span slot="prepend">
                <Icon :size="16" type="person"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="admin.password" placeholder="请输入密码">
              <span slot="prepend">
                <Icon :size="14" type="locked"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button @click="handleSubmit" type="primary" long>登录</Button>
            </FormItem>
          </Form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
  import Admin from '@/tool/Admin.js'

  export default {
    data() {
      return {
        returnUrl: '',
        admin: new Admin(),
        rules: {
          username: [
            {required: true, message: '账号不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ]
        }
      };
    },
    created() {
      this.returnUrl = this.$route.query.returnUrl || location.origin + location.pathname;
    },
    methods: {
      handleSubmit() {
        let that = this;
        this.$refs.loginForm.validate(
          (valid) => {
            if (valid) {
              that.admin.login().then(
                res => {
                  localStorage.setItem('user', JSON.stringify(res.data.data));
                  location.href = decodeURIComponent(that.returnUrl);
                },
                err => {
                  console.error(err);
                }
              );
            }
          }
        );
      }
    }
  };
</script>
