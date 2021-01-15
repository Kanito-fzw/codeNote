<template>
  <v-row justify="center">
    <v-dialog
        v-model="openSetting"
        persistent
        max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">设置</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                  cols="12"
                  sm="8"
              >
                <v-select
                    :items="['abap', 'algol', 'algol_nu', 'api', 'arduino', 'autumn', 'borland', 'bw', 'colorful',
                        'dracula', 'emacs', 'friendly', 'fruity', 'github', 'igor', 'lovelace', 'manni', 'monokai',
                        'monokailight', 'murphy', 'native', 'paraiso-dark', 'paraiso-light', 'pastie', 'perldoc', 'pygments',
                        'rainbow_dash', 'rrt', 'solarized-dark', 'solarized-dark256', 'solarized-light', 'swapoff', 'tango',
                        'trac', 'vim', 'vs', 'xcode']"
                    label="代码块样式"
                ></v-select>
              </v-col>
              <v-col
                  cols="12"
                  sm="8"
              >
                <v-select
                    :items="['0-17', '18-29', '30-54', '54+']"
                    label="Age*"
                    required
                ></v-select>
              </v-col>
              <v-col
                  cols="12"
                  sm="8"
              >
                <v-autocomplete
                    :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                    label="Interests"
                    multiple
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="blue darken-1"
              text
              @click="hiddenDialog"
          >
            保存
          </v-btn>
          <v-btn
              color="blue darken-1"
              text
              @click="hiddenDialog"
          >
            关闭
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  data: () => ({}),
  computed: {
    openSetting() {
      return this.$store.getters.openSetting;
    }
  },
  methods: {
    hiddenDialog() {
      this.$store.commit('showOpenSetting', false)
    }
  }
}
</script>
