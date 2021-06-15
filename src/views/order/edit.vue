<template>
  <page-header-wrapper>
    <a-card title="基本信息" style="margin-top: 24px;">
      <a-form-model
        :model="form"
        :rules="rules"
        :label-col="{ lg: { span: 7 }, sm: { span: 7 } }"
        :wrapper-col="{ lg: { span: 10 }, sm: { span: 17 } }"
      >
        <a-form-model-item required label="关联合同">
          <a-select v-model="form.region" placeholder="请选择">
            <a-select-option value="shanghai">
              Zone one
            </a-select-option>
            <a-select-option value="beijing">
              Zone two
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="Activity form">
          <a-input v-model="form.desc" type="textarea" />
        </a-form-model-item>
      </a-form-model>
    </a-card>
    <a-card title="材料信息" style="margin-top: 24px;">
      <a-table
        :columns="columns"
        :dataSource="tableData"
        :pagination="false"
        :loading="memberLoading"
      >
        <template slot="name" slot-scope="text, record">
          <a-select
            :value="text"
            @change="e => handleChange(e.target.value, record.key, record.key)"
          >
            <a-select-option value="1">
              Lucy
            </a-select-option>
          </a-select>
        </template>
        <template slot="workId" slot-scope="text, record">
          <a-input
            :key="record.key"
            style="margin: -5px 0"
            :value="text"
            placeholder="columns[i].title"
            @change="e => handleChange(e.target.value, record.key, record.key)"
          />
        </template>
        <template slot="department" slot-scope="text, record">
          <a-input
            :key="record.key"
            style="margin: -5px 0"
            :value="text"
            placeholder="columns[i].title"
            @change="e => handleChange(e.target.value, record.key, record.key)"
          />
        </template>
        <template slot="number" slot-scope="text, record">
          <a-input
            :key="record.key"
            style="margin: -5px 0"
            :value="text"
            placeholder="columns[i].title"
            @change="e => handleChange(e.target.value, record.key, record.key)"
          />
        </template>
        <template slot="sort" slot-scope="text, record">
          <a-input
            :key="record.key"
            style="margin: -5px 0"
            :value="text"
            placeholder="columns[i].title"
            @change="e => handleChange(e.target.value, record.key, record.key)"
          />
        </template>
        <template slot="operation" slot-scope="text, record">
          <template v-if="record.editable">
            <span>
              <a-popconfirm
                title="是否要删除此行？"
                @confirm="remove(record.key)"
              >
                <a>删除</a>
              </a-popconfirm>
            </span>
          </template>
          <span v-else>
            <a-popconfirm
              title="是否要删除此行？"
              @confirm="remove(record.key)"
            >
              <a>删除</a>
            </a-popconfirm>
          </span>
        </template>
      </a-table>
      <div>总计   100   ￥10,000.00</div>
      <a-button
        style="width: 100%; margin-top: 16px; margin-bottom: 8px"
        type="dashed"
        icon="plus"
        @click="newMember"
        >新增成员</a-button
      >
    </a-card>
    <footer-tool-bar :is-mobile="isMobile" :collapsed="sideCollapsed">
      <!-- <span class="popover-wrapper">
        <a-popover
          title="表单校验信息"
          overlayClassName="antd-pro-pages-forms-style-errorPopover"
          trigger="click"
          :getPopupContainer="trigger => trigger.parentNode"
        >
          <template slot="content">
            <li
              v-for="item in errors"
              :key="item.key"
              @click="scrollToField(item.key)"
              class="antd-pro-pages-forms-style-errorListItem"
            >
              <a-icon
                type="cross-circle-o"
                class="antd-pro-pages-forms-style-errorIcon"
              />
              <div class="">{{ item.message }}</div>
              <div class="antd-pro-pages-forms-style-errorField">
                {{ item.fieldLabel }}
              </div>
            </li>
          </template>
          <span
            class="antd-pro-pages-forms-style-errorIcon"
            v-if="errors.length > 0"
          >
            <a-icon type="exclamation-circle" />{{ errors.length }}
          </span>
        </a-popover>
      </span> -->
      <a-button type="primary" @click="validate" :loading="loading"
        >提交</a-button
      >
    </footer-tool-bar>
  </page-header-wrapper>
</template>

<script>
import FooterToolBar from '@/components/FooterToolbar'
import { appMixin } from '@/store/mixin'
export default {
  name: '',
  mixins: [appMixin],
  components: {
    FooterToolBar
  },
  data () {
    return {
      form: {
        region: '',
        desc: ''
      },
      rules: {
        region: [{ required: true, message: '必填' }]
      },
      memberLoading: false,
      loading: false,
      // table
      columns: [
        {
          title: '材料',
          dataIndex: 'name',
          key: 'name',
          width: '20%',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '规格型号',
          dataIndex: 'workId',
          key: 'workId',
          width: '20%',
          scopedSlots: { customRender: 'workId' }
        },
        {
          title: '采购单价（元）',
          dataIndex: 'department',
          key: 'department',
          width: '10%',
          scopedSlots: { customRender: 'department' }
        },
        {
          title: '数量',
          dataIndex: 'number',
          key: 'number',
          width: '15%',
          scopedSlots: { customRender: 'number' }
        },
        {
          title: '金额',
          dataIndex: 'money',
          key: 'money',
          width: '10%'
        },
        {
          title: '排序',
          dataIndex: 'sort',
          key: 'sort',
          width: '10%',
          scopedSlots: { customRender: 'sort' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      tableData: [
        {
          key: '1',
          name: '1',
          workId: '001',
          editable: false,
          money: 1,
          number: 1,
          sort: 1,
          department: '行政部'
        },
        {
          key: '2',
          name: '1',
          workId: '002',
          editable: false,
          money: 2,
          number: 2,
          sort: 2,
          department: 'IT部'
        },
        {
          key: '3',
          name: '1',
          workId: '003',
          editable: false,
          money: 3,
          number: 3,
          sort: 3,
          department: '财务部'
        }
      ]
    }
  },
  methods: {
    validate () {},
    newMember () {
      const length = this.tableData.length
      this.tableData.push({
        key:
          length === 0
            ? '1'
            : (parseInt(this.tableData[length - 1].key) + 1).toString(),
        name: '1',
        workId: '001',
        editable: false,
        money: 1,
        number: 1,
        sort: 1,
        department: '行政部'
      })
    },
    handleChange (value, key, column) {
      console.log(value, key)
      const newData = [...this.tableData]
      const target = newData.find(item => key === item.key)
      if (target) {
        target[column] = value
        this.tableData = newData
      }
    },
    remove (key) {
      const newData = this.tableData.filter(item => item.key !== key)
      this.tableData = newData
    }
  }
}
</script>

<style></style>
