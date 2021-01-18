<template>
  <div>
    <el-col :span="24" v-show="tabsShowFlag">
      <el-tabs v-model="activeTab"
               ref="tabs"
               type="card"
               closable
               tab-position="top"
               @tab-remove="removeTab"
               @tab-click="tabClick">
        <el-tab-pane
            style="height: 30px"
            v-for="(item, index) in tabsItem"
            :key="item.id"
            :label="item.title"
            :name="item.name"
        >
        </el-tab-pane>
      </el-tabs>

    </el-col>
    <v-card
        v-show="showSearchBar"
        class="mx-auto"
        max-width="300"
        tile
    >
      <v-list dense
              style="position: fixed; top: 60px; z-index: 3001; right: 152px; width: 170px  ">
        <v-list-item-group
            color="primary"
        >
          <v-list-item
              v-for="(item, i) in items"
              @click.prevent="searchClick(item)"
          >
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </div>

</template>
<script>
import bus from '@/utils/js/bus';

const {remote, ipcRenderer} = window.require('electron')
import {FindInPage} from 'electron-find'

export default {
  data() {
    return {
      items: [],
      idCollection: [],
      showSearchBar: false,
      activeTab: '', //默认显示的tab
      tabsItem: [],
      tabIndex: 1,
      tabsShowFlag: false
    }
  },
  watch: {
    tabsItem(val) {
      if (val.length === 0) {
        this.tabsShowFlag = false
        this.$router.push({
          path: '/About'
        })
      } else {
        this.tabsShowFlag = true
      }
    }
  },
  mounted() {
    bus.$on('add', (name, val) => {
      this.addTab(name, val)
    })
    bus.$on('delete', (val) => {
      this.removeTab(val.toString())
    })
    bus.$on('reName', (id, newName) => {
      this.reNameTab(id, newName)
    })
    window.findInPage = new FindInPage(remote.getCurrentWebContents(), {
      preload: true,
      parentElement: document.getElementById('markDownWrapper'),
      offsetTop: 30,
      duration: 200,
    })

    ipcRenderer.on("open-find", (event, arg) => {
      this.open_findForm()
    });

    //全文检索按键监听
    let findInput = document.getElementsByClassName('find-input')[0]
    let findClose = document.getElementsByClassName('find-close')[0]
    findInput.addEventListener('input', this.inputEvent)
    findClose.addEventListener('click', () => {
      this.showSearchBar = false
      this.items = []
    })
    document.addEventListener('keydown', (e) => {
      if (e.keyCode === 27) {
        this.showSearchBar = false
        this.items = []
      }
    })
  },
  methods: {
    searchClick(item) {
      this.addTab(item.name, item.id)
      this.tabClick({name: item.id.toString()})
    },
    //当前页面查询高亮
    open_findForm() {
      window.findInPage.openFindWindow()
      this.showSearchBar = true
    },
    //全文检索
    inputEvent() {
      this.items = []
      if (document.getElementsByClassName('find-input')[0].value) {
        this.$db.getAllContent(document.getElementsByClassName('find-input')[0].value, result => {
          this.idCollection = result
          this.getTreeList()
        })
      }
    },
    getTreeList() {
      let treeList = JSON.parse(window.localStorage.getItem('titleTree'));
      if (treeList.length > 0) {
        for (let i = 0; i < treeList.length; i++) {
          this.mapTitleTree(treeList[i])
        }
      }

    },
    mapTitleTree(data) {
      if (data.children) {
        if (data.children.length > 0) {
          for (let i = 0; i < data.children.length; i++) {
            this.mapTitleTree(data.children[i])
          }
        }
      } else if (data.icon) {
        for (let i = 0; i < this.idCollection.length; i++) {
          if (data.id.toString() === this.idCollection[i]) {
            this.items.push({name: data.label, id: data.id})
          }
        }
      }
    },
    addTab(name, val) {//增加tab
      let flag = true
      this.tabsItem.forEach((item) => {
        if (item.id === val) {
          this.activeTab = item.name
          flag = false
        }
      })
      if (flag) {
        this.tabsItem.push({
          title: name,
          name: val.toString(),
          id: val,
        })
        this.activeTab = val.toString()
      }
    },
    removeTab(targetName) { //删除Tab
      let tabs = this.tabsItem //当前显示的tab数组
      let activeName = this.activeTab //点前活跃的tab

      //如果当前tab正活跃 被删除时执行
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
              this.tabClick(nextTab)
            }
          }
        });
      }
      this.activeTab = activeName
      this.tabsItem = tabs.filter(tab => tab.name !== targetName)
    },
    reNameTab(id, newName) { //重命名Tab
      let tabs = this.tabsItem //当前显示的tab数组
      tabs.forEach((tab) => {
        if (tab.id === id) {
          tab.title = newName
        }
      })
    },
    tabClick(thisTab) {

      /*
      * thisTab:当前选中的tabs的实例,name值是字符串格式的id
      * 通过当前选中tabs的实例获得当前实例的path 重新定位路由
      * */
      try {
        this.tabsItem.forEach((item) => {
          if (item.name === thisTab.name) {
            if (item.id != this.$route.path.substr(10)) {
              bus.$emit('focus', item.id)
              this.$router.push({
                path: '/Markdown/' + item.id + '?a=' + item.title
              })
            }
            throw new Error("breakForEach");
          }
        })
      } catch (e) {
        if (e.message != "breakForEach") throw e;
      }

    }
  }
}
</script>
<style>
.el-tabs {
  height: 34px !important;
  margin-top: -1px;
  border: 0;

}

.el-tabs__item {
  height: 34px !important;
  padding: 0 20px !important;
  line-height: 34px !important;
}

.el-icon-close {
  display: inline !important
}
</style>
