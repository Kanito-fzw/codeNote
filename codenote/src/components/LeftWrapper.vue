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
      <v-tab @change="showTree(false)">大纲</v-tab>
    </v-tabs>
    <v-divider></v-divider>
    <!--  树状结构-->
    <TreeView v-if="showFlag"></TreeView>
    <FileIndex v-if="!showFlag"></FileIndex>
  </div>
</template>

<script>
import TreeView from "@/components/TreeView";
import Headshot from "@/components/Headshot";
import FileIndex from "@/components/FileIndex";

export default {
  components: {
    TreeView, Headshot,FileIndex
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
