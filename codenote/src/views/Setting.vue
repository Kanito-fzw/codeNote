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
                    label="默认代码块样式"
                ></v-select>
              </v-col>
              <v-col
                  cols="12"
                  sm="8"
              >
                <v-select
                    :items="['所见即所得', '即时渲染', '分屏预览']"
                    label="默认编辑模式"
                    required
                ></v-select>
              </v-col>
              <v-col
                  cols="12"
                  sm="8"
              >
                <v-autocomplete
                    :items="[
                          '标题',
                          '粗体',
                          '斜体',
                          '删除线',
                          '链接',
                          '上传图片或文件',
                          '无序列表',
                          '有序列表',
                          '任务列表',
                          '引用',
                          '分割线',
                          '表格',
                          '代码块',
                          '行内代码',
                          '全屏',
                          '导出',
                        ]"
                    label="工具栏功能"
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
