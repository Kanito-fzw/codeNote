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
                    :items="[
                        {
                            text: '是' ,
                            value: true ,
                          },{
                            text: '否' ,
                            value: false ,
                          }]"
                    label="开机启动"
                    required
                    v-model="configData.startWithWindow"
                ></v-select>
              </v-col>
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
                    v-model="configData.preview.hljs.style"
                ></v-select>
              </v-col>
              <v-col
                  cols="12"
                  sm="8"
              >
                <v-select
                    :items="[
                        {
                            text: '所见即所得' ,
                            value: 'wysiwyg' ,
                          },{
                            text: '即时渲染' ,
                            value: 'ir' ,
                          },{
                            text: '分屏预览' ,
                            value: 'sv' ,
                          }]"
                    label="默认编辑模式"
                    required
                    v-model="configData.mode"
                ></v-select>
              </v-col>
              <v-col
                  cols="12"
                  sm="8"
              >
                <v-autocomplete
                    :items="[{
                            text: '标题' ,
                            value: 'headings' ,
                          },{
                            text: '粗体' ,
                            value: 'bold' ,
                          },{
                            text: '斜体' ,
                            value: 'italic' ,
                          },{
                            text: '删除线' ,
                            value: 'strike' ,
                          },{
                            text: '链接' ,
                            value: 'link' ,
                          },{
                            text: '上传图片或文件' ,
                            value: 'upload' ,
                          },{
                            text: '无序列表' ,
                            value: 'list' ,
                          },{
                            text: '有序列表' ,
                            value: 'ordered-list' ,
                          },{
                            text: '任务列表' ,
                            value: 'check' ,
                          },{
                            text: '引用' ,
                            value: 'quote' ,
                          },{
                            text: '分割线' ,
                            value: 'line' ,
                          },{
                            text: '表格' ,
                            value: 'table' ,
                          },{
                            text: '代码块' ,
                            value: 'code' ,
                          },{
                            text: '行内代码' ,
                            value: 'inline-code' ,
                          },{
                            text: '全屏' ,
                            value: 'fullscreen' ,
                          },{
                            text: '导出' ,
                            value: 'export' ,
                          },{
                            text: '其他' ,
                            value: {
                                name: 'more',
                                toolbar: [
                                    'edit-mode',
                                    'both',
                                    'code-theme',
                                    'content-theme',
                                    'preview',
                                    'info',
                                    'help',
                                ],
                            } ,
                          },
                        ]"
                    label="工具栏功能"
                    multiple
                    v-model="configData.toolbar"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="success"
              class="mr-4"
              @click="save"
          >
            保存并重启
          </v-btn>

          <v-btn
              color="error"
              class="mr-4"
              @click="reset"
          >
            还原并重启
          </v-btn>

          <v-btn
              color="warning"
              @click="hiddenDialog"
          >
            退出
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
const ipcRenderer = window.require('electron').ipcRenderer
export default {
  data: () => ({
    configData: {
      preview:{
        hljs:{
          style:''
        }
      },
      toolbar: [],
      mode: '',
      startWithWindow: false
    }
  }),
  mounted() {

  },
  computed: {
    openSetting() {
      this.configData= this.$ls.getLocalStorage('configData')
      return this.$store.getters.openSetting;
    }
  },
  methods: {
    reset(){
      this.configData={
        startWithWindow:false,
        mode: 'ir',
        preview: {
          hljs: {
            style: 'vs'
          }
        },
        toolbar:[
          'headings',
          'bold',
          'italic',
          'strike',
          'link',
          'upload',
          'list',
          'ordered-list',
          'check',
          'quote',
          'line',
          'table',
          'code',
          'inline-code',
          'fullscreen',
          'export',
          {
            name: 'more',
            toolbar: [
              'edit-mode',
              'both',
              'code-theme',
              'content-theme',
              'preview',
              'info',
              'help',
            ],
          }
        ]

      }
      this.save()
    },
    save(){
      this.$ls.setLocalStorage('configData',this.configData)
      this.hiddenDialog()
      ipcRenderer.send("restart-message");
    },
    hiddenDialog() {
      this.$store.commit('showOpenSetting', false)
    }
  }
}
</script>
