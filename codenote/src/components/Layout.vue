<template>
  <v-app id="inspire">
    <v-navigation-drawer
        v-model="drawer"
        app
    >
    <LeftWrapper></LeftWrapper>
    </v-navigation-drawer>

    <v-app-bar app style="background: white" min-width="300" height="26">
      <Tabs></Tabs>
    </v-app-bar>



    <v-main>
      <v-container>
        <v-row>
          <v-col
              v-for="n in 24"
              :key="n"
              cols="4"
          >
            <v-card height="200"></v-card>
          </v-col>
        </v-row>
      </v-container>
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