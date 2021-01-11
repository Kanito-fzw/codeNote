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
      <v-tab @change="showTree(true)">文件</v-tab>
      <v-tab @change="showTree(false)">目录</v-tab>
    </v-tabs>
    <v-divider></v-divider>
    <!--  树状结构-->
    <TreeView v-if="showFlag"></TreeView>
  </div>
</template>

<script>
import TreeView from "@/components/TreeView";
import Headshot from "@/components/Headshot";

export default {
  components: {
    TreeView, Headshot
  },
  data(){
    return{
      showFlag:true
    }
  },
  methods:{
    showTree(showFlag){
      this.showFlag=showFlag
    }
  }
}
</script>

<style scoped>

</style>
