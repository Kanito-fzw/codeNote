<template>
  <v-app id="inspire">
    <!--    左侧drawer-->
    <v-navigation-drawer
        v-model="drawer"
        app
        id="leftWrapper"
    >
      <LeftWrapper></LeftWrapper>
    </v-navigation-drawer>

    <!--    标签栏-->
    <v-app-bar app min-width="300" height="34">
      <Tabs></Tabs>
    </v-app-bar>

    <!--主界面-->
    <v-main>
        <router-view></router-view>
      <!--  drawer控制按钮    -->
      <v-btn style="position: fixed;bottom:10px;right:10px"
             class="mx-2"
             fab
             x-small
             dark
             color="grey"
             @click="drawer = !drawer"
      >
        <v-icon dark>
          mdi-format-list-bulleted-square
        </v-icon>
      </v-btn>
    </v-main>
    <Login></Login>
    <Register></Register>
    <Setting></Setting>
  </v-app>
</template>

<script>
import LeftWrapper from "@/components/LeftWrapper";
import Tabs from "@/components/Tabs";
import Login from "@/views/Login";
import Register from "@/views/Register";
import Setting from "@/views/Setting";



export default {
  components: {
    Tabs, LeftWrapper,Login,Register,Setting
  },
  data() {
    return {
      drawer: null
    }
  }

}
</script>
<style>
.v-app-bar{
  background: white!important;
}
</style>
