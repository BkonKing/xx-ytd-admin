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
      <a-button type="primary">新增人员</a-button>
     <div class="table">
        <a-table :columns="columns" :data-source="tableData">
          <template #opera>
            <div class="opera">
              <a-button type="link">权限</a-button>
              <a-button type="link">编辑</a-button>
              <a-button type="link">删除</a-button>
            </div>
          </template>
      </a-table>
     </div>
    </a-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [
        {
          key: '1',
          name: 'John Brown',
          age: 32,
          address: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
          tags: ['nice', 'developer']
        },
        {
          key: '2',
          name: 'Jim Green',
          age: 42,
          address: 'London No. 2 Lake Park, London No. 2 Lake Park',
          tags: ['loser']
        },
        {
          key: '3',
          name: 'Joe Black',
          age: 32,
          address: 'Sidney No. 1 Lake Park, Sidney No. 1 Lake Park',
          tags: ['cool', 'teacher']
        }
      ],
      columns: [
        {
          title: '人员姓名',
          dataIndex: 'realNmae',
          key: 'realNmae',
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
          dataIndex: 'roleNmae',
          key: 'roleNmae',
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
      ]
    }
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
  }
}
</style>
