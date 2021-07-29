<template>
  <page-header-wrapper class="permissMenu">
    <a-row :gutter="24">
      <a-col :span="10">
        <a-card>
          <div v-if="treeData.length > 0">
            <a-tree
              class="draggable-tree"
              :tree-data="treeData"
              @select="selectInfo"
            >
              <template slot="custom" slot-scope="item">
                {{ item.categoryNo }} {{ item.categoryName }}

                <a-icon
                  v-if="permissions.UpdatePermission"
                  class="icon"
                  type="edit"
                  @click="edit(item)"
                />
                <a-icon
                  v-if="permissions.UpdatePermission"
                  class="icon"
                  type="apartment"
                  @click="selectItem(item)"
                />
                <a-icon
                  v-if="permissions.RemovePermission"
                  class="icon"
                  type="delete"
                  @click="del(item.id)"
                />
              </template>
            </a-tree>
          </div>
          <div v-else>
            当前还没有物料，请从右侧创建
          </div>
        </a-card>
      </a-col>
      <a-col :span="14">
        <a-card class="card2" v-if="showInit && permissions.UpdatePermission">
          <div class="title">新增</div>
          <div class="content">
            <div class="left">
              <div>
                物料类型
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
                  v-model="item.categoryNo"
                  style="width:120px"
                  placeholder="编码"
                ></a-input>
                <a-input
                  v-model="item.categoryName"
                  style="width:120px"
                  placeholder="名称"
                ></a-input>
                <a-select
                   v-model="item.unit"
                    mode="tags"
                    style="width: 350px"
                    :token-separators="[',']"

                  >
                    <a-select-option
                      v-for="(item,index) in selectList"
                      :key="item.id+''"
                      :disabled='index===0'

                    >
                      {{item.dw}}
                    </a-select-option>
                  </a-select>
                <a-input
                  v-model="item.listOrder"
                  style="width:120px"
                  placeholder="排序"
                ></a-input>

                <a-icon
                  type="minus-circle"
                  class="close"
                  @click="remove3(index)"
                />
              </div>
              <div class="addArea" @click="add3">+ <span>添加</span></div>
              <a-button type="primary" :disabled="initBol" @click="initSave"
                >保存</a-button
              >
            </div>
          </div>
        </a-card>
        <a-card v-if="rightShow" class="card3">
          <div class="title">
            创建分支
          </div>
          <div class="content">
            <div class="left">
              <div>
                物料类型
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
                    v-model="item.categoryNo"
                    style="width:120px"
                    placeholder="编码"
                  ></a-input>
                  <a-input
                    v-model="item.categoryName"
                    style="width:120px"
                    placeholder="名称"
                  ></a-input>
                  <a-select
                   v-model="item.unit"
                    mode="tags"
                    style="width: 350px"
                    :token-separators="[',']"

                  >
                    <a-select-option
                      v-for="(item,index) in selectList"
                      :key="item.id+''"
                      :disabled='index===0'

                    >
                      {{item.dw}}
                    </a-select-option>
                  </a-select>
                  <a-input
                    v-model="item.listOrder"
                    style="width:120px"
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
                  v-model="item.categoryNo"
                  style="width:120px"
                  placeholder="编码"
                ></a-input>
                <a-input
                  v-model="item.categoryName"
                  style="width:120px"
                  placeholder="名称"
                ></a-input>
                <a-select
                   v-model="item.unit"
                    mode="tags"
                    style="width: 350px"
                    :token-separators="[',']"

                  >
                    <a-select-option
                      v-for="(item,index) in selectList"
                      :key="item.id+''"
                      :disabled='index===0'

                    >
                      {{item.dw}}
                    </a-select-option>
                  </a-select>
                <a-input
                  v-model="item.listOrder"
                  style="width:120px"
                  placeholder="排序"
                ></a-input>

                <a-icon
                  type="minus-circle"
                  class="close"
                  @click="remove(index)"
                />
              </div>
              <div class="addArea" @click="add">+ <span>添加</span></div>
              <a-button type="primary" :disabled="createBol" @click="save"
                >保存</a-button
              >
            </div>
          </div>
        </a-card>
        <a-card class="card2" v-if="editShow && treeData.length > 0">
          <div class="title">编辑</div>
          <div class="content">
            <div class="left">
              <div>
                物料设置
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
                  v-show="itemInfo"
                  v-for="(item, index) in itemInfo2.children"
                  :key="index"
                >
                  <a-input
                    v-model="item.categoryNo"
                    style="width:120px"
                    placeholder="编码"
                  ></a-input>
                  <a-input
                    v-model="item.categoryName"
                    style="width:120px"
                    placeholder="名称"
                  ></a-input>
                  <a-select
                   v-model="item.unit"
                    mode="tags"
                    style="width: 350px"
                    :token-separators="[',']"

                  >
                    <a-select-option
                      v-for="(item,index) in selectList"
                      :key="item.id+''"
                      :disabled='index===0'

                    >
                      {{item.dw}}
                    </a-select-option>
                  </a-select>
                  <a-input
                    v-model="item.listOrder"
                    style="width:120px"
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
                  v-model="item.categoryNo"
                  style="width:120px"
                  placeholder="编码"
                ></a-input>
                <a-input
                  v-model="item.categoryName"
                  style="width:120px"
                  placeholder="名称"
                ></a-input>
               <a-select
                   v-model="item.unit"
                    mode="tags"
                    style="width: 350px"
                    :token-separators="[',']"

                  >
                    <a-select-option
                      v-for="(item,index) in selectList"
                      :key="item.id+''"
                      :disabled='index===0'

                    >
                      {{item.dw}}
                    </a-select-option>
                  </a-select>
                <a-input
                  v-model="item.listOrder"
                  style="width:120px"
                  placeholder="排序"
                ></a-input>
                <a-icon
                  type="minus-circle"
                  class="close"
                  @click="remove2(index)"
                />
              </div>
              <div class="addArea" @click="add2">+ <span>添加</span></div>
              <a-button type="primary" :disabled="editBol" @click="saveEditData"
                >保存</a-button
              >
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </page-header-wrapper>
</template>

<script>
import {
  toMaterial,
  toUpdateBatchMaterial,
  toRemoveMaterial,
  toRemoveBatchMaterial
} from '@/api/basicSet'
let arr = []
// 递归获取标题
function getParentTitle (parent2) {
  if (parent2.dataRef.categoryName) {
    arr.unshift(parent2.dataRef.categoryName)
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

export default {
  data () {
    return {
      treeData: [], // 权限菜单列表
      inputArr: [], // 右侧 空输入框结构数据
      itemInfo: {}, // 右侧 编辑的菜单数据
      titleArr: [], // 题目标题
      rightShow: false,
      idArr: [], // 权限id数组
      parentId: 0,
      editShow: false,
      titleArr2: [],
      itemInfo2: {},
      inputArr2: [],
      editBol: true,
      type: '', // 区分编辑 还是  创建分支
      idArr2: [],
      createBol: true,
      inputArr3: [],
      initBol: true,
      showInit: true,
      selectList: [{ id: Math.random() * 999, dw: '可输入单个词，结尾加enter键自动创建一个单位' }]
    }
  },
  watch: {
    inputArr2: {
      handler () {
        this.editBol = false
      },
      deep: true
    },
    inputArr3: {
      handler () {
        this.initBol = false
      },
      deep: true
    },
    itemInfo2: {
      handler () {
        this.editBol = false
      },
      deep: true
    },
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
    }
  },

  methods: {
    // 创建初始角色
    async initSave () {
      const arr = this.inputArr3.map(item => {
        let id = item.id
        let parentId = item.parentId
        if (!parentId) {
          id = 0
          parentId = 0
        }
        return {
          id,
          categoryNo: item.categoryNo,
          categoryName: item.categoryName,
          unit: item.unit,
          listOrder: item.listOrder,
          parentId
        }
      }).filter(item => item.categoryName && item.categoryNo)
      if (!arr || arr.length === 0) {
        this.$message.warning('请输入物料信息')
        return
      }
      const res = await toUpdateBatchMaterial({ category: arr })
      this.getData()
      this.$nextTick(() => {
        this.initBol = true
      })
      this.$message.success(res.message)
    },
    // 添加 初始化输入框
    add3 () {
      this.inputArr3.push({
        id: Math.random() * 999,
        parentId: '',
        categoryName: '',
        categoryNo: '',
        listOrder: '',
        unit: []
      })
    },
    // 删除初始角色数据
    remove3 (index) {
      this.inputArr3.splice(index, 1)
    },
    // 批量编辑权限菜单
    async saveEditData () {
      if (this.idArr2.length > 0) {
        await toRemoveBatchMaterial({ ids: this.idArr2 })
        this.idArr2 = []
        this.getData()
      }
      let menus = this.itemInfo2.children.map(item => {
        return {
          id: item.id,
          parentId: item.parentId,
          categoryNo: item.categoryNo,
          categoryName: item.categoryName,
          unit: item.unit,
          listOrder: item.listOrder
        }
      })
      console.log('第一个', menus)
      const arr = this.inputArr2.filter(item => {
        return item.categoryName && item.categoryNo
      })
      arr.forEach(item => {
        item.parentId = menus[0].parentId
        item.id = 0
      })
      menus = [...menus, ...arr]
      const res = await toUpdateBatchMaterial({
        category: menus
      })
      if (res.code === 200) {
        this.itemInfo2.children = res.data
        this.inputArr2 = []
        this.idArr = []
      }
      this.$message.success(res.message)
      this.getData()

      this.editBol = false
    },
    // 添加 编辑初始化输入框
    add2 () {
      console.log('add2')
      this.inputArr2.push({
        id: Math.random() * 999,
        parentId: '',
        categoryName: '',
        categoryNo: '',
        listOrder: '',
        unit: []
      })
    },
    // 删除初始化输入框
    remove2 (index) {
      this.inputArr2.splice(index, 1)
    },
    // 批量 编辑删除菜单
    removeMe2 (id, index) {
      // console.log('批量 编辑删除菜单', id)
      this.idArr2.push(id)
      this.itemInfo2.children.splice(index, 1)
    },
    // 新增权限菜单
    newAdd () {
      this.$refs.addModel.isShow = true
    },
    // 批量创建分支权限菜单
    async save () {
      if (this.idArr.length > 0) {
        await toRemoveBatchMaterial({ ids: this.idArr })
      }

      if (this.parentId === 0) {
        // console.log('执行了11')
        let menus = this.itemInfo.children.map(item => {
          return {
            parentId: item.parentId,
            id: item.id,
            categoryNo: item.categoryNo,
            categoryName: item.categoryName,
            unit: item.unit,
            listOrder: item.listOrder
          }
        })
        const arr = this.inputArr.filter(item => {
          return item.categoryName && item.categoryNo
        })
        arr.forEach(item => {
          item.parentId = menus[0].parentId
          item.id = 0
        })
        menus = [...menus, ...arr]
        if (menus.length > 0) {
          const res = await toUpdateBatchMaterial({
            category: menus
          })
          if (res.code === 200) {
            this.itemInfo.children = res.data
            this.inputArr = []
            this.idArr = []
          }
          this.$message.info(res.message)
        }
      } else {
        // console.log('执行了22')
        let menus = []
        if (this.itemInfo.children) {
          menus = this.itemInfo.children.map(item => {
            return {
              parentId: item.parentId,
              id: item.id,
              categoryNo: item.categoryNo,
              categoryName: item.categoryName,
              unit: item.unit,
              listOrder: item.listOrder
            }
          })
        }
        const arr = this.inputArr.filter(item => {
          return item.categoryName && item.categoryNo
        })
        arr.forEach(item => {
          item.parentId = this.parentId
          item.id = 0
        })
        menus = [...menus, ...arr]
        if (menus.length > 0) {
          const res = await toUpdateBatchMaterial({
            category: menus
          })
          if (res.code === 200) {
            this.$set(this.itemInfo, 'children', res.data)
            this.inputArr = []
            this.idArr = []
          }
          this.$message.info(res.message)
        }
      }

      this.getData()

      this.$nextTick(() => {
        this.createBol = true
      })
    },
    // 获取材料分类数据
    async getData () {
      const res = await toMaterial()
      this.treeData = res.data
      console.log('材料分类列表', res)
    },
    // 设置标题
    selectInfo (selectedKeys, info) {
      console.log('info', info)
      // 设置创建分支的标题
      if (this.type === 'create') {
        let arr2 = []
        if (info.node.$parent.dataRef) {
          arr2 = getParentTitle(info.node.$parent)
        }
        // console.log(info.node.dataRef.title)
        arr2.push(info.node.dataRef.categoryName)
        this.titleArr = arr2
        arr2 = []
        arr = []
        this.$nextTick(() => {
          this.createBol = true
        })
      } else {
        // 设置编辑同级的标题
        if (info.node.dataRef.parentId === '0') {
          const arr = this.treeData.map(item => {
            return {
              id: item.id,
              parentId: item.parentId,
              categoryNo: item.categoryNo,
              categoryName: item.categoryName,
              unit: item.unit ? item.unit : [],
              listOrder: item.listOrder
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
                id: item.id,
                parentId: item.parentId,
                categoryNo: item.categoryNo,
                categoryName: item.categoryName,
                unit: item.unit ? item.unit : [],
                listOrder: item.listOrder
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
      // console.log(this.titleArr)
    },
    // 删除节点
    del (id) {
      this.$confirm({
        title: '删除模块',
        icon: h => <a-icon theme="filled" type="exclamation-circle" />,
        content: h => (
          <div>
            <span style="color:red;">该模块及其子模块都会被删除</span>
            ，确定删除吗
          </div>
        ),
        onOk: () => {
          toRemoveMaterial({ id: id }).then(() => {
            this.$message.success('删除成功')
            this.inputArr3 = []
            this.getData()
          })
        },
        onCancel () {
          console.log('Cancel')
        },
        class: 'test'
      })
    },
    // 编辑
    edit (item) {
      this.parentId = item.dataRef.parentId
      this.type = 'edit'
      this.editShow = true
      this.showInit = false
      this.rightShow = false
    },
    // 添加创建分支输入框
    add () {
      this.inputArr.push({
        id: Math.random() * 999,
        parentId: '',
        categoryName: '',
        categoryNo: '',
        listOrder: '',
        unit: []
      })
    },
    // 删除创建分支输入框
    remove (index) {
      this.inputArr.splice(index, 1)
    },
    // 批量删除 创建分支菜单
    removeMe (id, index) {
      this.idArr.push(id)
      this.itemInfo.children.splice(index, 1)
    },
    // 选择菜单
    selectItem (item) {
      // 显示右边结构
      this.rightShow = true
      this.editShow = false
      this.showInit = false
      this.type = 'create'
      this.itemInfo = {}
      // 清空右侧输入框数组
      this.inputArr = []

      if (item.children) {
        this.parentId = item.id
        this.itemInfo = JSON.parse(JSON.stringify(item))
        // this.itemInfo.children.forEach(item => {
        //   item.display = +item.display
        // })
        this.$nextTick(() => {
          this.createBol = true
        })
      } else {
        this.parentId = item.id
        // let obj = {}
        // obj = {
        //   ...JSON.parse(JSON.stringify(item.dataRef))
        // }
        // const arr = []
        // arr.push(obj)
        // this.itemInfo = { children: arr }
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
.permissMenu {
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
    .left {
      display: flex;
      align-items: center;
      .rightIcon {
        margin: 0 10px;
      }
    }
  }
  .right {
    margin-top: 30px;
    .close {
      font-size: 18px;
    }
    .r1 {
      margin-bottom: 10px;
      .plus {
        margin: 0 10px;
        font-size: 18px;
      }
    }
    .r2 {
      margin-bottom: 10px;
      .close {
        font-size: 18px;
      }
    }
    button {
      margin-right: 10px;
    }
  }
  .addArea {
    width: 544px;
    height: 32px;
    border-radius: 4px;
    border: 2px dashed #eeeeee;
    text-align: center;
    line-height: 28px;
    cursor: pointer;
  }
  .card3 {
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
    input {
      margin-right: 10px;
    }
    button {
      margin-top: 20px;
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
    input {
      margin-right: 10px;
    }
    button {
      margin-top: 20px;
    }
  }
  .content {
    padding: 24px;
  }
}
</style>
