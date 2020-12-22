<template>
  <v-app id="inspire">
    <!--    左侧drawer-->
    <v-navigation-drawer
        v-model="drawer"
        app
    >
      <LeftWrapper></LeftWrapper>
    </v-navigation-drawer>

    <!--    标签栏-->
    <v-app-bar app style="background: white" min-width="300" height="26">
      <Tabs></Tabs>
    </v-app-bar>

    <!--主界面-->
    <v-main>
      <MainWarpper></MainWarpper>
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
  </v-app>
</template>

<script>
import LeftWrapper from "@/components/LeftWrapper";
import Tabs from "@/components/Tabs";
import MainWarpper from "@/components/MainWarpper";


export default {
  components: {
    Tabs, LeftWrapper, MainWarpper
  },
  data() {
    return {
      drawer: null
    }
  }

}
</script>
