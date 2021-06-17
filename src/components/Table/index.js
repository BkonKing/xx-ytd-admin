import T from 'ant-design-vue/es/table/Table'
import get from 'lodash.get'

export default {
  data () {
    return {
      needTotalList: [],

      selectedRows: [],
      selectedRowKeys: [],

      localLoading: false,
      localDataSource: [],
      // localPagination: this.pagination
      localPagination: Object.assign({
        defaultCurrent: 1, // 默认当前页数
        defaultPageSize: this.pageInfo ? this.pageInfo.defaultPageSize : 10, // 默认当前页显示数据的大小
        total: 0, // 总数，必须先有
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: this.pageInfo ? this.pageInfo.pageSizeOptions : ['10', '20', '30', '50'],
        showTotal: (total) => {
          console.log('total', total, this.localPagination, this.pageSize)
          let pageTotal = 0
          if (total % this.localPagination.defaultPageSize > 0) {
            pageTotal = parseInt(total / this.localPagination.defaultPageSize) + 1
          } else {
            pageTotal = parseInt(total / this.localPagination.defaultPageSize)
          }
          return '共 ' + total + ' 条记录 第 ' + this.localPagination.defaultCurrent + ' / ' + pageTotal + ' 页'
        },
        // 改变每页数量时更新显示
        onShowSizeChange: (current, pageSize) => {
          this.localPagination.defaultCurrent = current
          this.localPagination.defaultPageSize = pageSize
        },
        // 页面改变
        onChange: (current, size) => {
          this.localPagination.defaultCurrent = current
          this.localPagination.defaultPageSize = size
        }
      }, this.pagination)
    }
  },
  props: Object.assign({}, T.props, {
    rowKey: {
      type: [String, Function],
      default: 'key'
    },
    data: {
      type: Function,
      required: true
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pagesize: {
      type: Number,
      default: 10
    },
    showSizeChanger: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'default'
    },
    /**
     * alert: {
     *   show: true,
     *   clear: Function
     * }
     */
    alert: {
      type: [Object, Boolean],
      default: null
    },
    rowSelection: {
      type: Object,
      default: null
    },
    /** @Deprecated */
    showAlertInfo: {
      type: Boolean,
      default: false
    },
    showPagination: {
      type: String | Boolean,
      default: 'auto'
    },
    /**
     * enable page URI mode
     *
     * e.g:
     * /users/1
     * /users/2
     * /users/3?queryParam=test
     * ...
     */
    pageURI: {
      type: Boolean,
      default: false
    },
    pageInfo: {
      type: Object,
      default: null
    }
  }),
  watch: {
    'localPagination.current' (val) {
      this.pageURI && this.$router.push({
        ...this.$route,
        name: this.$route.name,
        params: Object.assign({}, this.$route.params, {
          pageindex: val
        })
      })
      // change pagination, reset total data
      this.needTotalList = this.initTotalList(this.columns)
      this.selectedRowKeys = []
      this.selectedRows = []
    },
    pageNum (val) {
      Object.assign(this.localPagination, {
        current: val
      })
    },
    pagesize (val) {
      Object.assign(this.localPagination, {
        pagesize: val
      })
    },
    showSizeChanger (val) {
      Object.assign(this.localPagination, {
        showSizeChanger: val
      })
    }
  },
  mounted () {
    const { pageindex } = this.$route.params
    const localPageNum = this.pageURI && (pageindex && parseInt(pageindex)) || this.pageNum
    this.localPagination = ['auto', true].includes(this.showPagination) && Object.assign({}, this.localPagination, {
      current: localPageNum,
      pagesize: this.pagesize,
      showSizeChanger: this.showSizeChanger
    }) || false
    this.needTotalList = this.initTotalList(this.columns)
    console.log('this.localPagination', this.pagination)
    this.loadData()
  },
  methods: {
    /**
     * 表格重新加载方法
     * 如果参数为 true, 则强制刷新到第一页
     * @param Boolean bool
     */
    refresh (bool = false) {
      // bool && (this.localPagination = Object.assign({}, {
      //   current: 1, pagesize: this.pagesize
      // }))
      bool && (this.localPagination = Object.assign({}, this.localPagination, {
        current: 1, pagesize: this.pagesize, defaultCurrent: 1, defaultPageSize: this.pagesize
      }))
      // console.log(this.localPagination)
      this.loadData()
    },
    /**
     * 加载数据方法
     * @param {Object} pagination 分页选项器
     * @param {Object} filters 过滤条件
     * @param {Object} sorter 排序条件
     */
    loadData (pagination, filters, sorter) {
      this.localLoading = true
      const parameter = Object.assign({
        pageindex: (pagination && pagination.current) ||
          this.showPagination && this.localPagination.current || this.pageNum,
        pagesize: (pagination && pagination.pageSize) ||
          this.showPagination && this.localPagination.pageSize || this.pagesize
      },
      (sorter && sorter.field && {
        sortField: sorter.field
      }) || {},
      (sorter && sorter.order && {
        sortOrder: sorter.order
      }) || {}, {
        ...filters
      }
      )
      const result = this.data(parameter)
      console.log(result)
      // 对接自己的通用数据接口需要修改下方代码中的 r.pageindex, r.total, r.data
      // eslint-disable-next-line
      if ((typeof result === 'object' || typeof result === 'function') && typeof result.then === 'function') {
        result.then(({ data: r }) => {
          if (r.records && r.records.length > 0) {
            this.localPagination = (this.showPagination === true || (this.showPagination && r.pageindex)) && Object.assign({}, this.localPagination, {
              current: parseInt(r.current), // 返回结果中的当前分页数
              total: parseInt(r.total), // 返回结果中的总记录数
              showSizeChanger: this.showSizeChanger,
              pagesize: parseInt((pagination && pagination.pageSize) ||
              this.localPagination.pagesize)
            }) || false
            // 为防止删除数据后导致页面当前页面数据长度为 0 ,自动翻页到上一页
            if (r.records.length === 0 && this.showPagination && this.localPagination.current > 1) {
              this.localPagination.current--
              this.loadData()
              return
            }

            // 这里用于判断接口是否有返回 r.total 且 this.showPagination = true 且 pageindex 和 pagesize 存在 且 total 小于等于 pageindex * pagesize 的大小
            // 当情况满足时，表示数据不满足分页大小，关闭 table 分页功能
            try {
              if ((['auto', true].includes(this.showPagination) && r.total <= (r.pageindex * this.localPagination.pagesize))) {
                this.localPagination.hideOnSinglePage = true
              }
            } catch (e) {
              this.localPagination = false
            }
            this.localDataSource = r.records // 返回结果中的数组数据
          } else {
            this.localPagination = Object.assign({}, {
              total: 0
            })
            this.localDataSource = [] // 返回结果中的数组数据
          }
          this.localLoading = false
        })
      }
    },
    initTotalList (columns) {
      const totalList = []
      columns && columns instanceof Array && columns.forEach(column => {
        if (column.needTotal) {
          totalList.push({
            ...column,
            total: 0
          })
        }
      })
      return totalList
    },
    /**
     * 用于更新已选中的列表数据 total 统计
     * @param selectedRowKeys
     * @param selectedRows
     */
    updateSelect (selectedRowKeys, selectedRows) {
      this.selectedRows = selectedRows
      this.selectedRowKeys = selectedRowKeys
      const list = this.needTotalList
      this.needTotalList = list.map(item => {
        return {
          ...item,
          total: selectedRows.reduce((sum, val) => {
            const total = sum + parseInt(get(val, item.dataIndex))
            return isNaN(total) ? 0 : total
          }, 0)
        }
      })
    },
    /**
     * 清空 table 已选中项
     */
    clearSelected () {
      if (this.rowSelection) {
        this.rowSelection.onChange([], [])
        this.updateSelect([], [])
      }
    },
    /**
     * 处理交给 table 使用者去处理 clear 事件时，内部选中统计同时调用
     * @param callback
     * @returns {*}
     */
    renderClear (callback) {
      if (this.selectedRowKeys.length <= 0) return null
      return (
        <a onClick={() => {
          callback()
          this.clearSelected()
        }}>清空</a>
      )
    },
    renderAlert () {
      // console.log(this.alert)
      // 绘制统计列数据 totalTitle统计字段文字描述
      const needTotalItems = this.needTotalList.map((item) => {
        return (<span style="margin-right: 12px">
          {this.alert.totalTitle || item.title}总计 <span style="font-weight: 600; color: #000">{this.alert.totalUnit || ''}{!item.customRender ? item.total : item.customRender(item.total)}</span>
        </span>)
      })

      // 绘制 清空 按钮
      const clearItem = (typeof this.alert.clear === 'boolean' && this.alert.clear) ? (
        this.renderClear(this.clearSelected)
      ) : (this.alert !== null && typeof this.alert.clear === 'function') ? (
        this.renderClear(this.alert.clear)
      ) : null

      // 绘制 alert 组件
      if (this.selectedRows.length) {
        return (
          <a-alert showIcon={true} style="margin-bottom: 16px">
            <template slot="message">
              <span style="margin-right: 12px">已选择: <a style="font-weight: 600">{this.selectedRows.length} </a>项</span>
              {needTotalItems}
              {clearItem}
            </template>
          </a-alert>
        )
      } else {
        return ''
      }
    }
  },

  render () {
    const props = {}
    const localKeys = Object.keys(this.$data)
    const showAlert = (typeof this.alert === 'object' && this.alert !== null && this.alert.show) && typeof this.rowSelection.selectedRowKeys !== 'undefined' || this.alert

    Object.keys(T.props).forEach(k => {
      const localKey = `local${k.substring(0, 1).toUpperCase()}${k.substring(1)}`
      if (localKeys.includes(localKey)) {
        props[k] = this[localKey]
        return props[k]
      }
      if (k === 'rowSelection') {
        if (showAlert && this.rowSelection) {
          // 如果需要使用alert，则重新绑定 rowSelection 事件
          props[k] = {
            ...this.rowSelection,
            selectedRows: this.selectedRows,
            selectedRowKeys: this.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              this.updateSelect(selectedRowKeys, selectedRows)
              typeof this[k].onChange !== 'undefined' && this[k].onChange(selectedRowKeys, selectedRows)
            }
          }
          return props[k]
        } else if (!this.rowSelection) {
          // 如果没打算开启 rowSelection 则清空默认的选择项
          props[k] = null
          return props[k]
        }
      }
      this[k] && (props[k] = this[k])
      return props[k]
    })
    const table = (
      <a-table {...{ props, scopedSlots: { ...this.$scopedSlots } }} onChange={this.loadData} onExpand={ (expanded, record) => { this.$emit('expand', expanded, record) } }>
        { Object.keys(this.$slots).map(name => (<template slot={name}>{this.$slots[name]}</template>)) }
      </a-table>
    )

    return (
      <div class="table-wrapper">
        { showAlert ? this.renderAlert() : null }
        { table }
      </div>
    )
  }
}
