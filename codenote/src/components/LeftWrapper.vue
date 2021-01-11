<template>
  <div style="height:100%; overflow: hidden;">
    <v-sheet
        color="grey lighten-4"
        class="pa-4"
    >
      <!--      头像-->
      <Headshot></Headshot>
    </v-sheet>
    <v-tabs grow height="34">
      <v-tab>文件</v-tab>
      <v-tab>目录</v-tab>
    </v-tabs>
    <v-divider></v-divider>
    <!--  树状结构-->
    <TreeView></TreeView>
  </div>
</template>

<script>
import TreeView from "@/components/TreeView";
import Headshot from "@/components/Headshot";

export default {
  components: {
    TreeView, Headshot
  },
}
</script>

<style scoped>

</style>
