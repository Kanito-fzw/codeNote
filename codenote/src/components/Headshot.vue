<template>
  <v-container
      fluid
      style="height: 80px"
  >
    <v-row justify="center">
      <v-menu
          bottom
          min-width="200px"
          rounded
          offset-y
      >
        <template v-slot:activator="{ on }">
          <v-btn
              icon
              x-large
              v-on="on"
          >

            <v-avatar color="grey" v-if="!user.userName">
              <v-icon dark>
                mdi-account-circle
              </v-icon>
            </v-avatar>
<!--         todo   已登录 未设置头像使用默认头像-->
            <v-avatar  v-if="user.userName&&!user.avatar">
              <img src="./1.jpg" alt="">
            </v-avatar>
            <v-avatar  v-if="user.userName&&user.avatar">
              <img :src="user.avatar" alt="">
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-list-item-content class="justify-center">
            <div class="mx-auto text-center">
              <v-avatar color="grey">
                <v-icon dark>
                  mdi-account-circle
                </v-icon>
              </v-avatar>
              <h3>{{ user.userName }}</h3>
              <p class="caption mt-1">
                {{ user.phone }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn
                  depressed
                  rounded
                  text
                  @click="openRegister"
              >
                注册
              </v-btn>
              <v-btn
                  depressed
                  rounded
                  text
                  @click="openLogin"
              >
              登录
              </v-btn>
              <v-btn
                  depressed
                  rounded
                  text
                  @click="openSetting"
              >
              设置
              </v-btn>
            </div>
          </v-list-item-content>
        </v-card>
      </v-menu>
    </v-row>
    <v-row justify="center" style="margin-top: 20px">
      {{user.userName||'未登录'}}
    </v-row>
  </v-container>
</template>

<script>

export default {
  data: () => ({
    user: {
      userName: '',
      phone: 'phoneNo',
      avatar:''
    },
  }),
  computed: {
    userName () {
      return this.$store.getters.userName
    }
  },
  watch:{
    userName(){
      this.user=this.$ls.getLocalStorage('userData')
    }
  },
  methods:{
    openLogin(){
      this.$store.commit('showOpenLogin',true)
    },
    openRegister(){
      this.$store.commit('showOpenRegister',true)
    },
    openSetting(){
      this.$store.commit('showOpenSetting',true)
    }
  }
}
</script>
