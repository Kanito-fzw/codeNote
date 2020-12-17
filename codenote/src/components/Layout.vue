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


export default {
  components: {
    Tabs, LeftWrapper
  },
  data() {
    return {
      drawer: null
    }
  }

}
</script>