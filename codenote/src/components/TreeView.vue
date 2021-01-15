<template>
  <div class="block" style="height:100%; overflow: auto;" ref="block" @contextmenu="rightClick">
    <el-tree
        id="tree"
        :data="treeTitles"
        node-key="id"
        draggable
        @node-click="noteClick"
        :highlight-current="true"
        ref="tree"
        @node-contextmenu="treeRightClick"
        :allow-drop="allowDrop">
      <div class="custom-tree-node" slot-scope="{ node, data }">
        <!--        编辑状态-->
        <template v-if="node.isEdit">
          <el-input v-model="data.label"
                    autofocus
                    size="mini"
                    :ref="'slotTreeInput'+data"
                    @blur.stop="handleInput(node, data)"
                    @keyup.enter.native="handleInput(node, data)"></el-input>
        </template>
        <!-- 非编辑状态 -->
        <template v-else>
                  <span>
<!--          根据是否有icon属性判断是文件还是文件夹-->
          <v-icon v-if="!data.icon">
        {{ node.expanded ? 'mdi-folder-open' : 'mdi-folder' }}
      </v-icon>
      <v-icon v-else>
        {{ data.icon }}
      </v-icon>  {{ node.label }}</span>
        </template>

      </div>

    </el-tree>
    <el-dropdown-menu
        slot="dropdown"
        id="right-menu"
        class="right-menu"
        :style="style"
        v-show="contextMenuVisible"
    >
      <el-dropdown-item @click.native="newFolder" v-show="newFolderShow" >创建文件夹</el-dropdown-item>
      <el-dropdown-item @click.native="newFile" v-show="newFileShow" >创建文件</el-dropdown-item>
      <el-dropdown-item @click.native="reNameFile" v-show="deleteFileShow" >重命名</el-dropdown-item>
      <el-dropdown-item @click.native="deleteFile" v-show="deleteFileShow">删除</el-dropdown-item>
    </el-dropdown-menu>
  </div>
</template>

<script>
let id = window.localStorage.getItem('startId') || 1000;
import bus from '@/utils/js/bus';
import {component as VueContextMenu} from '@xunlei/vue-context-menu'

export default {
  components: {
    'context-menu': VueContextMenu
  },
  data() {
    return {
      breadList:[],     //面包屑数组
      breadLabel:'',     //面包屑路径
      treeClickCount: 0,
      treeTitles: [], //tree数据
      contextMenuVisible: false,//显示右键
      currentNode: '',//右键选中节点
      currentData: '',//右键选中节点数据
      deleteFileShow: false,
      newFolderShow: true,
      newFileShow: true,
      x: null,
      y: null,
      style: {
        display: 'none'
      },
    }
  },
  watch: {
    contextMenuVisible(val) {
      if (val) {
        document.body.addEventListener('click', this.closRightMenu)
      } else {
        document.body.removeEventListener('click', this.closRightMenu)
      }
    }
  },
  mounted() {
    bus.$on('focus', (id) => {
      this.focusNode(id)
    })
    if (this.treeTitles === null || this.treeTitles.length === 0) {
      let item = JSON.parse(window.localStorage.getItem('titleTree'));
      if (item.length !== 0) {
        this.treeTitles = item
      }
    }
  },
  updated() {
    this.saveLocalStorage()
  },
  beforeDestroy() {
    this.saveLocalStorage()
  },
  methods: {
    //保存数据
    saveLocalStorage() {
      window.localStorage.setItem('startId', id)
      window.localStorage.setItem('titleTree', JSON.stringify(this.treeTitles))
    },
    //tree右键事件
    treeRightClick(MouseEvent, object, Node, element) { // 鼠标右击触发事件
      if (object.icon) {
        this.newFileShow = false
        this.newFolderShow = false
      } else {
        this.newFileShow = true
        this.newFolderShow = true
      }
      this.x = MouseEvent.clientX
      this.y = MouseEvent.clientY
      this.currentData = object
      this.currentNode = Node
      this.deleteFileShow = true
      this.openRightMenu()

    },
    //右键事件
    rightClick(event) {
      this.newFileShow = true
      this.newFolderShow = true
      this.deleteFileShow = false
      this.x = event.clientX
      this.y = event.clientY
      this.openRightMenu()
    },
    //显示右键
    openRightMenu() {
      this.style = {
        left: this.x + 'px',
        top: this.y + 'px',
        display: this.contextMenuVisible ? 'block' : 'none',
        padding: '0'
      }
      this.contextMenuVisible = true
    },
    //隐藏右键
    closRightMenu() {
      this.contextMenuVisible = false
      this.deleteFileShow = false
    },
    newFolder() {
      if (this.deleteFileShow) {
        this.append(this.currentData)
      } else {
        this.appendRoot()
      }
      this.contextMenuVisible = false
    },
    newFile() {
      if (this.deleteFileShow) {
        this.appendFile(this.currentData)
      } else {
        this.appendRootFile()
      }
      this.contextMenuVisible = false
    },
    reNameFile(){
      if (this.deleteFileShow) {
        this.handleEdit(this.currentNode, this.currentData)
      }
      this.contextMenuVisible = false
    },
    deleteFile() {
      if (this.deleteFileShow) {
        this.remove(this.currentNode, this.currentData)
      }
      this.contextMenuVisible = false
    },
    focusNode(id) {
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(id)
        this.changeDept(this.$refs.tree.getCurrentNode())
      })
    },
    //重命名输入状态
    handleEdit(_node, _data) {
      if (!_node.isEdit) {
        this.$set(_node, 'isEdit', true)
      }
      this.$nextTick(() => {
        if (this.$refs['slotTreeInput' + _data]) {
          this.$refs['slotTreeInput' + _data].$refs.input.focus()
        }
      })
    },
    //重命名完成
    handleInput(_node, _data) {
      // 退出编辑状态
      if (_node.isEdit) {
        this.$set(_node, 'isEdit', false)
      }
      //如果是当前选中节点还要修改面包屑和tab
      if (_data.icon){
        if (_data.id===this.$refs.tree.getCurrentNode().id){
          this.changeDept(_data)
          this.$router.push({
            path: '/Markdown/' + _data.id+'?a='+ _data.label
          })
        }
        bus.$emit('reName', _data.id, _data.label)
      }
      this.saveLocalStorage()
    },
    //更新面包屑路径
    changeDept(data){
      let tree = this.$refs.tree;
      this.breadList = []; //初始化
      this.getTreeNode(tree.getNode(data));
      this.breadLabel='home>'+this.breadLabel
      window.localStorage.setItem('breadLabel', this.breadLabel)
    },
    //获取当前树节点和其父级节点
    getTreeNode(node){
      if (node) {
        if (node.label !== undefined) {
          this.breadList.unshift(node.label); //在数组头部添加元素
          this.getTreeNode(node.parent); //递归
          this.breadLabel=this.breadList.join('>');
        }
      }
    },

    //点击事件
    noteClick(data, node, obj) {
      //记录点击次数
      this.treeClickCount++;
      //单次点击次数超过2次不作处理,直接返回,也可以拓展成多击事件
      if (this.treeClickCount >= 2) {
        return;
      }
      //计时器,计算300毫秒为单位,可自行修改
      this.timer = setTimeout(() => {
        if (this.treeClickCount === 1) {
          //把次数归零
          this.treeClickCount = 0;
          //单击事件处理
          console.log('单击事件,可在此处理对应逻辑')
          this.changeDept(data)
          /*
          * 通过当前选中tabs的实例获得当前实例的path 重新定位路由
          * */
          if (data.icon) {
            if (data.id == this.$route.path.substr(10)) {
              return false
            }
            bus.$emit('add', data.label, data.id)
            this.$router.push({
              path: '/Markdown/' + data.id+'?a='+data.label
            })
          }


        } else if (this.treeClickCount > 1) {
          //把次数归零
          this.treeClickCount = 0;
          //双击事件
          console.log('双击事件,可在此处理对应逻辑')
          this.handleEdit(node, data)
        }
      }, 300);

    },
    //限制被拖入的节点不能是文件
    allowDrop(draggingNode, dropNode, type) {
      return !(dropNode.data.icon && type === 'inner');
    },
    //新增文件夹
    append(data) {
      if (!data.children && !data.icon) {
        this.$set(data, 'children', []);
      }
      if (data.icon) {
      } else {
        this.$prompt('请输入文件夹名', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({value}) => {
          const newChild = {id: id++, label: value, children: []};
          data.children.push(newChild);
          this.saveLocalStorage()
          this.focusNode(newChild.id.toString())
        })
      }
    },
    //新增文件
    appendFile(data) {
      if (!data.children && !data.icon) {
        this.$set(data, 'children', []);
      }
      if (data.icon) {
      } else {
        this.$prompt('请输入文件名', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({value}) => {
          const newChild = {id: id++, label: value, icon: 'mdi-file-document-outline'};
          data.children.push(newChild);
          this.create_markdownFile(newChild.id)
          this.saveLocalStorage()
          //增加tabs
          bus.$emit('add', newChild.label, newChild.id)
          this.focusNode(newChild.id.toString())
          this.$nextTick(() => {
            this.$router.push({
              path: '/Markdown/' + newChild.id
            })
          })
        })
      }
    },
    //根路径新增文件夹
    appendRoot() {
      this.$prompt('请输入文件夹名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({value}) => {
        const newChild = {id: id++, label: value, children: []};
        this.treeTitles.push(newChild);
        this.saveLocalStorage()
        this.focusNode(newChild.id.toString())
      })
    },
    //根路径新增文件
    appendRootFile() {
      this.$prompt('请输入文件名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({value}) => {
        const newChild = {id: id++, label: value, icon: 'mdi-file-document-outline'};
        this.treeTitles.push(newChild);
        this.create_markdownFile(newChild.id)
        this.saveLocalStorage()
        //增加tabs
        bus.$emit('add', newChild.label, newChild.id)
        this.focusNode(newChild.id.toString())
            this.$nextTick(() => {
              this.$router.push({
                path: '/Markdown/' + newChild.id
              })
            })

      })
    },

    //删除节点并关闭tab
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
      this.delete_markdownFile(data)
      bus.$emit('delete', data.id)
      this.closeTabs(data)

    },
    //关闭子节点tab
    closeTabs(data) {
      if (data.children && data.children.length && data.children.length > 0) {
        for (let i = 0; i < data.children.length; i++) {
          bus.$emit('delete', data.children[i].id)
          this.closeTabs(data.children[i])
        }
      }
    },

    renderContent(h, {node, data, store}) {
      return (
          <span class="custom-tree-node">
          <span>{node.label}</span>
          <span>
          <el-button size="mini" type="text" on-click={() => this.append(data)}>Append</el-button>
      <el-button size="mini" type="text" on-click={() => this.remove(node, data)}>Delete</el-button>
      </span>
      </span>);
    },

    create_markdownFile(id) {
      this.$db.postContent(id.toString(),'')
    },
    delete_markdownFile(data){
      if (data.icon){
        this.$db.deleteContent(data.id.toString())
      }
      if (data.children && data.children.length && data.children.length > 0) {
        for (let i = 0; i < data.children.length; i++) {
          this.closeTabs(data.children[i])
        }
      }
    }
  }
};
</script>

<style>
html,
body {
  height: 100%;
}


</style>
