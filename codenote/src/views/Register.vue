<template>
  <v-row justify="center">
    <v-dialog
        v-model="openRegister"
        persistent
        max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">注册</span>
        </v-card-title>
        <v-card-text>
          <v-form
              ref="form"
              v-model="valid"
              lazy-validation
          >
            <table width="100%">
              <tr>
                <td colspan="2">
                  <v-text-field
                      v-model="user.phone"
                      name="phone"
                      :counter="11"
                      :rules="phoneRules"
                      label="手机号"
                      required
                  ></v-text-field>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <v-text-field
                      v-model="user.userName"
                      name="userName"
                      :rules="userNameRules"
                      label="用户名"
                      required
                  ></v-text-field>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <v-text-field
                      v-model="user.password"
                      name="password"
                      label="密码"
                      :rules="passwordRules"
                      type="password"
                      required
                  ></v-text-field>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <v-text-field
                      v-model="passwordCheck"
                      name="passwordCheck"
                      label="确认密码"
                      type="password"
                      :rules="[affirmPass]"
                      required
                  ></v-text-field>
                </td>
              </tr>
              <tr>
                <td width="50%">
                  <v-text-field
                      v-model="user.checkCode"
                      name="checkCode"
                      label="验证码"
                      :counter="4"
                      :rules="checkCodeRules"
                      required
                  ></v-text-field>
                </td>
                <td>
                  <v-btn
                      @click="getCheckCode"
                      :disabled="sending"
                  >{{ codeText }}</v-btn>
                </td>
              </tr>
              <tr>
                <v-btn
                    color="success"
                    class="mr-4"
                    @click="submit"
                >
                  注册
                </v-btn>

                <v-btn
                    color="error"
                    class="mr-4"
                    @click="reset"
                >
                  重置
                </v-btn>

                <v-btn
                    color="warning"
                    @click="hiddenDialog"
                >
                  退出
                </v-btn>
              </tr>
            </table>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  data: () => ({
    valid: true,
    codeText:'获取验证码',
    sending: false, // 是否发送验证码
    second: 60, // 倒计时间
    user:{
      phone: '',
      userName:'',
      password: '',
      checkCode: '',
    },
    phoneRules: [
      v => !!v || '请输入手机号',
      v => (v && v.length === 11) || '手机号错误',
    ],
    userNameRules: [
      v => !!v || '请输入用户名',
      v => (v && v.length >= 6) || '用户名需要大于6位',
      v => v.search(/\s/) === -1 || "不能有空格"
    ],

    passwordRules: [
      v => !!v || '请输入密码',
      v => (v && v.length >= 6) || '密码长度需要大于6位',
      v => v.search(/\s/) === -1 || "不能有空格"
    ],
    passwordCheck: '',

    checkCodeRules: [
      v => !!v || '请输入验证码',
      v => (v && v.length === 4) || '验证码错误',
    ],
  }),

  methods: {
    //确认密码
    affirmPass(val) {
      if (val !== this.user.password) {
        return "两次密码不一致";
      }
      return true;
    },
    //获取验证码
    getCheckCode(){
      // this.sending原为false,
      // 点击后立即使 this.sending == true，防止有人多次点击
      if (this.sending) { return }
      this.sending = true
      // $ajax.post('',this.user.phone).then(response => {
      this.timeDown()
      this.$message({
        type: 'success',
        message: '短信发送成功'
      })
      // })
    },
    // 倒计时
    timeDown() {
      const result = setInterval(() => {
        this.codeText = this.second
        this.second--
        if (this.second < 0) {
          clearInterval(result)
          this.sending = false
          this.second = 60
          this.codeText = '获取验证码'
        }
      }, 1000)
    },
    //提交
    submit() {
      this.$refs.form.validate()
    },
    //登录
    reset() {
      this.$refs.form.reset()
    },
    //关闭
    hiddenDialog() {
      this.$store.commit('showOpenRegister', false)
    }
  },
  computed: {
    openRegister() {
      return this.$store.getters.openRegister;
    }
  }
}
</script>
