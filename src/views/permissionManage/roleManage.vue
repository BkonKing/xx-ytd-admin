<template>
  <div class="roleManage">
    <a-row :gutter="24">
      <a-col :span="10">
        <a-card>
          <!-- <a-button type="danger" ghost class="newAdd" @click="newAdd"
            >+新增</a-button
          > -->
          <div v-if="treeData.length > 0">
            <a-tree
              class="draggable-tree"
              :tree-data="treeData"
              @select="selectInfo"
            >
              <template slot="custom" slot-scope="item">
                {{ item.roleName }}
                <a-icon
                  class="icon"
                  type="tool"
                  @click="showPermiasionMenu(item)"
                />
                <a-icon class="icon" type="edit" @click="edit(item, 'edit')" />
                <a-icon
                  class="icon"
                  type="apartment"
                  @click="selectItem(item, 'create')"
                />
                <a-icon class="icon" type="delete" @click="del(item.id)" />
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
          <a-card class="card2" v-if="treeData.length === 0">
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
                  v-for="(item, index) in inputArr3"
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
                    @click="remove3(index)"
                    class="close"
                  />
                </div>
                <div class="addArea" @click="add3">+ <span>添加</span></div>
                <a-button type="primary" @click="initSave">保存</a-button>
              </div>
            </div>
          </a-card>
          <a-card class="card2" v-if="createShow && treeData.length > 0">
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
                <div v-if="itemInfo.children.length > 0">
                  <div
                    class="r2"
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
                    @click="remove(index)"
                    class="close"
                  />
                </div>
                <div class="addArea" @click="add">+ <span>添加</span></div>
                <a-button type="primary" :disabled="createBol" @click="Createsave">保存</a-button>
              </div>
            </div>
          </a-card>
          <a-card class="card2" v-if="editShow && treeData.length > 0">
            <div class="title">编辑</div>
            <div class="content">
              <div class="left">
                <div>
                  角色管理
                  <a-icon type="right" style="padding:0 15px" />
                </div>
                <div class="t1" v-for="(item, index) in titleArr2" :key="index">
                  {{ item }}
                  <a-icon type="right" style="paddingLeft:15px" />
                </div>
              </div>
              <div class="right">
                <div>
                  <div
                    class="r2"
                    v-show="itemInfo2"
                    v-for="(item, index) in itemInfo2.children"
                    :key="index"
                  >
                    <a-input
                      :maxLength="10"
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
                      @click="removeMe2(item.id, index)"
                    />
                  </div>
                </div>
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
                <a-button type="primary" :disabled="editBol" @click="saveEditData">保存</a-button>
              </div>
            </div>
          </a-card>
          <a-card v-if="permissionShow && treeData.length > 0" class="card3">
            <div class="title">
              <div>
                权限
                <a-icon type="right" style="padding:0 15px" />
              </div>
              <div class="t1" v-for="(item, index) in titleArr2" :key="index">
                {{ item }}
                <a-icon type="right" style="paddingLeft:15px" />
              </div>
            </div>
            <div class="srcollBox">
              <a-tree
                v-model="checkedKeys"
                checkable
                v-if="roleMunes.length > 0"
                class="draggable-tree"
                :tree-data="roleMunes"
                :replaceFields="{ key: 'id' }"
                @select="onSelect"
                :default-expanded-keys="openArr"
                @check='onCheck'
              >
                <template slot="custom" slot-scope="item">
                  {{ item.menuText }}
                </template>
              </a-tree>
            </div>
            <div class="btn">
              <a-button type="primary" :disabled="selectMenuBol" @click="setRoleMenus">保存</a-button>
            </div>
          </a-card>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import {
  toGetRoles,
  toUpdateBatchRole,
  toRemoveBatchRole,
  toRemoveRole,
  toGetAllotsMenus,
  toUpdateAllotsMenus
} from '@/api/permissionManage.js'

let arr = []
// 递归获取标题
function getParentTitle (parent2) {
  if (parent2.dataRef.roleName) {
    arr.unshift(parent2.dataRef.roleName)
  }

  const parent = parent2.$parent

  if (parent.dataRef) {
    getParentTitle(parent)
  }
  return arr
}

export default {
  data () {
    return {
      treeData: [], // 权限菜单列表
      inputArr: [], // 创建分支 右侧 空输入框结构数据
      itemInfo: {}, // 新增右侧 创建分支的菜单数据
      titleArr: [], // 创建分支 题目标题
      createShow: false, // 是否显示创建分支面板
      idArr: [], // 编辑  权限id数组
      parentId: 0, // 父id
      roleMunes: [], // 角色菜单数组
      checkedKeys: [], // 选中的权限菜单
      openArr: [], // 展开的菜单节点
      roleId: '', // 角色id
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
      inputArr2: [], // 编辑新增输入框的数据
      editShow: false, // 是否显示编辑面板
      type: '', // 区分编辑 还是  创建分支
      titleArr2: [], // 编辑 题目标题
      itemInfo2: {}, // 编辑菜单的数据
      secondParentId: '', // 记录创建分支父级id
      idArr2: [], // 创建分支 权限id
      inputArr3: [], // 初始  新增角色数组
      arr3: [],
      createBol: true,
      editBol: true,
      selectMenuBol: true
    }
  },
  watch: {

    inputArr: {
      handler () {
        this.createBol = false
      },
      deep: true
    },
    itemInfo: {
      handler () {
        this.createBol = false
      },
      deep: true
    },
    inputArr2: {
      handler () {
        this.editBol = false
      },
      deep: true
    },
    itemInfo2: {
      handler () {
        this.editBol = false
      },
      deep: true
    },
    parentId () {
      this.itemInfo = {}
      this.inputArr2 = []
    }
  },
  methods: {
    onCheck (checkedKeys) {
      // console.log('onCheck', checkedKeys)
      this.selectMenuBol = false
      // this.checkedKeys = checkedKeys
    },
    // 创建初始角色
    async initSave () {
      const arr = this.inputArr3.map(item => {
        return {
          id: 0,
          parentId: 0,
          roleName: item.roleName,
          listOrder: item.listOrder
        }
      })
      const res = await toUpdateBatchRole({ roles: arr })
      this.$message.success(res.message)
    },
    // 删除初始角色数据
    remove3 (index) {
      this.inputArr3.splice(index, 1)
    },
    // 初始新增角色
    add3 () {
      this.inputArr3.push({
        id: Math.random() * 999,
        roleName: '',
        listOrder: ''
      })
    },
    // 配置角色对应的菜单
    async setRoleMenus () {
      const res = await toUpdateAllotsMenus({
        roleId: this.roleId,
        allots: this.checkedKeys.join(',')
      })
      this.getData()
      this.$message.success(res.message)
    },
    // 获取所有需要展开的id数组
    getOpenArr (arr) {
      arr.forEach(item => {
        if (item.state.opened === 1) {
          this.openArr.push(item.id)
        }
        if (item.state.selected === 1) {
          this.checkedKeys.push(item.id)
        }
        if (item.children) {
          this.getOpenArr(item.children)
        }
      })
    },
    // 选中节点时候触发
    onSelect (selectedKeys, info) {
      this.selectedKeys = selectedKeys
      this.$nextTick(() => {
        this.selectMenuBol = true
      })
    },
    // 显示角色对应的菜单
    showPermiasionMenu (item) {
      this.createShow = false
      this.permissionShow = true
      this.editShow = false
      this.roleId = item.id
      this.openArr = []
      this.type = 'edit'
      this.titleArr2 = []
      this.checkedKeys = []
      toGetAllotsMenus({ roleId: +item.id }).then(res => {
        this.roleMunes = res.data
        this.getOpenArr(this.roleMunes)
      })
    },
    // 删除节点
    del (id) {
      this.$confirm({
        title: '删除模块',
        icon: h => <a-icon theme="filled" type="exclamation-circle" />,
        content: h => (
          <div>
            <span style="color:red;">该模块及其子模块都会被删除</span>
            ，确定删除吗?
          </div>
        ),
        onOk: () => {
          toRemoveRole({ id: id }).then(res => {
            this.getData()
            this.$message.success('删除成功')
          })
        },
        onCancel () {
          console.log('Cancel')
        },
        class: 'test'
      })
    },
    // 选择菜单
    selectItem (item, type) {
      this.type = type
      this.secondParentId = item.id

      // 显示右边结构
      this.createShow = true
      this.permissionShow = false
      this.editShow = false
      // 清空右侧输入框数组
      this.itemInfo = { children: [] }
      this.inputArr = []

      if (item.children) {
        if (item.children.length > 0) {
          this.itemInfo = JSON.parse(JSON.stringify(item))
        }
      }
      this.$nextTick(() => {
        this.createBol = true
      })
      // else {
      //   this.parentId = item.id
      //   let obj = {}
      //   obj = {
      //     ...JSON.parse(JSON.stringify(item.dataRef))
      //   }
      //   const arr = []
      //   arr.push(obj)
      //   this.itemInfo = { children: arr }
      // this.itemInfo.children.forEach(item => {
      //   item.display = +item.display
      // })
      // }
    },
    // 创建分支的保存
    async Createsave () {
      this.createBol = true
      if (this.idArr2.length > 0) {
        await toRemoveBatchRole({ ids: this.idArr2 })
        this.idArr2 = []
        this.getData()
      }
      if (this.itemInfo.children.length > 0) {
        let menus = this.itemInfo.children.map(item => {
          return {
            id: item.id,
            parentId: item.parentId,
            roleName: item.roleName,
            listOrder: item.listOrder
          }
        })
        const arr = this.inputArr.filter(item => {
          return item.roleName !== ''
        })
        arr.forEach(item => {
          item.parentId = menus[0].parentId
          item.id = 0
        })
        menus = [...menus, ...arr]
        const res = await toUpdateBatchRole({
          roles: menus
        })
        if (res.code === 200) {
          this.itemInfo.children = res.data
          this.inputArr = []
          this.idArr = []
        }
        this.$message.success(res.message)
        this.getData()
      } else {
        const arr = this.inputArr.filter(item => {
          return item.roleName !== ''
        })
        arr.forEach(item => {
          item.parentId = this.secondParentId
          item.id = 0
        })
        const res = await toUpdateBatchRole({
          roles: arr
        })
        if (res.code === 200) {
          this.$set(this.itemInfo, 'children', res.data)
          this.inputArr = []
          this.idArr = []
        }
        this.$message.success(res.message)
        this.getData()
      }
    },
    // 删除创建分支
    removeMe (id, index) {
      this.idArr2.push(id)
      this.itemInfo.children.splice(index, 1)
    },
    // 创建分支 添加输入框
    add () {
      this.inputArr.push({
        id: Math.random() * 999,
        roleName: '',
        listOrder: ''
      })
    },
    remove (index) {
      this.inputArr.splice(index, 1)
    },

    // 新增权限菜单
    newAdd () {
      this.$refs.addModel.isShow = true
    },
    // 批量编辑权限菜单
    async saveEditData () {
      if (this.idArr.length > 0) {
        await toRemoveBatchRole({ ids: this.idArr })
        this.idArr = []
        this.getData()
      }
      // 顶级角色
      // if (this.parentId === 0) {
      let menus = this.itemInfo2.children.map(item => {
        return {
          id: item.id,
          parentId: item.parentId,
          roleName: item.roleName,
          listOrder: item.listOrder
        }
      })
      const arr = this.inputArr2.filter(item => {
        return item.roleName !== ''
      })
      arr.forEach(item => {
        item.parentId = menus[0].parentId
        item.id = 0
      })
      menus = [...menus, ...arr]
      const res = await toUpdateBatchRole({
        roles: menus
      })
      if (res.code === 200) {
        this.itemInfo2.children = res.data
        this.inputArr2 = []
        this.idArr2 = []
      }
      this.$message.success(res.message)
      this.getData()
    },
    // 获取权限菜单数据
    async getData () {
      const res = await toGetRoles()
      this.treeData = res.data
    },
    // 设置标题
    selectInfo (selectedKeys, info) {
      // 创建分支 的 设置标题
      if (this.type === 'create') {
        let arr2 = []
        if (info.node.$parent.dataRef) {
          arr2 = getParentTitle(info.node.$parent)
        }

        arr2.push(info.node.dataRef.roleName)
        this.titleArr = arr2
        arr2 = []
        arr = []
      } else {
        // 编辑权限的标题
        // this.titleArr2 = []
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
          this.$nextTick(() => {
            this.editBol = true
          })
        } else {
          // let arr3 = []
          this.arr3 = []
          // console.log('二级菜单')
          arr = []
          this.titleArr2 = []
          if (info.node.$parent.dataRef) {
            this.arr3 = getParentTitle(info.node.$parent)
            // console.log('二级菜单', this.arr3)
            this.titleArr2 = [...new Set(this.arr3)]
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
            this.$nextTick(() => {
              this.editBol = true
            })
          }
        }
      }
    },

    // 添加 编辑初始化输入框
    add2 () {
      this.inputArr2.push({
        id: Math.random() * 999,
        roleName: '',
        listOrder: ''
      })
    },
    // 删除初始化输入框
    remove2 (index) {
      this.inputArr2.splice(index, 1)
    },
    // 编辑
    edit (item, type) {
      this.type = type
      this.parentId = item.dataRef.parentId
      this.editShow = true
      this.createShow = false
      this.permissionShow = false
    },
    // 批量 编辑删除菜单
    removeMe2 (id, index) {
      this.idArr.push(id)
      this.itemInfo2.children.splice(index, 1)
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
  .card3 {
    /deep/ .ant-card-body{
      padding: 0;
    }
    // .left {
    //   display: flex;
    //   align-items: center;
    //   .rightIcon {
    //     margin: 0 10px;
    //   }
    // }
    .title{
      height: 55px;
      line-height: 55px;
      padding-left: 24px;
      border-bottom: 1px solid rgba(233, 233, 233, 1);
      display: flex;
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
    .btn {
      margin-bottom: 20px;
      margin-left: 24px;
      margin-top: 24px;
    }
    .srcollBox{
      width: 100%;
      height: 400px;
      overflow: auto;
    }
  }
}
</style>
