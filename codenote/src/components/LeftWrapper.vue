<template>
<div>
  <v-sheet
      color="grey lighten-4"
      class="pa-4"
  >
    <Login></Login>
  </v-sheet>
  <v-tabs  grow height="34">
    <v-tab>文件</v-tab>
    <v-tab>目录</v-tab>
  </v-tabs>
  <v-divider></v-divider>
  <TreeView></TreeView>
</div>




</template>

<script>
import TreeView from "@/components/TreeView";
import Login from "@/components/Login";
export default {
  components:{
    TreeView,Login
  },
}
</script>

<style scoped>

</style>