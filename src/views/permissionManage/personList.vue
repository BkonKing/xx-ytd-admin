<template>
  <div class="personList">
    <a-card class="card">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline">
          <a-row :gutter="36">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="角色">
                <a-select placeholder="请选择">
                  <a-select-option value="1">
                    提问
                  </a-select-option>
                  <a-select-option value="2">
                    回复
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="人员">
                <a-input placeholder="姓名、手机号"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <div class="btns">
                <a-button type="primary">查询</a-button>
                <a-button>重置</a-button>
              </div>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <a-card class="card2">
      <a-button type="primary" @click="add">新增人员</a-button>
     <div class="table">
        <a-table :columns="columns" rowKey="id" :data-source="tableData" :pagination='false'>
          <template #opera>
            <div class="opera">
              <a-button type="link">权限</a-button>
              <a-button type="link" >编辑</a-button>
              <a-button type="link">删除</a-button>
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
  </div>
</template>

<script>
import { toGetAdminList } from '@/api/permissionManage'
import addForm from './modules/addForm'
export default {
  components: {
    addForm
  },
  data () {
    return {
      tableData: [],
      columns: [
        {
          title: '人员姓名',
          dataIndex: 'realName',
          key: 'realName',
          width: '14.22222222%'
        },
        {
          title: '登录账号 ',
          dataIndex: 'account',
          key: 'account',
          width: '14.22222222%'
        },
        {
          title: '角色',
          dataIndex: 'roleName',
          key: 'roleName',
          width: '14.22222222%'

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
          width: '14.22222222%'
        },
        {
          title: '最后登录',
          dataIndex: 'loginTime',
          key: 'loginTime',
          width: '14.22222222%'
        },
        {
          title: '操作',
          dataIndex: 'opera',
          key: 'opera',
          scopedSlots: { customRender: 'opera' },
          width: '14.22222222%'
        }
      ],
      pagination: {
        // 任务流水列表页码
        sizes: ['1', '5', '10', '15'], // 页容量
        currentPage: 1, // 默认页
        total: 50, // 总数
        pageSize: 10 // 默认页容量
      }
    }
  },
  methods: {
    add () {
      this.$dialog(addForm,
        // component props
        {
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
          title: '新增人员',
          width: 700,
          centered: true,
          maskClosable: false
        })
    },
    // 获取人员列表
    async  getData () {
      const res = await toGetAdminList({
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
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
  }
}
</script>

<style lang="less" scoped>
.personList {
  .card {
    .btns {
      text-align: right;
      button {
        margin-right: 10px;
      }
    }
  }
  .card2{
    margin-top: 20px;
    .table{
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
  }
}
</style>
