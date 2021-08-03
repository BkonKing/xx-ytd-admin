<template>
  <div class="permissMenu">
    <a-row :gutter="24">
      <a-col :span="8">
        <a-card>
          <div v-if="treeData.length > 0">
            <a-tree
              class="draggable-tree"
              :tree-data="treeData"
              @select="selectInfo"
            >
              <template slot="custom" slot-scope="item">
                {{ item.categoryName }}

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
            当前还没有合同类型，请从右侧创建
          </div>
        </a-card>
      </a-col>
      <a-col :span="16">
        <a-card v-if="permissions.UpdatePermission" class="card3">
          <div class="title">
            {{ parentId === 0 ? "新增" : "编辑" }}
          </div>
          <div class="content">
            <div class="left">
              <div>
                合同类型
                <a-icon class="rightIcon" type="right" />
              </div>
              <div class="t1" v-for="(item, index) in titleArr" :key="index">
                {{ item }}
                <a-icon class="rightIcon" type="right" />
              </div>
            </div>
            <div class="right">
              <div
                class="r1 inputItem"
                v-for="(item, index) in inputArr"
                :key="index"
              >
                <a-input
                  v-model="item.categoryName"
                  style="width:216px"
                  placeholder="名称"
                ></a-input>
                <a-input
                  v-model="item.listOrder"
                  style="width:216px"
                  placeholder="排序"
                  v-number-input.int
                  @blur="changeSort"
                ></a-input>
                <a-icon
                  type="minus-circle"
                  class="close"
                  @click="removeMe(item.id, index)"
                />
              </div>
              <div class="addArea" @click="add">+ <span>添加</span></div>
              <a-button type="primary" :disabled="createBol" @click="save"
                >保存</a-button
              >
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import {
  toContract,
  toUpdateBatchContract,
  toRemoveContract,
  toRemoveBatchContract
} from '@/api/basicSet'
import clonedeep from 'lodash.clonedeep'

export default {
  data () {
    return {
      treeData: [], // 权限菜单列表
      inputArr: [], // 右侧 空输入框结构数据
      itemInfo: {}, // 右侧 编辑的菜单数据
      itemTitle: [], // 暂存标题数组
      titleArr: [], // 题目标题
      idArr: [], // 权限id数组
      parentId: 0,
      createBol: true
    }
  },
  watch: {
    inputArr: {
      handler () {
        this.createBol = false
      },
      deep: true
    }
  },

  methods: {
    // 获取合同分类数据
    async getData () {
      const res = await toContract()
      this.treeData = res.data
    },
    // 批量编辑权限菜单
    async save () {
      if (this.idArr.length > 0) {
        await toRemoveBatchContract({ ids: this.idArr })
        this.idArr = []
      }

      const arr = this.inputArr.filter(item => {
        return item.categoryName !== ''
      })

      arr.forEach(item => {
        item.parentId = item.parentId || this.parentId
      })

      if (arr.length > 0) {
        const res = await toUpdateBatchContract({
          category: arr
        })
        if (res.code === 200) {
          this.inputArr = res.data
          this.idArr = []
          this.$message.success(res.message)
        }
      } else {
        this.inputArr = []
      }

      this.getData()

      this.$nextTick(() => {
        this.createBol = true
      })
    },
    // 设置标题
    selectInfo (selectedKeys, info) {
      // 设置创建分支的标题
      let titleArr = []
      if (info.node.$parent.dataRef) {
        titleArr = this.getParentTitle(info.node.$parent)
      }
      this.itemTitle = titleArr
      // 设置编辑同级的标题
      if (info.node.dataRef.parentId === '0') {
        this.setItemInfo(this.treeData)
      } else {
        if (info.node.$parent.dataRef) {
          this.setItemInfo(info.node.$parent.dataRef.children)
        }
      }
    },
    // 递归获取标题
    getParentTitle (parent2) {
      const arr = []
      const parent = parent2.$parent
      if (parent.dataRef) {
        arr.push(...this.getParentTitle(parent))
      }
      if (parent2.dataRef.categoryName) {
        arr.push(parent2.dataRef.categoryName)
      }
      return arr
    },
    // 设置同级数据
    setItemInfo (data) {
      const arr = data.map(item => {
        return {
          id: item.id,
          parentId: item.parentId,
          categoryName: item.categoryName,
          listOrder: item.listOrder
        }
      })
      this.itemInfo = {
        children: arr
      }
      this.$nextTick(() => {
        this.createBol = true
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
            ，确定删除吗
          </div>
        ),
        onOk: () => {
          toRemoveContract({ id: id }).then(() => {
            this.inputArr = []
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
    // 编辑
    edit (item) {
      setTimeout(() => {
        this.parentId = item.dataRef.parentId
        this.inputArr = this.itemInfo.children
        this.titleArr = this.itemTitle
      }, 0)
    },
    // 编辑下一层
    selectItem (item) {
      setTimeout(() => {
        this.parentId = item.id
        this.inputArr = []
        this.titleArr = this.itemTitle
        this.titleArr.push(item.categoryName)

        if (item.children) {
          this.inputArr = clonedeep(item.children)
          this.$nextTick(() => {
            this.createBol = true
          })
        }
      }, 0)
    },
    // 排序失去焦点重新排序
    changeSort () {
      this.inputArr = this.inputArr.sort((el1, el2) => {
        return parseInt(el2.listOrder) - parseInt(el1.listOrder)
      })
    },
    // 添加创建分支输入框
    add () {
      this.inputArr.push({
        id: '',
        parentId: '',
        categoryName: '',
        listOrder: ''
      })
    },
    // 批量创建分支 删除菜单
    removeMe (id, index) {
      id && this.idArr.push(id)
      this.inputArr.splice(index, 1)
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style lang="less" scoped>
.permissMenu {
  margin-top: 24px;
  .icon {
    margin: 0 5px;
    font-size: 16px;
    color: #9E9E9E;
  }
  .content {
    padding: 24px;
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
      margin-top: 6.5px;
      font-size: 18px;
      color: #c5c5c5;
    }
    .r1 {
      margin-bottom: 10px;
    }
  }
  .addArea {
    width: 442px;
    height: 32px;
    border-radius: 4px;
    border: 1px dashed #d9d9d9;
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
      color: rgba(0, 0, 0, 0.85);
    }
    input {
      margin-right: 10px;
    }
    button {
      margin-top: 24px;
    }
  }
}
</style>
