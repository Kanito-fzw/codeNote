<template>
  <div>
    <v-row justify="center">
      <v-dialog
          v-model="dialog"
          persistent
          max-width="290"
      >
        <v-card>
          <v-card-title class="headline">
            通知
          </v-card-title>
          <v-card-text>{{ message }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="green darken-1"
                text
                @click="dialog = false"
            >
              关闭
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      message: '通知详情',
      dialog: false,
    }
  },
  mounted() {
    let notice = this.$ls.getLocalStorage('notice')
    //todo 发送ajax请求获取新通知
    let newNotice = {id: 1, message: '通知详情'}
    // if (notice.id!==newNotice.id)
    // this.message = notice.message
    // this.$ls.setLocalStorage('notice', newNotice)
    //   this.dialog=true
    // }
  }
}
</script>
