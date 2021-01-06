<template>
  <div class="block">
    <el-tree
        :data="data"
        node-key="id"
        draggable
        @node-click="noteClick"
        highlight-current
        @node-contextmenu="nodeContextmenu"
        :allow-drop="allowDrop">
      <div class="custom-tree-node" slot-scope="{ node, data }">
        <!--        编辑状态-->
        <template v-if="node.isEdit">
          <el-input v-model="data.label"
                    autofocus
                    size="mini"
                    :ref="'slotTreeInput'+data[NODE_KEY]"
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
          <span>
          <el-button
              v-if="!data.icon"
              type="text"
              size="mini"
              @click.stop="() => appendFile(data)">
            <v-icon>
              {{ 'mdi-file-plus-outline' }}
            </v-icon>
          </el-button>
          <el-button
              v-if="!data.icon"
              type="text"
              size="mini"
              @click.stop="() => append(data)">
            <v-icon>
              {{ 'mdi-folder-plus' }}
            </v-icon>
          </el-button>
          <el-button
              type="text"
              size="mini"
              @click="() => remove(node, data)">
            <v-icon>
              {{ 'mdi-delete' }}
            </v-icon>
          </el-button>
        </span>
        </template>

      </div>
    </el-tree>
  </div>
</template>

<script>
let id = 1000;

export default {
  data() {
    return {
      treeClickCount: 0,
      data: [
        {
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1',
              icon: 'mdi-file-document-outline',
            }, {
              id: 10,
              label: '三级 1-1-2',
              icon: 'mdi-file-document-outline',
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1',
            icon: 'mdi-file-document-outline',
          }, {
            id: 6,
            label: '二级 2-2',
            icon: 'mdi-file-document-outline',
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1',
            icon: 'mdi-file-document-outline',
          }, {
            id: 8,
            label: '二级 3-2',
            icon: 'mdi-file-document-outline',
          }]
        }
      ]
    }
  },
  created() {
    this.initTree()
  },
  methods: {
    initTree() {
    },
    handleEdit(_node, _data) {
      // 设置编辑状态
      if (!_node.isEdit) {
        this.$set(_node, 'isEdit', true)
      }
      // 输入框聚焦
      this.$nextTick(() => {
        if (this.$refs['slotTreeInput' + _data[this.NODE_KEY]]) {
          this.$refs['slotTreeInput' + _data[this.NODE_KEY]].$refs.input.focus()
        }
      })
    },
    handleInput(_node, _data) {
      // 退出编辑状态
      if (_node.isEdit) {
        this.$set(_node, 'isEdit', false)
      }
    },
    nodeContextmenu(event, data, node, obj) {

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
    append(data) {
      const newChild = {id: id++, label: 'folder', children: []};
      if (!data.children && !data.icon) {
        this.$set(data, 'children', []);
      }
      if (data.icon) {

      } else {

        data.children.push(newChild);
      }
    },
    appendFile(data) {
      const newChild = {id: id++, label: 'file', icon: 'mdi-file-document-outline'};
      if (!data.children && !data.icon) {
        this.$set(data, 'children', []);
      }
      if (data.icon) {

      } else {

        data.children.push(newChild);
      }
    },

    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
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
    }
  }
};
</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
