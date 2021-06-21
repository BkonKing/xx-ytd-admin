<template>
  <div class="roleManage">
    <a-row :gutter="24">
      <a-col :span="10">
        <a-card >
          <!-- <a-button type="danger" ghost class="newAdd" @click="newAdd"
            >+新增</a-button
          > -->
        <div v-if="treeData.length>0">
            <a-tree
            class="draggable-tree"
            :tree-data="treeData"
            @select="selectInfo"
          >
            <template slot="custom" slot-scope="item">
              {{ item.roleName }}
              <a-icon class="icon" type="tool" @click="showPermiasion" />
              <a-icon class="icon" type="edit" @click="edit(item,'edit')" />
              <a-icon class="icon" type="apartment" @click="selectItem(item,'create')" />

            </template>
          </a-tree>
        </div>
        <div v-else>
          当前还没有角色，请从右侧创建
        </div>
        </a-card>
      </a-col>
      <a-col :span="14">
      <div class="rightCard">
         <a-card class="card2" v-if="treeData.length===0">
          <div class="title">新增</div>
          <div class="content">
            <div class="left">
              <div>
                角色管理
                <a-icon class="rightIcon" type="right" />
              </div>
            </div>
            <div class="right">
              <div
                class="r1 inputItem"
                v-for="(item, index) in inputArr2"
                :key="index"
              >
                <a-input
                  v-model="item.roleName"
                  style="width:216px"
                  placeholder="角色名称"
                ></a-input>
                <a-input
                  v-model="item.listOrder"
                  style="width:216px"
                  placeholder="排序"
                ></a-input>

                <a-icon
                  type="minus-circle"
                  @click="remove2(index)"
                  class="close"
                />
              </div>
              <div class="addArea" @click="add2">+ <span>添加</span></div>
              <a-button type="primary" @click="save">保存</a-button>
            </div>
          </div>
        </a-card>
          <a-card class="card2" v-if="createShow && treeData.length>0">
          <div class="title">创建分支</div>
          <div class="content">
            <div class="left">
              <div>
                角色管理
                <a-icon class="rightIcon" type="right" />
              </div>
              <div class="t1" v-for="(item, index) in titleArr" :key="index">
                {{ item }}
                <a-icon class="rightIcon" type="right" />
              </div>
            </div>
            <div class="right">
              <div>
                <div
                  class="r2"
                  v-show="itemInfo"
                  v-for="(item, index) in itemInfo.children"
                  :key="index"
                >
                  <a-input
                    v-model="item.roleName"
                    style="width:216px"
                    placeholder="角色名称"
                  ></a-input>
                  <a-input
                    v-model="item.listOrder"
                    style="width:216px"
                    placeholder="排序"
                  ></a-input>
                  <a-icon
                    type="minus-circle"
                    class="close"
                    @click="removeMe(item.id, index)"
                  />
                </div>
              </div>
              <div
                class="r1 inputItem"
                v-for="(item, index) in inputArr"
                :key="index"
              >
                <a-input
                  v-model="item.menuText"
                  style="width:216px"
                  placeholder="角色名称"
                ></a-input>
                <a-input
                  v-model="item.listOrder"
                  style="width:216px"
                  placeholder="排序"
                ></a-input>

                <a-icon
                  type="minus-circle"
                  @click="remove(index)"
                  class="close"
                />
              </div>
              <div class="addArea" @click="add">+ <span>添加</span></div>
              <a-button type="primary" @click="save">保存</a-button>
            </div>
          </div>
        </a-card>
           <a-card class="card2" v-if="editShow && treeData.length>0">
          <div class="title">编辑</div>
          <div class="content">
            <div class="left">
              <div>
                角色管理
               <a-icon type="minus-circle" style="padding:0 15px" />
              </div>
              <div class="t1" v-for="(item, index) in titleArr2" :key="index">
                {{ item }}
                <a-icon type="minus-circle" style="paddingLeft:15px" />
              </div>
            </div>
            <div class="right">
              <div>
                <div
                  class="r2"
                  v-show="itemInfo"
                  v-for="(item, index) in itemInfo2.children"
                  :key="index"
                >
                  <a-input
                    v-model="item.roleName"
                    style="width:216px"
                    placeholder="角色名称"
                  ></a-input>
                  <a-input
                    v-model="item.listOrder"
                    style="width:216px"
                    placeholder="排序"
                  ></a-input>
                  <a-icon
                    type="minus-circle"
                    class="close"
                    @click="removeMe(item.id, index)"
                  />
                </div>
              </div>
              <div
                class="r1 inputItem"
                v-for="(item, index) in inputArr"
                :key="index"
              >
                <a-input
                  v-model="item.menuText"
                  style="width:216px"
                  placeholder="角色名称"
                ></a-input>
                <a-input
                  v-model="item.listOrder"
                  style="width:216px"
                  placeholder="排序"
                ></a-input>

                <a-icon
                  type="minus-circle"
                  @click="remove(index)"
                  class="close"
                />
              </div>
              <div class="addArea" @click="add">+ <span>添加</span></div>
              <a-button type="primary" @click="save">保存</a-button>
            </div>
          </div>
        </a-card>
        <a-card v-if="permissionShow && treeData.length>0">
          <a-tree
            v-model="checkedKeys"
            checkable
            :expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            :selected-keys="selectedKeys"
            :tree-data="treeData2"
            @expand="onExpand"
            @select="onSelect"
          />
        </a-card>
      </div>
      </a-col>
    </a-row>
    <!-- <editModel ref="editModel"></editModel>
    <delModel ref="delModel"></delModel>
    <addModel ref="addModel"></addModel> -->
  </div>
</template>

<script>
// import editModel from './editModel'
// import delModel from './delModel'
// import addModel from './addModel'
import { toGetRoles } from '@/api/permissionManage.js'

let arr = []
// 递归获取标题
function getParentTitle (parent2) {
  if (parent2.dataRef.roleName) {
    arr.unshift(parent2.dataRef.roleName)
  }
  // console.log('parent2.dataRef.title', parent2.dataRef.title)
  const parent = parent2.$parent
  // console.log('parent', parent)
  // console.log('parent.dataRef', parent.dataRef)
  if (parent.dataRef) {
    getParentTitle(parent)
  }
  return arr
}

const inputArr = []

export default {
  components: {
    // editModel,
    // delModel,
    // addModel
  },
  data () {
    return {
      treeData: [], // 权限菜单列表
      inputArr, // 右侧 空输入框结构数据
      itemInfo: {}, // 右侧 创建分支的菜单数据
      titleArr: [], // 题目标题
      createShow: false, // 是否显示创建分支面板
      idArr: [], // 权限id数组
      parentId: 0,
      expandedKeys: ['0-0-0', '0-0-1'],
      autoExpandParent: true,
      checkedKeys: ['0-0-0'],
      selectedKeys: [],
      treeData2: [
        {
          title: '0-0',
          key: '0-0',
          children: [
            {
              title: '0-0-0',
              key: '0-0-0',
              children: [
                { title: '0-0-0-0', key: '0-0-0-0' },
                { title: '0-0-0-1', key: '0-0-0-1' },
                { title: '0-0-0-2', key: '0-0-0-2' }
              ]
            },
            {
              title: '0-0-1',
              key: '0-0-1',
              children: [
                { title: '0-0-1-0', key: '0-0-1-0' },
                { title: '0-0-1-1', key: '0-0-1-1' },
                { title: '0-0-1-2', key: '0-0-1-2' }
              ]
            },
            {
              title: '0-0-2',
              key: '0-0-2'
            }
          ]
        },
        {
          title: '0-1',
          key: '0-1',
          children: [
            { title: '0-1-0-0', key: '0-1-0-0' },
            { title: '0-1-0-1', key: '0-1-0-1' },
            { title: '0-1-0-2', key: '0-1-0-2' }
          ]
        },
        {
          title: '0-2',
          key: '0-2'
        }
      ], // 权限列表
      permissionShow: false, // 是否显示权限面板
      inputArr2: [],
      editShow: false, // 是否显示编辑面板
      type: '', // 区分编辑 还是  创建分支
      titleArr2: [], // 题目标题
      itemInfo2: {} // 编辑菜单的数据
    }
  },
  watch: {
    checkedKeys (val) {
      console.log('onCheck', val)
    }
  },
  methods: {
    // 添加初始化输入框
    add2 () {
      this.inputArr2.push({
        id: Math.random() * 999,
        parentId: '',
        roleName: '',
        listOrder: ''
      })
    },
    // 删除初始化输入框
    remove2 (index) {
      this.inputArr2.splice(index, 1)
    },
    onExpand (expandedKeys) {
      console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck (checkedKeys) {
      console.log('onCheck', checkedKeys)
      this.checkedKeys = checkedKeys
    },
    onSelect (selectedKeys, info) {
      console.log('onSelect', info)
      this.selectedKeys = selectedKeys
    },
    // 显示权限列表
    showPermiasion () {
      this.createShow = false
      this.permissionShow = true
      this.editShow = false
    },
    // 新增权限菜单
    newAdd () {
      this.$refs.addModel.isShow = true
    },
    // 批量编辑权限菜单
    async save () {
      if (this.parentId === 0) {
        let menus = this.itemInfo.children.map(item => {
          return {
            id: item.id,
            parentId: item.parent_id,
            menuText: item.menu_text,
            limitsPath: item.limits_path,
            icon: item.icon,
            listOrder: item.list_order,
            display: item.display
          }
        })
        const arr = this.inputArr.filter(item => {
          return item.menuText !== ''
        })
        arr.forEach(item => {
          item.parentId = menus[0].parentId
          item.id = 0
        })
        menus = [...menus, ...arr]
        // await updateBatchMenu({
        //   menus: menus
        // })
      } else {
        const arr = this.inputArr.filter(item => {
          return item.menuText !== ''
        })
        arr.forEach(item => {
          item.parentId = this.parentId
          item.id = 0
        })
        // await updateBatchMenu({
        //   menus: arr
        // })
      }
      if (this.idArr.length > 0) {
        // await removeBatchMenu({ ids: this.idArr })
      }
      this.getData()
      this.itemInfo = {}
      // 清空右侧输入框数组
      this.inputArr = []
      // for (let i = 0; i < 5; i++) {
      //   this.inputArr.push({
      //     id: '',
      //     parentId: '',
      //     roleName: '',
      //     listOrder: ''
      //   })
      // }
      this.createShow = false
    },
    // 获取权限菜单数据
    async getData () {
      const res = await toGetRoles()
      this.treeData = res.data
      console.log('权限菜单列表', res)
    },
    // 设置标题
    selectInfo (selectedKeys, info) {
      console.log('设置标题', info)
      // 创建分支 的 设置标题
      if (this.type === 'create') {
        let arr2 = []
        if (info.node.$parent.dataRef) {
          arr2 = getParentTitle(info.node.$parent)
        }
        // console.log(info.node.dataRef.title)
        arr2.push(info.node.dataRef.roleName)
        this.titleArr = arr2
        arr2 = []
        arr = []
      } else {
        this.titleArr2 = []
        // 顶级角色
        if (info.node.dataRef.parentId === '0') {
          const arr = this.treeData.map(item => {
            return {
              allots: item.allots,
              companyId: item.companyId,
              content: item.content,
              id: item.id,
              listOrder: item.listOrder,
              parentId: item.parentId,
              roleName: item.roleName
            }
          })
          this.itemInfo2 = {
            children: arr
          }
        } else {
          let arr3 = []
          if (info.node.$parent.dataRef) {
            arr3 = getParentTitle(info.node.$parent)
            // console.log('arr3', arr3)
            this.titleArr2 = new Set(arr3)
            const arr4 = info.node.$parent.dataRef.children.map(item => {
              return {
                allots: item.allots,
                companyId: item.companyId,
                content: item.content,
                id: item.id,
                listOrder: item.listOrder,
                parentId: item.parentId,
                roleName: item.roleName
              }
            })
            this.itemInfo2 = {
              children: arr4
            }
          }
        }
      }
      // console.log(this.titleArr)
    },
    // 删除节点
    del (id) {
      this.$refs.delModel.isShow = true
      this.$refs.delModel.id = id
      this.$refs.delModel.itemInfo = this.itemInfo
    },
    // 编辑
    edit (item, type) {
      this.type = type
      console.log('编辑', item)
      this.editShow = true
      this.createShow = false
      this.permissionShow = false
      if (item.dataRef.parentId === '0') {

      } else {

      }
    },
    // 添加输入框
    add () {
      this.inputArr.push({
        id: '',
        parentId: '',
        roleName: '',
        listOrder: ''
      })
    },
    // 删除输入框
    remove (index) {
      this.inputArr.splice(index, 1)
    },
    // 批量删除菜单
    removeMe (id, index) {
      console.log(id)
      this.idArr.push(id)
      this.itemInfo.children.splice(index, 1)
    },
    // 选择菜单
    selectItem (item, type) {
      this.type = type
      console.log('右侧数据', item)
      // 显示右边结构
      this.createShow = true
      this.permissionShow = false
      this.editShow = false
      this.itemInfo = {}
      // 清空右侧输入框数组
      this.inputArr = []
      // for (let i = 0; i < 5; i++) {
      //   this.inputArr.push({
      //     id: '',
      //     parentId: '',
      //     roleName: '',
      //     listOrder: ''
      //   })
      // }
      if (item.children) {
        this.itemInfo = JSON.parse(JSON.stringify(item))
      } else {
        this.parentId = item.id
        let obj = {}
        obj = {
          ...JSON.parse(JSON.stringify(item.dataRef))
        }
        const arr = []
        arr.push(obj)
        this.itemInfo = { children: arr }
        // this.itemInfo.children.forEach(item => {
        //   item.display = +item.display
        // })
      }
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style lang="less" scoped>
.roleManage {
  .newAdd {
    margin-left: 20px;
    width: 100px;
    text-align: left;
  }
  .icon {
    margin: 0 5px;
    font-size: 16px;
  }
  .content {
    line-height: 30px;
    padding: 24px;
    .left {
      display: flex;
      align-items: center;
      .rightIcon {
        margin: 0 10px;
      }
    }
    .right {
      input {
        margin-right: 10px;
      }
      margin-top: 30px;
      .close {
        font-size: 18px;
        color: #c5c5c5;
      }
      .r1 {
        margin-bottom: 20px;
        // .plus {
        //   margin: 0 10px;
        //   font-size: 18px;
        // }
      }
      .r2 {
        margin-bottom: 20px;
        .close {
          font-size: 18px;
          // margin-left: 37px;
        }
      }
      button {
        margin-right: 10px;
        margin-top: 32px;
      }
      .addArea {
        width: 440px;
        height: 32px;
        border-radius: 4px;
        border: 2px dashed #eeeeee;
        text-align: center;
        line-height: 28px;
        cursor: pointer;
      }
    }
  }
  .card2 {
    /deep/ .ant-card-body {
      padding: 0;
    }
    .title {
      padding-left: 24px;
      height: 55px;
      line-height: 55px;
      border-bottom-width: 1px;
      border-bottom-style: solid;
      border-bottom-color: rgba(233, 233, 233, 1);
      font-weight: 650;
      font-style: normal;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.847058823529412);
    }
  }
}
</style>
