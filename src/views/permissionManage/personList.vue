<template>
  <div class="personList">
    <a-card class="card">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline">
          <a-row :gutter="36">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="角色">
                <a-tree-select
                  v-model="roleId"
                  style="width: 100%"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  :tree-data="treeData"
                  placeholder="请选择"
                  :replaceFields="{ key: 'id', value: 'id', title: 'roleName' }"
                  tree-default-expand-all
                >
                  <span slot="title" slot-scope="{ title }" style="color: #08c">
                    {{ title }}
                  </span>
                </a-tree-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="人员">
                <a-input
                  v-model="searchText"
                  placeholder="姓名、手机号"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <div class="btns">
                <a-button type="primary" @click="search">查询</a-button>
                <a-button @click="reset">重置</a-button>
              </div>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <a-card class="card2">
      <a-button type="primary" @click="add" v-if="+permissions.CreatePermission===1">新增人员</a-button>
      <div class="table">
        <a-table
          :columns="columns"
          rowKey="id"
          :data-source="tableData"
          :pagination="false"
        >
          <template slot="opera" slot-scope="text, record">
            <div class="opera">
              <a-button type="link" @click="openEditPermiss(record)"
                v-if="+permissions.AllotsPermission===1">权限</a-button
              >
              <a-button type="link" @click="edit(record)" v-if="+permissions.UpdatePermission===1">编辑</a-button>
              <a-button type="link" @click="delPerson(record)" v-if="+permissions.RemovePermission===1">删除</a-button>
            </div>
          </template>
        </a-table>
      </div>
      <div class="pagination">
        <!-- :default-current="pagination.currentPage" -->
        <a-pagination
          v-model="pagination.currentPage"
          show-quick-jumper
          show-size-changer
          :page-size-options="pagination.sizes"
          :total="pagination.total"
          :page-size.sync="pagination.pageSize"
          :show-total="
            (total, range) =>
              `共 ${total} 条记录 第${pagination.currentPage}/${Math.ceil(
                total / pagination.pageSize
              )}页`
          "
          @change="onChange"
          @showSizeChange="sizeChange"
        />
      </div>
    </a-card>
    <permissModal ref="permissModal"></permissModal>
  </div>
</template>

<script>
import { toGetAdminList, toRemoveAdmin, toGetRoles } from '@/api/permissionManage'
import addForm from './modules/addForm'
import permissModal from './modules/permissModal.vue'
import bus from '@/utils/bus'
export default {
  components: {
    // addForm,
    permissModal
  },
  data () {
    return {
      tableData: [],
      treeData: [],
      columns: [
        {
          title: '人员姓名',
          dataIndex: 'realName',
          key: 'realName',
          width: '10%'
        },
        {
          title: '登录账号 ',
          dataIndex: 'account',
          key: 'account',
          width: '10%'
        },
        {
          title: '角色',
          dataIndex: 'roleName',
          key: 'roleName',
          width: '16%'
        },
        {
          title: '手机号',
          dataIndex: 'mobile',
          key: 'mobile',
          width: '14.22222222%'
        },
        {
          title: '添加时间',
          dataIndex: 'ctime',
          key: 'ctime',
          width: '16%'
        },
        {
          title: '最后登录',
          dataIndex: 'loginTime',
          key: 'loginTime',
          width: '20%'

        },
        {
          title: '操作',
          dataIndex: 'opera',
          key: 'opera',
          scopedSlots: { customRender: 'opera' },
          width: '14.22222222%'
          // align: 'right'
        }
      ],
      pagination: {
        // 任务流水列表页码
        sizes: ['1', '5', '10', '15'], // 页容量
        currentPage: 1, // 默认页
        total: 50, // 总数
        pageSize: 10 // 默认页容量
      },
      roleId: '', // 角色id
      searchText: '', // 姓名、手机号关键字
      allRole: []
    }
  },
  mounted () {
    bus.$on('refresh', value => {
      if (value === 'add') {
        this.pagination.currentPage = 1
        this.getData()
      } else {
        this.getData()
      }
    })
  },
  methods: {
    // 获取角色
    async getRole () {
      const res = await toGetRoles()
      this.treeData = res.data
      console.log('获取角色', res)
    },
    // 编辑权限
    openEditPermiss (record) {
      console.log(record)
      this.$refs.permissModal.isShow = true
      // this.$refs.permissModal.roleId = record.roleId
      this.$refs.permissModal.id = record.id
    },
    // 重置
    reset () {
      this.pagination.currentPage = 1
      this.roleId = ''
      this.searchText = ''
      this.pagination.pageSize = 10
      this.getData()
    },
    // 搜索
    search () {
      this.pagination.currentPage = 1
      this.getData()
    },
    // 编辑
    edit (item) {
      const record = JSON.parse(JSON.stringify(item))

      this.$dialog(
        addForm,
        // component props
        {
          mode: 'edit',
          record,
          on: {
            ok () {
              console.log('ok 回调')
            },
            cancel () {
              console.log('cancel 回调')
            },
            close () {
              console.log('modal close 回调')
            }
          }
        },
        // modal props
        {
          title: '编辑人员',
          width: 700,
          centered: true,
          maskClosable: false
        }
      )
    },
    // 删除人员
    delPerson (item) {
      const self = this
      console.log('删除id', item.id)
      this.$confirm({
        title: '删除人员',
        icon: h => <a-icon theme="filled" type="exclamation-circle" />,
        content: () => `确定删除"${item.realName}"吗`,
        onOk: () => {
          toRemoveAdmin({ id: item.id }).then(() => {
            self.$message.success('删除成功')

            self.getData()
          })
        },
        onCancel () {
          console.log('Cancel')
        },
        class: 'test'
      })
    },
    // 新增人员
    add () {
      this.$dialog(
        addForm,
        // component props
        {
          mode: 'add',
          on: {
            ok () {
              // console.log('ok 回调')
              console.log('执行了ok')
            },
            cancel () {
              console.log('cancel 回调')
            },
            close () {
              console.log('modal close 回调')
            }
          }
        },
        // modal props
        {
          title: '新增人员',
          width: 700,
          centered: true,
          maskClosable: false
        }
      )
    },
    // 获取人员列表
    async getData () {
      const res = await toGetAdminList({
        roleId: this.roleId,
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        searchText: this.searchText
      })
      this.tableData = res.data.records
      this.pagination.total = +res.data.total
      console.log('人员列表', res)
    },
    // 任务流水页码改变事件
    onChange (page, size) {
      // console.log('Page: ', page)
      this.pagination.currentPage = page
      this.getData()
    },
    // 任务流水页容量改变事件
    sizeChange (current, size) {
      // console.log('size: ', size)
      this.pagination.currentPage = 1
      this.pagination.pageSize = size
      this.getData()
    }
  },
  created () {
    this.getData()
    this.getRole()
  }
}
</script>

<style lang="less" scoped>
.personList {
  .card {
   /deep/ .ant-card-body{
      padding: 24px 24px 4px 24px;
    }
    .btns {
      text-align: right;
      button {
        margin-right: 10px;
      }
    }
  }
  .card2 {
    margin-top: 20px;
    .table {
      margin-top: 16px;
    }
    .pagination {
      margin-top: 10px;
      /deep/ .ant-pagination {
        padding-top: 10px;
        padding-bottom: 20px;
        text-align: right;
      }
      /deep/ .ant-pagination-total-text {
        float: left;
        // margin-left: 20px;
        // margin-right: 300px;
      }
    }
    .opera{
      button{
        padding-left: 0;
      }
    }
  }
}
</style>
