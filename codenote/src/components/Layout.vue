<template>
  <v-app id="inspire">
    <LeftWrapper></LeftWrapper>
    <v-banner
        single-line
        sticky
    >
      <Tabs></Tabs>
    </v-banner>



    <v-toolbar-title>

    </v-toolbar-title>
<!--    <v-icon v-show="drawer" id="drawerIcon"-->
<!--            @click="drawer = !drawer"-->
<!--    >-->
<!--      mdi-chevron-left-->
<!--    </v-icon>-->
<!--    <v-icon v-show="!drawer"-->
<!--            @click="drawer = !drawer"-->
<!--    >-->
<!--      mdi-chevron-right-->
<!--    </v-icon>-->
    <v-main>
      <!--  -->

    </v-main>
  </v-app>
</template>

<script>
import LeftWrapper from "@/components/LeftWrapper";
import Tabs from "@/components/Tabs";
export default {
  components:{
    Tabs,LeftWrapper
  },
  data(){
    return{
      drawer: null
    }
  }

}
</script>